import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology — The JourdanLabs Playbook",
  description:
    "The JourdanLabs methodology: refusal as a feature, sealed corpora, honest baselines, per-fix attribution, deterministic at runtime.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  sectionTitle: { fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.875rem" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  aside: { borderLeft: "1px solid var(--bg-border)", paddingLeft: "1.25rem", marginTop: "1rem" },
  asideText: { fontSize: "0.8125rem", color: "var(--text-tertiary)", lineHeight: 1.7, fontFamily: "var(--font-geist-mono), monospace" },
  divider: { border: "none", borderTop: "1px solid var(--bg-border)", margin: "3.5rem 0" },
};

const sections = [
  {
    id: "refusal",
    label: "1 / Refusal is a feature",
    title: "Refusal is a feature",
    body: [
      "The AURORA gate is the first-class output mechanism of every COSMIC pipeline. When aggregate confidence across pipeline stages falls below a configurable threshold (default: 0.70), AURORA emits a refusal — not a verdict. This is not a failure mode. It is the correct answer when the evidence is insufficient.",
      "Regulated industries require this posture. A pharmacovigilance system that guesses about drug interactions is not safer than one that says \"insufficient signal.\" A financial compliance system that emits VERIFIED on a claim it can't ground is a liability, not a feature. The AURORA gate makes honest uncertainty visible.",
      "Every benchmark published by JourdanLabs reports refusal rates alongside accuracy. A system with 95% accuracy and 60% refusal is a different beast than a system with 95% accuracy and 0% refusal. Both numbers matter.",
    ],
    aside: "Technical aside: AURORA computes a weighted confidence aggregate from NOVA, ECLIPSE, and PULSAR outputs. The weighting is task-specific and configurable. Refusal thresholds are pinned per benchmark and documented in CHECKPOINT files.",
  },
  {
    id: "sealed",
    label: "2 / Sealed corpora",
    title: "Sealed corpora",
    body: [
      "Every corpus used in a JourdanLabs benchmark is sealed with SHA-256 before any pipeline contact. The seal is documented in CHECKPOINT_RESULTS.md and verified against SEALED.json before every scoring run. Post-hoc corpus manipulation is architecturally prevented.",
      "Sealing before contact means the pipeline has no opportunity to \"see\" the test set during development. This is a stronger guarantee than train/test splits, which can still leak through hyperparameter tuning or architecture decisions. Our benchmarks treat the corpus as adversarial evidence: we don't look at it until we're committing to a score.",
      "If a corpus is updated (new data, corrected labels), it gets a new SHA and a new checkpoint version. Prior checkpoint results remain in the arc, attributed to the corpus version that produced them.",
    ],
    aside: "Technical aside: SHA-256 verification runs on every scoring invocation and is included in the LUNA audit log. If the corpus file hash does not match SEALED.json, scoring aborts before any pipeline stage executes.",
  },
  {
    id: "baselines",
    label: "3 / Honest baselines",
    title: "Honest baselines",
    body: [
      "Every JourdanLabs benchmark includes real baseline implementations — not straw men. For ORACLE, the baselines are a CONFIDENT_ALWAYS system (emits VERIFIED for every claim) and a NAIVE_KEYWORD system (keyword matching against a known-fact database). Both are working code, runnable, and documented.",
      "The baseline choice matters. A research paper that only compares against a random classifier or an empty-string system is not telling you whether your approach is good — it is telling you that it beats nothing. JourdanLabs compares against the actual tools a practitioner would reach for: grep/ripgrep for LENS, MedDRA dictionary lookup for SIGNAL, independent normalization for CITADEL.",
      "If a baseline beats our pipeline on a subtask, we document it. We are not trying to look good on every metric — we are trying to be accurate about where the pipeline works and where it does not.",
    ],
    aside: "Technical aside: All baseline implementations are published in the benchmarks repository under baselines/. They share the same scoring harness as the COSMIC pipeline so comparisons are apples-to-apples.",
  },
  {
    id: "attribution",
    label: "4 / Per-fix attribution",
    title: "Per-fix attribution",
    body: [
      "When a benchmark goes through multiple iterations — fix a bug, re-run scoring, compare to baseline — each checkpoint is documented with the specific change made, the F1 delta attributed to that change, and the evidence used to justify the fix. CITADEL's arc from Checkpoint D (F1 0.6025) through E (regression to 0.5774) through E.1 and E.2 (recovery to 0.6161) is a complete record of what happened and why.",
      "Regressions are not hidden. Checkpoint E introduced a normalization regression that dropped F1 by 0.0251. It is in the arc, documented, and visible to anyone who reads the CHECKPOINT files. We do not smooth the arc to make the trajectory look linear.",
      "This approach makes the methodology auditable. An external reviewer can trace every F1 point back to a specific code change, corpus update, or baseline comparison. The chain of evidence is public.",
    ],
    aside: "Technical aside: Each checkpoint is tagged in the repository with the corpus SHA at time of scoring, the commit hash, and the explicit delta from the prior checkpoint. CHECKPOINT_RESULTS.md is append-only by convention.",
  },
  {
    id: "deterministic",
    label: "5 / Deterministic at runtime",
    title: "Deterministic at runtime",
    body: [
      "No LLM calls at runtime. This is the core architectural commitment. Every COSMIC pipeline stage — NOVA, ECLIPSE, PULSAR, LUNA, AURORA — uses deterministic algorithms that produce identical outputs for identical inputs. There is no sampling, no temperature, no non-deterministic model inference in production.",
      "This is not a limitation. Determinism is the requirement for regulated industries. A pharmacovigilance system that produces different answers on different runs cannot be validated for regulatory submission. A financial compliance system that sometimes says REFUTED and sometimes says VERIFIED on the same claim is not a compliance system.",
      "LLMs are used during development — for corpus analysis, pipeline design, and code generation. They are not in the production scoring path. The distinction is documented in every pipeline README.",
    ],
    aside: "Technical aside: The pipeline's determinism guarantee covers the public scoring harness. Proprietary engine implementations maintain the same guarantee internally. If a pipeline is found to produce non-deterministic outputs, it fails the LUNA audit log consistency check.",
  },
  {
    id: "luna",
    label: "6 / LUNA audit trails",
    title: "LUNA audit trails",
    body: [
      "LUNA is the audit module embedded in every COSMIC pipeline. For every pipeline run, LUNA records: input corpus SHA, pipeline stage outputs, confidence scores, verdict, and a SHA-chained link to the prior run record. The chain is tamper-evident: modifying any record breaks the chain hash, and the break is detectable.",
      "This matters for regulatory contexts where demonstrating that a result was produced at a specific time from a specific input is legally required. LUNA provides that chain without relying on infrastructure logging, which can be overwritten.",
      "LUNA output is published alongside benchmark results. The audit log structure is documented in the methodology repository.",
    ],
    aside: "Technical aside: LUNA generates a BLAKE3 hash of the run record concatenated with the prior record's hash. The chain head is published in each CHECKPOINT_RESULTS.md. To verify, start from any checkpoint hash and follow the chain.",
  },
  {
    id: "tiergating",
    label: "7 / Tier gating",
    title: "Tier gating",
    body: [
      "HEIMDALL is the capability access control module. Every COSMIC pipeline has a tier structure: queries within the calibrated confidence zone get full verdicts; queries that approach the edge of the knowledge boundary get a SOFT_REFUSAL with partial evidence; queries entirely outside the boundary get a HARD_REFUSAL.",
      "Tier gating is separate from the AURORA confidence gate. AURORA gates on confidence; HEIMDALL gates on capability. A query might be high-confidence on a topic the pipeline has never been calibrated for — HEIMDALL refuses it regardless of AURORA's output.",
      "The tier structure for each benchmark is documented in the pipeline README and visible in the confidence attribution chains produced by VANTAGE.",
    ],
    aside: "Technical aside: HEIMDALL's tier boundaries are set during benchmark calibration and pinned at checkpoint time. They are not updated during benchmark runs — capability boundaries are fixed per corpus version.",
  },
];

