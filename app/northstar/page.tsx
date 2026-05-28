import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NORTHSTAR - COSMIC Bookkeeping",
  description:
    "NORTHSTAR Lite is the JourdanLabs small-business bookkeeping app: ledger, bank match queue, tax-prep packet, owner alerts, charity giving, accountant export, and COSMIC refusal rules.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1120, margin: "0 auto", padding: "0 2rem" },
  label: {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.6875rem",
    fontWeight: 900,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "var(--accent)",
    display: "block",
  },
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 },
};

const modules = [
  ["Ledger", "Simple double-entry books with account mapping and receipt hashes."],
  ["Bank", "Match imported bank activity before the month can release."],
  ["Tax Prep", "Schedule C-style category rollup, 1099/W-9 watchlist, and evidence blockers."],
  ["Owner Sentinel", "Owner-only anomaly queue when a separate accountant or bookkeeper touches the books."],
  ["NORTHSTAR Gives", "$1/month and $2.50 reinstall donations routed to the customer-selected charity."],
  ["Close", "COSMIC gate refuses release when bank, ledger, or tax-prep evidence does not tie."],
  ["Packet", "JSON accountant packet with trial balance, entries, bank queue, tax packet, and refusal log."],
  ["Local-first", "Browser storage today; desktop and paid download packaging next."],
];

const boundaries = [
  "NORTHSTAR organizes tax evidence; it does not file returns.",
  "NORTHSTAR exports a preparer packet; it does not give legal or tax opinions.",
  "NORTHSTAR refuses missing receipts, vague meal deductions, unknown entity type, and unmatched bank activity.",
  "NORTHSTAR is the small-business doorway; ALCHEMIST remains the enterprise finance and accounting OS.",
];

const sentinelSignals = [
  "1099 vendor paid above threshold with no W-9.",
  "Accountant-entered expense lacks receipt or source support.",
  "Large non-owner entry lacks owner approval.",
  "Round-dollar payment has no evidence attached.",
  "Unmatched bank withdrawals require owner review.",
  "Owner alert route is missing before outside-bookkeeper access.",
];

