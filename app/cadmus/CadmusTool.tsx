"use client";

import { useMemo, useState } from "react";
import { buildSpec, specMarkdown, llmPrompt, type CadmusInput } from "@/lib/cadmus";

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

export default function CadmusTool() {
  const [input, setInput] = useState<CadmusInput>({ intent: "" });
  const [view, setView] = useState<"prompt" | "spec">("prompt");
  const [copied, setCopied] = useState(false);

  const { spec, specMd, prompt } = useMemo(() => {
    const spec = buildSpec(input);
    return { spec, specMd: specMarkdown(spec), prompt: llmPrompt(spec) };
  }, [input]);

  const text = view === "prompt" ? prompt : specMd;
  const set = (key: keyof CadmusInput, value: string) => setInput((p) => ({ ...p, [key]: value }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  const hasIntent = input.intent.trim().length > 0;

  return (
    <div className="cadmus-grid" style={S.wrap}>
      <div style={S.panel}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.9rem" }}>
          <span style={S.label}>Your intent</span>
          <button type="button" onClick={() => setInput(EXAMPLE)} style={{ ...S.tab, padding: "0.3rem 0.6rem" }}>
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
      </div>

      <div style={S.panel}>
        <div style={S.tabRow}>
          <button type="button" onClick={() => setView("prompt")} style={{ ...S.tab, ...(view === "prompt" ? S.tabOn : {}) }}>
            ⚡ LLM Prompt
          </button>
          <button type="button" onClick={() => setView("spec")} style={{ ...S.tab, ...(view === "spec" ? S.tabOn : {}) }}>
            📋 Build Spec
          </button>
          <button type="button" onClick={copy} style={S.copy}>{copied ? "Copied ✓" : "Copy"}</button>
        </div>
        {hasIntent ? (
          <pre style={S.out}>{text}</pre>
        ) : (
          <p style={{ color: "var(--text-tertiary)", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
            Describe what you're trying to do on the left — CADMUS turns it into a structured spec and a
            ready-to-paste prompt, with the guardrails baked in. Try <strong style={{ color: accent }}>Load example</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
