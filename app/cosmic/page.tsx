import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "COSMIC - Malleable Deterministic Architecture",
  description:
    "COSMIC is a malleable deterministic architecture with applications across inference, control, audit, finance, real assets, and enterprise AI.",
};

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1180, margin: "0 auto", padding: "0 1.25rem" },
  containerSm: { maxWidth: 840, margin: "0 auto", padding: "0 1.25rem" },
  label: {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--accent)",
    marginBottom: "1rem",
    display: "block",
  },
  p: { color: "var(--text-secondary)", lineHeight: 1.75 },
  section: { padding: "5.5rem 0", borderBottom: "1px solid var(--bg-border)" },
};

const stack = [
  {
    number: "01",
    title: "Product UI",
    body: "Where the user, agent, analyst, or workflow asks for an answer, action, report, or decision.",
  },
  {
    number: "02",
    title: "COSMIC deterministic control layer",
    body: "The guardrail layer that checks source posture, validates claims, blocks unsupported outputs, and records what happened.",
  },
  {
    number: "03",
    title: "Retrieval, rules, and models",
    body: "The underlying data and AI stack. COSMIC can sit around LLMs, local models, rules engines, retrieval systems, and domain-specific tools.",
  },
  {
    number: "04",
    title: "Audit packet",
    body: "The reproducible customer-ready record: sources, assumptions, refusal rationale, checks, outputs, and run metadata.",
  },
];

const capabilities = [
  {
    title: "Source-of-record spine",
    body: "Binds claims to filings, contracts, logs, corpora, datasets, model outputs, or human-approved records before the answer is trusted.",
  },
  {
    title: "Refusal engine",
    body: "Refuses missing evidence, unsafe conclusions, fabricated citations, and silent overreach. No source means no fake confidence.",
  },
  {
    title: "Audit packet generator",
    body: "Turns AI output into something a customer, regulator, partner, or investor can inspect after the fact.",
  },
  {
    title: "Benchmark harness",
    body: "Measures reliability across products and portfolio companies instead of relying on launch-day fluency.",
  },
];

const modes = [
  {
    title: "One architecture, many applications",
    body: "COSMIC is malleable by design. It can power mineral-rights inference, valuation workflows, code review, agent governance, and enterprise AI control without becoming a different thing each time.",
  },
  {
    title: "Deterministic by nature",
    body: "Every application is built around the same posture: explicit inputs, visible assumptions, repeatable logic, source discipline, and outputs that can be checked after the fact.",
  },
  {
    title: "Against the industry grain",
    body: "The market is mostly racing toward bigger probabilistic systems. COSMIC goes the other way: smaller control surfaces, stronger receipts, honest refusal, and fewer unsupported claims.",
  },
];

export default function CosmicPage() {
  return (
    <>
      <section style={{ padding: "6rem 0 4rem", borderBottom: "1px solid var(--bg-border)" }}>
        <div style={S.container}>
          <span style={S.label}>COSMIC</span>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.6rem)",
              fontWeight: 950,
              letterSpacing: "-0.06em",
              lineHeight: 0.95,
              color: "var(--text-primary)",
              maxWidth: 900,
              marginBottom: "1.25rem",
            }}
          >
            Malleable. Deterministic. Built against the grain.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 760 }}>
            COSMIC is not one narrow product. It is a malleable architecture for building deterministic
            systems across messy domains: MineralLogic, CIPHER, VANTAGE, BIFROST, agent governance, and
            enterprise AI. The industry keeps betting on bigger probabilistic models. COSMIC goes the
            other way: explicit assumptions, source discipline, reproducible outputs, and audit trails.
          </p>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>What COSMIC means</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {modes.map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "1.35rem",
                  borderRadius: 22,
                  border: "1px solid var(--bg-border)",
                  background: "rgba(255,255,255,0.78)",
                  boxShadow: "var(--soft-shadow)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.2rem",
                    letterSpacing: "-0.04em",
                    marginBottom: "0.55rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {item.title}
                </h2>
                <p style={{ ...S.p, margin: 0, fontSize: "0.94rem" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>Control-layer pipeline</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.9rem",
            }}
          >
            {stack.map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "1.25rem",
                  minHeight: 230,
                  borderRadius: 22,
                  border: "1px solid var(--bg-border)",
                  background: item.number === "02" ? "linear-gradient(135deg, #6f38ff, #2f116d)" : "var(--bg-card)",
                  color: item.number === "02" ? "#fff" : "var(--text-primary)",
                  boxShadow: "var(--soft-shadow)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "0.75rem",
                    fontWeight: 900,
                    opacity: 0.72,
                    marginBottom: "1.25rem",
                  }}
                >
                  {item.number}
                </div>
                <h2
                  style={{
                    fontSize: "1.2rem",
                    lineHeight: 1.1,
                    letterSpacing: "-0.035em",
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.title}
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: item.number === "02" ? "rgba(255,255,255,0.8)" : "var(--text-secondary)",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.container}>
          <span style={S.label}>What COSMIC enforces</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {capabilities.map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "1.35rem",
                  borderRadius: 22,
                  border: "1px solid var(--bg-border)",
                  background: "rgba(255,255,255,0.78)",
                  boxShadow: "var(--soft-shadow)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.15rem",
                    letterSpacing: "-0.035em",
                    marginBottom: "0.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {item.title}
                </h2>
                <p style={{ ...S.p, margin: 0, fontSize: "0.94rem" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5.5rem 0" }}>
        <div style={S.containerSm}>
          <span style={S.label}>Why it matters</span>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 950,
              letterSpacing: "-0.055em",
              lineHeight: 1,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            AI that cannot be audited cannot be trusted in production.
          </h2>
          <p style={S.p}>
            COSMIC is not one narrow product. It is the architecture behind several JourdanLabs systems:
            inference where the world is uncertain, control where AI output has to be governed, and audit
            infrastructure where a decision has to defend itself later. The applications change. The
            deterministic posture does not.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <Link href="/crucible/vantage" style={{ color: "var(--accent)", fontWeight: 850 }}>
              See VANTAGE -&gt;
            </Link>
            <Link href="/applications" style={{ color: "var(--text-secondary)", fontWeight: 800 }}>
              View portfolio -&gt;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
