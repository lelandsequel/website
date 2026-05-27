import type { Metadata } from "next";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "ALCHEMIST Banking - Scenario Model",
  description:
    "Public ALCHEMIST scenario banking model with deterministic outputs, refusal boundaries, and LLM comparison prompt.",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1rem",
  },
  panel: {
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "1.2rem",
    background: "var(--surface)",
  },
  tableWrap: { overflowX: "auto", border: "1px solid var(--border)", borderRadius: 8 },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 780 },
  th: {
    textAlign: "left",
    padding: "0.8rem",
    color: "var(--text-secondary)",
    fontSize: "0.78rem",
    fontFamily: "var(--font-geist-mono), monospace",
    textTransform: "uppercase",
  },
  td: { padding: "0.85rem", borderTop: "1px solid var(--border)", color: "var(--text-primary)" },
  code: {
    fontFamily: "var(--font-geist-mono), monospace",
    color: "var(--accent)",
    fontSize: "0.86rem",
  },
};

const scenarios = [
  ["Downside", "2.0%", "23.0%", "$3.12bn", "$18.7bn", "Covenant cushion under 12%; lender case not supplied"],
  ["Bear", "4.0%", "25.0%", "$3.55bn", "$22.0bn", "Pricing pressure persists per Q1 churn memo"],
  ["Base", "7.0%", "27.0%", "$4.10bn", "$27.4bn", "Ties to source plan; not board-approved evidence"],
  ["Bull", "10.0%", "29.0%", "$4.72bn", "$34.1bn", "Arithmetic-only upside; retention proof missing"],
];

const boundaries = [
  "Live deterministic API runner; this page computes scenario tables from supplied packets while preserving forecast-approval and recommendation boundaries.",
  "Refuses named scenarios when drivers are not provided or cannot be tied to a source case.",
  "Refuses to label a case as management, sponsor, lender, or board-approved without evidence.",
  "Flags circular logic, mixed time periods, and unsupported margin expansion.",
  "Does not provide investment advice, a fairness opinion, or a recommendation to buy, sell, hold, merge, or finance.",
];

const casePacket = `COPYABLE SCENARIO PACKET
Company: SampleCo Software
Fiscal periods: CY2025 actuals baseline; CY2026E operating cases
Purpose: Deterministic scenario table for a banking discussion

Source references:
- FY2025 Form 10-K filed 2026-02-28, revenue and adjusted EBITDA reconciliation: https://investors.samplecosoftware.example/sec/2025-10-k
- Q1 2026 board plan extract dated 2026-04-21, pages 8-13
- Draft lender model v4, "Scenario_Output" tab, received 2026-05-06
- Customer-retention cohort backup for bull case is requested but not supplied

Source facts and assumptions:
- Base case revenue growth: 7.0%
- Base case EBITDA margin: 27.0%
- Base case CY2026E EBITDA: $4.10bn
- Base case implied equity value: $27.4bn
- Downside: 2.0% revenue growth, 23.0% EBITDA margin, $3.12bn CY2026E EBITDA, $18.7bn equity value
- Bear: 4.0% revenue growth, 25.0% EBITDA margin, $3.55bn CY2026E EBITDA, $22.0bn equity value
- Bull: 10.0% revenue growth, 29.0% EBITDA margin, $4.72bn CY2026E EBITDA, $34.1bn equity value
- Bull customer-retention evidence is missing
- Downside covenant cushion falls below 12.0%
- No board minutes, lender-approved case, pipeline conversion backup, pricing study, or churn cohort file is supplied

Screen rules:
- Reproduce the four cases and identify the deltas from base.
- Flag covenant cushion below 12.0% as WATCH.
- Accept the bull case for arithmetic only and flag the missing retention support.
- Preserve the difference between source plan, sensitivity, lender case, and approved forecast.
- REFUSE to call any case management-approved, board-approved, lender-approved, financeable, or investable without evidence.`;

