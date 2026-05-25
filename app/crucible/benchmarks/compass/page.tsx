import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "COMPASS — Reading-Level Calibration",
  description:
    "Calibrated reading-level assessment. 15/15 within-1-tier on the research-paper category.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  sectionTitle: { fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.875rem" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  divider: { border: "none", borderTop: "1px solid var(--bg-border)", margin: "3rem 0" },
};

export default function CompassPage() {
  return (
    <article style={{ padding: "5rem 0 6rem" }}>
      <div style={S.container}>
        <div style={{ marginBottom: "3rem" }}>
          <Link href="/crucible/benchmarks" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2rem" }}>← Benchmarks</Link>
          <span style={{ ...S.label, marginBottom: "1rem" }}>COMPASS · Reading-Level Calibration</span>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "0.75rem" }}>COMPASS</h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Calibrated reading-level assessment for technical documents.
          </p>
        </div>

        <div style={{ border: "1px solid var(--bg-border)", padding: "2rem", marginBottom: "3rem", backgroundColor: "var(--bg-card)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {[
              { label: "Research papers (within-1-tier)", value: "15/15" },
              { label: "Task type", value: "Classification" },
              { label: "Hardest category", value: "Research papers" },
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
            COMPASS calibrates reading-level assessments for documents across a complexity spectrum.
            Existing tools (Flesch-Kincaid, Gunning Fog, Coleman-Liau) score surface features —
            sentence length, syllable count, word frequency — and produce numbers that are easy to game
            and poor predictors of actual comprehension difficulty for technical documents.
          </p>
          <p style={S.p}>
            COSMIC's COMPASS pipeline scores documents across multiple dimensions (vocabulary complexity,
            domain-specificity, argument structure, inferential load) and produces a calibrated tier
            assignment rather than a raw score. The within-1-tier metric is the key performance indicator:
            a within-1-tier error means the system assigned a tier adjacent to the correct tier, which is
            an acceptable placement for most real-world applications.
          </p>
          <p style={S.p}>
            The 15/15 result on the research-paper category is the headline number because research papers
            are the hardest category — they combine technical vocabulary, discipline-specific knowledge,
            and high inferential demand. Surface metrics routinely mis-classify research papers as
            below their actual difficulty. COMPASS gets all 15 within one tier.
          </p>
        </section>

        <hr style={S.divider} />

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Limitations</h2>
          <div style={{ borderLeft: "2px solid var(--bg-border)", paddingLeft: "1.5rem" }}>
            <p style={S.p}>
              <strong style={{ color: "var(--text-primary)" }}>Within-1-tier, not exact.</strong> The 15/15 metric
              counts within-1-tier matches, not exact matches. Exact-match accuracy on the research-paper
              category is documented in the repo and is lower.
            </p>
            <p style={S.p}>
              <strong style={{ color: "var(--text-primary)" }}>English-only.</strong> The corpus and pipeline
              are English-language only. Multilingual reading-level calibration is out of scope.
            </p>
            <p style={{ ...S.p, marginBottom: 0 }}>
              <strong style={{ color: "var(--text-primary)" }}>Domain coverage.</strong> The tier system was
              designed for the document types in the benchmark corpus. Novel document types not represented
              in the sealed corpus may produce degraded calibration.
            </p>
          </div>
        </section>

        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--bg-border)", display: "flex", gap: "1.5rem" }}>
          <a href="https://github.com/jourdanlabs/benchmarks/tree/main/compass" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>GitHub →</a>
          <Link href="/crucible/reproducibility" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Reproducibility guide →</Link>
        </div>
      </div>
    </article>
  );
}