export default function NorthstarPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)", borderTop: "2px solid var(--accent)" }}>
        <div style={S.container}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(280px, 0.95fr)", gap: "2rem", alignItems: "end" }}>
            <div>
              <span style={{ ...S.label, marginBottom: "1rem" }}>NORTHSTAR Lite</span>
              <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 5.6rem)", fontWeight: 950, letterSpacing: "-0.075em", lineHeight: 0.9, color: "var(--text-primary)", margin: "0 0 1.25rem" }}>
                COSMIC QuickBooks for one dollar.
              </h1>
              <p style={{ fontSize: "1.08rem", color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: 680 }}>
                QuickBooks helps you enter numbers. NORTHSTAR refuses to release books
                that do not tie. Small-business bookkeeping, tax-prep packets,
                owner-only alerts, accountant exports, and deterministic guardrails from JourdanLabs.
              </p>
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--bg-border)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
              <span style={{ ...S.label, marginBottom: "0.75rem" }}>Current build</span>
              <h2 style={{ margin: "0 0 0.75rem", color: "var(--text-primary)", fontSize: "1.45rem", letterSpacing: "-0.035em" }}>
                $9.99 purchase. $1.99/month.
              </h2>
              <p style={{ ...S.p, fontSize: "0.92rem", marginBottom: "1.25rem" }}>
                Every active subscriber routes $1/month to one of four customer-selected
                charities. If a subscription lapses, reinstall is $5, with $2.50 routed
                to the selected charity too.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                <a href="/northstar-app/" target="_blank" rel="noreferrer" style={primaryButton}>
                  Open NORTHSTAR
                </a>
                <a href="mailto:leland@jourdanlabs.com?subject=NORTHSTAR%20Lite" style={secondaryButton}>
                  Get the $1 build
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={{ ...S.label, marginBottom: "1rem" }}>What ships</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
            {modules.map(([name, copy]) => (
              <div key={name} style={{ background: "var(--bg-card)", padding: "1.35rem" }}>
                <h3 style={{ margin: "0 0 0.7rem", color: "var(--text-primary)", fontSize: "1.05rem" }}>{name}</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, fontSize: "0.875rem", margin: 0 }}>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={{ ...S.label, marginBottom: "1rem" }}>NORTHSTAR Gives</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1px", background: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
            {[
              ["Purchase", "$9.99"],
              ["Monthly", "$1.99"],
              ["Monthly donation", "$1.00"],
              ["Reinstall after lapse", "$5.00"],
              ["Reinstall donation", "$2.50"],
            ].map(([label, value]) => (
              <div key={label} style={{ background: "var(--bg-card)", padding: "1.25rem" }}>
                <span style={{ ...S.label, color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>{label}</span>
                <strong style={{ display: "block", fontSize: "1.8rem", letterSpacing: "-0.055em", color: "var(--text-primary)" }}>{value}</strong>
              </div>
            ))}
          </div>
          <p style={{ ...S.p, fontSize: "0.82rem", marginTop: "1rem" }}>
            Donations are made by JourdanLabs to eligible selected charities. Final public launch will
            include named charities, consent, receipts, timing, and any required giving disclosures.
          </p>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={{ ...S.label, marginBottom: "1rem" }}>Tax boundary</span>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)", gap: "2rem", alignItems: "start" }}>
            <div>
              <h2 style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)", letterSpacing: "-0.055em", lineHeight: 1, margin: "0 0 1rem", color: "var(--text-primary)" }}>
                Tax-ready without playing CPA.
              </h2>
              <p style={{ ...S.p }}>
                NORTHSTAR Lite adds tax preparation where it belongs: evidence,
                categorization, W-9/1099 readiness, packet export, and refusal
                rules. It does not pretend to be a filing service or tax lawyer.
              </p>
            </div>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {boundaries.map((item) => (
                <div key={item} style={{ background: "var(--bg-card)", border: "1px solid var(--bg-border)", padding: "1rem" }}>
                  <p style={{ ...S.p, fontSize: "0.9rem" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={{ ...S.label, marginBottom: "1rem" }}>Owner Sentinel</span>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)", gap: "2rem", alignItems: "start" }}>
            <div>
              <h2 style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)", letterSpacing: "-0.055em", lineHeight: 1, margin: "0 0 1rem", color: "var(--text-primary)" }}>
                Quiet owner alerts when the books smell wrong.
              </h2>
              <p style={{ ...S.p }}>
                If the owner and accountant are different people, NORTHSTAR keeps an
                owner-only signal queue. It does not accuse. It produces evidence,
                hashes the signal, and tells the owner exactly what to verify.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", background: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
              {sentinelSignals.map((signal) => (
                <div key={signal} style={{ background: "var(--bg-card)", padding: "1rem" }}>
                  <p style={{ ...S.p, fontSize: "0.86rem" }}>{signal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={{ ...S.container, display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "2rem", alignItems: "center" }}>
          <div>
            <span style={{ ...S.label, marginBottom: "1rem" }}>Product ladder</span>
            <p style={{ ...S.p, maxWidth: 720 }}>
              NORTHSTAR is the small-business doorway. ALCHEMIST is the enterprise
              system. Same refusal discipline, different weight class.
            </p>
          </div>
          <Link href="/alchemist" style={secondaryButton}>
            Open ALCHEMIST
          </Link>
        </div>
      </section>
    </>
  );
}

const primaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 1rem",
  background: "var(--accent)",
  border: "1px solid var(--accent)",
  color: "#0E0F13",
  fontWeight: 900,
  fontSize: "0.85rem",
  textDecoration: "none",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 1rem",
  background: "var(--bg-card)",
  border: "1px solid var(--bg-border)",
  color: "var(--text-primary)",
  fontWeight: 900,
  fontSize: "0.85rem",
  textDecoration: "none",
};
