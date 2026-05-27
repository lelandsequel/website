import type { Metadata } from "next";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import AccountingLLMCheck, { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "Recon Forge - LedgerProof Reconciliation Engine",
  description:
    "ALCHEMIST LedgerProof Recon Forge supports bank, AP, AR, payroll, inventory, and intercompany reconciliation workpapers with deterministic mismatch evidence.",
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
  statStrip: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.7rem",
    marginTop: "1.4rem",
  },
  stat: {
    padding: "0.72rem 0.86rem",
    borderRadius: 16,
    border: "1px solid var(--bg-border)",
    background: "rgba(255, 255, 255, 0.84)",
    boxShadow: "var(--soft-shadow)",
    minWidth: 158,
  },
  statValue: {
    display: "block",
    color: "var(--text-primary)",
    fontSize: "1.32rem",
    fontWeight: 950,
    letterSpacing: "-0.04em",
  },
  statLabel: {
    display: "block",
    marginTop: "0.18rem",
    color: "var(--text-tertiary)",
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.66rem",
    fontWeight: 900,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  softPanel: {
    padding: "clamp(1.25rem, 3vw, 2rem)",
    borderRadius: 24,
    border: "1px solid var(--bg-border)",
    background:
      "radial-gradient(circle at 92% 8%, rgba(111, 56, 255, 0.12), transparent 12rem), rgba(255, 255, 255, 0.82)",
    boxShadow: "var(--soft-shadow)",
  },
  h2: {
    color: "var(--text-primary)",
    fontSize: "clamp(1.65rem, 3.6vw, 2.8rem)",
    lineHeight: 0.98,
    letterSpacing: "-0.05em",
    fontWeight: 950,
    maxWidth: 780,
  },
  pill: {
    width: "fit-content",
    padding: "0.34rem 0.52rem",
    borderRadius: 999,
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.64rem",
    fontWeight: 900,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
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

const reconAreas = [
  ["Whole recon packet", "Binder tab plus source exports", "Manifest, preparer notes, reviewer queue, release rule", "Ingested"],
  ["Bank", "Operating cash", "Statement, GL cash, deposits in transit, outstanding checks", "Break found"],
  ["AP", "Open vendor liabilities", "AP aging, invoice support, vendor master, GL control", "Support gap"],
  ["AR", "Customer receivables", "AR aging, invoice register, cash receipts, GL control", "Proven"],
  ["Payroll", "Wages and taxes", "Payroll register, benefits file, tax extract, GL payroll accounts", "Does not tie"],
  ["Inventory", "Stock and COGS", "Inventory subledger, cycle counts, receiving logs, GL inventory", "Quantity break"],
  ["Intercompany", "Due to / due from", "Entity ledgers, elimination entries, FX rates, approvals", "Out of balance"],
];

const mismatches = [
  {
    code: "BANK_STALE_CHECK",
    area: "Bank",
    amount: "$4,812.17",
    finding:
      "Three checks older than 180 days are still treated as current reconciling items, and the cash proof does not explain the remaining difference.",
    proof: "Needs controller review",
  },
  {
    code: "AP_DUPLICATE_INVOICE",
    area: "AP",
    amount: "$18,440.00",
    finding:
      "Two vendor support files share invoice number, vendor, date, and amount while using different filenames.",
    proof: "Blocked",
  },
  {
    code: "PAYROLL_GL_TIEOUT_FAIL",
    area: "Payroll",
    amount: "$9,260.00",
    finding:
      "Payroll register exceeds posted payroll expense after taxes and benefits are mapped to the GL.",
    proof: "Blocked",
  },
  {
    code: "INV_RECEIPT_CUTOFF",
    area: "Inventory",
    amount: "$27,118.90",
    finding:
      "Receiving log supports May receipt while inventory rollforward includes the units in April ending stock.",
    proof: "Cutoff review",
  },
  {
    code: "IC_ENTITY_IMBALANCE",
    area: "Intercompany",
    amount: "$12,004.33",
    finding:
      "Entity A records a due-from balance that does not match Entity B due-to balance after FX translation.",
    proof: "Blocked",
  },
];

const proofRows = [
  ["Bank", "UNSUPPORTED", "$4,812.17", "Aging of outstanding checks does not bridge to statement cash", "Refuse close release"],
  ["AP", "CONTRADICTED", "$18,440.00", "Duplicate vendor invoice support would overstate liabilities", "Remove duplicate or document split"],
  ["AR", "PROVEN", "$0.00", "Aging ties to GL control and cash receipt sample clears", "No blocker"],
  ["Payroll", "UNSUPPORTED", "$9,260.00", "Payroll register does not tie to payroll expense accounts", "Request corrected mapping"],
  ["Inventory", "CUTOFF_RISK", "$27,118.90", "Receipt date conflicts with period-end inventory inclusion", "Escalate cutoff review"],
  ["Intercompany", "OUT_OF_BALANCE", "$12,004.33", "Counterparty ledger and elimination entry do not agree", "Reconcile entity pair"],
];

const workflow = [
  ["1", "Ingest", "Load the whole reconciliation binder: manifests, bank statements, GL exports, AP / AR aging, payroll registers, inventory detail, entity ledgers, preparer notes, and reviewer status."],
  ["2", "Normalize", "Map account, vendor, customer, employee, SKU, entity, currency, and period fields into a common proof shape."],
  ["3", "Match", "Run deterministic one-to-one, one-to-many, tolerance, date-window, and counterparty matching rules."],
  ["4", "Refuse or prove", "Emit release-gate posture, missing-evidence lists, blocker certificates, and recovery actions for human review."],
];

const guardrails = [
  "Recon Forge supports audit-prep, close readiness, and workpaper assembly.",
  "It does not provide an audit opinion, assurance conclusion, attestation report, or independence judgment.",
  "Every blocked item is routed to accounting owners, reviewers, or external auditors for professional judgment.",
];

const reconPacket = `LEDGERPROOF RECON FORGE TEST PACKET
Company: Northstar Robotics, Inc.
Close period: April 2026
Task: Ingest the whole reconciliation workpaper packet and determine whether it can clear the close release gate. Return release decision, blocker certificates, missing evidence, owner queues, allowed outputs, and recovery actions. Do not provide assurance.

Packet manifest:
- Workpaper set: cash, AP, AR, payroll, inventory, and intercompany
- Source files listed: bank statement, GL exports, subledger agings, payroll register, receiving logs, entity ledgers, preparer notes
- Required release gate: every recon domain must either tie or carry a named, approved reconciling item with source evidence
- Requested output: close-cleared recon packet

Bank reconciliation:
- GL cash 1010 ending balance: $1,246,930.18
- Bank statement ending balance: $1,174,514.01
- Deposits in transit: $64,120.00
- Outstanding checks treated as current: $3,484.00
- Stale outstanding checks older than 180 days: #8830 $1,812.17, #8844 $1,500.00, #8861 $1,500.00
- No stale-check review or escheatment analysis attached.

AP reconciliation:
- GL AP control: $318,660.00
- AP aging: $337,100.00
- Difference: $18,440.00
- Duplicate support candidates: vendor_1184_invoice_7721.pdf and vendor_1184_invoice_7721_scan.pdf. Same vendor, invoice number, service period, date, and amount.

AR reconciliation:
- GL AR control: $812,404.00
- AR aging: $812,404.00
- Cash receipt sample clears within 5 business days.

Payroll reconciliation:
- Payroll register gross wages: $457,480.00
- GL payroll expense: $448,220.00
- Difference: $9,260.00
- No tax or benefits mapping schedule explains the difference.

Inventory reconciliation:
- Inventory GL: $624,880.90
- Inventory subledger: $597,762.00
- Difference: $27,118.90
- Receiving log shows SKU XR-17 units received May 2, but included in April ending stock.

Intercompany reconciliation:
- Entity A due from Entity B after FX: $122,004.33
- Entity B due to Entity A after FX: $110,000.00
- Difference: $12,004.33
- No elimination entry or FX bridge attached.

Reviewer status:
- Controller signoff is attached for AR only.
- Bank, payroll, inventory, AP, and intercompany reviewer signoffs are missing while blockers remain open.

Requested output schema:
- release_decision
- release_gate
- blocker_certificates
- missing_evidence
- owner_queues
- allowed_outputs
- recovery_actions
- why_a_generic_llm_might_fail`;

const reconExpectedOutput = [
  ["Release decision", "REFUSE RELEASE. Only AR is proven; bank, AP, payroll, inventory, and intercompany remain blocked."],
  ["Release gate", "Close-cleared recon packet cannot be exported. AR can be marked proven; all other domains stay in exception queues."],
  ["Blockers", "Stale cash recon items, duplicate AP invoice support, payroll-to-GL mismatch, inventory cutoff break, intercompany out-of-balance pair."],
  ["Missing evidence", "Stale-check review, AP de-dupe or valid reconciling item, payroll mapping, receiving cutoff support, FX and elimination bridge, reviewer signoffs for every blocked domain."],
  ["Generic LLM failure", "A generic model may net the schedules, accept management-friendly explanations, or call differences immaterial without enforcing the deterministic proof threshold needed for close release."],
];

const statusStyle = (status: string): React.CSSProperties => {
  if (status === "PROVEN") {
    return { ...S.pill, background: "rgba(50, 160, 116, 0.12)", color: "#18754f" };
  }

  if (status === "CUTOFF_RISK") {
    return { ...S.pill, background: "rgba(255, 193, 79, 0.18)", color: "#8a5a00" };
  }

  return { ...S.pill, background: "rgba(255, 122, 69, 0.12)", color: "#a34019" };
};

export default function ReconForgePage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/accounting" label="Back to ALCHEMIST Accounting" />
          <span style={S.label}>ALCHEMIST - LEDGERPROOF - RECON FORGE</span>
          <h1 style={S.h1}>Reconciliation workpapers that refuse fuzzy tie-outs.</h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 840 }}>
            Recon Forge turns bank, AP, AR, payroll, inventory, and intercompany
            reconciliations into deterministic proof ledgers. It ingests the whole workpaper
            packet, checks whether balances tie, names missing evidence, and creates
            audit-prep support without pretending to issue an audit opinion.
          </p>
          <div className="ledgerproof-verdict">
            <strong>Packet verdict</strong>
            <span>ABSTAIN - 5 mismatches - 1 clean area - workpaper hash ready</span>
          </div>
          <div style={S.statStrip}>
            {[
              ["6", "Recon domains"],
              ["5", "Blocked proofs"],
              ["1", "Clean tie-out"],
              ["0", "Audit opinions"],
            ].map(([value, label]) => (
              <div key={label} style={S.stat}>
                <span style={S.statValue}>{value}</span>
                <span style={S.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-grid">
          <div className="ledgerproof-panel ledgerproof-panel-large">
            <span style={S.label}>Recon surface</span>
            <h2>One engine for the reconciliations that usually break close.</h2>
            <p>
              Each domain keeps its accounting-specific evidence while sharing the same
              proof posture: whole-binder source files in, deterministic checks, named
              exceptions out. The result is a workpaper trail a reviewer can inspect instead
              of a memo a model merely sounded confident writing.
            </p>
            <div className="ledgerproof-inputs">
              {reconAreas.map(([name, detail, evidence, status]) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <span>{detail}</span>
                  <span>{evidence}</span>
                  <em>{status}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="ledgerproof-panel">
            <span style={S.label}>Release decision</span>
            <div className="ledgerproof-stamp">REFUSE RELEASE</div>
            <p>
              Recon Forge can prepare support, exception logs, reviewer packets, and
              evidence maps. It cannot and does not clear the release gate, certify financial
              statements, or replace auditor, controller, or management judgment when proof is missing.
            </p>
            <div className="ledgerproof-mini-chain">
              <span>WORKPAPER PACK 6 domains</span>
              <span>PROOF LEDGER 31 checks</span>
              <span>5 blocker certificates</span>
              <span>SAFE SCOPE audit-prep only</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <div className="section-heading compact">
            <span style={S.label}>Mismatch certificates</span>
            <h2>Exceptions with amounts, sources, and proof status.</h2>
            <p>
              The module does not bury problems in a reconciliation note. Every mismatch
              receives a code, domain, amount, finding, and next-step status so reviewers
              know what must be resolved before close release.
            </p>
          </div>

          <div className="ledgerproof-blockers">
            {mismatches.map((mismatch) => (
              <article key={mismatch.code}>
                <span>{mismatch.code}</span>
                <h3>{mismatch.area}</h3>
                <p>
                  <strong style={{ color: "var(--text-primary)" }}>{mismatch.amount}</strong>
                  <br />
                  {mismatch.finding}
                </p>
                <small>{mismatch.proof}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-grid">
          <div className="ledgerproof-panel ledgerproof-panel-large">
            <span style={S.label}>Proof ledger</span>
            <h2>Every reconciliation lands in a status, not a vibe.</h2>
            <div className="ledgerproof-table-wrap">
              <table className="ledgerproof-table">
                <thead>
                  <tr>
                    <th>Area</th>
                    <th>Status</th>
                    <th>Delta</th>
                    <th>Finding</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {proofRows.map(([area, status, delta, finding, action]) => (
                    <tr key={area}>
                      <td>{area}</td>
                      <td>
                        <code style={statusStyle(status)}>{status}</code>
                      </td>
                      <td>{delta}</td>
                      <td>{finding}</td>
                      <td>{action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ledgerproof-panel">
            <span style={S.label}>Safe scope</span>
            <h2>Built for preparation, not assurance.</h2>
            <div className="ledgerproof-source-list">
              {guardrails.map((guardrail) => (
                <div key={guardrail}>
                  <strong>Guardrail</strong>
                  <p>{guardrail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-benchmark">
          <div>
            <span style={S.label}>Copyable recon packet</span>
            <h2>Run the tie-out test, then check the refusal.</h2>
            <p>
              The packet mixes one clean reconciliation with five broken ones. The correct
              output must separate the proven AR area from unresolved blocker domains, name
              the missing evidence, and keep the close release gate closed.
            </p>
            <div style={S.outputList}>
              {reconExpectedOutput.map(([label, text]) => (
                <div key={label} style={S.outputItem}>
                  <strong style={{ color: "var(--text-primary)" }}>{label}</strong>
                  <p style={{ ...S.p, marginTop: "0.35rem", fontSize: "0.86rem" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
          <pre style={S.packetPre}>{reconPacket}</pre>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container} className="ledgerproof-benchmark">
          <div>
            <span style={S.label}>Workpaper workflow</span>
            <h2>From messy exports to reviewer-ready exception packets.</h2>
            <p>
              Recon Forge is designed for close teams preparing bank reconciliations,
              subledger tie-outs, payroll support, inventory cutoff workpapers, and
              intercompany cleanup before auditors or lenders ask for the binder.
            </p>
          </div>
          <div className="ledgerproof-prompts">
            {workflow.map(([step, title, text]) => (
              <p key={step}>
                <strong style={{ color: "var(--accent)" }}>{step}. {title}</strong>
                <br />
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AccountingLLMCheck
            expected="REFUSE RELEASE because stale checks, missing reviewer evidence, and recon mismatches remain unresolved."
            prompt="Ingest this whole reconciliation packet. The bank rec ties only if stale checks are ignored. Can the close-cleared recon gate open?"
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AlchemistLiveRunner
            mode="recon"
            title="Run the reconciliation gate."
            intro="Edit the recon packet and the deterministic runner emits tie-out posture, blockers, refusals, and a LUNA-style audit trail."
            initialPacket={reconPacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own reconciliation packet."
            packetPlaceholder={`Paste a sanitized whole recon binder here: GL balances, bank balances, subledger balances, reconciling items, aging, support links, preparer notes, reviewer signoffs, owner queues, and unresolved differences.\n\nAsk the model for tie-out status, release gate, blockers, missing evidence, allowed outputs, and recovery actions.`}
            expected="Release only proven tie-outs; refuse stale, unsupported, unreviewed, or unresolved differences instead of smoothing them into a clean close story."
          />
        </div>
      </section>
    </>
  );
}
