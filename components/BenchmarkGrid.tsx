import Link from "next/link";

export interface BenchmarkCell {
  name: string;
  number: string;
  context: string;
  href: string;
}

export const BENCHMARKS: BenchmarkCell[] = [
  {
    name: "SIGNAL",
    number: "F1 0.639",
    context: "24.3mo median · pharmacovigilance",
    href: "/crucible/benchmarks/signal",
  },
  {
    name: "CITADEL",
    number: "F1 0.616",
    context: "400/660 coverage · corporate hierarchy",
    href: "/crucible/benchmarks/citadel",
  },
  {
    name: "SENTINEL",
    number: "94.0%",
    context: "held-out accuracy · SOC triage",
    href: "/crucible/benchmarks/sentinel",
  },
  {
    name: "ORACLE",
    number: "51%",
    context: "vs 31% / 25% baselines · factual verification",
    href: "/crucible/benchmarks/oracle",
  },
  {
    name: "LENS",
    number: "25×",
    context: "vs grep · intent-based search",
    href: "/crucible/benchmarks/lens",
  },
  {
    name: "COMPASS",
    number: "15/15",
    context: "within-1-tier · reading-level calibration",
    href: "/crucible/benchmarks/compass",
  },
];

export default function BenchmarkGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        border: "1px solid var(--bg-border)",
      }}
    >
      {BENCHMARKS.map((b, i) => (
        <Link
          key={b.name}
          href={b.href}
          style={{
            display: "block",
            padding: "1.75rem",
            borderRight: (i + 1) % 3 !== 0 ? "1px solid var(--bg-border)" : "none",
            borderBottom: i < 3 ? "1px solid var(--bg-border)" : "none",
            textDecoration: "none",
            transition: "background 0.15s",
          }}
          className="benchmark-cell"
        >
          <div
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: "0.75rem",
            }}
          >
            {b.name}
          </div>
          <div
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--accent)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              marginBottom: "0.5rem",
            }}
          >
            {b.number}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-tertiary)",
              lineHeight: 1.5,
            }}
          >
            {b.context}
          </div>
        </Link>
      ))}
    </div>
  );
}
