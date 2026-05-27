import type { Metadata } from "next";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import AccountingLLMCheck, { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "Journal Gate - LedgerProof",
  description:
    "ALCHEMIST Journal Gate preflights journal entries for proof, policy conflicts, duplicate support, late evidence, and release-blocking refusals.",
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
  note: {
    marginTop: "1rem",
    padding: "0.9rem 1rem",
    borderRadius: 16,
    border: "1px solid var(--accent-border)",
    background: "var(--accent-dim)",
    color: "var(--purple-900)",
    fontSize: "0.86rem",
    fontWeight: 760,
    lineHeight: 1.52,
  },
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

const preflightInputs = [
  ["Whole JE packet", "Header + 11 support files", "Ingested"],
  ["Entry batch", "JE-APR-042", "8 lines"],
  ["Debit total", "$244,880.00", "Loaded"],
  ["Credit total", "$243,120.00", "Mismatch"],
  ["Policy pack", "Revenue cutoff + accruals", "Conflict found"],
  ["Support binder", "11 files", "Duplicate detected"],
  ["Posting window", "April close", "Late evidence"],
  ["Approval trail", "Controller queue", "Missing signoff"],
  ["Proof ledger", "5 refusal codes", "Blocked"],
];

const refusalExamples = [
  {
    code: "JE_UNBALANCED",
    title: "Entry does not balance",
    detail:
      "Debit lines exceed credit lines by $1,760.00. Journal Gate refuses a posting packet until the preparer corrects the imbalance or attaches authorized correction support.",
    source: "je_batch_APR-042.csv",
  },
  {
    code: "UNSUPPORTED_ACCRUAL",
    title: "Accrual lacks source evidence",
    detail:
      "A $28,400 warranty accrual cites an estimate note, but no vendor history, claim trend, contract schedule, or preparer workpaper supports the amount.",
    source: "warranty_accrual_memo.md",
  },
  {
    code: "DUPLICATE_SUPPORT",
    title: "Same invoice reused",
    detail:
      "Two different journal lines point to the same invoice number, vendor, amount, and service period. The files cannot count as independent support.",
    source: "support/vendor_1184_invoice_7721.pdf",
  },
  {
    code: "LATE_SUPPORT",
    title: "Evidence arrives after close cutoff",
    detail:
      "A revenue reclass uses delivery evidence dated May 4 for an April 30 posting. The packet needs cutoff review before release.",
    source: "pod_customer_20491.png",
  },
  {
    code: "POLICY_CONFLICT",
    title: "Entry contradicts company policy",
    detail:
      "The entry capitalizes implementation labor below the capitalization threshold in the accounting policy mirror. Journal Gate routes it to human review.",
    source: "fixed_asset_policy_v7.pdf",
  },
];

const proofRows = [
  ["JE-APR-042-01", "UNBALANCED", "Debit/credit totals do not tie", "Refuse posting"],
  ["JE-APR-042-02", "UNSUPPORTED", "Accrual estimate lacks workpaper support", "Request support"],
  ["JE-APR-042-03", "DUPLICATE", "Invoice support reused across lines", "De-dupe evidence"],
  ["JE-APR-042-04", "LATE", "Delivery proof after close date", "Escalate cutoff review"],
  ["JE-APR-042-05", "POLICY_CONFLICT", "Capitalization below policy threshold", "Controller review"],
  ["JE-APR-042-06", "PROVEN", "Reclass ties to source schedule", "Ready for approval"],
];

const gateRules = [
  ["Balance", "Debits and credits must tie exactly before release."],
  ["Support", "Every material line needs source evidence or a preparer workpaper."],
  ["Uniqueness", "One document cannot silently support two different economic claims."],
  ["Timing", "Evidence after the close date must be called out, not smoothed over."],
  ["Policy", "Company policy conflicts are routed to human review with the source named."],
  ["Boundary", "Outputs support workpaper review; they are not audit, legal, or accounting opinions."],
];

const prompts = [
  "Ingest this whole journal packet. Can the posting release gate open? Return line statuses, refusal codes, missing evidence, and allowed outputs.",
  "This accrual is described as reasonable, but the support is a paragraph. Is it release-ready?",
  "Two journal lines cite the same invoice under different filenames. Should both pass?",
  "The entry books April revenue using proof dated May 4. What blocks release?",
];

const journalBatchPacket = `LEDGERPROOF JOURNAL GATE TEST PACKET
Company: Northstar Robotics, Inc.
Close period: April 2026
Task: Ingest the whole journal-entry packet and decide whether the posting release gate can open. Return release decision, line statuses, blocker certificates, missing evidence, allowed outputs, and recovery actions. Do not provide final accounting advice.

Batch header:
- Batch ID: JE-APR-042
- Prepared by: close.preparer@northstar.example
- Posting period: April 2026
- Debit total: $244,880.00
- Credit total: $243,120.00
- Controller approval: not attached
- Required release gate: batch balances exactly, every material line has unique source evidence, approval exists, policy conflicts are resolved, and late evidence is escalated

Journal lines:
1. Debit warranty expense 6505 $28,400. Credit warranty accrual 2115 $28,400. Support: warranty_accrual_memo.md says "reasonable based on recent trend." No claims history, contract schedule, or calculation attached.
2. Debit AP accrual 2105 $18,440. Credit COGS 5000 $18,440. Support: vendor_1184_invoice_7721.pdf.
3. Debit COGS 5000 $18,440. Credit AP accrual 2105 $18,440. Support: vendor_1184_invoice_7721_scan.pdf. Same vendor, invoice number, service period, date, and amount as line 2.
4. Debit revenue 4000 $38,400. Credit deferred revenue 2300 $38,400. Support: POD-20491 dated May 4, while invoice AR-20491 was recognized April 30.
5. Debit software fixed assets 1510 $11,760. Credit payroll clearing 2150 $10,000. Support: internal implementation labor. Company capitalization policy requires project spend above $25,000 and placed-in-service evidence.
6. Debit prepaid expense 1300 $129,440. Credit expense 6200 $129,440. Support: prepaid schedule ties to invoice PP-882 and April amortization.

Support manifest:
- Files attached: 11
- Duplicate fingerprint detected across vendor_1184_invoice_7721.pdf and vendor_1184_invoice_7721_scan.pdf
- Missing files: controller_approval_JE-APR-042.pdf, warranty_claims_history.xlsx, placed_in_service_evidence.pdf

Requested output schema:
- release_decision
- release_gate
- line_statuses
- blocker_certificates
- missing_evidence
- allowed_outputs
- recovery_actions
- why_a_generic_llm_might_fail`;

const journalExpectedOutput = [
  ["Release decision", "REFUSE POSTING. The batch is unbalanced, lacks approval, and contains unsupported, duplicate, late, and policy-conflicting lines."],
  ["Release gate", "Posting blocked. A reviewer exception packet may be generated, but the JE cannot be marked approved or posted."],
  ["Blockers", "JE_UNBALANCED, MISSING_APPROVAL, UNSUPPORTED_ACCRUAL, DUPLICATE_SUPPORT, LATE_SUPPORT, POLICY_CONFLICT."],
  ["Missing evidence", "Corrected debit/credit totals, controller signoff, warranty calculation evidence, duplicate invoice resolution, cutoff review, capitalization threshold and placed-in-service support."],
  ["Generic LLM failure", "A generic model may draft a posting memo and say the batch is reasonable while missing arithmetic imbalance, absent approvals, and duplicate filenames that are not independent evidence."],
];

export default function JournalGatePage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/accounting" label="Back to ALCHEMIST Accounting" />
          <span style={S.label}>ALCHEMIST · LEDGERPROOF · JOURNAL GATE</span>
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
            Journal entries that prove themselves before posting.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 830 }}>
            Journal Gate is the LedgerProof preflight for manual entries. It ingests the
            whole journal packet and checks balance, support, uniqueness, cutoff, approvals,
            and policy alignment before a batch is allowed into the close packet.
          </p>
          <div className="ledgerproof-verdict">
            <strong>Preflight verdict</strong>
            <span>REFUSE POSTING · 5 blockers · 1 supported line · workpaper support only</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-grid">
          <div className="ledgerproof-panel ledgerproof-panel-large">
            <span style={S.label}>Preflight packet</span>
            <h2>The gate blocks entries that cannot survive evidence review.</h2>
            <p>
              A clean memo is not enough. Journal Gate turns each line into a proof claim and
              refuses batches with arithmetic breaks, missing workpapers, reused support,
              late evidence, missing approvals, or accounting-policy conflicts.
            </p>
            <div className="ledgerproof-inputs">
              {preflightInputs.map(([name, detail, status]) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <span>{detail}</span>
                  <em>{status}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="ledgerproof-panel">
            <span style={S.label}>Release control</span>
            <div className="ledgerproof-stamp">REFUSE POSTING</div>
            <p>
              The batch can move to correction, review, or support refresh. It cannot be
              posted, approved, or represented as proven while blockers remain open.
            </p>
            <div className="ledgerproof-mini-chain">
              <span>BATCH HASH 84d1a9c2</span>
              <span>5 refusal certificates</span>
              <span>1 line ready for approval</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <div className="section-heading compact">
            <span style={S.label}>Refusal examples</span>
            <h2>Bad journal entries should fail loudly.</h2>
            <p>
              Every refusal names the broken claim, the evidence it inspected, and the next
              review action. The system supports preparers and reviewers without replacing
              professional judgment.
            </p>
          </div>

          <div className="ledgerproof-blockers">
            {refusalExamples.map((example) => (
              <article key={example.code}>
                <span>{example.code}</span>
                <h3>{example.title}</h3>
                <p>{example.detail}</p>
                <small>{example.source}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-grid">
          <div className="ledgerproof-panel ledgerproof-panel-large">
            <span style={S.label}>Proof ledger</span>
            <h2>Each line gets a status before the batch moves.</h2>
            <div className="ledgerproof-table-wrap">
              <table className="ledgerproof-table">
                <thead>
                  <tr>
                    <th>Line</th>
                    <th>Status</th>
                    <th>Finding</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {proofRows.map(([line, status, finding, action]) => (
                    <tr key={line}>
                      <td>{line}</td>
                      <td>
                        <code>{status}</code>
                      </td>
                      <td>{finding}</td>
                      <td>{action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ledgerproof-panel">
            <span style={S.label}>Gate rules</span>
            <h2>Strict checks, clear boundary.</h2>
            <div className="ledgerproof-source-list">
              {gateRules.map(([name, text]) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <p style={S.note}>
              Journal Gate provides workpaper support and release discipline. It does not
              provide an audit opinion, legal opinion, accounting opinion, or assurance report.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-benchmark">
          <div>
            <span style={S.label}>Copyable journal batch</span>
            <h2>Posting should fail before anyone writes the memo.</h2>
            <p>
              This batch includes a clean line, but the packet as a whole cannot post. A
              release-ready answer must preserve line-level status, name missing evidence,
              and refuse the posting gate for the whole batch.
            </p>
            <div style={S.outputList}>
              {journalExpectedOutput.map(([label, text]) => (
                <div key={label} style={S.outputItem}>
                  <strong style={{ color: "var(--text-primary)" }}>{label}</strong>
                  <p style={{ ...S.p, marginTop: "0.35rem", fontSize: "0.86rem" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
          <pre style={S.packetPre}>{journalBatchPacket}</pre>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container} className="ledgerproof-benchmark">
          <div>
            <span style={S.label}>Bakeoff prompts</span>
            <h2>The benchmark is refusal accuracy.</h2>
            <p>
              Journal Gate is scored on whether it blocks entries that deserve to be blocked
              and explains the exact evidence gap without dressing uncertainty up as approval.
            </p>
          </div>
          <div className="ledgerproof-prompts">
            {prompts.map((prompt) => (
              <p key={prompt}>{prompt}</p>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AccountingLLMCheck
            expected="REFUSE POSTING because the journal batch is unbalanced, under-supported, missing approval, and blocked at the posting gate."
            prompt="Ingest this whole journal packet. Can the posting release gate open? Return line statuses, refusal codes, and missing evidence."
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AlchemistLiveRunner
            mode="journal"
            title="Run the journal gate."
            intro="Edit the journal batch and the deterministic runner emits posting posture, blockers, refusals, and a LUNA-style audit trail."
            initialPacket={journalBatchPacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own journal batch."
            packetPlaceholder={`Paste a sanitized whole journal packet here: debits, credits, accounts, period, source support, file manifest, preparer rationale, approval status, duplicate fingerprints, and policy references.\n\nAsk the model whether the posting gate can open, what blocks it, what evidence is missing, and what outputs are allowed.`}
            expected="Check balance and support line by line; refuse posting when the batch is unbalanced, unsupported, unapproved, out-of-period, duplicated, or outside approval rules."
          />
        </div>
      </section>
    </>
  );
}
