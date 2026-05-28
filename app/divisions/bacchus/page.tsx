import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BACCHUS — Luxury Hospitality Intelligence",
  description:
    "BACCHUS applies COSMIC to luxury hospitality intelligence. COSMIX is a mixology app, BACCHUS RUSH is a restaurant training app, and BACCHUS ROE is an Altima Caviar-exclusive native Mac app for caviar account operations.",
};

const accent = "#7D2348";
const gold = "#D7B46A";

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1120, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 780, margin: "0 auto", padding: "0 2rem" },
  label: {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "var(--text-tertiary)",
    display: "block",
  },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
  card: { backgroundColor: "var(--bg-card)", border: "1px solid var(--bg-border)", padding: "1.5rem" },
};

const operations = [
  ["Dashboard", "Account pipeline, surfaced targets, annual value, target volume, and reorder alerts."],
  ["Accounts", "Venue-by-venue scoring, buyer notes, menu signals, proof flags, and next action."],
  ["Reorders", "Purchase cadence, reorder risk, restock notes, species preference, and margin update."],
  ["Intake", "Manual account intake and CSV import for new restaurant, hotel, club, and private dining signals."],
  ["Receipts", "SHA-chained audit trail and copyable account briefs for operator handoff."],
];

const products = [
  {
    name: "BACCHUS ROE",
    status: "Altima-exclusive · native Mac",
    description:
      "Caviar account pipeline built for Altima Caviar. Tracks buyer programs, reorder risk, AURORA account scoring, CSV imports, account briefs, and SHA-chained receipts.",
  },
  {
    name: "COSMIX",
    status: "Mixology",
    description:
      "Mixology app for cocktail programs, menu creation, ingredient logic, service notes, and bar-team execution.",
  },
  {
    name: "BACCHUS RUSH",
    status: "Restaurant training",
    description:
      "Restaurant training app for service teams, onboarding flows, station knowledge, SOP discipline, and manager-ready training receipts.",
  },
  {
    name: "BACCHUS Trade",
    status: "In development",
    description:
      "Distributor-to-venue trade compliance and pricing intelligence against sealed state regulatory corpora.",
  },
  {
    name: "BACCHUS Cellar",
    status: "In development",
    description:
      "Fine wine and spirits cellar management with provenance tracking, valuation, and SHA-verified history.",
  },
  {
    name: "BACCHUS Atlas",
    status: "In development",
    description:
      "Beverage market mapping by region: venue density, pricing trends, and category performance.",
  },
];

export default function BacchusPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)", borderTop: `2px solid ${accent}` }}>
        <div style={S.container}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)", gap: "2rem", alignItems: "end" }}>
            <div>
              <Link href="/divisions" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", display: "inline-block", marginBottom: "1.25rem" }}>
                ← Divisions
              </Link>
              <span style={{ ...S.label, color: accent, marginBottom: "1rem" }}>BACCHUS</span>
              <h1 style={{ fontSize: "clamp(2.35rem, 6vw, 4.35rem)", fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.98, color: "var(--text-primary)", margin: "0 0 1.25rem" }}>
                Luxury hospitality intelligence.
              </h1>
              <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: 660, margin: 0 }}>
                BACCHUS applies the COSMIC substrate to premium hospitality: menu pricing,
                demand signals, buyer cadence, account operations, provenance, and market position.
              </p>
            </div>

            <div style={{ ...S.card, borderTop: `3px solid ${accent}` }}>
              <span style={{ ...S.label, color: accent, marginBottom: "0.75rem" }}>Client build</span>
              <h2 style={{ fontSize: "1.35rem", margin: "0 0 0.75rem", color: "var(--text-primary)" }}>ROE is exclusive to Altima Caviar.</h2>
              <p style={{ ...S.p, fontSize: "0.925rem", marginBottom: "1.25rem" }}>
                BACCHUS ROE is the native Mac operating build for Altima Caviar's caviar account pipeline.
                It is not the generic BACCHUS SKU.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                <a href="/downloads/BACCHUS-ROE-Mac-0.1.0.dmg" download style={primaryButton}>
                  Download Mac build
                </a>
                <a href="https://altimacaviar.com" target="_blank" rel="noreferrer" style={secondaryButton}>
                  Altima Caviar
                </a>
                <a href="/downloads/BACCHUS-ROE-Mac-0.1.0.dmg.sha256.txt" download style={secondaryButton}>
                  SHA-256
                </a>
              </div>
              <p style={{ color: "var(--text-tertiary)", fontSize: "0.72rem", marginTop: "0.8rem", marginBottom: 0 }}>
                Native Mac build · unsigned · macOS may require right-click Open the first time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={{ ...S.label, marginBottom: "1rem" }}>BACCHUS ROE</span>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.75fr) minmax(0, 1.25fr)", gap: "1px", backgroundColor: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
            <div style={{ ...S.card, border: 0 }}>
              <h2 style={{ fontSize: "1.65rem", letterSpacing: "-0.035em", margin: "0 0 1rem", color: "var(--text-primary)" }}>
                Account operations for caviar buyers.
              </h2>
              <p style={{ ...S.p, marginBottom: 0 }}>
                ROE gives an operator one place to track target accounts, purchasing cadence, menu
                signals, buyer identity, account value, and the receipt trail behind every decision.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px" }}>
              {operations.map(([name, description]) => (
                <div key={name} style={{ backgroundColor: "var(--bg-card)", padding: "1.25rem" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.72rem", color: gold, fontWeight: 800 }}>{name}</span>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.6, margin: "0.65rem 0 0" }}>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={{ ...S.label, marginBottom: "1rem" }}>Portfolio</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", backgroundColor: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
            {products.map((product) => (
              <div key={product.name} style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 800, color: accent }}>{product.name}</span>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: product.status.includes("live") || product.status.includes("exclusive") ? accent : "var(--text-tertiary)", border: `1px solid ${product.status.includes("live") || product.status.includes("exclusive") ? accent : "var(--bg-border)"}`, padding: "0.125rem 0.5rem", fontFamily: "var(--font-geist-mono), monospace", whiteSpace: "nowrap" }}>
                    {product.status}
                  </span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={{ ...S.label, marginBottom: "1.25rem" }}>BACCHUS map</span>
          <p style={S.p}>
            COSMIX handles mixology workflows. BACCHUS RUSH handles restaurant training.
            BACCHUS ROE extends the same BACCHUS division into a client-specific Mac app for
            Altima Caviar, where the caviar buyer workflow needs account discipline, reorder timing,
            and proof receipts.
          </p>
          <p style={{ ...S.p, marginBottom: "2rem" }}>
            The broader BACCHUS roadmap carries the same substrate into trade compliance, cellar
            provenance, and regional market intelligence.
          </p>
          <Link href="/applications" style={{ fontSize: "0.875rem", color: accent }}>
            View deployment options →
          </Link>
        </div>
      </section>
    </>
  );
}

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 1rem",
  borderRadius: 8,
  backgroundColor: accent,
  color: "white",
  fontWeight: 800,
  fontSize: "0.875rem",
  textDecoration: "none",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 1rem",
  borderRadius: 8,
  border: "1px solid var(--bg-border)",
  color: "var(--text-secondary)",
  fontWeight: 700,
  fontSize: "0.875rem",
  textDecoration: "none",
};
