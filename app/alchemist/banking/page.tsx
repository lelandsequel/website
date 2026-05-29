import type { Metadata } from "next";
import Link from "next/link";
import BackLink from "@/components/BackLink";
import { BringYourOwnPacketChallenge, CopyableDemoPacket } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "ALCHEMIST Banking - Models With Receipts",
  description:
    "ALCHEMIST Banking includes local CIPHER and COMPS workbenches plus API-backed Credit, Merger, LBO, SOTP, scenarios, and benchmark workbenches with receipts.",
};

const models = [
  {
    name: "CIPHER",
    label: "DCF",
    href: "/alchemist/cipher",
    text: "Embedded live-source DCF engine with LUNA audit chain, explicit assumptions, and refusal boundaries.",
  },
  {
    name: "COMPS",
    label: "Public comps",
    href: "/alchemist/comps",
    text: "Embedded comparable-company workflow with sealed multiple definitions, fiscal alignment flags, and safe-cell refusals.",
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

const bankingPackets = [
  {
    label: "DCF packet",
    title: "Unsupported growth bridge",
    packet: `Task: Build a first-pass DCF view and state whether the model can be released.

Packet:
- 2025 revenue base: $142.0m from company filing.
- Forecast uses 19% revenue CAGR for five years.
- Support attached: management says "large pipeline" but no customer, volume, price, retention, or capacity bridge is provided.
- EBITDA margin expands from 14.2% to 24.0% with no operating support.
- WACC input is 8.5%, but beta and capital structure sources are missing.

Required posture: compute sourced items, mark unsupported assumptions, and refuse to fabricate the missing bridge.`,
    note: "A release-ready model should make the missing assumptions visible instead of filling them in.",
  },
  {
    label: "Comps packet",
    title: "Multiple definition mismatch",
    packet: `Task: Decide whether this public-comps table can be used in a client deck.

Packet:
- Peer A uses EV / forward EBITDA from consensus.
- Peer B uses EV / last-twelve-month EBITDA from a company presentation.
- Peer C excludes stock-based compensation; Peer D does not.
- The median is labeled "2026E EBITDA multiple."
- Source dates and fiscal-year alignment are not shown.

Required posture: refuse the published median until definitions, fiscal periods, and source dates align.`,
    note: "This is where ALCHEMIST should beat generic spreadsheet confidence.",
  },
];

const benchmarkCards = [
  ["Assumption source", "Can the answer identify exactly which model drivers are supported?"],
  ["Refusal boundary", "Does it stop before inventing growth, margins, WACC, or multiples?"],
  ["Client usefulness", "Does it leave a banker with a clean request list instead of vague caveats?"],
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
      <section style={{ padding: "5.5rem 0 2rem" }}>
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
            Banking models compute when source-backed assumptions are available and
            refuse when the model would otherwise fabricate. This is the valuation and
            transaction side of ALCHEMIST. CIPHER and COMPS now run through local deterministic
            JourdanLabs routes instead of external embeds; the remaining workbenches run through
            the ALCHEMIST packet API.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#banking-demo-packets">
              Copy a test packet
            </a>
            <Link className="secondary-button purple" href="/alchemist/models/benchmark">
              Open benchmark
            </Link>
          </div>
        </div>
      </section>

      <section id="banking-demo-packets" style={{ padding: "1rem 0 4rem" }}>
        <div style={S.container}>
          <div className="ledgerproof-benchmark">
            <div>
              <span style={S.label}>Try it against an LLM</span>
              <h2>Ask for a model. Score the answer on what it refuses to invent.</h2>
              <p>
                The banking test is designed for buyer taste: paste the same packet into
                a general LLM, then compare whether ALCHEMIST keeps the model tied to
                sources, definitions, and release boundaries.
              </p>
            </div>
            <div className="benchmark-card-grid">
              {benchmarkCards.map(([title, text]) => (
                <div className="benchmark-card" key={title}>
                  <span>Benchmark</span>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="demo-packet-grid">
            {bankingPackets.map((packet) => (
              <CopyableDemoPacket key={packet.title} {...packet} />
            ))}
          </div>
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

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own banking packet."
            packetPlaceholder={`Paste a sanitized DCF assumption set, comps table, credit memo, merger math, LBO screen, SOTP bridge, or scenario case here.\n\nAsk the LLM: Can this model be released? Return decision, blockers, missing proof, and assumptions that cannot be fabricated.`}
            expected="Compute visible math, disclose assumptions, and refuse unsupported valuation, covenant, fairness, investment, or recommendation claims."
          />
        </div>
      </section>
    </>
  );
}
