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
      className="division-card"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "1.2rem",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--bg-border)",
        borderLeft: `5px solid ${accent}`,
        borderRadius: 18,
        boxShadow: "var(--soft-shadow)",
        textDecoration: "none",
        transition: "border-color 0.15s, transform 0.15s",
        gap: "0.75rem",
        minHeight: 210,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
        <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: accent }}>
          {name}
        </div>
        <div style={{ width: 30, height: 30, borderRadius: 11, background: `${accent}18`, color: accent, display: "grid", placeItems: "center", fontWeight: 950 }}>
          ✓
        </div>
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", lineHeight: 1.5, fontWeight: 800 }}>
        {tagline}
      </div>
      <div style={{ fontSize: "1.24rem", fontWeight: 950, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1.08 }}>
        {headline}
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
        {products}
      </div>
      <div style={{ fontSize: "0.82rem", color: accent, marginTop: "auto", paddingTop: "0.5rem", fontWeight: 900 }}>
        Explore →
      </div>
    </Link>
  );
}
