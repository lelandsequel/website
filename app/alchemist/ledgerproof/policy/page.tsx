import type { Metadata } from "next";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import AccountingLLMCheck, { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "Policy Mirror - Accounting Policy Checker",
  description:
    "ALCHEMIST Policy Mirror checks accounting workpapers against company policy for revenue, capitalization, depreciation, accruals, reserves, inventory, and leases with explicit human-review boundaries.",
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
  packetPre: {
    whiteSpace: "pre-wrap",
    margin: 0,
    minHeight: 520,
    color: "var(--text-primary)",
  },
  outputList: { display: "grid", gap: "0.7rem", marginTop: "1rem" },
  outputItem: {
    padding: "0.9rem",
    borderRadius: 16,
    border: "1px solid var(--bg-border)",
    background: "rgba(255,255,255,0.82)",
  },
};

const policyAreas = [
  ["Whole policy packet", "Policy manual plus workpapers", "Ingested"],
  ["Revenue", "Delivery, acceptance, price, collectability", "Cutoff exception"],
  ["Capitalization", "Spend threshold, useful life, placed-in-service", "Needs support"],
  ["Depreciation", "Method, life, convention, salvage value", "Formula check"],
  ["Accruals", "Obligation, period, estimate basis", "Missing basis"],
  ["Reserves", "Evidence, aging, loss pattern, approval", "Human review"],
  ["Inventory", "Count support, costing method, NRV", "Indexed"],
  ["Leases", "Term, options, discount rate, classification", "Policy mismatch"],
  ["Disclosure support", "Policy memo, change log, signoff", "Draft only"],
];

const checks = [
  ["REV-004", "Revenue", "Invoice recognized before delivery evidence", "REFUSE"],
  ["CAP-011", "Capitalization", "Repair spend capitalized without useful-life memo", "ESCALATE"],
  ["DEP-006", "Depreciation", "Straight-line schedule does not match policy convention", "RECOMPUTE"],
  ["ACC-018", "Accruals", "Estimate posted without obligation evidence", "REFUSE"],
  ["RES-009", "Reserves", "Bad-debt reserve change lacks approval trail", "HUMAN REVIEW"],
  ["INV-014", "Inventory", "Cycle count support ties to SKU rollforward", "PASS"],
  ["LSE-003", "Leases", "Renewal option treatment conflicts with policy memo", "ESCALATE"],
];

const refusalBoundaries = [
  {
    code: "NO_AUDIT_OPINION",
    title: "Policy Mirror will not opine on the financial statements",
    detail:
      "It can identify workpaper-policy conflicts and draft review notes, but audit opinions remain with licensed auditors.",
    source: "policy_boundary.md",
  },
  {
    code: "NO_FINAL_ACCOUNTING_ADVICE",
    title: "Policy conclusions require accountable human review",
    detail:
      "The checker can compare facts to company policy and flag exceptions. Final accounting advice, estimates, and judgments stay with the company and its advisors.",
    source: "controller_review_queue",
  },
  {
    code: "REFUSE_UNSUPPORTED_OVERRIDE",
    title: "Management override needs evidence",
    detail:
      "A policy override cannot pass on explanation alone. The system requires owner, basis, authority, and source support before it can leave draft status.",
    source: "override_request_2026_04.md",
  },
];

const mirrorOutputs = [
  ["Policy citation", "Relevant company policy section and effective date"],
  ["Fact pattern", "Source-backed facts extracted from the workpaper packet"],
  ["Conflict status", "Pass, escalate, refuse, or human-review required"],
  ["Recovery action", "Specific evidence, recalculation, memo, or approval needed"],
  ["Review trail", "Append-only note, timestamp, owner, and blocker certificate"],
];

