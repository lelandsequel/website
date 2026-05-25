import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RAVEN — CRUCIBLE",
  description: "RAVEN is a next-generation research initiative within the CRUCIBLE division.",
};

export default function RavenPage() {
  return (
    <article style={{ padding: "6rem 0", minHeight: "60vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 2rem" }}>
        <Link href="/crucible" style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2.5rem" }}>← CRUCIBLE</Link>

        <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "1rem" }}>
          CRUCIBLE / RAVEN
        </div>

        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "1.5rem" }}>
          RAVEN
        </h1>

        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "3rem", maxWidth: 520 }}>
          RAVEN is a next-generation research initiative within CRUCIBLE.
          Details will be published when the program is ready for external visibility.
        </p>

        <div style={{ borderTop: "1px solid var(--bg-border)", paddingTop: "2rem" }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", fontStyle: "italic" }}>
            RAVEN is named after Raven Lenore (2000–2020).
          </p>
        </div>
      </div>
    </article>
  );
}
