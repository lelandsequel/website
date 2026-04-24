import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reproducibility",
  description:
    "How to re-run every JourdanLabs benchmark. Corpus verification, scoring harness, evaluation API access.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 760, margin: "0 auto", padding: "0 2rem" },
  label: { fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-tertiary)", display: "block" },
  sectionTitle: { fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.875rem" },
  p: { color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1rem" },
  divider: { border: "none", borderTop: "1px solid var(--bg-border)", margin: "3rem 0" },
  step: {
    display: "flex",
    gap: "1.25rem",
    marginBottom: "1.5rem",
    alignItems: "flex-start",
  },
  stepNum: {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "var(--accent)",
    width: 24,
    flexShrink: 0,
    paddingTop: "0.1rem",
  },
};

const benchmarks = [
  { name: "SIGNAL", sha: "See CHECKPOINT_RESULTS.md", path: "signal" },
  { name: "CITADEL", sha: "a6a98dbb30794fb98413129c3a9855af2214f840b1a1fe74e5175485dab99d81", path: "citadel" },
  { name: "SENTINEL", sha: "See CHECKPOINT_RESULTS.md", path: "sentinel" },
  { name: "ORACLE", sha: "cd5de198497a5cf09e372aa99745cac940c774b4d212da70902d382a71911ad2", path: "oracle" },
  { name: "LENS", sha: "See CHECKPOINT_RESULTS.md", path: "lens" },
  { name: "COMPASS", sha: "See CHECKPOINT_RESULTS.md", path: "compass" },
];

export default function ReproducibilityPage() {
  return (
    <article style={{ padding: "5rem 0 6rem" }}>
      <div style={S.container}>
        <div style={{ marginBottom: "4rem" }}>
          <span style={{ ...S.label, marginBottom: "1rem" }}>Reproducibility</span>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "1rem" }}>
            How to re-run a benchmark
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 540 }}>
            Every JourdanLabs benchmark is designed to be verifiable by a stranger.
            No special access required to verify corpora and run scoring harnesses.
            Engine access requires an API key.
          </p>
        </div>

        {/* Section 1: How to re-run */}
        <section style={{ marginBottom: "3.5rem" }}>
          <span style={{ ...S.label, marginBottom: "1rem" }}>Section 1 / How to re-run a benchmark</span>
          <h2 style={S.sectionTitle}>Step-by-step</h2>

          <div>
            {[
              {
                step: "01",
                title: "Clone the benchmarks repository",
                code: "git clone https://github.com/jourdanlabs/benchmarks\ncd benchmarks",
              },
              {
                step: "02",
                title: "Navigate to the benchmark directory",
                code: "cd citadel   # or signal, sentinel, oracle, lens, compass",
              },
              {
                step: "03",
                title: "Install dependencies",
                code: "pip install -r requirements.txt",
              },
              {
                step: "04",
                title: "Verify the corpus SHA",
                code: "python scoring/verify_corpus.py --corpus corpus/corpus_v1.jsonl --sha corpus/corpus_v1.sha256",
                note: "This step will abort if the corpus has been modified. If it passes, you have the unmodified sealed corpus.",
              },
              {
                step: "05",
                title: "Run the scoring harness against the baselines",
                code: "python scoring/score.py --predictions baselines/keyword_baseline.jsonl --corpus corpus/corpus_v1.jsonl",
                note: "This reproduces the baseline scores published in CHECKPOINT_RESULTS.md without the COSMIC API.",
              },
              {
                step: "06",
                title: "Run with COSMIC predictions (requires API key)",
                code: "COSMIC_API_KEY=your_key python pipeline/run.py --corpus corpus/corpus_v1.jsonl\npython scoring/score.py --predictions pipeline/outputs/predictions.jsonl --corpus corpus/corpus_v1.jsonl",
                note: "This reproduces the full COSMIC results. Requires an evaluation API key.",
              },
            ].map((item) => (
              <div key={item.step} style={S.step}>
                <span style={S.stepNum}>{item.step}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{item.title}</div>
                  <pre style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--bg-border)", padding: "0.875rem 1rem", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.8125rem", lineHeight: 1.6, color: "var(--text-secondary)", overflowX: "auto" }}>{item.code}</pre>
                  {item.note && <p style={{ ...S.p, fontSize: "0.8125rem", marginTop: "0.5rem", marginBottom: 0 }}>{item.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr style={S.divider} />

        {/* Section 2: Corpus integrity */}
        <section style={{ marginBottom: "3.5rem" }}>
          <span style={{ ...S.label, marginBottom: "1rem" }}>Section 2 / Corpus integrity</span>
          <h2 style={S.sectionTitle}>The SHA pinning model</h2>
          <p style={S.p}>
            Every corpus is SHA-256 sealed before any pipeline contact. The seal hash is stored in
            <code style={{ margin: "0 0.25rem" }}>corpus/corpus_v1.sha256</code> and cross-referenced in
            <code style={{ margin: "0 0.25rem" }}>CHECKPOINT_RESULTS.md</code>. The LUNA audit log for
            each pipeline run also records the corpus SHA at run time.
          </p>
          <p style={S.p}>
            To verify you have the unmodified corpus: run the verify script (Step 04 above) or manually compute:
          </p>
          <pre style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--bg-border)", padding: "0.875rem 1rem", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.8125rem", lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "1.5rem", overflowX: "auto" }}>
            {`# macOS\nshasum -a 256 corpus/corpus_v1.jsonl\n\n# Linux\nsha256sum corpus/corpus_v1.jsonl`}
          </pre>
          <p style={S.p}>Compare the output to the hash in <code>corpus/corpus_v1.sha256</code>. They must match.</p>

          <div style={{ border: "1px solid var(--bg-border)", overflow: "hidden", marginTop: "1.5rem" }}>
            <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--bg-border)", display: "grid", gridTemplateColumns: "6rem 1fr", gap: "1rem" }}>
              <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Benchmark</span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Corpus SHA-256 (E.2 / v0.1)</span>
            </div>
            {benchmarks.map((b, i) => (
              <div key={b.name} style={{ padding: "0.75rem 1rem", borderBottom: i < benchmarks.length - 1 ? "1px solid var(--bg-border)" : "none", display: "grid", gridTemplateColumns: "6rem 1fr", gap: "1rem" }}>
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.8125rem", color: "var(--text-primary)" }}>{b.name}</span>
                <code style={{ fontSize: "0.75rem", color: "var(--text-secondary)", wordBreak: "break-all" }}>{b.sha}</code>
              </div>
            ))}
          </div>
        </section>

        <hr style={S.divider} />

        {/* Section 3: API access */}
        <section>
          <span style={{ ...S.label, marginBottom: "1rem" }}>Section 3 / Evaluation API access</span>
          <h2 style={S.sectionTitle}>COSMIC engine access</h2>
          <p style={S.p}>
            COSMIC engine implementations are proprietary. To reproduce JourdanLabs' published results
            against the live engines, request an evaluation API key.
          </p>
          <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "1.5rem", marginBottom: "2rem" }}>
            <p style={{ ...S.p, marginBottom: "1rem" }}>
              With the public repository alone, you can:
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
              {[
                "Verify the corpus SHA",
                "Run baselines against the corpus",
                "Inspect the full methodology",
                "Re-run scoring with your own predictions in the expected format",
                "Review the LUNA audit log structure",
              ].map((item) => (
                <li key={item} style={{ display: "flex", gap: "0.75rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem" }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ ...S.p, marginBottom: 0 }}>
              To reproduce JourdanLabs' COSMIC results specifically, you need the evaluation API.
              This split — open corpora and scoring, proprietary engines — is how SuperGLUE, HELM,
              and other serious benchmark programs operate.
            </p>
          </div>
          <a
            href="mailto:leland@jourdanlabs.com?subject=COSMIC Evaluation API Key Request"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "var(--accent)",
              color: "#0E0F13",
              fontWeight: 600,
              fontSize: "0.875rem",
              borderRadius: 2,
            }}
          >
            Request an evaluation API key →
          </a>
        </section>

        <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--bg-border)", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <a href="https://github.com/jourdanlabs/benchmarks" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
            github.com/jourdanlabs/benchmarks →
          </a>
          <Link href="/methodology" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Methodology →
          </Link>
        </div>
      </div>
    </article>
  );
}
