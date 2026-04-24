import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "HELIX Division — Healthcare Workflow Automation",
  description:
    "HELIX applies COSMIC to healthcare workflow automation. Clinical routing, documentation, pharmacovigilance.",
};

export default function HelixPage() {
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
          <span style={{ color: "var(--text-primary)" }}>HELIX</span>
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
            HELIX
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
            Healthcare workflow automation.
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
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: 460,
            }}
          >
            HELIX applies the COSMIC reasoning substrate to healthcare workflow —
            clinical routing, documentation assistance, and pharmacovigilance-grade
            signal detection. Built for the regulatory reality of healthcare, not
            against it.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/05_heimdall_shield-Lhnlz7aGUYpjPipmwkQbwTmM4wyC5G.png"
            alt="HELIX DNA artifact"
            width={420}
            height={400}
            style={{ objectFit: "contain" }}
          />
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {/* HELIX */}
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
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "0.04em",
                  }}
                >
                  HELIX
                </span>
                <span
                  style={{
                    fontSize: "0.625rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#fff",
                    backgroundColor: "var(--accent)",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontFamily: "var(--font-geist-mono), monospace",
                  }}
                >
                  TestFlight
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
                Clinical workflow automation application. Task routing,
                documentation triage, and care coordination support. Currently in
                TestFlight evaluation with clinical partners.
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
                  VANTAGE SCORE:
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-geist-mono), monospace",
                    color: "var(--accent)",
                    fontWeight: 600,
                  }}
                >
                  81.5%
                </span>
              </div>
            </div>

            {/* PHAROS */}
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
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "0.04em",
                  }}
                >
                  PHAROS
                </span>
                <span
                  style={{
                    fontSize: "0.625rem",
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
                  In Development
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                Pharmacovigilance signal detection for clinical environments. Built
                on the SIGNAL benchmark research track. Designed for regulatory
                submission requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Thesis */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "4rem 2rem",
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
            Thesis
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
            Healthcare requires honest refusal.
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              marginBottom: "1rem",
            }}
          >
            Healthcare AI that guesses confidently about clinical decisions is not
            better than no AI — it is actively dangerous. The AURORA confidence
            gate is especially important in clinical contexts: HELIX refuses to
            route or classify when aggregate confidence falls below threshold,
            surfacing the ambiguous case to a human clinician rather than emitting
            a verdict.
          </p>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
            }}
          >
            PHAROS extends this posture to pharmacovigilance: adverse drug event
            signals require SHA-verified chain of custody from source document to
            regulatory submission.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src="/aurora-lockbox.jpg"
            alt="AURORA confidence gate"
            width={320}
            height={280}
            style={{ objectFit: "contain" }}
          />
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          borderTop: "1px solid var(--bg-border)",
          borderBottom: "1px solid var(--bg-border)",
          padding: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link
            href="/benchmarks/signal"
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
            See SIGNAL benchmark
            <span>→</span>
          </Link>
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
        }
      `}</style>
    </article>
  );
}
