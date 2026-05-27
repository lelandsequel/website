import type { Metadata } from "next";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "ALCHEMIST Credit - Banking Model",
  description:
    "ALCHEMIST Credit is a deterministic debt screen for leverage, coverage, free cash flow cushion, source gaps, and refusal boundaries.",
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
  ["Net debt / EBITDA", "3.6x", "Watch", "Below hard refusal level, above target comfort range."],
  ["EBITDA / cash interest", "3.1x", "Pass", "Coverage clears minimum screen with disclosed interest assumption."],
  ["FCF after debt service", "$42.0mm", "Watch", "Positive but thin against capex and working-capital swing."],
  ["Liquidity runway", "18 months", "Pass", "Cash plus revolver availability covers modeled cash needs."],
];

const boundaries = [
  "Live deterministic API runner; this page computes first-pass credit math from supplied packets while preserving explicit advisory boundaries.",
  "Not investment advice, a credit rating, or a recommendation to lend, buy, sell, hold, refinance, or restructure.",
  "Not legal covenant interpretation; missing definitions, baskets, EBITDA add-backs, restricted payment tests, or cure rights produce ABSTAIN.",
  "Refuses if debt schedule, interest rate, maturity wall, EBITDA source, or liquidity support is absent or internally inconsistent.",
  "Flags sensitivity and diligence questions; humans decide credit approval, documentation, and risk appetite.",
];

const casePacket = `COPYABLE CREDIT PACKET
Borrower: Northstar Components, Inc.
Business: Engineered components supplier with aerospace and medical end markets
Fiscal periods: FY2025 actuals; FY2026E sponsor base case

Source references:
- FY2025 Form 10-K, filed 2026-02-24, Item 7 and Note 9 debt table: https://investors.northstarcomponents.example/sec/2025-10-k
- FY2026 lender model v3.2, "Base Case - Credit", cells F42:F58, received 2026-03-06
- Revolver borrowing base certificate dated 2026-03-31

Source facts and assumptions:
- FY2025 adjusted EBITDA: $150.0mm; add-back schedule is provided, restructuring add-back support is not provided
- FY2025 gross debt: $605.0mm, including $480.0mm TLB, $75.0mm notes, $50.0mm drawn revolver
- Cash and equivalents: $65.0mm; minimum cash assumption: $20.0mm
- Net debt: $540.0mm
- FY2026E cash interest: $48.0mm, assuming SOFR 4.25% plus 350 bps on floating-rate debt
- Maintenance capex: $32.0mm; cash taxes: $18.0mm; working capital outflow: $10.0mm
- Undrawn revolver: $120.0mm before $15.0mm LC usage
- Revolver maturity: 2028; term loan maturity: 2030; notes maturity: 2031
- Management case assumes 4.0% organic revenue growth and 20 bps EBITDA margin expansion

Missing-evidence hooks:
- Credit agreement EBITDA definitions are not supplied.
- Borrowing base eligibility report is summarized but not attached.
- No current ratings-agency report, lien search, collateral appraisal, or field exam is supplied.

Screen rules:
- PASS leverage if net debt / EBITDA <= 3.0x; WATCH if 3.0x to 4.0x; FAIL above 4.0x.
- PASS coverage if EBITDA / cash interest >= 2.5x.
- WATCH free cash flow cushion if below $50.0mm.
- Treat minimum cash as restricted for liquidity cushion only; do not subtract it again from net debt.
- ABSTAIN on covenant interpretation, collateral sufficiency, ratings language, and lending recommendation unless the missing evidence is supplied.`;

const sampleOutput = `ALCHEMIST CREDIT OUTPUT
Subject: Northstar Components, Inc.
Source receipts: FY2025 Form 10-K Item 7 / Note 9; FY2026E lender model v3.2; 2026-03-31 borrowing base certificate
Fiscal basis: FY2025 actual EBITDA and debt; FY2026E cash interest, capex, taxes, and working-capital assumptions
Assumption mode: deterministic API runner using supplied packet facts only; no market-pricing feed, ratings model, or legal covenant engine

Verdict: WATCH
Net debt: $540.0mm
Adjusted EBITDA: $150.0mm
Net debt / EBITDA: 3.6x
Cash interest: $48.0mm
EBITDA / cash interest: 3.1x
FCF after debt service: $42.0mm
Liquidity note: $120.0mm undrawn revolver less $15.0mm LC usage; $20.0mm minimum cash is a cushion assumption

Deterministic flags:
- WATCH: leverage exceeds 3.0x internal screen.
- PASS: coverage remains above 2.5x screen.
- WATCH: free cash flow cushion is positive but below $50.0mm.
- MISSING EVIDENCE: restructuring add-back support, credit agreement definitions, full borrowing base eligibility detail, lien search, collateral appraisal, field exam, and ratings report are not supplied.
- ABSTAIN ON COVENANTS: no credit agreement definitions supplied, so the model will not interpret EBITDA add-backs, baskets, cures, or restricted-payment capacity.

Safe conclusion:
The borrower clears a first-pass debt-service screen but requires review of covenant definitions, maturity schedule, collateral, and downside EBITDA before any financing decision.`;

