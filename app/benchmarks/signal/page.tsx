import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "SIGNAL — Pharmacovigilance NLP Benchmark",
  description:
    "Adverse drug event extraction from clinical narratives and pharmacovigilance reports. F1 0.639, 24.3-month median detection window.",
};

const container: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "0 2rem",
};

const RESULTS = [
  { system: "SIGNAL v0.1 (COSMIC)", f1: "0.639", precision: "0.712", recall: "0.580", refusal: "reported per-class", highlight: true },
  { system: "Keyword baseline", f1: "0.550", precision: "0.481", recall: "0.644", refusal: "0.000" },
  { system: "Dictionary lookup", f1: "0.512", precision: "0.773", recall: "0.384", refusal: "0.000" },
];

export default function SignalPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div style={{ ...container, paddingTop: "1.5rem" }}>
        <Link
          href="/benchmarks"
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary)",
          }}
        >
          ← BENCHMARKS / SIGNAL &middot; PHARMACOVIGILANCE NLP
        </Link>
      </div>

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section style={{ padding: "3rem 0 4rem" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1rem" }}>
              SIGNAL &middot; PHARMACOVIGILANCE NLP
            </div>
            <h1
              style={{
                fontSize: "clamp(3rem, 8vw, 6rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: "var(--text-primary)",
                marginBottom: "1.5rem",
              }}
            >
              SIGNAL
            </h1>
            <p
              style={{
                fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
                fontWeight: 600,
                lineHeight: 1.4,
                color: "var(--text-secondary)",
                maxWidth: 700,
              }}
            >
              Adverse drug event extraction from clinical narratives and
              pharmacovigilance reports.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── STATS ─────────────────── */}
      <section style={{ padding: "0 0 4rem" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "1.5rem",
            }}
            className="stats-grid"
          >
            {[
              { value: "0.639", label: "F1" },
              { value: "24.3", label: "MONTHS MEDIAN DETECTION" },
              { value: "0.712", label: "PRECISION" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 8,
                    padding: "2rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(1.75rem, 4vw, 3rem)",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: "var(--text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── WHAT IT IS ─────────────────── */}
      <section style={{ padding: "4rem 0", borderTop: "1px solid var(--bg-border)" }}>
        <div style={{ ...container, maxWidth: 900 }}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
              What It Is
            </div>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                marginBottom: "1rem",
              }}
            >
              SIGNAL identifies adverse drug events (ADEs) in unstructured clinical text — spontaneous
              reports, case narratives, and pharmacovigilance databases. The 24.3-month median
              detection window represents how far in advance SIGNAL identifies safety signals before
              they appear in regulatory action.
            </p>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
              }}
            >
              Unlike LLM-based extraction pipelines, SIGNAL uses a sealed corpus of FAERS data — a
              public-domain government dataset — combined with a deterministic entity extraction and
              normalization pipeline. No inference is made about causality or severity unless the
              corpus explicitly supports it. Ambiguous mentions trigger honest refusal via AURORA.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── RESULTS ─────────────────── */}
      <section
        style={{
          padding: "4rem 0",
          backgroundColor: "var(--bg-card)",
          borderTop: "1px solid var(--bg-border)",
          borderBottom: "1px solid var(--bg-border)",
        }}
      >
        <div style={{ ...container, maxWidth: 900 }}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem", color: "var(--accent)" }}>
              Results
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ border: "1px solid var(--bg-border)", borderRadius: 4, overflow: "hidden" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 5rem 6rem 5rem 9rem",
                  padding: "0.75rem 1rem",
                  borderBottom: "1px solid var(--bg-border)",
                  backgroundColor: "var(--bg)",
                }}
              >
                {["System", "F1", "Precision", "Recall", "Refusal Rate"].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
              {RESULTS.map((row, i) => (
                <div
                  key={row.system}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 5rem 6rem 5rem 9rem",
                    padding: "1rem",
                    borderBottom: i < RESULTS.length - 1 ? "1px solid var(--bg-border)" : "none",
                    alignItems: "center",
                    backgroundColor: "var(--bg)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: row.highlight ? 600 : 400,
                      color: row.highlight ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  >
                    {row.system}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {row.f1}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.875rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    {row.precision}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.875rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    {row.recall}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.8125rem",
                      color: row.highlight ? "var(--accent)" : "var(--text-tertiary)",
                    }}
                  >
                    {row.refusal}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.75rem", fontStyle: "italic" }}>
            Baselines are real implementations — keyword matching against MedDRA and drug-name dictionary lookup — not straw men.
          </p>
        </div>
      </section>

      {/* ─────────────────── REPRODUCIBILITY / LIMITATIONS ─────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div style={{ ...container, maxWidth: 900 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
            }}
            className="repro-grid"
          >
            <Reveal>
              <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
                Reproducibility
              </div>
              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--bg-border)",
                  borderRadius: 8,
                  padding: "1.5rem",
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.8125rem",
                  lineHeight: 1.8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Corpus source</span>
                  <span style={{ color: "var(--text-secondary)" }}>FDA FAERS (public domain)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Corpus seal</span>
                  <span style={{ color: "var(--text-secondary)" }}>SHA-256 in CHECKPOINT_RESULTS.md</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Repo</span>
                  <span style={{ color: "var(--text-secondary)" }}>github.com/jourdanlabs/benchmarks/signal</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
                Limitations
              </div>
              <div style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>FAERS report quality variance.</strong>{" "}
                  Incomplete, noisy, or duplicative reports can affect extraction quality and downstream signal timing.
                </p>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Causality not inferred.</strong>{" "}
                  SIGNAL does not infer causality or severity unless the corpus explicitly supports it.
                </p>
                <p>
                  <strong style={{ color: "var(--text-primary)" }}>Corpus recency.</strong>{" "}
                  FAERS is updated monthly; detection latency depends on data availability and processing cadence.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────── FOOTER ─────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--bg-border)",
          padding: "1.25rem 2rem",
          backgroundColor: "var(--bg)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <span style={{ fontWeight: 600, letterSpacing: "0.04em" }}>
            JOURDANLABS / HOUSTON, TX
          </span>
          <span>Six benchmarks. Publicly reproducible.</span>
          <a
            href="mailto:leland@jourdanlabs.com"
            style={{ color: "var(--text-secondary)" }}
          >
            leland@jourdanlabs.com
          </a>
        </div>
      </footer>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .repro-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
