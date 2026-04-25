import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BACCHUS Division — Luxury Hospitality Market Intelligence",
  description:
    "Two products live. 1,800+ premium venues. Structured market intelligence for global luxury hospitality.",
};

const products = [
  {
    name: "COSMIX",
    desc: "Premium venue intelligence platform. 1,800+ luxury hospitality venues with structured market data.",
    url: "bacchusintel.com/cosmix",
    status: "live",
  },
  {
    name: "BACCHUS RUSH",
    desc: "Rapid-deployment market intelligence for luxury beverage portfolios.",
    url: "bacchusrush.com",
    status: "live",
  },
  {
    name: "BACCHUS Trade",
    desc: "B2B trading platform for luxury beverage inventory and allocation.",
    status: "development",
  },
  {
    name: "BACCHUS Cellar",
    desc: "Cellar logistics and inventory management for premium collections.",
    status: "development",
  },
  {
    name: "BACCHUS Atlas",
    desc: "Geographic market intelligence and venue mapping for expansion planning.",
    status: "development",
  },
];

export default function BacchusPage() {
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
          <span style={{ color: "var(--text-primary)" }}>BACCHUS</span>
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
            Luxury hospitality market intelligence.
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              marginBottom: "0.75rem",
            }}
          >
            Two products live. 1,800+ premium venues.
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
            BACCHUS serves the global luxury hospitality sector with structured
            market intelligence on premium venues, beverage portfolios, and cellar
            logistics. The division is the strongest commercial proof point in the
            JourdanLabs portfolio — two products live in production, deployed
            across over 1,800 luxury venues.
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: 460,
            }}
          >
            Built on COSMIC. Every market claim is grounded against a sealed
            corpus of venue data, transaction records, and industry benchmarks.
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
            [IMAGE: classical wine chalice with grape cluster on stone pedestal]
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

          {/* Live products row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
            className="products-grid-2"
          >
            {products
              .filter((p) => p.status === "live")
              .map((p) => (
                <div
                  key={p.name}
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
                      {p.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.5625rem",
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
                      LIVE
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
                    {p.desc}
                  </p>
                  {p.url && (
                    <div
                      style={{
                        paddingTop: "1rem",
                        borderTop: "1px solid var(--bg-border)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.8125rem",
                          fontFamily: "var(--font-geist-mono), monospace",
                          color: "var(--accent)",
                        }}
                      >
                        {p.url}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* In development row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
            className="products-grid-3"
          >
            {products
              .filter((p) => p.status === "development")
              .map((p) => (
                <div
                  key={p.name}
                  style={{
                    backgroundColor: "var(--bg-card)",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    opacity: 0.7,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {p.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.5rem",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--text-tertiary)",
                        backgroundColor: "var(--bg-muted)",
                        padding: "0.2rem 0.4rem",
                        borderRadius: "3px",
                        fontFamily: "var(--font-geist-mono), monospace",
                        border: "1px solid var(--bg-border)",
                      }}
                    >
                      In Development
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-tertiary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              ))}
          </div>
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
          .products-grid-2 { grid-template-columns: 1fr !important; }
          .products-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </article>
  );
}
