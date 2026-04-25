import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "MUNINN — Memory Validation Benchmark",
  description:
    "The first benchmark for memory validation pipelines — contradiction detection, importance ranking, and honest refusal on retrieved memories.",
};

const container: React.CSSProperties = {
  width: "92%",
  maxWidth: 1600,
  margin: "0 auto",
};

const RESULTS = [
  { system: "RAVEN v0.1 (COSMIC)", f1: "0.847", recall: "0.921", refusal: "17.3% — reported per-class", highlight: true },
  { system: "Pass-through baseline (no validation)", f1: "0.412", recall: "0.000", refusal: "0.000" },
  { system: "Simple dedup baseline", f1: "0.503", recall: "0.114", refusal: "0.000" },
  { system: "LLM-judge baseline", f1: "0.681", recall: "0.742", refusal: "variable" },
];

export default function MuninnPage() {
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
          ← BENCHMARKS / MUNINN &middot; MEMORY VALIDATION
        </Link>
      </div>

      {/* ─────────────────────────── HERO ─────────────────────────── */}
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
                MUNINN &middot; MEMORY VALIDATION
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
                MUNINN
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
                The first benchmark for memory validation pipelines —
                contradiction detection, importance ranking, and honest refusal on
                retrieved memories.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div style={{ position: "relative", width: "100%", height: 400 }}>
                <Image
                  src="/benchmark-muninn.png"
                  alt="MUNINN memory validation benchmark artifact - two ravens facing each other"
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

      {/* ─────────────────── STATS ─────────────────── */}
      <section
        style={{
          padding: "0 0 4rem",
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
              { value: "0.847", label: "VALIDATION F1" },
              { value: "0.921", label: "CONTRADICTION RECALL" },
              { value: "17.3%", label: "REFUSAL RATE" },
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
                      fontSize: "clamp(2rem, 5vw, 3.5rem)",
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

      {/* ─────────────────── WHAT IT MEASURES ─────────────────── */}
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
              Muninn is the first public benchmark that measures memory validation — what happens
              after retrieval. Given a set of retrieved memories (from any retrieval system,
              including MemPalace), a validation pipeline must detect contradictions, rank by
              importance, apply temporal decay, and refuse to surface low-confidence results.
            </p>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                marginBottom: "2rem",
              }}
            >
              Existing memory benchmarks (LongMemEval, others) measure retrieval recall — did you
              find the right chunk? Muninn measures the next layer — once you have the chunks, can
              you tell which are reliable, which contradict each other, and which the agent should
              never see?
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div
              style={{
                backgroundColor: "rgba(184, 90, 46, 0.08)",
                border: "1px solid var(--accent-border)",
                borderRadius: 8,
                padding: "1.5rem 2rem",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  lineHeight: 1.5,
                  color: "var(--accent)",
                }}
              >
                Muninn is complementary to LongMemEval, not a replacement.
                <br />
                Retrieval and validation are different problems.
              </p>
            </div>
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
                  gridTemplateColumns: "1fr 6rem 8rem 10rem",
                  padding: "0.75rem 1rem",
                  borderBottom: "1px solid var(--bg-border)",
                  backgroundColor: "var(--bg)",
                }}
              >
                {["System", "Validation F1", "Contradiction Recall", "Refusal Rate"].map((h) => (
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
                    gridTemplateColumns: "1fr 6rem 8rem 10rem",
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
            Baselines are real implementations. Pass-through returns all retrieved memories unfiltered.
            LLM-judge uses GPT-4-class judgment — non-deterministic, included for reference only.
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
                  <span style={{ color: "var(--text-secondary)" }}>Curated memory sets, public domain</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Corpus seal</span>
                  <span style={{ color: "var(--text-secondary)" }}>SHA-256 in CHECKPOINT_RESULTS.md</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Repo</span>
                  <span style={{ color: "var(--text-secondary)" }}>github.com/jourdanlabs/benchmarks/muninn</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
                Limitations
              </div>
              <div style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Synthetic contradiction injection.</strong>{" "}
                  Some contradictions are synthetically injected into the corpus. Real-world contradictions may differ in distribution.
                </p>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Retrieval assumed perfect.</strong>{" "}
                  Muninn evaluates validation given retrieved results. It does not evaluate retrieval itself — that&apos;s LongMemEval&apos;s domain.
                </p>
                <p>
                  <strong style={{ color: "var(--text-primary)" }}>LLM-judge non-determinism.</strong>{" "}
                  The LLM-judge baseline uses non-deterministic inference. Reported score is median of 5 runs.
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

      {/* Responsive overrides */}
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