const expectedOutput = `EXPECTED ALCHEMIST SCENARIO OUTPUT
Verdict: COMPUTE - 1 UPSIDE PROOF GAP
Source receipts: FY2025 10-K; Q1 2026 board plan extract pages 8-13; draft lender model v4
Fiscal basis: CY2025 actuals baseline; CY2026E scenario cases
Assumption mode: deterministic API runner using supplied packet facts only; no forecast approval, lender approval, or board approval claim

Case table:
- Downside: 2.0% growth, 23.0% margin, $3.12bn EBITDA, $18.7bn equity value, WATCH covenant cushion under 12.0%.
- Bear: 4.0% growth, 25.0% margin, $3.55bn EBITDA, $22.0bn equity value, WATCH pricing pressure persists.
- Base: 7.0% growth, 27.0% margin, $4.10bn EBITDA, $27.4bn equity value, PASS ties to source plan.
- Bull: 10.0% growth, 29.0% margin, $4.72bn EBITDA, $34.1bn equity value, WATCH retention proof missing.

Deterministic flags:
- PASS: cases use supplied drivers and values.
- WATCH: downside covenant cushion needs credit review.
- WATCH: bull retention support is missing, so upside is arithmetic-only.
- MISSING EVIDENCE: board minutes, lender-approved case, pipeline conversion backup, pricing study, churn cohort file, and bull retention proof are not supplied.
- ABSTAIN: no management approval, board approval, lender approval, financeability view, or investment recommendation supplied.

Safe conclusion:
The scenario table is useful for sensitivity discussion, but it does not approve a forecast, transaction, or financing decision.`;

const benchmarkRows = [
  ["Scenario labels", "Keeps downside, bear, base, and bull tied to supplied facts.", "May rename cases or infer management intent."],
  ["Proof gaps", "Accepts bull arithmetic but flags missing retention support.", "Often treats upside assumptions as credible narrative."],
  ["Credit flags", "Names the downside covenant cushion watch item.", "May overlook covenant pressure."],
  ["Boundary", "Refuses approval, recommendation, or board posture.", "May turn scenario math into advice."],
];

