import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BACCHUS Division — Luxury Hospitality Market Intelligence",
  description:
    "BACCHUS applies COSMIC to luxury hospitality market intelligence. COSMIX is live in 1,800+ premium venues. BACCHUS ROE is a local caviar revenue command center for luxury accounts.",
};

const accent = "#7D2348";

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
};

export default function BacchusPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)", borderTop: `2px solid ${accent}` }}>
        <div style={S.container}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <Link href="/divisions" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>← Divisions</Link>
            </div>
            <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, display: "block", marginBottom: "1rem" }}>BACCHUS</span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              Luxury hospitality market intelligence.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
              BACCHUS applies the COSMIC reasoning substrate to luxury hospitality — menu pricing
              intelligence, demand signals, and market positioning for premium venues.
              COSMIX is live in 1,800+ venues today.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.75rem" }}>
              <a href="/downloads/BACCHUS-ROE-Mac-0.1.0.dmg" download style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 42, padding: "0 1rem", borderRadius: 8, backgroundColor: accent, color: "white", fontWeight: 800, fontSize: "0.875rem", textDecoration: "none" }}>
                Download BACCHUS ROE for Mac
              </a>
              <a href="/downloads/BACCHUS-ROE-Mac-0.1.0.dmg.sha256.txt" download style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 42, padding: "0 1rem", borderRadius: 8, border: "1px solid var(--bg-border)", color: "var(--text-secondary)", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}>
                SHA-256
              </a>
            </div>
            <p style={{ color: "var(--text-tertiary)", fontSize: "0.75rem", marginTop: "0.75rem", marginBottom: 0 }}>
              Preview build · unsigned · macOS may require right-click Open the first time.
            </p>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>Products</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", backgroundColor: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
            {[
              {
                name: "BACCHUS ROE",
                status: "Mac build · live",
                description: "Local caviar revenue command center. Tracks buyer programs, reorder risk, AURORA account scoring, CSV imports, account briefs, and SHA-chained proof receipts.",
              },
              {
                name: "COSMIX",
                status: "Live · 1,800+ venues",
                description: "Luxury hospitality intelligence platform. Menu pricing, demand signals, and competitive positioning for premium venues. Deployed and scaling.",
              },
              {
                name: "BACCHUS RUSH",
                status: "In development",
                description: "Rapid on-premise deployment toolkit. Streamlined COSMIX onboarding for high-volume venue operators.",
              },
              {
                name: "BACCHUS Trade",
                status: "In development",
                description: "Distributor-to-venue trade compliance and pricing intelligence. Deterministic compliance checking against sealed state regulatory corpora.",
              },
              {
                name: "BACCHUS Cellar",
                status: "In development",
                description: "Fine wine and spirits cellar management with provenance tracking and valuation. SHA-verified provenance chains.",
              },
              {
                name: "BACCHUS Atlas",
                status: "In development",
                description: "Beverage market mapping and competitive intelligence. Venue density, pricing trends, and category performance by region.",
              },
            ].map((product) => (
              <div key={product.name} style={{ backgroundColor: "var(--bg-card)", padding: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 700, color: accent }}>{product.name}</span>
                  <span style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: product.status.startsWith("Live") ? accent : "var(--text-tertiary)", border: `1px solid ${product.status.startsWith("Live") ? accent : "var(--bg-border)"}`, padding: "0.125rem 0.5rem", fontFamily: "var(--font-geist-mono), monospace", whiteSpace: "nowrap" }}>{product.status}</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={S.label}>Live today</span>
          <p style={S.p}>
            COSMIX is the furthest-deployed product in the JourdanLabs portfolio — live in 1,800+ premium
            venues with active usage data. It is the proof that the COSMIC substrate works at operational
            scale in a high-value, demand-sensitive environment.
          </p>
          <p style={{ ...S.p, marginBottom: "2rem" }}>
            The BACCHUS roadmap extends that foundation: trade compliance (state-specific regulatory corpora),
            cellar provenance, and market intelligence all built on the same deterministic, no-LLM-at-runtime
            architecture.
          </p>
          <Link href="/applications" style={{ fontSize: "0.875rem", color: accent }}>
            View deployment options →
          </Link>
        </div>
      </section>
    </>
  );
}
