import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ATLAS Division — Real-Asset Intelligence",
  description:
    "ATLAS applies COSMIC to real assets: mineral rights title chains, ownership graph reconstruction, and NAUTILUS global commodity flow.",
};

const accent = "#D4A574";

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
};

export default function AtlasPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)", borderTop: `2px solid ${accent}` }}>
        <div style={S.container}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <Link href="/divisions" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>← Divisions</Link>
            </div>
            <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, display: "block", marginBottom: "1rem" }}>ATLAS</span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              Real-asset intelligence.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
              ATLAS applies the COSMIC reasoning substrate to real assets — mineral rights title chains,
              ownership graph reconstruction, and global commodity flow modeling.
              Deterministic. No guessing on ownership structures.
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
                name: "MineralLogic",
                status: "Active",
                description: "Mineral rights title chain reconstruction from public land records. Deterministic ownership graph with SHA-verified source documents. No LLM inference on title claims.",
                vantage: "88.5%",
              },
              {
                name: "PropertyGraph",
                status: "Active",
                description: "Commercial property ownership and encumbrance graph. Integrates deed records, liens, and ownership history into a traversable graph structure.",
                vantage: "88.9%",
              },
              {
                name: "NAUTILUS",
                status: "In development",
                description: "Global commodity flow modeling. Maps supply chains, trade routes, and commodity movement at portfolio scale. Built on ATLAS's ownership graph foundation.",
                vantage: "81.5%",
              },
            ].map((product) => (
              <div key={product.name} style={{ backgroundColor: "var(--bg-card)", padding: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 700, color: accent }}>{product.name}</span>
                  <span style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", border: "1px solid var(--bg-border)", padding: "0.125rem 0.5rem", fontFamily: "var(--font-geist-mono), monospace", whiteSpace: "nowrap" }}>{product.status}</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>{product.description}</p>
                {product.vantage !== "—" && (
                  <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                    VANTAGE score: <span style={{ fontFamily: "var(--font-geist-mono), monospace", color: accent }}>{product.vantage}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={S.label}>Why deterministic matters in real estate</span>
          <p style={S.p}>
            Mineral rights title chains can run 150 years deep, with deeds, conveyances, reservations,
            and assignments from dozens of parties. A hallucinated ownership claim in this context is not
            a minor inaccuracy — it is the basis of a title dispute worth millions. Commodity flow maps
            carry the same stakes: misattributed ownership or misrouted supply chains have real financial
            and compliance consequences.
          </p>
          <p style={{ ...S.p, marginBottom: "2rem" }}>
            ATLAS reconstructs ownership chains only from documents in the sealed corpus. Where the
            record is ambiguous or the chain is broken, AURORA refuses to emit a verdict. The refusal
            is the correct answer.
          </p>
          <Link href="/crucible/vantage" style={{ fontSize: "0.875rem", color: accent }}>
            View ATLAS VANTAGE scan receipts →
          </Link>
        </div>
      </section>
    </>
  );
}
