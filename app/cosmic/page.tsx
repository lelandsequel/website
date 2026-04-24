import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "COSMIC — The Reasoning Substrate",
  description:
    "COSMIC is the multi-engine deterministic pipeline shared across all JourdanLabs divisions. No LLM calls at runtime.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
};

const ENGINES = [
  { name: "NOVA", stage: "01", desc: "Initial evidence retrieval and claim decomposition. The first contact between a query and the sealed corpus." },
  { name: "ECLIPSE", stage: "02", desc: "Adversarial challenge generation. ECLIPSE actively attempts to falsify NOVA's initial evidence retrievals before they advance to aggregation." },
  { name: "PULSAR", stage: "03", desc: "Evidence aggregation and conflict resolution. PULSAR synthesizes NOVA evidence against ECLIPSE challenges into a confidence-weighted verdict candidate." },
  { name: "AURORA", stage: "04", desc: "Confidence gate. When aggregate confidence falls below threshold, AURORA emits a refusal rather than a verdict. Honest uncertainty is a first-class output." },
  { name: "LUNA", stage: "05", desc: "SHA-chained audit log. Every pipeline run produces a tamper-evident record: input corpus SHA, stage outputs, confidence scores, verdict or refusal, and chain link to prior run." },
  { name: "HEIMDALL", stage: "06", desc: "Tier gating. Capability access control that gates queries on whether the pipeline has been calibrated for the relevant domain, separate from AURORA's confidence gate." },
  { name: "DOLOS", stage: "07", desc: "Normalization and entity disambiguation. Deterministic rule-based entity resolution before any pipeline stage sees the input." },
];

export default function CosmicPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <div style={{ maxWidth: 680 }}>
            <span style={{ ...S.label, marginBottom: "1rem" }}>COSMIC</span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              The reasoning substrate.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 580 }}>
              COSMIC is a multi-engine deterministic pipeline shared across all five JourdanLabs divisions.
              No LLM calls at runtime. Every claim is grounded against a sealed, SHA-verified corpus before
              it leaves the pipeline. Honest refusal is a first-class output.
            </p>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>Pipeline architecture</span>

          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", backgroundColor: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
              {ENGINES.map((engine, i) => (
                <div key={engine.name} style={{ display: "grid", gridTemplateColumns: "3rem 7rem 1fr", gap: "1.5rem", padding: "1.5rem", backgroundColor: "var(--bg-card)", alignItems: "start" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", color: "var(--text-tertiary)", paddingTop: "0.1rem" }}>{engine.stage}</span>
                  <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.875rem", fontWeight: 700, color: "var(--accent)" }}>{engine.name}</span>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{engine.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", marginTop: "1rem" }}>
            Engine implementations are proprietary. The scoring harnesses and corpus infrastructure are open.{" "}
            <a href="https://github.com/jourdanlabs/benchmarks" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
              github.com/jourdanlabs/benchmarks →
            </a>
          </p>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.containerSm}>
          <span style={S.label}>Core design principles</span>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {[
              {
                title: "No LLM calls at runtime",
                body: "Every COSMIC pipeline stage uses deterministic algorithms that produce identical outputs for identical inputs. There is no sampling, no temperature, no non-deterministic model inference in production. LLMs are used during development. They are not in the production scoring path.",
              },
              {
                title: "Sealed corpus before contact",
                body: "Every corpus is SHA-256 sealed before any pipeline contact. The seal is verified on every scoring run. Post-hoc corpus manipulation is architecturally prevented. If the corpus changes, it gets a new SHA and a new checkpoint version.",
              },
              {
                title: "Honest refusal as a feature",
                body: "AURORA's confidence gate refuses to emit a verdict when aggregate confidence falls below threshold. This is not a failure mode — it is the correct answer when evidence is insufficient. Every published benchmark reports refusal rates alongside accuracy.",
              },
              {
                title: "Immutable audit chain",
                body: "LUNA maintains a SHA-chained audit log for every pipeline run. Every record links to the prior record's hash. The chain is tamper-evident: modifying any record breaks the chain, and the break is detectable.",
              },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", gap: "2rem" }}>
                <div style={{ width: 2, backgroundColor: "var(--accent)", flexShrink: 0, alignSelf: "stretch" }} />
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{item.title}</h3>
                  <p style={{ ...S.p, marginBottom: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={S.label}>Access</span>
          <p style={S.p}>
            COSMIC is not a general-purpose API. It is the proprietary engine layer for JourdanLabs
            division products. To evaluate COSMIC's capabilities on your domain, request a VANTAGE scan.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <Link href="/crucible/vantage" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
              Request a VANTAGE scan →
            </Link>
            <Link href="/crucible/benchmarks" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              View benchmark program →
            </Link>
            <Link href="/crucible/methodology" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Read the methodology →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
