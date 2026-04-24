import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "COSMIC — The Reasoning Substrate",
  description:
    "A multi-engine deterministic pipeline shared across all five JourdanLabs divisions. No LLM calls at runtime.",
};

const engines = [
  {
    id: "01",
    name: "RAVEN",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/asset_yb78d9eoz_1777045469087-cJVav7s8xjRYeVkNVxCsWpbyWC690k.png",
    label: "Retrieval",
    desc: "Semantic search over sealed corpus. Returns candidate memories.",
  },
  {
    id: "02",
    name: "METEOR",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/06_meteor_entity-Zysao5MMrKDxJMF04kplnYQw5ZYesK.png",
    label: "Entity normalization",
    desc: "Resolves aliases, merges duplicates, links references.",
  },
  {
    id: "03",
    name: "PULSAR",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/asset_bgy5j0yvm_1777045469087-Ui6XOqVIua8hA6PNxGHDRsZS1KsMwg.png",
    label: "Evidence aggregation",
    desc: "Consolidates and deduplicates evidence across sources.",
  },
  {
    id: "04",
    name: "AURORA",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/13_aurora_confidence_gate-PrPsm1OjTw55MgJurPYqdZM7RW80x5.png",
    label: "Confidence gate",
    desc: "Evaluates confidence thresholds and triggers honest refusal when unmet.",
    highlight: true,
  },
  {
    id: "05",
    name: "LUNA",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/08_luna_audit_log-oXe5CGj2s4bC2UrjVVWaTdVb4MZjZ5.png",
    label: "SHA-chained audit log",
    desc: "Writes immutable, SHA-verified events for every pipeline step.",
  },
  {
    id: "06",
    name: "HEIMDALL",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/03_heimdall_tier_gating-PeYxoBHav2bNZptXqKG62CNal4MA03.png",
    label: "Tier gating",
    desc: "Enforces division-level rules and permission tiers.",
  },
  {
    id: "07",
    name: "DOLOS",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/07_dolos_normalization-68381bjvj5CmawdbguP3BMhE0EfDXX.png",
    label: "Normalization",
    desc: "Resolves entities and normalizes formats for consistency.",
  },
];

const principles = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="11" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="18" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 7V3M18 33V29M29 18H33M3 18H7" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "No LLM calls at runtime",
    desc: "Deterministic pipelines. Predictable outcomes.",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="11" y="16" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 16V11C13 8.23858 15.2386 6 18 6C20.7614 6 23 8.23858 23 11V16" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="22" r="2" fill="currentColor" />
      </svg>
    ),
    title: "Sealed corpus before contact",
    desc: "All grounding happens offline, against SHA-verified artifacts.",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M9 19L15 25L27 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Honest refusal as a feature",
    desc: "Refusal is a first-class output, not an error condition.",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="7" y="7" width="22" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 14H29M14 14V29" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10.5" cy="10.5" r="1" fill="currentColor" />
      </svg>
    ),
    title: "Immutable audit chain",
    desc: "Every step is recorded, verifiable, and tamper-evident.",
  },
];

