import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import BenchmarkGrid from "@/components/BenchmarkGrid";
import DivisionCard from "@/components/DivisionCard";

export const metadata: Metadata = {
  title: "JourdanLabs x COSMIC - Deterministic Trust Layer for Enterprise AI",
  description:
    "JourdanLabs builds deterministic AI infrastructure for regulated, high-stakes enterprise workflows.",
};

const S: Record<string, CSSProperties> = {
  section: { padding: "5.5rem 0", borderBottom: "1px solid var(--bg-border)" },
  container: { maxWidth: 1180, margin: "0 auto", padding: "0 1.25rem" },
  containerSm: { maxWidth: 860, margin: "0 auto", padding: "0 1.25rem" },
  label: {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "1rem",
    display: "block",
  },
  eyebrowPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.46rem 0.72rem",
    borderRadius: 999,
    border: "1px solid var(--accent-border)",
    background: "rgba(255,255,255,0.76)",
    color: "var(--purple-900)",
    fontSize: "0.78rem",
    fontWeight: 800,
    boxShadow: "var(--soft-shadow)",
  },
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--bg-border)",
    borderRadius: 18,
    boxShadow: "var(--soft-shadow)",
  },
};

const DIVISIONS = [
  {
    name: "CADMUS",
    tagline: "Specify",
    headline: "Brain dump to airtight spec",
    products: "OMNIS workroom for buildable specs",
    href: "/omnis/cadmus",
    accent: "#6f38ff",
  },
  {
    name: "VANTAGE",
    tagline: "Verify",
    headline: "Code fixes with release discipline",
    products: "OMNIS workroom for code verification",
    href: "/omnis/vantage",
    accent: "#4f2bc6",
  },
  {
    name: "PROSPECTOR",
    tagline: "Discover",
    headline: "Messy estate to diligence map",
    products: "OMNIS workroom for estate intelligence",
    href: "/omnis/prospector",
    accent: "#8b5cf6",
  },
  {
    name: "LUNA",
    tagline: "Remember",
    headline: "Computer activity to work brief",
    products: "OMNIS workroom for persistent documentation",
    href: "/omnis/luna",
    accent: "#5a2ee6",
  },
  {
    name: "CIPHER",
    tagline: "Finance",
    headline: "Deterministic valuation tools",
    products: "DCF, comps, full audit chain",
    href: "/alchemist",
    accent: "#7c3aed",
  },
  {
    name: "MAP THE SOUL",
    tagline: "Identity",
    headline: "Verifiable AI continuity",
    products: "Preserved, audited, migrated agent identity",
    href: "/research",
    accent: "#a855f7",
  },
  {
    name: "COSMIC",
    tagline: "Substrate",
    headline: "Deterministic control layer",
    products: "Eight engines, typed contracts, zero runtime LLM calls",
    href: "/cosmic",
    accent: "#5b21b6",
  },
];

const architectureCards = [
  {
    title: "Source-of-record spine",
    text: "Every claim binds back to files, contracts, logs, corpora, or human-approved records.",
  },
  {
    title: "Refusal engine",
    text: "Missing evidence is treated as a first-class result, not something to paper over with confidence.",
  },
  {
    title: "Audit packet generator",
    text: "Outputs ship with signed receipts a customer, regulator, or reviewer can inspect later.",
  },
  {
    title: "Benchmark harness",
    text: "Models and workflows are measured against sealed tests before anyone calls them production-ready.",
  },
];

const proofStats = [
  ["8", "specialized COSMIC engines"],
  ["0", "runtime LLM calls in deterministic paths"],
  ["9/9", "VANTAGE 2.0 fixture suites cleared"],
  ["100%", "expected-finding recall"],
];

