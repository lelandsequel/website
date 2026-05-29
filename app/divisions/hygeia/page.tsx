import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HYGEIA Division - Clinical Safety Intelligence",
  description:
    "JourdanLabs HYGEIA applies COSMIC to clinical safety and pharmacovigilance workflows, starting with PHAROS.",
};

const accent = "#18A978";

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
};

const PRODUCTS = [
  {
    name: "PHAROS",
    status: "Live workbench",
    href: "/divisions/hygeia/pharos",
    description:
      "Deterministic pharmacovigilance signal detection. Benchmarked on 36 FDA black-box drug-event pairs across 17.76M FAERS records and 44 quarters. Runs PRR, ROR, BCPNN, and MGPS comparators, adds COSMIC feature scoring, and refuses causality overclaims from intake packets.",
  },
];

export default function HygeiaPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)", borderTop: `2px solid ${accent}` }}>
        <div style={S.container}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <Link href="/divisions" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>← Divisions</Link>
            </div>
            <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, display: "block", marginBottom: "1rem" }}>HYGEIA</span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              Clinical safety intelligence with refusal discipline.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 590 }}>
              HYGEIA is the JourdanLabs lane for regulated clinical safety workflows.
              HELIX stays focused on wellness and human performance. PHAROS lives here:
              pharmacovigilance, adverse-event signal triage, source-chain receipts, and
              no causality cosplay.
            </p>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>Products</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", backgroundColor: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
            {PRODUCTS.map((product) => (
              <div key={product.name} style={{ backgroundColor: "var(--bg-card)", padding: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 700, color: accent }}>{product.name}</span>
                  <span style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: accent, border: `1px solid ${accent}`, padding: "0.125rem 0.5rem", fontFamily: "var(--font-geist-mono), monospace" }}>{product.status}</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{product.description}</p>
                <Link href={product.href} style={{ display: "inline-flex", marginTop: "1rem", fontSize: "0.8125rem", color: accent }}>
                  Open PHAROS →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={S.label}>Why deterministic matters in pharmacovigilance</span>
          <p style={S.p}>
            Pharmacovigilance is not a place for fluent guessing. A safety-signal system needs
            denominator-aware statistics, source-chain provenance, explicit confound handling,
            and a hard boundary between signal priority and clinical causality.
          </p>
          <p style={S.p}>
            PHAROS follows that boundary: prioritize, monitor, or refuse. It can tell a safety
            team what deserves review. It does not pretend intake data is a medical, regulatory,
            or causality determination.
          </p>
        </div>
      </section>
    </>
  );
}
