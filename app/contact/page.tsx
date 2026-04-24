import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact — JourdanLabs",
  description:
    "Contact JourdanLabs. Research inquiries, evaluation API access, investment and partnership.",
};

const contactCards = [
  {
    icon: "/contact-quill.jpg",
    title: "Research Inquiries",
    body: "Questions about methodology, benchmark results, or research partnerships.",
    link: "mailto:leland@jourdanlabs.com?subject=Research Inquiry",
    linkLabel: "leland@jourdanlabs.com →",
  },
  {
    icon: "/contact-key.jpg",
    title: "Evaluation API Access",
    body: "Request access to the COSMIC evaluation API for reproducibility verification or integration assessment.",
    link: "mailto:leland@jourdanlabs.com?subject=COSMIC Evaluation API Key Request",
    linkLabel: "Request API key →",
  },
  {
    icon: "/contact-ring.jpg",
    title: "Investment & Partnership",
    body: "Pre-seed investment discussions, strategic partnerships, and enterprise evaluation.",
    link: "mailto:leland@jourdanlabs.com?subject=Investment Discussion",
    linkLabel: "leland@jourdanlabs.com →",
  },
];

const elsewhereLinks = [
  { label: "GitHub", href: "https://github.com/jourdanlabs" },
  { label: "LinkedIn", href: "https://linkedin.com/company/jourdanlabs" },
  { label: "Twitter/X", href: "https://x.com/jourdanlabs" },
  { label: "Press", href: "mailto:leland@jourdanlabs.com?subject=Press Inquiry" },
];

export default function ContactPage() {
  return (
    <article style={{ backgroundColor: "var(--bg)" }}>
      {/* Hero */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "5rem 2rem 4rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            Contact
          </span>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Get in touch.
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
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: 380,
            }}
          >
            JourdanLabs is a research-stage company. The primary contact for all
            inquiries is Leland Jourdan II.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src="/contact-envelope.jpg"
            alt="Sealed envelope with wax seal"
            width={380}
            height={340}
            style={{ objectFit: "contain" }}
          />
        </div>
      </section>

      {/* Contact Cards */}
      <section
        style={{
          backgroundColor: "var(--bg-muted)",
          padding: "3rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          {contactCards.map((card) => (
            <div
              key={card.title}
              style={{
                backgroundColor: "var(--bg-card)",
                padding: "2rem",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "1.25rem" }}>
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={80}
                  height={80}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                  marginBottom: "1.25rem",
                  flex: 1,
                }}
              >
                {card.body}
              </p>
              <a
                href={card.link}
                style={{
                  fontSize: "0.875rem",
                  color: "var(--accent)",
                  fontWeight: 500,
                }}
              >
                {card.linkLabel}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Elsewhere */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "3rem 2rem 4rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent)",
            display: "block",
            marginBottom: "1.25rem",
          }}
        >
          Elsewhere
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          {elsewhereLinks.map((link, i) => (
            <div key={link.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "1px solid var(--bg-border)",
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                }}
              >
                {link.label}
              </a>
              {i < elsewhereLinks.length - 1 && (
                <span style={{ color: "var(--text-tertiary)", fontSize: "0.5rem" }}>•</span>
              )}
            </div>
          ))}
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
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
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
          <span style={{ color: "var(--text-tertiary)" }}>
            © 2026 JourdanLabs. All rights reserved.
          </span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          section[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          section[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </article>
  );
}
