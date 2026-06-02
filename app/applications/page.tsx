import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Applications — JourdanLabs",
  description:
    "JourdanLabs products are available directly through JourdanLabs.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
};

const DIVISION_CONTACTS = [
  { name: "NORTHSTAR", domain: "Small-business bookkeeping", contact: "$1 COSMIC books, tax-prep packet, accountant export", href: "/northstar", accent: "#5A2EE6" },
  { name: "CARTOGRAPHER", domain: "SEO intelligence", contact: "Search audits, content maps, technical blockers, client report packets", href: "/cartographer", accent: "#2563EB" },
  { name: "ATLAS", domain: "Commercial real estate intelligence", contact: "MineralLogic, PropertyGraph, NAUTILUS", href: "/divisions/atlas", accent: "#D4A574" },
  { name: "BACCHUS", domain: "Luxury hospitality operations", contact: "Intel, COSMIX, RUSH, Festivus, ROE for Altima Caviar", href: "/bacchus", accent: "#7D2348" },
  { name: "HELIX", domain: "Wellness and human performance", contact: "HELIX TestFlight for training intelligence", href: "/divisions/helix", accent: "#E8735A" },
  { name: "HYGEIA", domain: "Clinical safety intelligence", contact: "PHAROS pharmacovigilance signal workbench", href: "/divisions/hygeia", accent: "#18A978" },
  { name: "HEIMDALL", domain: "Security operations", contact: "SENTINEL (pre-pilot access)", href: "/divisions/heimdall", accent: "#4A7BA7" },
];

export default function ApplicationsPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <div style={{ maxWidth: 640 }}>
            <span style={{ ...S.label, marginBottom: "1rem" }}>Applications</span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              Deployment options.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              JourdanLabs products are available directly through JourdanLabs. We scope the domain,
              configure the corpus, wire the workflow, and ship deterministic systems with receipts.
            </p>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>Direct deployment</span>
          <div className="application-list">
            {DIVISION_CONTACTS.map((d) => (
              <div key={d.name} className="application-row">
                <span className="application-name" style={{ color: d.accent }}>{d.name}</span>
                <span className="application-domain">{d.domain}</span>
                <span className="application-contact">{d.contact}</span>
                <Link href={d.href} className="application-link" style={{ color: d.accent }}>
                  View →
                </Link>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <a
              href="mailto:leland@jourdanlabs.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "var(--accent)",
                color: "#0E0F13",
                fontWeight: 600,
                fontSize: "0.875rem",
                borderRadius: 2,
                textDecoration: "none",
              }}
            >
              Contact for access →
            </a>
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={S.label}>VANTAGE evaluation</span>
          <p style={S.p}>
            Before committing to a deployment, request a VANTAGE scan. VANTAGE runs a structured
            diagnostic of COSMIC capability across your target domain and produces a sealed receipt
            with per-task scores, honest refusal rates, and BCa confidence intervals.
          </p>
          <Link href="/crucible/vantage" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
            Learn about VANTAGE →
          </Link>
        </div>
      </section>
    </>
  );
}
