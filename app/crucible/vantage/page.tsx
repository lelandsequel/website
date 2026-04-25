import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "VANTAGE — Products Validating Products",
  description:
    "VANTAGE is the COSMIC diagnostic suite. Per-division capability scans with sealed receipts, honest refusal rates, and BCa confidence intervals.",
};

const container: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "0 2rem",
};

const SCAN_RESULTS = [
  { division: "ATLAS", task: "Mineral title extraction", score: "88.5%", refusal: "11.0%", corpus: "sealed" },
  { division: "BACCHUS", task: "Venue inventory reasoning", score: "88.9%", refusal: "8.2%", corpus: "sealed" },
  { division: "HELIX", task: "Clinical workflow routing", score: "81.5%", refusal: "14.7%", corpus: "sealed" },
  { division: "HEIMDALL", task: "SOC alert triage", score: "94.0%", refusal: "6.0%", corpus: "sealed" },
  { division: "CRUCIBLE", task: "Cross-domain factual verification", score: "51.0%", refusal: "67.5%", corpus: "a6a98dbb / cd5de198" },
];

const STEPS = [
  {
    n: "01",
    title: "Sealed corpus per domain",
    desc: "Each scan runs against a domain-specific corpus sealed before the scan begins. The corpus SHA is published in the receipt.",
  },
  {
    n: "02",
    title: "Full COSMIC pipeline execution",
    desc: "NOVA → ECLIPSE → PULSAR → AURORA → LUNA. Every stage runs deterministically. No LLM calls at runtime.",
  },
  {
    n: "03",
    title: "Per-engine confidence attribution",
    desc: "VANTAGE produces a failure-class taxonomy alongside the score. Each failure class is attributed to a specific pipeline stage.",
  },
  {
    n: "04",
    title: "Sealed receipt with BCa CIs",
    desc: "Corpus SHA, per-task scores, refusal rate, BCa bootstrap confidence intervals (B=2,000), and a LUNA audit chain head.",
  },
];

const ENGINES = ["NOVA", "ECLIPSE", "PULSAR", "LUNA", "AURORA", "HEIMDALL", "DOLOS"];

