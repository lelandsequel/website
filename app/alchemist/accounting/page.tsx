import type { Metadata } from "next";
import Link from "next/link";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = {
  title: "ALCHEMIST Accounting - LedgerProof Workflows",
  description:
    "ALCHEMIST Accounting contains seven LedgerProof workflows: Close Sentinel, Recon Forge, Journal Gate, Flux Inquest, BinderProof, Policy Mirror, and ControlRoom.",
};

const modules = [
  {
    name: "LEDGERPROOF",
    label: "Close Sentinel",
    href: "/alchemist/ledgerproof",
    text: "Month-end close workflow with proof ledgers, blocker certificates, and release refusal when numbers do not tie.",
  },
  {
    name: "RECON FORGE",
    label: "Reconciliations",
    href: "/alchemist/ledgerproof/recon",
    text: "Bank, AP, AR, payroll, inventory, and intercompany tie-outs that name breaks instead of smoothing them over.",
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
    text: "Close binder workflow with evidence indexes, reviewer notes, immutable proof ledgers, and blocker certificates.",
  },
  {
    name: "POLICY MIRROR",
    label: "Policy checks",
    href: "/alchemist/ledgerproof/policy",
    text: "Accounting-policy workflow for revenue, capitalization, depreciation, accruals, reserves, inventory, and leases.",
  },
  {
    name: "CONTROLROOM",
    label: "Close dashboard",
    href: "/alchemist/ledgerproof/control",
    text: "Operator dashboard for proof gaps, stale support, reviewer queues, recovery actions, and audit-hashed event trails.",
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
            Seven accounting workflows for close, reconciliation, journals,
            variance explanations, binders, policy checks, and controller review.
            Each page opens a working LedgerProof surface.
          </p>
        </div>
      </section>

      <section style={{ padding: "1rem 0 6rem" }}>
        <div style={S.container}>
          <div className="alchemist-model-grid">
            {modules.map((module) => (
              <Link href={module.href} key={module.name} className="alchemist-model-card">
                <span>{module.label}</span>
                <strong>{module.name}</strong>
                <p>{module.text}</p>
                <em>Open workflow</em>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
