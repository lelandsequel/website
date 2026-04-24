"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/cosmic", label: "COSMIC" },
  { href: "/divisions", label: "Divisions" },
  { href: "/crucible", label: "Crucible" },
  { href: "/applications", label: "Applications" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header
      style={{
        borderBottom: "1px solid var(--bg-border)",
        backgroundColor: "rgba(14,15,19,0.96)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.12em",
            color: "var(--text-primary)",
            textTransform: "uppercase",
          }}
        >
          JOURDANLABS
        </Link>

        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  transition: "color 0.15s",
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
