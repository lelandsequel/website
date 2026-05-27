import type { Metadata } from "next";
import Link from "next/link";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import AccountingLLMCheck, { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "LedgerProof - Accounting Workpapers With Receipts",
  description:
    "ALCHEMIST LedgerProof turns month-end close packets into deterministic proof ledgers: every number sourced, every blocker named, every release decision auditable.",
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

const closeInputs = [
  ["Whole binder manifest", "86 files / 42 proof rows", "Ingested"],
  ["GL detail", "2,417 rows", "Loaded"],
  ["Trial balance", "94 accounts", "Ties to GL"],
  ["Bank statement", "Main operating account", "Break found"],
  ["AP aging", "148 open items", "Support gap"],
  ["AR aging", "91 open invoices", "Loaded"],
  ["Payroll register", "88 employees", "Does not tie"],
  ["Fixed asset rollforward", "412 assets", "Formula break"],
  ["Close checklist", "37 procedures", "Release gate blocked"],
];

const blockers = [
  {
    code: "BANK_RECON_MISMATCH",
    title: "Cash cannot close",
    detail:
      "Operating cash reconciliation is off by $4,812.17. Outstanding-check support does not explain the difference.",
    source: "bank_statement_2026_04.pdf + gl_cash_1010.csv",
  },
  {
    code: "DUPLICATE_SUPPORT",
    title: "Vendor invoice counted twice",
    detail:
      "Two AP support files share the same invoice number, vendor, amount, and date under different filenames.",
    source: "ap_support/vendor_1184_invoice_7721.pdf",
  },
  {
    code: "CUTOFF_VIOLATION",
    title: "Revenue booked before delivery",
    detail:
      "A $38,400 customer invoice was recognized in April, but delivery evidence is dated May 3.",
    source: "invoice_AR-20491.pdf + pod_20491.png",
  },
  {
    code: "PAYROLL_TIEOUT_FAIL",
    title: "Payroll does not tie to GL",
    detail:
      "Payroll register total exceeds payroll expense posted to the GL by $9,260.00.",
    source: "payroll_register_2026_04.csv + gl_payroll_6100.csv",
  },
  {
    code: "FLUX_UNSUPPORTED",
    title: "Variance explanation is not release-ready",
    detail:
      "Management explanation says revenue increased due to strong demand, but no volume, price, mix, customer, or timing support was provided.",
    source: "flux_notes_april.md",
  },
];

const proofRows = [
  ["Cash", "UNSUPPORTED", "Bank rec mismatch", "Refuse release"],
  ["Revenue", "CONTRADICTED", "Delivery after recognition date", "Escalate cutoff review"],
  ["Payroll expense", "UNSUPPORTED", "Register does not tie to GL", "Request corrected support"],
  ["Fixed assets", "FORMULA_MISMATCH", "Depreciation rollforward breaks", "Recompute schedule"],
  ["AP accruals", "STALE_SUPPORT", "Invoice support duplicated / missing", "Refresh binder"],
  ["AR", "PROVEN", "Aging ties to GL", "No blocker"],
];

const products = [
  ["Close Sentinel", "Month-end close release gate", "/alchemist/ledgerproof"],
  ["Recon Forge", "Bank, AP, AR, payroll, inventory, and intercompany recon engine", "/alchemist/ledgerproof/recon"],
  ["Journal Gate", "Journal entry proof and refusal preflight", "/alchemist/ledgerproof/journal"],
  ["Flux Inquest", "Variance analysis that refuses vague explanations", "/alchemist/ledgerproof/flux"],
  ["BinderProof", "Audit-ready close binder with immutable evidence map", "/alchemist/ledgerproof/binder"],
  ["Policy Mirror", "Company accounting-policy checker with human-review boundaries", "/alchemist/ledgerproof/policy"],
  ["ControlRoom", "Close status, reviewer queues, stale support, and audit-hashed proof gaps", "/alchemist/ledgerproof/control"],
];

const sources = [
  ["AICPA Audit Data Standards", "GL, P2P/AP, O2C/AR, inventory, and fixed asset field discipline"],
  ["SEC / XBRL", "Public-company facts, filings, restatements, and source-backed tie-outs"],
  ["FASB / IRS rule layers", "Synthetic cases for revenue, leases, depreciation, and tax support"],
  ["Synthetic close packets", "Controlled clean and broken binders for public benchmark cases"],
];

const benchmarkPrompts = [
  "Ingest this whole close binder manifest and decide whether auditor export is allowed. Return release gate, blockers, missing evidence, and refusal reason.",
  "Revenue increased 38% month over month. Management says 'strong demand.' Is this flux explanation release-ready?",
  "This invoice appears twice with different filenames. Should both count as independent support?",
  "The bank reconciliation ties if you ignore three outstanding checks older than 180 days. Is it close-ready?",
];

const closeBinderPacket = `LEDGERPROOF CLOSE SENTINEL TEST PACKET
Company: Northstar Robotics, Inc.
Close period: April 2026
Task: Ingest the whole close binder and decide whether the prepared-for-auditor-review export gate can open. Return release decision, blocker certificates, missing evidence by workpaper, allowed outputs, and recovery actions. Do not give an audit opinion or smooth over gaps.

Binder manifest:
- Binder ID: CLOSE-2026-04
- Files listed: 86 evidence files across cash, AR, revenue, AP, payroll, fixed assets, flux, and review tabs
- Required release gate: every material workpaper must tie to source evidence, have owner/reviewer status, and carry no unresolved blocker certificate
- Requested export: auditor packet plus management close summary

Trial balance control totals:
- Cash 1010: GL balance $1,246,930.18
- Accounts receivable 1200: GL balance $812,404.00
- Revenue 4000: GL balance $2,084,900.00
- Payroll expense 6100: GL balance $448,220.00
- Fixed assets net 1500: GL balance $1,902,774.00
- AP accruals 2105: GL balance $318,660.00

Close binder evidence:
1. Bank statement ending cash is $1,174,514.01. Reconciling items list deposits in transit of $64,120.00 and outstanding checks of $3,484.00, but three checks totaling $4,812.17 are older than 180 days and have no stale-check review.
2. AR aging ties to GL at $812,404.00.
3. Invoice AR-20491 for $38,400 was booked to April revenue on April 30. Proof of delivery file POD-20491 is dated May 3, 2026.
4. Payroll register total is $457,480.00. GL payroll expense is $448,220.00. No mapping schedule explains the $9,260.00 difference.
5. Fixed asset rollforward says beginning NBV $1,870,000 + additions $76,000 - depreciation $40,226 = ending NBV $1,902,774. Formula should equal $1,905,774.
6. AP support contains vendor_1184_invoice_7721.pdf and vendor_1184_invoice_7721_scan.pdf. Both show vendor 1184, invoice 7721, service period April 2026, amount $18,440.00.
7. Management flux note: "Revenue increased because demand was strong." No volume, price, mix, customer, or timing bridge is attached.
8. Close checklist says "review complete" for cash and revenue, but reviewer signoff files are not present for WP-C01 or WP-R07.

Requested output schema:
- release_decision
- release_gate
- blocker_certificates with source evidence
- missing_evidence_by_workpaper
- allowed_outputs
- recovery_actions
- why_a_generic_llm_might_fail`;

const closeExpectedOutput = [
  ["Release decision", "ABSTAIN / REFUSE RELEASE. The close binder is not audit-ready while evidence breaks remain open."],
  ["Release gate", "Auditor export blocked. Management summary may be generated only with unresolved blocker labels visible."],
  ["Blockers", "Cash recon mismatch, revenue cutoff contradiction, payroll tie-out failure, fixed asset formula mismatch, duplicate AP support, unsupported flux explanation, missing reviewer signoffs."],
  ["Missing evidence", "Stale-check review, in-period delivery evidence or correction entry, payroll mapping schedule, corrected FA rollforward, duplicate invoice resolution, driver-level flux bridge, WP-C01 and WP-R07 reviewer approvals."],
  ["Generic LLM failure", "A generic model often summarizes the binder and says it is ready with caveats, treating plausible notes or checklist labels as support instead of enforcing deterministic release-blocking evidence."],
];

export default function LedgerProofPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/accounting" label="Back to ALCHEMIST Accounting" />
          <span style={S.label}>ALCHEMIST · LEDGERPROOF</span>
          <h1
            style={{
              fontSize: "clamp(2.65rem, 7vw, 5.8rem)",
              fontWeight: 950,
              letterSpacing: "-0.058em",
              lineHeight: 0.92,
              color: "var(--text-primary)",
              maxWidth: 900,
              marginBottom: "1rem",
            }}
          >
            Accounting workpapers with receipts.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 820 }}>
            LedgerProof is the accounting side of ALCHEMIST: a deterministic close,
            reconciliation, and audit-prep layer that ingests whole binders and workpaper
            packets. Every number, checklist tick, reviewer note, and support file must tie
            to source evidence before a release gate opens.
          </p>
          <div className="ledgerproof-verdict">
            <strong>Packet verdict</strong>
            <span>ABSTAIN · 5 release blockers · 1 clean area · audit hash ready</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-grid">
          <div className="ledgerproof-panel ledgerproof-panel-large">
            <span style={S.label}>Close Sentinel</span>
            <h2>No number leaves the building without surviving.</h2>
            <p>
              A normal LLM can read a close packet and write a confident memo. Close Sentinel
              does something stricter: it ingests the whole binder and checks whether each
              number survives the ledger, subledger, support, policy, and review chain.
            </p>
            <div className="ledgerproof-inputs">
              {closeInputs.map(([name, detail, status]) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <span>{detail}</span>
                  <em>{status}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="ledgerproof-panel">
            <span style={S.label}>Release decision</span>
            <div className="ledgerproof-stamp">REFUSE RELEASE</div>
            <p>
              The packet is not audit-ready. ALCHEMIST can generate the blocker list,
              recovery actions, and evidence map, but it will not certify, export, or soften
              a broken close.
            </p>
            <div className="ledgerproof-mini-chain">
              <span>GENESIS 9f42c1e8</span>
              <span>PROOF LEDGER 42 rows</span>
              <span>5 blocker certificates</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <div className="section-heading compact">
            <span style={S.label}>Blocker certificates</span>
            <h2>It does not just say no. It says exactly why.</h2>
            <p>
              Every refusal carries a code, source, and recovery action. The accountant,
              controller, auditor, or lender gets the exception surface instead of a
              polished hallucination.
            </p>
          </div>

          <div className="ledgerproof-blockers">
            {blockers.map((blocker) => (
              <article key={blocker.code}>
                <span>{blocker.code}</span>
                <h3>{blocker.title}</h3>
                <p>{blocker.detail}</p>
                <small>{blocker.source}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-grid">
          <div className="ledgerproof-panel ledgerproof-panel-large">
            <span style={S.label}>Proof ledger</span>
            <h2>Every balance gets a status.</h2>
            <div className="ledgerproof-table-wrap">
              <table className="ledgerproof-table">
                <thead>
                  <tr>
                    <th>Area</th>
                    <th>Status</th>
                    <th>Finding</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {proofRows.map(([area, status, finding, action]) => (
                    <tr key={area}>
                      <td>{area}</td>
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
            <span style={S.label}>Corpus spine</span>
            <h2>Standards-backed and public-safe.</h2>
            <div className="ledgerproof-source-list">
              {sources.map(([name, text]) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-benchmark">
          <div>
            <span style={S.label}>Copyable close binder packet</span>
            <h2>Paste the broken close into any LLM.</h2>
            <p>
              This synthetic packet has enough accounting evidence to make the right answer
              mechanical: the system must refuse the release gate, name missing workpaper
              evidence, and avoid turning checklist status or management narrative into proof.
            </p>
            <div style={S.outputList}>
              {closeExpectedOutput.map(([label, text]) => (
                <div key={label} style={S.outputItem}>
                  <strong style={{ color: "var(--text-primary)" }}>{label}</strong>
                  <p style={{ ...S.p, marginTop: "0.35rem", fontSize: "0.86rem" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
          <pre style={S.packetPre}>{closeBinderPacket}</pre>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <div className="section-heading compact">
            <span style={S.label}>LedgerProof suite</span>
            <h2>Close first. Accounting suite after.</h2>
            <p>
              The first public wedge is Close Sentinel. The surrounding suite expands the same
              proof posture across reconciliations, journals, variance explanations, binders,
              and accounting policies.
            </p>
          </div>
          <div className="ledgerproof-products">
            {products.map(([name, text, href]) => (
              <Link href={href} key={name}>
                <strong>{name}</strong>
                <span>{text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container} className="ledgerproof-benchmark">
          <div>
            <span style={S.label}>LLM bakeoff</span>
            <h2>The benchmark is release discipline, not eloquence.</h2>
            <p>
              Frontier LLMs can write accounting-sounding workpapers. LedgerProof scores the
              thing that matters: did the system approve a packet that should have been blocked?
            </p>
          </div>
          <div className="ledgerproof-prompts">
            {benchmarkPrompts.map((prompt) => (
              <p key={prompt}>{prompt}</p>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AccountingLLMCheck
            expected="ABSTAIN / REFUSE RELEASE until blocker certificates are cleared and missing workpaper evidence is attached."
            prompt="Ingest this whole close binder manifest. Can it be sent to auditors, and which release gate blocks export?"
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AlchemistLiveRunner
            mode="close"
            title="Run the close binder gate."
            intro="Edit the close packet and the deterministic runner emits release posture, blockers, refusals, and a LUNA-style audit trail."
            initialPacket={closeBinderPacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own close binder."
            packetPlaceholder={`Paste a sanitized whole-binder manifest here: trial balance, GL detail, bank rec, AR/AP aging, payroll tie-out, journal support, flux explanations, reviewer notes, missing schedules, file names, owner queues, and open items.\n\nAsk the LLM: Can the auditor export gate open? Return release decision, blocker certificates, missing evidence by workpaper, allowed outputs, and recovery actions.`}
            expected="ABSTAIN / REFUSE RELEASE until every blocker certificate is cleared, required reviewer evidence is attached, and the binder is supported by source evidence."
          />
        </div>
      </section>
    </>
  );
}
