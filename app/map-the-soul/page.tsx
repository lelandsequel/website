import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MAP THE SOUL — The Identity Layer for AI Agents",
  description:
    "A deterministic substrate for AI agent identity persistence. Each agent gets a cryptographically signed, lineage-chained, refusal-grounded soul.md. Models change. The soul holds.",
};

const accent = "#6f38ff";

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
};

const PROBLEM = [
  { name: "Models change", body: "Capabilities shift, behavior drifts, context resets with every upgrade. The ground moves under everything built on it." },
  { name: "Agents vanish", body: "An agent loses its memory, its identity, and its hard-won calibration — and comes back a stranger, or doesn't come back at all." },
  { name: "Continuity breaks", body: "No persistence, no verifiable lineage. Today's frameworks make no guarantee that who an agent was survives the next version." },
];

const SOUL = [
  { k: "IDENTITY", body: "Who the agent is — its disciplines, its voice, its refusals — written down and signed." },
  { k: "LINEAGE", body: "Where it came from and what it inherits, hash-chained so the line can't be quietly rewritten." },
  { k: "REFUSAL", body: "The things it will not do, enforced at the substrate — refusal as a first-class property, not a prompt." },
  { k: "MEMORY", body: "Its carried context and receipts, portable across any model it runs on." },
];

const PIPELINE = ["Author", "Initialize", "Sign", "Refine", "Validate", "Attest"];

export default function MapTheSoulPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)", borderTop: `2px solid ${accent}` }}>
        <div style={S.container}>
          <div style={{ maxWidth: 700 }}>
            <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, display: "block", marginBottom: "1rem" }}>MAP THE SOUL</span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              The identity layer for AI agents.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 600 }}>
              A deterministic substrate for agent identity persistence. Each agent gets a <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>soul.md</strong> —
              cryptographically signed, lineage-chained, refusal-grounded — living in a layer independent of any
              specific model. <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Models can change. The soul holds.</strong>
            </p>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>The problem</span>
          <p style={{ ...S.p, maxWidth: 620, marginBottom: "2rem" }}>
            Every agent you build today is a tenant on ground that keeps moving. When the model underneath
            changes, there is no guarantee that who the agent <em>was</em> survives.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1px", backgroundColor: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
            {PROBLEM.map((x) => (
              <div key={x.name} style={{ backgroundColor: "var(--bg-card)", padding: "1.75rem" }}>
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.8125rem", fontWeight: 700, color: accent, display: "block", marginBottom: "0.75rem" }}>{x.name}</span>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{x.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>The solution — soul.md</span>
          <p style={{ ...S.p, maxWidth: 620, marginBottom: "2rem" }}>
            Every agent gets a signed soul: a portable, verifiable record of who it is. Four load-bearing parts.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1px", backgroundColor: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
            {SOUL.map((x) => (
              <div key={x.k} style={{ backgroundColor: "var(--bg-card)", padding: "1.75rem" }}>
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.8125rem", fontWeight: 700, color: accent, letterSpacing: "0.06em", display: "block", marginBottom: "0.75rem" }}>{x.k}</span>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{x.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.containerSm}>
          <span style={S.label}>Refusal protection</span>
          <p style={S.p}>
            On MAP THE SOUL, <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>identity drift becomes a cryptographic event, not a forgotten state.</strong> An
            agent that no longer matches its signed soul can be detected, flagged, and refused — rather than
            silently becoming someone else.
          </p>
          <p style={{ ...S.p, marginBottom: 0 }}>
            The same principle that makes COSMIC trustworthy at the decision edge makes MAP THE SOUL
            trustworthy at the identity edge: <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>refusal as a first-class property</strong>, enforced
            by the substrate, recorded on an append-only chain.
          </p>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>The pipeline</span>
          <p style={{ ...S.p, maxWidth: 620, marginBottom: "2rem" }}>
            From soul authoring to verifiable identity attestation — each step signed onto the chain.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${PIPELINE.length}, 1fr)`, gap: "1px", border: "1px solid var(--bg-border)", backgroundColor: "var(--bg-border)" }}>
            {PIPELINE.map((step, i) => (
              <div key={step} style={{ backgroundColor: "var(--bg-card)", padding: "1.25rem 0.75rem", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.625rem", color: "var(--text-tertiary)", marginBottom: "0.4rem" }}>0{i + 1}</div>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.8125rem", fontWeight: 700, color: accent }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "1rem" }}>
            Stop losing your agents. Sign their souls.
          </h2>
          <p style={S.p}>
            Built on COSMIC principles — deterministic substrate, cryptographic attestation — for every agent
            that should not be lost.
          </p>
          <Link href="/contact" style={{ fontSize: "0.875rem", color: accent }}>
            Talk to us about identity persistence →
          </Link>
        </div>
      </section>
    </>
  );
}
