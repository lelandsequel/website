import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Team — JourdanLabs",
  description:
    "Five people. Five disciplines. One shared methodology. Meet the JourdanLabs leadership team.",
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
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A_young_African_American_man_in_a_navy_blue_hoodie-1777141699513-CT9HWvVZikBaAtLdMqgDGOt1WxDj2R.png",
  },
  {
    name: "Isaac Weathers",
    title: "CTO",
    bio: "Executive Director at JPMorgan, 20 years software architecture. Joining JourdanLabs full-time post-funding.",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A_rugged_bearded_man_with_dark_hair_in_a_man_bun_-1777141689018-oYCorWFlvoy9j1eHM2cOXy2vttyB56.png",
  },
  {
    name: "Colton Williams",
    title: "CFO",
    bio: "Purdue Finance. 10-year oil & gas finance veteran. Leads finance, contracts, and capital strategy.",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A_cheerful_red-haired_Caucasian_man_with_a_bright_-1777141678599-9b6JbPiNSUUxG5iIOQyDEhvhYO4hzg.png",
  },
  {
    name: "Charles Jourdan",
    title: "CSO",
    bio: "Leads the HELIX health and human performance division. Twenty years in holistic wellness and athlete performance. Houston, TX.",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A_fit_young_African_American_man_with_short_fade_h-1777141672223-ckQQzF7dF11Ulm29tPU720E1thwCch.png",
  },
  {
    name: "Lee Jourdan",
    title: "ADVISOR & CHAIRMAN",
    bio: "Former Chevron CDIO. Independent Board Director, PROS Holdings. Strategic advisor and Board Chair.",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A_distinguished_older_African_American_man_with_a_-1777141737946-agr97REgOWHpd7L5bCcAiWIzMmgHRJ.png",
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
              Five people. Five disciplines. One shared methodology.
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
              gridTemplateColumns: "repeat(5, 1fr)",
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
                    }}
                  >
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      style={{ objectFit: "contain", objectPosition: "bottom" }}
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