export default function CosmicPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "4.5rem 2rem 3.5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        <div>
          <p className="smallcaps" style={{ marginBottom: "1rem" }}>
            COSMIC
          </p>
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.08,
              color: "var(--text-primary)",
              marginBottom: "1.25rem",
            }}
          >
            The reasoning
            <br />
            substrate.
          </h1>
          <div
            style={{
              width: 56,
              height: 4,
              backgroundColor: "var(--accent)",
              marginBottom: "1.75rem",
            }}
            aria-hidden="true"
          />
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "var(--text-secondary)",
              maxWidth: 400,
            }}
          >
            COSMIC is a multi-engine deterministic pipeline shared across all
            five JourdanLabs divisions. No LLM calls at runtime. Every claim is
            grounded against a sealed, SHA-verified corpus before it leaves the
            pipeline. Honest refusal is a first-class output.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/14_cosmic_gears-K9HQ0vMauixT038vFrW1jo3PVOe14f.png"
            alt="COSMIC represented as interlocking sculptural gears on a stone pedestal"
            width={480}
            height={440}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </section>

      {/* Pipeline Architecture */}
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "2.5rem 2rem 3rem",
        }}
      >
        <p className="smallcaps" style={{ marginBottom: "2rem" }}>
          PIPELINE ARCHITECTURE
        </p>

        {/* Pipeline row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.25rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
          }}
        >
          {engines.map((engine, i) => (
            <div
              key={engine.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 110,
                  maxWidth: 125,
                }}
              >
                <p
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    color: engine.highlight
                      ? "var(--accent)"
                      : "var(--text-primary)",
                    marginBottom: "0.125rem",
                  }}
                >
                  {engine.id}
                </p>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: engine.highlight
                      ? "var(--accent)"
                      : "var(--text-primary)",
                    marginBottom: "0.625rem",
                  }}
                >
                  {engine.name}
                </p>

                {/* Artifact image with optional ring for AURORA */}
                <div
                  style={{
                    position: "relative",
                    marginBottom: "0.625rem",
                  }}
                >
                  {engine.highlight && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -6,
                        border: "2px solid var(--accent)",
                        borderRadius: "50%",
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <Image
                    src={engine.image}
                    alt={`${engine.name} engine artifact`}
                    width={88}
                    height={88}
                    style={{ objectFit: "contain" }}
                  />
                </div>

                <p
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    color: engine.highlight
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                    textAlign: "center",
                    lineHeight: 1.35,
                  }}
                >
                  {engine.label}
                </p>
                {engine.name === "LUNA" && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ marginTop: "0.25rem" }}
                  >
                    <path
                      d="M4 6C4 6 6 8 8 8C10 8 12 6 12 6"
                      stroke="var(--text-tertiary)"
                      strokeWidth="1.5"
                    />
                    <circle cx="8" cy="10" r="2" stroke="var(--text-tertiary)" strokeWidth="1.5" />
                  </svg>
                )}
              </div>

              {/* Arrow */}
              {i < engines.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingTop: 76,
                    color: "var(--text-tertiary)",
                  }}
                >
                  <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                    <path
                      d="M0 5H16M16 5L12 1M16 5L12 9"
                      stroke="currentColor"
                      strokeWidth="1.25"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pipeline descriptions row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.75rem",
            marginTop: "1rem",
            borderTop: "1px solid var(--bg-border)",
            paddingTop: "1rem",
          }}
        >
          {engines.map((engine) => (
            <p
              key={engine.id}
              style={{
                fontSize: "0.6875rem",
                lineHeight: 1.45,
                color: engine.highlight
                  ? "var(--accent)"
                  : "var(--text-tertiary)",
              }}
            >
              {engine.desc}
            </p>
          ))}
        </div>

        <Link
          href="https://github.com/jourdanlabs/benchmarks"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            marginTop: "1.5rem",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "var(--text-primary)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          github.com/jourdanlabs/benchmarks
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M1 6H11M11 6L7 2M11 6L7 10"
              stroke="currentColor"
              strokeWidth="1.25"
            />
          </svg>
        </Link>
      </section>

      {/* Core Design Principles */}
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "2.5rem 2rem 3rem",
        }}
      >
        <p className="smallcaps" style={{ marginBottom: "1.75rem" }}>
          CORE DESIGN PRINCIPLES
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {principles.map((p) => (
            <div
              key={p.title}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--bg-border)",
                borderRadius: 10,
                padding: "1.5rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "0.875rem",
                }}
              >
                {p.icon}
              </div>
              <h3
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                  lineHeight: 1.3,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: "0.75rem",
                  lineHeight: 1.5,
                  color: "var(--text-tertiary)",
                }}
              >
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Access CTA */}
      <section
        style={{
          backgroundColor: "var(--text-primary)",
          padding: "2.5rem 2rem",
          marginTop: "1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <p
            className="smallcaps"
            style={{ color: "var(--accent)", marginBottom: "1rem" }}
          >
            ACCESS
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <p
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.55,
                color: "#F0E7D5",
                maxWidth: 420,
              }}
            >
              COSMIC is not a general-purpose API.
              <br />
              It is the proprietary engine layer for JourdanLabs division
              products.
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "#3A3630",
                color: "#F0E7D5",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "0.875rem 1.5rem",
                borderRadius: 4,
                transition: "background-color 0.2s",
              }}
            >
              Request a Vantage Scan
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 6H11M11 6L7 2M11 6L7 10"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Inline Footer */}
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
    </div>
  );
}
