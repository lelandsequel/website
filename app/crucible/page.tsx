import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "CRUCIBLE — Open Research & Validation",
  description:
    "CRUCIBLE is the JourdanLabs research division: open benchmarks, VANTAGE diagnostics, and the COSMIC methodology.",
};

const container: React.CSSProperties = {
  width: "92%",
  maxWidth: 1600,
  margin: "0 auto",
};

const SECTIONS = [
  {
    name: "VANTAGE",
    subtitle: undefined as string | undefined,
    desc: "Flagship diagnostic suite. Sealed receipts, per-task scores, BCa confidence intervals.",
    href: "/crucible/vantage",
    img: "/crucible-vantage.jpg",
    cta: undefined as string | undefined,
  },
  {
    name: "RAVEN",
    subtitle: "Open Source · Memory Validation",
    desc: "Seven-engine memory validation pipeline for AI agents. Runs after retrieval to filter contradictions, stale facts, and unranked noise.",
    href: "/crucible/raven",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/asset_yb78d9eoz_1777045469087-cJVav7s8xjRYeVkNVxCsWpbyWC690k.png",
    cta: "Explore RAVEN →",
  },
  {
    name: "BENCHMARKS",
    subtitle: undefined as string | undefined,
    desc: "Six public benchmarks across pharmacovigilance, entity resolution, SOC, verification, semantic search, calibration.",
    href: "/benchmarks",
    img: "/crucible-benchmarks.jpg",
    cta: undefined as string | undefined,
  },
  {
    name: "METHODOLOGY",
    subtitle: undefined as string | undefined,
    desc: "Seven non-negotiable principles. Sealed corpora, honest baselines, per-fix attribution, refusal as a feature.",
    href: "/methodology",
    img: "/crucible-methodology.jpg",
    cta: undefined as string | undefined,
  },
];

export default function CruciblePage() {
  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section style={{ padding: "5rem 0 4rem" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
              gap: "3rem",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            <Reveal>
              <div className="smallcaps" style={{ marginBottom: "1.5rem" }}>
                CRUCIBLE
              </div>
              <h1
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                  fontWeight: 400,
                  lineHeight: 1.05,
                  color: "var(--text-primary)",
                  marginBottom: "1.5rem",
                }}
              >
                Open research
                <br />
                and validation
                <br />
                infrastructure.
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
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  color: "var(--text-secondary)",
                  maxWidth: 420,
                }}
              >
                CRUCIBLE is the JourdanLabs research division. It runs the
                benchmark program, maintains the COSMIC methodology playbook,
                and operates VANTAGE — the diagnostic suite that validates the
                other four divisions.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1.1/1",
                }}
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/12_crucible_flask-4Zrl14zS8cJZBiu3XAg4i4nxGngla6.png"
                  alt="Crucible research artifact - open book with laboratory flask"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 55vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────── WHAT'S IN CRUCIBLE ─────────────────── */}
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
            <div
              className="smallcaps"
              style={{ marginBottom: "2rem", color: "var(--accent)" }}
            >
              {"What's in CRUCIBLE"}
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "1.5rem",
            }}
            className="cards-grid"
          >
            {SECTIONS.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <Link
                  href={s.href}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 8,
                    padding: "1.5rem",
                    height: "100%",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1/1",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <Image
                      src={s.img}
                      alt={`${s.name} artifact`}
                      fill
                      sizes="(max-width: 900px) 45vw, 22vw"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                      color: "var(--text-primary)",
                      marginBottom: s.subtitle ? "0.25rem" : "0.5rem",
                    }}
                  >
                    {s.name}
                  </h3>
                  {s.subtitle && (
                    <div
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--accent)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {s.subtitle}
                    </div>
                  )}
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.55,
                      color: "var(--text-secondary)",
                      marginBottom: s.cta ? "1rem" : 0,
                    }}
                  >
                    {s.desc}
                  </p>
                  {s.cta && (
                    <span
                      style={{
                        marginTop: "auto",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        color: "var(--accent)",
                      }}
                    >
                      {s.cta}
                    </span>
                  )}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── WHY OPEN RESEARCH ─────────────────── */}
      <section style={{ padding: "5rem 0" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
              gap: "3rem",
              alignItems: "center",
            }}
            className="why-grid"
          >
            <Reveal>
              <div
                className="smallcaps"
                style={{ marginBottom: "1rem", color: "var(--accent)" }}
              >
                Why Open Research?
              </div>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  marginBottom: "1rem",
                }}
              >
                CRUCIBLE benchmarks are public because the claim that COSMIC
                outperforms baselines in regulated domains is only credible if
                it can be verified. Engine implementations are proprietary — the
                corpus, scoring harnesses, and baseline code are not. Anyone can
                run the baselines. Anyone can verify the corpus SHA. Anyone can
                point their own pipeline at our scoring harness and compare.
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  fontStyle: "italic",
                  marginBottom: "2rem",
                }}
              >
                This is how SuperGLUE, HELM, and other credible benchmark
                programs operate. We follow the same model.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Link
                  href="/benchmarks"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "1rem 1.5rem",
                    backgroundColor: "var(--text-primary)",
                    color: "var(--bg)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: 4,
                  }}
                >
                  View Benchmarks
                  <span>→</span>
                </Link>
                <Link
                  href="/methodology"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "1rem 1.5rem",
                    border: "1px solid var(--accent)",
                    color: "var(--accent)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    borderRadius: 4,
                  }}
                >
                  Read Methodology
                </Link>
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
        @media (max-width: 1100px) {
          .cards-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .why-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
