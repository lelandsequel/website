import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SIGNAL — Adverse Drug Event Extraction",
  description:
    "Pharmacovigilance-grade adverse drug event extraction. F1 0.639. 24.3 month median detection window.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  sectionTitle: { fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.875rem" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  divider: { border: "none", borderTop: "1px solid var(--bg-border)", margin: "3rem 0" },
};

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--bg-border)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>{headers.map((h) => <th key={h} style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", borderBottom: "1px solid var(--bg-border)", whiteSpace: "nowrap" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => <td key={j} style={{ padding: "0.75rem 1rem", fontSize: "0.8125rem", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", borderBottom: i < rows.length - 1 ? "1px solid var(--bg-border)" : "none", fontFamily: j > 0 ? "var(--font-geist-mono), monospace" : "inherit" }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SignalPage() {
  return (
    <article style={{ padding: "5rem 0 6rem" }}>
      <div style={S.container}>
        <div style={{ marginBottom: "3rem" }}>
          <Link href="/research" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2rem" }}>← Research</Link>
          <span style={{ ...S.label, marginBottom: "1rem" }}>SIGNAL · Pharmacovigilance NLP</span>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "0.75rem" }}>SIGNAL</h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Adverse drug event extraction from clinical narratives and pharmacovigilance reports.
          </p>
        </div>

        <div style={{ border: "1px solid var(--bg-border)", padding: "2rem", marginBottom: "3rem", backgroundColor: "var(--bg-card)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {[
              { label: "F1", value: "0.639" },
              { label: "Median detection", value: "24.3mo" },
              { label: "Domain", value: "Pharmacovigilance" },
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
            SIGNAL identifies adverse drug events (ADEs) in unstructured clinical text — spontaneous reports,
            case narratives, and pharmacovigilance databases. An ADE is any harmful outcome associated with a
            drug exposure. Finding them early matters: the 24.3-month median detection window represents
            how far in advance SIGNAL identifies safety signals before they appear in regulatory action.
          </p>
          <p style={S.p}>
            Unlike LLM-based extraction pipelines, SIGNAL uses a sealed corpus of FAERS (FDA Adverse Event
            Reporting System) data — a public-domain government dataset — combined with a deterministic
            entity extraction and normalization pipeline. No inference is made about causality or severity
            unless the corpus explicitly supports it. Ambiguous mentions trigger honest refusal via AURORA.
          </p>
          <p style={S.p}>
            This matters because pharmacovigilance has a regulatory chain of custody requirement. If a safety
            signal leads to a label change or market withdrawal, regulators ask: what was your evidence, and
            when did you detect it? SIGNAL answers both questions with SHA-verified receipts.
          </p>
        </section>

        <hr style={S.divider} />

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Results</h2>
          <Table
            headers={["System", "F1", "Precision", "Recall", "Refusal Rate"]}
            rows={[
              ["SIGNAL v0.1 (COSMIC)", "0.639", "0.712", "0.580", "reported per-class"],
              ["Keyword baseline", "0.550", "0.481", "0.644", "0.000"],
              ["Dictionary lookup", "0.512", "0.773", "0.384", "0.000"],
            ]}
          />
          <p style={{ ...S.p, fontSize: "0.8125rem", marginTop: "1rem" }}>
            Baselines are real implementations — keyword matching against the MedDRA dictionary and
            drug-name dictionary lookup — not straw men. SIGNAL outperforms both on F1.
          </p>
        </section>

        <hr style={S.divider} />

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Reproducibility</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { label: "Corpus source", value: "FDA FAERS (public domain)" },
              { label: "Corpus seal", value: "SHA-256 in CHECKPOINT_RESULTS.md" },
              { label: "Repo", value: "github.com/jourdanlabs/benchmarks/signal" },
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
              <strong style={{ color: "var(--text-primary)" }}>FAERS report quality variance.</strong> FAERS
              contains spontaneous reports with highly variable text quality, from clinical prose to
              one-sentence lay descriptions. The pipeline performs significantly better on structured
              reporter-written narratives than on consumer-submitted reports.
            </p>
            <p style={S.p}>
              <strong style={{ color: "var(--text-primary)" }}>Causality not inferred.</strong> SIGNAL identifies
              co-mentions of drug and adverse event. It does not assess or claim causal relationship.
              Downstream causal analysis is out of scope for this benchmark.
            </p>
            <p style={{ ...S.p, marginBottom: 0 }}>
              <strong style={{ color: "var(--text-primary)" }}>Corpus recency.</strong> The sealed corpus covers
              a specific time window. Drug safety landscapes evolve; corpus refresh cycles are not yet defined.
            </p>
          </div>
        </section>

        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--bg-border)", display: "flex", gap: "1.5rem" }}>
          <a href="https://github.com/jourdanlabs/benchmarks/tree/main/signal" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>GitHub →</a>
          <Link href="/reproducibility" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Reproducibility guide →</Link>
        </div>
      </div>
    </article>
  );
}
