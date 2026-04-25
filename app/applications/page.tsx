import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Applications — Deployment Options",
  description:
    "JourdanLabs products are available directly through division-specific channels and through select advisory partnerships via C&L Strategy.",
};

const container: React.CSSProperties = {
  width: "92%",
  maxWidth: 1600,
  margin: "0 auto",
};

const divisions = [
  {
    name: "ATLAS",
    desc: "Real-asset intelligence. Minerals, ownership, commodity flow.",
    href: "/divisions/atlas",
  },
  {
    name: "BACCHUS",
    desc: "Luxury hospitality market intelligence. Two products live.",
    href: "/divisions/bacchus",
  },
  {
    name: "HELIX",
    desc: "Healthcare workflow automation. Clinical routing, documentation.",
    href: "/divisions/helix",
  },
  {
    name: "HEIMDALL",
    desc: "Security operations & compliance. Trust scoring, confidence-gated triage.",
    href: "/divisions/heimdall",
  },
];

export default function ApplicationsPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: "4rem 0 4rem" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
              APPLICATIONS
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
              Deployment options.
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
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                maxWidth: 600,
              }}
            >
              JourdanLabs products are available directly through division-specific channels
              and through select advisory partnerships via C&L Strategy.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Two Columns */}
      <section
        style={{
          backgroundColor: "var(--bg-muted)",
          padding: "4rem 2rem",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
            }}
            className="columns-grid"
          >
            {/* Direct Deployment */}
            <Reveal>
              <div>
                <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
                  Direct Deployment
                </div>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.75,
                    color: "var(--text-secondary)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Division-specific products are available directly through the division pages.
                  Each division maintains its own deployment process and product access.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {divisions.map((d) => (
                    <Link
                      key={d.name}
                      href={d.href}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "1rem",
                        padding: "1rem",
                        backgroundColor: "var(--bg-card)",
                        borderRadius: 6,
                        textDecoration: "none",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          fontSize: "0.8125rem",
                          fontWeight: 700,
                          color: "var(--accent)",
                          minWidth: 80,
                        }}
                      >
                        {d.name}
                      </span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {d.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Advisory Partnerships */}
            <Reveal delay={100}>
              <div>
                <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
                  Advisory Partnerships
                </div>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.75,
                    color: "var(--text-secondary)",
                    marginBottom: "1rem",
                  }}
                >
                  Strategic deployment through C&L Strategy, JourdanLabs&apos; commercial partner.
                  C&L handles implementation scoping, stakeholder alignment, and deployment
                  coordination for regulated industry engagements.
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.75,
                    color: "var(--text-secondary)",
                    marginBottom: "1.5rem",
                  }}
                >
                  C&L engagements are appropriate for clients who need advisory support alongside
                  the technology — regulatory strategy, procurement navigation, and change
                  management in compliance-heavy environments.
                </p>
                <a
                  href="https://candlstrategy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--accent)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  candlstrategy.com →
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section style={{ padding: "4rem 0" }}>
        <div style={{ ...container, maxWidth: 900, textAlign: "center" }}>
          <Reveal>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.7,
                color: "var(--text-secondary)",
                marginBottom: "2rem",
              }}
            >
              Not sure which path is right? Start with a conversation.
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2rem",
                backgroundColor: "var(--accent)",
                color: "#1F1B16",
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
                borderRadius: 4,
              }}
            >
              Contact JourdanLabs
              <span>→</span>
            </Link>
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
          .columns-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
