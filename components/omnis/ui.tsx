// OMNIS design system — the shared visual language for every demo surface.
//
// One source of truth: dark-canvas tokens + a small set of presentational
// components, all inline-styled (works in server components, no css-module
// drift). Every demo page (CADMUS / loop / factory / the flagship) re-skins
// onto these so the whole factory reads like one product at the /6d bar.
//
// The chamber palette: periwinkle accent, green = pass/ship, gold = budget/
// highlight, alarm = refuse. The frontier ("where an LLM is still required") is
// a FIRST-CLASS component here, not a footnote — it's the differentiator. 🐦‍⬛ + 🔑

import type { CSSProperties, ReactNode } from "react";

// ── tokens ───────────────────────────────────────────────────────────────────
export const T = {
  bg: "#0c0e15",
  surface: "rgba(20,22,31,0.55)",
  border: "#2a2d3a",
  ink: "#e7e7ea",
  muted: "#bcc0cc",
  faint: "#9aa0ac",
  accent: "#9fb4ff", // periwinkle — primary
  green: "#6fe0a8", // pass / ship / closed
  gold: "#f0c869", // budget / highlight
  red: "#f08a8a", // refuse / alarm
  mono: "var(--font-mono, ui-monospace, monospace)",
  sans: "var(--font-sans, Inter, system-ui, sans-serif)",
  maxW: 1040,
} as const;

// ── style helpers ──────────────────────────────────────────────────────────
export const pillStyle = (col: string): CSSProperties => ({
  fontFamily: T.mono,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.04em",
  padding: "2px 8px",
  borderRadius: 999,
  background: `${col}1a`,
  color: col,
  border: `1px solid ${col}55`,
  whiteSpace: "nowrap",
  display: "inline-block",
});
export const cardStyle: CSSProperties = {
  border: `1px solid ${T.border}`,
  background: T.surface,
  borderRadius: 12,
  padding: "0.9rem 1.05rem",
};

// ── components ───────────────────────────────────────────────────────────────

/** Full-bleed dark canvas + centered column. Wraps every demo page. */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.ink, fontFamily: T.sans }}>
      <main style={{ maxWidth: T.maxW, margin: "0 auto", padding: "3rem 1.25rem 5rem" }}>{children}</main>
    </div>
  );
}

export function Pill({ color = T.accent, children }: { color?: string; children: ReactNode }) {
  return <span style={pillStyle(color)}>{children}</span>;
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...cardStyle, ...style }}>{children}</div>;
}

export function Hero({
  kicker,
  title,
  chip,
  children,
}: {
  kicker: string;
  title: ReactNode;
  chip?: string;
  children?: ReactNode;
}) {
  return (
    <header style={{ marginBottom: "2.4rem" }}>
      <p style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: T.accent, margin: "0 0 0.8rem" }}>
        {kicker}
      </p>
      <h1 style={{ fontSize: "clamp(2rem,5vw,3.1rem)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.05, margin: "0 0 0.4rem" }}>
        {title}
        {chip && <span style={{ ...pillStyle(T.gold), marginLeft: 12, verticalAlign: "middle" }}>{chip}</span>}
      </h1>
      {children && (
        <p style={{ color: T.muted, fontSize: "1.06rem", lineHeight: 1.6, maxWidth: "64ch", margin: "0.8rem 0 0" }}>{children}</p>
      )}
    </header>
  );
}

export function Section({
  label,
  title,
  color = T.accent,
  children,
}: {
  label: string;
  title?: ReactNode;
  color?: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: "2.2rem" }}>
      <h2 style={{ fontSize: "0.78rem", fontFamily: T.mono, letterSpacing: "0.12em", textTransform: "uppercase", color, margin: "0 0 0.5rem" }}>
        {label}
      </h2>
      {title && <p style={{ color: T.muted, fontSize: "0.95rem", margin: "0 0 1rem", maxWidth: "66ch" }}>{title}</p>}
      {children}
    </section>
  );
}

/** A monospace receipt strip: label/value pairs. */
export function ReceiptBar({ items }: { items: Array<{ label: string; value: ReactNode; color?: string }> }) {
  return (
    <div style={{ ...cardStyle, display: "flex", gap: "1.6rem", flexWrap: "wrap", fontFamily: T.mono, fontSize: 12.5 }}>
      {items.map((it, i) => (
        <span key={i} style={{ color: T.muted }}>
          {it.label} <strong style={{ color: it.color ?? T.ink }}>{it.value}</strong>
        </span>
      ))}
    </div>
  );
}

/**
 * THE FRONTIER — first-class. Names exactly where an LLM is still required.
 * This is the honesty made visible: stat row + the per-item list, in the green
 * "trustworthy" frame. Never a footnote.
 */
export function FrontierPanel({
  stats,
  items,
}: {
  stats: Array<{ n: number | string; label: string }>;
  items: string[];
}) {
  return (
    <div style={{ ...cardStyle, borderColor: `${T.green}55`, background: `${T.green}0d` }}>
      <div style={{ display: "flex", gap: "1.6rem", marginBottom: "0.8rem", flexWrap: "wrap", fontFamily: T.mono, fontSize: 12.5, color: T.muted }}>
        {stats.map((s, i) => (
          <span key={i}>
            <strong style={{ color: T.ink, fontSize: 18 }}>{s.n}</strong> {s.label}
          </span>
        ))}
      </div>
      <ul style={{ margin: 0, paddingLeft: "1.1rem", color: T.muted, fontSize: "0.92rem", lineHeight: 1.65 }}>
        {items.map((f, i) => (
          <li key={i} style={{ marginBottom: 4 }}>{f}</li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ children }: { children: ReactNode }) {
  return (
    <footer style={{ borderTop: `1px solid ${T.border}`, paddingTop: "1.4rem", color: T.faint, fontSize: "0.88rem", lineHeight: 1.6 }}>
      {children}
    </footer>
  );
}
