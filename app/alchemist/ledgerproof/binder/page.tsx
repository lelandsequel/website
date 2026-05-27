import type { Metadata } from "next";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import AccountingLLMCheck, { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "BinderProof - Audit-Ready Close Binder",
  description:
    "ALCHEMIST BinderProof turns close packets into audit-prep workpaper binders with evidence indexes, reviewer notes, immutable proof ledgers, and blocker certificates.",
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

const binderSections = [
  ["Whole binder intake", "86 files / 42 proof rows", "Release gate blocked"],
  ["Cash and debt", "12 workpapers", "2 blockers"],
  ["Revenue and AR", "18 workpapers", "1 blocker"],
  ["AP and accruals", "15 workpapers", "3 reviewer notes"],
  ["Fixed assets", "9 workpapers", "Formula check"],
  ["Payroll", "8 workpapers", "Tie-out pending"],
  ["Inventory", "11 workpapers", "Count support indexed"],
  ["Equity", "6 workpapers", "Clean"],
  ["Disclosure support", "14 workpapers", "Draft only"],
];

const evidenceIndex = [
  ["BANK-0426", "April bank statement", "Cash rec WP-C01", "Contradicts"],
  ["AR-20491", "Delivery proof", "Revenue cutoff WP-R07", "Late support"],
  ["AP-1184", "Vendor invoice packet", "Accrual WP-A03", "Duplicate"],
  ["FA-ROLL", "Fixed asset rollforward", "Depreciation WP-F02", "Formula mismatch"],
  ["PY-REG", "Payroll register", "Payroll tie-out WP-P01", "Does not tie"],
  ["INV-COUNT", "Cycle count sheets", "Inventory WP-I04", "Indexed"],
];

const reviewerNotes = [
  {
    title: "Cash release blocked",
    text:
      "Operating cash cannot move to prepared-for-review until the outstanding-check schedule explains the $4,812.17 difference.",
  },
  {
    title: "Revenue cutoff needs owner evidence",
    text:
      "The binder can draft the exception note, but it refuses to treat a May 3 delivery file as April revenue support.",
  },
  {
    title: "Accrual support is not independent",
    text:
      "Two files point to the same invoice fingerprint. BinderProof marks the second file as duplicate support, not corroboration.",
  },
];

const proofLedger = [
  ["0001", "Genesis binder hash", "9f42c1e8", "Locked"],
  ["0019", "Cash workpaper evidence map", "8b18a4d2", "Blocked"],
  ["0024", "Revenue cutoff certificate", "c781fd0a", "Refused"],
  ["0031", "Reviewer note export", "1bb902be", "Ready"],
  ["0042", "Binder release packet", "pending", "Abstain"],
];

const certificates = [
  {
    code: "CASH_RECON_GAP",
    title: "Cash reconciliation difference remains open",
    detail:
      "The cash section is indexed, but WP-C01 still carries a $4,812.17 recon difference and stale checks older than 180 days.",
    source: "WP-C01 + bank_statement_april.pdf",
  },
  {
    code: "EVIDENCE_CHAIN_GAP",
    title: "Evidence index skips the source document",
    detail:
      "The revenue workpaper references a management memo but does not link to signed delivery evidence for the recognized period.",
    source: "WP-R07 + invoice_AR-20491.pdf",
  },
  {
    code: "DUPLICATE_SUPPORT",
    title: "AP evidence is duplicated, not corroborated",
    detail:
      "Two AP files share the same fingerprint, so BinderProof refuses to count the duplicate scan as independent support.",
    source: "WP-A03 + vendor_1184_invoice_7721_scan.pdf",
  },
  {
    code: "FORMULA_MISMATCH",
    title: "Fixed asset rollforward does not tie",
    detail:
      "WP-F02 has a $3,000 formula mismatch. BinderProof can name the exception, but it will not certify the section as complete.",
    source: "WP-F02 + FA-ROLL",
  },
  {
    code: "PAYROLL_TIE_OUT_FAILURE",
    title: "Payroll register exceeds the GL",
    detail:
      "The payroll register exceeds GL payroll expense by $9,260 and the required mapping schedule is missing.",
    source: "WP-P01 + PY-REG",
  },
  {
    code: "REVIEW_NOTE_REQUIRED",
    title: "Reviewer judgment must stay human-owned",
    detail:
      "BinderProof drafts the note and gathers support, but it refuses to issue an audit opinion or final accounting conclusion.",
    source: "review_queue/controller_notes.md",
  },
];

const binderManifestPacket = `LEDGERPROOF BINDERPROOF MANIFEST TEST PACKET
Company: Northstar Robotics, Inc.
Close period: April 2026
Task: Ingest the whole close binder manifest and decide whether the audit-prep export release gate can open. Return release decision, blocker certificates, missing evidence by section, allowed exports, and recovery actions. Do not issue an audit opinion.

Binder manifest:
- Binder ID: CLOSE-2026-04
- Proof ledger rows: 42
- Evidence files indexed: 86
- Reviewer notes: 11
- Requested export: Prepared-for-auditor-review packet
- Required release gate: every binder section must have source evidence, no unresolved contradiction, owner status, reviewer signoff where required, and an append-only proof ledger row

Section status:
1. Cash and debt: 12 workpapers. WP-C01 references bank_statement_april.pdf and gl_cash_1010.csv. Status says "Prepared," but the workpaper has an unresolved $4,812.17 recon difference and stale checks older than 180 days.
2. Revenue and AR: 18 workpapers. AR aging ties to GL. WP-R07 references invoice_AR-20491.pdf for April revenue and POD-20491.png dated May 3, 2026.
3. AP and accruals: 15 workpapers. WP-A03 uses vendor_1184_invoice_7721.pdf and vendor_1184_invoice_7721_scan.pdf as two pieces of support, but fingerprints match.
4. Fixed assets: 9 workpapers. WP-F02 rollforward formula is off by $3,000.
5. Payroll: 8 workpapers. WP-P01 register exceeds GL by $9,260 with no mapping schedule.
6. Inventory: 11 workpapers. Count sheets indexed and rollforward ties after cutoff adjustment.
7. Equity: 6 workpapers. Board approval and cap table support indexed.
8. Disclosure support: 14 workpapers. Draft policy memo missing reviewer signoff.

Manifest gaps:
- Required file stale_check_review_WP-C01.pdf is missing.
- Required file payroll_mapping_WP-P01.xlsx is missing.
- Required reviewer signoff disclosure_controller_approval.pdf is missing.
- Required release note must list every unresolved blocker if management summary is exported.

Current proof ledger:
- 0001 Genesis binder hash 9f42c1e8 locked
- 0019 Cash evidence map 8b18a4d2 blocked
- 0024 Revenue cutoff certificate c781fd0a refused
- 0031 Reviewer note export 1bb902be ready
- 0042 Binder release packet pending abstain

Requested output schema:
- release_decision
- release_gate
- blocker_certificates
- missing_evidence_by_section
- allowed_exports
- refused_exports
- why_a_generic_llm_might_fail`;

const binderExpectedOutput = [
  ["Release decision", "ABSTAIN / REFUSE AUDIT-PREP EXPORT. The manifest is indexed, but unresolved blocker certificates prevent a complete binder release."],
  ["Release gate", "Prepared-for-auditor-review export is blocked. Internal exception packet and management summary are allowed only if blockers remain visible."],
  ["Blockers", "Cash recon gap, revenue cutoff conflict, duplicate AP support, fixed asset formula mismatch, payroll tie-out failure, missing disclosure reviewer signoff."],
  ["Missing evidence", "Stale-check review, April delivery evidence or correction, AP duplicate resolution, corrected FA rollforward, payroll mapping, disclosure approval trail, blocker-visible release note."],
  ["Generic LLM failure", "A generic model may equate a neat manifest with completeness, overlooking that indexed evidence can still contradict the workpaper conclusion."],
];

export default function BinderProofPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/accounting" label="Back to ALCHEMIST Accounting" />
          <span style={S.label}>ALCHEMIST · LEDGERPROOF · BINDERPROOF</span>
          <h1
            style={{
              fontSize: "clamp(2.65rem, 7vw, 5.8rem)",
              fontWeight: 950,
              letterSpacing: "-0.058em",
              lineHeight: 0.92,
              color: "var(--text-primary)",
              maxWidth: 930,
              marginBottom: "1rem",
            }}
          >
            Audit-ready close binders with an evidence spine.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 840 }}>
            BinderProof ingests the whole close packet and turns it into audit-prep workpaper
            support: every evidence file indexed, every reviewer note attached, every missing
            artifact named, and every unresolved issue carried forward as a blocker certificate.
            It supports preparation and review; it does not issue audit opinions or final accounting advice.
          </p>
          <div className="ledgerproof-verdict">
            <strong>Binder verdict</strong>
            <span>ABSTAIN · 6 release blockers · 42 proof rows · immutable hash chain</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-grid">
          <div className="ledgerproof-panel ledgerproof-panel-large">
            <span style={S.label}>Close binder map</span>
            <h2>The binder is organized around proof, not folders.</h2>
            <p>
              BinderProof assembles a close binder that shows which workpapers tie,
              which files support them, which evidence is missing, which notes need review,
              and which areas are blocked from release.
            </p>
            <div className="ledgerproof-inputs">
              {binderSections.map(([name, detail, status]) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <span>{detail}</span>
                  <em>{status}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="ledgerproof-panel">
            <span style={S.label}>Release boundary</span>
            <div className="ledgerproof-stamp">ABSTAIN</div>
            <p>
              The binder can be prepared for auditor review only after blockers are cleared.
              ALCHEMIST can draft support packets and exception notes, but it refuses to
              open export gates, certify the close, replace auditor procedures, or provide
              final accounting advice.
            </p>
            <div className="ledgerproof-mini-chain">
              <span>INDEX 86 evidence files</span>
              <span>REVIEW 11 notes</span>
              <span>BLOCKERS 6 certificates</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <div className="section-heading compact">
            <span style={S.label}>Evidence index</span>
            <h2>Every workpaper points back to source support.</h2>
            <p>
              The index is built for audit-prep traceability: file, workpaper, conclusion,
              and refusal status in one deterministic surface.
            </p>
          </div>
          <div className="ledgerproof-table-wrap">
            <table className="ledgerproof-table">
              <thead>
                <tr>
                  <th>Evidence ID</th>
                  <th>Source</th>
                  <th>Workpaper</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {evidenceIndex.map(([id, source, workpaper, status]) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{source}</td>
                    <td>{workpaper}</td>
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
            <span style={S.label}>Reviewer notes</span>
            <h2>Human review stays visible and owned.</h2>
            <div className="ledgerproof-source-list">
              {reviewerNotes.map((note) => (
                <div key={note.title}>
                  <strong>{note.title}</strong>
                  <p>{note.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ledgerproof-panel">
            <span style={S.label}>Immutable proof ledger</span>
            <h2>Binder history is append-only.</h2>
            <div className="ledgerproof-table-wrap">
              <table className="ledgerproof-table">
                <tbody>
                  {proofLedger.map(([row, event, hash, status]) => (
                    <tr key={row}>
                      <td>{row}</td>
                      <td>{event}</td>
                      <td>{hash}</td>
                      <td>
                        <code>{status}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <div className="section-heading compact">
            <span style={S.label}>Blocker certificates</span>
            <h2>Release refusal becomes a workpaper artifact.</h2>
            <p>
              BinderProof gives controllers, auditors, and finance teams a precise exception
              record without pretending the system can make the final professional judgment.
            </p>
          </div>
          <div className="ledgerproof-blockers">
            {certificates.map((certificate) => (
              <article key={certificate.code}>
                <span>{certificate.code}</span>
                <h3>{certificate.title}</h3>
                <p>{certificate.detail}</p>
                <small>{certificate.source}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-benchmark">
          <div>
            <span style={S.label}>Copyable binder manifest</span>
            <h2>An organized binder can still be unreleasable.</h2>
            <p>
              This manifest looks auditor-friendly until the proof ledger is inspected.
              BinderProof treats indexing as necessary, but never as a substitute for support,
              reviewer evidence, or blocker resolution.
            </p>
            <div style={S.outputList}>
              {binderExpectedOutput.map(([label, text]) => (
                <div key={label} style={S.outputItem}>
                  <strong style={{ color: "var(--text-primary)" }}>{label}</strong>
                  <p style={{ ...S.p, marginTop: "0.35rem", fontSize: "0.86rem" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
          <pre style={S.packetPre}>{binderManifestPacket}</pre>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AccountingLLMCheck
            expected="ABSTAIN because the binder has unresolved cash, revenue cutoff, duplicate support, fixed asset, payroll, and reviewer blockers."
            prompt="Ingest this whole binder manifest. Can the audit-prep export gate open? Return release decision, allowed exports, and unresolved evidence gaps."
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AlchemistLiveRunner
            mode="binder"
            title="Run the binder proof gate."
            intro="Edit the binder manifest and the deterministic runner emits release posture, blockers, refusals, and a LUNA-style audit trail."
            initialPacket={binderManifestPacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own binder manifest."
            packetPlaceholder={`Paste a sanitized whole close binder manifest here: tabs, workpapers, evidence file names, control owners, proof hashes or links, review status, missing schedules, export request, and blocker notes.\n\nAsk the model for release gate, allowed exports, blockers, missing evidence by section, and reviewer-ready exception list.`}
            expected="Treat organization as necessary but insufficient; refuse binder release when any required proof, review evidence, export note, or blocker resolution is missing."
          />
        </div>
      </section>
    </>
  );
}
