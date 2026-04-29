import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "DECAY Benchmark — Per-Class Memory Decay",
  description:
    "Whether a memory system applies the right decay curve to the right kind of memory. 5 classes × 6 horizons. RAVEN v1.1 reaches 100%.",
};

const container: React.CSSProperties = {
  width: "92%",
  maxWidth: 1600,
  margin: "0 auto",
};

const RESULTS = [
  { system: "LLM-judge (stub)", accuracy: "0%" },
  { system: "MemPalace (stub)", accuracy: "9.7%" },
  { system: "No-decay", accuracy: "16.1%" },
  { system: "Uniform-decay (single 30d half-life)", accuracy: "25.8%" },
  { system: "RAVEN v1.1 (capability 1.2)", accuracy: "100%", highlight: true },
];

export default function DecayPage() {
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
          ← BENCHMARKS / DECAY · PER-CLASS MEMORY DECAY
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
                DECAY · PER-CLASS MEMORY DECAY
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
                DECAY
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
                Right curve, right memory class — facts, preferences, and
                identity claims age on different clocks.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div style={{ position: "relative", width: "100%", height: 400 }}>
                <Image
                  src="/raven-hourglass.jpg"
                  alt="DECAY benchmark artifact - hourglass"
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
              { value: "100%", label: "DECAY-AWARE RECALL" },
              { value: "310", label: "QUERIES · 5 CLASSES × 6 HORIZONS" },
              { value: "v1.1", label: "RAVEN CAPABILITY 1.2 (SEALED)" },
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

      {/* What It Measures */}
      <section style={{ padding: "4rem 0", borderTop: "1px solid var(--bg-border)" }}>
        <div style={{ ...container, maxWidth: 900 }}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
              What It Measures
            </div>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                marginBottom: "1rem",
              }}
            >
              Whether a memory system applies the right decay curve to the right kind of memory.
              Identity claims should never decay. Transactional memories should decay in hours.
              Facts in days. Preferences in months. The benchmark sweeps 5 memory classes × 6
              time horizons (1h, 1d, 1w, 1m, 1y, 5y) and checks whether the returned confidence
              falls in the analytically-correct band.
            </p>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
              }}
            >
              A uniform 30-day half-life — the default in most retrieval systems — is wrong on
              both ends. It under-decays transactional memories (which should be near-zero by
              day two) and over-decays identity claims (which should never go below the floor).
              Class-aware ECLIPSE applies the policy that fits each memory.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Results */}
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
              Results — overall accuracy across 310 queries
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ border: "1px solid var(--bg-border)", borderRadius: 4, overflow: "hidden" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 8rem",
                  padding: "0.75rem 1rem",
                  borderBottom: "1px solid var(--bg-border)",
                  backgroundColor: "var(--bg)",
                }}
              >
                {["System", "Accuracy"].map((h) => (
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
                    gridTemplateColumns: "1fr 8rem",
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
                      color: row.highlight ? "var(--accent)" : "var(--text-primary)",
                    }}
                  >
                    {row.accuracy}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.75rem", fontStyle: "italic" }}>
            MemPalace and LLM-judge entries are stubs included for orientation. Uniform-decay
            and No-decay are real reference baselines used inside the RAVEN repo.
          </p>
        </div>
      </section>

      {/* Methodology */}
      <section style={{ padding: "4rem 0" }}>
        <div style={{ ...container, maxWidth: 900 }}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem", color: "var(--accent)" }}>
              Methodology
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "Corpus", value: "310 queries — 300 matrix (5 classes × 6 horizons × 10 reps) + 10 identity controls" },
                { label: "Memory classes", value: "Identity, Fact, Preference, Transactional, Ephemeral" },
                { label: "Horizons", value: "1h, 1d, 1w, 1m, 1y, 5y" },
                { label: "Engine", value: "Class-aware ECLIPSE with 6 built-in decay policies" },
                { label: "Baselines", value: "No-decay, uniform 30d half-life, MemPalace stub, LLM-judge stub" },
                { label: "Pipeline", value: "Deterministic, no LLM inference at runtime" },
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
      <section
        style={{
          padding: "4rem 0",
          backgroundColor: "var(--bg-card)",
          borderTop: "1px solid var(--bg-border)",
          borderBottom: "1px solid var(--bg-border)",
        }}
      >
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
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--bg-border)",
                  borderRadius: 8,
                  padding: "1.5rem",
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.75rem",
                  lineHeight: 1.8,
                }}
              >
                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{ color: "var(--text-tertiary)", marginBottom: "0.25rem" }}>Corpus seal</div>
                  <div style={{ color: "var(--text-secondary)", wordBreak: "break-all", fontSize: "0.6875rem" }}>
                    SHA-256:
                    <br />
                    bd30487a2a1c561b0ffd966ad5bae5f1282dee7e3d71c501c579410c2f085b9a
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Queries</span>
                  <span style={{ color: "var(--text-secondary)" }}>310 (300 matrix + 10 identity)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Repo</span>
                  <span style={{ color: "var(--text-secondary)" }}>github.com/jourdanlabs/raven</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
                Limitations
              </div>
              <div style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Analytical ground truth.</strong>{" "}
                  The expected confidence band per (class, horizon) is derived from the policy
                  itself; success means the engine matches its declared policy. Real-world
                  importance of a given memory may differ from class assignment.
                </p>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Five classes.</strong>{" "}
                  v1.1 ships six built-in policies; production deployments will likely add
                  domain-specific classes (e.g., medication-list).
                </p>
                <p>
                  <strong style={{ color: "var(--text-primary)" }}>Stub baselines.</strong>{" "}
                  MemPalace and LLM-judge here are stubs; their numbers should be treated
                  as orientation, not as competitive results.
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
          <span>Sealed corpora. Publicly reproducible.</span>
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
