import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ALCHEMIST - Deterministic Financial Modeling",
  description:
    "ALCHEMIST is the JourdanLabs finance suite: CIPHER DCF, COMPS, Credit, Merger, LBO, SOTP, scenarios, and benchmark bakeoffs with receipts.",
};

const models = [
  {
    name: "CIPHER",
    label: "DCF",
    href: "/alchemist/cipher",
    text: "SEC-backed DCF engine with LUNA audit chain, explicit assumptions, and refusal boundaries.",
  },
  {
    name: "COMPS",
    label: "Public comps",
    href: "/alchemist/comps",
    text: "Comparable-company analysis with sealed multiple definitions, fiscal alignment flags, and safe-cell refusals.",
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
    text: "Acquirer / target framing, deterministic deal math, and visible assumptions.",
  },
  {
    name: "LBO",
    label: "Sponsor return",
    href: "/alchemist/models/lbo",
    text: "First-pass sponsor return screen with source-bound assumptions and explicit risk flags.",
  },
  {
    name: "SOTP",
    label: "Segment value",
    href: "/alchemist/models/sotp",
    text: "Sum-of-the-parts framing for multi-segment businesses with model-level provenance.",
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
    text: "Run frontier LLM answers beside ALCHEMIST and score the difference in operating standard.",
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

export default function AlchemistPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <span style={S.label}>ALCHEMIST</span>
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
            ALCHEMIST is the JourdanLabs deterministic finance suite. It turns DCFs,
            comps, credit screens, merger math, LBO screens, SOTP framing, scenarios,
            and benchmark bakeoffs into source-backed workflows that compute when safe and
            refuse when the model would otherwise fabricate.
          </p>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5.5rem" }}>
        <div style={S.container}>
          <div className="alchemist-model-grid">
            {models.map((model) => (
              <Link href={model.href} key={model.name} className="alchemist-model-card">
                <span>{model.label}</span>
                <strong>{model.name}</strong>
                <p>{model.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
