import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Benchmarks — JourdanLabs",
  description:
    "Six public benchmarks spanning pharmacovigilance, entity resolution, SOC triage, factual verification, semantic search, and reading calibration.",
};

const container: React.CSSProperties = {
  maxWidth: 1440,
  margin: "0 auto",
  padding: "0 3rem",
};

const BENCHMARKS = [
  {
    name: "MUNINN",
    domain: "Memory Validation",
    desc: "The first benchmark for memory validation pipelines — contradiction detection, importance ranking, and honest refusal.",
    result: "F1 0.847 · Recall 0.921",
    href: "/benchmarks/muninn",
  },
  {
    name: "SIGNAL",
    domain: "Pharmacovigilance NLP",
    desc: "Adverse drug event extraction from clinical narratives and pharmacovigilance reports.",
    result: "F1 0.639 · 24.3mo median detection",
    href: "/benchmarks/signal",
  },
  {
    name: "CITADEL",
    domain: "Corporate Hierarchy",
    desc: "Entity resolution and hierarchical reasoning over corporate ownership structures.",
    result: "F1 0.616",
    href: "/crucible/benchmarks/citadel",
  },
  {
    name: "SENTINEL",
    domain: "SOC Triage",
    desc: "Security operations center alert triage and prioritization.",
    result: "94% held-out accuracy",
    href: "/crucible/benchmarks/sentinel",
  },
  {
    name: "ORACLE",
    domain: "Factual Verification",
    desc: "Cross-domain factual verification with honest refusal on contested claims.",
    result: "51% vs 31% / 25% baselines",
    href: "/crucible/benchmarks/oracle",
  },
  {
    name: "LENS",
    domain: "Semantic Code Search",
    desc: "Deterministic semantic search over codebases without embedding models.",
    result: "P@5 0.250 deterministic",
    href: "/crucible/benchmarks/lens",
  },
];

export default function BenchmarksPage() {
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
          ← CRUCIBLE / BENCHMARKS
        </Link>
      </div>

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section style={{ padding: "3rem 0 4rem" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem" }}>
              Benchmarks
            </div>
            <h1
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                fontWeight: 400,
                lineHeight: 1.05,
                color: "var(--text-primary)",
                marginBottom: "1.5rem",
                maxWidth: 700,
              }}
            >
              Six sealed benchmarks.
              <br />
              Publicly reproducible.
            </h1>
            <div
              style={{
                width: 60,
                height: 3,
                backgroundColor: "var(--accent)",
                marginBottom: "1.5rem",
              }}
            />
            <p
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.65,
                color: "var(--text-secondary)",
                maxWidth: 560,
              }}
            >
              Every benchmark ships with a sealed corpus, honest baselines, and
              step-by-step reproduction instructions. Engine implementations are
              proprietary — the scoring harnesses and baseline code are not.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── BENCHMARK CARDS ─────────────────── */}
      <section
        style={{
          padding: "4rem 0",
          backgroundColor: "var(--bg-card)",
          borderTop: "1px solid var(--bg-border)",
          borderBottom: "1px solid var(--bg-border)",
        }}
      >
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "1.5rem",
            }}
            className="benchmarks-grid"
          >
            {BENCHMARKS.map((b, i) => (
              <Reveal key={b.name} delay={i * 60}>
                <Link
                  href={b.href}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 8,
                    padding: "1.75rem",
                    height: "100%",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 800,
                        letterSpacing: "0.04em",
                        color: "var(--text-primary)",
                      }}
                    >
                      {b.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        color: "var(--accent)",
                        border: "1px solid var(--accent-border)",
                        padding: "0.125rem 0.5rem",
                        textTransform: "uppercase",
                      }}
                    >
                      {b.domain}
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      lineHeight: 1.55,
                      color: "var(--text-secondary)",
                      marginBottom: "1rem",
                      flex: 1,
                    }}
                  >
                    {b.desc}
                  </p>
                  <div
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.8125rem",
                      color: "var(--text-tertiary)",
                      paddingTop: "0.75rem",
                      borderTop: "1px solid var(--bg-border)",
                    }}
                  >
                    {b.result}
                  </div>
                </Link>
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
          marginTop: "auto",
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
          .benchmarks-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
