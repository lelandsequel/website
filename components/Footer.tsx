import Link from "next/link";

const footerSections = [
  {
    label: "Platform",
    links: [
      { href: "/cosmic", label: "COSMIC" },
      { href: "/bifrost", label: "BIFROST" },
      { href: "/northstar", label: "NORTHSTAR" },
      { href: "/alchemist", label: "ALCHEMIST" },
      { href: "/omnis", label: "OMNIS" },
      { href: "/divisions", label: "Divisions" },
    ],
  },
  {
    label: "Crucible",
    links: [
      { href: "/crucible", label: "Overview" },
      { href: "/crucible/vantage", label: "VANTAGE" },
      { href: "/crucible/benchmarks", label: "Benchmarks" },
      { href: "/crucible/methodology", label: "Methodology" },
      { href: "/crucible/reproducibility", label: "Reproducibility" },
    ],
  },
  {
    label: "Divisions",
    links: [
      { href: "/divisions/atlas", label: "ATLAS" },
      { href: "/bacchus", label: "BACCHUS" },
      { href: "/divisions/helix", label: "HELIX" },
      { href: "/divisions/heimdall", label: "HEIMDALL" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div style={{ fontWeight: 950, fontSize: "1.1rem", letterSpacing: "-0.04em", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              JOURDANLABS
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", marginBottom: "0.25rem" }}>
              Houston, TX · Deterministic AI infrastructure
            </div>
            <a href="https://github.com/jourdanlabs" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>
              GitHub →
            </a>
          </div>

          {footerSections.map((section) => (
            <div key={section.label}>
              <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.875rem" }}>
                {section.label}
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {section.links.map((l) => (
                  <Link key={l.href} href={l.href} style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
            © 2026 JourdanLabs. We optimize for truth: sealed corpora, audit trails, honest refusal.
          </span>
          <a href="mailto:leland@jourdanlabs.com" style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
            leland@jourdanlabs.com
          </a>
        </div>
      </div>
    </footer>
  );
}
