import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact JourdanLabs. Research inquiries, evaluation API access, partnership discussions.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
};

const contactItems = [
  {
    subject: "Research inquiries",
    body: "Questions about methodology, benchmark results, or research partnerships.",
    mailto: "mailto:leland@jourdanlabs.com?subject=Research Inquiry",
    label: "leland@jourdanlabs.com",
  },
  {
    subject: "Evaluation API access",
    body: "Request access to the COSMIC evaluation API for reproducibility verification or integration assessment.",
    mailto: "mailto:leland@jourdanlabs.com?subject=COSMIC Evaluation API Key Request",
    label: "Request API key →",
  },
  {
    subject: "Investment and partnership",
    body: "Pre-seed investment discussions, strategic partnerships, and enterprise evaluation.",
    mailto: "mailto:leland@jourdanlabs.com?subject=Investment Discussion",
    label: "leland@jourdanlabs.com",
  },
];

export default function ContactPage() {
  return (
    <article style={{ padding: "6rem 0" }}>
      <div style={S.container}>
        <div style={{ marginBottom: "4rem" }}>
          <span style={{ ...S.label, marginBottom: "1rem" }}>Contact</span>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "1rem" }}>
            Get in touch
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 480 }}>
            JourdanLabs is a research-stage company. The primary contact for all inquiries is Leland Jourdan II.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1px", border: "1px solid var(--bg-border)", backgroundColor: "var(--bg-border)", marginBottom: "4rem" }}>
          {contactItems.map((item) => (
            <div key={item.subject} style={{ backgroundColor: "var(--bg-card)", padding: "1.75rem" }}>
              <div style={{ ...S.label, marginBottom: "0.5rem" }}>{item.subject}</div>
              <p style={{ ...S.p, marginBottom: "1rem" }}>{item.body}</p>
              <a href={item.mailto} style={{ fontSize: "0.9375rem", color: "var(--accent)", fontWeight: 500 }}>
                {item.label}
              </a>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--bg-border)", paddingTop: "2rem" }}>
          <div style={{ ...S.label, marginBottom: "0.75rem" }}>Elsewhere</div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <a href="https://github.com/jourdanlabs" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              github.com/jourdanlabs →
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