const portfolioPlays = [
  ["OMNIS", "Engineering OS: specs, code verification, and software estate intelligence."],
  ["VANTAGE", "Code verification with release blockers, remediation, and sealed receipts."],
  ["CADMUS", "Brain-sprawl to airtight specs for product and engineering teams."],
  ["PROSPECTOR", "Software estate intelligence for modernization, M&A, and diligence."],
  ["CIPHER", "Finance tools that produce valuation outputs with visible assumptions."],
  ["BIFROST", "A browser trust layer for frontier LLMs: verify, refuse, and explain."],
];

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div style={S.container} className="hero-grid">
          <div className="hero-copy">
            <div style={S.eyebrowPill}>JourdanLabs x COSMIC</div>
            <h1 className="hero-title">
              We went
              <span> the other way.</span>
            </h1>
            <p className="hero-kicker">The deterministic trust layer for enterprise AI.</p>
            <p className="hero-body">
              The industry made one bet: bigger models, more parameters, more compute. JourdanLabs
              starts where the failure actually lives: proof, provenance, refusal, and auditability.
            </p>
            <div className="hero-mini-proof" aria-label="JourdanLabs proof points">
              <span>Deterministic</span>
              <span>Verifiable</span>
              <span>Refusal as correctness</span>
            </div>
          </div>

          <div className="hero-mascot-wrap" aria-label="Baby PULSAR brand mascot">
            <Image
              src="/brand/baby-pulsar-speech.png"
              alt="Baby PULSAR explaining the JourdanLabs proof posture"
              width={1024}
              height={881}
              priority
              className="hero-mascot"
            />
          </div>
        </div>
      </section>

      <section className="proof-rail-section">
        <div style={S.container} className="proof-rail">
          {proofStats.map(([number, label]) => (
            <div key={label} className="proof-stat">
              <strong>{number}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container} className="problem-grid">
          <div className="glass-panel problem-panel">
            <span style={S.label}>The old bet</span>
            <h2>The industry made one bet.</h2>
            <p>Bigger models. More parameters. More compute. Same architecture. Same failure mode.</p>
            <div className="scale-stack" aria-hidden="true">
              {["SCALE", "$$$", "COMPUTE", "PARAMETERS", "SCALE"].map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </div>
          </div>
          <div className="glass-panel problem-panel accent-panel">
            <span style={S.label}>The JourdanLabs way</span>
            <h2>Bigger does not fix the core problem.</h2>
            <p>
              A confident answer with no source, no chain of custody, and no reproducible audit packet
              is still untrusted in production.
            </p>
            <div className="warning-strip">This is not a model problem. It is an architecture problem.</div>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <div className="section-heading">
            <span style={S.label}>COSMIC architecture</span>
            <h2>COSMIC is the deterministic control layer around AI systems.</h2>
            <p>
              AI can generate. Enterprise has to prove. COSMIC sits between the product UI and the
              customer-facing answer so every output can be checked, refused, repeated, and trusted.
            </p>
          </div>

          <div className="control-layer">
            <div className="control-visual">
              <Image
                src="/deck-previews/cosmic-substrate.png"
                alt="COSMIC deterministic reasoning substrate slide preview"
                width={960}
                height={540}
                className="deck-preview"
              />
            </div>
            <div className="architecture-grid">
              {architectureCards.map((card, index) => (
                <div key={card.title} className="architecture-card">
                  <span>{index + 1}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <div className="section-heading compact">
            <span style={S.label}>The wedge stack</span>
            <h2>Specify {"->"} Build {"->"} Verify {"->"} Discover.</h2>
            <p>
              OMNIS is the deterministic engineering app: CADMUS turns intent into specs,
              VANTAGE 2.0 blocks dangerous code, PROSPECTOR maps the software estate,
              and LUNA preserves what happened before agents ever get keys.
            </p>
          </div>

          <div className="wedge-preview">
            <Image
              src="/deck-previews/wedge-stack.png"
              alt="JourdanLabs wedge stack slide preview"
              width={960}
              height={540}
              className="deck-preview"
            />
          </div>

          <div className="division-grid">
            {DIVISIONS.map((d) => (
              <DivisionCard key={d.name} {...d} />
            ))}
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container} className="portfolio-grid">
          <div>
            <span style={S.label}>JourdanLabs portfolio</span>
            <h2 className="section-title">Big thesis. Knife wedge.</h2>
            <p className="section-copy">
              JourdanLabs is not one app. It is a deterministic substrate with wedge products that prove
              the architecture in the wild: ALCHEMIST for finance and accounting, OMNIS for engineering,
              BIFROST for browser trust, and MAP THE SOUL for AI identity continuity.
            </p>
            <Link className="secondary-button purple" href="/omnis">
              Open OMNIS
            </Link>
          </div>
          <div className="portfolio-cloud">
            {portfolioPlays.map(([name, text]) => (
              <div key={name} className="portfolio-pill">
                <span />
                <div>
                  <strong>{name}</strong>
                  <small>{text}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <div className="section-heading compact">
            <span style={S.label}>Validated products</span>
            <h2>Pre-revenue. Wedge ready. Platform validated.</h2>
            <p>
              VANTAGE 2.0 beat the internal VANTAGE benchmark and turns code review into auditable
              proof: sealed receipts, honest rates, zero forbidden hits, and reproducible findings.
            </p>
          </div>
          <BenchmarkGrid />
        </div>
      </section>

      <section style={{ padding: "5.5rem 0" }}>
        <div style={S.container} className="final-cta">
          <Image
            src="/brand/baby-pulsar-flag.png"
            alt=""
            width={180}
            height={180}
            className="cta-mascot"
          />
          <div>
            <span style={S.label}>Founder-led, proof-first</span>
            <h2>While everyone else went bigger, we went deterministic.</h2>
            <p>
              Bring us one regulated workflow. We will either make it verifiable, or tell you exactly
              why it should not ship yet.
            </p>
          </div>
          <Link className="primary-button" href="/contact">
            Build with JourdanLabs
          </Link>
        </div>
      </section>
    </>
  );
}
