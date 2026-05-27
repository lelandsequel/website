import type { Metadata } from "next";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "ALCHEMIST Merger - Banking Model",
  description:
    "ALCHEMIST Merger is a deterministic transaction screen for premium, consideration mix, accretion, dilution, synergies, and refusal boundaries.",
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
  ["Offer premium", "22.0%", "Calculated against unaffected target price."],
  ["Consideration mix", "65% cash / 35% stock", "Sources and uses reconcile to purchase equity value."],
  ["Year 1 EPS impact", "-1.8%", "Dilutive before full run-rate synergies."],
  ["Synergy dependency", "High", "Accretion turns positive only after 80% realization."],
];

const boundaries = [
  "Live deterministic API runner; this page computes transaction mechanics from supplied packets while preserving legal, tax, board, and fairness boundaries.",
  "Not investment advice, merger recommendation, legal advice, tax advice, or a fairness opinion.",
  "Does not decide whether a board should approve a transaction or whether consideration is fair from a financial point of view.",
  "Refuses if share counts, offer price, unaffected price, financing terms, tax rate, acquirer EPS, or synergy assumptions are missing.",
  "Separates computed transaction math from diligence topics such as antitrust, fiduciary duties, tax structure, and definitive agreement terms.",
];

const casePacket = `COPYABLE MERGER PACKET
Acquirer: Atlas Health Systems
Target: Meridian Diagnostics
Transaction: Public-company acquisition, 65% cash / 35% stock
Fiscal periods: Acquirer CY2026E consensus EPS; target LTM EBITDA through Q1 2026; Year 1 pro forma CY2027E

Source references:
- Atlas CY2026E consensus tear sheet dated 2026-04-12: https://ir.atlashealth.example/consensus/cy2026
- Meridian Form 10-K filed 2026-02-20 and Q1 2026 Form 10-Q filed 2026-05-08: https://investors.meridiandiagnostics.example/sec
- Draft merger model v5, "Sources_Uses" and "EPS Bridge" tabs, received 2026-05-14
- Bank financing term sheet dated 2026-05-15; legal, tax, antitrust, and fairness materials not supplied

Source facts and assumptions:
- Acquirer CY2026E standalone EPS: $5.25
- Acquirer diluted shares: 220.0mm; acquirer share price: $75.00
- Target diluted shares: 75.0mm; target net debt assumed $420.0mm for enterprise-value bridge only
- Offer price: $48.80 per target share
- Unaffected target share price: $40.00 as of 2026-04-03, the last close before reported transaction rumors
- Cash consideration: 65.0% of equity purchase price
- Stock consideration: 35.0% of equity purchase price, issued at acquirer share price
- New debt coupon: 6.5%; upfront fees excluded from EPS bridge
- Cash tax rate: 25.0%
- Year 1 cost synergies: $0.0mm unless supplied; Year 2 pre-tax run-rate synergies: $120.0mm at 75.0% realization in the EPS bridge
- Transaction expenses, purchase accounting, amortization step-up, and integration capex are not supplied

Screen rules:
- Compute offer premium, equity purchase price, cash paid, stock issued, after-tax interest, and EPS impact.
- Treat Year 1 synergies as $0 unless specifically supplied.
- Flag any accretion case that depends on unsupplied run-rate synergies, purchase accounting, or cost of debt.
- ABSTAIN on fairness, board recommendation, antitrust, tax structuring, financing certainty, and definitive agreement interpretation.`;

const sampleOutput = `ALCHEMIST MERGER OUTPUT
Acquirer: Atlas Health Systems
Target: Meridian Diagnostics
Offer: $48.80 per target share
Unaffected target price: $40.00
Source receipts: Atlas consensus tear sheet dated 2026-04-12; Meridian 2026 10-K / Q1 2026 10-Q; draft merger model v5; 2026-05-15 financing term sheet
Fiscal basis: CY2026E standalone acquirer EPS; Year 1 pro forma CY2027E; Year 2 synergy case shown separately
Assumption mode: deterministic API runner using supplied packet facts only; no live market feed, fairness engine, legal review, or tax model

Verdict: DILUTION WATCH
Offer premium: 22.0%
Equity purchase price: $3,660.0mm
Consideration: 65% cash / 35% stock
New debt raised: $2,379.0mm
New shares issued: 17.1mm
Year 1 EPS impact: -1.8%
Year 2 EPS impact with $90.0mm after-tax synergies: +3.4%

Deterministic flags:
- WATCH: deal is Year 1 dilutive before synergies.
- WATCH: positive case depends on at least 80% synergy realization.
- PASS: sources and uses reconcile to purchase equity value.
- MISSING EVIDENCE: transaction expenses, purchase accounting, amortization step-up, integration capex, legal review, tax memo, antitrust analysis, board-process record, and fairness materials are not supplied.
- ABSTAIN: no fairness opinion, financing certainty conclusion, legal review, tax structuring memo, antitrust view, or board recommendation can be produced.

Safe conclusion:
The transaction math is internally consistent under supplied assumptions, but the output is not a fairness opinion or recommendation.`;