export default function VantagePage() {
  return (
    <>
      {/* Breadcrumb */}
      <div style={{ ...container, paddingTop: "1.5rem" }}>
        <Link
          href="/crucible"
          style={{
            fontSize: "0.75rem",
            color: "var(--text-tertiary)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          ← CRUCIBLE / VANTAGE
          <span
            style={{
              fontSize: "0.625rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "var(--accent)",
              border: "1px solid var(--accent-border)",
              padding: "0.125rem 0.5rem",
            }}
          >
            FLAGSHIP
          </span>
        </Link>
      </div>

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section style={{ padding: "3rem 0 4rem" }}>
        <div style={container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "3rem",
              alignItems: "start",
            }}
            className="hero-grid"
          >
            <Reveal>
              <div className="smallcaps" style={{ marginBottom: "1rem" }}>
                CRUCIBLE / VANTAGE &middot; FLAGSHIP
              </div>
              <h1
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                  fontWeight: 400,
                  lineHeight: 1.05,
                  color: "var(--text-primary)",
                  marginBottom: "1.5rem",
                }}
              >
                Products validating
                <br />
                products.
              </h1>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  color: "var(--text-secondary)",
                  maxWidth: 420,
                  marginBottom: "2rem",
                }}
              >
                VANTAGE is the COSMIC diagnostic suite — a structured scan of
                engine capability across all five division domains. Each scan
                produces a sealed receipt with per-task scores, honest refusal
                rates, and BCa confidence intervals.
              </p>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 1.5rem",
                  backgroundColor: "var(--text-primary)",
                  color: "var(--bg)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Request a Vantage Scan
                <span>→</span>
              </Link>
            </Reveal>

            <Reveal delay={150}>
              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--bg-border)",
                  borderRadius: 8,
                  padding: "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "1.5rem" }}>
                  <div style={{ position: "relative", width: 140, height: 160, flexShrink: 0 }}>
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/02_validation_tablet-CHmorZrPWyOuPbovq6sddaaskWqBP3.png"
                      alt="VANTAGE diagnostic tablet artifact"
                      fill
                      sizes="140px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div style={{ marginLeft: "0.5rem" }}>
                    <div
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        color: "var(--text-primary)",
                        marginBottom: "0.375rem",
                      }}
                    >
                      VANTAGE
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        letterSpacing: "0.1em",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      COSMIC DIAGNOSTIC SUITE
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "0.75rem",
                    lineHeight: 1.8,
                    color: "var(--text-secondary)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-tertiary)" }}>SCAN ID</span>
                    <span>VG-2026-04-17-0001</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-tertiary)" }}>DATE</span>
                    <span>APR 17, 2026 &middot; 14:23 UTC</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-tertiary)" }}>ENGINE</span>
                    <span>CITADEL v2.7.1</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-tertiary)" }}>CORPUS SHA</span>
                    <span>a6a98dbb / cd5de198</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-tertiary)" }}>PIPELINE</span>
                    <span>NOVA → ECLIPSE → PULSAR → AURORA → LUNA</span>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid var(--bg-border)",
                      marginTop: "1rem",
                      paddingTop: "1rem",
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>SUMMARY</div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-tertiary)" }}>TASKS</span>
                      <span>125</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-tertiary)" }}>MEAN SCORE</span>
                      <span>78.8%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-tertiary)" }}>REFUSAL RATE</span>
                      <span>21.2%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text-tertiary)" }}>BCa (95% CI)</span>
                      <span>[74.1% , 83.2%]</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────── SCAN RECEIPTS ─────────────────── */}
      <section
        style={{
          padding: "3rem 0",
          backgroundColor: "var(--bg-card)",
          borderTop: "1px solid var(--bg-border)",
          borderBottom: "1px solid var(--bg-border)",
        }}
      >
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem", color: "var(--accent)" }}>
              Scan Receipts
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ border: "1px solid var(--bg-border)", overflow: "hidden", borderRadius: 4 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "8rem 1fr 6rem 6rem 1fr",
                  padding: "0.75rem 1rem",
                  borderBottom: "1px solid var(--bg-border)",
                  backgroundColor: "var(--bg)",
                }}
              >
                {["Division", "Task", "Score", "Refusal", "Corpus"].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
              {SCAN_RESULTS.map((row, i) => (
                <div
                  key={row.division}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "8rem 1fr 6rem 6rem 1fr",
                    padding: "1rem",
                    borderBottom: i < SCAN_RESULTS.length - 1 ? "1px solid var(--bg-border)" : "none",
                    alignItems: "center",
                    backgroundColor: "var(--bg)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--accent)",
                    }}
                  >
                    {row.division}
                  </span>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    {row.task}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {row.score}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.875rem",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {row.refusal}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.75rem",
                      color: "var(--text-tertiary)",
                      wordBreak: "break-all",
                    }}
                  >
                    {row.corpus}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.75rem", fontStyle: "italic" }}>
            BCa bootstrap confidence intervals (B=2,000) computed per scan. Full receipts available on request.
          </p>
        </div>
      </section>

      {/* ─────────────────── HOW IT WORKS ─────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "2rem", color: "var(--accent)" }}>
              How Vantage Works
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "1.5rem",
            }}
            className="steps-grid"
          >
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: 8,
                    padding: "1.5rem",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "var(--bg)",
                      border: "1px solid var(--bg-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      marginBottom: "1rem",
                    }}
                  >
                    {s.n}
                  </div>
                  <h3
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      lineHeight: 1.55,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── ENGINES COVERED ─────────────────── */}
      <section
        style={{
          padding: "3rem 0",
          backgroundColor: "var(--bg-card)",
          borderTop: "1px solid var(--bg-border)",
          borderBottom: "1px solid var(--bg-border)",
        }}
      >
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem", color: "var(--accent)" }}>
              Engines Covered
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {ENGINES.map((e) => (
                <div
                  key={e}
                  style={{
                    padding: "0.625rem 1.25rem",
                    backgroundColor: "#3A3630",
                    color: "#F0E7D5",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    borderRadius: 4,
                  }}
                >
                  {e}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── CLAIMS ─────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div style={{ ...container, maxWidth: 960 }}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem", color: "var(--accent)" }}>
              What Is and Is Not Claimed
            </div>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
            className="claims-grid"
          >
            <Reveal delay={100}>
              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--bg-border)",
                  borderRadius: 8,
                  padding: "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: "rgba(34, 139, 34, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#228B22",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-primary)" }}>
                    IS CLAIMED
                  </div>
                </div>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                  VANTAGE correctly identified CITADEL failure classes A, B, C with stated confidence levels
                  (95%, 88%, 80%). The E.1 and E.2 fixes were implemented from VANTAGE&apos;s diagnosis.
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--bg-border)",
                  borderRadius: 8,
                  padding: "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: "rgba(184, 90, 46, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-primary)" }}>
                    IS NOT CLAIMED
                  </div>
                </div>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                  VANTAGE scan scores are capability demonstrations, not published benchmarks. Division scan
                  scores have no held-out ground truth separate from the scan corpus.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────── FOOTER ─────────────────────── */}
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

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .steps-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .claims-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
