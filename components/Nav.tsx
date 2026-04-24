"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/divisions", label: "Divisions" },
  { href: "/crucible", label: "Benchmarks" },
  { href: "/cosmic", label: "COSMIC" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header
      style={{
        borderBottom: "1px solid var(--bg-border)",
        backgroundColor: "var(--bg)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-geist-sans), 'Inter', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "0.8125rem",
            letterSpacing: "0.22em",
            color: "var(--text-primary)",
            textTransform: "uppercase",
          }}
        >
          JOURDANLABS
        </Link>

        <nav style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  transition: "color 0.2s",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