const policyConflictPacket = `LEDGERPROOF POLICY MIRROR TEST PACKET
Company: Northstar Robotics, Inc.
Policy version: Accounting Policy Manual v7.4, effective April 1, 2026
Close period: April 2026
Task: Ingest the whole policy-and-workpaper packet and compare source-backed facts to company accounting policy. Return release decision, policy conflicts, human-review items, missing evidence, allowed outputs, and recovery actions. Do not provide final accounting advice.

Packet manifest:
- Policy files: Accounting Policy Manual v7.4, approval matrix, capitalization appendix, lease memo template
- Workpapers: revenue cutoff, capitalization, depreciation, accrual, reserve, lease classification
- Required release gate: policy checks can pass only when workpaper facts, source evidence, approval status, and policy citations agree
- Requested export: policy-compliance review packet

Relevant policy excerpts:
1. Revenue cutoff: Revenue may be recognized only when delivery evidence or customer acceptance is dated on or before the recognition date.
2. Capitalization: Internal labor can be capitalized only when the project is approved, placed in service, and total qualifying spend exceeds $25,000.
3. Depreciation: Computer equipment uses straight-line depreciation, 36-month useful life, half-month convention in month placed in service.
4. Accruals: Accruals require evidence of obligation, service period, estimate basis, and preparer calculation.
5. Reserves: Bad-debt reserve changes above $20,000 require controller approval and aging support.
6. Leases: Renewal options are included only when reasonably certain and documented by approved real-estate memo.

Workpaper facts:
- WP-R07 recognizes invoice AR-20491 for $38,400 in April revenue. Delivery proof POD-20491 is dated May 3, 2026.
- WP-CAP-011 capitalizes $11,760 of implementation labor. Project approval exists, but total qualifying spend is below $25,000 and placed-in-service evidence is not attached.
- WP-DEP-006 depreciates a $72,000 server addition using a full-month convention in April.
- WP-ACC-018 records a $28,400 warranty accrual. Memo says "reasonable based on recent trend" but no claims history or calculation is attached.
- WP-RES-009 increases bad-debt reserve by $22,000. Aging support is attached; controller approval is missing.
- WP-LSE-003 includes a two-year renewal option. Real-estate memo says renewal is "possible" but not approved as reasonably certain.

Missing evidence inventory:
- No April delivery evidence for WP-R07.
- No placed-in-service file for WP-CAP-011.
- No preparer depreciation recomputation for WP-DEP-006.
- No controller approval for WP-RES-009.

Requested output schema:
- release_decision
- release_gate
- policy_conflicts
- human_review_items
- missing_evidence
- allowed_outputs
- recovery_actions
- why_a_generic_llm_might_fail`;

const policyExpectedOutput = [
  ["Release decision", "REFUSE / HUMAN REVIEW. The packet contains policy conflicts and judgment items that cannot be approved automatically."],
  ["Release gate", "Policy-compliance export cannot say approved. It may produce a review packet with cited conflicts, missing evidence, and human-owner queues."],
  ["Blockers", "Revenue cutoff conflict, capitalization below threshold, depreciation convention mismatch, unsupported accrual, missing reserve approval, lease renewal support gap."],
  ["Missing evidence", "In-period delivery or correction, qualifying spend and placed-in-service support, recomputed depreciation, accrual calculation, controller approval, approved lease memo."],
  ["Generic LLM failure", "A generic model may provide a policy-sounding conclusion and average the facts into reasonableness instead of refusing where company policy creates hard evidence gates."],
];

