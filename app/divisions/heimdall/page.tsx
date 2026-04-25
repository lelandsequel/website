import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HEIMDALL Division — Security Operations & Compliance",
  description:
    "Trust scoring. Confidence-gated triage. Security operations and compliance reasoning for regulated enterprise.",
};

export default function HeimdallPage() {
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
          <Link href="/portfolio" style={{ color: "var(--text-secondary)" }}>
            DIVISIONS
          </Link>
          <span style={{ color: "var(--text-tertiary)" }}>/</span>
          <span style={{ color: "var(--text-primary)" }}>HEIMDALL</span>
        </div>
      </div>

      {/* Hero */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "2rem 2rem 4rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "center",
        }}
        className="hero-grid"
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
            DIVISION
          </span>
          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Security operations & compliance.
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              marginBottom: "0.75rem",
            }}
          >
            Trust scoring. Confidence-gated triage.
          </p>
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
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: 460,
              marginBottom: "1rem",
            }}
          >
            HEIMDALL handles security operations triage and compliance reasoning.
            Designed for regulated enterprise and defense verticals where a wrong
            answer that looks right is a liability.
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: 460,
              marginBottom: "1rem",
            }}
          >
            The division applies the same confidence-gated posture as the rest of
            JourdanLabs: the system refuses to route or classify when aggregate
            confidence falls below threshold, surfacing the ambiguous case to a
            human analyst rather than emitting a verdict.
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: 460,
            }}
          >
            Built on COSMIC. Validated on the SENTINEL benchmark.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {/* Placeholder for sculptural hero image */}
          <div
            style={{
              width: 400,
              height: 380,
              backgroundColor: "#A8A095",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.75rem",
              color: "#1F1B16",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            [IMAGE: shield with keyhole/gate motif on stone pedestal]
          </div>
        </div>
      </section>

      {/* Products */}
      <section
        style={{
          backgroundColor: "var(--bg-muted)",
          padding: "4rem 2rem",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              display: "block",
              marginBottom: "1.5rem",
            }}
          >
            Products
          </span>
          <div style={{ maxWidth: 560 }}>
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                padding: "2rem",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "0.04em",
                  }}
                >
                  SENTINEL
                </span>
                <span
                  style={{
                    fontSize: "0.5625rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                    backgroundColor: "var(--bg-muted)",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontFamily: "var(--font-geist-mono), monospace",
                    border: "1px solid var(--bg-border)",
                  }}
                >
                  Pre-Pilot
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                }}
              >
                SOC triage and incident response. Classifies and routes security
                alerts with confidence-gated output. Currently in pre-pilot with a
                partner organization.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--bg-border)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontFamily: "var(--font-geist-mono), monospace",
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.06em",
                  }}
                >
                  HELD-OUT ACCURACY:
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-geist-mono), monospace",
                    color: "var(--accent)",
                    fontWeight: 600,
                  }}
                >
                  94%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        <Link
          href="/crucible/benchmarks/sentinel"
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
          See SENTINEL benchmark
          <span>→</span>
        </Link>
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

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </article>
  );
}
