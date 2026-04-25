import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "SENTINEL — SOC Triage and Incident Response",
  description:
    "Security operations center alert triage and incident-response routing. 94% held-out accuracy.",
};

const container: React.CSSProperties = {
  width: "92%",
  maxWidth: 1600,
  margin: "0 auto",
};

export default function SentinelPage() {
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
          ← BENCHMARKS / SENTINEL · SECURITY OPERATIONS
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
                SENTINEL · SECURITY OPERATIONS
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
                SENTINEL
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
                SOC triage and incident response.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div style={{ position: "relative", width: "100%", height: 400 }}>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/asset_hh44irhqg_1777097497293.png-fhJhiKQpov9DIYo1xl3Z1KZtdbfOYq.jpeg"
                  alt="SENTINEL lighthouse artifact"
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
              { value: "94%", label: "HELD-OUT ACCURACY" },
              { value: "Sealed", label: "EVALUATION SET" },
              { value: "Pre-Pilot", label: "STATUS" },
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
              SENTINEL tests classification accuracy on Security Operations Center alert triage
              and incident-response routing. The benchmark evaluates the system against a sealed
              held-out set of real-world SOC alerts, measuring the ability to correctly classify
              alerts as true positive, false positive, or requiring escalation.
            </p>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
              }}
            >
              The held-out evaluation set was sealed before any pipeline contact. The 94%
              accuracy figure represents classification performance on alerts the system has
              never seen during development or tuning.
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
                { label: "Corpus", value: "Sealed held-out evaluation set" },
                { label: "Baselines", value: "Baseline comparison documented in repo" },
                { label: "Pipeline", value: "Deterministic classification, no LLM at runtime" },
                { label: "Attribution", value: "Per-fix attribution in methodology arc" },
                { label: "Limitations", value: "SOAR auth gaps documented, pre-pilot status" },
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
                  <span style={{ color: "var(--text-tertiary)" }}>Evaluation set</span>
                  <span style={{ color: "var(--text-secondary)" }}>Sealed held-out alerts</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Seal method</span>
                  <span style={{ color: "var(--text-secondary)" }}>SHA-256 in CHECKPOINT_RESULTS.md</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Repo</span>
                  <span style={{ color: "var(--text-secondary)" }}>github.com/jourdanlabs/benchmarks/sentinel</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
                Limitations
              </div>
              <div style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>SOAR auth unknowns.</strong>{" "}
                  SOAR vendor adapters have documented gap files requiring sign-off before
                  production deployment. Adapters are functional stubs.
                </p>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Pre-pilot status.</strong>{" "}
                  Currently in pre-pilot with a partner organization. No live production
                  deployment yet.
                </p>
                <p>
                  <strong style={{ color: "var(--text-primary)" }}>Feedback loop thresholds.</strong>{" "}
                  FP-rate heuristics are v0 placeholders and require verification before
                  design partner exposure.
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
            width: "92%",
            maxWidth: 1600,
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
