"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// OMNIS lifecycle order: specify → verify → discover → remember.
const omnis = [
  { href: "/omnis/cadmus", label: "CADMUS" },
  { href: "/omnis/vantage", label: "VANTAGE" },
  { href: "/omnis/prospector", label: "PROSPECTOR" },
  { href: "/omnis/luna", label: "LUNA" },
];

// Keep priority divisions first, then the broader product portfolio.
const divisions = [
  { href: "/divisions/helix", label: "HELIX" },
  { href: "/divisions/heimdall", label: "HEIMDALL" },
  { href: "/alchemist", label: "ALCHEMIST" },
  { href: "/divisions/atlas", label: "ATLAS" },
  { href: "/bacchus", label: "BACCHUS" },
  { href: "/divisions/hygeia", label: "HYGEIA" },
  { href: "/crucible", label: "CRUCIBLE" },
];

const lead = [
  { href: "/cosmic", label: "COSMIC" },
  { href: "/bifrost", label: "BIFROST" },
  { href: "/map-the-soul", label: "MAP THE SOUL" },
];

const tail = [
  { href: "/team", label: "Team" },
  { href: "/applications", label: "Applications" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const omnisActive = pathname === "/omnis" || pathname.startsWith("/omnis/");
  const divisionsActive =
    pathname === "/divisions" || pathname.startsWith("/divisions/") || divisions.some((d) => isActive(d.href));

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Link href="/" className="brand-mark">
          <Image src="/brand/baby-pulsar-flag.png" alt="" width={36} height={36} />
          JOURDANLABS
        </Link>

        <nav className="nav-links">
          {lead.map((l) => (
            <Link key={l.href} href={l.href} className={`nav-link${isActive(l.href) ? " active" : ""}`}>
              {l.label}
            </Link>
          ))}

          <div className="nav-dropdown">
            <Link href="/omnis" className={`nav-link nav-dropdown-trigger${omnisActive ? " active" : ""}`} aria-haspopup="true">
              OMNIS <span aria-hidden="true">▾</span>
            </Link>
            <div className="nav-dropdown-menu">
              {omnis.map((o) => (
                <Link key={o.href} href={o.href} className={`nav-dropdown-item${isActive(o.href) ? " active" : ""}`}>
                  {o.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="nav-dropdown">
            <Link href="/divisions" className={`nav-link nav-dropdown-trigger${divisionsActive ? " active" : ""}`} aria-haspopup="true">
              Divisions <span aria-hidden="true">▾</span>
            </Link>
            <div className="nav-dropdown-menu">
              {divisions.map((d) => (
                <Link key={d.href} href={d.href} className={`nav-dropdown-item${isActive(d.href) ? " active" : ""}`}>
                  {d.label}
                </Link>
              ))}
            </div>
          </div>

          {tail.map((l) => (
            <Link key={l.href} href={l.href} className={`nav-link${isActive(l.href) ? " active" : ""}`}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
