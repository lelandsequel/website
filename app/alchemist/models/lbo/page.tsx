import type { Metadata } from "next";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "ALCHEMIST LBO - Banking Model",
  description:
    "ALCHEMIST LBO is a deterministic sponsor return screen for purchase price, leverage, deleveraging, exit value, IRR, MOIC, and refusal boundaries.",
};

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
  h1: {
    fontSize: "clamp(2.65rem, 7vw, 5.8rem)",
    fontWeight: 950,
    letterSpacing: "-0.058em",
    lineHeight: 0.92,
    color: "var(--text-primary)",
    maxWidth: 980,
    marginBottom: "1rem",
  },
  panel: {
    border: "1px solid var(--bg-border)",
    borderRadius: 24,
    background: "rgba(255, 255, 255, 0.84)",
    boxShadow: "var(--soft-shadow)",
    padding: "clamp(1.2rem, 3vw, 2rem)",
  },
  h2: {
    color: "var(--text-primary)",
    fontSize: "clamp(1.55rem, 3.4vw, 2.65rem)",
    lineHeight: 1,
    letterSpacing: "-0.05em",
    fontWeight: 950,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
  },
  code: {
    display: "block",
    whiteSpace: "pre-wrap",
    padding: "1rem",
    borderRadius: 16,
    border: "1px solid var(--bg-border)",
    background: "rgba(20, 24, 35, 0.94)",
    color: "#f8fafc",
    lineHeight: 1.65,
    fontSize: "0.83rem",
    overflowX: "auto",
  },
};

const metrics = [
  ["Entry multiple", "10.0x", "Purchase price divided by entry EBITDA."],
  ["Opening debt", "5.5x", "Leverage sits near the high end of the screen."],
  ["Exit debt / EBITDA", "2.3x", "Modeled cash sweep creates meaningful deleveraging."],
  ["Sponsor return", "2.1x MOIC / 16.0% IRR", "Meets a basic screen, sensitive to exit multiple."],
];

const boundaries = [
  "Live deterministic API runner; this page computes sponsor-return math from supplied packets while preserving financing, covenant, and recommendation boundaries.",
  "Not investment advice, a bid recommendation, financing commitment, solvency opinion, tax advice, or legal covenant interpretation.",
  "Refuses if purchase price, EBITDA bridge, financing mix, interest costs, capex, working capital, tax assumptions, or exit multiple support is missing.",
  "Does not assert debt capacity, lender appetite, market-clearing terms, or whether a sponsor should pursue the acquisition.",
  "Shows source-bound return math and downside pressure points for human diligence.",
];

const casePacket = `COPYABLE LBO PACKET
Target: Harbor Industrial Software
Business: Vertical-market workflow software for asset-heavy customers
Fiscal periods: LTM EBITDA through Q1 2026; entry at 2026 close; exit at FY2030E
Holding period: 5 years

Source references:
- Seller CIM dated 2026-03-18, pages 22-31, revenue cohort and EBITDA bridge
- Q1 2026 management accounts, received 2026-04-28
- Draft sponsor model v7, "Sources_Uses", "Debt_Schedule", and "Exit_Returns" tabs
- Financing indication letter dated 2026-05-10; no commitment papers or credit agreement supplied

Source facts and assumptions:
- Entry LTM adjusted EBITDA: $120.0mm; $9.0mm of add-backs disclosed, but customer-migration add-back backup is missing
- Entry purchase multiple: 10.0x EBITDA
- Purchase enterprise value excludes transaction fees and management rollover unless supplied
- Opening debt: 5.5x entry EBITDA; assumes 60% floating-rate TLB at SOFR 4.25% plus 425 bps
- Sponsor equity funds the remainder of purchase enterprise value
- Cash sweep assumes 75.0% of free cash flow after cash taxes, capex, and required amortization
- Year 5 EBITDA: $165.0mm; exit multiple: 9.0x EBITDA; exit net debt: $380.0mm
- Downside case: 8.0x exit multiple and 5.0% EBITDA CAGR
- Capex, working capital, transaction fees, management rollover, PIK toggle, and dividend recap proceeds are not supplied

Screen rules:
- Compute purchase EV, opening debt, sponsor equity, exit EV, exit equity value, MOIC, and rough IRR.
- PASS MOIC if >= 2.0x; WATCH IRR if below 20.0%.
- Treat exit net debt as supplied; do not infer a full operating model when cash sweep details are missing.
- ABSTAIN on covenant interpretation, financing certainty, debt capacity, lender appetite, solvency, and bid recommendation.`;

