import Link from "next/link";

export interface DivisionCardProps {
  name: string;
  tagline: string;
  products: string;
  headline: string;
  href: string;
  accent?: string;
}

export default function DivisionCard({
  name,
  tagline,
  products,
  headline,
  href,
  accent = "var(--accent)",
}: DivisionCardProps) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "1.75rem",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--bg-border)",
        borderTop: `2px solid ${accent}`,
        textDecoration: "none",
        transition: "border-color 0.15s",
        gap: "0.75rem",
      }}
    >
      <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accent }}>
        {name}
      </div>
      <div style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", lineHeight: 1.5 }}>
        {tagline}
      </div>
      <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
        {headline}
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", lineHeight: 1.5 }}>
        {products}
      </div>
      <div style={{ fontSize: "0.8125rem", color: accent, marginTop: "auto", paddingTop: "0.5rem" }}>
        Explore →
      </div>
    </Link>
  );
}
