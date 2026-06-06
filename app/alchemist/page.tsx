import type { Metadata } from "next";
import Link from "next/link";
import CipherFinanceRunner from "@/components/CipherFinanceRunner";

export const metadata: Metadata = {
  title: "ALCHEMIST - Banking and Accounting Workflows",
  description:
    "ALCHEMIST is the JourdanLabs deterministic finance suite: banking models and accounting workflows with source-backed computation and refusal boundaries.",
};

const paths = [
  {
    name: "BANKING",
    href: "/alchemist/banking",
    label: "Valuation and transaction models",
    text: "DCF, COMPS, credit, merger, LBO, SOTP, scenarios, and benchmark workflows built to compute only from visible assumptions.",
    count: "8 workflows",
  },
  {
    name: "ACCOUNTING",
    href: "/alchemist/accounting",
    label: "Close and workpaper controls",
    text: "Close, recon, journal, flux, binder, policy, and control-room workflows built to refuse unsupported accounting packets.",
    count: "7 workflows",
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

export default function AlchemistPage() {
  return (
    <>
      <section style={{ padding: "3.25rem 0 1rem" }}>
        <div style={S.container}>
          <span style={S.label}>ALCHEMIST</span>
          <h1
            style={{
              fontSize: "clamp(2.65rem, 7vw, 5.4rem)",
              fontWeight: 950,
              letterSpacing: "-0.06em",
              lineHeight: 0.92,
              color: "var(--text-primary)",
              maxWidth: 980,
              marginBottom: "0.9rem",
            }}
          >
            Type a ticker. Run CIPHER.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 790 }}>
            The fastest path is right here: enter any public ticker and CIPHER
            runs the deterministic DCF workflow with source receipts. Banking
            and accounting suites are below when you want the full system.
          </p>
          <div className="alchemist-hero-actions" aria-label="ALCHEMIST quick actions">
            <Link href="/alchemist/cipher?ticker=NVDA">Open CIPHER</Link>
            <Link href="/alchemist/comps?ticker=NVDA">Open COMPS</Link>
            <Link href="/alchemist/banking">All banking models</Link>
            <Link href="/alchemist/accounting">Accounting suite</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 2rem" }}>
        <div style={S.container}>
          <CipherFinanceRunner mode="dcf" initialTicker="NVDA" />
        </div>
      </section>

      <section style={{ padding: "1rem 0 6rem" }}>
        <div style={S.container}>
          <div className="alchemist-path-grid">
            {paths.map((path) => (
              <Link href={path.href} key={path.name} className="alchemist-path-card">
                <span>{path.label}</span>
                <strong>{path.name}</strong>
                <p>{path.text}</p>
                <em>{path.count} · Open suite</em>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
