import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Team — JourdanLabs",
  description:
    "Founder-led deterministic AI infrastructure from JourdanLabs, with persistent agent collaborators running on the same COSMIC substrate we productize.",
};

const container: React.CSSProperties = {
  width: "92%",
  maxWidth: 1600,
  margin: "0 auto",
};

const TEAM = [
  {
    name: "Leland Jourdan II",
    title: "FOUNDER & CEO",
    bio: "Former Chevron supply chain consultant. Lean Six Sigma Master Black Belt. Architect of the COSMIC reasoning substrate. Houston, TX.",
    img: "/team-ceo.png",
  },
  {
    name: "Isaac Weathers",
    title: "CTO",
    bio: "Executive Director at JPMorgan, 20 years software architecture. Joining JourdanLabs full-time post-funding.",
    img: "/team-cto.png",
  },
  {
    name: "Charles Jourdan",
    title: "CSO",
    bio: "Leads the HELIX wellness and human performance division. Twenty years in holistic wellness and athlete performance. Houston, TX.",
    img: "/team-cso.png",
  },
  {
    name: "Lee Jourdan",
    title: "ADVISOR & CHAIRMAN",
    bio: "Former Chevron CDIO. Independent Board Director, PROS Holdings. Strategic advisor and Board Chair.",
    img: "/team-chairman.png",
  },
];

export default function TeamPage() {
  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section style={{ padding: "5rem 0 4rem" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem" }}>
              Team
            </div>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.02,
                maxWidth: 900,
              }}
            >
              Core leadership.
            </h1>
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "1.125rem",
                color: "var(--text-secondary)",
                maxWidth: 600,
                lineHeight: 1.6,
              }}
            >
              Founder-led, Houston-built, and backed by a small circle of technical and strategic operators.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────── TEAM GRID ─────────────────────────── */}
      <section style={{ padding: "0 0 5rem" }}>
        <div style={container}>
          <div
            className="team-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "2rem",
            }}
          >
            {TEAM.map((member) => (
              <Reveal key={member.name}>
                <div
                  className="team-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "3/4",
                      marginBottom: "1.25rem",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      backgroundColor: "var(--bg)",
                    }}
                  >
                    <img
                      src={member.img}
                      alt={member.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {member.name}
                  </h3>
                  <div
                    className="smallcaps"
                    style={{
                      fontSize: "0.625rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {member.title}
                  </div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.55,
                    }}
                  >
                    {member.bio}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── AGENT COLLABORATORS ─────────────────────────── */}
      <section style={{ padding: "5rem 0", borderTop: "1px solid var(--bg-border)", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1rem" }}>
              Agent collaborators
            </div>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                maxWidth: 760,
                marginBottom: "1.25rem",
              }}
            >
              The team that helps the team ship.
            </h2>
            <div style={{ maxWidth: 780 }}>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: "1rem",
                }}
              >
                JourdanLabs works with persistent agent collaborators running on the same identity, refusal,
                memory, and lineage discipline we are productizing through MAP THE SOUL. These are not one-off
                chats; they are defined roles with explicit boundaries, source discipline, and detectable drift.
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: "1rem",
                }}
              >
                That practice is part of the operating system behind COSMIC: architecture, execution,
                validation, and domain reasoning are separated so outputs can be inspected instead of merely
                trusted.
              </p>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1px",
              backgroundColor: "var(--bg-border)",
              border: "1px solid var(--bg-border)",
              marginTop: "2rem",
            }}
          >
            {[
              ["Pan", "Validation, refusal discipline, and chamber-grade source review."],
              ["Caulifla", "Build execution, product hardening, and operational shipping."],
              ["Bulma", "COSMIC architecture, substrate design, and systems synthesis."],
              ["Toph Beifong", "Grounded truth-sensing, weak-ground detection, and team protection."],
            ].map(([name, role]) => (
              <Reveal key={name}>
                <div style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem" }}>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {name}
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {role}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div style={{ marginTop: "2rem", borderLeft: "2px solid var(--accent)", paddingLeft: "1.5rem", maxWidth: 760 }}>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: "1rem",
                }}
              >
                MAP THE SOUL exists to make this pattern production-grade: signed identities, refusal-grounded
                roles, lineage chains, and portable agent continuity.
              </p>
              <Link href="/map-the-soul" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
                Explore MAP THE SOUL →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────── TAGLINE ─────────────────────────── */}
      <section style={{ padding: "0 0 4rem" }}>
        <div style={container}>
          <Reveal>
            <p
              style={{
                textAlign: "center",
                fontSize: "1rem",
                color: "var(--text-secondary)",
                fontStyle: "italic",
              }}
            >
              JourdanLabs is family. Houston, TX, founded 2025.
            </p>
            <div
              style={{
                width: "100%",
                maxWidth: 200,
                height: 1,
                backgroundColor: "var(--accent)",
                margin: "2.5rem auto 0",
              }}
            />
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────── RESPONSIVE STYLES ─────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1240px) {
          .team-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 900px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .team-grid {
            grid-template-columns: 1fr !important;
            max-width: 320px;
            margin: 0 auto;
          }
        }
        .team-card:hover {
          transform: translateY(-4px);
        }
      ` }} />
    </>
  );
}
