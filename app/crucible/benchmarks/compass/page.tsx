import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "COMPASS — Reading-Level Calibration",
  description:
    "Reading-level complexity calibration on research papers. 15/15 within-1-tier.",
};

const container: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "0 2rem",
};

export default function CompassPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div style={{ ...container, paddingTop: "1.5rem" }}>
        <Link
          href="/crucible/benchmarks"
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary)",
          }}
        >
          ← BENCHMARKS / COMPASS · READING COMPLEXITY
        </Link>
      </div>

      {/* Hero */}
      <section style={{ padding: "3rem 0 4rem" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            <Reveal>
              <div className="smallcaps" style={{ marginBottom: "1rem" }}>
                COMPASS · READING COMPLEXITY
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
                COMPASS
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
                Reading-level calibration.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div style={{ position: "relative", width: "100%", height: 400 }}>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/asset_xwb60whwj_1777097497293.png-5THEe1VXhSjEEImssYsTCzJgEjkz05.jpeg"
                  alt="COMPASS navigation artifact"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
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
              { value: "15/15", label: "WITHIN-1-TIER" },
              { value: "Research", label: "PAPERS" },
              { value: "Calibrated", label: "TIER ASSIGNMENT" },
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

      {/* What It Is */}
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
              COMPASS tests reading-level complexity calibration on research papers. The system
              must classify text complexity within one tier of the ground-truth label. Research
              papers are the hardest category — they combine technical vocabulary,
              discipline-specific knowledge, and high inferential demand.
            </p>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
              }}
            >
              The 15/15 within-1-tier result means every research paper in the test set was
              assigned a complexity tier within one level of its ground-truth classification.
              Surface metrics (Flesch-Kincaid, Gunning Fog) routinely mis-classify research
              papers. COMPASS gets all 15 within one tier.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Methodology */}
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
              Methodology
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "Corpus", value: "Sealed research paper corpus" },
                { label: "Baselines", value: "Flesch-Kincaid, Gunning Fog, Coleman-Liau" },
                { label: "Pipeline", value: "Multi-dimensional complexity scoring" },
                { label: "Metric", value: "Within-1-tier accuracy" },
                { label: "Dimensions", value: "Vocabulary, domain-specificity, argument structure, inferential load" },
                { label: "Reproducibility", value: "Full instructions in GitHub repo" },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    fontSize: "0.875rem",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid var(--bg-border)",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-tertiary)",
                      minWidth: 140,
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {row.label}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Reproducibility / Limitations */}
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
                  <span style={{ color: "var(--text-tertiary)" }}>Corpus</span>
                  <span style={{ color: "var(--text-secondary)" }}>15 research papers (sealed)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Metric</span>
                  <span style={{ color: "var(--text-secondary)" }}>Within-1-tier classification</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Repo</span>
                  <span style={{ color: "var(--text-secondary)" }}>github.com/jourdanlabs/benchmarks/compass</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
                Limitations
              </div>
              <div style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Within-1-tier, not exact.</strong>{" "}
                  Metric counts within-1-tier matches, not exact matches. Exact-match
                  accuracy is lower and documented in repo.
                </p>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>English-only.</strong>{" "}
                  Corpus and pipeline are English-language only. Multilingual calibration
                  out of scope.
                </p>
                <p>
                  <strong style={{ color: "var(--text-primary)" }}>Domain coverage.</strong>{" "}
                  Tier system designed for benchmark corpus document types. Novel document
                  types may produce degraded calibration.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
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

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .repro-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
