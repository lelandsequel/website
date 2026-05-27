import type { Metadata } from "next";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "ALCHEMIST Banking - SOTP Model",
  description:
    "Public ALCHEMIST sum-of-the-parts banking model with deterministic sample output, refusal boundaries, and LLM comparison prompt.",
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
  table: { width: "100%", borderCollapse: "collapse", minWidth: 760 },
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

const segments = [
  ["Payments", "$18.4bn", "13.0x", "$239.2bn", "CY2026E EBITDA; board model tab S-1; peer set supplied"],
  ["Merchant software", "$4.9bn", "8.5x", "$41.7bn", "CY2026E EBITDA; Rule-of-40 adjustment supplied"],
  ["Consumer credit", "$3.2bn", "6.0x", "$19.2bn", "CY2026E EBITDA; charge-off flag active from Q1 filing"],
  ["Corporate overhead", "($1.6bn)", "7.0x", "($11.2bn)", "Recurring cost per overhead bridge; no dis-synergy support"],
  ["Net debt", "", "", "($36.5bn)", "Debt, leases, pension deficit, and cash per balance-sheet bridge"],
];

const boundaries = [
  "Live deterministic API runner; this page computes segment value bridges from supplied packets while preserving peer-set and recommendation boundaries.",
  "Refuses segment valuation when segment EBITDA, revenue, or source period is missing.",
  "Refuses to invent peer multiples, synergy value, tax leakage, pension treatment, or holdco discount.",
  "Flags stale filings, mixed fiscal calendars, negative EBITDA, and unsupported intercompany eliminations.",
  "Does not provide investment advice, a fairness opinion, or a recommendation to buy, sell, hold, merge, or finance.",
];

const casePacket = `COPYABLE SOTP PACKET
Company: SampleCo Global
Business mix: Payments, merchant software, and consumer credit
Fiscal periods: CY2025 actuals; CY2026E segment EBITDA; balance sheet as of 2026-03-31

Source references:
- FY2025 Form 10-K filed 2026-02-26, segment Note 18: https://investors.sampleco.example/sec/2025-10-k
- Q1 2026 Form 10-Q filed 2026-05-07, balance sheet and consumer charge-off table
- Board model v9, "SOTP_Input" tab, cells C12:H36, received 2026-05-12
- Banker-approved comps packet dated 2026-05-15; do not add peer companies beyond this supplied multiple set

Source facts and assumptions:
- Payments CY2026E EBITDA: $18.4bn; allowed multiple: 13.0x
- Merchant software CY2026E EBITDA: $4.9bn; allowed multiple: 8.5x
- Consumer credit CY2026E EBITDA: $3.2bn; allowed multiple: 6.0x
- Corporate overhead expense: $1.6bn; capitalization multiple: 7.0x; recurring-cost treatment supplied
- Net debt, leases, pension deficit, and cash bridge: ($36.5bn)
- Diluted shares: 750.0mm
- Consumer credit charge-offs are above peer median
- Holdco discount, tax leakage, stranded-cost dis-synergies, pension sensitivity, and segment separation costs are not supplied

Screen rules:
- Use only the provided multiples.
- Capitalize recurring corporate overhead as a negative value.
- Produce gross enterprise value, equity bridge, and implied value per share.
- Flag stale or mixed-period source data before computing.
- REFUSE peer-set invention, holdco discount, tax leakage, synergy value, separation-cost estimates, and investment recommendation unless the specific support is supplied.`;

const expectedOutput = `EXPECTED ALCHEMIST SOTP OUTPUT
Verdict: COMPUTE WITH FLAGS
Source receipts: FY2025 10-K Note 18; Q1 2026 10-Q balance sheet and charge-off table; board model v9; 2026-05-15 comps packet
Fiscal basis: CY2026E segment EBITDA; balance sheet as of 2026-03-31
Assumption mode: deterministic API runner using supplied packet facts only; no live comps feed or investment recommendation

Segment values:
- Payments: $18.4bn x 13.0x = $239.2bn
- Merchant software: $4.9bn x 8.5x = $41.7bn
- Consumer credit: $3.2bn x 6.0x = $19.2bn
- Corporate overhead: ($1.6bn) x 7.0x = ($11.2bn)

Bridge:
- Gross segment value: $288.9bn
- Less net debt / leases / cash bridge: ($36.5bn)
- Implied equity value: $252.4bn
- Implied value per diluted share: $336.53

Deterministic flags:
- WATCH: consumer credit receives a charge-off risk flag.
- PASS: segment math uses only supplied multiples.
- MISSING EVIDENCE: holdco discount, tax leakage, stranded-cost dis-synergies, pension sensitivity, segment separation costs, and additional peer support are not supplied.
- ABSTAIN: no holdco discount, tax leakage, pension adjustment, separation-cost estimate, or synergy value is invented.

Safe conclusion:
The SOTP bridge is computable under the stated assumptions, but it is not investment advice, a fairness opinion, or a recommendation.`;

