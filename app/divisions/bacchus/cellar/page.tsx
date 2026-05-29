import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BacchusCellarRunner from "@/components/BacchusCellarRunner";

export const metadata: Metadata = {
  title: "BACCHUS Cellar Intelligence - Premium Spirits Distribution",
  description:
    "BACCHUS Cellar Intelligence scores premium spirits accounts, creates staff training packets, tracks depletion cadence, and refuses unsupported distributor claims.",
};

const accent = "#7D2348";
const gold = "#D7B46A";

export default function BacchusCellarPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 3rem", borderBottom: "1px solid var(--bg-border)", borderTop: `2px solid ${accent}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 2rem" }}>
          <Link href="/bacchus" className="back-link">
            <span aria-hidden="true">←</span>
            BACCHUS
          </Link>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) 260px", gap: "2rem", alignItems: "center" }}>
            <div>
              <span style={labelStyle}>BACCHUS · Cellar Intelligence</span>
              <h1 style={{ margin: "0.9rem 0 1rem", color: "var(--text-primary)", fontSize: "clamp(2.4rem, 6vw, 5rem)", lineHeight: 0.94, fontWeight: 950, letterSpacing: "-0.055em" }}>
                Premium spirits placement with proof.
              </h1>
              <p style={{ maxWidth: 760, color: "var(--text-secondary)", fontSize: "1.06rem", lineHeight: 1.72, margin: 0 }}>
                Built for high-end liquor distributors: account fit, first move, staff education,
                depletion cadence, refusal boundaries, and copyable supplier-ready briefs.
              </p>
            </div>
            <div style={{ display: "grid", justifyItems: "center", gap: "0.7rem", padding: "1rem", border: "1px solid var(--bg-border)", borderRadius: 22, background: "rgba(255,255,255,0.82)", boxShadow: "var(--soft-shadow)" }}>
              <Image src="/brand/baby-pulsar-speech.png" alt="Baby PULSAR" width={190} height={190} style={{ width: "min(190px, 80%)", height: "auto" }} />
              <span style={{ ...labelStyle, color: gold }}>Distributor gate online</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "3rem 0 5rem" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 2rem" }}>
          <BacchusCellarRunner />
        </div>
      </section>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  color: accent,
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: "0.72rem",
  fontWeight: 950,
  letterSpacing: "0.13em",
  textTransform: "uppercase",
};
