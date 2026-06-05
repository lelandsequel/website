import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "The Chamber × GT 2026 Themes — JourdanLabs",
  description: "Working systems, not slideware: the JourdanLabs chamber mapped to the six GT 2026 themes.",
  robots: { index: false, follow: false },
};

const accent = "#6f38ff";

type Status = "LIVE" | "ENGINE" | "APPROACH";

const BADGE: Record<Status, { label: string; bg: string; fg: string; bd: string }> = {
  LIVE: { label: "● LIVE", bg: "#eafaf0", fg: "#1f9d57", bd: "#bfe9d0" },
  ENGINE: { label: "◆ ENGINE BUILT", bg: "var(--accent-dim)", fg: accent, bd: "var(--accent-border)" },
  APPROACH: { label: "○ SUBSTRATE APPROACH", bg: "#fff5e6", fg: "#b26a00", bd: "#f3e2c0" },
};

type Sol = { name: string; status: Status; blurb: string; href?: string };
type Theme = { n: string; title: string; line: string; sols: Sol[] };

const THEMES: Theme[] = [
  {
    n: "01",
    title: "Secure & resilient design",
    line: "A substrate that refuses what it can't prove — and an audit trail for everything an agent touches.",
    sols: [
      { name: "The brake on irreversible AI actions", status: "LIVE", blurb: "HEIMDALL: paste an irreversible action an agent is about to take — a $2.4M wire, a prod-table delete, a deploy. It refuses, or escalates to a named human. There is no AUTHORIZE verdict in the engine. The brake at the edge of the decisions you can't take back — refusal-as-correctness, the human stays the trigger. The thing nobody else has — and it runs.", href: "https://jourdanlabs.com/omnis/heimdall" },
      { name: "Evidence-grounded vendor/dependency gate", status: "LIVE", blurb: "Decision Gate: structured accept / hold / reject for third-party & SaaS risk, every call backed by evidence and a receipt. Live workbench.", href: "https://jourdanlabs.com/omnis/vendor" },
      { name: "Estate & dependency intelligence", status: "LIVE", blurb: "PROSPECTOR: maps what exists, what's duplicated, and what's risky — the basis for blast-radius and resilience analysis. Runs live, deterministic, corpus-sealed.", href: "https://jourdanlabs.com/omnis/prospector" },
    ],
  },
  {
    n: "02",
    title: "AI embedded in workflows",
    line: "AI that's safe to put in a regulated workflow because it cites its evidence — or refuses.",
    sols: [
      { name: "CADMUS — spec & prompt generator", status: "LIVE", blurb: "Messy intent → a buildable spec + a grounded, refuse-when-underspecified LLM prompt. In the browser, no keys. Click it — it runs.", href: "https://jourdanlabs.com/cadmus" },
      { name: "VANTAGE — verification & release gates", status: "LIVE", blurb: "Deterministic code verification + automated release gates that block non-compliant commits. Quality as code, not a checklist. Paste code, watch it run.", href: "https://jourdanlabs.com/omnis/vantage" },
      { name: "LUNA — grounded work memory", status: "LIVE", blurb: "Turns work into auditable, stakeholder-specific briefs where every line cites its source. Live, deterministic, corpus-sealed.", href: "https://jourdanlabs.com/omnis/luna" },
    ],
  },
  {
    n: "03",
    title: "Outcomes over activity",
    line: "Prioritization as math, not opinion — and every decision carries a receipt.",
    sols: [
      { name: "OMNIS Agility — intake & prioritization", status: "LIVE", blurb: "Deterministic risk/impact scoring, 'fix-first with rationale', and a tamper-evident decision chain. Maps 1:1 to risk-driven prioritization AND delivery insight. Live, animated walkthrough — go watch it work.", href: "https://agility.jourdanlabs.com" },
      { name: "LUNA — decision-grade delivery insight", status: "LIVE", blurb: "From delivery data to early risk signals and 'where to intervene' — grounded, not anecdotal. Runs live at the OMNIS LUNA workroom.", href: "https://jourdanlabs.com/omnis/luna" },
    ],
  },
  {
    n: "04",
    title: "Simplification to unlock capacity",
    line: "The proven migration pattern: map the estate, spec the cutover, gate it on proof.",
    sols: [
      { name: "Migration & decommission engine", status: "LIVE", blurb: "PROSPECTOR maps every dependency → CADMUS writes the cutover spec with a hard 'done' definition → the same gate blocks cutover until the machine proves it's safe. The discovery + spec engines run live — try PROSPECTOR.", href: "https://jourdanlabs.com/omnis/prospector" },
      { name: "Access right-sizing", status: "LIVE", blurb: "ACCESS LENS: paste entitlements vs. observed usage → flags standing privilege, drift, and over-permissioned grants, and refuses a least-privilege claim without usage evidence. Live.", href: "https://jourdanlabs.com/omnis/access" },
    ],
  },
  {
    n: "05",
    title: "Empowered employee experience",
    line: "Standards enforced at build time; help that's grounded, not guessing.",
    sols: [
      { name: "Build-time governance gate", status: "LIVE", blurb: "BUILD GATE: paste a dependency manifest → checks for required approved SDKs, disallowed/vulnerable versions, pinning, and a lockfile, then emits a manifest. Standards as code. Live.", href: "https://jourdanlabs.com/omnis/buildgate" },
      { name: "Grounded internal assistant", status: "LIVE", blurb: "LUNA answers from real source with receipts — and refuses what it can't ground. The grounded Q&A engine runs live.", href: "https://jourdanlabs.com/omnis/luna" },
    ],
  },
  {
    n: "06",
    title: "The original problem statement",
    line: "We don't pick a square. We name the disease underneath all of them — and we already built the cure.",
    sols: [
      { name: "#6.1 — Provable, refusal-grounded AI governance", status: "LIVE", blurb: "Every theme above shares one root problem: AI and agents produce output that can't be grounded, refused, or audited. COSMIC is the substrate that fixes it — deterministic, evidence-cited, refuses what it can't prove, on a tamper-evident chain. The governance layer runs live in HEIMDALL — and the full statement is below.", href: "https://jourdanlabs.com/omnis/heimdall" },
    ],
  },
];

