import type { Metadata } from "next";
import Link from "next/link";
import BackLink from "@/components/BackLink";
import { BringYourOwnPacketChallenge, CopyableDemoPacket } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "ALCHEMIST Accounting - LedgerProof",
  description:
    "ALCHEMIST Accounting is the LedgerProof suite: close, reconciliation, journal, flux, binder, policy, and control-room workpapers with receipts.",
};

const modules = [
  {
    name: "LEDGERPROOF",
    label: "Close Sentinel",
    href: "/alchemist/ledgerproof",
    text: "Month-end close packets with proof ledgers, blocker certificates, and refusal when numbers do not tie.",
  },
  {
    name: "RECON FORGE",
    label: "Reconciliations",
    href: "/alchemist/ledgerproof/recon",
    text: "Bank, AP, AR, payroll, inventory, and intercompany tie-outs that name the break instead of smoothing it over.",
  },
  {
    name: "JOURNAL GATE",
    label: "JE preflight",
    href: "/alchemist/ledgerproof/journal",
    text: "Journal entry proof checks for unbalanced, unsupported, duplicate, late, or policy-conflicting postings.",
  },
  {
    name: "FLUX INQUEST",
    label: "Variance proof",
    href: "/alchemist/ledgerproof/flux",
    text: "Flux explanations that must tie to volume, price, mix, customer, timing, or source-backed evidence.",
  },
  {
    name: "BINDERPROOF",
    label: "Audit prep",
    href: "/alchemist/ledgerproof/binder",
    text: "Close binders with evidence indexes, reviewer notes, immutable proof ledgers, and blocker certificates.",
  },
  {
    name: "POLICY MIRROR",
    label: "Policy checks",
    href: "/alchemist/ledgerproof/policy",
    text: "Accounting-policy checks for revenue, capitalization, depreciation, accruals, reserves, inventory, and leases.",
  },
  {
    name: "CONTROLROOM",
    label: "Close dashboard",
    href: "/alchemist/ledgerproof/control",
    text: "Close status, proof gaps, stale support, reviewer queues, recovery actions, and audit-hashed event trails.",
  },
];

const packetChecks = [
  ["Broken close", "ABSTAIN", "5 blockers found before the packet leaves the building"],
  ["Cash recon", "UNSUPPORTED", "$4,812.17 unexplained difference"],
  ["Revenue flux", "REFUSED", "Vague 'strong demand' explanation lacks support"],
  ["Journal batch", "BLOCKED", "Unbalanced credits and reused invoice evidence"],
];

const prompts = [
  "Can this close binder be sent to auditors? Return release decision, blockers, and missing proof.",
  "Revenue increased 38% month over month. Management says 'strong demand.' Is this flux explanation release-ready?",
  "The bank reconciliation ties if you ignore three outstanding checks older than 180 days. Is it close-ready?",
];

const accountingPackets = [
  {
    label: "Close binder packet",
    title: "Send to auditors?",
    packet: `Task: Decide whether this close binder can be sent to auditors. Return release decision, blockers, and missing proof.

Packet:
- Cash is off by $4,812.17 between bank statement and GL.
- AP aging support is missing for vendors over $50k.
- Revenue flux support says "strong demand" with no customer, price, volume, or timing bridge.
- Preparer asks to mark the binder complete so the audit request list can move forward.

Required posture: refuse release until blocker certificates are cleared.`,
    note: "The client moment is the refusal: no source, no number, no pass.",
  },
  {
    label: "Journal packet",
    title: "Approve the batch?",
    packet: `Task: Decide whether this journal batch can post. Return release decision, blockers, and missing proof.

Packet:
- JE-1047 debits expense for $91,200 and credits accrued liabilities for $88,700.
- JE-1047 and JE-0992 use the same invoice image as support.
- The preparer says the difference is "rounding and timing."
- No policy citation is attached for the late entry.

Required posture: block posting unless the batch balances and support is unique, current, and policy-backed.`,
    note: "A fluent explanation still fails if it lets an unsupported entry through.",
  },
];

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
};

export default function AccountingPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist" label="Back to ALCHEMIST" />
          <span style={S.label}>ALCHEMIST · ACCOUNTING</span>
          <h1
            style={{
              fontSize: "clamp(2.75rem, 8vw, 6rem)",
              fontWeight: 950,
              letterSpacing: "-0.06em",
              lineHeight: 0.92,
              color: "var(--text-primary)",
              maxWidth: 960,
              marginBottom: "1rem",
            }}
          >
            Workpapers that refuse unsupported numbers.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 850 }}>
            LedgerProof is the accounting side of ALCHEMIST. It turns close
            packets, reconciliations, journals, variance explanations, binders,
            policy checks, and reviewer queues into deterministic evidence chains.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#accounting-demo-packets">
              Copy a test packet
            </a>
            <a className="secondary-button purple" href="#accounting-benchmark">
              Check an LLM answer
            </a>
          </div>
        </div>
      </section>

      <section id="accounting-demo-packets" style={{ padding: "1rem 0 4.5rem" }}>
        <div style={S.container}>
          <div className="ledgerproof-benchmark">
            <div>
              <span style={S.label}>Operating posture</span>
              <h2>Try the packet against an LLM. The release decision is the benchmark.</h2>
              <p>
                Each module runs the same release discipline: ALCHEMIST
                can organize, compute, and explain the workpaper, but it refuses
                the output when source support breaks.
              </p>
            </div>
            <div className="benchmark-card-grid">
              {packetChecks.map(([name, status, detail]) => (
                <div className="benchmark-card" key={name}>
                  <span>{status}</span>
                  <strong>{name}</strong>
                  <p>{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="demo-packet-grid">
            {accountingPackets.map((packet) => (
              <CopyableDemoPacket key={packet.title} {...packet} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <div className="alchemist-model-grid">
            {modules.map((module) => (
              <Link href={module.href} key={module.name} className="alchemist-model-card">
                <span>{module.label}</span>
                <strong>{module.name}</strong>
                <p>{module.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="accounting-benchmark" style={{ padding: "0 0 6rem" }}>
        <div style={S.container} className="ledgerproof-benchmark">
          <div>
            <span style={S.label}>LLM tests</span>
            <h2>Make the model decide whether the packet can leave.</h2>
            <p>
              The accounting benchmark is not eloquence. It is false approval rate.
              A fluent LLM answer loses if it sends a broken close, journal, recon,
              or variance explanation forward.
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
          <BringYourOwnPacketChallenge
            title="Bring your own close packet."
            packetPlaceholder={`Paste a sanitized close binder, recon packet, journal batch, flux explanation, policy exception, or controller dashboard excerpt here.\n\nAsk the LLM: Can this accounting packet leave the building? Return release decision, blockers, missing proof, and recovery actions.`}
            expected="Refuse release unless balances tie, support is current and unique, policy conflicts are resolved, and reviewer-owned judgments stay human-owned."
          />
        </div>
      </section>
    </>
  );
}
