import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "JourdanLabs — We ship no bullshit.",
  description:
    "An AI research lab building deterministic reasoning systems, validated on sealed public benchmarks.",
};

const container: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "0 2rem",
};

const DIVISIONS = [
  { name: "ATLAS", desc: "Real-asset intelligence: minerals, ownership, commodity flow.", img: "/artifact-atlas.jpg" },
  { name: "BACCHUS", desc: "Luxury hospitality market intelligence.", img: "/artifact-bacchus.jpg" },
  { name: "HELIX", desc: "Health and human performance.", img: "/artifact-helix.jpg" },
  { name: "HEIMDALL", desc: "Security operations and compliance.", img: "/artifact-heimdall.jpg" },
  { name: "CRUCIBLE", desc: "Open research and validation infrastructure.", img: "/artifact-crucible.jpg" },
];

const BENCHMARKS = [
  { name: "SIGNAL", domain: "Pharmacovigilance", result: "F1 0.639 · 24.3 mo median lead time" },
  { name: "CITADEL", domain: "Corporate hierarchy", result: "F1 0.616" },
  { name: "SENTINEL", domain: "SOC triage", result: "94% held-out" },
  { name: "ORACLE", domain: "Factual verification", result: "51% vs 31% / 25% baselines" },
  { name: "LENS", domain: "Semantic code search", result: "P@5 0.250 deterministic" },
  { name: "COMPASS", domain: "Reading-level complexity", result: "15/15 within-1-tier" },
];

