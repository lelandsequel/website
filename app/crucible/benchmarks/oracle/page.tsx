import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ORACLE — Factual Claim Verification",
  description:
    "Deterministic factual verification with honest refusal. 51% accuracy vs 31% and 25% for always-confident baselines.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  sectionTitle: { fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.875rem" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  divider: { border: "none", borderTop: "1px solid var(--bg-border)", margin: "3rem 0" },
};

function Table({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--bg-border)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>{headers.map((h) => <th key={h} style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", borderBottom: "1px solid var(--bg-border)", whiteSpace: "nowrap" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "0.75rem 1rem", fontSize: "0.8125rem", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", borderBottom: i < rows.length - 1 ? "1px solid var(--bg-border)" : "none", fontFamily: j > 0 ? "var(--font-geist-mono), monospace" : "inherit" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OraclePage() {
  return (
    <article style={{ padding: "5rem 0 6rem" }}>
      <div style={S.container}>
        <div style={{ marginBottom: "3rem" }}>
          <Link href="/crucible/benchmarks" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2rem" }}>← Benchmarks</Link>
          <span style={{ ...S.label, marginBottom: "1rem" }}>ORACLE · Factual Verification</span>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "0.75rem" }}>ORACLE</h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Deterministic factual claim verification with honest refusal.
          </p>
        </div>

        <div style={{ border: "1px solid var(--bg-border)", padding: "2rem", marginBottom: "3rem", backgroundColor: "var(--bg-card)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {[
              { label: "Accuracy", value: "51.0%" },
              { label: "vs CONFIDENT_ALWAYS", value: "+20pp" },
              { label: "Refusal rate", value: "67.5%" },
            ].map((m) => (
              <div key={m.label}>
                <div style={{ ...S.label, marginBottom: "0.375rem" }}>{m.label}</div>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "1.75rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.02em" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>What it is</h2>
          <p style={S.p}>
            ORACLE is a 6-stage deterministic claim verification pipeline (CLAIM DECOMPOSITION → NOVA → ECLIPSE → PULSAR → LUNA → AURORA).
            It verifies factual claims against a curated knowledge base of approximately 100 facts, spanning history,
            science, geography, technology, and general knowledge.
          </p>
          <p style={S.p}>
            The critical design choice: AURORA refuses to emit a verdict when aggregate confidence falls below 0.70.
            This means ORACLE refuses on 67.5% of the 200-claim test corpus — and counts those refusals correctly
            when the claim is genuinely unsupportable from the KB. Honest refusal is not a failure mode.
            It is a first-class output.
          </p>
          <p style={S.p}>
            Both baselines — CONFIDENT_ALWAYS and NAIVE_KEYWORD — have zero refusal rate. They answer everything
            and are wrong far more often. CONFIDENT_ALWAYS emits VERIFIED for every claim and achieves 31% accuracy
            (the fraction of gold-VERIFIED claims). NAIVE_KEYWORD uses keyword matching and achieves 25%.
          </p>
        </section>

        <hr style={S.divider} />

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Results</h2>
          <div style={{ marginBottom: "1.5rem" }}>
            <Table
              headers={["System", "Accuracy", "Macro F1", "Refusal Rate"]}
              rows={[
                ["ORACLE v0.1", "0.5100", "0.3097", "0.6750"],
                ["CONFIDENT_ALWAYS (baseline)", "0.3100", "0.1578", "0.0000"],
                ["NAIVE_KEYWORD (baseline)", "0.2500", "0.1333", "0.0000"],
              ]}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ ...S.label, marginBottom: "0.75rem" }}>Per-verdict breakdown (ORACLE v0.1)</p>
            <Table
              headers={["Verdict", "Precision", "Recall", "F1", "TP", "FP", "FN"]}
              rows={[
                ["VERIFIED", "0.7593", "0.6613", "0.7069", "41", "13", "21"],
                ["REFUTED", "1.0000", "0.1250", "0.2222", "11", "0", "77"],
                ["UNSUPPORTED", "0.0000", "0.0000", "0.0000", "0", "0", "0"],
              ]}
            />
          </div>
          <div>
            <p style={{ ...S.label, marginBottom: "0.75rem" }}>Per-domain accuracy</p>
            <Table
              headers={["Domain", "Total", "Correct", "Accuracy"]}
              rows={[
                ["science", "53", "32", "0.6038"],
                ["history", "48", "28", "0.5833"],
                ["general", "50", "29", "0.5800"],
                ["technology", "33", "11", "0.3333"],
                ["geography", "16", "2", "0.1250"],
              ]}
            />
          </div>
        </section>

        <hr style={S.divider} />

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Reproducibility</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { label: "Corpus SHA-256", value: "cd5de198497a5cf09e372aa99745cac940c774b4d212da70902d382a71911ad2" },
              { label: "Total claims", value: "200 (62 VERIFIED · 88 REFUTED · 50 UNSUPPORTED)" },
              { label: "Generated", value: "2026-04-23T07:19:10Z" },
              { label: "Repo", value: "github.com/jourdanlabs/benchmarks/oracle" },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.8125rem" }}>
                <span style={{ color: "var(--text-tertiary)", minWidth: 180 }}>{r.label}</span>
                <code style={{ color: "var(--text-secondary)", wordBreak: "break-all" }}>{r.value}</code>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Limitations</h2>
          <div style={{ borderLeft: "2px solid var(--bg-border)", paddingLeft: "1.5rem" }}>
            <p style={S.p}>
              <strong style={{ color: "var(--text-primary)" }}>Small KB (v0.1).</strong> The knowledge base contains
              approximately 100 curated facts. REFUTED recall is only 12.5% — the pipeline correctly identifies refuted
              claims when it fires, but refuses on most REFUTED claims due to low confidence. KB expansion is the primary
              lever for recall improvement.
            </p>
            <p style={S.p}>
              <strong style={{ color: "var(--text-primary)" }}>Geography domain accuracy: 12.5%.</strong> The KB
              has thin geographic coverage. Geography claims are almost universally refused or misclassified.
            </p>
            <p style={{ ...S.p, marginBottom: 0 }}>
              <strong style={{ color: "var(--text-primary)" }}>v0.1 baseline only.</strong> This is a v0.1 seal.
              The pipeline architecture is proven; the current accuracy reflects KB size, not pipeline quality.
              v0.2 targets KB expansion and REFUTED recall improvement.
            </p>
          </div>
        </section>

        <section>
          <h2 style={S.sectionTitle}>Next version</h2>
          <p style={S.p}>
            ORACLE v0.2 targets KB expansion (1,000+ facts across all five domains), improved REFUTED recall,
            and calibration verification. The reliability diagram showing confidence-vs-accuracy correlation
            is included in the repo.
          </p>
        </section>

        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--bg-border)", display: "flex", gap: "1.5rem" }}>
          <a href="https://github.com/jourdanlabs/benchmarks/tree/main/oracle" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>GitHub →</a>
          <Link href="/crucible/reproducibility" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Reproducibility guide →</Link>
        </div>
      </div>
    </article>
  );
}
