import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CARTOGRAPHER — SEO Intelligence",
  description:
    "CARTOGRAPHER is the JourdanLabs SEO intelligence and execution system for paid client engagements: audits, content maps, technical blockers, and proof-backed search strategy.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 980, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#2563EB",
    display: "block",
  },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
};

const OUTPUTS = [
  {
    title: "Technical Search Audit",
    text: "Crawl health, indexability, speed, metadata, internal links, schema, and page-level blockers.",
  },
  {
    title: "Competitive Map",
    text: "Market pages, service pages, competitor gaps, ranking surfaces, and opportunities worth pursuing.",
  },
  {
    title: "Content Queue",
    text: "A prioritized publishing plan with page briefs, target intent, proof requirements, and status tracking.",
  },
  {
    title: "Client Report Packet",
    text: "A clean deliverable that explains what changed, what still blocks growth, and what evidence supports the recommendation.",
  },
];

const PRINCIPLES = [
  "No black-box SEO theater.",
  "No traffic claims without measurement.",
  "No generated pages without a reason to exist.",
  "No pretending the audit is complete when the crawl evidence is missing.",
];

export default function CartographerPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)", borderTop: "2px solid #2563EB" }}>
        <div style={S.container}>
          <div style={{ maxWidth: 700 }}>
            <span style={{ ...S.label, marginBottom: "1rem" }}>CARTOGRAPHER</span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              Search intelligence with receipts.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 620 }}>
              CARTOGRAPHER is the JourdanLabs SEO intelligence and execution system for paid
              client work: crawl the site, map the market, find what matters, and turn the result
              into a proof-backed operating plan.
            </p>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={{ ...S.label, marginBottom: "1rem" }}>What it does</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1px",
              backgroundColor: "var(--bg-border)",
              border: "1px solid var(--bg-border)",
            }}
          >
            {OUTPUTS.map((item) => (
              <div key={item.title} style={{ backgroundColor: "var(--bg-card)", padding: "1.75rem" }}>
                <h2 style={{ fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.75rem" }}>{item.title}</h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.containerSm}>
          <span style={{ ...S.label, marginBottom: "1.5rem" }}>Operating rules</span>
          <p style={S.p}>
            CARTOGRAPHER is not a public benchmark and not a generic AI writing tool. It is a
            client-service workbench for SEO audits, search-market planning, and execution tracking.
            The value is the same JourdanLabs posture: make the evidence visible, refuse weak claims,
            and give the client an artifact they can act on.
          </p>
          <div style={{ border: "1px solid var(--bg-border)", backgroundColor: "var(--bg-card)" }}>
            {PRINCIPLES.map((item, index) => (
              <div
                key={item}
                style={{
                  display: "grid",
                  gridTemplateColumns: "4rem 1fr",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderTop: index === 0 ? "none" : "1px solid var(--bg-border)",
                }}
              >
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", color: "#2563EB", fontWeight: 700 }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={{ ...S.label, marginBottom: "1.5rem" }}>Access</span>
          <p style={S.p}>
            CARTOGRAPHER is available through direct JourdanLabs client engagements. We scope the
            site, define the target market, run the audit, and deliver a search plan with the evidence
            attached.
          </p>
          <Link href="/contact" style={{ fontSize: "0.875rem", color: "#2563EB" }}>
            Talk to JourdanLabs about CARTOGRAPHER →
          </Link>
        </div>
      </section>
    </>
  );
}