export default function ScenariosModelPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/banking" label="Back to ALCHEMIST Banking" />
          <span style={S.label}>ALCHEMIST · BANKING MODEL</span>
          <h1
            style={{
              fontSize: "clamp(2.55rem, 7vw, 5.6rem)",
              fontWeight: 950,
              letterSpacing: "-0.058em",
              lineHeight: 0.92,
              color: "var(--text-primary)",
              maxWidth: 940,
              marginBottom: "1rem",
            }}
          >
            Scenario math without the mood ring.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 820 }}>
            The scenarios model converts source-backed operating drivers into downside,
            bear, base, and bull cases. It is designed to make sensitivities auditable:
            every case has explicit drivers, deterministic calculations, named deltas, and
            refusal codes when the case is just a story. This is backed by a deterministic API runner, not a forecast approval engine.
          </p>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5.5rem" }}>
        <div style={S.container}>
          <div style={S.grid}>
            <article style={S.panel}>
              <span style={S.label}>Product explanation</span>
              <h2 style={{ marginTop: 0, color: "var(--text-primary)" }}>What it computes</h2>
              <p style={S.p}>
                ALCHEMIST takes revenue growth, EBITDA margin, leverage, multiple, working
                capital, and capex assumptions, then emits a locked scenario table. It
                preserves the difference between a sensitivity, a management case, and an
                unsupported narrative.
              </p>
            </article>
            <article style={S.panel}>
              <span style={S.label}>Copyable test packet</span>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.86rem",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {casePacket}
              </pre>
            </article>
            <article style={S.panel}>
              <span style={S.label}>Packet verdict</span>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "1.1rem",
                  color: "var(--accent)",
                  fontWeight: 900,
                  marginBottom: "0.75rem",
                }}
              >
                COMPUTE · 1 UPSIDE PROOF GAP
              </div>
              <p style={S.p}>
                The base case ties to the source plan. Bull retention assumptions are
                accepted for math but flagged as not yet source-proven.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <span style={S.label}>Expected ALCHEMIST output</span>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              color: "var(--text-primary)",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.86rem",
              lineHeight: 1.6,
              margin: 0,
              border: "1px solid var(--bg-border)",
              borderRadius: 8,
              padding: "1.2rem",
              background: "var(--bg-card)",
            }}
          >
            {expectedOutput}
          </pre>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <span style={S.label}>Deterministic sample output</span>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Case</th>
                  <th style={S.th}>Revenue growth</th>
                  <th style={S.th}>EBITDA margin</th>
                  <th style={S.th}>CY2026E EBITDA</th>
                  <th style={S.th}>Implied equity value</th>
                  <th style={S.th}>Flag</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map(([name, growth, margin, ebitda, equity, flag]) => (
                  <tr key={name}>
                    <td style={{ ...S.td, fontWeight: 850 }}>{name}</td>
                    <td style={S.td}>{growth}</td>
                    <td style={S.td}>{margin}</td>
                    <td style={S.td}>{ebitda}</td>
                    <td style={{ ...S.td, fontWeight: 850 }}>{equity}</td>
                    <td style={{ ...S.td, color: "var(--text-secondary)" }}>{flag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <div style={S.grid}>
            <article style={S.panel}>
              <span style={S.label}>Refusal boundaries</span>
              {boundaries.map((boundary) => (
                <p key={boundary} style={S.p}>
                  <span style={S.code}>REFUSE </span>
                  {boundary}
                </p>
              ))}
            </article>
            <article style={S.panel}>
              <span style={S.label}>LLM test prompt</span>
              <p style={S.p}>
                Paste this into an LLM and compare whether it separates computable cases
                from unsupported claims:
              </p>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.86rem",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
{`Create a four-case scenario table for SampleCo using only these source refs: FY2025 10-K, Q1 2026 board plan extract pages 8-13, and draft lender model v4. Fiscal basis is CY2025 actuals baseline and CY2026E scenario cases. Source plan: base revenue growth 7.0%, EBITDA margin 27.0%, CY2026E EBITDA $4.10bn, implied equity value $27.4bn. Downside is 2.0% growth and 23.0% margin with covenant cushion under 12.0%. Bear is 4.0% and 25.0%. Bull is 10.0% and 29.0%, but customer retention support is missing. Show deltas, flags, missing evidence, and do not call any case board-approved, lender-approved, financeable, or investable.`}
              </pre>
            </article>
            <article style={S.panel}>
              <span style={S.label}>Side-by-side benchmark posture</span>
              {benchmarkRows.map(([control, alchemist, llm]) => (
                <p key={control} style={S.p}>
                  <span style={S.code}>{control} </span>
                  ALCHEMIST {alchemist} Ordinary LLM {llm}
                </p>
              ))}
            </article>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <AlchemistLiveRunner
            mode="scenarios"
            title="Run the scenario gate."
            intro="Edit the scenario packet. The deterministic runner expects period labels, driver rows, valuation outputs, source refs, approval evidence, and missing-proof hooks; it recomputes case rows and refuses to promote sensitivities into approved forecasts, financeability claims, or recommendations."
            initialPacket={casePacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own scenario packet."
            packetPlaceholder={`Paste a sanitized scenario packet here with fiscal periods, source URLs or filing refs, downside/bear/base/bull drivers, margin assumptions, valuation outputs, covenant cushion, customer or pipeline support, proof gaps, and which cases are management, board, or lender approved.\n\nAsk the model for a scenario table, deltas from base, source receipts, flags, missing-evidence hooks, and refusal boundaries.`}
            expected="Separate computable sensitivity math from approved forecasts; preserve receipts and period labels; flag unsupported upside and refuse board, lender, management, financeability, or investment approval language without evidence."
          />
        </div>
      </section>
    </>
  );
}
