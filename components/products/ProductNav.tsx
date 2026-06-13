// ProductNav — the entire navigation. Two products, nothing else.
//
// Replaces the old five-link demo strip (DemoNav). Plain names, no engine words.
// A quiet wordmark + two destinations: LOOPER and NORTH POLE. 🐦‍⬛ + 🔑

import Link from "next/link";

const T = {
  ink: "#e7e7ea",
  faint: "#9aa0ac",
  accent: "#9fb4ff",
  mono: "var(--font-mono, ui-monospace, monospace)",
};

const LINKS = [
  { href: "/looper", label: "LOOPER" },
  { href: "/north-pole", label: "NORTH POLE" },
] as const;

/** `current` = this page's href, so its tab reads active. */
export function ProductNav({ current }: { current?: string }) {
  return (
    <nav
      style={{
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: "2.2rem",
        fontFamily: T.mono,
        fontSize: 12,
      }}
    >
      <Link
        href="/"
        style={{
          color: T.faint,
          fontWeight: 700,
          letterSpacing: "0.12em",
          marginRight: 14,
          textDecoration: "none",
        }}
      >
        JOURDANLABS
      </Link>
      {LINKS.map((l) => {
        const on = current === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            style={{
              color: on ? "#0a0c14" : T.ink,
              background: on ? T.accent : "transparent",
              border: `1px solid ${on ? T.accent : "#2a2d3a"}`,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textDecoration: "none",
              padding: "5px 14px",
              borderRadius: 999,
            }}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
