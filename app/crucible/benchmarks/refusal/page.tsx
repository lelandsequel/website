import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "REFUSAL Benchmark — Structured Refusal Accuracy",
  description:
    "Whether a memory system refuses for the right reason. Five typed reasons, 200 queries, 40 per type. RAVEN v1.1 reaches 100% precision and per-type recall.",
};

const container: React.CSSProperties = {
  width: "92%",
  maxWidth: 1600,
  margin: "0 auto",
};

const RESULTS = [
  {
    system: "RAVEN v1.0 (insufficient_evidence always)",
    accuracy: "100%",
    precision: "20%",
    recall: "0.20",
  },
  {
    system: "LLM-judge (stub)",
    accuracy: "100%",
    precision: "22.5%",
    recall: "0.23",
  },
  {
    system: "RAVEN v1.1 (capability 1.3)",
    accuracy: "100%",
    precision: "100%",
    recall: "1.00",
    highlight: true,
  },
];

export default function RefusalPage() {
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
          ← BENCHMARKS / REFUSAL · STRUCTURED REFUSAL ACCURACY
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
                REFUSAL · STRUCTURED REFUSAL ACCURACY
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
                REFUSAL
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
                Refuse for the right reason — and tell the caller which one,
                with a recommended action.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div style={{ position: "relative", width: "100%", height: 400 }}>
                <Image
                  src="/raven-checkmark.jpg"
                  alt="REFUSAL benchmark artifact - checkmark"
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
              { value: "100%", label: "PRECISION · PER-TYPE RECALL" },
              { value: "200", label: "QUERIES · 5 TYPES × 40" },
              { value: "v1.1", label: "RAVEN CAPABILITY 1.3 (SEALED)" },
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
              Whether a memory system refuses for the RIGHT REASON, not just whether it refuses.
              Five refusal types (insufficient evidence, conflicting evidence unresolvable,
              staleness threshold exceeded, identity ambiguous, scope violation) each get 40
              representative queries. The benchmark measures (a) refusal accuracy — did the
              system refuse when it should have, (b) refusal precision — when it refused, was
              the type correct, and (c) per-type recall — how often did it catch each type.
            </p>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
              }}
            >
              A system that returns &quot;insufficient evidence&quot; for every refusal can hit 100%
              accuracy and 20% precision. RAVEN v1.0 did exactly that. v1.1 distinguishes the
              type, attaches a recommended action, and ships the audit hash — so callers know
              whether to gather more evidence, run a fresher query, or escalate to a human.
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
              Results
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ border: "1px solid var(--bg-border)", borderRadius: 4, overflow: "hidden" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 6rem 6rem 8rem",
                  padding: "0.75rem 1rem",
                  borderBottom: "1px solid var(--bg-border)",
                  backgroundColor: "var(--bg)",
                }}
              >
                {["System", "Accuracy", "Precision", "Per-type recall (avg)"].map((h) => (
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
                    gridTemplateColumns: "1fr 6rem 6rem 8rem",
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
                      color: "var(--text-primary)",
                    }}
                  >
                    {row.accuracy}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: row.highlight ? "var(--accent)" : "var(--text-primary)",
                    }}
                  >
                    {row.precision}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: row.highlight ? "var(--accent)" : "var(--text-primary)",
                    }}
                  >
                    {row.recall}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.75rem", fontStyle: "italic" }}>
            Accuracy is whether the system refused when it should have. Precision is whether
            the chosen refusal type matched the labeled type. LLM-judge is a stub; a real
            GPT-4-class run is non-deterministic and included for orientation only.
          </p>
        </div>
      </section>

      {/* Refusal types */}
      <section style={{ padding: "4rem 0" }}>
        <div style={{ ...container, maxWidth: 900 }}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem", color: "var(--accent)" }}>
              Refusal taxonomy
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { type: "insufficient_evidence", desc: "Not enough corroborating evidence to surface the claim." },
                { type: "conflicting_evidence_unresolvable", desc: "Contradictions present and reconciliation cannot pick a winner." },
                { type: "staleness_threshold_exceeded", desc: "Decay places the memory below the per-class confidence floor." },
                { type: "identity_ambiguous", desc: "METEOR cannot uniquely resolve the entity in the query." },
                { type: "scope_violation", desc: "Query falls outside the declared scope of the memory store." },
              ].map((row) => (
                <div
                  key={row.type}
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
                      color: "var(--accent)",
                      minWidth: 240,
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {row.type}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{row.desc}</span>
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
                    c17b67b1167f30beb824587d2af66ff72ac27adfbb7894f2cc5a2e711042f9b0
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Queries</span>
                  <span style={{ color: "var(--text-secondary)" }}>200 (40 per type × 5 types)</span>
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
                  <strong style={{ color: "var(--text-primary)" }}>Single-label per query.</strong>{" "}
                  Each refusal-eligible query has one correct refusal type. Real queries
                  may be refusable on multiple grounds; the benchmark scores against the
                  primary one.
                </p>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Over-refusal not measured here.</strong>{" "}
                  This benchmark measures refusal correctness, not refusal calibration.
                  AURORA over-refusal (LongMemEval refused 473/500) is the explicit Phase 2.1
                  calibration target.
                </p>
                <p>
                  <strong style={{ color: "var(--text-primary)" }}>Five types.</strong>{" "}
                  Production deployments may want sub-types (e.g., temporal vs. spatial
                  scope violation). The taxonomy is extensible.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Cookbook callout */}
      <section style={{ padding: "4rem 0" }}>
        <div style={{ ...container, maxWidth: 900 }}>
          <Reveal>
            <div
              style={{
                backgroundColor: "rgba(184, 90, 46, 0.08)",
                border: "1px solid var(--accent-border)",
                borderRadius: 8,
                padding: "1.5rem 2rem",
              }}
            >
              <div
                className="smallcaps"
                style={{ marginBottom: "0.5rem", color: "var(--accent)" }}
              >
                Refusal cookbook
              </div>
              <p
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                }}
              >
                Each refusal type ships with a recommended action — gather more evidence,
                resolve the contradiction, request a fresher source, disambiguate the entity,
                or decline scope. The cookbook lives in the RAVEN repository at{" "}
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", color: "var(--text-primary)" }}>
                  docs/refusal_cookbook.md
                </span>
                .
              </p>
            </div>
          </Reveal>
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