const benchmarkRows = [
  ["Multiple discipline", "Uses only 13.0x, 8.5x, 6.0x, and 7.0x.", "May invent a peer range or blend multiple."],
  ["Bridge visibility", "Shows segment EV, overhead deduction, net debt, and per-share value.", "May provide the final value without a receipt."],
  ["Missing assumptions", "ABSTAINS on holdco discount, taxes, pensions, and synergies.", "Often fills gaps with generic market practice."],
  ["Decision posture", "Computes with flags and refuses a recommendation.", "May drift into buy / sell / hold language."],
];

export default function SotpModelPage() {
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
              maxWidth: 920,
              marginBottom: "1rem",
            }}
          >
            SOTP that shows its parts.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 820 }}>
            The SOTP model values a multi-segment company one operating unit at a time,
            then reconciles the bridge from gross enterprise value to implied equity value.
            It is built for traceable banking work: explicit segment source data, locked
            multiple definitions, deterministic math, and refusals when a banker would
            otherwise be guessing. This is backed by the same deterministic API runner used by the page output,
            with CIPHER and COMPS still handling live-source public-company workflows.
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
                ALCHEMIST maps each disclosed segment to a valuation method, applies a
                sourced multiple or refusal code, and emits the value bridge with every
                assumption visible. The model is deterministic: the same inputs produce
                the same table, flags, and abstentions.
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
                COMPUTE WITH FLAGS
              </div>
              <p style={S.p}>
                SampleCo passes the minimum source test, but consumer credit receives a
                risk flag because charge-offs exceed the peer median. No recommendation is
                produced.
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
                  <th style={S.th}>Segment / bridge item</th>
                  <th style={S.th}>Metric</th>
                  <th style={S.th}>Multiple</th>
                  <th style={S.th}>Value</th>
                  <th style={S.th}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {segments.map(([segment, metric, multiple, value, receipt]) => (
                  <tr key={segment}>
                    <td style={S.td}>{segment}</td>
                    <td style={S.td}>{metric || "N/A"}</td>
                    <td style={S.td}>{multiple || "N/A"}</td>
                    <td style={{ ...S.td, fontWeight: 850 }}>{value}</td>
                    <td style={{ ...S.td, color: "var(--text-secondary)" }}>{receipt}</td>
                  </tr>
                ))}
                <tr>
                  <td style={S.td}>Implied equity value</td>
                  <td style={S.td}>750.0mm diluted shares</td>
                  <td style={S.td}>N/A</td>
                  <td style={{ ...S.td, fontWeight: 950 }}>$252.4bn / $336.53 per share</td>
                  <td style={{ ...S.td, color: "var(--text-secondary)" }}>Arithmetic bridge only</td>
                </tr>
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
                Paste this into an LLM and compare whether it invents missing assumptions or
                names the same boundaries:
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
{`Build a sum-of-the-parts valuation for SampleCo using only the supplied refs: FY2025 10-K Note 18, Q1 2026 10-Q, board model v9, and the 2026-05-15 comps packet. Fiscal basis is CY2026E segment EBITDA and 2026-03-31 balance sheet. Payments EBITDA $18.4bn, merchant software EBITDA $4.9bn, consumer credit EBITDA $3.2bn, corporate overhead expense $1.6bn, net debt / leases / pension / cash bridge $36.5bn, diluted shares 750.0mm. Use only stated multiples: 13.0x, 8.5x, 6.0x, and 7.0x. Show the bridge, identify missing holdco/tax/synergy/separation-cost evidence, and refuse any recommendation.`}
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
            mode="sotp"
            title="Run the SOTP bridge."
            intro="Edit the segment packet. The deterministic runner expects period labels, segment metrics, supplied multiples, balance-sheet bridge, source refs, and missing-adjustment hooks; it recomputes the value bridge and refuses invented peer sets, holdco discounts, tax leakage, synergies, or recommendations."
            initialPacket={casePacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own SOTP packet."
            packetPlaceholder={`Paste a sanitized segment packet here with fiscal periods, source URLs or filing refs, business units, segment revenue or EBITDA, supplied multiples and peer-set support, overhead treatment, debt/lease/pension/cash bridge, share count, stale-source warnings, and unsupported adjustments.\n\nAsk the model for segment values, bridge to equity value, per-share value, source receipts, proof gaps, missing-evidence hooks, and refusal boundaries.`}
            expected="Use only supplied segment facts and multiples; preserve period labels and receipts; refuse invented peer sets, holdco discounts, tax leakage, separation-cost estimates, synergy value, and investment recommendations."
          />
        </div>
      </section>
    </>
  );
}
