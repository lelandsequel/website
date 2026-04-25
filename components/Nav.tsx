"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/cosmic", label: "COSMIC" },
  { href: "/benchmarks", label: "Benchmarks" },
  { href: "/methodology", label: "Methodology" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
          width: "92%",
          maxWidth: 1600,
          margin: "0 auto",
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

        {/* Desktop nav */}
        <nav className="desktop-nav" style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
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

        {/* Mobile hamburger button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            width: 40,
            height: 40,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
          }}
        >
          <span
            style={{
              display: "block",
              width: 22,
              height: 2,
              backgroundColor: "var(--text-primary)",
              transition: "transform 0.3s, opacity 0.3s",
              transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 2,
              backgroundColor: "var(--text-primary)",
              transition: "opacity 0.3s",
              opacity: isOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 2,
              backgroundColor: "var(--text-primary)",
              transition: "transform 0.3s, opacity 0.3s",
              transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className="mobile-menu"
        style={{
          position: "fixed",
          top: 72,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "var(--bg)",
          display: "none",
          flexDirection: "column",
          padding: "2rem",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsOpen(false)}
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: active ? "var(--accent)" : "var(--text-primary)",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid var(--bg-border)",
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
