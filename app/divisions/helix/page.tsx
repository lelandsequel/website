import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HELIX Division — Wellness and Human Performance",
  description:
    "HELIX applies COSMIC to wellness and human performance: adaptive training intelligence for athletes and coaches.",
};

const accent = "#E8735A";

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
};

const PRODUCTS: Array<{ name: string; status: string; description: string; href?: string }> = [
  {
    name: "HELIX",
    status: "TestFlight",
    description: "Adaptive training intelligence for athletes and coaches. Integrates with Apple Watch and WHOOP to deliver deterministic training recommendations grounded in sealed performance corpora. No LLM guessing on load prescription.",
  },
];

export default function HelixPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)", borderTop: `2px solid ${accent}` }}>
        <div style={S.container}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <Link href="/divisions" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>← Divisions</Link>
            </div>
            <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, display: "block", marginBottom: "1rem" }}>HELIX</span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              Wellness and human performance.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
              HELIX applies the COSMIC reasoning substrate to wellness and human performance —
              adaptive training intelligence for athletes and coaches, with Apple Watch and WHOOP
              integration. It is not HYGEIA; regulated clinical safety work lives under HYGEIA.
            </p>
            <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--bg-border)", maxWidth: 560 }}>
              <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)", display: "block", marginBottom: "0.4rem" }}>Origin</span>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                HELIX is the brainchild of{" "}
                <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Charles Jourdan</strong>, CSO —
                conceived, championed, and carried by him.
              </p>
            </div>
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
                  <span style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: product.status !== "In development" ? accent : "var(--text-tertiary)", border: `1px solid ${product.status !== "In development" ? accent : "var(--bg-border)"}`, padding: "0.125rem 0.5rem", fontFamily: "var(--font-geist-mono), monospace" }}>{product.status}</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{product.description}</p>
                {product.href ? (
                  <Link href={product.href} style={{ display: "inline-flex", marginTop: "1rem", fontSize: "0.8125rem", color: accent }}>
                    Open PHAROS →
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.containerSm}>
          <span style={S.label}>Why deterministic matters in performance training</span>
          <p style={S.p}>
            Training load recommendations that hallucinate — recommending intensity a body can't handle,
            or under-loading an athlete who needs progression — cause real physical harm. HELIX grounds
            every recommendation in the athlete's own sealed performance history. The AURORA gate refuses
            to prescribe when confidence is insufficient rather than defaulting to a generic protocol.
          </p>
          <p style={{ ...S.p, marginBottom: 0 }}>
            The division boundary matters: HELIX is fitness, wellness, and human performance.
            PHAROS is clinical safety and pharmacovigilance, so it now lives under HYGEIA.
          </p>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={S.label}>Status</span>
          <p style={S.p}>
            The HELIX app is currently in TestFlight. Apple Watch and WHOOP integrations are live in the
            TestFlight build.
          </p>
        </div>
      </section>
    </>
  );
}
