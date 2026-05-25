import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CRUCIBLE — Research & Validation",
  description:
    "CRUCIBLE is the JourdanLabs research division: open benchmarks, VANTAGE diagnostics, and the COSMIC methodology.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
};

const SECTIONS = [
  {
    name: "VANTAGE",
    tag: "Flagship",
    description: "Multi-engine capability diagnostic with per-division scan receipts. Products validating products.",
    detail: "Sealed corpus · BCa CI · Honest refusal rates",
    href: "/crucible/vantage",
    accent: "var(--accent)",
  },
  {
    name: "Benchmark Program",
    tag: "6 benchmarks",
    description: "Six sealed benchmarks spanning pharmacovigilance, corporate hierarchy, SOC triage, factual verification, semantic search, and reading calibration.",
    detail: "Open corpora · Honest baselines · Reproducible",
    href: "/crucible/benchmarks",
    accent: "var(--accent)",
  },
  {
    name: "Methodology",
    tag: "7 principles",
    description: "The JourdanLabs playbook: sealed corpora, honest baselines, per-fix attribution, deterministic at runtime, LUNA audit trails.",
    detail: "Non-negotiable · Applies to all benchmarks",
    href: "/crucible/methodology",
    accent: "var(--accent)",
  },
  {
    name: "Reproducibility",
    tag: "Public",
    description: "Step-by-step instructions for re-running any benchmark. Corpus SHA verification. Scoring harness documentation.",
    detail: "No special access · Engine API for full results",
    href: "/crucible/reproducibility",
    accent: "var(--accent)",
  },
  {
    name: "RAVEN",
    tag: "Coming",
    description: "RAVEN is a next-generation research initiative. Details to follow.",
    detail: "—",
    href: "/crucible/raven",
    accent: "var(--text-tertiary)",
  },
];

export default function CruciblePage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <div style={{ maxWidth: 680 }}>
            <span style={{ ...S.label, marginBottom: "1rem" }}>CRUCIBLE</span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              Open research and validation infrastructure.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
              CRUCIBLE is the JourdanLabs research division. It runs the benchmark program,
              maintains the COSMIC methodology playbook, and operates VANTAGE — the diagnostic
              suite that validates the other four divisions.
            </p>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>What's in CRUCIBLE</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1px", backgroundColor: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
            {SECTIONS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1.75rem",
                  backgroundColor: "var(--bg-card)",
                  borderTop: `2px solid ${item.accent}`,
                  textDecoration: "none",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: item.accent }}>{item.name}</div>
                  <span style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", border: "1px solid var(--bg-border)", padding: "0.125rem 0.5rem", fontFamily: "var(--font-geist-mono), monospace" }}>{item.tag}</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{item.description}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", margin: 0 }}>{item.detail}</p>
                <div style={{ fontSize: "0.8125rem", color: item.accent, marginTop: "auto", paddingTop: "0.5rem" }}>
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={S.label}>Why open research?</span>
          <p style={S.p}>
            CRUCIBLE benchmarks are public because the claim that COSMIC outperforms baselines in regulated
            domains is only credible if it can be verified. Engine implementations are proprietary — the corpus,
            scoring harnesses, and baseline code are not. Anyone can run the baselines. Anyone can verify the
            corpus SHA. Anyone can point their own pipeline at our scoring harness and compare.
          </p>
          <p style={{ ...S.p, marginBottom: "2rem" }}>
            This is how SuperGLUE, HELM, and other credible benchmark programs operate. We follow the same model.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <a href="https://github.com/jourdanlabs/benchmarks" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
              github.com/jourdanlabs/benchmarks →
            </a>
            <Link href="/crucible/methodology" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Read the methodology →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
