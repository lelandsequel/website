import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HEIMDALL Division — Security Operations & Compliance",
  description:
    "HEIMDALL applies COSMIC to security operations. SENTINEL is in pre-pilot with 94.0% held-out accuracy.",
};

const accent = "#4A7BA7";

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: "0 auto", padding: "0 2rem" },
  containerSm: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  section: { padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" },
};

export default function HeimdallPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)", borderTop: `2px solid ${accent}` }}>
        <div style={S.container}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <Link href="/divisions" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>← Divisions</Link>
            </div>
            <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, display: "block", marginBottom: "1rem" }}>HEIMDALL</span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
              Security operations and compliance.
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
              HEIMDALL applies the COSMIC reasoning substrate to security operations — SOC alert triage,
              compliance monitoring, and threat classification. Every decision is traceable. Every refusal
              is logged. No guessing at the security perimeter.
            </p>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>Products</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", backgroundColor: "var(--bg-border)", border: "1px solid var(--bg-border)" }}>
            {[
              {
                name: "SENTINEL",
                status: "Pre-pilot",
                description: "Deterministic SOC alert triage. SOAR adapters for Chronicle, Microsoft Sentinel, Splunk, and Elastic. 94.0% held-out accuracy. LUNA audit chain on every decision.",
                accuracy: "94.0%",
              },
            ].map((product) => (
              <div key={product.name} style={{ backgroundColor: "var(--bg-card)", padding: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 700, color: accent }}>{product.name}</span>
                  <span style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: product.status === "Pre-pilot" ? accent : "var(--text-tertiary)", border: `1px solid ${product.status === "Pre-pilot" ? accent : "var(--bg-border)"}`, padding: "0.125rem 0.5rem", fontFamily: "var(--font-geist-mono), monospace" }}>{product.status}</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>{product.description}</p>
                {product.accuracy !== "—" && (
                  <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                    Held-out accuracy: <span style={{ fontFamily: "var(--font-geist-mono), monospace", color: accent }}>{product.accuracy}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "4rem 0", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.containerSm}>
          <span style={S.label}>SENTINEL benchmark results</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", border: "1px solid var(--bg-border)", backgroundColor: "var(--bg-border)" }}>
            {[
              { label: "Held-out accuracy", value: "94.0%" },
              { label: "Unit tests passed", value: "210/210" },
              { label: "Regressions introduced", value: "0" },
            ].map((m) => (
              <div key={m.label} style={{ backgroundColor: "var(--bg-card)", padding: "1.5rem" }}>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>{m.label}</div>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "1.5rem", fontWeight: 700, color: accent, letterSpacing: "-0.02em" }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1.25rem" }}>
            <Link href="/crucible/benchmarks/sentinel" style={{ fontSize: "0.875rem", color: accent }}>
              View full SENTINEL benchmark →
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={S.label}>Why deterministic matters in security</span>
          <p style={S.p}>
            A SOC triage system that occasionally hallucinates a false negative — classifying a real threat
            as noise — is not a triage system. It is a liability. SENTINEL's HEIMDALL gate escalates
            alerts that fall outside the calibrated decision boundary to a human analyst, rather than
            guessing on novel threat patterns.
          </p>
          <p style={{ ...S.p, marginBottom: "2rem" }}>
            The LUNA audit chain means every triage decision — and every refusal — has an immutable,
            tamper-evident record. When an incident requires post-mortem, the chain of evidence is there.
          </p>
          <Link href="/applications" style={{ fontSize: "0.875rem", color: accent }}>
            Contact for pre-pilot access →
          </Link>
        </div>
      </section>
    </>
  );
}
