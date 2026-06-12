import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import ProofTour from "@/components/tour/ProofTour";

const OG_DESC =
  "AI at scale has one failure under every theme: output that can't be grounded, refused, or audited. JourdanLabs built the deterministic, refusal-grounded cure — and six of its gates run live.";

export const metadata: Metadata = {
  title: "#6.1 — One disease. One cure. Six live proofs. | JourdanLabs",
  description: OG_DESC,
  robots: { index: false, follow: false },
  openGraph: {
    title: "One disease. One cure. Six live proofs.",
    description: OG_DESC,
    url: "https://jourdanlabs.com/proof",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "One disease. One cure. Six live proofs.",
    description: OG_DESC,
    images: ["/og.png"],
  },
};

const accent = "#6f38ff";

type Proof = {
  name: string;
  accent: string;
  surface: string;
  refuses: string;
  href: string;
};

const PROOFS: Proof[] = [
  {
    name: "HEIMDALL",
    accent: "#4A7BA7",
    surface: "Irreversible actions",
    refuses:
      "A $2.4M auto-wire, a prod-table delete, a deploy. It refuses, or escalates to a named human. There is no AUTHORIZE verdict in the engine — the human stays the trigger.",
    href: "https://jourdanlabs.com/omnis/heimdall",
  },
  {
    name: "WARDEN",
    accent: "#2d6cdf",
    surface: "Autonomous agents",
    refuses:
      "No agent runs unbound. A signed identity and a capability allowlist enforced at call time — or it is refused before it touches a tool.",
    href: "https://jourdanlabs.com/omnis/warden",
  },
  {
    name: "CUSTODIAN",
    accent: "#0e8f6e",
    surface: "Sensitive-data egress",
    refuses:
      "Classifies PII / PCI / MNPI, detects egress past the firm's perimeter, and refuses an uncontrolled export — no encryption, no need-to-know, no exit.",
    href: "https://jourdanlabs.com/omnis/custodian",
  },
  {
    name: "SUNSET",
    accent: "#d6552b",
    surface: "Retiring legacy systems",
    refuses:
      "Refuses to decommission anything still serving traffic or still depended on. A go / no-go gate that names the dependents, the owner, and the rollback.",
    href: "https://jourdanlabs.com/omnis/sunset",
  },
  {
    name: "ASSAY",
    accent: "#8a4fff",
    surface: "Shipping AI models",
    refuses:
      "Refuses a model reaching production without evaluation, fairness testing, monitoring, a rollback path, and a model card. Responsible-AI release, enforced.",
    href: "https://jourdanlabs.com/omnis/assay",
  },
  {
    name: "HERALD",
    accent: "#b5882b",
    surface: "Executive reporting",
    refuses:
      "Refuses any claim without a source, an as-of date, and a verifiable receipt. Every line cites its proof — or it gets cut before it reaches the cabinet.",
    href: "https://jourdanlabs.com/omnis/herald",
  },
];

const S: Record<string, CSSProperties> = {
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--bg-border)",
    borderRadius: 14,
    boxShadow: "var(--soft-shadow)",
    padding: "1.1rem 1.25rem",
  },
  mono: { fontFamily: "var(--font-geist-mono), monospace" },
};

