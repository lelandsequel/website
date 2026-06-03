"use client";

import { useEffect, useState } from "react";
import type { CadmusInput } from "@/lib/cadmus";

const accent = "#6f38ff";

const S: Record<string, React.CSSProperties> = {
  wrap: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)", gap: "1.25rem", alignItems: "start" },
  panel: { background: "var(--bg-card)", border: "1px solid var(--bg-border)", borderRadius: 16, padding: "1.25rem", boxShadow: "var(--soft-shadow)" },
  label: { display: "block", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.35rem" },
  field: { marginBottom: "0.9rem" },
  input: { width: "100%", padding: "0.6rem 0.7rem", border: "1px solid var(--bg-border)", borderRadius: 10, background: "rgba(255,255,255,0.7)", color: "var(--text-primary)", fontSize: "0.9rem", fontFamily: "inherit" },
  out: { whiteSpace: "pre-wrap", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.78rem", lineHeight: 1.6, color: "var(--text-secondary)", margin: 0, maxHeight: "62vh", overflow: "auto" },
  tabRow: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.9rem", flexWrap: "wrap" },
  tab: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em", padding: "0.4rem 0.75rem", borderRadius: 999, border: "1px solid var(--bg-border)", background: "rgba(255,255,255,0.6)", color: "var(--text-secondary)", cursor: "pointer" },
  tabOn: { borderColor: accent, background: "var(--accent-dim)", color: accent },
  copy: { marginLeft: "auto", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.72rem", fontWeight: 800, padding: "0.4rem 0.85rem", borderRadius: 10, border: "none", background: accent, color: "#fff", cursor: "pointer" },
  gate: { marginTop: "0.85rem", padding: "0.8rem", borderRadius: 12, border: "1px solid var(--accent-border)", background: "rgba(111,56,255,0.06)", color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.55 },
};

const FIELDS: Array<{ key: keyof CadmusInput; label: string; placeholder: string; area?: boolean; required?: boolean }> = [
  { key: "intent", label: "What are you trying to do?", placeholder: "e.g. write a weekly status update for my team from these raw notes", area: true, required: true },
  { key: "role", label: "Who should the AI act as? (optional)", placeholder: "e.g. a concise engineering manager" },
  { key: "audience", label: "Who / what is it for? (optional)", placeholder: "e.g. my director, who skims" },
  { key: "done", label: "What does “done” look like? (one per line, optional)", placeholder: "covers blockers, decisions, next steps\nunder 200 words\nno fluff", area: true },
  { key: "nonGoals", label: "What's out of scope? (one per line, optional)", placeholder: "no individual blame\nno new commitments" },
  { key: "constraints", label: "Constraints? (one per line, optional)", placeholder: "plain language\nemail-ready" },
  { key: "format", label: "Output format? (optional)", placeholder: "e.g. 4 bullet points + a one-line summary" },
];

const EXAMPLE: CadmusInput = {
  intent: "Turn these messy meeting notes into a clear decision log",
  role: "a precise chief of staff",
  audience: "leadership, who need the decisions not the chatter",
  done: "lists each decision with its owner\nflags open questions separately\ncites where each came from",
  nonGoals: "summarizing small talk\nre-litigating settled debates",
  constraints: "plain language\nmarkdown",
  format: "a Decisions list and an Open Questions list",
};

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

export default function CadmusTool() {
  const [input, setInput] = useState<CadmusInput>({ intent: "" });
  const [view, setView] = useState<"prompt" | "spec">("prompt");
  const [copied, setCopied] = useState(false);
  const [run, setRun] = useState<CadmusRun | null>(null);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [status, setStatus] = useState("2 free runs per IP.");
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

  const text = run ? (view === "prompt" ? run.result.llm_prompt : run.result.spec_markdown) : "";
  const set = (key: keyof CadmusInput, value: string) => {
    setInput((p) => ({ ...p, [key]: value }));
    setRun(null);
    setError("");
  };

  const loadExample = () => {
    setInput(EXAMPLE);
    setRun(null);
    setError("");
  };

  const copy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  const hasIntent = input.intent.trim().length > 0;

  const runCadmus = async () => {
    if (!hasIntent || running) return;
    setRunning(true);
    setError("");
    try {
      const response = await fetch("/api/cadmus/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...input,
          unlockPassword: unlockPassword.trim() || undefined,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        setRun(null);
        setError(body.detail || body.error || "CADMUS refused this run.");
        if (body.requires_password) setStatus("Free runs spent. Enter the unlock password to keep running CADMUS.");
        return;
      }
      setRun(body);
      if (body.access_gate?.unlocked) {
        if (unlockPassword.trim()) window.sessionStorage.setItem("cadmus-unlock-password", unlockPassword.trim());
        setIsUnlocked(true);
        setStatus("Unlocked. Future runs in this browser session are allowed.");
      } else {
        setStatus(`${body.access_gate?.remaining ?? 0} free run${body.access_gate?.remaining === 1 ? "" : "s"} remaining for this IP.`);
      }
    } catch {
      setRun(null);
      setError("CADMUS run failed. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="cadmus-grid" style={S.wrap}>
      <div style={S.panel}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.9rem" }}>
          <span style={S.label}>Your intent</span>
          <button type="button" onClick={loadExample} style={{ ...S.tab, padding: "0.3rem 0.6rem" }}>
            Load example
          </button>
        </div>
        {FIELDS.map((f) => (
          <div key={f.key} style={S.field}>
            <label style={S.label} htmlFor={`cadmus-${f.key}`}>{f.label}</label>
            {f.area ? (
              <textarea id={`cadmus-${f.key}`} rows={f.key === "intent" ? 3 : 3} placeholder={f.placeholder}
                value={input[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}
                style={{ ...S.input, resize: "vertical", lineHeight: 1.5 }} />
            ) : (
              <input id={`cadmus-${f.key}`} type="text" placeholder={f.placeholder}
                value={input[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} style={S.input} />
            )}
          </div>
        ))}
        <div style={S.gate}>
          <strong style={{ color: "var(--text-primary)" }}>Access gate:</strong> {status}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.55rem", marginTop: "0.7rem" }}>
            <input
              type="password"
              placeholder="Unlock password"
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              style={S.input}
              aria-label="Unlock password"
            />
            <button type="button" onClick={runCadmus} disabled={!hasIntent || running} style={{ ...S.copy, marginLeft: 0, opacity: !hasIntent || running ? 0.55 : 1 }}>
              {running ? "Running..." : isUnlocked ? "Run unlocked" : "Run CADMUS"}
            </button>
          </div>
          {error ? <p style={{ margin: "0.65rem 0 0", color: "#b3261e" }}>{error}</p> : null}
        </div>
      </div>

      <div style={S.panel}>
        <div style={S.tabRow}>
          <button type="button" onClick={() => setView("prompt")} style={{ ...S.tab, ...(view === "prompt" ? S.tabOn : {}) }}>
            ⚡ LLM Prompt
          </button>
          <button type="button" onClick={() => setView("spec")} style={{ ...S.tab, ...(view === "spec" ? S.tabOn : {}) }}>
            📋 Build Spec
          </button>
          <button type="button" onClick={copy} disabled={!text} style={{ ...S.copy, opacity: text ? 1 : 0.55 }}>{copied ? "Copied ✓" : "Copy"}</button>
        </div>
        {text ? (
          <pre style={S.out}>{text}</pre>
        ) : (
          <p style={{ color: "var(--text-tertiary)", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
            Describe what you're trying to do on the left, then run CADMUS. It will return a structured spec and a
            ready-to-paste prompt with the guardrails baked in. Try <strong style={{ color: accent }}>Load example</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
