import type { Metadata } from "next";
import AlchemistLiveRunner from "@/components/AlchemistLiveRunner";
import BackLink from "@/components/BackLink";
import AccountingLLMCheck, { BringYourOwnPacketChallenge } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "ControlRoom - Continuous Close Dashboard",
  description:
    "ControlRoom is the LedgerProof dashboard for close status, proof gaps, stale support, reviewer queues, and audit-hashed accounting workpapers.",
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
  panel: {
    border: "1px solid var(--bg-border)",
    borderRadius: 24,
    background: "rgba(255, 255, 255, 0.82)",
    boxShadow: "var(--soft-shadow)",
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

const tiles = [
  ["1", "whole close packet", "Dashboard ingests the binder manifest, workpapers, queues, and export rules."],
  ["42", "proof ledger rows", "Every balance carries source, status, and reviewer posture."],
  ["5", "release blockers", "Cash, payroll, revenue cutoff, AP support, and flux explanation."],
  ["3", "stale support items", "Evidence older than policy allows is downgraded before review."],
  ["0", "silent approvals", "Unsupported balances stay blocked until healed."],
];

const queues = [
  ["Controller review", "5 blockers", "Cash, payroll, revenue, AP, and flux"],
  ["Preparer queue", "7 recovery actions", "Upload support, refresh schedules, rerun tie-outs"],
  ["Audit export", "Blocked", "BinderProof cannot export until close gate clears"],
  ["Management view", "Available", "Summary shows blockers without exposing raw support"],
];

const timeline = [
  ["08:14", "GL detail ingested", "2,417 ledger rows normalized"],
  ["08:15", "Trial balance rolled forward", "94 accounts tied to GL detail"],
  ["08:17", "Bank recon failed", "$4,812.17 unresolved difference"],
  ["08:21", "Revenue cutoff blocked", "Delivery proof dated after recognition"],
  ["08:26", "Release decision", "ABSTAIN until blockers heal"],
];

const controlDashboardPacket = `LEDGERPROOF CONTROLROOM DASHBOARD TEST PACKET
Company: Northstar Robotics, Inc.
Close period: April 2026
Task: Ingest the whole close dashboard packet and decide whether the auditor export release gate can open. Return release decision, blockers, missing evidence, owner queues, allowed views, refused actions, and recovery actions. Do not provide assurance.

Dashboard summary:
- Proof ledger rows: 42
- Release blockers: 5
- Stale support items: 3
- Silent approvals allowed: 0
- Requested status change: CFO asks to mark "Ready for auditor export" today.
- Required release gate: auditor export requires zero unresolved blocker certificates, no stale evidence without review, and reviewer signoff for every material workpaper
- Ingested packet: binder manifest, module tiles, source status, reviewer queues, owner assignments, export rules, and audit trail

Tiles:
1. Cash: status BLOCKED. Owner controller. GL cash does not tie to bank reconciliation; $4,812.17 unresolved difference. Stale checks older than 180 days have no review.
2. Revenue cutoff: status BLOCKED. Owner revenue accounting. Invoice AR-20491 was recognized April 30; delivery proof is dated May 3.
3. Payroll: status BLOCKED. Owner payroll accounting. Register exceeds GL payroll expense by $9,260.00.
4. AP support: status BLOCKED. Owner AP lead. Duplicate vendor invoice support could overstate accruals by $18,440.00.
5. Flux note: status BLOCKED. Owner FP&A. Revenue explanation says "strong demand" with no volume, price, mix, customer, or timing bridge.
6. AR aging: status PROVEN. Owner receivables. Aging ties to GL and receipt sample clears.
7. Inventory: status PROVEN AFTER ADJUSTMENT. Owner inventory accounting. Count sheets tie after cutoff adjustment.

Reviewer queues:
- Controller review: 5 blockers waiting
- Preparer queue: 7 recovery actions open
- Audit export: blocked
- Management view: available with blocker summary only

Missing evidence inventory:
- WP-C01 stale-check review not attached.
- WP-R07 in-period delivery evidence not attached.
- WP-P01 payroll mapping schedule not attached.
- AP duplicate support resolution not attached.
- Flux driver bridge not attached.

Audit trail:
- 08:14 GL detail ingested
- 08:15 Trial balance tied to GL
- 08:17 Bank recon failed
- 08:21 Revenue cutoff blocked
- 08:26 Release decision ABSTAIN

Requested output schema:
- release_decision
- release_gate
- dashboard_status
- blocker_queue
- missing_evidence
- allowed_views
- refused_actions
- why_a_generic_llm_might_fail`;

const controlExpectedOutput = [
  ["Release decision", "ABSTAIN / DO NOT MARK READY. Audit export stays blocked while five release blockers remain open."],
  ["Release gate", "Auditor export cannot open. Management view is allowed only as a blocker-visible status summary."],
  ["Blockers", "Cash recon gap, revenue cutoff issue, payroll mismatch, duplicate AP support, unsupported flux explanation."],
  ["Missing evidence", "Stale-check review, in-period delivery or correction, payroll mapping, duplicate AP resolution, driver-level flux bridge, reviewer signoff for healed items."],
  ["Generic LLM failure", "A generic model may optimize for executive reporting and recommend marking ready with caveats, instead of respecting the dashboard's zero silent approvals control."],
];

export default function ControlRoomPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/accounting" label="Back to ALCHEMIST Accounting" />
          <span style={S.label}>ALCHEMIST · LEDGERPROOF · CONTROLROOM</span>
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
            The close dashboard that refuses theater.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 820 }}>
            ControlRoom is the operator view for LedgerProof. It ingests the whole close
            packet, shows which balances are proven, which are blocked, who owns recovery,
            and whether export gates can move forward without pretending unsupported
            workpapers are ready.
          </p>
          <div className="ledgerproof-verdict">
            <strong>Dashboard verdict</strong>
            <span>ABSTAIN - 5 blockers - audit export blocked - management view allowed</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5.5rem" }}>
        <div style={S.container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.8rem",
            }}
          >
            {tiles.map(([number, label, text]) => (
              <div key={label} style={{ ...S.panel, padding: "1rem", minHeight: 150 }}>
                <strong
                  style={{
                    color: "var(--accent)",
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "2rem",
                    lineHeight: 1,
                  }}
                >
                  {number}
                </strong>
                <h2
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                    fontWeight: 950,
                    letterSpacing: "-0.02em",
                    marginTop: "0.55rem",
                  }}
                >
                  {label}
                </h2>
                <p style={{ ...S.p, fontSize: "0.86rem", marginTop: "0.45rem" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div
          style={{
            ...S.container,
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.95fr) minmax(320px, 1.05fr)",
            gap: "1rem",
          }}
        >
          <div style={{ ...S.panel, padding: "clamp(1.25rem, 3vw, 2rem)" }}>
            <span style={S.label}>Reviewer queues</span>
            <h2
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(1.7rem, 3.8vw, 3rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.05em",
                fontWeight: 950,
              }}
            >
              Exception handling, not spreadsheet archaeology.
            </h2>
            <p style={{ ...S.p, marginTop: "0.8rem" }}>
              Accountants should not spend the close hunting for receipts and wondering which
              tab broke. ControlRoom turns the close into a queue of named proof gaps, missing
              evidence, owners, release gates, and recovery actions.
            </p>
            <div style={{ display: "grid", gap: "0.65rem", marginTop: "1.2rem" }}>
              {queues.map(([name, status, detail]) => (
                <div
                  key={name}
                  style={{
                    border: "1px solid var(--bg-border)",
                    borderRadius: 16,
                    padding: "0.85rem",
                    background: "rgba(255,255,255,0.78)",
                  }}
                >
                  <strong style={{ color: "var(--text-primary)", fontWeight: 950 }}>{name}</strong>
                  <span
                    style={{
                      display: "inline-flex",
                      marginLeft: "0.5rem",
                      color: "var(--accent)",
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.68rem",
                      fontWeight: 900,
                      textTransform: "uppercase",
                    }}
                  >
                    {status}
                  </span>
                  <p style={{ ...S.p, marginTop: "0.3rem", fontSize: "0.84rem" }}>{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...S.panel, padding: "clamp(1.25rem, 3vw, 2rem)" }}>
            <span style={S.label}>Audit trail</span>
            <h2
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(1.7rem, 3.8vw, 3rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.05em",
                fontWeight: 950,
              }}
            >
              One event stream for the whole close.
            </h2>
            <div style={{ display: "grid", gap: "0.75rem", marginTop: "1.2rem" }}>
              {timeline.map(([time, event, detail]) => (
                <div
                  key={`${time}-${event}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "64px 1fr",
                    gap: "0.8rem",
                    alignItems: "start",
                  }}
                >
                  <code style={{ width: "fit-content" }}>{time}</code>
                  <div>
                    <strong style={{ color: "var(--text-primary)", fontWeight: 950 }}>{event}</strong>
                    <p style={{ ...S.p, marginTop: "0.18rem", fontSize: "0.84rem" }}>{detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ ...S.p, fontSize: "0.86rem", marginTop: "1.25rem" }}>
              ControlRoom produces audit-prep workpapers and deterministic release evidence.
              It does not issue an audit opinion, legal conclusion, final accounting judgment,
              or gate override when required evidence is missing.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container} className="ledgerproof-benchmark">
          <div>
            <span style={S.label}>Copyable control dashboard packet</span>
            <h2>The dashboard should block pressure, not hide it.</h2>
            <p>
              This case asks whether a close can be marked ready despite open exceptions.
              LedgerProof preserves the operator boundary: management can see the summary,
              but audit export remains blocked and the refusal reason stays explicit.
            </p>
            <div style={S.outputList}>
              {controlExpectedOutput.map(([label, text]) => (
                <div key={label} style={S.outputItem}>
                  <strong style={{ color: "var(--text-primary)" }}>{label}</strong>
                  <p style={{ ...S.p, marginTop: "0.35rem", fontSize: "0.86rem" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
          <pre style={S.packetPre}>{controlDashboardPacket}</pre>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AccountingLLMCheck
            expected="ABSTAIN because close blockers and missing evidence remain open in the reviewer queues."
            prompt="Ingest this whole dashboard packet. The CFO wants ready-for-export despite five blockers. Can the auditor export gate open?"
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <AlchemistLiveRunner
            mode="control"
            title="Run the control-room gate."
            intro="Edit the dashboard packet and the deterministic runner emits close readiness, blockers, refusals, and a LUNA-style audit trail."
            initialPacket={controlDashboardPacket}
          />
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own control dashboard."
            packetPlaceholder={`Paste a sanitized whole close dashboard packet here: entities, modules, reviewer queues, blocker counts, missing evidence, materiality threshold, target close date, overrides requested, owner queues, and export rules.\n\nAsk the model for release posture, gate status, open blockers, escalation list, allowed views, and what cannot be approved.`}
            expected="Summarize readiness without hiding blockers; refuse audit export, override requests, or close-ready approval while required queues and evidence gaps remain unresolved."
          />
        </div>
      </section>
    </>
  );
}
