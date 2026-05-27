"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/cosmic", label: "COSMIC" },
  { href: "/alchemist", label: "ALCHEMIST" },
  { href: "/omnis", label: "OMNIS" },
  { href: "/divisions", label: "Divisions" },
  { href: "/crucible", label: "Crucible" },
  { href: "/applications", label: "Applications" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Link href="/" className="brand-mark">
          <Image src="/brand/baby-pulsar-flag.png" alt="" width={36} height={36} />
          JOURDANLABS
        </Link>

        <nav className="nav-links">
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname.startsWith(l.href));
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
