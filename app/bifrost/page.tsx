import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "BIFROST — AI Verification Layer",
  description: "AI generates. BIFROST verifies. A universal verification layer for AI output.",
};

const container: React.CSSProperties = {
  width: "92%",
  maxWidth: 1600,
  margin: "0 auto",
};

const purple = "#6D45C7";
const pageBg = "#FBFAF7";
const softBg = "#F6F2EA";
const asset = "/assets/bifrost";
const githubUrl = "https://github.com/jourdanlabs/bifrost";

const useCases = [
  { title: "Developers", body: "Catch edge cases before shipping" },
  { title: "AI Users", body: "Know when to trust responses" },
  { title: "Teams", body: "Standardize AI reliability" },
  { title: "Enterprises", body: "Add a verification layer to workflows" },
];

const engines = [
  ["ASTRAL", "Normalize"],
  ["METEOR", "Extract claims"],
  ["NEBULA", "Detect uncertainty"],
  ["PULSAR", "Probe failures"],
  ["QUASAR", "Score confidence"],
  ["AURORA", "Final verdict"],
];

function Button({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    padding: "0.875rem 1.5rem",
    backgroundColor: variant === "primary" ? "var(--text-primary)" : "transparent",
    border: variant === "primary" ? "1px solid var(--text-primary)" : "1px solid var(--accent)",
    color: variant === "primary" ? "var(--bg)" : "var(--accent)",
    fontWeight: 650,
    fontSize: "0.75rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  };

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} style={style}>
      {children}
    </Link>
  );
}

function InlineAsset({
  src,
  alt,
  ratio,
  priority,
}: {
  src: string;
  alt: string;
  ratio: string;
  priority?: boolean;
}) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: ratio }}>
      <Image
        src={`${asset}/${src}`}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 900px) 100vw, 52vw"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

