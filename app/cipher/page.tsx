import type { Metadata } from "next";
import BackLink from "@/components/BackLink";

export const metadata: Metadata = {
  title: "CIPHER - Deterministic DCF",
  description:
    "CIPHER turns valuation assumptions into reproducible DCF outputs with visible audit trails.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1180, margin: "0 auto", padding: "0 1.25rem" },
  label: {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--accent)",
    marginBottom: "1rem",
    display: "block",
  },
  p: { color: "var(--text-secondary)", lineHeight: 1.75 },
};

export default function CipherPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <BackLink href="/alchemist/banking" label="Back to Banking" />
          <span style={S.label}>CIPHER</span>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              fontWeight: 950,
              letterSpacing: "-0.055em",
              lineHeight: 0.95,
              color: "var(--text-primary)",
              maxWidth: 780,
              marginBottom: "1rem",
            }}
          >
            Deterministic DCF engine.
          </h1>
          <p style={{ ...S.p, fontSize: "1.05rem", maxWidth: 760 }}>
            A discounted cash flow model estimates what a company is worth by projecting future cash
            flows and discounting them back to today. CIPHER makes those assumptions explicit,
            recalculable, and inspectable instead of letting a black-box chat response invent a number.
            This page embeds the deployed CIPHER finance engine inside ALCHEMIST Banking; it is
            intentionally separate from the generic `/api/alchemist/run` packet runners.
          </p>
          <a
            href="https://cipher-demo-ashy.vercel.app/cipher"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              marginTop: "1rem",
              color: "var(--accent)",
              fontWeight: 850,
              fontSize: "0.9rem",
            }}
          >
            Open full-screen fallback -&gt;
          </a>
        </div>
      </section>

      <section style={{ padding: "0 0 5.5rem" }}>
        <div style={S.container}>
          <div
            style={{
              minHeight: "72vh",
              border: "1px solid var(--bg-border)",
              borderRadius: 24,
              overflow: "hidden",
              background: "var(--bg-card)",
              boxShadow: "var(--soft-shadow)",
            }}
          >
            <iframe
              title="CIPHER deterministic DCF workbench"
              src="https://cipher-demo-ashy.vercel.app/cipher"
              style={{ width: "100%", minHeight: "72vh", border: 0, display: "block" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
