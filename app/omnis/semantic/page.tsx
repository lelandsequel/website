// OMNIS — the semantic spec engine. Self-contained showcase (inline-styled,
// server-rendered, deterministic). It runs the meaning-driven pipeline on a
// sample intent and shows what keyword parsing structurally cannot: the
// reconciled entities, the typed requirements, and — load-bearing — the honest
// frontier that names exactly where an LLM is still required. 🐦‍⬛ + 🔑

import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { runSixDCosmicSemantic } from "@/lib/six-d/semantic/run-semantic";
import type { IntentSemanticModel } from "@/lib/six-d/semantic/model";

export const metadata: Metadata = {
  title: "CADMUS — the spec engine that reads what you mean | JourdanLabs",
  description:
    "CADMUS reconciles an intent's entities (NEBULA), types its requirements (ASTRAL), builds the spec from that meaning, then binds (VELLUM), gates (AURORA) and chains (LUNA) it — and names exactly where an LLM is still required instead of faking it. The spec stage of the OMNIS loop. Deterministic, keyless, synthetic data.",
};

const SAMPLE_INTENT = {
  title: "Correspondent Pricing Engine",
  context:
    "Servicing agents and the servicing agent both need real-time quotes. The agent must price against the live rate-sheet feed; if the rate sheet is stale the engine must refuse to quote. It must check the eligibility service before pricing. Response must complete within 2 seconds at the p95.",
  goals: ["Win lock volume with faster, sharper quotes", "Never quote below the locked margin floor"],
  constraints: [
    "Integrates with the rate-sheet feed and the eligibility service",
    "Every quote must be logged for audit within 1 second",
  ],
  sourceMaterial: ["Capital Markets uplift study CM-2026-07"],
};

const C = {
  ink: "#e7e7ea",
  muted: "#bcc0cc",
  faint: "#9aa0ac",
  accent: "#9fb4ff",
  green: "#6fe0a8",
  gold: "#f0c869",
  card: "rgba(20,22,31,0.6)",
  border: "#2a2d3a",
  mono: "var(--font-mono, ui-monospace, monospace)",
  sans: "var(--font-sans, Inter, system-ui, sans-serif)",
};
const short = (h: string): string => (h.length > 18 ? `${h.slice(0, 10)}…${h.slice(-6)}` : h);
const card: CSSProperties = { border: `1px solid ${C.border}`, background: C.card, borderRadius: 12, padding: "0.9rem 1.05rem" };
const tag = (col: string): CSSProperties => ({
  fontFamily: C.mono,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.04em",
  padding: "2px 8px",
  borderRadius: 999,
  background: `${col}1a`,
  color: col,
  border: `1px solid ${col}55`,
  whiteSpace: "nowrap",
});
const h2: CSSProperties = {
  fontSize: "0.78rem",
  fontFamily: C.mono,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: C.accent,
  marginBottom: "0.5rem",
};