export default function MethodologyPage() {
  return (
    <article style={{ padding: "5rem 0 6rem" }}>
      <div style={S.container}>
        <div style={{ marginBottom: "4rem" }}>
          <Link href="/crucible" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2rem" }}>← CRUCIBLE</Link>
          <span style={{ ...S.label, marginBottom: "1rem" }}>JourdanLabs Playbook</span>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "1rem" }}>
            Methodology
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 540 }}>
            Seven principles behind every JourdanLabs benchmark. Each is non-negotiable.
            If a benchmark cannot satisfy all seven, it does not ship.
          </p>
          <div style={{ marginTop: "1.5rem" }}>
            <a href="https://github.com/jourdanlabs/methodology" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
              Read the full playbook on GitHub →
            </a>
          </div>
        </div>

        <nav style={{ border: "1px solid var(--bg-border)", padding: "1.25rem 1.5rem", marginBottom: "4rem", backgroundColor: "var(--bg-card)" }}>
          <div style={{ ...S.label, marginBottom: "0.75rem" }}>Contents</div>
          <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((section, i) => (
          <section key={section.id} id={section.id} style={{ marginBottom: 0 }}>
            <span style={{ ...S.label, marginBottom: "0.5rem" }}>{section.label}</span>
            <h2 style={S.sectionTitle}>{section.title}</h2>
            {section.body.map((para, j) => (
              <p key={j} style={S.p}>{para}</p>
            ))}
            <div style={S.aside}>
              <p style={S.asideText}>{section.aside}</p>
            </div>
            {i < sections.length - 1 && <hr style={S.divider} />}
          </section>
        ))}

        <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--bg-border)", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <a href="https://github.com/jourdanlabs/methodology" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
            Full playbook on GitHub →
          </a>
          <Link href="/crucible/reproducibility" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Reproducibility guide →
          </Link>
          <Link href="/crucible/benchmarks" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Benchmark program →
          </Link>
        </div>
      </div>
    </article>
  );
}
