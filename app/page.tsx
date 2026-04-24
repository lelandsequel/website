import type { Metadata } from "next";
import Link from "next/link";
import BenchmarkGrid from "@/components/BenchmarkGrid";
import DivisionCard from "@/components/DivisionCard";

export const metadata: Metadata = {
  title: "JourdanLabs — Deterministic AI for Regulated Decisions",
  description:
    "Five industry divisions. One reasoning substrate. No LLM calls at runtime.",
};

const S: Record<string, React.CSSProperties> = {
  section: { padding: "6rem 0", borderBottom: "1px solid var(--bg-border)" },
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

const DIVISIONS = [
  {
    name: "ATLAS",
    tagline: "Commercial real estate intelligence",
    headline: "MineralLogic",
    products: "MineralLogic · PropertyGraph · NAUTILUS (dev)",
    href: "/divisions/atlas",
    accent: "#D4A574",
  },
  {
    name: "BACCHUS",
    tagline: "Beverage industry operations",
    headline: "COSMIX",
    products: "COSMIX (live, 1800+ venues) · BACCHUS RUSH · Trade / Cellar / Atlas (dev)",
    href: "/divisions/bacchus",
    accent: "#7D2348",
  },
  {
    name: "HELIX",
    tagline: "Healthcare workflow automation",
    headline: "HELIX",
    products: "HELIX (TestFlight) · PHAROS (dev)",
    href: "/divisions/helix",
    accent: "#E8735A",
  },
  {
    name: "HEIMDALL",
    tagline: "Security operations & compliance",
    headline: "SENTINEL",
    products: "SENTINEL (pre-pilot) · AEGIS (roadmap)",
    href: "/divisions/heimdall",
    accent: "#4A7BA7",
  },
  {
    name: "CRUCIBLE",
    tagline: "Open research & validation infrastructure",
    headline: "VANTAGE",
    products: "VANTAGE · RAVEN · Benchmark Program",
    href: "/crucible",
    accent: "var(--accent)",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section style={{ padding: "7rem 0 5rem", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <div style={{ maxWidth: 720 }}>
            <div style={S.label}>JOURDANLABS / Houston, TX</div>

            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                color: "var(--text-primary)",
                marginBottom: "1.25rem",
              }}
            >
              Deterministic AI for regulated decisions.
            </h1>

            <p
              style={{
                fontSize: "1.0625rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: 580,
              }}
            >
              Five industry divisions. One reasoning substrate. No LLM calls at runtime.
            </p>
          </div>
        </div>
      </section>

      {/* DIVISIONS */}
      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>The Portfolio</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1px",
              backgroundColor: "var(--bg-border)",
              border: "1px solid var(--bg-border)",
            }}
          >
            {DIVISIONS.map((d) => (
              <DivisionCard key={d.name} {...d} />
            ))}
          </div>
        </div>
      </section>

      {/* VANTAGE FLAGSHIP */}
      <section style={S.section}>
        <div style={S.container}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "1rem",
                }}
              >
                CRUCIBLE / VANTAGE
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.15,
                  color: "var(--text-primary)",
                  marginBottom: "1.25rem",
                }}
              >
                Products validating products.
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1.75rem" }}>
                VANTAGE is the COSMIC diagnostic suite — a structured scan of engine capability across all
                five division domains. Each scan produces a sealed receipt with per-task scores, honest
                refusal rates, and BCa confidence intervals. The same infrastructure that validates
                JourdanLabs products validates your deployment.
              </p>
              <Link
                href="/crucible/vantage"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "var(--accent)",
                  color: "#0E0F13",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  letterSpacing: "0.02em",
                  borderRadius: 2,
                  textDecoration: "none",
                }}
              >
                Explore VANTAGE →
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1px",
                backgroundColor: "var(--bg-border)",
                border: "1px solid var(--bg-border)",
              }}
            >
              {[
                { label: "ATLAS", score: "88.5%" },
                { label: "BACCHUS", score: "88.9%" },
                { label: "HELIX", score: "81.5%" },
                { label: "Refusal rate", score: "—" },
                { label: "Corpus SHA", score: "sealed" },
                { label: "BCa CI", score: "B=2000" },
              ].map((cell) => (
                <div
                  key={cell.label}
                  style={{
                    padding: "1.25rem",
                    backgroundColor: "var(--bg-card)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.625rem",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--text-tertiary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {cell.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {cell.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENCHMARK GRID — validation receipts */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <span style={S.label}>Validation Receipts</span>
            <Link href="/crucible/benchmarks" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>
              View benchmark program →
            </Link>
          </div>
          <BenchmarkGrid />
        </div>
      </section>

      {/* THESIS */}
      <section style={S.section}>
        <div style={S.containerSm}>
          <span style={S.label}>Thesis</span>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary)" }}>
                Current AI guesses confidently.
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Large language models achieve impressive benchmark numbers but produce unreliable outputs when
                underlying knowledge is absent or contested. Regulated industries — pharmacovigilance, financial
                compliance, security operations, healthcare workflow — cannot tolerate confident hallucination.
                The cost of a wrong answer that looks right is higher than the cost of no answer at all.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary)" }}>
                COSMIC is the opposite architecture.
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                COSMIC is a multi-engine deterministic pipeline shared across all five divisions. No LLM calls
                at runtime. Every claim is grounded against a sealed, SHA-verified corpus before it leaves the
                pipeline. The AURORA confidence gate refuses to emit a verdict when aggregate confidence falls
                below threshold — treating honest refusal as a first-class output, not a failure mode. LUNA
                maintains an immutable, SHA-chained audit log for every run.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--text-primary)" }}>
                Six benchmarks. Publicly reproducible.
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                The CRUCIBLE benchmark program runs six independent tasks across pharmacovigilance, corporate
                entity resolution, cybersecurity triage, factual verification, semantic search, and reading-level
                calibration. Every result ships with a sealed corpus, honest baselines against real industry tools,
                per-fix attribution, self-assessed limitations, and step-by-step reproduction instructions.
                Engine implementations are proprietary. Results are not.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY PROMISE */}
      <section style={{ padding: "5rem 0", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.containerSm}>
          <span style={S.label}>Methodology Commitment</span>
          <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "1.75rem" }}>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              Every JourdanLabs benchmark ships with:
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                "Sealed corpus (SHA-verifiable)",
                "Honest baselines (no straw men)",
                "Deterministic pipeline (no LLM calls at runtime)",
                "Per-fix attribution (methodology arc shown)",
                "Honest limitations (what would face scrutiny)",
                "Reproducibility instructions",
              ].map((item) => (
                <li key={item} style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem" }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "1.75rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <Link href="/crucible/methodology" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
                Read the methodology →
              </Link>
              <Link href="/crucible/reproducibility" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                Reproducibility instructions →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATIONS GESTURE */}
      <section style={{ padding: "5rem 0" }}>
        <div style={S.containerSm}>
          <span style={S.label}>Applications</span>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "1.25rem" }}>
            JourdanLabs products are available directly and through select advisory partnerships.
          </p>
          <Link href="/applications" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
            View deployment options →
          </Link>
        </div>
      </section>
    </>
  );
}
