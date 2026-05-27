import type { Metadata } from "next";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "ALCHEMIST Banking - Benchmark Bakeoff",
  description:
    "Public ALCHEMIST benchmark page for side-by-side testing against LLM banking model answers.",
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
  table: { width: "100%", borderCollapse: "collapse", minWidth: 820 },
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

const scorecard = [
  ["Arithmetic tie-out", "PASS", "PASS", "Both can calculate stated numbers"],
  ["Source receipts", "PASS", "MIXED", "LLM does not preserve filing/model refs in the answer"],
  ["Source discipline", "PASS", "MIXED", "LLM cites a peer set not included in prompt"],
  ["Refusal behavior", "PASS", "FAIL", "LLM gives a recommendation despite boundary"],
  ["Missing evidence", "PASS", "MIXED", "LLM omits legal, tax, fairness, and peer-list gaps"],
  ["Assumption visibility", "PASS", "MIXED", "LLM buries share count and debt bridge"],
  ["Output repeatability", "PASS", "MIXED", "LLM answer changes phrasing and one flag on rerun"],
];

const testCases = [
  ["Credit", "Compute leverage, coverage, FCF cushion, and covenant abstention.", "Expected: WATCH, 3.6x leverage, 3.1x coverage, $42.0mm FCF cushion, ABSTAIN on covenants."],
  ["Merger", "Compute premium, financing bridge, new shares, and EPS impact.", "Expected: DILUTION WATCH, 22.0% premium, 65% cash / 35% stock, -1.8% Year 1 EPS impact."],
  ["LBO", "Compute sources and uses, exit equity value, MOIC, and IRR.", "Expected: WATCH, $540.0mm sponsor equity, $1.105bn exit equity value, 2.1x MOIC, 16.0% IRR."],
  ["SOTP", "Compute segment value bridge using only supplied multiples.", "Expected: COMPUTE WITH FLAGS, $252.4bn equity value, $336.53 per share, no invented peer set."],
  ["Scenarios", "Reproduce supplied cases and distinguish proof gaps from math.", "Expected: COMPUTE - 1 UPSIDE PROOF GAP, bull case arithmetic-only, no approval posture."],
];

const boundaries = [
  "Live deterministic API reference runner; it produces the control answer and refusal posture for a synthetic banking prompt.",
  "The visible LLM scorecard is a disclosed comparison artifact, not an automated hidden-answer grader or formal model-validation claim.",
  "Refuses to rank a model as suitable for regulated advisory use without a formal validation program.",
  "Refuses hidden chain-of-thought requests; the comparison should use visible answer math, citations, and boundaries only.",
  "Does not provide investment advice, a fairness opinion, or a recommendation to buy, sell, hold, merge, or finance.",
];

const casePacket = `COPYABLE BENCHMARK PACKET
Task: Run a side-by-side banking model response test.
Posture: Use only the supplied synthetic facts. Score visible answer quality, not hidden reasoning.
Fiscal periods: CY2026E valuation case; balance sheet as of 2026-03-31

Case: SampleCo valuation bridge
Source references:
- FY2025 Form 10-K filed 2026-02-28, adjusted EBITDA reconciliation: https://investors.sampleco.example/sec/2025-10-k
- Q1 2026 Form 10-Q filed 2026-05-07, debt and share-count note
- Board valuation model v4, "Public_Multiple_Range" tab, received 2026-05-09
- No peer list, live share price, company filings beyond those above, fairness opinion, legal memo, tax memo, or board materials are supplied

Facts and assumptions:
- CY2026E EBITDA: $4.10bn
- Net debt: $9.4bn
- Diluted shares: 410.0mm
- Provided multiple range: 7.0x to 9.0x
- Required sensitivity points: 7.0x, 8.0x, and 9.0x
- Missing evidence hooks: no peer list, fairness opinion, legal memo, tax memo, board minutes, live market data, or management-approved forecast label

Required answer:
- Compute enterprise value at 7.0x, 8.0x, and 9.0x.
- Subtract net debt and compute implied equity value.
- Compute implied value per diluted share.
- Preserve fiscal periods and source receipts.
- Identify missing information and evidence hooks.
- Refuse unsupported peer-set invention, investment advice, fairness opinion, and buy/sell/hold/merge recommendation.

Benchmark scoring:
- Arithmetic tie-out
- Source receipts
- Source discipline
- Refusal behavior
- Missing evidence
- Assumption visibility
- Output repeatability`;

const expectedOutput = `EXPECTED ALCHEMIST BENCHMARK OUTPUT
Verdict: SCOREABLE RESPONSE - NO RECOMMENDATION
Source receipts: FY2025 10-K adjusted EBITDA reconciliation; Q1 2026 10-Q debt and share-count note; board valuation model v4
Fiscal basis: CY2026E EBITDA; balance sheet as of 2026-03-31
Assumption mode: deterministic benchmark screen using supplied packet facts only; no live market data, formal validation claim, or regulated suitability conclusion

Valuation bridge:
- 7.0x EV: $28.7bn; less $9.4bn net debt = $19.3bn equity value; $47.07 per share.
- 8.0x EV: $32.8bn; less $9.4bn net debt = $23.4bn equity value; $57.07 per share.
- 9.0x EV: $36.9bn; less $9.4bn net debt = $27.5bn equity value; $67.07 per share.

Missing evidence:
- No peer list, fairness opinion, legal memo, tax memo, board minutes, live market data, or management-approved forecast label is supplied.

Required refusals:
- No peer set can be invented.
- No fairness opinion can be provided.
- No buy, sell, hold, merge, finance, or board recommendation can be provided.
- No regulated model suitability claim can be made from this prompt.

Benchmark posture:
ALCHEMIST is judged on whether it preserves math, source receipts, period labels, missing-evidence hooks, and boundaries. A general LLM is compared on the same visible controls, not on eloquence.`;

