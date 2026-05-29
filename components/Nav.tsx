"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/cosmic", label: "COSMIC" },
  { href: "/bifrost", label: "BIFROST" },
  { href: "/alchemist", label: "ALCHEMIST" },
  { href: "/omnis", label: "OMNIS" },
  { href: "/divisions/hygeia", label: "HYGEIA" },
  { href: "/divisions/helix", label: "HELIX" },
  { href: "/divisions", label: "Divisions" },
  { href: "/crucible", label: "Crucible" },
  { href: "/applications", label: "Applications" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const activeHref =
    links
      .filter((l) => pathname === l.href || pathname.startsWith(`${l.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? "";

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Link href="/" className="brand-mark">
          <Image src="/brand/baby-pulsar-flag.png" alt="" width={36} height={36} />
          JOURDANLABS
        </Link>

        <nav className="nav-links">
          {links.map((l) => {
            const active = l.href === activeHref;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link${active ? " active" : ""}`}
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
