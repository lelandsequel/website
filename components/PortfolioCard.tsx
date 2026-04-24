import Link from "next/link";

interface Props {
  name: string;
  description: string;
  number: string;
  numberLabel?: string;
  href: string;
  isDemo?: boolean;
}

export default function PortfolioCard({ name, description, number, numberLabel, href, isDemo }: Props) {
  return (
    <div
      style={{
        border: "1px solid var(--bg-border)",
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        backgroundColor: "var(--bg-card)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
          }}
        >
          {name}
        </div>
        {isDemo && (
          <span
            style={{
              fontSize: "0.625rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent)",
              border: "1px solid var(--accent-border)",
              padding: "0.125rem 0.5rem",
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            CAPABILITY DEMO
          </span>
        )}
      </div>

      <div
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "1.875rem",
          fontWeight: 700,
          color: "var(--accent)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {number}
      </div>

      {numberLabel && (
        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "-0.5rem" }}>
          {numberLabel}
        </div>
      )}

      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
        {description}
      </p>

      <Link
        href={href}
        style={{
          fontSize: "0.8125rem",
          color: "var(--accent)",
          marginTop: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        Read the writeup →
      </Link>
    </div>
  );
}
