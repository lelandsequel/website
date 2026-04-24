import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LENS — Intent-Based Semantic Search",
  description:
    "Intent-based semantic search for dense technical corpora. Outperforms grep and ripgrep by 25× on intent queries.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  sectionTitle: { fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.875rem" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  divider: { border: "none", borderTop: "1px solid var(--bg-border)", margin: "3rem 0" },
};

export default function LensPage() {
  return (
    <article style={{ padding: "5rem 0 6rem" }}>
      <div style={S.container}>
        <div style={{ marginBottom: "3rem" }}>
          <Link href="/crucible/benchmarks" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2rem" }}>← Benchmarks</Link>
          <span style={{ ...S.label, marginBottom: "1rem" }}>LENS · Semantic Search</span>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "0.75rem" }}>LENS</h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Intent-based semantic search for dense technical corpora.
          </p>
        </div>

        <div style={{ border: "1px solid var(--bg-border)", padding: "2rem", marginBottom: "3rem", backgroundColor: "var(--bg-card)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {[
              { label: "vs grep (intent queries)", value: "25×" },
              { label: "Primary metric", value: "P@5" },
              { label: "Version", value: "v0.3 / v0.4" },
            ].map((m) => (
              <div key={m.label}>
                <div style={{ ...S.label, marginBottom: "0.375rem" }}>{m.label}</div>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "1.75rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.02em" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid var(--accent-border)", borderLeft: "2px solid var(--accent)", padding: "1rem 1.25rem", backgroundColor: "var(--accent-dim)", marginBottom: "3rem" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: "var(--accent)" }}>Note on v0.4:</strong> LENS v0.4 results were pending
            at time of publication. The 25× grep advantage figure comes from v0.3 intent-query evaluation
            and is conservatively stated — v0.4 results may revise upward.
          </p>
        </div>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>What it is</h2>
          <p style={S.p}>
            LENS answers the question that grep cannot: "find me documents about intent X" rather than
            "find me documents containing string Y." For dense technical corpora — regulatory filings,
            clinical documentation, security playbooks, legal contracts — intent-based retrieval is the
            difference between finding what you need and finding everything that happens to share a keyword.
          </p>
          <p style={S.p}>
            The LENS pipeline uses a multi-stage retrieval approach: query understanding, candidate expansion,
            semantic relevance scoring, and AURORA confidence gating on retrieval confidence. Results are
            ranked by a deterministic scoring function that weights document structure, semantic alignment,
            and source authority.
          </p>
          <p style={S.p}>
            The 25× advantage over grep is measured on intent queries. On exact-string queries, LENS and
            grep perform comparably. The benchmark is honest about this: grep wins on exact matches;
            LENS wins on everything else.
          </p>
        </section>

        <hr style={S.divider} />

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Limitations</h2>
          <div style={{ borderLeft: "2px solid var(--bg-border)", paddingLeft: "1.5rem" }}>
            <p style={S.p}>
              <strong style={{ color: "var(--text-primary)" }}>v0.4 results pending.</strong> The v0.4 evaluation
              was in progress at publication time. The 25× figure is from v0.3. This page will be updated
              with the sealed v0.4 result when it lands.
            </p>
            <p style={S.p}>
              <strong style={{ color: "var(--text-primary)" }}>Corpus-specific performance.</strong> LENS
              performance varies by corpus density and query type distribution. The 25× advantage is
              measured on the sealed benchmark corpus; performance on novel corpora is not characterized.
            </p>
            <p style={{ ...S.p, marginBottom: 0 }}>
              <strong style={{ color: "var(--text-primary)" }}>No reranking ablation published.</strong> The
              contribution of each pipeline stage has not been published as a separate ablation.
              Full methodology documented in the repo.
            </p>
          </div>
        </section>

        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--bg-border)", display: "flex", gap: "1.5rem" }}>
          <a href="https://github.com/jourdanlabs/benchmarks/tree/main/lens" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>GitHub →</a>
          <Link href="/crucible/reproducibility" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Reproducibility guide →</Link>
        </div>
      </div>
    </article>
  );
}
