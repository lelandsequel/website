import type { Metadata } from "next";
import Link from "next/link";
import BenchmarkGrid from "@/components/BenchmarkGrid";
import PortfolioCard from "@/components/PortfolioCard";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Seven benchmarks. One architecture. COSMIC at the core. Sealed corpora, honest baselines, publicly reproducible results.",
};

const S: Record<string, React.CSSProperties> = {
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.6875rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--text-tertiary)",
    marginBottom: "1.5rem",
    display: "block",
  },
};

const benchmarkDetails = [
  {
    name: "SIGNAL",
    number: "F1 0.639",
    label: "24.3mo median · pharmacovigilance",
    confidence: "High",
    corpusSize: "Multi-year FAERS corpus",
    baselineDelta: "+0.089 vs best baseline",
    href: "/research/signal",
  },
  {
    name: "CITADEL",
    number: "F1 0.616",
    label: "400/660 coverage · corporate hierarchy",
    confidence: "High",
    corpusSize: "400 entities · 66,639 GT relationships",
    baselineDelta: "Micro F1 0.6161 (Checkpoint E.2)",
    href: "/research/citadel",
  },
  {
    name: "SENTINEL",
    number: "94.0%",
    label: "held-out accuracy · SOC triage",
    confidence: "High",
    corpusSize: "Held-out test set",
    baselineDelta: "210/210 unit tests green",
    href: "/research/sentinel",
  },
  {
    name: "ORACLE",
    number: "51%",
    label: "factual verification · honest refusal",
    confidence: "Medium (v0.1 baseline)",
    corpusSize: "200 claims · 5 domains",
    baselineDelta: "+20pp vs CONFIDENT_ALWAYS (31%)",
    href: "/research/oracle",
  },
  {
    name: "LENS",
    number: "25×",
    label: "intent search · beats grep",
    confidence: "Medium (v0.3/v0.4)",
    corpusSize: "Dense technical corpora",
    baselineDelta: "P@5 outperforms grep/ripgrep by 25×",
    href: "/research/lens",
  },
  {
    name: "COMPASS",
    number: "15/15",
    label: "within-1-tier · reading level",
    confidence: "High (research-paper category)",
    corpusSize: "Research paper evaluation set",
    baselineDelta: "100% within-1-tier on hardest category",
    href: "/research/compass",
  },
];

export default function ResearchIndex() {
  return (
    <>
      {/* HERO */}
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <span style={S.label}>Research Program</span>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "var(--text-primary)",
              maxWidth: 600,
              marginBottom: "1.25rem",
            }}
          >
            Seven benchmarks. One architecture. COSMIC at the core.
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: 540, lineHeight: 1.75, marginBottom: "3rem" }}>
            Every result below is drawn from sealed CHECKPOINT files with SHA-verified corpora.
            Numbers are honest. Limitations are documented. Engines are proprietary; results are public.
          </p>
          <BenchmarkGrid />
        </div>
      </section>

      {/* DETAILED CARDS */}
      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>Benchmark Details</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1px",
              backgroundColor: "var(--bg-border)",
              border: "1px solid var(--bg-border)",
            }}
          >
            {benchmarkDetails.map((b) => (
              <div key={b.name} style={{ backgroundColor: "var(--bg-card)", padding: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {b.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.625rem",
                      fontFamily: "var(--font-geist-mono), monospace",
                      color: "var(--text-tertiary)",
                      border: "1px solid var(--bg-border)",
                      padding: "0.125rem 0.375rem",
                    }}
                  >
                    {b.confidence}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "1.875rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    marginBottom: "0.375rem",
                  }}
                >
                  {b.number}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "1.25rem" }}>
                  {b.label}
                </div>

                <div style={{ borderTop: "1px solid var(--bg-border)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                    <span style={{ color: "var(--text-tertiary)" }}>Corpus</span>
                    <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-geist-mono), monospace" }}>{b.corpusSize}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                    <span style={{ color: "var(--text-tertiary)" }}>Delta</span>
                    <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-geist-mono), monospace" }}>{b.baselineDelta}</span>
                  </div>
                </div>

                <Link href={b.href} style={{ display: "block", marginTop: "1.25rem", fontSize: "0.8125rem", color: "var(--accent)" }}>
                  Read the writeup →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VANTAGE */}
      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>Capability Study</span>
          <PortfolioCard
            name="VANTAGE"
            description="Multi-engine diagnostic suite. Not a benchmark — a structured capability studynstration. VANTAGE runs CITADEL-class diagnostic workloads across the full COSMIC engine stack, producing per-engine readouts, failure-class taxonomy, and confidence attribution chains. Used internally to validate engine behavior before benchmark publication."
            number="7 engines"
            numberLabel="diagnostic capability study"
            href="/research/vantage"
            isDemo
          />
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ padding: "4rem 0" }}>
        <div style={S.containerSm}>
          <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "1.75rem" }}>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" }}>
              All benchmark code is public on GitHub. Corpus files are SHA-sealed and CC BY 4.0 licensed.
              Engine implementations are proprietary.
            </p>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <a
                href="https://github.com/jourdanlabs/benchmarks"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.875rem", color: "var(--accent)" }}
              >
                github.com/jourdanlabs/benchmarks →
              </a>
              <a
                href="mailto:leland@jourdanlabs.com?subject=COSMIC Evaluation API Key Request"
                style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
              >
                Request an evaluation API key →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
