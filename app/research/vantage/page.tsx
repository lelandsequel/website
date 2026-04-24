import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VANTAGE — Multi-Engine Diagnostic Suite",
  description:
    "VANTAGE is a capability demonstration, not a benchmark. Multi-engine diagnostic across the full COSMIC stack.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  sectionTitle: { fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.875rem" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  divider: { border: "none", borderTop: "1px solid var(--bg-border)", margin: "3rem 0" },
};

export default function VantagePage() {
  return (
    <article style={{ padding: "5rem 0 6rem" }}>
      <div style={S.container}>
        <div style={{ marginBottom: "3rem" }}>
          <Link href="/research" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2rem" }}>← Research</Link>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <span style={S.label}>VANTAGE · Capability Demo</span>
            <span style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", border: "1px solid var(--accent-border)", padding: "0.125rem 0.5rem", fontFamily: "var(--font-geist-mono), monospace" }}>
              NOT A BENCHMARK
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "0.75rem" }}>VANTAGE</h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            A structured diagnostic suite demonstrating COSMIC capability coverage across heterogeneous task types.
            VANTAGE produces per-engine readouts and failure-class taxonomy. It is not a benchmark — no sealed
            ground truth, no baseline comparison, no reproducibility claim.
          </p>
        </div>

        <div style={{ border: "1px solid var(--accent-border)", borderLeft: "2px solid var(--accent)", padding: "1.25rem 1.5rem", backgroundColor: "var(--accent-dim)", marginBottom: "3rem" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: "var(--accent)" }}>Why this is here:</strong> VANTAGE runs CITADEL-class
            diagnostic workloads across the full COSMIC engine stack. It was used to identify the three
            failure classes (A, B, C) documented in CITADEL's checkpoint arc. We publish the diagnostic
            framework because the failure taxonomy and confidence attribution chains are methodology artifacts —
            they demonstrate how the pipeline analyzes its own outputs, not a claim about external accuracy.
          </p>
        </div>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>What VANTAGE does</h2>
          <p style={S.p}>
            VANTAGE runs a target task — a corpus reconstruction, document extraction, or classification
            problem — through the full COSMIC engine stack and produces a structured diagnostic readout.
            The readout includes per-engine confidence bands, failure-class attribution (what went wrong
            and why), and a ranked list of fixable vs. structural issues.
          </p>
          <p style={S.p}>
            In the CITADEL context, VANTAGE produced the Checkpoint E failure class analysis that
            directly informed Checkpoints E.1 and E.2. It identified three root-cause classes
            (normalization mismatch, silent extraction failure, abbreviated exhibits) with confidence
            estimates and file:line evidence. It wrote no fix code — diagnosis only, with a hard stop
            against speculating below 70% confidence.
          </p>
          <p style={S.p}>
            VANTAGE is an internal tool that we are making the diagnostic framework public for. The
            engine implementations that power it are proprietary.
          </p>
        </section>

        <hr style={S.divider} />

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Engines covered</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", border: "1px solid var(--bg-border)", backgroundColor: "var(--bg-border)" }}>
            {[
              { name: "NOVA", desc: "Initial evidence retrieval and claim decomposition" },
              { name: "ECLIPSE", desc: "Adversarial challenge generation" },
              { name: "PULSAR", desc: "Evidence aggregation and conflict resolution" },
              { name: "LUNA", desc: "SHA-chained audit log, tamper-evident per-run" },
              { name: "AURORA", desc: "Confidence gate; emits refusal below threshold" },
              { name: "HEIMDALL", desc: "Tier gating; capability access control" },
              { name: "DOLOS", desc: "Normalization and entity disambiguation" },
            ].map((e) => (
              <div key={e.name} style={{ backgroundColor: "var(--bg-card)", padding: "1.25rem" }}>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", marginBottom: "0.375rem" }}>{e.name}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{e.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ ...S.p, fontSize: "0.8125rem", marginTop: "1rem" }}>
            Engine implementations are proprietary. The VANTAGE diagnostic framework ships without
            engine source code. To run full diagnostics, request an evaluation API key.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>What is and is not claimed</h2>
          <div style={{ borderLeft: "2px solid var(--bg-border)", paddingLeft: "1.5rem" }}>
            <p style={S.p}><strong style={{ color: "var(--text-primary)" }}>Is claimed:</strong> VANTAGE correctly identified CITADEL failure classes A, B, C with stated confidence levels (95%, 88%, 80%). The E.1 and E.2 fixes were implemented from VANTAGE's diagnosis and produced the documented F1 improvements.</p>
            <p style={{ ...S.p, marginBottom: 0 }}><strong style={{ color: "var(--text-primary)" }}>Is not claimed:</strong> VANTAGE is not a benchmark. There is no held-out ground truth for the diagnostic task itself. No external validation of diagnostic accuracy has been performed.</p>
          </div>
        </section>

        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--bg-border)", display: "flex", gap: "1.5rem" }}>
          <a href="https://github.com/jourdanlabs/benchmarks/tree/main/vantage" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>GitHub →</a>
          <a href="mailto:leland@jourdanlabs.com?subject=COSMIC Evaluation API Key — VANTAGE" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Request evaluation API →</a>
        </div>
      </div>
    </article>
  );
}
