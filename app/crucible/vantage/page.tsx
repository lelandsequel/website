import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VANTAGE — Products Validating Products",
  description:
    "VANTAGE is the COSMIC diagnostic suite. Per-division capability scans with sealed receipts, honest refusal rates, and BCa confidence intervals.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  sectionTitle: { fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.875rem" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  divider: { border: "none", borderTop: "1px solid var(--bg-border)", margin: "3rem 0" },
};

const SCAN_RESULTS = [
  { division: "ATLAS", task: "Mineral title extraction", score: "88.5%", refusal: "11.0%", corpus: "sealed" },
  { division: "BACCHUS", task: "Venue inventory reasoning", score: "88.9%", refusal: "8.2%", corpus: "sealed" },
  { division: "HELIX", task: "Clinical workflow routing", score: "81.5%", refusal: "14.7%", corpus: "sealed" },
  { division: "HEIMDALL", task: "SOC alert triage", score: "94.0%", refusal: "6.0%", corpus: "sealed" },
  { division: "CRUCIBLE", task: "Cross-domain factual verification", score: "51.0%", refusal: "67.5%", corpus: "a6a98dbb / cd5de198" },
];

export default function VantagePage() {
  return (
    <>
      {/* HERO */}
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <span style={{ ...S.label, marginBottom: 0 }}>CRUCIBLE / VANTAGE</span>
              <span style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", border: "1px solid var(--accent-border)", padding: "0.125rem 0.5rem", fontFamily: "var(--font-geist-mono), monospace" }}>
                FLAGSHIP
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              Products validating products.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 580, marginBottom: "2rem" }}>
              VANTAGE is the COSMIC diagnostic suite — a structured scan of engine capability across all
              five division domains. Each scan produces a sealed receipt with per-task scores, honest
              refusal rates, and BCa confidence intervals.
            </p>
            <a
              href="mailto:leland@jourdanlabs.com?subject=VANTAGE Evaluation — API Key Request"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "var(--accent)",
                color: "#0E0F13",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.02em",
                borderRadius: 2,
                textDecoration: "none",
              }}
            >
              Request a VANTAGE scan →
            </a>
          </div>
        </div>
      </section>

      {/* SCAN RECEIPTS */}
      <section style={{ padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <span style={S.label}>Scan Receipts</span>

          <div style={{ border: "1px solid var(--bg-border)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "8rem 1fr 6rem 6rem 1fr", padding: "0.75rem 1rem", borderBottom: "1px solid var(--bg-border)", backgroundColor: "var(--bg-card)" }}>
              {["Division", "Task", "Score", "Refusal", "Corpus"].map((h) => (
                <span key={h} style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>{h}</span>
              ))}
            </div>
            {SCAN_RESULTS.map((row, i) => (
              <div key={row.division} style={{ display: "grid", gridTemplateColumns: "8rem 1fr 6rem 6rem 1fr", padding: "1rem", borderBottom: i < SCAN_RESULTS.length - 1 ? "1px solid var(--bg-border)" : "none", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)" }}>{row.division}</span>
                <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{row.task}</span>
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>{row.score}</span>
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.875rem", color: "var(--text-tertiary)" }}>{row.refusal}</span>
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", color: "var(--text-tertiary)", wordBreak: "break-all" }}>{row.corpus}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.75rem" }}>
            BCa bootstrap confidence intervals (B=2,000) computed per scan. Full receipts available on request.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.containerSm}>
          <span style={S.label}>How VANTAGE works</span>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {[
              {
                n: "01",
                title: "Sealed corpus per domain",
                body: "Each VANTAGE scan runs against a domain-specific corpus sealed before the scan begins. The corpus SHA is published in the receipt. You can verify the corpus was not modified between scans.",
              },
              {
                n: "02",
                title: "Full COSMIC pipeline execution",
                body: "NOVA → ECLIPSE → PULSAR → AURORA → LUNA. Every stage runs deterministically. No LLM calls at runtime. The AURORA gate refuses tasks where aggregate confidence falls below threshold — refusal rates are reported, not suppressed.",
              },
              {
                n: "03",
                title: "Per-engine confidence attribution",
                body: "VANTAGE produces a failure-class taxonomy alongside the score. Each failure class is attributed to a specific pipeline stage with a confidence estimate. The taxonomy is what informs the benchmark checkpoint arc — it's how CITADEL's E.1 and E.2 fixes were identified.",
              },
              {
                n: "04",
                title: "Sealed receipt with BCa CIs",
                body: "The scan receipt includes: corpus SHA, per-task scores, refusal rate, BCa bootstrap confidence intervals (B=2,000), and a LUNA audit chain head. The receipt is tamper-evident. If you share it with a third party, they can verify it against the public corpus.",
              },
            ].map((item) => (
              <div key={item.n} style={{ display: "flex", gap: "2rem" }}>
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", flexShrink: 0, paddingTop: "0.1rem", minWidth: "1.5rem" }}>{item.n}</span>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{item.title}</h3>
                  <p style={{ ...S.p, marginBottom: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENGINES */}
      <section style={{ padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <span style={S.label}>Engines covered</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1px", border: "1px solid var(--bg-border)", backgroundColor: "var(--bg-border)" }}>
            {[
              { name: "NOVA", desc: "Initial evidence retrieval and claim decomposition" },
              { name: "ECLIPSE", desc: "Adversarial challenge generation" },
              { name: "PULSAR", desc: "Evidence aggregation and conflict resolution" },
              { name: "LUNA", desc: "SHA-chained audit log, tamper-evident per-run" },
              { name: "AURORA", desc: "Confidence gate; emits refusal below threshold" },
              { name: "HEIMDALL", desc: "Tier gating; capability access control" },
              { name: "DOLOS", desc: "Normalization and entity disambiguation" },
            ].map((e) => (
              <div key={e.name} style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem" }}>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", marginBottom: "0.375rem" }}>{e.name}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{e.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", marginTop: "1rem" }}>
            Engine implementations are proprietary. The VANTAGE diagnostic framework ships without
            engine source code. To run full diagnostics, request an evaluation API key.
          </p>
        </div>
      </section>

      {/* NOT A BENCHMARK */}
      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={S.label}>What is and is not claimed</span>
          <div style={{ borderLeft: "2px solid var(--bg-border)", paddingLeft: "1.5rem" }}>
            <p style={S.p}>
              <strong style={{ color: "var(--text-primary)" }}>Is claimed:</strong> VANTAGE correctly identified
              CITADEL failure classes A, B, C with stated confidence levels (95%, 88%, 80%). The E.1 and E.2 fixes
              were implemented from VANTAGE's diagnosis and produced the documented F1 improvements.
            </p>
            <p style={{ ...S.p, marginBottom: 0 }}>
              <strong style={{ color: "var(--text-primary)" }}>Is not claimed:</strong> VANTAGE scan scores are
              capability demonstrations, not published benchmarks. Division scan scores (ATLAS 88.5%, BACCHUS 88.9%,
              HELIX 81.5%) have no held-out ground truth separate from the scan corpus. The CRUCIBLE numbers
              (SENTINEL 94.0%, ORACLE 51.0%) are the publicly published sealed benchmark results.
            </p>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <Link href="/crucible/benchmarks" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
              View the sealed benchmark program →
            </Link>
            <a href="mailto:leland@jourdanlabs.com?subject=VANTAGE Evaluation" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Request an evaluation →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
