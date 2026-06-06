import type { Metadata } from "next";
import Link from "next/link";

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
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <span style={S.label}>ALCHEMIST</span>
          <h1
            style={{
              fontSize: "clamp(2.75rem, 8vw, 6rem)",
              fontWeight: 950,
              letterSpacing: "-0.06em",
              lineHeight: 0.92,
              color: "var(--text-primary)",
              maxWidth: 980,
              marginBottom: "1rem",
            }}
          >
            Deterministic finance workflows.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 790 }}>
            ALCHEMIST is the JourdanLabs finance suite. It has two lanes:
            banking models for valuation and transaction work, and accounting
            workflows for close, proof, and workpaper release.
          </p>
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
