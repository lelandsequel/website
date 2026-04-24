import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CITADEL — Corporate Hierarchy Reconstruction",
  description:
    "SEC Exhibit 21 corporate subsidiary reconstruction. F1 0.616. 400-entity corpus, SHA-verified ground truth, full checkpoint arc.",
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
          <tr>
            {headers.map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "0.75rem 1rem", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", borderBottom: "1px solid var(--bg-border)", whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "0.75rem 1rem", fontSize: "0.8125rem", color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", borderBottom: i < rows.length - 1 ? "1px solid var(--bg-border)" : "none", fontFamily: j > 0 ? "var(--font-geist-mono), monospace" : "inherit" }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CitadelPage() {
  return (
    <article style={{ padding: "5rem 0 6rem" }}>
      <div style={S.container}>
        <div style={{ marginBottom: "3rem" }}>
          <Link href="/crucible/benchmarks" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2rem" }}>
            ← Benchmarks
          </Link>
          <span style={{ ...S.label, marginBottom: "1rem" }}>CITADEL · Corporate Hierarchy Reconstruction</span>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
            CITADEL
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Corporate subsidiary hierarchy reconstruction from SEC Exhibit 21 filings.
          </p>
        </div>

        <div style={{ border: "1px solid var(--bg-border)", padding: "2rem", marginBottom: "3rem", backgroundColor: "var(--bg-card)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {[
              { label: "Micro F1", value: "0.6161" },
              { label: "Entities scored", value: "342 / 400" },
              { label: "Checkpoint", value: "E.2 (sealed)" },
            ].map((m) => (
              <div key={m.label}>
                <div style={{ ...S.label, marginBottom: "0.375rem" }}>{m.label}</div>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "1.75rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.02em" }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>What it is</h2>
          <p style={S.p}>
            CITADEL reconstructs corporate subsidiary hierarchies from publicly filed SEC Exhibit 21 documents.
            Every US public company with annual revenues exceeding certain thresholds must file Exhibit 21 with
            their 10-K, listing all significant subsidiaries. These filings are public via EDGAR but are
            unstructured — the data lives in HTML tables, PDFs, and free-text disclosures of varying quality.
          </p>
          <p style={S.p}>
            COSMIC's CITADEL pipeline ingests Exhibit 21 filings, normalizes entity names using a deterministic
            rule set (no ML inference), and reconstructs parent→subsidiary DAGs for a 400-entity corpus drawn
            from the S&P 500 and Fortune 500. The ground truth was assembled from the same EDGAR filings using
            an independent reference implementation, sealed with SHA-256 before any pipeline contact.
          </p>
          <p style={S.p}>
            This task matters for financial compliance, competitive intelligence, and regulatory reporting.
            Who owns what — and can you prove it from public filings, without LLM guessing? CITADEL answers
            that question deterministically.
          </p>
        </section>

        <hr style={S.divider} />

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Results</h2>
          <div style={{ marginBottom: "1.5rem" }}>
            <Table
              headers={["Metric", "Value", "95% CI (BCa, B=2000)"]}
              rows={[
                ["Micro F1", "0.6161", "[0.5282 – 0.6740]"],
                ["Micro Precision", "0.6523", "—"],
                ["Micro Recall", "0.5836", "—"],
                ["Macro F1", "0.5936", "[0.5551 – 0.6251]"],
                ["Entities scored", "342", "of 400 in corpus"],
                ["Entities with ≥1 TP", "290", "—"],
                ["TP / FP / FN", "23,999 / 12,791 / 17,120", "—"],
              ]}
            />
          </div>
          <p style={{ ...S.p, fontSize: "0.8125rem" }}>
            Confidence intervals computed via BCa bootstrap (B=2,000). Ground truth SHA:
            <code style={{ marginLeft: "0.375rem" }}>4911f158...cf54c</code> (verified).
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Methodology arc</h2>
          <p style={{ ...S.p, marginBottom: "1.25rem" }}>
            CITADEL has a documented checkpoint arc showing per-fix attribution:
          </p>
          <Table
            headers={["Checkpoint", "Micro F1", "Delta", "Fix"]}
            rows={[
              ["D (baseline)", "0.6025", "—", "Initial reconstruction, 5 sessions"],
              ["E (regression)", "0.5774", "−0.0251", "Code change introduced normalization regression"],
              ["E.1", "0.5826", "+0.0052", "Class A: _INLINE_JUR regex fix + _SKIP plural + SEC disclaimer"],
              ["E.2 (current seal)", "0.6161", "+0.0335", "Class B: canonical 3-fallback Exhibit 21 document finder"],
            ]}
          />
          <p style={{ ...S.p, fontSize: "0.8125rem", marginTop: "1rem" }}>
            Each fix is scoped, attributed, and re-scored in isolation. The regression at Checkpoint E
            is documented openly — CITADEL declined before recovering, and the arc shows why.
          </p>
        </section>

        <hr style={S.divider} />

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Reproducibility</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { label: "Corpus SHA-256 (E.2)", value: "a6a98dbb30794fb98413129c3a9855af2214f840b1a1fe74e5175485dab99d81" },
              { label: "Ground truth SHA-256", value: "4911f15899f4a9b6fa342de27470c828887569320b9c7f9da231d516e86cf54c" },
              { label: "Entities in corpus", value: "400" },
              { label: "Repo", value: "github.com/jourdanlabs/benchmarks/citadel" },
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
              <strong style={{ color: "var(--text-primary)" }}>42 systematic zero-TP entities.</strong>{" "}
              Root causes include: PDF-embedded Exhibit 21 documents (Class C1, structural), abbreviated
              filings under SEC Rule 601(b)(21)(ii), and GLEIF-only fallback coverage.
            </p>
            <p style={S.p}>
              <strong style={{ color: "var(--text-primary)" }}>HCA Healthcare (2,578 GT relationships, 0 TP).</strong>{" "}
              EX-21 document found but contains zero parseable subsidiaries in the expected HTML format.
              Likely cause: PDF embed or non-standard layout. Class C1 structural issue.
            </p>
            <p style={S.p}>
              <strong style={{ color: "var(--text-primary)" }}>Coverage ceiling at F1 ~0.62.</strong>{" "}
              Class C structural issues represent the ceiling without new data sources.
            </p>
            <p style={{ ...S.p, marginBottom: 0 }}>
              <strong style={{ color: "var(--text-primary)" }}>Ground truth assembled from same source.</strong>{" "}
              Ground truth was assembled from EDGAR filings using an independent implementation, but shares the same
              upstream data source as the pipeline. Off-EDGAR data was not incorporated.
            </p>
          </div>
        </section>

        <section>
          <h2 style={S.sectionTitle}>Next version</h2>
          <p style={S.p}>
            Checkpoint F targets Class C1 structural issues: multi-part exhibit ingestion, prior-year filing
            fallback, and REIT-specific subsidiary structure detection. The 42 systematic zero-TP entities
            are the known gap list.
          </p>
        </section>

        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--bg-border)", display: "flex", gap: "1.5rem" }}>
          <a href="https://github.com/jourdanlabs/benchmarks/tree/main/citadel" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
            GitHub →
          </a>
          <Link href="/crucible/reproducibility" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Reproducibility guide →
          </Link>
        </div>
      </div>
    </article>
  );
}