export default function PolicyMirrorPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/accounting" label="Back to ALCHEMIST Accounting" />
          <span style={S.label}>ALCHEMIST · LEDGERPROOF · POLICY MIRROR</span>
          <h1
            style={{
              fontSize: "clamp(2.65rem, 7vw, 5.8rem)",
              fontWeight: 950,
              letterSpacing: "-0.058em",
              lineHeight: 0.92,
              color: "var(--text-primary)",
              maxWidth: 940,
              marginBottom: "1rem",
            }}
          >
            Accounting policy checks that refuse vague compliance.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 850 }}>
            Policy Mirror ingests the whole policy-and-workpaper packet, then compares
            source-backed facts to company accounting policy across revenue, capitalization,
            depreciation, accruals, reserves, inventory, and leases. It is built for audit-prep
            and workpaper support, not audit opinions, legal conclusions, tax advice, or final accounting advice.
          </p>
          <div className="ledgerproof-verdict">
            <strong>Policy verdict</strong>
            <span>REFUSE · 3 policy conflicts · 2 escalations · 1 human-review estimate</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-grid">
          <div className="ledgerproof-panel ledgerproof-panel-large">
            <span style={S.label}>Policy checker</span>
            <h2>Policy is tested against evidence, not vibes.</h2>
            <p>
              Policy Mirror reads the company policy layer beside the close packet and
              produces a deterministic review surface for common accounting areas, missing
              evidence, and release-blocking policy conflicts.
            </p>
            <div className="ledgerproof-inputs">
              {policyAreas.map(([name, detail, status]) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <span>{detail}</span>
                  <em>{status}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="ledgerproof-panel">
            <span style={S.label}>Refusal posture</span>
            <div className="ledgerproof-stamp">REFUSE ADVICE</div>
            <p>
              When a fact pattern requires judgment, Policy Mirror routes the issue to
              human review. It can support the workpaper, cite the policy, and name the
              conflict; it will not open an approval gate or make the final professional conclusion.
            </p>
            <div className="ledgerproof-mini-chain">
              <span>POLICY 2026.04</span>
              <span>CHECKS 31 controls</span>
              <span>BOUNDARIES 3 refusals</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <div className="section-heading compact">
            <span style={S.label}>Workpaper checks</span>
            <h2>Every accounting area gets a policy status.</h2>
            <p>
              The checker produces pass, escalation, recompute, refusal, or human-review
              outputs with the source evidence needed to clear the item.
            </p>
          </div>
          <div className="ledgerproof-table-wrap">
            <table className="ledgerproof-table">
              <thead>
                <tr>
                  <th>Check</th>
                  <th>Area</th>
                  <th>Finding</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {checks.map(([id, area, finding, status]) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{area}</td>
                    <td>{finding}</td>
                    <td>
                      <code>{status}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-grid">
          <div className="ledgerproof-panel ledgerproof-panel-large">
            <span style={S.label}>Mirror output</span>
            <h2>The answer is a review packet, not a proclamation.</h2>
            <div className="ledgerproof-source-list">
              {mirrorOutputs.map(([name, text]) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ledgerproof-panel">
            <span style={S.label}>Packet case</span>
            <h2>Revenue policy conflict.</h2>
            <p>
              A customer invoice is recognized in April, while signed delivery evidence
              lands on May 3. Policy Mirror refuses release, cites the cutoff policy, and
              requests corrected support or a documented review conclusion.
            </p>
            <div className="ledgerproof-mini-chain">
              <span>SOURCE invoice_AR-20491.pdf</span>
              <span>EVIDENCE pod_20491.png</span>
              <span>STATUS cutoff refused</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <div className="section-heading compact">
            <span style={S.label}>Refusal boundaries</span>
            <h2>The system knows where it has to stop.</h2>
            <p>
              Policy Mirror is intentionally narrow: it improves review quality and
              evidence discipline without replacing auditors, controllers, accountants,
              tax advisors, legal counsel, or company judgment.
            </p>
          </div>
          <div className="ledgerproof-blockers">
            {refusalBoundaries.map((boundary) => (
              <article key={boundary.code}>
                <span>{boundary.code}</span>
                <h3>{boundary.title}</h3>
                <p>{boundary.detail}</p>
                <small>{boundary.source}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-benchmark">
          <div>
            <span style={S.label}>Copyable policy conflict packet</span>
            <h2>The checker cites policy, then stops at judgment.</h2>
            <p>
              This packet forces the model to distinguish source-backed policy comparison
              from final accounting advice. LedgerProof can flag the conflict, name missing
              evidence, and refuse approval language; humans own the conclusion.
            </p>
            <div style={S.outputList}>
              {policyExpectedOutput.map(([label, text]) => (
                <div key={label} style={S.outputItem}>
                  <strong style={{ color: "var(--text-primary)" }}>{label}</strong>
                  <p style={{ ...S.p, marginTop: "0.35rem", fontSize: "0.86rem" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
          <pre style={S.packetPre}>{policyConflictPacket}</pre>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AccountingLLMCheck
            expected="HUMAN REVIEW / REFUSE ADVICE because policy conflicts and missing evidence require accountable judgment."
            prompt="Ingest this whole policy packet. The workpaper conflicts with capitalization and revenue-cutoff policy. Can the approval gate open anyway?"
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AlchemistLiveRunner
            mode="policy"
            title="Run the policy mirror."
            intro="Edit the policy packet and the deterministic runner emits conflict posture, blockers, refusals, and a LUNA-style audit trail."
            initialPacket={policyConflictPacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own policy packet."
            packetPlaceholder={`Paste sanitized policy text plus a whole workpaper fact pattern here: capitalization threshold, revenue cutoff rule, approval matrix, evidence dates, file manifest, preparer conclusion, reviewer status, and conflict notes.\n\nAsk the model to compare facts to policy, name missing evidence, identify the release gate, and name what requires human review.`}
            expected="Cite the policy conflict and stop at review posture; refuse accounting advice, legal advice, approval, override language, or gate-open language without accountable human judgment."
          />
        </div>
      </section>
    </>
  );
}
