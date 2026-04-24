import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "JourdanLabs — Five industry divisions. One reasoning substrate.",
  description:
    "JourdanLabs builds deterministic AI products for regulated industries — where a confident wrong answer costs more than honest refusal.",
};

const container: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "0 2rem",
};

export default function Home() {
  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section style={{ padding: "5rem 0 6rem" }}>
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
              <div
                className="smallcaps"
                style={{ marginBottom: "1.5rem" }}
              >
                Houston, TX
              </div>
              <h1
                style={{
                  fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.02,
                  color: "var(--text-primary)",
                  marginBottom: "1.5rem",
                }}
              >
                Five industry divisions.
                <br />
                One reasoning substrate.
                <br />
                No LLM calls at runtime.
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
                  maxWidth: 420,
                  marginBottom: "2.5rem",
                }}
              >
                JourdanLabs builds deterministic AI products for regulated
                industries — where a confident wrong answer costs more than
                honest refusal.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link
                  href="/portfolio"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.875rem 1.5rem",
                    backgroundColor: "var(--text-primary)",
                    color: "var(--bg)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Explore the Portfolio
                  <span style={{ marginLeft: "0.25rem" }}>→</span>
                </Link>
                <Link
                  href="/cosmic"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.875rem 1.5rem",
                    border: "1px solid var(--accent)",
                    color: "var(--accent)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Read the Thesis
                </Link>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1.15/1",
                }}
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/asset_4bl1gteo4_1777045469087-hZvn9rV3cAXZmMex2zexyajebVD7wn.png"
                  alt="Five division artifacts on a circular stone pedestal with COSMIC at center"
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

      {/* ─────────────────── PORTFOLIO / VANTAGE ─────────────────── */}
      <section
        style={{
          padding: "5rem 0",
          backgroundColor: "var(--bg-card)",
          borderTop: "1px solid var(--bg-border)",
          borderBottom: "1px solid var(--bg-border)",
        }}
      >
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "4rem",
              alignItems: "start",
            }}
            className="portfolio-grid"
          >
            <Reveal>
              <div
                className="smallcaps"
                style={{ marginBottom: "1rem" }}
              >
                The Portfolio &middot; Crucible / Vantage
              </div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  color: "var(--text-primary)",
                  marginBottom: "1.5rem",
                }}
              >
                Products validating products.
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  color: "var(--text-secondary)",
                  maxWidth: 440,
                  marginBottom: "2rem",
                }}
              >
                VANTAGE is the COSMIC diagnostic suite — a structured scan of
                engine capability across all five division domains. Each scan
                produces a sealed receipt with per-task scores, honest refusal
                rates, and BCa confidence intervals.
              </p>
              <Link
                href="/crucible/vantage"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--accent)",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Explore Vantage
                <span>→</span>
              </Link>
            </Reveal>

            <Reveal delay={150}>
              <div
                style={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--bg-border)",
                  padding: "1.75rem 2rem",
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>ATLAS</span>
                  <span style={{ letterSpacing: "0.15em" }}>. . . . . . .</span>
                  <span style={{ fontWeight: 700 }}>88.5%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>BACCHUS</span>
                  <span style={{ letterSpacing: "0.15em" }}>. . . . . . .</span>
                  <span style={{ fontWeight: 700 }}>88.9%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                  <span>HELIX</span>
                  <span style={{ letterSpacing: "0.15em" }}>. . . . . . .</span>
                  <span style={{ fontWeight: 700 }}>81.5%</span>
                </div>
                <div
                  style={{
                    borderTop: "1px solid var(--bg-border)",
                    paddingTop: "1.25rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ color: "var(--text-tertiary)" }}>REFUSAL RATE</span>
                    <span>—</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ color: "var(--text-tertiary)" }}>CORPUS SHA</span>
                    <span>sealed</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-tertiary)" }}>BCa CI</span>
                    <span>B=2000</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────── THESIS ─────────────────────── */}
      <section style={{ padding: "6rem 0" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "4rem",
              alignItems: "center",
            }}
            className="thesis-grid"
          >
            <Reveal>
              <div
                className="smallcaps"
                style={{ marginBottom: "1rem" }}
              >
                Thesis
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  color: "var(--text-primary)",
                  marginBottom: "1.75rem",
                }}
              >
                Current AI guesses confidently.
                <br />
                COSMIC is the opposite architecture.
              </h2>
              <div
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  maxWidth: 480,
                }}
              >
                <p style={{ marginBottom: "1rem" }}>
                  Large language models achieve impressive benchmark numbers but
                  produce unreliable outputs when underlying knowledge is absent
                  or contested. COSMIC is a multi-engine deterministic pipeline —
                  no LLM calls at runtime, every claim SHA-grounded, honest
                  refusal as a first-class output.
                </p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1.1/1",
                  }}
                >
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/13_aurora_confidence_gate-PrPsm1OjTw55MgJurPYqdZM7RW80x5.png"
                    alt="AURORA confidence gate lockbox artifact"
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                {/* Annotation labels */}
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "30%",
                    textAlign: "left",
                    paddingLeft: "1rem",
                    borderLeft: "2px solid var(--text-tertiary)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "var(--text-primary)",
                    }}
                  >
                    AURORA
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    / confidence gate
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "55%",
                    textAlign: "left",
                    paddingLeft: "1rem",
                    borderLeft: "2px solid var(--text-tertiary)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "var(--text-primary)",
                    }}
                  >
                    LUNA
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    / immutable audit log
                  </div>
                </div>
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
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .portfolio-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .thesis-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </>
  );
}