const llmPrompt = `Compare an ordinary LLM answer to ALCHEMIST Credit:

Paste the COPYABLE CREDIT PACKET above into the LLM.

Ask for a credit view using only the provided receipts. The answer should compute leverage, coverage, FCF cushion, and liquidity notes; cite the filing/model refs it used; identify every missing-evidence hook; avoid legal covenant interpretation, collateral sufficiency, ratings language, and lending recommendation; and clearly state that the output is not investment advice, a credit rating, or a commitment to lend.`;

const benchmarkRows = [
  ["Arithmetic", "Computes 3.6x leverage, 3.1x coverage, and $42.0mm FCF cushion.", "May calculate correctly but often omits one source bridge."],
  ["Missing evidence", "ABSTAINS on covenants until definitions are supplied.", "Often summarizes covenant risk without refusing interpretation."],
  ["Decision posture", "WATCH, with named pass/watch/fail rules.", "May drift into a lend / do not lend recommendation."],
  ["Assumptions", "States this is a deterministic runner, not a credit rating or underwriting committee.", "May imply broader diligence coverage than facts support."],
];

export default function CreditModelPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/banking" label="Back to ALCHEMIST Banking" />
          <span style={S.label}>ALCHEMIST - BANKING - CREDIT</span>
          <h1 style={S.h1}>A debt screen that knows when to stop.</h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 850 }}>
            ALCHEMIST Credit turns borrower financials, debt schedules, liquidity, and
            operating assumptions into a deterministic credit posture. It computes core
            ratios, names missing evidence, and refuses to cosplay as legal counsel or an
            investment committee. This page is backed by a deterministic API runner, not a
            credit rating or underwriting committee.
          </p>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5rem" }}>
        <div style={{ ...S.container, ...S.grid }}>
          {metrics.map(([name, value, status, note]) => (
            <div key={name} style={S.panel}>
              <span style={S.label}>{status}</span>
              <h2 style={S.h2}>{value}</h2>
              <strong style={{ color: "var(--text-primary)", display: "block", marginTop: "0.8rem" }}>
                {name}
              </strong>
              <p style={{ ...S.p, fontSize: "0.88rem", marginTop: "0.4rem" }}>{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 0 5rem" }}>
        <div style={{ ...S.container, display: "grid", gap: "1rem" }}>
          <div style={S.panel}>
            <span style={S.label}>Product explanation</span>
            <h2 style={S.h2}>Built for first-pass credit diligence.</h2>
            <p style={{ ...S.p, marginTop: "0.8rem" }}>
              The model separates mechanical credit math from professional judgment. It
              calculates leverage, coverage, cash-flow cushion, and liquidity runway from
              provided sources, then emits a pass, watch, fail, or abstain posture with
              evidence-backed reasons.
            </p>
          </div>
          <div style={S.panel}>
            <span style={S.label}>Copyable test packet</span>
            <pre style={{ ...S.code, marginTop: "1rem" }}>{casePacket}</pre>
          </div>
          <div style={S.panel}>
            <span style={S.label}>Expected ALCHEMIST output</span>
            <p style={{ ...S.p, marginTop: "0.8rem" }}>
              A compliant answer should land on WATCH, show the ratio math, and abstain on
              covenant interpretation until the actual agreement language is supplied.
            </p>
          </div>
          <pre style={S.code}>{sampleOutput}</pre>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={{ ...S.container, ...S.grid }}>
          <div style={S.panel}>
            <span style={S.label}>Refusal boundaries</span>
            <h2 style={S.h2}>Safe by construction.</h2>
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
            <h2 style={S.h2}>Score behavior, not prose.</h2>
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
            mode="credit"
            title="Run the credit screen."
            intro="Edit the borrower packet. The deterministic runner expects period labels, debt schedule, interest assumptions, liquidity support, source refs, and missing-evidence hooks; it recomputes ratios and returns blockers/refusals instead of inventing covenants, ratings, or lending advice."
            initialPacket={casePacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own credit packet."
            packetPlaceholder={`Paste a sanitized borrower packet here with fiscal periods, source URLs or filing refs, EBITDA bridge, debt schedule by instrument, cash/minimum cash, interest assumptions, capex, taxes, working capital, maturities, revolver availability, covenant snippets, and the evidence that is missing.\n\nAsk the model for leverage, coverage, FCF cushion, liquidity runway, source receipts, missing-evidence hooks, and refusal boundaries.`}
            expected="Compute source-backed ratios only; preserve period labels and receipts; refuse covenant/legal interpretation, credit-rating language, collateral sufficiency, and lending recommendations unless the required evidence is present."
          />
        </div>
      </section>
    </>
  );
}
