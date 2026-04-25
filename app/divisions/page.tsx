import type { Metadata } from "next";
import DivisionCard from "@/components/DivisionCard";

export const metadata: Metadata = {
  title: "Divisions — JourdanLabs",
  description:
    "Five industry divisions applying the COSMIC reasoning substrate: ATLAS, BACCHUS, HELIX, HEIMDALL, and CRUCIBLE.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
};

const DIVISIONS = [
  {
    name: "ATLAS",
    tagline: "Commercial real estate intelligence",
    headline: "MineralLogic",
    products: "MineralLogic · PropertyGraph · NAUTILUS (dev)",
    href: "/divisions/atlas",
    accent: "#D4A574",
  },
  {
    name: "BACCHUS",
    tagline: "Beverage industry operations",
    headline: "COSMIX",
    products: "COSMIX (live, 1800+ venues) · BACCHUS RUSH · Trade / Cellar / Atlas (dev)",
    href: "/divisions/bacchus",
    accent: "#7D2348",
  },
  {
    name: "HELIX",
    tagline: "Healthcare workflow automation",
    headline: "HELIX",
    products: "HELIX (TestFlight) · PHAROS (dev)",
    href: "/divisions/helix",
    accent: "#E8735A",
  },
  {
    name: "HEIMDALL",
    tagline: "Security operations & compliance",
    headline: "SENTINEL",
    products: "SENTINEL (pre-pilot)",
    href: "/divisions/heimdall",
    accent: "#4A7BA7",
  },
  {
    name: "CRUCIBLE",
    tagline: "Open research & validation infrastructure",
    headline: "VANTAGE",
    products: "VANTAGE · RAVEN · Benchmark Program",
    href: "/crucible",
    accent: "var(--accent)",
  },
];

export default function DivisionsPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <div style={{ maxWidth: 640 }}>
            <span style={{ ...S.label, marginBottom: "1rem" }}>Divisions</span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              Five industry verticals. One substrate.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              Each JourdanLabs division applies the COSMIC reasoning substrate to a regulated industry
              domain. The pipeline, methodology, and validation infrastructure are shared. The domain
              knowledge, corpora, and product interfaces are division-specific.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1px",
              backgroundColor: "var(--bg-border)",
              border: "1px solid var(--bg-border)",
            }}
          >
            {DIVISIONS.map((d) => (
              <DivisionCard key={d.name} {...d} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={{ ...S.label, marginBottom: "1.5rem" }}>The shared substrate</span>
          <p style={S.p}>
            Every division product runs on the same COSMIC engine layer: NOVA for evidence retrieval,
            ECLIPSE for adversarial challenge, PULSAR for aggregation, AURORA for confidence gating,
            and LUNA for audit trail. Domain-specific knowledge is encoded in sealed corpora, not in
            the engine architecture.
          </p>
          <p style={S.p}>
            This means CRUCIBLE's benchmark program validates all five divisions simultaneously.
            When VANTAGE runs a diagnostic scan across division domains, the same pipeline architecture
            is being tested — just against different sealed corpora.
          </p>
        </div>
      </section>
    </>
  );
}
