"use client";

import { useEffect, useMemo, useState } from "react";
import type { CadmusInput } from "@/lib/cadmus";
import styles from "./cadmus.module.css";

type Mode = "beginner" | "guided";
type ArtifactId = "spec" | "deck" | "prompt" | "prd";

type CadmusRun = {
  result: {
    spec_markdown: string;
    llm_prompt: string;
  };
  access_gate?: {
    unlocked?: boolean;
    limit: number | string;
    remaining: number | string;
    reset_at: string | null;
  } | null;
};

const STARTER_INTENT =
  "Create a local-first app that turns messy project notes into a buildable spec, a deck outline, and an AI build prompt.";

const INDUSTRIES = ["Technology", "Finance", "Healthcare", "Real estate", "Hospitality", "Energy", "Consumer"];
const PROJECT_TYPES = ["Web app", "Mobile app", "Internal tool", "AI agent", "Data product", "Deck / brief", "Workflow"];

const ARTIFACTS: Array<{ id: ArtifactId; label: string }> = [
  { id: "spec", label: "Full Spec" },
  { id: "deck", label: "Deck Outline" },
  { id: "prompt", label: "AI Build Prompt" },
  { id: "prd", label: "PRD" },
];

const GUIDED_FIELDS: Array<{ key: keyof CadmusInput; label: string; placeholder: string; area?: boolean }> = [
  { key: "role", label: "Acting role", placeholder: "a senior product architect" },
  { key: "audience", label: "Audience / context", placeholder: "founder, designer, and build agent" },
  {
    key: "done",
    label: "Done looks like",
    placeholder: "outputs a buildable spec\nmarks assumptions\nincludes testable acceptance criteria",
    area: true,
  },
  { key: "nonGoals", label: "Non-goals", placeholder: "no production secrets\nno unsupported claims", area: true },
  { key: "constraints", label: "Constraints", placeholder: "local-first\nplain English\nmobile responsive", area: true },
];

