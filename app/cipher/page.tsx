import type { Metadata } from "next";
import BackLink from "@/components/BackLink";
import CipherFinanceRunner from "@/components/CipherFinanceRunner";

export const metadata: Metadata = {
  title: "CIPHER - Deterministic DCF",
  description:
    "CIPHER turns valuation assumptions into reproducible DCF outputs with visible audit trails.",
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

export default async function CipherPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const initialTicker = resolvedSearchParams?.ticker ?? resolvedSearchParams?.target ?? "NVDA";

  return (
    <section style={{ padding: "3.25rem 0 5.5rem" }}>
      <div style={S.container}>
        <BackLink href="/alchemist/banking" label="Back to Banking" />
        <span style={S.label}>CIPHER</span>
        <h1
          style={{
            fontSize: "clamp(2.35rem, 6vw, 4.8rem)",
            fontWeight: 950,
            letterSpacing: "-0.055em",
            lineHeight: 0.95,
            color: "var(--text-primary)",
            maxWidth: 780,
            marginBottom: "0.65rem",
          }}
        >
          Deterministic DCF.
        </h1>
        <p style={{ ...S.p, fontSize: "1.02rem", maxWidth: 760, marginBottom: "1.2rem" }}>
          Enter a public ticker. CIPHER resolves the filer, pulls the source data,
          computes the DCF, and seals the receipt.
        </p>
        <CipherFinanceRunner mode="dcf" initialTicker={initialTicker} />
      </div>
    </section>
  );
}
