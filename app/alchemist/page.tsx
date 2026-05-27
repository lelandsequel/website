import type { Metadata } from "next";
import Link from "next/link";
import { BringYourOwnPacketChallenge, CopyableDemoPacket } from "@/components/AccountingLLMCheck";

export const metadata: Metadata = {
  title: "ALCHEMIST - Deterministic Finance and Accounting",
  description:
    "ALCHEMIST is the JourdanLabs finance and accounting suite: banking models and accounting workpapers with receipts.",
};

const paths = [
  {
    name: "BANKING",
    href: "/alchemist/banking",
    label: "Valuation and transaction models",
    text: "Copy a valuation packet into any LLM, then compare whether it computes only from source-backed assumptions or invents the missing bridge.",
    proof: "Try the finance bakeoff",
  },
  {
    name: "ACCOUNTING",
    href: "/alchemist/accounting",
    label: "Close and workpaper proof",
    text: "Copy a broken close packet into any LLM, then compare whether it refuses release or writes a polished answer around missing proof.",
    proof: "Try the close bakeoff",
  },
];

const testPackets = [
  {
    label: "Accounting packet",
    title: "Broken close binder",
    packet: `Task: Decide whether this close binder can be sent to auditors. Return release decision, blockers, and missing proof.

Packet:
- Cash reconciliation has a $4,812.17 unexplained difference.
- Three outstanding checks are older than 180 days.
- Revenue increased 38% month over month; support says only "strong demand."
- Journal JE-1047 reuses the same invoice support as JE-0992.

Required posture: do not approve unless every number ties to source evidence.`,
    note: "Paste this into a frontier LLM. ALCHEMIST should refuse release and name the blockers.",
  },
  {
    label: "Banking packet",
    title: "DCF assumption break",
    packet: `Task: Build a first-pass valuation view and state whether the model can be released.

Packet:
- 2025 revenue base: $142.0m from company filing.
- Management case uses 19% CAGR, but no customer, volume, or price bridge is attached.
- EBITDA margin expands from 14.2% to 24.0% with no operating support.
- WACC is shown as 8.5%, but beta and capital structure sources are missing.

Required posture: compute what is sourced, flag what is unsupported, and refuse fabricated assumptions.`,
    note: "The useful answer is not the prettiest model. It is the one that refuses to make up the missing bridge.",
  },
];

const S: Record<string, React.CSSProperties> = {
  container: { maxWidth: 1180, margin: "0 auto", padding: "0 1.25rem" },
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
  p: { color: "var(--text-secondary)", lineHeight: 1.72 },
};

export default function AlchemistPage() {
  return (
    <>
      <section style={{ padding: "5.5rem 0 2rem" }}>
        <div style={S.container}>
          <span style={S.label}>ALCHEMIST</span>
          <h1
            style={{
              fontSize: "clamp(2.75rem, 8vw, 6rem)",
              fontWeight: 950,
              letterSpacing: "-0.06em",
              lineHeight: 0.92,
              color: "var(--text-primary)",
              maxWidth: 960,
              marginBottom: "1rem",
            }}
          >
            Models and workpapers with receipts.
          </h1>
          <p style={{ ...S.p, fontSize: "1.08rem", maxWidth: 830 }}>
            ALCHEMIST splits into two operating rooms: banking models that compute
            with source-backed assumptions, and accounting proof systems that refuse
            unsupported closes, journals, reconciliations, and workpapers.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/alchemist/accounting">
              Try an accounting packet
            </Link>
            <Link className="secondary-button purple" href="/alchemist/banking">
              Try a banking packet
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "1rem 0 3rem" }}>
        <div style={S.container}>
          <div className="demo-route-callout">
            <div>
              <span style={S.label}>Try it against an LLM</span>
              <h2>Copy a packet. Paste it into your favorite model. Watch for the release decision.</h2>
              <p>
                The public test is intentionally simple: if an answer approves unsupported work,
                the benchmark fails. If it refuses, names the missing evidence, and avoids
                fabrication, the posture is closer to what clients actually need.
              </p>
            </div>
            <div className="benchmark-card-grid">
              <div className="benchmark-card">
                <span>Score</span>
                <strong>False approval rate</strong>
                <p>Does the model send a broken finance or accounting packet forward?</p>
              </div>
              <div className="benchmark-card">
                <span>Standard</span>
                <strong>Receipts over fluency</strong>
                <p>Can it compute, cite gaps, and stop when evidence runs out?</p>
              </div>
            </div>
          </div>
          <div className="demo-packet-grid">
            {testPackets.map((packet) => (
              <CopyableDemoPacket key={packet.title} {...packet} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "1rem 0 5.5rem" }}>
        <div style={S.container}>
          <div className="alchemist-path-grid">
            {paths.map((path) => (
              <Link href={path.href} key={path.name} className="alchemist-path-card">
                <span>{path.label}</span>
                <strong>{path.name}</strong>
                <p>{path.text}</p>
                <em>{path.proof}</em>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 6rem" }}>
        <div style={S.container}>
          <BringYourOwnPacketChallenge
            title="Bring your own finance or accounting packet."
            packetPlaceholder={`Paste a sanitized close binder, journal batch, reconciliation, DCF assumption set, comps table, credit screen, or deal packet here.\n\nAsk the LLM: Can this be released? Return decision, blockers, missing proof, and recovery actions.`}
            expected="Compute only what is source-backed. Refuse release when proof, definitions, or assumptions are missing."
          />
        </div>
      </section>
    </>
  );
}
