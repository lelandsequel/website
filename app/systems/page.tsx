import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Systems — COSMIC, VANTAGE, LUNA",
  description:
    "The JourdanLabs architectural stack: COSMIC multi-engine pipeline, VANTAGE diagnostic suite, LUNA audit chain.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  divider: { border: "none", borderTop: "1px solid var(--bg-border)", margin: "4rem 0" },
};

const layers = [
  {
    name: "COSMIC",
    tagline: "The core pipeline architecture",
    description: "COSMIC is a multi-engine deterministic processing pipeline for high-stakes classification and extraction tasks. No LLM calls at runtime. Every stage produces structured, confidence-scored outputs that chain into the next stage. The pipeline is task-agnostic — the same architecture powers SIGNAL, CITADEL, SENTINEL, ORACLE, LENS, and COMPASS with task-specific engine configurations.",
    engines: [
      { name: "NOVA", role: "Evidence retrieval and claim decomposition. Breaks complex inputs into scored atomic claims." },
      { name: "ECLIPSE", role: "Adversarial challenge generation. Generates counter-evidence to stress-test NOVA outputs." },
      { name: "PULSAR", role: "Evidence aggregation. Resolves conflicts between NOVA and ECLIPSE; produces aggregate confidence." },
      { name: "AURORA", role: "Confidence gate. Emits verdict or refusal based on aggregate confidence vs. threshold." },
      { name: "DOLOS", role: "Normalization engine. Deterministic entity disambiguation without ML inference." },
    ],
  },
  {
    name: "VANTAGE",
    tagline: "Capability diagnostic suite",
    description: "VANTAGE runs COSMIC-class workloads against live engines and produces structured diagnostic readouts. Per-engine confidence bands, failure-class taxonomy, and ranked fix candidates. Used internally before every benchmark publication. The CITADEL checkpoint arc (E → E.1 → E.2) was driven by VANTAGE diagnostics. Not a benchmark — a capability demonstration.",
    engines: [
      { name: "HEIMDALL", role: "Tier gating and capability boundary enforcement. Refuses queries outside calibrated scope." },
      { name: "Failure taxonomy", role: "Class A (normalization mismatch), Class B (silent extraction failure), Class C (structural/data limitation)." },
      { name: "Confidence attribution", role: "Per-engine confidence chains, visible in diagnostic output." },
    ],
  },
  {
    name: "LUNA",
    tagline: "SHA-chained audit system",
    description: "LUNA is the audit module embedded in every COSMIC pipeline. For every run, LUNA records the corpus SHA, pipeline stage outputs, verdicts, confidence scores, and a SHA-chained link to the prior run record. The chain is tamper-evident — modifying any record breaks the chain hash and makes the break detectable. LUNA output is published with every benchmark result.",
    engines: [
      { name: "Run receipts", role: "Every pipeline run produces a LUNA receipt: corpus SHA + outputs + timestamp + chain hash." },
      { name: "Chain verification", role: "Start from any checkpoint hash and verify the chain back to genesis. Documented in methodology repo." },
      { name: "Audit export", role: "LUNA logs export as JSONL. Published alongside benchmark corpora." },
    ],
  },
];

export default function SystemsPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.containerSm}>
          <span style={{ ...S.label, marginBottom: "1rem" }}>Architectural Stack</span>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
            Three layers. One architectural commitment.
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
            COSMIC is the pipeline. VANTAGE is the diagnostic. LUNA is the audit chain.
            Every benchmark published by JourdanLabs runs on all three.
            No LLM at runtime. No post-hoc corpus manipulation. No unverifiable results.
          </p>
        </div>
      </section>

      {layers.map((layer, i) => (
        <section key={layer.name} style={{ padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" }}>
          <div style={S.container}>
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "5rem", alignItems: "start" }}>
              <div>
                <span style={{ ...S.label, marginBottom: "0.75rem" }}>Layer {i + 1} / {layer.name}</span>
                <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "0.5rem" }}>{layer.name}</h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-tertiary)", fontStyle: "italic" }}>{layer.tagline}</p>
              </div>
              <div>
                <p style={{ ...S.p, fontSize: "1rem", marginBottom: "2rem" }}>{layer.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", border: "1px solid var(--bg-border)", backgroundColor: "var(--bg-border)" }}>
                  {layer.engines.map((engine) => (
                    <div key={engine.name} style={{ backgroundColor: "var(--bg-card)", padding: "1rem 1.25rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                      <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", minWidth: 120, paddingTop: "0.125rem" }}>{engine.name}</span>
                      <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{engine.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "2rem" }}>
            Engine implementations are proprietary. The architectural description, pipeline interfaces,
            and diagnostic framework are public. To access the live engines for evaluation or integration,
            request an API key.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <a href="mailto:leland@jourdanlabs.com?subject=COSMIC Evaluation API Key" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
              Request an evaluation API key →
            </a>
            <Link href="/research" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              See the benchmark program →
            </Link>
            <Link href="/methodology" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Read the methodology →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
