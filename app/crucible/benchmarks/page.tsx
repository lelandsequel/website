import type { Metadata } from "next";
import Link from "next/link";
import BenchmarkGrid from "@/components/BenchmarkGrid";

export const metadata: Metadata = {
  title: "Benchmark Program — CRUCIBLE",
  description:
    "Sealed benchmarks across pharmacovigilance, corporate hierarchy, SOC triage, factual verification, semantic search, reading-level calibration, and memory validation (RAVEN v1.1).",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
};

const BENCHMARKS_DETAIL = [
  { name: "SIGNAL", domain: "Pharmacovigilance", task: "Adverse drug event extraction from clinical narratives", headline: "F1 0.639", sub: "24.3mo median detection window", href: "/crucible/benchmarks/signal", sealed: true },
  { name: "CITADEL", domain: "Financial compliance", task: "Corporate subsidiary hierarchy reconstruction from SEC Exhibit 21", headline: "F1 0.616", sub: "400-entity corpus · Checkpoint E.2", href: "/crucible/benchmarks/citadel", sealed: true },
  { name: "SENTINEL", domain: "Security operations", task: "SOC alert triage with HEIMDALL confidence gate", headline: "94.0%", sub: "held-out accuracy", href: "/crucible/benchmarks/sentinel", sealed: true },
  { name: "ORACLE", domain: "Factual verification", task: "Claim verification with honest refusal against sealed KB", headline: "51%", sub: "vs 31% / 25% always-confident baselines", href: "/crucible/benchmarks/oracle", sealed: true },
  { name: "LENS", domain: "Semantic search", task: "Intent-based retrieval for dense technical corpora", headline: "25×", sub: "vs grep on intent queries", href: "/crucible/benchmarks/lens", sealed: true },
  { name: "COMPASS", domain: "Document calibration", task: "Reading-level tier assignment for technical documents", headline: "15/15", sub: "within-1-tier · research-paper category", href: "/crucible/benchmarks/compass", sealed: true },
  { name: "MUNINN v2", domain: "Memory validation", task: "Contradiction reconciliation — pick the surviving claim across four bases", headline: "100%", sub: "25 reconciliable pairs · RAVEN v1.1 capability 1.1", href: "/crucible/benchmarks/muninn-v2-reconciliation", sealed: true },
  { name: "DECAY", domain: "Memory validation", task: "Per-class memory decay — right curve for the right kind of memory", headline: "100%", sub: "310 queries · 5 classes × 6 horizons · RAVEN v1.1 capability 1.2", href: "/crucible/benchmarks/decay", sealed: true },
  { name: "REFUSAL", domain: "Memory validation", task: "Structured refusal — refuse for the right reason, with action and audit hash", headline: "100%", sub: "200 queries · 5 typed reasons · RAVEN v1.1 capability 1.3", href: "/crucible/benchmarks/refusal", sealed: true },
];

export default function BenchmarksIndexPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <Link href="/crucible" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>← CRUCIBLE</Link>
            </div>
            <span style={{ ...S.label, marginBottom: "1rem" }}>CRUCIBLE / Benchmark Program</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              Sealed benchmarks. Publicly reproducible.
            </h1>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              Every result ships with a sealed corpus (SHA-verified), honest baselines against real tools,
              per-fix attribution, self-assessed limitations, and step-by-step reproduction instructions.
              Engine implementations are proprietary. Results are not.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "4rem 0", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <span style={S.label}>At a glance</span>
          <BenchmarkGrid />
        </div>
      </section>

      <section style={{ padding: "4rem 0" }}>
        <div style={S.container}>
          <span style={S.label}>All benchmarks</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", backgroundColor: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
            {BENCHMARKS_DETAIL.map((b) => (
              <Link
                key={b.name}
                href={b.href}
                style={{
                  display: "grid",
                  gridTemplateColumns: "7rem 1fr auto",
                  gap: "2rem",
                  padding: "1.5rem",
                  backgroundColor: "var(--bg-card)",
                  textDecoration: "none",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", marginBottom: "0.25rem" }}>{b.name}</div>
                  <div style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{b.domain}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>{b.task}</div>
                  <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{b.sub}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{b.headline}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: "0.25rem" }}>View →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