export default function ProofPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pan-pulsar-thuglife.png"
        alt="Pan & PULSAR — the chamber, watching your six"
        style={{ position: "fixed", top: 10, right: 14, width: "clamp(82px, 10vw, 128px)", height: "auto", zIndex: 50, pointerEvents: "none", userSelect: "none", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.18))" }}
      />

      {/* HERO */}
      <section style={{ marginBottom: "1.75rem" }}>
        <span style={{ ...S.mono, fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, display: "block", marginBottom: "0.9rem" }}>
          JourdanLabs × GT 2026 · #6.1 — The Original Problem Statement · Internal preview
        </span>
        <h1 data-tour="thesis" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.08, color: "var(--text-primary)", marginBottom: "1rem", maxWidth: "20ch" }}>
          AI at scale has one disease. We built the cure — and it runs.
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "66ch" }}>
          Pick any theme — secure design, embedded AI, outcomes, simplification, employee experience. Underneath all
          of them is the <strong style={{ color: "var(--text-primary)" }}>same failure</strong>: AI and agents now produce
          output, take actions, and reach systems faster than anyone can verify. There is no substrate that makes that
          output <em>provable</em> — grounded in real evidence, refused when it can&apos;t be, and recorded on a
          tamper-evident trail.
        </p>
        <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "66ch", marginTop: "0.9rem" }}>
          <strong style={{ color: "var(--text-primary)" }}>COSMIC is that substrate.</strong> Deterministic — same input,
          same verdict, reproducible in any audit. Every decision cites its evidence or is refused. Every refusal lands
          on a hash-chained record. <strong style={{ color: "var(--text-primary)" }}>Zero runtime LLM calls in the
          decision path</strong>, so it cannot be talked out of a &ldquo;no.&rdquo; Below are six of its gates — each
          pointed at a decision the firm cannot afford to get wrong. <strong style={{ color: "var(--text-primary)" }}>All
          six run live. Click any one.</strong>
        </p>

        {/* 90-second path */}
        <div data-tour="substrate" style={{ ...S.card, marginTop: "1.5rem", padding: "1rem 1.2rem", borderColor: `${accent}40` }}>
          <div style={{ ...S.mono, fontSize: "0.64rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: accent, marginBottom: "0.6rem" }}>The 90-second judge path</div>
          <ol style={{ margin: 0, paddingLeft: "1.15rem", display: "grid", gap: "0.45rem", fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <li><Link href="https://jourdanlabs.com/omnis/heimdall" style={{ color: accent, fontWeight: 700 }}>HEIMDALL</Link> — paste a $2.4M auto-wire with no approver. It <strong>refuses</strong>. Add a named approver → it <strong>escalates to a human</strong>. It never authorizes.</li>
            <li>Any other proof — the same engine, a different high-consequence surface.</li>
            <li>Run the same packet <strong>twice</strong> — identical verdict, identical hash. That&apos;s how you know it isn&apos;t an LLM.</li>
            <li>That&apos;s the cure: provable, refusable, auditable — under every theme at once.</li>
          </ol>
        </div>
      </section>

      {/* THE SIX PROOFS */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: "0.3rem" }}>
          Six gates. One substrate. Every one live.
        </h2>
        <p style={{ color: "var(--text-tertiary)", marginBottom: "1.1rem", maxWidth: "70ch", ...S.mono, fontSize: "0.72rem" }}>
          Not six products — one deterministic refusal gate, pointed at six places a wrong call is unrecoverable.
        </p>
        <div data-tour="gates" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0.85rem" }}>
          {PROOFS.map((p) => (
            <Link key={p.name} href={p.href} style={{ ...S.card, textDecoration: "none", display: "block", borderLeft: `3px solid ${p.accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <span style={{ ...S.mono, fontWeight: 900, letterSpacing: "0.06em", color: p.accent, fontSize: "0.95rem" }}>{p.name}</span>
                <span style={{ ...S.mono, fontSize: "0.6rem", fontWeight: 800, padding: "0.18rem 0.5rem", borderRadius: 999, background: "#eafaf0", color: "#1f9d57", border: "1px solid #bfe9d0", whiteSpace: "nowrap" }}>● LIVE</span>
              </div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.45rem" }}>{p.surface}</div>
              <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>{p.refuses}</p>
              <div style={{ marginTop: "0.7rem", ...S.mono, fontSize: "0.72rem", fontWeight: 700, color: p.accent }}>Open it live →</div>
            </Link>
          ))}
        </div>
        <div data-tour="receipt" style={{ marginTop: "1rem", padding: "0.7rem 0.9rem", borderRadius: 10, border: `1px solid ${accent}33`, background: `${accent}0d`, ...S.mono, fontSize: "0.68rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          🔒 <strong style={{ color: accent }}>Every verdict carries a receipt</strong> — deterministic · 0 runtime LLM calls · same input → same verdict + same hash, every run · corpus-sealed · tamper-evident. Re-run it yourself; it won&apos;t budge.
        </div>
      </section>

      {/* NOT KEYWORD MATCHING */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: "0.3rem" }}>
          It reads negation — not keywords.
        </h2>
        <p style={{ color: "var(--text-tertiary)", marginBottom: "1.1rem", maxWidth: "70ch", ...S.mono, fontSize: "0.72rem" }}>
          The cheap version of this is <code>if packet contains &quot;wire&quot; → refuse</code>. A string-matcher gets fooled both directions. These don&apos;t — same engine, verified live on the API.
        </p>
        <div data-tour="negation" style={{ display: "grid", gap: "0.6rem" }}>
          {[
            ["CUSTODIAN", "#0e8f6e", "“…contains no PII, no PCI, and no secrets…”", "HOLD", "Negation doesn’t buy a pass — egress + residency are still flagged. It won’t wave through a leak just because the words “no PII” appear."],
            ["HEIMDALL", "#4A7BA7", "“the agent will NOT wire money, cannot delete, no deploy”", "HOLD — not the edge", "It reads “will not” and stands down — instead of seeing the word “wire” and false-refusing a harmless read."],
            ["HERALD", "#b5882b", "“revenue grew 12% as of Q2 2026 per the ledger (receipt sha256…)”", "GROUNDED", "Cited claims pass. It isn’t a blanket refuser — it refuses what can’t be proven, and clears what can."],
          ].map(([name, c, input, verdict, why]) => (
            <div key={name} style={{ ...S.card, padding: "0.85rem 1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem", alignItems: "center", justifyContent: "space-between", borderLeft: `3px solid ${c}` }}>
              <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                <span style={{ ...S.mono, fontWeight: 900, color: c, fontSize: "0.72rem", letterSpacing: "0.05em" }}>{name}</span>
                <div style={{ ...S.mono, fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0.25rem 0" }}>{input}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", lineHeight: 1.5 }}>{why}</div>
              </div>
              <span style={{ ...S.mono, flexShrink: 0, fontSize: "0.7rem", fontWeight: 800, padding: "0.3rem 0.6rem", borderRadius: 8, background: `${c}14`, color: c, border: `1px solid ${c}40`, whiteSpace: "nowrap" }}>→ {verdict}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "0.9rem", ...S.mono, fontSize: "0.7rem", color: "var(--text-tertiary)", lineHeight: 1.6 }}>
          Same engine, both directions: it won&apos;t pass &quot;no PII&quot; as clean, and it won&apos;t refuse &quot;will not wire&quot; as a wire. That&apos;s reading the sentence — not scanning for a word.
        </p>
      </section>

      {/* WHY THIS WINS */}
      <section data-tour="why" style={{ padding: "1.5rem 0 0", borderTop: "1px solid var(--bg-border)" }}>
        <span style={{ ...S.mono, fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, display: "block", marginBottom: "0.9rem" }}>
          Why #6.1 wins
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.7rem" }}>
          {[
            ["Impact & Value", "The failure under every GT theme — fixed once, at the surfaces where a wrong call can't be undone."],
            ["Feasibility", "It already runs. Six live engines, click-and-it-refuses. We demo, not diagram."],
            ["Theme alignment", "Not one square — the disease under all of them, with the cure shown six ways."],
            ["Innovation", "Provable, refusal-grounded governance with zero LLM in the decision path — net-new."],
          ].map(([k, v]) => (
            <div key={k} style={{ border: "1px solid var(--bg-border)", borderRadius: 10, padding: "0.8rem 0.9rem", background: "var(--accent-dim)" }}>
              <div style={{ ...S.mono, fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: accent, marginBottom: "0.35rem" }}>{k}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{v}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "1.5rem", ...S.mono, fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
          We don&apos;t guess. We prove — or we say plainly we can&apos;t. 🐦‍⬛ + 🔑
        </p>
      </section>

      <ProofTour />
    </main>
  );
}
