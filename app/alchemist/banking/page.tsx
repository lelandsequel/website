import type { Metadata } from "next";
import Link from "next/link";
import BackLink from "@/components/BackLink";
import CipherFinanceRunner from "@/components/CipherFinanceRunner";

export const metadata: Metadata = {
  title: "ALCHEMIST Banking - Financial Model Workflows",
  description:
    "ALCHEMIST Banking contains eight deterministic financial-model workflows: CIPHER, COMPS, Credit, Merger, LBO, SOTP, Scenarios, and Benchmark.",
};

const models = [
  {
    name: "CIPHER",
    label: "DCF",
    href: "/alchemist/cipher",
    text: "Live-source DCF workflow with explicit assumptions, LUNA receipts, and refusal boundaries.",
  },
  {
    name: "COMPS",
    label: "Public comps",
    href: "/alchemist/comps",
    text: "Comparable-company workflow with peer definitions, fiscal alignment flags, and unsafe-denominator refusals.",
  },
  {
    name: "CREDIT",
    label: "Debt screen",
    href: "/alchemist/models/credit",
    text: "Leverage, coverage, FCF cushion, and deterministic credit flags without legal covenant interpretation.",
  },
  {
    name: "MERGER",
    label: "Transaction screen",
    href: "/alchemist/models/merger",
    text: "Acquirer / target framing, deterministic deal math, and visible assumption handling.",
  },
  {
    name: "LBO",
    label: "Sponsor return",
    href: "/alchemist/models/lbo",
    text: "First-pass sponsor return workflow with source-bound assumptions and risk flags.",
  },
  {
    name: "SOTP",
    label: "Segment value",
    href: "/alchemist/models/sotp",
    text: "Sum-of-the-parts workflow for multi-segment businesses with model-level provenance.",
  },
  {
    name: "SCENARIOS",
    label: "Sensitivity",
    href: "/alchemist/models/scenarios",
    text: "Bull, base, bear, and downside cases with deterministic deltas and audit-ready outputs.",
  },
  {
    name: "BENCHMARK",
    label: "LLM bakeoff",
    href: "/alchemist/models/benchmark",
    text: "Run frontier LLM answers beside ALCHEMIST and score the operating-standard gap.",
  },
];

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1180, margin: "0 auto", padding: "0 1.25rem" },
  label: {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "1rem",
    display: "block",
  },
  p: { color: "var(--text-secondary)", lineHeight: 1.72 },
};

export default function BankingPage() {
  return (
    <>
      <section style={{ padding: "3.25rem 0 1rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist" label="Back to ALCHEMIST" />
          <span style={S.label}>ALCHEMIST · BANKING</span>
          <h1
            style={{
              fontSize: "clamp(2.75rem, 8vw, 6rem)",
              fontWeight: 950,
              letterSpacing: "-0.06em",
              lineHeight: 0.92,
              color: "var(--text-primary)",
              maxWidth: 900,
              marginBottom: "1rem",
            }}
          >
            Financial models with receipts.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 820 }}>
            Start with CIPHER, then branch into comps, credit, transactions,
            scenarios, or the LLM benchmark once the room is paying attention.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 0 2rem" }}>
        <div style={S.container}>
          <CipherFinanceRunner mode="dcf" initialTicker="NVDA" />
        </div>
      </section>

      <section style={{ padding: "1rem 0 6rem" }}>
        <div style={S.container}>
          <div className="alchemist-model-grid">
            {models.map((model) => (
              <Link href={model.href} key={model.name} className="alchemist-model-card">
                <span>{model.label}</span>
                <strong>{model.name}</strong>
                <p>{model.text}</p>
                <em>Open workflow</em>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
