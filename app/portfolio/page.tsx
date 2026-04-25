import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Portfolio — JourdanLabs",
  description:
    "Five industry divisions applying the COSMIC reasoning substrate: ATLAS, BACCHUS, HELIX, HEIMDALL, and CRUCIBLE.",
};

const container: React.CSSProperties = {
  maxWidth: 1440,
  margin: "0 auto",
  padding: "0 3rem",
};

const ENGINES = [
  { name: "NOVA", icon: "⊛" },
  { name: "ECLIPSE", icon: "◐" },
  { name: "PULSAR", icon: "☉" },
  { name: "AURORA", icon: "✧" },
  { name: "LUNA", icon: "☾" },
];

const DIVISIONS = [
  {
    name: "ATLAS",
    desc: "Real-asset intelligence. Minerals, ownership, commodity flow.",
    score: "88.5%",
    href: "/divisions/atlas",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11_atlas_crystal-8izZcylrV0Tn38zG7XjP5oMB2LpEI0.png",
  },
  {
    name: "BACCHUS",
    desc: "Luxury hospitality intelligence. 2 live SaaS products, 1,800+ venues.",
    score: "88.9%",
    href: "/divisions/bacchus",
    img: "/division-bacchus.jpg",
  },
  {
    name: "HELIX",
    desc: "Healthcare workflow automation. Clinical routing, documentation, pharmacovigilance.",
    score: "81.5%",
    href: "/divisions/helix",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/05_heimdall_shield-Lhnlz7aGUYpjPipmwkQbwTmM4wyC5G.png",
    highlight: true,
  },
  {
    name: "HEIMDALL",
    desc: "Security operations & compliance. SOC alert triage.",
    score: "94.0%",
    href: "/divisions/heimdall",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/05_heimdall_shield-Lhnlz7aGUYpjPipmwkQbwTmM4wyC5G.png",
  },
  {
    name: "CRUCIBLE",
    desc: "Open research & validation infrastructure.",
    score: "—",
    href: "/crucible",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/12_crucible_flask-4Zrl14zS8cJZBiu3XAg4i4nxGngla6.png",
  },
];

export default function PortfolioPage() {
  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section style={{ padding: "5rem 0 4rem" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem" }}>
              Divisions
            </div>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.02,
                color: "var(--text-primary)",
                marginBottom: "1.5rem",
                maxWidth: 800,
              }}
            >
              Five industry verticals.
              <br />
              One substrate.
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
                maxWidth: 520,
              }}
            >
              Each JourdanLabs division applies the COSMIC reasoning substrate
              to a regulated industry domain. The pipeline, methodology, and
              validation infrastructure are shared. The domain knowledge,
              corpora, and product interfaces are division-specific.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── SHARED SUBSTRATE ─────────────────── */}
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
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.5fr)",
              gap: "3rem",
              alignItems: "center",
            }}
            className="substrate-grid"
          >
            <Reveal>
              <div
                className="smallcaps"
                style={{ marginBottom: "0.75rem", color: "var(--text-tertiary)" }}
              >
                The Shared Substrate
              </div>
              <p
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: 1.65,
                  color: "var(--text-secondary)",
                }}
              >
                Every division product runs on the same COSMIC engine layer:
                NOVA for evidence retrieval, ECLIPSE for adversarial challenge,
                PULSAR for aggregation, AURORA for confidence gating, and LUNA
                for audit trail. Domain-specific knowledge is encoded in sealed
                corpora, not in the engine architecture.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                {ENGINES.map((e, i) => (
                  <div
                    key={e.name}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        backgroundColor: "#8B7355",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        color: "#C4B49A",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      {e.icon}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {e.name}
                      {i < ENGINES.length - 1 && (
                        <span style={{ color: "var(--accent)", fontSize: "0.5rem" }}>●</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────── DIVISION CARDS ─────────────────── */}
      <section style={{ padding: "4rem 0 5rem" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: "1rem",
            }}
            className="divisions-grid"
          >
            {DIVISIONS.map((d, i) => (
              <Reveal key={d.name} delay={i * 80}>
                <div
                  style={{
                    backgroundColor: d.highlight ? "var(--bg)" : "var(--bg-card)",
                    border: d.highlight
                      ? "2px solid var(--accent)"
                      : "1px solid var(--bg-border)",
                    borderRadius: 4,
                    padding: "1.25rem",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1/1.1",
                      marginBottom: "1rem",
                    }}
                  >
                    <Image
                      src={d.img}
                      alt={`${d.name} division artifact`}
                      fill
                      sizes="(max-width: 900px) 45vw, 18vw"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      color: d.highlight ? "var(--accent)" : "var(--text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {d.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      lineHeight: 1.5,
                      color: "var(--text-secondary)",
                      marginBottom: "auto",
                      paddingBottom: "1rem",
                    }}
                  >
                    {d.desc}
                  </p>
                  <div
                    style={{
                      borderTop: "1px solid var(--bg-border)",
                      paddingTop: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: d.highlight ? "var(--accent)" : "var(--text-tertiary)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      VANTAGE SCORE
                    </div>
                    <div
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        color: d.highlight ? "var(--accent)" : "var(--text-primary)",
                      }}
                    >
                      {d.score}
                    </div>
                  </div>
                  <Link
                    href={d.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      marginTop: "1rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      color: "var(--accent)",
                    }}
                  >
                    Explore {d.name}
                    <span>→</span>
                  </Link>
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
          .divisions-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 768px) {
          .substrate-grid { grid-template-columns: 1fr !important; }
          .divisions-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 500px) {
          .divisions-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
