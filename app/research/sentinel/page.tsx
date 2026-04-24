import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SENTINEL — SOC Alert Triage",
  description:
    "Deterministic SOC alert triage classification. 94.0% held-out accuracy. No LLM at runtime.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  sectionTitle: { fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.875rem" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  divider: { border: "none", borderTop: "1px solid var(--bg-border)", margin: "3rem 0" },
};

export default function SentinelPage() {
  return (
    <article style={{ padding: "5rem 0 6rem" }}>
      <div style={S.container}>
        <div style={{ marginBottom: "3rem" }}>
          <Link href="/research" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2rem" }}>← Research</Link>
          <span style={{ ...S.label, marginBottom: "1rem" }}>SENTINEL · SOC Triage</span>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "0.75rem" }}>SENTINEL</h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Deterministic SOC alert triage with HEIMDALL confidence gate and LUNA audit chain.
          </p>
        </div>

        <div style={{ border: "1px solid var(--bg-border)", padding: "2rem", marginBottom: "3rem", backgroundColor: "var(--bg-card)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {[
              { label: "Held-out accuracy", value: "94.0%" },
              { label: "Unit tests (post-sprint)", value: "210/210" },
              { label: "Regressions", value: "0" },
            ].map((m) => (
              <div key={m.label}>
                <div style={{ ...S.label, marginBottom: "0.375rem" }}>{m.label}</div>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "1.75rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.02em" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>What it is</h2>
          <p style={S.p}>
            SENTINEL is the COSMIC pipeline applied to Security Operations Center alert triage — the
            classification of incoming security alerts as true positive, false positive, or requiring escalation.
            SOC analysts spend the majority of their time triaging alerts that turn out to be noise.
            LLM-based triage introduces hallucination risk in exactly the domain where a false negative
            (missing a real threat) has catastrophic consequences.
          </p>
          <p style={S.p}>
            SENTINEL uses a sealed decision ruleset. Every triage decision traces to a specific rule in the
            pipeline with a confidence score. The HEIMDALL gate refuses to triage alerts that fall outside
            the sealed decision boundary — escalating to a human analyst rather than guessing.
            LUNA maintains a SHA-chained audit log: every alert, every decision, every refusal is immutably
            recorded and tamper-evident.
          </p>
          <p style={S.p}>
            The overnight sprint shipped SOAR adapter stubs for 4 major vendors (Chronicle, Microsoft Sentinel,
            Splunk, Elastic) plus a feedback loop API and a full infrastructure deployment (Terraform + EKS).
            The 94.0% held-out accuracy figure is from the HEIMDALL classifier tested against a held-out
            test set sealed before sprint start.
          </p>
        </section>

        <hr style={S.divider} />

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Sprint summary</h2>
          <div style={{ border: "1px solid var(--bg-border)", overflow: "hidden" }}>
            {[
              { ws: "WS1", title: "Deployment Infrastructure", status: "Complete", detail: "Terraform + EKS + NATS JetStream + Grafana dashboards" },
              { ws: "WS2", title: "SOAR Adapters", status: "Complete (stubs)", detail: "Chronicle, MS Sentinel, Splunk, Elastic — auth gaps documented" },
              { ws: "WS3", title: "Ingest Connectors", status: "Complete (stubs)", detail: "Chronicle native ATT&CK IDs; MS Sentinel OAuth2 needs sandbox" },
              { ws: "WS4", title: "Admin API", status: "Complete", detail: "New routes wired; existing triage routes unaffected" },
              { ws: "WS5", title: "Feedback Loop", status: "Complete (v0 placeholder)", detail: "FP-rate heuristic >30% → reduce active_ratio 20%; thresholds TBD" },
            ].map((row, i) => (
              <div key={row.ws} style={{ display: "grid", gridTemplateColumns: "3rem 1fr 1fr", gap: "1rem", padding: "0.875rem 1rem", borderBottom: i < 4 ? "1px solid var(--bg-border)" : "none", alignItems: "start" }}>
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", color: "var(--accent)" }}>{row.ws}</span>
                <div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500 }}>{row.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.25rem" }}>{row.detail}</div>
                </div>
                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-geist-mono), monospace", color: "var(--text-secondary)" }}>{row.status}</span>
              </div>
            ))}
          </div>
        </section>

        <hr style={S.divider} />

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={S.sectionTitle}>Limitations</h2>
          <div style={{ borderLeft: "2px solid var(--bg-border)", paddingLeft: "1.5rem" }}>
            <p style={S.p}>
              <strong style={{ color: "var(--text-primary)" }}>SOAR auth unknowns.</strong> All four SOAR
              vendor adapters have documented gap files requiring Leland sign-off before Month 4 sandbox work.
              The adapters are functional stubs; production auth flows are vendor-specific and not yet validated.
            </p>
            <p style={S.p}>
              <strong style={{ color: "var(--text-primary)" }}>Feedback loop thresholds are v0 placeholders.</strong>{" "}
              The FP-rate heuristic ({">"} 30% → reduce active_ratio 20%) was implemented but Leland should verify
              direction and magnitude before exposing to a design partner.
            </p>
            <p style={{ ...S.p, marginBottom: 0 }}>
              <strong style={{ color: "var(--text-primary)" }}>No live deployment yet.</strong> Infrastructure
              is reviewable Terraform and Kubernetes manifests. Six design questions (KMS key type, Redis auth
              bootstrap, ECR repo creation, TimescaleDB extension, NATS chart version) must be resolved before
              first <code>terraform apply</code>.
            </p>
          </div>
        </section>

        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--bg-border)", display: "flex", gap: "1.5rem" }}>
          <a href="https://github.com/jourdanlabs/benchmarks/tree/main/sentinel" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>GitHub →</a>
          <Link href="/reproducibility" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Reproducibility guide →</Link>
        </div>
      </div>
    </article>
  );
}
