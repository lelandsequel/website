import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "COMPS - Deterministic Comparable Companies",
  description:
    "COMPS turns comparable company analysis into a reproducible valuation workflow with visible assumptions.",
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

export default function CompsPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <span style={S.label}>COMPS</span>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              fontWeight: 950,
              letterSpacing: "-0.055em",
              lineHeight: 0.95,
              color: "var(--text-primary)",
              maxWidth: 840,
              marginBottom: "1rem",
            }}
          >
            Comparable company analysis.
          </h1>
          <p style={{ ...S.p, fontSize: "1.05rem", maxWidth: 780 }}>
            Comps estimate value by comparing a company to similar public companies or transactions.
            The hard part is not the arithmetic - it is choosing the right peer set, normalizing the
            metrics, and preserving the assumptions. COMPS keeps that chain visible.
          </p>
          <a
            href="https://cipher-demo-ashy.vercel.app/cipher/comps"
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
              title="COMPS deterministic comparable companies demo"
              src="https://cipher-demo-ashy.vercel.app/cipher/comps"
              style={{ width: "100%", minHeight: "72vh", border: 0, display: "block" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
