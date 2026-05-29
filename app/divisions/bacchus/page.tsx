import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BACCHUS — Luxury Hospitality Intelligence",
  description:
    "BACCHUS applies COSMIC to luxury hospitality operations: market intelligence, mixology, restaurant training, kitchen execution, and Altima Caviar-exclusive caviar account operations.",
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
    name: "BACCHUS Cellar Intelligence",
    status: "Distributor workbench",
    href: "/bacchus/cellar",
    description:
      "Premium spirits distribution workbench for account fit, first move, staff education, depletion cadence, proof rows, and refusal boundaries.",
  },
  {
    name: "BACCHUS Intel",
    status: "Market intelligence",
    href: "https://www.bacchusintel.com/",
    description:
      "Luxury hospitality intelligence layer for menus, pricing, geography, behavior, demand signals, and market-position decisions.",
  },
  {
    name: "COSMIX",
    status: "Mixology",
    href: "https://www.bacchusintel.com/cosmix",
    description:
      "Mixology and menu-intelligence product for cocktail programs, ingredient logic, pricing signals, and bar-team execution.",
  },
  {
    name: "BACCHUS RUSH",
    status: "Restaurant training",
    href: "https://www.bacchusrush.com/",
    description:
      "Restaurant training and service-simulation app with role tracks, station drills, ticket reading, live service pressure, and manager feedback.",
  },
  {
    name: "BACCHUS Festivus",
    status: "Kitchen ops",
    href: "https://www.bacchusfestivus.com/",
    description:
      "Event and kitchen execution workspace for prep tasks, order guide, inventory, intelligence view, and executive operations dashboard.",
  },
  {
    name: "BACCHUS Platform",
    status: "Luxury food intelligence",
    href: "https://bacchus-platform-web.vercel.app/dashboard",
    description:
      "Account-scoring and pipeline workspace for openings, accounts, maps, events, territory health, reports, market intel, and chef network views.",
  },
  {
    name: "BACCHUS ROE",
    status: "Altima-exclusive · native Mac",
    href: "/downloads/BACCHUS-ROE-Mac-0.1.0.dmg",
    description:
      "Caviar account pipeline built for Altima Caviar. Tracks buyer programs, reorder risk, AURORA account scoring, CSV imports, account briefs, and SHA-chained receipts.",
  },
  {
    name: "BACCHUS Training",
    status: "Discipline engine",
    href: "https://www.bacchustraining.com/",
    description:
      "Training and discipline-engine surface for hospitality teams. Sparse public surface today; tracked as part of the BACCHUS cleanup map.",
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
                <Link href="/bacchus/cellar" style={primaryButton}>
                  Open Cellar Intelligence
                </Link>
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
          <span style={{ ...S.label, marginBottom: "1rem" }}>Product map</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", backgroundColor: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
            {products.map((product) => (
              <div key={product.name} style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 800, color: accent }}>{product.name}</span>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: product.status.includes("exclusive") ? accent : "var(--text-tertiary)", border: `1px solid ${product.status.includes("exclusive") ? accent : "var(--bg-border)"}`, padding: "0.125rem 0.5rem", fontFamily: "var(--font-geist-mono), monospace", whiteSpace: "nowrap" }}>
                    {product.status}
                  </span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 1rem" }}>{product.description}</p>
                <a
                  href={product.href}
                  target={product.href.startsWith("http") ? "_blank" : undefined}
                  rel={product.href.startsWith("http") ? "noreferrer" : undefined}
                  download={product.href.endsWith(".dmg") ? true : undefined}
                  style={{ fontSize: "0.78rem", color: accent, fontWeight: 800, textDecoration: "none" }}
                >
                  {product.href === "/bacchus/cellar" ? "Open workbench →" : product.href.endsWith(".dmg") ? "Download build →" : "Open source surface →"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={{ ...S.label, marginBottom: "1.25rem" }}>BACCHUS map</span>
          <p style={S.p}>
            BACCHUS is a family of hospitality products, not one monolith. COSMIX handles mixology
            and menu intelligence. BACCHUS RUSH handles restaurant training and service simulation.
            Festivus / KNIFE handles kitchen execution. BACCHUS Intel and the platform dashboard
            organize the market layer.
          </p>
          <p style={{ ...S.p, marginBottom: "2rem" }}>
            BACCHUS ROE is the Altima Caviar-exclusive operating build: the caviar account pipeline,
            buyer cadence, reorder timing, account briefs, and receipts. It belongs inside BACCHUS,
            but it is not the public generic product.
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