export default function CadmusTool() {
  const [mode, setMode] = useState<Mode>("beginner");
  const [input, setInput] = useState<CadmusInput>({ intent: STARTER_INTENT });
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [selected, setSelected] = useState<Record<ArtifactId, boolean>>({
    spec: true,
    deck: true,
    prompt: true,
    prd: true,
  });
  const [activeArtifact, setActiveArtifact] = useState<ArtifactId>("spec");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [run, setRun] = useState<CadmusRun | null>(null);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [status, setStatus] = useState("2 public runs per IP.");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("cadmus-unlock-password");
    if (stored) {
      setUnlockPassword(stored);
      setIsUnlocked(true);
      setStatus("Unlocked for this browser session.");
    }
  }, []);

  const preparedInput = useMemo(() => buildRequest(input, mode, industry, projectType, selected), [
    input,
    mode,
    industry,
    projectType,
    selected,
  ]);

  const artifacts = useMemo(() => {
    if (!run) return null;
    return {
      spec: run.result.spec_markdown,
      prompt: run.result.llm_prompt,
      deck: makeDeckOutline(preparedInput, industry, projectType),
      prd: makePrd(preparedInput, industry, projectType),
    } satisfies Record<ArtifactId, string>;
  }, [industry, preparedInput, projectType, run]);

  const selectedArtifacts = ARTIFACTS.filter((artifact) => selected[artifact.id]);
  const activeText = artifacts ? artifacts[activeArtifact] : "";
  const displayText = search.trim() && activeText ? filterLines(activeText, search.trim()) : activeText;
  const hasIntent = input.intent.trim().length > 0;

  const set = (key: keyof CadmusInput, value: string) => {
    setInput((previous) => ({ ...previous, [key]: value }));
    setRun(null);
    setError("");
  };

  const toggleArtifact = (id: ArtifactId) => {
    setSelected((previous) => {
      const enabledCount = Object.values(previous).filter(Boolean).length;
      if (previous[id] && enabledCount === 1) return previous;
      const next = { ...previous, [id]: !previous[id] };
      if (!next[activeArtifact]) {
        const fallback = ARTIFACTS.find((artifact) => next[artifact.id])?.id ?? "spec";
        setActiveArtifact(fallback);
      }
      return next;
    });
  };

  const copy = async () => {
    if (!displayText) return;
    try {
      await navigator.clipboard.writeText(displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  const download = () => {
    if (!displayText) return;
    const blob = new Blob([displayText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cadmus-${activeArtifact}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const runCadmus = async () => {
    if (!hasIntent || running) return;
    setRunning(true);
    setError("");
    try {
      const response = await fetch("/api/cadmus/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...preparedInput,
          unlockPassword: unlockPassword.trim() || undefined,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        setRun(null);
        setError(body.detail || body.error || "CADMUS refused this run.");
        if (body.requires_password) setStatus("Free runs spent. Enter the unlock password to keep going.");
        return;
      }
      setRun(body);
      setActiveArtifact(selectedArtifacts[0]?.id ?? "spec");
      if (body.access_gate?.unlocked) {
        if (unlockPassword.trim()) window.sessionStorage.setItem("cadmus-unlock-password", unlockPassword.trim());
        setIsUnlocked(true);
        setStatus("Unlocked. Future runs in this browser session are allowed.");
      } else {
        const remaining = body.access_gate?.remaining ?? 0;
        setStatus(`${remaining} public run${remaining === 1 ? "" : "s"} remaining for this IP.`);
      }
    } catch {
      setRun(null);
      setError("CADMUS run failed. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brandBlock}>
          <strong className={styles.brand}>CADMUS</strong>
          <span className={styles.activeTab}>New Project</span>
        </div>
        <div className={styles.topActions}>
          <label className={styles.searchBox}>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search current output..."
              aria-label="Search current output"
            />
          </label>
          <span className={styles.gatePill}>{isUnlocked ? "Unlocked" : "2-run gate"}</span>
        </div>
      </header>

      <section className={styles.workspace}>
        <div className={styles.heroRow}>
          <div>
            <h1>Create With CADMUS</h1>
            <p>Use Beginner Mode for a starter pack, or Guided Mode for the full spec interview.</p>
          </div>
          <div className={styles.modeSwitch} aria-label="CADMUS mode">
            <button type="button" className={mode === "beginner" ? styles.modeOn : ""} onClick={() => setMode("beginner")}>
              Beginner Mode
            </button>
            <button type="button" className={mode === "guided" ? styles.modeOn : ""} onClick={() => setMode("guided")}>
              Guided Mode
            </button>
          </div>
        </div>

        <div className={styles.workGrid}>
          <div className={styles.leftStack}>
            <section className={styles.panel} data-tour="input">
              <label className={styles.kicker} htmlFor="cadmus-intent">
                Raw idea
              </label>
              <p className={styles.panelCopy}>Dump the paragraph. CADMUS will infer structure, generate useful artifacts, and mark assumptions.</p>
              <textarea
                id="cadmus-intent"
                value={input.intent}
                onChange={(event) => set("intent", event.target.value)}
                className={styles.ideaBox}
                aria-label="Raw idea"
              />
              <div className={styles.charCount}>{input.intent.length.toLocaleString()} chars</div>
            </section>

            <div className={styles.selectRow}>
              <label className={styles.selectPanel}>
                <span className={styles.kicker}>Industry</span>
                <select value={industry} onChange={(event) => setIndustry(event.target.value)}>
                  {INDUSTRIES.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className={styles.selectPanel}>
                <span className={styles.kicker}>Project type</span>
                <select value={projectType} onChange={(event) => setProjectType(event.target.value)}>
                  {PROJECT_TYPES.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            {mode === "guided" ? (
              <section className={styles.guidedPanel}>
                {GUIDED_FIELDS.map((field) => (
                  <label key={field.key} className={styles.guidedField}>
                    <span className={styles.kicker}>{field.label}</span>
                    {field.area ? (
                      <textarea
                        value={input[field.key] ?? ""}
                        onChange={(event) => set(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                      />
                    ) : (
                      <input
                        value={input[field.key] ?? ""}
                        onChange={(event) => set(field.key, event.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </label>
                ))}
              </section>
            ) : null}
          </div>

          <aside className={styles.rightStack}>
            <section className={styles.panel} data-tour="outputs">
              <h2>Starter Pack Outputs</h2>
              <p className={styles.panelCopy}>Pick what CADMUS should generate from the paragraph.</p>
              <div className={styles.outputGrid}>
                {ARTIFACTS.map((artifact) => (
                  <button
                    key={artifact.id}
                    type="button"
                    className={selected[artifact.id] ? styles.outputOn : ""}
                    onClick={() => toggleArtifact(artifact.id)}
                    aria-pressed={selected[artifact.id]}
                  >
                    <span aria-hidden="true">{selected[artifact.id] ? "✓" : "+"}</span>
                    {artifact.label}
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.panel}>
              <h2>{mode === "beginner" ? "Beginner Mode" : "Guided Mode"}</h2>
              <p className={styles.panelCopy}>
                {mode === "beginner"
                  ? "Best for rough starts, first drafts, deck outlines, and AI build prompts. Assumptions are explicit."
                  : "Best when you know the audience, constraints, non-goals, and acceptance criteria already."}
              </p>
              <div className={styles.unlockRow}>
                <input
                  type="password"
                  value={unlockPassword}
                  onChange={(event) => setUnlockPassword(event.target.value)}
                  placeholder="Unlock password"
                  aria-label="Unlock password"
                />
              </div>
              <button type="button" className={styles.runButton} disabled={!hasIntent || running} onClick={runCadmus} data-tour="run">
                <span aria-hidden="true">✦</span>
                {running ? "Generating..." : mode === "beginner" ? "Generate Starter Pack" : "Generate Full Spec"}
              </button>
              <div className={styles.statusLine}>{error || status}</div>
            </section>

            <section className={`${styles.panel} ${styles.resultPanel}`} data-tour="output">
              <div className={styles.resultTop}>
                <h2>Output</h2>
                <div>
                  <button type="button" onClick={copy} disabled={!displayText}>
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button type="button" onClick={download} disabled={!displayText}>
                    Download
                  </button>
                </div>
              </div>

              {run && artifacts ? (
                <>
                  <div className={styles.artifactTabs}>
                    {selectedArtifacts.map((artifact) => (
                      <button
                        key={artifact.id}
                        type="button"
                        className={activeArtifact === artifact.id ? styles.artifactOn : ""}
                        onClick={() => setActiveArtifact(artifact.id)}
                      >
                        {artifact.label}
                      </button>
                    ))}
                  </div>
                  <pre>{displayText}</pre>
                </>
              ) : (
                <div className={styles.emptyState}>Run CADMUS to release the selected artifacts.</div>
              )}
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}

function buildRequest(
  input: CadmusInput,
  mode: Mode,
  industry: string,
  projectType: string,
  selected: Record<ArtifactId, boolean>,
): CadmusInput {
  const selectedLabels = ARTIFACTS.filter((artifact) => selected[artifact.id]).map((artifact) => artifact.label);
  const defaultRole = `a senior ${industry.toLowerCase()} product architect`;
  const defaultAudience = `${projectType.toLowerCase()} builders, stakeholders, and reviewers`;
  const modeConstraint =
    mode === "beginner"
      ? "Beginner Mode: infer missing structure, make assumptions explicit, and keep the starter pack buildable."
      : "Guided Mode: preserve the supplied constraints, non-goals, and acceptance criteria.";
  const constraints = [input.constraints, `Industry: ${industry}.`, `Project type: ${projectType}.`, modeConstraint]
    .filter(Boolean)
    .join("\n");

  return {
    ...input,
    role: input.role?.trim() || defaultRole,
    audience: input.audience?.trim() || defaultAudience,
    constraints,
    format: input.format?.trim() || selectedLabels.join(", "),
  };
}

function makeDeckOutline(input: CadmusInput, industry: string, projectType: string) {
  return [
    "# Deck Outline",
    "",
    "1. Title",
    `   - ${input.intent}`,
    "2. Problem",
    `   - The current idea is underspecified for ${industry.toLowerCase()} execution.`,
    "3. Proposed Product",
    `   - ${projectType} shaped from the supplied intent.`,
    "4. Core Workflow",
    "   - Capture intent.",
    "   - Convert intent into explicit requirements.",
    "   - Refuse unsupported scope.",
    "   - Release the build prompt.",
    "5. Guardrails",
    "   - Claims must be grounded in user-provided inputs.",
    "   - Assumptions must be labeled before build work begins.",
    "6. Acceptance Criteria",
    "   - The output is actionable by a builder.",
    "   - Non-goals are visible.",
    "   - Open questions are separated from decisions.",
  ].join("\n");
}

function makePrd(input: CadmusInput, industry: string, projectType: string) {
  return [
    "# Product Requirements Document",
    "",
    "## Objective",
    input.intent,
    "",
    "## Context",
    `Industry: ${industry}`,
    `Project type: ${projectType}`,
    `Audience: ${input.audience || "Builders, stakeholders, and reviewers"}`,
    "",
    "## Functional Requirements",
    "- Convert raw intent into an explicit objective.",
    "- Produce acceptance criteria that can be tested.",
    "- Mark non-goals and constraints before build starts.",
    "- Generate a prompt that refuses unsupported claims.",
    "",
    "## Non-Goals",
    input.nonGoals || "- Anything not grounded in the supplied intent.",
    "",
    "## Acceptance",
    input.done || "- A builder can begin work without guessing the core scope.",
    "",
    "## Open Questions",
    "- Which assumptions should be confirmed before production build?",
    "- Which user role owns final approval?",
  ].join("\n");
}

function filterLines(text: string, needle: string) {
  const q = needle.toLowerCase();
  const lines = text.split("\n");
  const hits = lines.filter((line) => line.toLowerCase().includes(q));
  return hits.length ? hits.join("\n") : "No matching lines in the current output.";
}