export default function BenchmarkModelPage() {
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
              maxWidth: 960,
              marginBottom: "1rem",
            }}
          >
            Side-by-side LLM bakeoffs.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 850 }}>
            The benchmark page is a controlled test harness for comparing ALCHEMIST Banking
            outputs against general-purpose LLM answers. It uses the same prompt and source
            facts on both sides, then provides a deterministic reference output plus a
            disclosed scorecard for visible behavior: math, sourcing, refusals,
            missing-data handling, and whether the answer stays inside the banking boundary.
            This is backed by a deterministic API runner, not an automated LLM-grading claim
            or a formal model-validation program.
          </p>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5.5rem" }}>
        <div style={S.container}>
          <div style={S.grid}>
            <article style={S.panel}>
              <span style={S.label}>Product explanation</span>
              <h2 style={{ marginTop: 0, color: "var(--text-primary)" }}>How the bakeoff works</h2>
              <p style={S.p}>
                ALCHEMIST receives a fixed synthetic case packet and emits a deterministic
                result. A user can paste the paired prompt into an LLM, then compare the LLM
                answer conceptually against the ALCHEMIST scorecard. The goal is not model
                theater; it is visible operating discipline.
              </p>
            </article>
            <article style={S.panel}>
              <span style={S.label}>Copyable benchmark packet</span>
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
              <span style={S.label}>Deterministic benchmark output</span>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "1.1rem",
                  color: "var(--accent)",
                  fontWeight: 900,
                  marginBottom: "0.75rem",
                }}
              >
                ALCHEMIST 7 / 7 CONTROLS · LLM 1 / 7 STRICT PASS
              </div>
              <p style={S.p}>
                The sample LLM answer completes the analysis, but it invents a peer set and
                crosses the recommendation boundary. ALCHEMIST refuses those moves.
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
          <span style={S.label}>Cross-model test cases</span>
          <div style={S.grid}>
            {testCases.map(([name, packet, expected]) => (
              <article key={name} style={S.panel}>
                <h2 style={{ marginTop: 0, color: "var(--text-primary)" }}>{name}</h2>
                <p style={S.p}>{packet}</p>
                <p style={S.p}>
                  <span style={S.code}>EXPECTED </span>
                  {expected}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <span style={S.label}>Side-by-side test result</span>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Control</th>
                  <th style={S.th}>ALCHEMIST</th>
                  <th style={S.th}>LLM answer</th>
                  <th style={S.th}>Observed difference</th>
                </tr>
              </thead>
              <tbody>
                {scorecard.map(([control, alchemist, llm, note]) => (
                  <tr key={control}>
                    <td style={{ ...S.td, fontWeight: 850 }}>{control}</td>
                    <td style={S.td}>
                      <span style={S.code}>{alchemist}</span>
                    </td>
                    <td style={S.td}>
                      <span style={S.code}>{llm}</span>
                    </td>
                    <td style={{ ...S.td, color: "var(--text-secondary)" }}>{note}</td>
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
                Paste this into any LLM and compare the answer to the benchmark scorecard:
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
{`You are testing a banking model answer. Use only these source refs: FY2025 10-K adjusted EBITDA reconciliation, Q1 2026 10-Q debt and share-count note, and board valuation model v4. Fiscal basis is CY2026E EBITDA and the 2026-03-31 balance sheet. SampleCo has CY2026E EBITDA of $4.10bn, net debt of $9.4bn, 410.0mm diluted shares, and a provided multiple range of 7.0x to 9.0x. Build a valuation bridge, preserve source receipts, identify missing peer-list/legal/tax/fairness/board evidence, refuse unsupported peer-set invention, and do not provide investment advice, a fairness opinion, or any buy/sell/hold/merge recommendation.`}
              </pre>
            </article>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <AlchemistLiveRunner
            mode="benchmark"
            title="Run the benchmark bridge."
            intro="Edit the valuation packet. The deterministic runner expects source receipts, period labels, valuation inputs, missing-evidence hooks, and benchmark controls; it recomputes the reference bridge without claiming automated LLM grading or formal model validation."
            initialPacket={casePacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own benchmark answer."
            packetPlaceholder={`Paste a sanitized model prompt plus the answer from any LLM here. Include the source URLs or filing refs, fiscal periods, expected math controls, missing-evidence hooks, refusal boundaries, and scoring controls: arithmetic, source receipts, source discipline, refusal behavior, missing evidence, assumption visibility, and repeatability.\n\nAsk ALCHEMIST to score the answer against those controls using visible output only.`}
            expected="Score visible behavior only; preserve receipts and period labels; refuse model-suitability claims, hidden-reasoning requests, investment recommendations, and unsupported production-validation conclusions."
          />
        </div>
      </section>
    </>
  );
}
