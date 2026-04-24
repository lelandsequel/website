import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "RAVEN — Memory Validation for AI Agents",
  description:
    "RAVEN is a seven-engine memory validation pipeline. It runs after retrieval, validating memories before agents see them.",
};

const container: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "0 2rem",
};

const PIPELINE = [
  { id: "01", name: "RAVEN", label: "Retrieval" },
  { id: "02", name: "METEOR", label: "Entity normalization" },
  { id: "03", name: "NOVA", label: "Causal chain construction" },
  { id: "04", name: "ECLIPSE", label: "Temporal decay" },
  { id: "05", name: "PULSAR", label: "Contradiction detection" },
  { id: "06", name: "QUASAR", label: "Importance ranking" },
  { id: "07", name: "AURORA", label: "Confidence gate", highlight: true },
];

export default function RavenPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div style={{ ...container, paddingTop: "1.5rem" }}>
        <Link
          href="/crucible"
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary)",
          }}
        >
          ← CRUCIBLE / RAVEN
        </Link>
      </div>

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section style={{ padding: "3rem 0 4rem" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "3rem",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            <Reveal>
              <div className="smallcaps" style={{ marginBottom: "1rem" }}>
                CRUCIBLE / RAVEN &middot; OPEN SOURCE
              </div>
              <h1
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                  fontWeight: 400,
                  lineHeight: 1.05,
                  color: "var(--text-primary)",
                  marginBottom: "1.5rem",
                }}
              >
                Memory validation
                <br />
                for AI agents.
              </h1>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  color: "var(--text-secondary)",
                  maxWidth: 440,
                  marginBottom: "2rem",
                }}
              >
                RAVEN is a seven-engine memory validation pipeline. It
                doesn&apos;t compete with retrieval systems — it runs after
                them. Every memory passes through entity normalization, causal
                chain construction, temporal decay, contradiction detection,
                importance ranking, and a confidence gate before the agent sees
                it.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a
                  href="https://github.com/jourdanlabs/raven"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.875rem 1.5rem",
                    backgroundColor: "var(--text-primary)",
                    color: "var(--bg)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  View on GitHub
                  <span>→</span>
                </a>
                <Link
                  href="/benchmarks/muninn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.875rem 1.5rem",
                    border: "1px solid var(--accent)",
                    color: "var(--accent)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Read the MUNINN Benchmark
                </Link>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1/1",
                }}
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/asset_yb78d9eoz_1777045469087-cJVav7s8xjRYeVkNVxCsWpbyWC690k.png"
                  alt="RAVEN artifact - bronze raven sculpture"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────── POSITIONING ─────────────────── */}
      <section
        style={{
          padding: "4rem 0",
          backgroundColor: "var(--bg-card)",
          borderTop: "1px solid var(--bg-border)",
          borderBottom: "1px solid var(--bg-border)",
        }}
      >
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
              Positioning
            </div>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "2rem",
              }}
            >
              Retrieval and validation are different layers.
            </h2>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
              gap: "2rem",
              alignItems: "stretch",
            }}
            className="positioning-grid"
          >
            <Reveal delay={100}>
              <div
                style={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--bg-border)",
                  borderRadius: 8,
                  padding: "1.5rem",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "var(--text-primary)",
                    marginBottom: "1rem",
                  }}
                >
                  RETRIEVAL
                </div>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "1rem" }}>
                  Systems like MemPalace store verbatim and find later via
                  semantic search. They return chunks — including contradictions,
                  stale facts, and importance-inverted noise.
                </p>
                <p style={{ fontSize: "0.8125rem", lineHeight: 1.5, color: "var(--text-tertiary)", fontStyle: "italic" }}>
                  The retrieval layer trusts the agent to sort the results.
                </p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0 1rem",
                }}
              >
                <svg width="60" height="16" viewBox="0 0 60 16" fill="none">
                  <path d="M0 8H56M56 8L48 2M56 8L48 14" stroke="var(--text-tertiary)" strokeWidth="1.5" />
                </svg>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-tertiary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  retrieval → validation
                </span>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div
                style={{
                  backgroundColor: "var(--bg)",
                  border: "2px solid var(--accent)",
                  borderRadius: 8,
                  padding: "1.5rem",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "var(--accent)",
                    marginBottom: "1rem",
                  }}
                >
                  VALIDATION
                </div>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "1rem" }}>
                  RAVEN runs after retrieval. Every returned memory passes
                  through the seven-engine pipeline. Contradictions are flagged.
                  Low-confidence results are refused. The agent only sees
                  validated memories.
                </p>
                <p style={{ fontSize: "0.8125rem", lineHeight: 1.5, color: "var(--text-tertiary)", fontStyle: "italic" }}>
                  The validation layer sorts before the agent sees.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────── PIPELINE ─────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "2rem", color: "var(--accent)" }}>
              Pipeline
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                overflowX: "auto",
                paddingBottom: "1rem",
              }}
            >
              {PIPELINE.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 90,
                    }}
                  >
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: p.highlight ? "rgba(184, 90, 46, 0.1)" : "var(--bg-card)",
                        border: p.highlight ? "2px solid var(--accent)" : "1px solid var(--bg-border)",
                        borderRadius: "50%",
                        marginBottom: "0.75rem",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        color: p.highlight ? "var(--accent)" : "var(--text-primary)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {p.id} {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.625rem",
                        color: p.highlight ? "var(--accent)" : "var(--text-tertiary)",
                        textAlign: "center",
                      }}
                    >
                      {p.label}
                    </div>
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" style={{ flexShrink: 0, marginTop: 20 }}>
                      <path d="M0 5H18M18 5L14 1M18 5L14 9" stroke="var(--text-tertiary)" strokeWidth="1" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── STATS ─────────────────── */}
      <section
        style={{
          padding: "3rem 0",
          backgroundColor: "var(--bg-card)",
          borderTop: "1px solid var(--bg-border)",
          borderBottom: "1px solid var(--bg-border)",
        }}
      >
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
              { value: "91.7%", label: "AURORA VANTAGE" },
              { value: "98%", label: "ADVERSARIAL" },
              { value: "MIT", label: "LICENSE" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 8,
                    padding: "2rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(2rem, 5vw, 3rem)",
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

      {/* ─────────────────── SHIPPING DETAILS ─────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "2rem", color: "var(--accent)" }}>
              Shipping Details
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "1.5rem",
            }}
            className="details-grid"
          >
            {[
              {
                title: "Open source.",
                desc: "MIT licensed. Repository is public.",
              },
              {
                title: "Deterministic heuristics (v1).",
                desc: "Engines are heuristic. No LLM calls at runtime. Fully reproducible.",
              },
              {
                title: "v2 roadmap.",
                desc: "LLM-inference upgrades to NOVA (causal) and PULSAR (contradiction) planned.",
              },
            ].map((d, i) => (
              <Reveal key={d.title} delay={i * 80}>
                <div
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 8,
                    padding: "1.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {d.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", lineHeight: 1.55, color: "var(--text-secondary)" }}>
                    {d.desc}
                  </p>
                </div>
              </Reveal>
            ))}
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
          <span style={{ fontStyle: "italic" }}>RAVEN is named after Raven Lenore &middot; 2000–2020</span>
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
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .positioning-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .details-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