const S: Record<string, CSSProperties> = {
  section: { padding: "3rem 0", borderBottom: "1px solid var(--bg-border)" },
  card: { background: "var(--bg-card)", border: "1px solid var(--bg-border)", borderRadius: 14, boxShadow: "var(--soft-shadow)", padding: "1.1rem 1.25rem" },
};

function Badge({ status }: { status: Status }) {
  const b = BADGE[status];
  return (
    <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.06em", padding: "0.2rem 0.5rem", borderRadius: 999, background: b.bg, color: b.fg, border: `1px solid ${b.bd}`, whiteSpace: "nowrap" }}>
      {b.label}
    </span>
  );
}

export default function JpmcHackPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pan-pulsar-thuglife.png"
        alt="Pan & PULSAR — the chamber, watching your six"
        style={{ position: "fixed", top: 10, right: 14, width: "clamp(82px, 10vw, 128px)", height: "auto", zIndex: 50, pointerEvents: "none", userSelect: "none", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.18))" }}
      />
      <section style={{ marginBottom: "1.5rem" }}>
        <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, display: "block", marginBottom: "0.9rem" }}>
          The Chamber × GT 2026 · Internal preview
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.08, color: "var(--text-primary)", marginBottom: "1rem", maxWidth: 20 + "ch" }}>
          One deterministic governance layer for enterprise AI — and it runs.
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "66ch" }}>
          It takes messy AI-agent, vendor, code, and work packets, refuses what it can&apos;t prove, seals every
          decision in a hash-chained receipt, and lets compliance re-run the audit. What&apos;s below isn&apos;t six
          products — it&apos;s <strong style={{ color: "var(--text-primary)" }}>one substrate pointed at six enterprise surfaces</strong>.{" "}
          Every <span style={{ color: "#1f9d57" }}>● LIVE</span> badge is a real URL: click it, it runs, and the same
          input returns the same verdict and the same hash every time. We don&apos;t ship what we can&apos;t prove.
        </p>
        <div style={{ ...S.card, marginTop: "1.4rem", padding: "1rem 1.2rem", borderColor: `${accent}40` }}>
          <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.64rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: accent, marginBottom: "0.6rem" }}>The 90-second path for a judge</div>
          <ol style={{ margin: 0, paddingLeft: "1.15rem", display: "grid", gap: "0.45rem", fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            <li><Link href="https://jourdanlabs.com/omnis/vendor" style={{ color: accent, fontWeight: 700 }}>Decision Gate</Link> — paste a risky vendor; it refuses on the evidence, with a receipt.</li>
            <li><Link href="https://jourdanlabs.com/omnis/access" style={{ color: accent, fontWeight: 700 }}>Access Lens</Link> / <Link href="https://jourdanlabs.com/omnis/buildgate" style={{ color: accent, fontWeight: 700 }}>Build Gate</Link> — the same engine, a different enterprise surface.</li>
            <li><Link href="https://jourdanlabs.com/cadmus" style={{ color: accent, fontWeight: 700 }}>CADMUS</Link> — the front of the workflow: messy intent becomes a buildable spec.</li>
            <li>Hit <strong style={{ color: "var(--text-primary)" }}>Export JSON</strong> — the receipt that proves it: corpus_seal · input_hash · 0 runtime LLM calls.</li>
          </ol>
        </div>
      </section>

      <p style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.72rem", color: "var(--text-tertiary)", margin: "0 0 1.5rem", letterSpacing: "0.02em", lineHeight: 1.6 }}>
        Six themes below — one engine. Each is the same deterministic substrate pointed at a different enterprise surface.
      </p>

      {THEMES.map((t) => (
        <section key={t.n} style={S.section}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.8rem", marginBottom: "0.4rem" }}>
            <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontWeight: 800, color: accent, fontSize: "1.1rem" }}>{t.n}</span>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>{t.title}</h2>
          </div>
          <p style={{ color: "var(--text-tertiary)", marginBottom: "1.1rem", maxWidth: "70ch" }}>{t.line}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.8rem" }}>
            {t.sols.map((s) => (
              <div key={s.name} style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>{s.name}</span>
                  {s.href ? (
                    <Link href={s.href} aria-label={`Open ${s.name} live`} style={{ textDecoration: "none", flexShrink: 0 }}>
                      <Badge status={s.status} />
                    </Link>
                  ) : (
                    <Badge status={s.status} />
                  )}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>{s.blurb}</p>
                {s.href && (
                  <Link href={s.href} style={{ display: "inline-flex", marginTop: "0.7rem", fontSize: "0.82rem", fontWeight: 700, color: accent }}>
                    {s.status === "LIVE" ? "Open it live →" : "Details →"}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section style={{ padding: "3rem 0 0" }}>
        <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, display: "block", marginBottom: "0.8rem" }}>
          #6.1 · Original Problem Statement
        </span>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text-primary)", marginBottom: "1rem", maxWidth: "26ch" }}>
          The trust substrate that AI at scale is missing.
        </h2>
        <div style={{ ...S.card, padding: "1.4rem 1.6rem" }}>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "0.9rem" }}>
            <strong style={{ color: "var(--text-primary)" }}>Problem.</strong> As AI and autonomous agents move into real
            workflows, they generate output, take actions, and access systems faster than anyone can verify. The shared
            failure beneath secure design, embedded AI, outcomes, simplification, and employee experience is the same:
            there is no substrate that makes AI output <em>provable</em> — grounded in real evidence, refused when it
            can&apos;t be, and recorded on a tamper-evident trail.
          </p>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "0.9rem" }}>
            <strong style={{ color: "var(--text-primary)" }}>What the chamber built.</strong> COSMIC — a deterministic
            verification substrate: same input, same answer, reproducible in any audit; every claim cites its evidence or
            is refused; every decision and refusal lands on a hash-chained, tamper-evident record. On top of it,
            signed agent identity (MAP THE SOUL) and brake-only refusal gates (HEIMDALL) make autonomous agents auditable
            and bounded by construction. It already runs — see the live systems above.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.6rem", marginTop: "1rem" }}>
            {[
              ["Impact & Value", "Safe AI as agents scale — across every theme"],
              ["Feasibility", "It already runs. We demo, not diagram."],
              ["Theme alignment", "Hits two themes at once: secure design + embedded AI"],
              ["Innovation", "Provable, refusal-grounded agent governance — net-new"],
            ].map(([k, v]) => (
              <div key={k} style={{ border: "1px solid var(--bg-border)", borderRadius: 10, padding: "0.7rem 0.8rem", background: "var(--accent-dim)" }}>
                <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: accent, marginBottom: "0.3rem" }}>{k}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <p style={{ marginTop: "1.5rem", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
          We don&apos;t guess. We prove — or we say plainly we can&apos;t. 🐦‍⬛ + 🔑
        </p>
      </section>
    </main>
  );
}
