import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "CRUCIBLE Reproducibility — Every Result Reproducible",
  description:
    "Every JourdanLabs benchmark ships with sealed corpus, honest baselines, deterministic pipeline, and step-by-step reproduction instructions.",
};

const container: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "0 2rem",
};

export default function ReproducibilityPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div style={{ ...container, paddingTop: "1.5rem" }}>
        <Link
          href="/crucible"
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary)",
          }}
        >
          ← CRUCIBLE / REPRODUCIBILITY
        </Link>
      </div>

      {/* Hero */}
      <section style={{ padding: "3rem 0 4rem" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
              CRUCIBLE / REPRODUCIBILITY
            </div>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--text-primary)",
                marginBottom: "1.5rem",
              }}
            >
              Every result reproducible.
            </h1>
            <div
              style={{
                width: 60,
                height: 3,
                backgroundColor: "var(--accent)",
                marginBottom: "1.5rem",
              }}
            />
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: "0 0 4rem" }}>
        <div style={{ ...container, maxWidth: 900 }}>
          <Reveal>
            <p
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                marginBottom: "1.5rem",
              }}
            >
              Every JourdanLabs benchmark ships with everything needed to reproduce the
              published results:
            </p>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              {[
                "Sealed corpus (SHA-verifiable)",
                "Honest baselines (real implementations, not straw men)",
                "Deterministic pipeline (same input → same output, every time)",
                "Step-by-step reproduction instructions",
                "GitHub repo with scoring harness and baseline code",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    fontSize: "1rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span
                    style={{
                      color: "var(--accent)",
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                    }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
              }}
            >
              Engine implementations are proprietary. Scoring harnesses and baseline code
              are public. This split — open corpora and scoring, proprietary engines — is
              how serious benchmark programs (SuperGLUE, HELM) operate.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Code Block */}
      <section
        style={{
          backgroundColor: "var(--bg-muted)",
          padding: "4rem 2rem",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
              Example Reproduction Commands
            </div>
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--bg-border)",
                borderRadius: 8,
                padding: "1.5rem",
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "0.8125rem",
                lineHeight: 1.8,
                overflowX: "auto",
              }}
            >
              <div style={{ color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
                # Clone the benchmarks repository
              </div>
              <div style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                git clone https://github.com/jourdanlabs/benchmarks
              </div>
              <div style={{ color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
                # Navigate to a benchmark
              </div>
              <div style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                cd benchmarks/citadel
              </div>
              <div style={{ color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
                # Verify the corpus SHA
              </div>
              <div style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                python scoring/verify_corpus.py --corpus corpus/corpus_v1.jsonl
              </div>
              <div style={{ color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
                # Run baselines against the corpus (no API key required)
              </div>
              <div style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                python scoring/score.py --predictions baselines/keyword_baseline.jsonl
              </div>
              <div style={{ color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
                # Run with COSMIC predictions (requires evaluation API key)
              </div>
              <div style={{ color: "var(--text-secondary)" }}>
                COSMIC_API_KEY=your_key python pipeline/run.py
              </div>
            </div>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-tertiary)",
                marginTop: "1rem",
                fontStyle: "italic",
              }}
            >
              Full instructions in each benchmark&apos;s README. This is the pattern, not a working script.
            </p>
          </Reveal>
        </div>
      </section>

      {/* GitHub CTA */}
      <section style={{ padding: "4rem 0" }}>
        <div style={{ ...container, maxWidth: 900 }}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1rem", color: "var(--accent)" }}>
              GitHub Repository
            </div>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                marginBottom: "1.5rem",
              }}
            >
              All benchmark corpora, scoring harnesses, and baseline implementations are
              published in the public benchmarks repository.
            </p>
            <a
              href="https://github.com/jourdanlabs/benchmarks"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2rem",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                fontSize: "0.875rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              github.com/jourdanlabs/benchmarks
              <span>→</span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--bg-border)",
          padding: "1.25rem 2rem",
          backgroundColor: "var(--bg)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <span style={{ fontWeight: 600, letterSpacing: "0.04em" }}>
            JOURDANLABS / HOUSTON, TX
          </span>
          <span>Six benchmarks. Publicly reproducible.</span>
          <a
            href="mailto:leland@jourdanlabs.com"
            style={{ color: "var(--text-secondary)" }}
          >
            leland@jourdanlabs.com
          </a>
        </div>
      </footer>
    </>
  );
}