export default function BifrostPage() {
  return (
    <>
      <style>{`
        .bifrost-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr);
          gap: 4rem;
          align-items: center;
        }

        .bifrost-flow-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1px;
          background: var(--bg-border);
          border: 1px solid var(--bg-border);
        }

        .bifrost-engine-grid,
        .bifrost-use-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1px;
          background: var(--bg-border);
          border: 1px solid var(--bg-border);
        }

        .bifrost-engine-grid {
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }

        @media (max-width: 900px) {
          .bifrost-grid,
          .bifrost-flow-grid,
          .bifrost-engine-grid,
          .bifrost-use-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            background: transparent !important;
            border: 0 !important;
          }
        }
      `}</style>

      <section style={{ padding: "5rem 0 6rem", backgroundColor: pageBg }}>
        <div style={container}>
          <div className="bifrost-grid">
            <Reveal>
              <div className="smallcaps" style={{ marginBottom: "1.5rem" }}>
                v0.1 · JourdanLabs
              </div>
              <h1
                style={{
                  fontSize: "clamp(3.25rem, 7vw, 6.25rem)",
                  fontWeight: 850,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.92,
                  color: "var(--text-primary)",
                  marginBottom: "1.4rem",
                }}
              >
                BIFROST
              </h1>
              <p
                style={{
                  fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
                  lineHeight: 1.25,
                  color: purple,
                  fontWeight: 750,
                  marginBottom: "0.75rem",
                }}
              >
                AI generates. BIFROST verifies.
              </p>
              <p
                style={{
                  fontSize: "1.0625rem",
                  lineHeight: 1.65,
                  color: "var(--text-secondary)",
                  maxWidth: 420,
                  marginBottom: "2.5rem",
                }}
              >
                A universal verification layer for AI output.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Button href="#cta">Get Started</Button>
                <Button href={githubUrl} variant="secondary">
                  View on GitHub
                </Button>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <InlineAsset
                src="hero-bridge.png"
                alt="BIFROST bridge visual with PULSAR and approved verdict"
                ratio="585 / 395"
                priority
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "5rem 0",
          backgroundColor: pageBg,
          borderTop: "1px solid var(--bg-border)",
          borderBottom: "1px solid var(--bg-border)",
        }}
      >
        <div style={container}>
          <div className="bifrost-grid">
            <Reveal>
              <div className="smallcaps" style={{ marginBottom: "1rem" }}>
                Problem
              </div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  color: "var(--text-primary)",
                  marginBottom: "1.75rem",
                  maxWidth: 580,
                }}
              >
                AI fails where correctness is non-negotiable
              </h2>
              <div style={{ display: "grid", gap: "0.85rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                {[
                  "Confident answers can still be wrong",
                  "No reproducibility",
                  "No audit trail",
                  "No refusal when uncertain",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <span style={{ width: 6, height: 6, backgroundColor: purple, borderRadius: 999, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div>
                <InlineAsset
                  src="problem-ai-card.png"
                  alt="AI failure card with small PULSAR probe"
                  ratio="560 / 385"
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr auto 1fr",
                    gap: "0.75rem",
                    alignItems: "center",
                    marginTop: "1.25rem",
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "0.76rem",
                    color: "var(--text-secondary)",
                  }}
                  className="content-grid"
                >
                  <span>AI response</span>
                  <span>→</span>
                  <span>&quot;100% confident&quot;</span>
                  <span>→</span>
                  <span style={{ color: "#B94A4A", fontWeight: 800 }}>wrong</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 0", backgroundColor: pageBg }}>
        <div style={container}>
          <div className="bifrost-grid">
            <Reveal>
              <div className="smallcaps" style={{ marginBottom: "1rem" }}>
                Solution
              </div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  color: "var(--text-primary)",
                  marginBottom: "1.5rem",
                  maxWidth: 560,
                }}
              >
                BIFROST sits between AI and action
              </h2>
              <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "var(--text-secondary)", maxWidth: 440 }}>
                BIFROST evaluates AI output in real time and returns a verifiable confidence signal.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div>
                <div className="bifrost-flow-grid" style={{ marginBottom: "1.25rem" }}>
                  {["AI Output", "BIFROST", "Verdict"].map((item) => (
                    <div
                      key={item}
                      style={{
                        backgroundColor: item === "BIFROST" ? "rgba(109, 69, 199, 0.10)" : softBg,
                        padding: "1.5rem",
                        minHeight: 104,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: item === "BIFROST" ? purple : "var(--text-primary)",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <InlineAsset
                  src="solution-diagram.png"
                  alt="BIFROST verification verdict diagram"
                  ratio="570 / 210"
                />
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
                  {["APPROVED", "LOW CONFIDENCE", "REJECTED", "UNAVAILABLE"].map((verdict) => (
                    <span
                      key={verdict}
                      style={{
                        padding: "0.55rem 0.75rem",
                        backgroundColor: "var(--text-primary)",
                        color: "var(--bg)",
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {verdict}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "5rem 0",
          backgroundColor: pageBg,
          borderTop: "1px solid var(--bg-border)",
          borderBottom: "1px solid var(--bg-border)",
        }}
      >
        <div style={container}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "2rem", marginBottom: "2.25rem", flexWrap: "wrap" }}>
              <div>
                <div className="smallcaps" style={{ marginBottom: "1rem" }}>
                  How It Works
                </div>
                <h2
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.05,
                    color: "var(--text-primary)",
                  }}
                >
                  COSMIC-lite verification pipeline
                </h2>
              </div>
              <div style={{ fontFamily: "var(--font-geist-mono), monospace", color: "var(--text-tertiary)", fontSize: "0.78rem" }}>
                Six engines. One verdict.
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <InlineAsset
              src="pipeline-engines-hires.png"
              alt="COSMIC-lite verification pipeline engines"
              ratio="1919 / 820"
            />
            <div className="bifrost-engine-grid" style={{ marginTop: "1.5rem" }}>
              {engines.map(([name, label], index) => (
                <div
                  key={name}
                  style={{
                    backgroundColor: name === "PULSAR" ? "rgba(109, 69, 199, 0.10)" : softBg,
                    padding: "1rem",
                    minHeight: 112,
                  }}
                >
                  <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.68rem", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", color: name === "PULSAR" ? purple : "var(--text-primary)", fontWeight: 800, marginBottom: "0.35rem" }}>
                    {name}
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="cta" style={{ padding: "5rem 0 6rem", backgroundColor: pageBg }}>
        <div style={container}>
          <Reveal>
            <div className="smallcaps" style={{ marginBottom: "1.5rem" }}>
              Use Cases
            </div>
            <div className="bifrost-use-grid" style={{ marginBottom: "3rem" }}>
              {useCases.map((item) => (
                <div key={item.title} style={{ backgroundColor: softBg, padding: "1.5rem", minHeight: 150 }}>
                  <div style={{ color: purple, fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.75rem", fontWeight: 800, marginBottom: "1.2rem" }}>
                    {item.title}
                  </div>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="bifrost-grid">
            <Reveal>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  color: "var(--text-primary)",
                  marginBottom: "1rem",
                  maxWidth: 520,
                }}
              >
                Trust the output. Ship with confidence.
              </h2>
              <div style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-geist-mono), monospace", fontSize: "0.78rem", marginBottom: "2rem" }}>
                jourdanlabs.com/bifrost
              </div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Button href={githubUrl}>Install CLI</Button>
                <Button href={githubUrl} variant="secondary">
                  View GitHub
                </Button>
                <Button href={`${githubUrl}#readme`} variant="secondary">
                  Explore API
                </Button>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <InlineAsset
                src="cta-bridge.png"
                alt="BIFROST bridge and approved verdict"
                ratio="1180 / 410"
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
