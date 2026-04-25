import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "CRUCIBLE Methodology — How CRUCIBLE Validates",
  description:
    "How CRUCIBLE validates JourdanLabs products. VANTAGE diagnostic suite, benchmark program, RAVEN validation, methodology arc with per-fix attribution.",
};

const container: React.CSSProperties = {
  maxWidth: 1440,
  margin: "0 auto",
  padding: "0 3rem",
};

const features = [
  {
    name: "VANTAGE",
    desc: "Structured diagnostic suite. The first layer of validation — scans products for confidence calibration, grounding quality, and refusal behavior.",
    link: "/crucible/vantage",
  },
  {
    name: "Benchmark Program",
    desc: "Public reproducibility layer. Six benchmarks with sealed corpora, honest baselines, and full methodology documentation.",
    link: "/crucible/benchmarks",
  },
  {
    name: "RAVEN",
    desc: "Memory validation layer. Tests retrieval quality against the sealed corpus and validates that grounding claims are actually grounded.",
    link: "/crucible/raven",
  },
];

export default function CrucibleMethodologyPage() {
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
          ← CRUCIBLE / METHODOLOGY
        </Link>
      </div>

      {/* Hero */}
      <section style={{ padding: "3rem 0 4rem" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
              CRUCIBLE / METHODOLOGY
            </div>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--text-primary)",
                marginBottom: "1.5rem",
              }}
            >
              How CRUCIBLE validates.
            </h1>
            <div
              style={{
                width: 60,
                height: 3,
                backgroundColor: "var(--accent)",
                marginBottom: "1.5rem",
              }}
            />
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: "0 0 4rem" }}>
        <div style={{ ...container, maxWidth: 900 }}>
          <Reveal>
            <p
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                marginBottom: "1.5rem",
              }}
            >
              CRUCIBLE is JourdanLabs&apos; research and validation hub. Every product that ships from
              a JourdanLabs division passes through CRUCIBLE validation before it reaches a customer.
              This page documents how that validation works.
            </p>
            <p
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                marginBottom: "1.5rem",
              }}
            >
              The validation stack has three layers: <strong style={{ color: "var(--text-primary)" }}>VANTAGE</strong> as
              the diagnostic suite, the <strong style={{ color: "var(--text-primary)" }}>benchmark program</strong> as
              the public reproducibility layer, and <strong style={{ color: "var(--text-primary)" }}>RAVEN</strong> as
              the memory validation layer.
            </p>
            <p
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                marginBottom: "1.5rem",
              }}
            >
              Every validation run produces a methodology arc with per-fix attribution. When a product
              improves from one version to the next, the improvement is traceable to specific changes.
              When a product regresses, the regression is documented and visible.
            </p>
            <p
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
              }}
            >
              Confidence gating is treated as first-class output. A product that says &quot;I don&apos;t know&quot;
              when it doesn&apos;t know is not failing — it is passing the CRUCIBLE standard.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Feature Cards */}
      <section
        style={{
          backgroundColor: "var(--bg-muted)",
          padding: "4rem 2rem",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem", color: "var(--accent)" }}>
              Validation Layers
            </div>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
            className="features-grid"
          >
            {features.map((f, i) => (
              <Reveal key={f.name} delay={i * 80}>
                <Link
                  href={f.link}
                  style={{
                    display: "block",
                    backgroundColor: "var(--bg-card)",
                    padding: "2rem",
                    borderRadius: "8px",
                    textDecoration: "none",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      letterSpacing: "0.04em",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {f.name}
                  </div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {f.desc}
                  </p>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--accent)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    Learn more →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Arc */}
      <section style={{ padding: "4rem 0" }}>
        <div style={{ ...container, maxWidth: 900 }}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
              Methodology Arc
            </div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "1rem",
              }}
            >
              Per-fix attribution
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                marginBottom: "1rem",
              }}
            >
              Every CRUCIBLE validation produces a checkpoint arc. Each checkpoint records:
            </p>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {[
                "The specific code change or fix applied",
                "The metric delta attributed to that change",
                "The corpus SHA at time of measurement",
                "Any regressions introduced (documented openly)",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    fontSize: "0.9375rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.75rem",
                    }}
                  >
                    —
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
              }}
            >
              The arc is append-only by convention. Prior checkpoints are never edited or
              smoothed. An external reviewer can trace every metric point back to a specific
              change.
            </p>
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
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