export default async function OmnisSemanticPage() {
  const { run, entry } = await runSixDCosmicSemantic(SAMPLE_INTENT);
  const m = (run.manifest as unknown as { semantic: IntentSemanticModel }).semantic;
  const bound = run.provenance.filter((p) => p.status === "BOUND").length;
  const phases = run.manifest.artifacts.map((a) => ({ phase: a.phase, n: a.elements.length }));

  return (
    <div style={{ background: "#0c0e15", minHeight: "100vh", color: C.ink, fontFamily: C.sans }}>
      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "3rem 1.25rem 5rem" }}>
      <header style={{ marginBottom: "2.4rem" }}>
        <p style={{ fontFamily: C.mono, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent, margin: "0 0 0.8rem" }}>
          JourdanLabs · CADMUS — the spec engine · OMNIS loop
        </p>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.1rem)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.05, margin: "0 0 0.4rem" }}>
          It reads what you mean.
          <span style={{ ...tag(C.gold), marginLeft: 12, verticalAlign: "middle" }}>SYNTHETIC DATA</span>
        </h1>
        <p style={{ color: C.muted, fontSize: "1.06rem", lineHeight: 1.6, maxWidth: "64ch", margin: "0.8rem 0 0" }}>
          CADMUS <strong style={{ color: C.ink }}>reconciles</strong> an intent&rsquo;s entities (NEBULA),{" "}
          <strong style={{ color: C.ink }}>types</strong> its requirements (ASTRAL), and builds the spec from that
          meaning — then VELLUM binds every element to a source, AURORA gates it, LUNA chains it. And where it can&rsquo;t
          be sure, it <strong style={{ color: C.green }}>names exactly where an LLM is still required</strong> instead of
          faking it. Deterministic · keyless · meaning-driven.
        </p>
      </header>

      <section style={{ marginBottom: "2.2rem" }}>
        <h2 style={h2}>① Reconciliation — NEBULA</h2>
        <p style={{ color: C.muted, fontSize: "0.95rem", margin: "0 0 1rem", maxWidth: "66ch" }}>
          Keyword parsing sees strings. OMNIS sees <em>entities</em> — and merges the surface forms that mean the same
          thing, with provenance. The thing a substring scan structurally cannot do.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "0.7rem" }}>
          {m.entities.map((e) => (
            <div key={e.id} style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={tag(C.accent)}>{e.role}</span>
                <strong style={{ fontSize: "1.02rem" }}>{e.display}</strong>
              </div>
              <div style={{ fontFamily: C.mono, fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>
                {e.variants.map((v, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ color: C.faint }}> · </span>}&ldquo;{v}&rdquo;
                  </span>
                ))}
                {e.variants.length >= 2 && (
                  <div style={{ color: C.green, marginTop: 4 }}>↳ reconciled into one entity from {e.variants.length} mentions</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "2.2rem" }}>
        <h2 style={h2}>② Typed requirements — ASTRAL</h2>
        <div style={{ display: "grid", gap: "0.45rem" }}>
          {m.requirements.map((r, i) => {
            const budget = r.typing.canonical?.budget as { raw?: string } | undefined;
            const narrative = r.typing.ears === "narrative";
            return (
              <div key={i} style={{ ...card, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={tag(narrative ? C.gold : C.green)}>{r.typing.ears}</span>
                <span style={tag(C.accent)}>{r.typing.modality}</span>
                {budget?.raw && <span style={tag(C.gold)}>budget {budget.raw}</span>}
                <span style={{ color: C.muted, fontSize: "0.92rem", flex: 1, minWidth: "40%" }}>{r.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ marginBottom: "2.2rem" }}>
        <h2 style={{ ...h2, color: C.green }}>③ The frontier — named, not faked</h2>
        <p style={{ color: C.muted, fontSize: "0.95rem", margin: "0 0 1rem", maxWidth: "66ch" }}>
          What makes OMNIS trustworthy: it does <em>not</em> pretend to understand arbitrary prose. It reconciles and
          types what it can, and reports — precisely — where a model would still be required.
        </p>
        <div style={{ ...card, borderColor: `${C.green}55`, background: `${C.green}0d` }}>
          <div style={{ display: "flex", gap: "1.6rem", marginBottom: "0.8rem", flexWrap: "wrap", fontFamily: C.mono, fontSize: 12.5, color: C.muted }}>
            <span><strong style={{ color: C.ink, fontSize: 18 }}>{m.frontier.narrativeRequirements}</strong> narrative req(s)</span>
            <span><strong style={{ color: C.ink, fontSize: 18 }}>{m.frontier.unresolvedTokens.length}</strong> residual token(s)</span>
            <span><strong style={{ color: C.ink, fontSize: 18 }}>{m.frontier.reviewQueue.length}</strong> merge(s) to adjudicate</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", color: C.muted, fontSize: "0.92rem", lineHeight: 1.65 }}>
            {m.frontier.llmRequiredFor.map((f, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={h2}>④ The governed spec — VELLUM · AURORA · LUNA</h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
          {phases.map((p) => (
            <div key={p.phase} style={{ ...card, padding: "0.5rem 0.8rem", textAlign: "center", minWidth: 92 }}>
              <div style={{ fontFamily: C.mono, fontSize: 11, color: C.faint, textTransform: "uppercase" }}>{p.phase}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{p.n}</div>
            </div>
          ))}
        </div>
        <div style={{ ...card, display: "flex", gap: "1.6rem", flexWrap: "wrap", fontFamily: C.mono, fontSize: 12.5 }}>
          <span style={{ color: C.muted }}>VELLUM <strong style={{ color: C.green }}>{bound}/{run.provenance.length}</strong> bound</span>
          <span style={{ color: C.muted }}>AURORA <strong style={{ color: C.ink }}>NO_OBJECTION {run.gate.summary.NO_OBJECTION} · HOLD {run.gate.summary.HOLD} · REFUSE {run.gate.summary.REFUSE}</strong></span>
          <span style={{ color: C.muted }}>LUNA <strong style={{ color: C.accent }}>{short(entry.hash)}</strong></span>
          <span style={{ color: C.muted }}>fingerprint <strong style={{ color: C.accent }}>{m.fingerprint}</strong></span>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1.4rem", color: C.faint, fontSize: "0.88rem", lineHeight: 1.6 }}>
        CADMUS — the JourdanLabs spec engine, the spec stage of the OMNIS loop. Meaning in, governed spec out, the gap named not faked. Every element here
        traces to a source; the receipt re-runs identically. This page runs the same engine the loop does. 🐦‍⬛ + 🔑
      </footer>
      </main>
    </div>
  );
}
