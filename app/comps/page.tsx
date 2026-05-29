import type { Metadata } from "next";
import BackLink from "@/components/BackLink";
import CipherFinanceRunner from "@/components/CipherFinanceRunner";

export const metadata: Metadata = {
  title: "COMPS - Deterministic Comparable Companies",
  description:
    "COMPS turns comparable company analysis into a reproducible valuation workflow with visible assumptions.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1180, margin: "0 auto", padding: "0 1.25rem" },
  label: {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--accent)",
    marginBottom: "1rem",
    display: "block",
  },
  p: { color: "var(--text-secondary)", lineHeight: 1.75 },
};

type PageProps = {
  searchParams?: Promise<{ ticker?: string; target?: string }>;
};

export default async function CompsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const initialTicker = resolvedSearchParams?.ticker ?? resolvedSearchParams?.target ?? "NVDA";

  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/banking" label="Back to Banking" />
          <span style={S.label}>COMPS</span>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              fontWeight: 950,
              letterSpacing: "-0.055em",
              lineHeight: 0.95,
              color: "var(--text-primary)",
              maxWidth: 840,
              marginBottom: "1rem",
            }}
          >
            Comparable company analysis.
          </h1>
          <p style={{ ...S.p, fontSize: "1.05rem", maxWidth: 780 }}>
            Comps estimate value by comparing a company to similar public companies or transactions.
            The hard part is not the arithmetic - it is choosing the right peer set, normalizing the
            metrics, and preserving the assumptions. COMPS keeps that chain visible. This page now runs
            the local CIPHER COMPS workbench directly from SEC Company Facts and market snapshots.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <CipherFinanceRunner mode="comps" initialTicker={initialTicker} />
        </div>
      </section>
    </>
  );
}