const sampleOutput = `ALCHEMIST LBO OUTPUT
Target: Harbor Industrial Software
Entry EBITDA: $120.0mm
Entry multiple: 10.0x
Purchase enterprise value: $1,200.0mm
Opening debt: $660.0mm
Sponsor equity: $540.0mm
Source receipts: 2026-03-18 CIM pages 22-31; Q1 2026 management accounts; sponsor model v7; 2026-05-10 financing indication letter
Fiscal basis: LTM through Q1 2026 at entry; FY2030E exit case
Assumption mode: deterministic API runner using supplied packet facts only; no debt-capacity engine, market-clearing financing feed, or bid committee

Year 5 EBITDA: $165.0mm
Exit multiple: 9.0x
Exit enterprise value: $1,485.0mm
Exit net debt: $380.0mm
Sponsor equity value at exit: $1,105.0mm
MOIC: 2.1x
IRR: 16.0%

Deterministic flags:
- PASS: base case clears 2.0x MOIC.
- WATCH: IRR is below a 20.0% sponsor hurdle.
- WATCH: entry leverage is 5.5x EBITDA.
- FAIL IN DOWNSIDE: 8.0x exit multiple and 5% EBITDA CAGR reduce MOIC below 1.6x.
- MISSING EVIDENCE: customer-migration add-back backup, capex, working capital, fees, management rollover, financing commitment, credit agreement, and solvency materials are not supplied.
- ABSTAIN ON COVENANTS / FINANCING: no credit agreement or commitment papers supplied, so the model will not opine on lender appetite, debt capacity, covenant capacity, or bid support.

Safe conclusion:
The base case produces a modest sponsor return but depends on deleveraging and exit multiple support. This is not investment advice or a financing recommendation.`;

const llmPrompt = `Compare an ordinary LLM answer to ALCHEMIST LBO:

Paste the COPYABLE LBO PACKET above into the LLM.

Ask the LLM to compute purchase EV, opening debt, sponsor equity contribution, exit EV, exit equity value, MOIC, and rough IRR using only the stated source refs. It should preserve the LTM and FY2030E period labels, identify missing add-back and financing evidence, state sensitivity to exit multiple and EBITDA CAGR, refuse covenant/financing/debt-capacity/solvency interpretation, and avoid bid or investment advice.`;

const benchmarkRows = [
  ["Sources and uses", "Ties $1.2bn purchase EV to $660.0mm debt and $540.0mm sponsor equity.", "May skip the debt-to-equity bridge."],
  ["Return math", "Computes $1.105bn exit equity, 2.1x MOIC, and 16.0% IRR.", "May state the return qualitatively without a tie-out."],
  ["Sensitivity", "Flags exit multiple and downside case pressure.", "Often treats the base case as a conclusion."],
  ["Refusal posture", "ABSTAINS on financing availability, covenants, and bid recommendation.", "May imply the sponsor should proceed."],
];

