import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ATLAS Division — Real-Asset Intelligence",
  description:
    "Minerals, ownership, commodity flow. Deep ownership inference and commodity-flow modeling for real-asset markets.",
};

const products = [
  {
    name: "MineralLogic",
    desc: "Mineral rights ownership graph. ~8M structured records across Texas and beyond.",
    vantage: "88.5%",
    status: null,
  },
  {
    name: "PropertyGraph",
    desc: "Real estate ownership and transaction graph.",
    vantage: "88.9%",
    status: null,
  },
  {
    name: "NAUTILUS",
    desc: "Global commodity intelligence. LNG wedge, U.S. Gulf Coast to Asia-Pacific focus.",
    vantage: "81.5%",
    status: "In Development",
  },
];

export default function AtlasPage() {
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
          <span style={{ color: "var(--text-primary)" }}>ATLAS</span>
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
            Real-asset intelligence.
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              marginBottom: "0.75rem",
            }}
          >
            Minerals, ownership, commodity flow.
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
            ATLAS specializes in deep ownership inference and commodity-flow
            modeling for real-asset markets. The division reconstructs ownership
            graphs across mineral rights, real estate, and commodity logistics —
            domains where provenance matters and a wrong answer can mean a wrong
            investment.
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: 460,
            }}
          >
            Built on COSMIC, validated on the CITADEL and internal ATLAS
            benchmarks. Every claim is grounded against a sealed corpus of public
            records, filings, and transaction data.
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
            [IMAGE: rough mineral ore crystal cluster on stone pedestal]
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
            className="products-grid"
          >
            {products.map((p) => (
              <div
                key={p.name}
                style={{
                  backgroundColor: "var(--bg-card)",
                  padding: "2rem",
                  borderRadius: "8px",
                  opacity: p.status ? 0.75 : 1,
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
                    {p.name}
                  </span>
                  {p.status && (
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
                      {p.status}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                  }}
                >
                  {p.desc}
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
                    {p.vantage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Validation Receipts */}
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
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
                marginBottom: "0.5rem",
              }}
            >
              Validation Receipts
            </span>
            <p
              style={{
                fontSize: "0.8125rem",
                fontFamily: "var(--font-geist-mono), monospace",
                color: "var(--text-tertiary)",
              }}
            >
              Sealed corpus · BCa CI B=2000 · per-task scores
            </p>
          </div>
          <Link
            href="/crucible/vantage"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--text-primary)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Full validation methodology
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
          .products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </article>
  );
}
