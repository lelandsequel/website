import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "BIFROST - Browser Verification for Frontier LLMs",
  description:
    "BIFROST is the JourdanLabs Chrome extension that adds deterministic verification signals to frontier LLMs online.",
};

const githubUrl = "https://github.com/jourdanlabs/bifrost";
const chromeExtensionUrl = `${githubUrl}#chrome-extension`;

const S: Record<string, React.CSSProperties> = {
  container: { width: "100%", maxWidth: 1180, margin: "0 auto", padding: "0 1.25rem" },
  label: {
    display: "block",
    marginBottom: "1rem",
    color: "var(--accent)",
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.72rem",
    fontWeight: 850,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  p: { color: "var(--text-secondary)", lineHeight: 1.72 },
};

const targets = ["ChatGPT", "Claude", "Gemini", "Grok", "Kimi", "DeepSeek", "MiniMax", "Genspark"];

const states = [
  {
    name: "Verified",
    label: "Evidence supports the answer",
    tone: "pass",
  },
  {
    name: "Review",
    label: "Usable only with a source check",
    tone: "warn",
  },
  {
    name: "Rejected",
    label: "Contradiction, overclaim, or unsafe confidence",
    tone: "fail",
  },
  {
    name: "Unavailable",
    label: "Verifier unreachable; never treated as approval",
    tone: "neutral",
  },
];

const pipeline = [
  ["ASTRAL", "Normalize the model response"],
  ["METEOR", "Extract claims and implied claims"],
  ["NEBULA", "Detect uncertainty and hedging"],
  ["PULSAR", "Probe for failure modes"],
  ["QUASAR", "Score confidence and risk"],
  ["AURORA", "Return the visible verdict"],
];

const operatingRules = [
  {
    title: "Do not label the user's question as verified output",
    body: "Only model answers get evaluated. Prompts and user questions stay outside the verdict layer.",
  },
  {
    title: "Do not turn unavailable into approved",
    body: "If the verifier is offline or the page cannot be parsed, BIFROST shows unavailable instead of green-lighting.",
  },
  {
    title: "Do not reward confident claims without enough support",
    body: "Hedges, missing sources, and ungrounded certainty lower the verdict. Confidence has to be earned.",
  },
  {
    title: "Do make refusal visible when the answer crosses the line",
    body: "When an answer violates the boundary, BIFROST surfaces the reason instead of smoothing it away.",
  },
];

function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export default function BifrostPage() {
  return (
    <main className="bifrost-page">
      <style>{`
        .bifrost-page {
          min-height: 100vh;
          overflow-x: hidden;
          background:
            linear-gradient(90deg, rgba(111, 56, 255, 0.06) 1px, transparent 1px),
            linear-gradient(180deg, rgba(111, 56, 255, 0.06) 1px, transparent 1px),
            radial-gradient(circle at 12% 0%, rgba(111, 56, 255, 0.18), transparent 34rem),
            var(--bg);
          background-size: 44px 44px, 44px 44px, auto, auto;
        }

        .bifrost-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(320px, 0.72fr);
          gap: 1.25rem;
          align-items: stretch;
          padding: 5.5rem 0 2.25rem;
          max-width: 100%;
          min-width: 0;
        }

        .bifrost-hero-panel,
        .bifrost-visual-panel,
        .bifrost-card,
        .bifrost-wide-panel,
        .bifrost-install-card {
          border: 1px solid var(--bg-border);
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(248, 244, 255, 0.74)),
            var(--bg-card);
          box-shadow: var(--soft-shadow);
          max-width: 100%;
          min-width: 0;
        }

        .bifrost-hero-panel {
          min-height: 560px;
          border-radius: 28px;
          padding: clamp(1.4rem, 4vw, 2.8rem);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          position: relative;
        }

        .bifrost-hero-panel::after {
          content: "";
          position: absolute;
          inset: auto -10rem -13rem auto;
          width: 28rem;
          height: 28rem;
          border-radius: 50%;
          background: rgba(111, 56, 255, 0.14);
          pointer-events: none;
        }

        .bifrost-hero-panel h1 {
          color: var(--text-primary);
          font-size: clamp(3.4rem, 9vw, 7.2rem);
          font-weight: 950;
          letter-spacing: -0.075em;
          line-height: 0.86;
          margin: 0 0 1.1rem;
          max-width: 760px;
          position: relative;
          z-index: 1;
        }

        .bifrost-hero-panel h1 span {
          display: block;
        }

        .bifrost-hero-panel p {
          max-width: 720px;
          position: relative;
          z-index: 1;
          overflow-wrap: anywhere;
        }

        .bifrost-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 2rem;
          position: relative;
          z-index: 1;
        }

        .bifrost-proof-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
          margin-top: 2.4rem;
          position: relative;
          z-index: 1;
        }

        .bifrost-proof-strip div {
          min-height: 86px;
          border: 1px solid var(--accent-border);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.74);
          padding: 0.85rem;
        }

        .bifrost-proof-strip span,
        .bifrost-card span,
        .bifrost-install-card span,
        .bifrost-wide-panel span {
          display: block;
          color: var(--accent);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .bifrost-proof-strip strong {
          display: block;
          margin-top: 0.45rem;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.15;
          overflow-wrap: anywhere;
        }

        .bifrost-visual-panel {
          min-height: 560px;
          border-radius: 28px;
          padding: 1.2rem;
          display: grid;
          grid-template-rows: minmax(0, 1fr) auto;
          gap: 1rem;
          overflow: hidden;
        }

        .bifrost-visual {
          position: relative;
          min-height: 360px;
          border-radius: 22px;
          background:
            radial-gradient(circle at 50% 36%, rgba(111, 56, 255, 0.22), transparent 17rem),
            rgba(255, 255, 255, 0.58);
          overflow: hidden;
        }

        .bifrost-visual img {
          object-fit: contain;
        }

        .bifrost-verdict-stack {
          display: grid;
          gap: 0.55rem;
        }

        .bifrost-verdict {
          display: grid;
          grid-template-columns: 92px minmax(0, 1fr);
          gap: 0.75rem;
          align-items: center;
          border: 1px solid var(--bg-border);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.76);
          padding: 0.7rem;
        }

        .bifrost-verdict b {
          color: var(--text-primary);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .bifrost-verdict small {
          color: var(--text-secondary);
          line-height: 1.35;
        }

        .bifrost-verdict.pass b { color: #16834f; }
        .bifrost-verdict.warn b { color: #966100; }
        .bifrost-verdict.fail b { color: #bd263b; }
        .bifrost-verdict.neutral b { color: var(--text-tertiary); }

        .bifrost-section {
          padding: 2.25rem 0;
        }

        .bifrost-wide-panel {
          border-radius: 24px;
          padding: clamp(1.2rem, 3vw, 2rem);
        }

        .bifrost-section-title {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .bifrost-section-title h2 {
          color: var(--text-primary);
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 950;
          letter-spacing: -0.06em;
          line-height: 0.95;
          margin: 0;
          max-width: 820px;
        }

        .bifrost-target-grid,
        .bifrost-card-grid,
        .bifrost-pipeline-grid {
          display: grid;
          gap: 0.75rem;
        }

        .bifrost-target-grid {
          grid-template-columns: repeat(8, minmax(0, 1fr));
        }

        .bifrost-target-grid div {
          min-height: 74px;
          border: 1px solid var(--bg-border);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.76);
          display: grid;
          place-items: center;
          color: var(--text-primary);
          font-weight: 900;
          letter-spacing: -0.03em;
          text-align: center;
          padding: 0.7rem;
        }

        .bifrost-card-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .bifrost-card {
          min-height: 220px;
          border-radius: 18px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .bifrost-card strong,
        .bifrost-install-card strong {
          color: var(--text-primary);
          font-size: 1.28rem;
          font-weight: 950;
          letter-spacing: -0.04em;
          line-height: 1.05;
          overflow-wrap: anywhere;
        }

        .bifrost-card p,
        .bifrost-install-card p {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.92rem;
        }

        .bifrost-pipeline-grid {
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }

        .bifrost-pipeline-step {
          min-height: 150px;
          border: 1px solid var(--bg-border);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.78);
          padding: 1rem;
        }

        .bifrost-pipeline-step em {
          display: block;
          margin-bottom: 1rem;
          color: var(--text-tertiary);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.68rem;
          font-style: normal;
          font-weight: 850;
        }

        .bifrost-pipeline-step strong {
          display: block;
          color: var(--text-primary);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          margin-bottom: 0.55rem;
        }

        .bifrost-pipeline-step p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.84rem;
          line-height: 1.5;
        }

        .bifrost-install-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 1rem;
        }

        .bifrost-install-card {
          min-height: 260px;
          border-radius: 22px;
          padding: clamp(1.2rem, 3vw, 1.75rem);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .bifrost-link-line {
          display: block;
          width: fit-content;
          max-width: 100%;
          overflow-wrap: anywhere;
          color: var(--accent);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.76rem;
          font-weight: 850;
          text-decoration: none;
        }

        .bifrost-install-card .primary-button,
        .bifrost-install-card .secondary-button {
          width: fit-content;
        }

        @media (max-width: 1020px) {
          .bifrost-hero,
          .bifrost-install-grid {
            grid-template-columns: 1fr;
          }

          .bifrost-hero-panel,
          .bifrost-visual-panel {
            min-height: auto;
          }

          .bifrost-target-grid,
          .bifrost-card-grid,
          .bifrost-pipeline-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .bifrost-hero {
            padding-top: 3.5rem;
          }

          .bifrost-hero-panel,
          .bifrost-visual-panel,
          .bifrost-wide-panel,
          .bifrost-install-card {
            border-radius: 22px;
            width: calc(100vw - 2.5rem);
          }

          .bifrost-hero-panel {
            padding: 1.2rem;
          }

          .bifrost-hero-panel h1 {
            font-size: clamp(2.55rem, 13vw, 3.2rem);
            letter-spacing: -0.055em;
            line-height: 0.9;
            overflow-wrap: anywhere;
          }

          .bifrost-hero-panel p,
          .bifrost-actions,
          .bifrost-proof-strip {
            max-width: min(calc(100vw - 4.9rem), 36rem) !important;
          }

          .bifrost-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .bifrost-actions a {
            width: 100%;
          }

          .bifrost-proof-strip,
          .bifrost-target-grid,
          .bifrost-card-grid,
          .bifrost-pipeline-grid {
            grid-template-columns: 1fr;
          }

          .bifrost-section-title {
            align-items: start;
            flex-direction: column;
          }

          .bifrost-verdict {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section>
        <div style={S.container} className="bifrost-hero">
          <Reveal>
            <div className="bifrost-hero-panel">
              <div>
                <span style={S.label}>BIFROST EDGE · Chrome extension</span>
                <h1>
                  <span>Browser</span>
                  <span>trust for</span>
                  <span>frontier</span>
                  <span>LLMs.</span>
                </h1>
                <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 780 }}>
                  BIFROST adds deterministic verification signals directly on top of
                  the AI tools people already use. ChatGPT, Claude, Gemini, Grok,
                  Kimi, DeepSeek, MiniMax, Genspark: same discipline, same visible
                  refusal boundary.
                </p>
                <div className="bifrost-actions">
                  <ExternalLink className="primary-button" href={chromeExtensionUrl}>
                    Install Chrome extension
                  </ExternalLink>
                  <ExternalLink className="secondary-button purple" href={githubUrl}>
                    View GitHub
                  </ExternalLink>
                </div>
              </div>

              <div className="bifrost-proof-strip" aria-label="BIFROST proof points">
                <div>
                  <span>Runtime</span>
                  <strong>Runs in Chrome on live LLM pages</strong>
                </div>
                <div>
                  <span>Posture</span>
                  <strong>Verification is never confused with generation</strong>
                </div>
                <div>
                  <span>Boundary</span>
                  <strong>Unavailable is not approval</strong>
                </div>
                <div>
                  <span>Source</span>
                  <strong>Public GitHub repo</strong>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="bifrost-visual-panel">
              <div className="bifrost-visual" aria-label="Baby PULSAR verifying an LLM answer">
                <Image
                  src="/assets/bifrost/hero-bridge.png"
                  alt="BIFROST bridge visual with Baby PULSAR and a verification verdict"
                  fill
                  priority
                  sizes="(max-width: 1020px) 100vw, 420px"
                />
              </div>
              <div className="bifrost-verdict-stack">
                {states.map((state) => (
                  <div className={`bifrost-verdict ${state.tone}`} key={state.name}>
                    <b>{state.name}</b>
                    <small>{state.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bifrost-section">
        <div style={S.container}>
          <Reveal>
            <div className="bifrost-wide-panel">
              <div className="bifrost-section-title">
                <div>
                  <span style={S.label}>Where it works</span>
                  <h2>One browser layer across the tools people actually use.</h2>
                </div>
                <Link className="secondary-button purple" href="/omnis">
                  Open OMNIS
                </Link>
              </div>
              <div className="bifrost-target-grid">
                {targets.map((target) => (
                  <div key={target}>{target}</div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bifrost-section">
        <div style={S.container}>
          <Reveal>
            <div className="bifrost-section-title">
              <div>
                <span style={S.label}>Operating rules</span>
                <h2>The extension has one job: keep the answer honest.</h2>
              </div>
            </div>
          </Reveal>
          <div className="bifrost-card-grid">
            {operatingRules.map((rule, index) => (
              <Reveal delay={80 * index} key={rule.title}>
                <div className="bifrost-card">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{rule.title}</strong>
                  <p>{rule.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bifrost-section">
        <div style={S.container}>
          <Reveal>
            <div className="bifrost-wide-panel">
              <div className="bifrost-section-title">
                <div>
                  <span style={S.label}>COSMIC-lite pipeline</span>
                  <h2>Six deterministic engines. One visible verdict.</h2>
                </div>
              </div>
              <div className="bifrost-pipeline-grid">
                {pipeline.map(([name, text], index) => (
                  <div className="bifrost-pipeline-step" key={name}>
                    <em>{String(index + 1).padStart(2, "0")}</em>
                    <strong>{name}</strong>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bifrost-section" style={{ paddingBottom: "6rem" }}>
        <div style={S.container}>
          <div className="bifrost-install-grid">
            <Reveal>
              <div className="bifrost-install-card">
                <div>
                  <span>Chrome extension</span>
                  <strong>Install BIFROST EDGE from the public repo.</strong>
                  <p>
                    The current install path is the Chrome extension build in the
                    GitHub repo. The website points users straight to that extension
                    section.
                  </p>
                </div>
                <div>
                  <ExternalLink className="primary-button" href={chromeExtensionUrl}>
                    Open extension install
                  </ExternalLink>
                  <a className="bifrost-link-line" href={chromeExtensionUrl} target="_blank" rel="noopener noreferrer">
                    github.com/jourdanlabs/bifrost#chrome-extension
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="bifrost-install-card">
                <div>
                  <span>Source</span>
                  <strong>Audit the code, fork it, or wire it into OMNIS.</strong>
                  <p>
                    BIFROST stays public because the methodology is the point:
                    visible checks, visible refusal, visible source.
                  </p>
                </div>
                <div>
                  <ExternalLink className="secondary-button purple" href={githubUrl}>
                    View GitHub
                  </ExternalLink>
                  <a className="bifrost-link-line" href={githubUrl} target="_blank" rel="noopener noreferrer">
                    github.com/jourdanlabs/bifrost
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