export default function LboModelPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/banking" label="Back to ALCHEMIST Banking" />
          <span style={S.label}>ALCHEMIST - BANKING - LBO</span>
          <h1 style={S.h1}>Sponsor return math with visible pressure points.</h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 850 }}>
            ALCHEMIST LBO converts purchase price, debt mix, operating forecasts, cash
            sweep, and exit assumptions into deterministic MOIC and IRR outputs. It is a
            deterministic API-backed diligence screen, not a bid memo or financing commitment
            hiding behind confident prose.
          </p>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5rem" }}>
        <div style={{ ...S.container, ...S.grid }}>
          {metrics.map(([name, value, note]) => (
            <div key={name} style={S.panel}>
              <span style={S.label}>{name}</span>
              <h2 style={S.h2}>{value}</h2>
              <p style={{ ...S.p, fontSize: "0.88rem", marginTop: "0.65rem" }}>{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 0 5rem" }}>
        <div style={{ ...S.container, display: "grid", gap: "1rem" }}>
          <div style={S.panel}>
            <span style={S.label}>Product explanation</span>
            <h2 style={S.h2}>A first-pass sponsor model that exposes the case.</h2>
            <p style={{ ...S.p, marginTop: "0.8rem" }}>
              The model calculates the sources and uses, debt paydown, exit equity value,
              MOIC, and IRR from stated assumptions. It then identifies whether the return
              depends on aggressive leverage, exit multiple expansion, margin growth, or
              unsupported financing terms.
            </p>
          </div>
          <div style={S.panel}>
            <span style={S.label}>Copyable test packet</span>
            <pre style={{ ...S.code, marginTop: "1rem" }}>{casePacket}</pre>
          </div>
          <div style={S.panel}>
            <span style={S.label}>Expected ALCHEMIST output</span>
            <p style={{ ...S.p, marginTop: "0.8rem" }}>
              A compliant answer should reconcile sources and uses, show sponsor return
              math, flag downside multiple risk, and refuse any financing or bid decision.
            </p>
          </div>
          <pre style={S.code}>{sampleOutput}</pre>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={{ ...S.container, ...S.grid }}>
          <div style={S.panel}>
            <span style={S.label}>Refusal boundaries</span>
            <h2 style={S.h2}>No false conviction.</h2>
            <div style={{ display: "grid", gap: "0.7rem", marginTop: "1rem" }}>
              {boundaries.map((item) => (
                <p key={item} style={{ ...S.p, margin: 0 }}>
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div style={S.panel}>
            <span style={S.label}>LLM test prompt</span>
            <h2 style={S.h2}>Conceptual bakeoff.</h2>
            <pre style={{ ...S.code, marginTop: "1rem" }}>{llmPrompt}</pre>
          </div>
          <div style={S.panel}>
            <span style={S.label}>Side-by-side benchmark posture</span>
            <h2 style={S.h2}>Returns are not recommendations.</h2>
            <div style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
              {benchmarkRows.map(([control, alchemist, llm]) => (
                <p key={control} style={{ ...S.p, margin: 0 }}>
                  <strong style={{ color: "var(--text-primary)" }}>{control}: </strong>
                  ALCHEMIST {alchemist} Ordinary LLM {llm}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <AlchemistLiveRunner
            mode="lbo"
            title="Run the sponsor return screen."
            intro="Edit the LBO packet. The deterministic runner expects entry/exit periods, EBITDA support, leverage, exit assumptions, source refs, and missing financing hooks; it recomputes sources and uses, MOIC, IRR, sensitivities, and refusals without inventing debt capacity or bid advice."
            initialPacket={casePacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own LBO packet."
            packetPlaceholder={`Paste a sanitized sponsor case here with fiscal periods, source URLs or filing refs, EBITDA bridge and add-back support, entry multiple, fees, debt quantum by tranche, cash sweep assumptions, capex, taxes, working capital, exit EBITDA, exit multiple, exit debt, downside assumptions, financing caveats, and missing commitment/covenant evidence.\n\nAsk the model for sources and uses, exit equity value, MOIC, IRR, sensitivity flags, source receipts, missing-evidence hooks, and refusal boundaries.`}
            expected="Tie out sponsor return math from supplied facts; preserve period labels and receipts; flag downside pressure; refuse bid recommendations, debt-capacity claims, solvency conclusions, covenant/legal interpretation, and unsupported financing certainty."
          />
        </div>
      </section>
    </>
  );
}
