// Stage 3 — BUILD + GATE page (async server component)
//
// Sibling of /loop. Computes the full refuse→fix→ship cycle deterministically
// server-side; hands a plain JSON view-model to FactoryExplorer for interactivity.
// 🐦‍⬛ + 🔑

import type { Metadata } from "next";

import { priceQuote as brokenBuild } from "@/lib/build-leg/demo/broken/priceQuote";
import { priceQuote as fixedBuild } from "@/lib/build-leg/demo/candidate/priceQuote";
import {
  runBuildLeg,
  STALE_DATA_STORY,
  type Builder,
} from "@/lib/build-leg";
import FactoryExplorer, { type FactoryVM } from "./FactoryExplorer";
import styles from "./factory.module.css";

export const metadata: Metadata = {
  title:
    "Stage 3 — Build + Gate: REFUSE → RESOLVE → RECOMPUTE | JourdanLabs OMNIS",
  description:
    "The build leg of the OMNIS loop. An agent writes code; the validator runs the 6D acceptance criteria as executable probes and refuses anything that fails a blocking one — REFUSE → RESOLVE → RECOMPUTE until it ships. AI that can't lie about whether the work is right, at the code layer. Deterministic, keyless, synthetic data.",
};

const short = (h: string): string =>
  h.length > 20 ? `${h.slice(0, 10)}…${h.slice(-6)}` : h;

export default async function FactoryPage() {
  // ── Run the REFUSE → RESOLVE → RECOMPUTE cycle (deterministic) ───────────
  const selfCorrecting: Builder = ({ round }) =>
    round === 1 ? { priceQuote: brokenBuild } : { priceQuote: fixedBuild };

  const result = await runBuildLeg(STALE_DATA_STORY, selfCorrecting, {
    maxRounds: 3,
  });

  // ── Build the view-model (serializable — no functions) ────────────────────
  const vm: FactoryVM = {
    storyId: result.storyId,
    sourceInitiative: result.sourceInitiative,
    status: result.status,
    roundsToGreen: result.roundsToGreen,
    ledgerHead: result.ledgerHead,
    rounds: result.rounds.map((r) => ({
      round: r.round,
      verdict: r.verdict.verdict,
      probes: r.verdict.probes.map((p) => ({
        id: p.id,
        text: p.text,
        blocking: p.blocking,
        pass: p.pass,
        detail: p.detail,
      })),
      resolve: r.verdict.resolve.map((n) => ({
        acId: n.acId,
        required: n.required,
      })),
      ledgerSeq: r.ledgerSeq,
      ledgerHash: r.ledgerHash,
      summary: r.verdict.summary,
    })),
  };

  return (
    <main className={styles.page}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <p className={styles.kicker}>JourdanLabs · OMNIS — the build leg</p>
        <h1 className={styles.title}>
          Stage 3 — Build + Gate
          <span className={styles.synthetic}>SYNTHETIC DATA</span>
        </h1>
        <p className={styles.sub}>
          Agility decides what to build → 6D specs how →{" "}
          <strong>the build leg builds it and gates it.</strong> An agent writes the code;
          the <strong>validator runs the acceptance criteria as executable probes</strong> and
          refuses anything that fails a blocking one —{" "}
          <strong>REFUSE → RESOLVE → RECOMPUTE</strong> until it ships.{" "}
          <em>
            &ldquo;AI that can&rsquo;t lie about whether the work is right&rdquo; — at the code layer.
          </em>{" "}
          Deterministic · keyless.
        </p>

        {/* Three-stage ribbon — third step highlighted */}
        <div className={styles.ribbon}>
          <span className={styles.ribbonStep}>Agility decides</span>
          <span className={styles.ribbonArrow}>→</span>
          <span className={styles.ribbonStep}>6D specs</span>
          <span className={styles.ribbonArrow}>→</span>
          <span className={`${styles.ribbonStep} ${styles.ribbonStepActive}`}>
            Build + Gate
          </span>
          <span className={styles.ribbonArrow}>→</span>
          <span className={styles.ribbonStep}>Agility re-decides ↺</span>
        </div>

        {/* Summary receipt bar */}
        <div className={styles.receiptBar}>
          <span>
            <span className={styles.recLabel}>story</span>
            <code>{result.storyId}</code>
          </span>
          <span>
            <span className={styles.recLabel}>initiative</span>
            <code>{result.sourceInitiative}</code>
          </span>
          <span>
            <span className={styles.recLabel}>outcome</span>
            <code>{result.status}</code>
          </span>
          <span>
            <span className={styles.recLabel}>rounds to green</span>
            <code>{result.roundsToGreen ?? "—"}</code>
          </span>
          <span>
            <span className={styles.recLabel}>ledger head (LUNA)</span>
            <code>{short(result.ledgerHead)}</code>
          </span>
        </div>
      </header>

      {/* ── Story card ────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2>
          <span className={styles.step}>WORK ORDER</span>
          The story — acceptance criteria as executable probes
        </h2>
        <p className={styles.lede}>
          A 6D Distribute story is already a build work-order: it carries acceptance criteria that
          the validator runs as deterministic probes. The builder must satisfy every{" "}
          <span className={styles.blockingTag} style={{ display: "inline" }}>BLOCKING</span>{" "}
          criterion before the gate passes.
        </p>

        <div className={styles.storyCard}>
          <div className={styles.storyMeta}>
            <span>
              <strong>{STALE_DATA_STORY.sourceInitiative}</strong>
            </span>
            <span>story: {STALE_DATA_STORY.storyId}</span>
          </div>
          <p className={styles.storyTitle}>{STALE_DATA_STORY.title}</p>

          <ul className={styles.acList}>
            {STALE_DATA_STORY.acceptance.map((ac) => (
              <li key={ac.id} className={styles.acItem}>
                <span className={styles.acId}>{ac.id}</span>
                <span className={styles.acText}>{ac.text}</span>
                {ac.blocking && (
                  <span className={styles.blockingTag}>BLOCKING</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FactoryExplorer — the loop + LUNA chain (client component) ───── */}
      <FactoryExplorer vm={vm} />

      {/* ── Summary / receipt bar ─────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2>
          <span className={styles.step}>RECEIPT</span>
          Build verdict — the gate sealed it
        </h2>
        <p className={styles.lede}>
          The gate rendered its final verdict. Every round — including the refuse — is sealed
          into the LUNA chain; the head commits the complete history. Alter any round and the
          head breaks.
        </p>

        <div className={styles.summaryBar}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>outcome</span>
            <span className={styles.summaryValue}>{result.status}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>rounds to green</span>
            <span className={styles.summaryValue}>{result.roundsToGreen ?? "—"}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>total rounds</span>
            <span className={styles.summaryValue}>{result.rounds.length}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>final ledger head</span>
            <span className={styles.summaryValueMono}>{short(result.ledgerHead)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>story</span>
            <span className={styles.summaryValueMono}>{result.storyId}</span>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        This is Stage 3 — the third stage of the OMNIS loop. Agility (Stage 1) decided{" "}
        <em>what</em> to build; 6D (Stage 2) specified <em>how</em>; the build leg (Stage 3)
        built it and gated it. The next seam: the build verdict and real outcome feed{" "}
        <em>back</em> into Agility to re-prioritize against the actual delivered size and any
        open issues the gate surfaced. The receipt rides the whole circle. Deterministic and
        the portfolio is synthetic. 🐦‍⬛ + 🔑
      </footer>
    </main>
  );
}
