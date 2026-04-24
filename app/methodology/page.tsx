import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Methodology — JourdanLabs Playbook",
  description:
    "Seven non-negotiable principles behind every JourdanLabs benchmark.",
};

const sections = [
  {
    id: "refusal",
    num: "1",
    label: "Refusal is a feature",
    title: "Refusal is a feature.",
    body: [
      "The AURORA gate is the first-class output mechanism of every COSMIC pipeline. When aggregate confidence across pipeline stages falls below a configurable threshold (default: 0.70), AURORA emits a refusal — not a verdict. This is not a failure mode. It is the correct answer when the evidence is insufficient.",
      "Regulated industries require this posture. A pharmacovigilance system that guesses about drug interactions is not safer than one that says 'insufficient signal.'",
    ],
    aside:
      "Technical aside: AURORA computes a weighted confidence aggregate from NOVA, ECLIPSE, and PULSAR outputs. Refusal thresholds are pinned per benchmark and documented in CHECKPOINT files.",
  },
  {
    id: "sealed",
    num: "2",
    label: "Sealed corpora",
    title: "Sealed corpora.",
    body: [
      "Every benchmark ships with cryptographically sealed corpora. No future edits. No silent updates. Seals are generated at release and verified at runtime. If the seal does not match, the run is invalid.",
    ],
    aside: null,
  },
  {
    id: "baselines",
    num: "3",
    label: "Honest baselines",
    title: "Honest baselines.",
    body: [
      "Baselines must be simple, transparent, and reproducible. No cherry-picked configurations. No hidden scaffolding. Baselines define the floor, not the ceiling.",
    ],
    aside: null,
  },
  {
    id: "attribution",
    num: "4",
    label: "Per-fix attribution",
    title: "Per-fix attribution.",
    body: [
      "When a benchmark goes through multiple iterations, each checkpoint is documented with the specific change made, the F1 delta attributed to that change, and the evidence used to justify the fix.",
    ],
    aside: null,
  },
  {
    id: "deterministic",
    num: "5",
    label: "Deterministic at runtime",
    title: "Deterministic at runtime.",
    body: [
      "No LLM calls at runtime. Every COSMIC pipeline stage uses deterministic algorithms that produce identical outputs for identical inputs. There is no sampling, no temperature, no non-deterministic model inference in production.",
    ],
    aside: null,
  },
  {
    id: "luna",
    num: "6",
    label: "LUNA audit trails",
    title: "LUNA audit trails.",
    body: [
      "LUNA is the audit module embedded in every COSMIC pipeline. For every pipeline run, LUNA records: input corpus SHA, pipeline stage outputs, confidence scores, verdict, and a SHA-chained link to the prior run record.",
    ],
    aside: null,
  },
  {
    id: "tiergating",
    num: "7",
    label: "Tier gating",
    title: "Tier gating.",
    body: [
      "HEIMDALL is the capability access control module. Every COSMIC pipeline has a tier structure: queries within the calibrated confidence zone get full verdicts; queries that approach the edge of the knowledge boundary get a SOFT_REFUSAL with partial evidence; queries entirely outside the boundary get a HARD_REFUSAL.",
    ],
    aside: null,
  },
];

export default function MethodologyPage() {
  return (
    <article style={{ backgroundColor: "var(--bg)" }}>
      {/* Breadcrumb */}
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "1.5rem 2rem 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.75rem",
            fontFamily: "var(--font-geist-mono), monospace",
            letterSpacing: "0.06em",
          }}
        >
          <Link
            href="/crucible"
            style={{ color: "var(--text-secondary)" }}
          >
            CRUCIBLE
          </Link>
          <span style={{ color: "var(--text-tertiary)" }}>/</span>
          <span style={{ color: "var(--accent)" }}>METHODOLOGY</span>
        </div>
      </div>

      {/* Hero */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "3rem 2rem 4rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            JourdanLabs Playbook
          </span>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Methodology.
          </h1>
          <div
            style={{
              width: 60,
              height: 3,
              backgroundColor: "var(--accent)",
              marginBottom: "1.5rem",
            }}
          />
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxWidth: 480,
            }}
          >
            Seven principles behind every JourdanLabs benchmark. Each is
            non-negotiable. If a benchmark cannot satisfy all seven, it does not
            ship.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src="/methodology-scroll.jpg"
            alt="Methodology scroll artifact"
            width={400}
            height={320}
            style={{ objectFit: "contain" }}
          />
        </div>
      </section>

      {/* Two-column content */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 2rem 5rem",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "4rem",
        }}
      >
        {/* Left: Table of Contents */}
        <nav
          style={{
            position: "sticky",
            top: "6rem",
            alignSelf: "start",
            borderLeft: "1px solid var(--bg-border)",
            paddingLeft: "1.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              display: "block",
              marginBottom: "1rem",
            }}
          >
            Contents
          </span>
          <ol
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {sections.map((s) => (
              <li
                key={s.id}
                style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "0.75rem",
                    color: "var(--accent)",
                    fontWeight: 500,
                  }}
                >
                  {s.num} /
                </span>
                <a
                  href={`#${s.id}`}
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Right: Article content */}
        <div>
          {sections.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              style={{
                marginBottom: i < sections.length - 1 ? "3rem" : 0,
                paddingBottom: i < sections.length - 1 ? "3rem" : 0,
                borderBottom:
                  i < sections.length - 1
                    ? "1px solid var(--bg-border)"
                    : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                {section.num} / {section.label.toUpperCase()}
              </span>
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  marginBottom: "1rem",
                }}
              >
                {section.title}
              </h2>
              {section.body.map((para, j) => (
                <p
                  key={j}
                  style={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.75,
                    marginBottom: "1rem",
                  }}
                >
                  {para}
                </p>
              ))}
              {section.aside && (
                <div
                  style={{
                    marginTop: "1.25rem",
                    padding: "1rem 1.25rem",
                    backgroundColor: "var(--bg-card)",
                    borderLeft: "3px solid var(--accent)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--accent)",
                      lineHeight: 1.7,
                    }}
                  >
                    <strong>Technical aside:</strong>{" "}
                    {section.aside.replace("Technical aside: ", "")}
                  </p>
                </div>
              )}
            </section>
          ))}
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
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
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

      <style>{`
        @media (max-width: 900px) {
          section[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          section[style*="grid-template-columns: 280px 1fr"] {
            grid-template-columns: 1fr !important;
          }
          nav[style*="position: sticky"] {
            position: static !important;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </article>
  );
}
