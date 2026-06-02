import type { Metadata } from "next";
import Link from "next/link";
import CadmusTool from "./CadmusTool";

export const metadata: Metadata = {
  title: "CADMUS — Spec & Prompt Generator",
  description:
    "CADMUS turns messy intent into a buildable spec and a ready-to-paste LLM prompt — with grounding and refuse-when-underspecified discipline baked in. Free to use.",
};

const accent = "#6f38ff";

export default function CadmusPage() {
  return (
    <main style={{ maxWidth: 1140, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      <Link href="/omnis/cadmus" className="back-link">
        <span aria-hidden="true">←</span> CADMUS
      </Link>

      <section style={{ maxWidth: 720, marginBottom: "2rem" }}>
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.6875rem",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: accent,
            display: "block",
            marginBottom: "0.9rem",
          }}
        >
          CADMUS · Spec &amp; Prompt Generator
        </span>
        <h1
          style={{
            fontSize: "clamp(1.9rem, 4.6vw, 2.9rem)",
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.08,
            color: "var(--text-primary)",
            marginBottom: "1rem",
          }}
        >
          Messy intent → a spec the machine can build.
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Describe what you&apos;re trying to do. CADMUS forces it into a real spec — objective, testable
          acceptance criteria, explicit non-goals, constraints — and hands you a{" "}
          <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>ready-to-paste LLM prompt</strong> with the
          grounding and <em>refuse-when-underspecified</em> discipline built in. Runs entirely in your browser. No
          account, no keys, nothing leaves the page.
        </p>
      </section>

      <CadmusTool />

      <p
        style={{
          marginTop: "1.5rem",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.72rem",
          color: "var(--text-tertiary)",
          letterSpacing: "0.02em",
        }}
      >
        Deterministic — same inputs, same spec. The structure is the point: it makes whatever model you paste it into
        answer in scope, grounded, and honest about what it can&apos;t do. 🐦‍⬛ + 🔑
      </p>
    </main>
  );
}
