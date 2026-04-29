import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "MUNINN v2 — Contradiction Reconciliation Benchmark",
  description:
    "Whether a memory validation system can resolve contradictions correctly — not just detect them. 25 reconciliable pairs across four bases. RAVEN v1.1 reaches 100%.",
};

const container: React.CSSProperties = {
  width: "92%",
  maxWidth: 1600,
  margin: "0 auto",
};

const RESULTS = [
  { system: "Pass-through", accuracy: "0%", notes: "Returns both; never picks" },
  { system: "RAVEN v1.0 (PULSAR refuses)", accuracy: "18%", notes: "Detects contradictions but doesn't reconcile" },
  { system: "LLM-judge (gpt-4-class, stub)", accuracy: "100%", notes: "Stub — real GPT-4 ~$4/run" },
  { system: "RAVEN v1.1 (capability 1.1)", accuracy: "100%", notes: "All 4 bases", highlight: true },
];

export default function MuninnV2ReconciliationPage() {
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
          ← BENCHMARKS / MUNINN v2 · CONTRADICTION RECONCILIATION
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
                MUNINN v2 · CONTRADICTION RECONCILIATION
              </div>
              <h1
                style={{
                  fontSize: "clamp(2.25rem, 6vw, 4.25rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                  color: "var(--text-primary)",
                  marginBottom: "1.5rem",
                }}
              >
                MUNINN v2
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
                Reconciliation, not just detection — pick the surviving claim
                with a full audit trail.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div style={{ position: "relative", width: "100%", height: 400 }}>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fbYaWPz4%202-lQComK756p03kGuoNSP4BJgzeG7QSZ.png"
                  alt="MUNINN twin-ravens artifact"
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
              { value: "100%", label: "RECONCILIATION ACCURACY" },
              { value: "25", label: "RECONCILIABLE PAIRS · 4 BASES" },
              { value: "v1.1", label: "RAVEN CAPABILITY 1.1 (SEALED)" },
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
              Whether a memory validation system can resolve contradictions correctly — not just
              detect them. Contradictions arrive in pairs labeled with the correct reconciliation
              basis (temporal, importance, evidence strength, identity). The benchmark measures
              how often the system picks the correct winner AND attributes the right reason.
            </p>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
              }}
            >
              MUNINN v1 measured detection — could you find the contradiction. v2 measures
              what comes after detection: which claim survives, and on what grounds. PULSAR
              flags the conflict; the four-rule hierarchy (identity → temporal → evidence
              strength → importance) decides the winner.
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
                  gridTemplateColumns: "1fr 6rem 1fr",
                  padding: "0.75rem 1rem",
                  borderBottom: "1px solid var(--bg-border)",
                  backgroundColor: "var(--bg)",
                }}
              >
                {["System", "Accuracy", "Notes"].map((h) => (
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
                    gridTemplateColumns: "1fr 6rem 1fr",
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
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {row.notes}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.75rem", fontStyle: "italic" }}>
            LLM-judge baseline is a stub; a real GPT-4-class run is approximately $4/sweep and
            included for orientation only. Pass-through and RAVEN v1.0 are deterministic.
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
                { label: "Corpus", value: "25 reconciliable pairs across 4 bases (temporal, importance, evidence strength, identity)" },
                { label: "Reconciler", value: "Four-rule hierarchy: identity → temporal → evidence strength → importance" },
                { label: "Baselines", value: "Pass-through, RAVEN v1.0 PULSAR, LLM-judge (stub)" },
                { label: "Audit trail", value: "SHA-256(winner | loser | basis | sorted evidence chain)" },
                { label: "Pipeline", value: "Deterministic, no LLM inference at runtime" },
                { label: "Reproducibility", value: "Full instructions in RAVEN repo" },
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
                    5ec679af53bcbb610d491133f1759bd07534abc467c68c2783f64d8d901c90af
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Pairs</span>
                  <span style={{ color: "var(--text-secondary)" }}>25 across 4 bases</span>
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
                  <strong style={{ color: "var(--text-primary)" }}>Curated reconciliable pairs.</strong>{" "}
                  Each pair is hand-labeled with the intended reconciliation basis. Real-world
                  contradictions may be ambiguous about which basis applies.
                </p>
                <p style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Single-language corpus.</strong>{" "}
                  English only; cross-lingual reconciliation is out of scope for v1.1.
                </p>
                <p>
                  <strong style={{ color: "var(--text-primary)" }}>LLM-judge non-determinism.</strong>{" "}
                  The LLM-judge baseline reported here is a stub. A real GPT-4 sweep would be
                  non-deterministic and approximately $4/run.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Audit trail callout */}
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
                Audit trail
              </div>
              <p
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                }}
              >
                Every reconciliation decision carries{" "}
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", color: "var(--text-primary)" }}>
                  SHA-256(winner | loser | basis | sorted evidence chain)
                </span>
                . Replay any decision and verify the same hash, or surface the chain to a human
                reviewer. Reconciliation is not silent.
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