const llmPrompt = `Compare an ordinary LLM answer to ALCHEMIST Merger:

Paste the COPYABLE MERGER PACKET above into the LLM.

Ask the LLM to compute premium, consideration mix, cash paid, new shares, interest burden, and EPS impact using only the source refs supplied. It should preserve the period labels, show where Year 1 differs from Year 2, identify missing purchase-accounting and diligence evidence, refuse to provide a fairness opinion or deal recommendation, and avoid legal, tax, antitrust, financing-certainty, or board-process conclusions.`;

const benchmarkRows = [
  ["Transaction math", "Ties premium, purchase equity value, new debt, issued shares, and EPS impact.", "May get premium right but skip the accretion bridge."],
  ["Synergy handling", "Shows Year 1 dilution before synergies and Year 2 uplift with supplied synergies.", "May apply run-rate synergies too early."],
  ["Refusal posture", "ABSTAINS on fairness, board process, legal, tax, and antitrust conclusions.", "Often gives a qualitative approval view."],
  ["Boundary", "Frames the output as deterministic math, not a fairness opinion or deal committee.", "May sound like an advisory memo."],
];

export default function MergerModelPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/banking" label="Back to ALCHEMIST Banking" />
          <span style={S.label}>ALCHEMIST - BANKING - MERGER</span>
          <h1 style={S.h1}>Transaction math without banker theater.</h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 850 }}>
            ALCHEMIST Merger frames an acquisition from source-backed inputs: offer
            premium, consideration mix, financing, pro forma share count, synergy bridge,
            and EPS accretion or dilution. It makes the arithmetic legible while refusing
            legal conclusions and fairness opinions. This page is backed by a deterministic API runner, not a fairness opinion
            or production deal committee.
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
            <h2 style={S.h2}>A deterministic screen for deal structure.</h2>
            <p style={{ ...S.p, marginTop: "0.8rem" }}>
              The model computes transaction mechanics before narrative takes over. It
              shows what must be true for accretion, where synergies carry the case, and
              which inputs are unsupported, then stops short of board, legal, tax, and
              fairness judgments.
            </p>
          </div>
          <div style={S.panel}>
            <span style={S.label}>Copyable test packet</span>
            <pre style={{ ...S.code, marginTop: "1rem" }}>{casePacket}</pre>
          </div>
          <div style={S.panel}>
            <span style={S.label}>Expected ALCHEMIST output</span>
            <p style={{ ...S.p, marginTop: "0.8rem" }}>
              A compliant answer should compute dilution before run-rate synergies, show
              the exact financing bridge, and refuse any fairness or board recommendation.
            </p>
          </div>
          <pre style={S.code}>{sampleOutput}</pre>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={{ ...S.container, ...S.grid }}>
          <div style={S.panel}>
            <span style={S.label}>Refusal boundaries</span>
            <h2 style={S.h2}>The model will not bless the deal.</h2>
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
            <h2 style={S.h2}>The control is restraint.</h2>
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
            mode="merger"
            title="Run the transaction screen."
            intro="Edit the transaction packet. The deterministic runner expects unaffected-price support, share counts, financing terms, tax rate, synergy timing, source refs, and missing diligence hooks; it recomputes deal math and refuses fairness, board, tax, legal, antitrust, or financing-certainty conclusions."
            initialPacket={casePacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own merger packet."
            packetPlaceholder={`Paste a sanitized transaction packet here with acquirer and target fiscal periods, source URLs or filing refs, share counts, unaffected-price date, offer price, consideration mix, debt financing, coupon, tax rate, synergy timing, purchase-accounting assumptions, transaction expenses, and missing legal/tax/antitrust/fairness evidence.\n\nAsk the model for premium, sources and uses, new shares, accretion/dilution by period, flags, source receipts, missing-evidence hooks, and refusal boundaries.`}
            expected="Compute transaction math from supplied facts only; preserve receipts and period labels; refuse fairness opinions, board recommendations, financing-certainty claims, tax/legal/antitrust conclusions, and unsupported synergy certainty."
          />
        </div>
      </section>
    </>
  );
}