export default function Home() {
  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section
        style={{
          minHeight: "calc(100vh - 72px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "5rem 0 3rem",
        }}
      >
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)",
              gap: "4rem",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            <Reveal>
              <div className="smallcaps" style={{ marginBottom: "2rem" }}>
                JourdanLabs
              </div>
              <h1
                style={{
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 0.98,
                  color: "var(--text-primary)",
                  marginBottom: "2rem",
                  textWrap: "balance" as const,
                }}
              >
                We ship no bullshit.
              </h1>
              <p
                style={{
                  fontSize: "1.125rem",
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                  maxWidth: 520,
                  marginBottom: "2.5rem",
                }}
              >
                An AI research lab building deterministic reasoning systems,
                validated on sealed public benchmarks.
              </p>
              <Link
                href="#benchmarks"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 1.75rem",
                  backgroundColor: "var(--accent)",
                  color: "#F0E7D5",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  borderRadius: 2,
                }}
              >
                See the benchmarks
              </Link>
            </Reveal>

            <Reveal delay={200}>
              <div style={{ position: "relative", aspectRatio: "4/5", width: "100%" }}>
                <Image
                  src="/hero-monolith.jpg"
                  alt="Carved stone monolith artifact on a pedestal"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Reveal>
          </div>

          {/* Burnt-orange rule + location */}
          <Reveal delay={400}>
            <div style={{ marginTop: "4rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ flex: 1, height: 1, backgroundColor: "var(--accent)", opacity: 0.75 }} />
              <div className="smallcaps" style={{ color: "var(--text-tertiary)" }}>
                Houston, TX &middot; Founded 2025
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── DIVISIONS / PLATFORM ─────────────────── */}
      <section style={{ padding: "8rem 0", borderTop: "1px solid var(--bg-border)" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem" }}>The Platform</div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--text-primary)",
                maxWidth: 820,
                marginBottom: "5rem",
                textWrap: "balance" as const,
              }}
            >
              Five divisions. One reasoning substrate.
            </h2>
          </Reveal>

          {/* Five artifacts on pedestals */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: "1.5rem",
              marginBottom: "4rem",
            }}
            className="divisions-grid"
          >
            {DIVISIONS.map((d, i) => (
              <Reveal key={d.name} delay={i * 120}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", marginBottom: "-1px" }}>
                    <Image
                      src={d.img}
                      alt={`${d.name} sculptural artifact`}
                      fill
                      sizes="(max-width: 900px) 45vw, 18vw"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  {/* Stone pedestal with carved name */}
                  <div
                    className="pedestal"
                    style={{
                      width: "100%",
                      padding: "1rem 0.5rem 1.25rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        letterSpacing: "0.22em",
                        color: "#3A352C",
                        textTransform: "uppercase",
                      }}
                    >
                      {d.name}
                    </span>
                  </div>
                  <p
                    style={{
                      marginTop: "1.25rem",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      color: "var(--text-secondary)",
                      maxWidth: 200,
                    }}
                  >
                    {d.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* COSMIC substrate slab */}
          <Reveal delay={200}>
            <div
              style={{
                background: "linear-gradient(180deg, #C8BEA6 0%, #A89E86 100%)",
                borderTop: "1px solid #D4C8B0",
                boxShadow: "0 2px 0 #8A8070, 0 12px 32px rgba(31,27,22,0.15)",
                padding: "2rem 2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "4rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.28em",
                    color: "#3A352C",
                    marginBottom: "0.25rem",
                  }}
                >
                  COSMIC
                </div>
                <div style={{ fontSize: "1.0625rem", fontWeight: 600, color: "#1F1B16" }}>
                  Reasoning Substrate
                </div>
              </div>
              <div style={{ fontSize: "0.875rem", color: "#3A352C", maxWidth: 520, lineHeight: 1.5 }}>
                Shared deterministic pipeline. Every division. Every benchmark. Every verdict.
              </div>
            </div>
          </Reveal>

          {/* Four attribute pills */}
          <Reveal delay={400}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "2rem",
                paddingTop: "2rem",
                borderTop: "1px solid var(--bg-border)",
              }}
              className="attr-grid"
            >
              {[
                "No LLM calls at runtime",
                "SHA-verified grounding",
                "6 peer-reviewable benchmarks",
                "Every result reproducible",
              ].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>—</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────── METHODOLOGY ─────────────────────── */}
      <section style={{ padding: "8rem 0", borderTop: "1px solid var(--bg-border)" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "5rem",
              alignItems: "center",
            }}
            className="method-grid"
          >
            <Reveal>
              <div className="smallcaps" style={{ marginBottom: "1.5rem" }}>The Method</div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.25rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  color: "var(--text-primary)",
                  marginBottom: "2rem",
                  textWrap: "balance" as const,
                }}
              >
                Validation-first. Always.
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "1rem", lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 560 }}>
                <p>
                  Every result ships against a sealed, SHA-verifiable corpus. No benchmark gaming, no cherry-picking — the
                  corpus exists before the engine sees it.
                </p>
                <p>
                  Our pipelines are deterministic. No LLM calls at runtime. Identical inputs produce byte-identical outputs.
                  We baseline against real industry tools, not straw men.
                </p>
                <p>
                  Every methodology arc is published with per-fix attribution, honest limitations, and step-by-step reproduction instructions.
                </p>
              </div>
              <div
                style={{
                  marginTop: "2.5rem",
                  paddingLeft: "1.5rem",
                  borderLeft: "2px solid var(--accent)",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontStyle: "italic",
                }}
              >
                If we can&apos;t prove it, we don&apos;t ship it.
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div style={{ position: "relative", aspectRatio: "1/1", width: "100%" }}>
                <Image
                  src="/artifact-methodology.jpg"
                  alt="Carved book and laboratory flask sculptural artifact"
                  fill
                  sizes="(max-width: 900px) 90vw, 45vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────── BENCHMARKS ─────────────────────── */}
      <section id="benchmarks" style={{ padding: "8rem 0", borderTop: "1px solid var(--bg-border)" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem" }}>The Receipts</div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--text-primary)",
                maxWidth: 820,
                marginBottom: "4rem",
                textWrap: "balance" as const,
              }}
            >
              Six published. One landing this week.
            </h2>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "1.25rem",
              marginBottom: "1.25rem",
            }}
            className="bench-grid"
          >
            {BENCHMARKS.map((b, i) => (
              <Reveal key={b.name} delay={i * 80}>
                <div
                  style={{
                    border: "1px solid var(--accent-border)",
                    backgroundColor: "var(--bg)",
                    padding: "1.75rem 1.75rem 2rem",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      color: "var(--accent)",
                    }}
                  >
                    {b.name}
                  </div>
                  <div style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    {b.domain}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.8125rem",
                      color: "var(--text-secondary)",
                      marginTop: "auto",
                      lineHeight: 1.5,
                    }}
                  >
                    {b.result}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Highlighted upcoming MUNINN card */}
          <Reveal delay={300}>
            <div
              style={{
                border: "1px solid var(--accent)",
                backgroundColor: "var(--accent-dim)",
                padding: "1.75rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                marginLeft: "2rem",
                marginRight: "2rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    color: "var(--accent)",
                    marginBottom: "0.5rem",
                  }}
                >
                  MUNINN &middot; Landing this week
                </div>
                <div style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Memory validation
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                Sealed corpus &middot; baselines under review
              </div>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div style={{ marginTop: "3rem" }}>
              <Link
                href="/crucible"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "1rem 1.75rem",
                  border: "1px solid var(--text-primary)",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  borderRadius: 2,
                }}
              >
                See the methodology
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Responsive overrides — desktop-first, collapse on mobile */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .divisions-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; row-gap: 3rem !important; }
          .attr-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 1.5rem !important; }
          .method-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .bench-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .divisions-grid { grid-template-columns: 1fr !important; }
          .attr-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
