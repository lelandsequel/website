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
import { prioritize, INITIATIVES } from "@/lib/agility";
import { buildOutcomeToFeedback, applyBuildFeedback } from "@/lib/loop/build-feedback";
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

  // ── STAGE 3 → BACK TO AGILITY — the build outcome re-decides the portfolio ──
  // 6D fed back EFFORT; the build leg feeds back proven DELIVERABILITY (confidence).
  const portfolioBefore = prioritize(INITIATIVES, { capacity: 12 });
  const initiative = portfolioBefore.funded.find(
    (i) => i.id === STALE_DATA_STORY.sourceInitiative,
  );
  const shippedFeedback = initiative ? buildOutcomeToFeedback(result, initiative) : null;
  // Counterfactual: had the gate refused it, confidence drops and Agility re-decides.
  const refusedRun = await runBuildLeg(
    STALE_DATA_STORY,
    () => ({ priceQuote: brokenBuild }),
    { maxRounds: 3 },
  );
  const refusedFeedback = initiative ? buildOutcomeToFeedback(refusedRun, initiative) : null;
  const portfolioAfter = refusedFeedback
    ? prioritize(applyBuildFeedback(INITIATIVES, refusedFeedback), { capacity: 12 })
    : portfolioBefore;
  const scoreOf = (p: typeof portfolioBefore, id: string): number | null =>
    (p.funded.find((f) => f.id === id) as { _score?: number } | undefined)?._score ?? null;
  const hlScoreBefore = scoreOf(portfolioBefore, STALE_DATA_STORY.sourceInitiative);
  const hlScoreAfter = scoreOf(portfolioAfter, STALE_DATA_STORY.sourceInitiative);

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

      {/* ── Stage 3 → back to Agility — the circle closes ─────────────────── */}
      {shippedFeedback && refusedFeedback && (
        <section className={styles.section}>
          <h2>
            <span className={styles.step}>BACK TO AGILITY</span>
            The circle closes — the build verdict re-decides the portfolio
          </h2>
          <p className={styles.lede}>
            6D fed back the re-estimated <em>effort</em>. The build leg feeds back the measured{" "}
            <em>deliverability</em>: Agility stops <em>guessing</em> whether{" "}
            {STALE_DATA_STORY.sourceInitiative} can ship — the gate proved it.{" "}
            <span style={{ opacity: 0.7 }}>
              (Agility&rsquo;s score = reach × NPV × <strong>confidence</strong> ÷ effort.)
            </span>
          </p>

          <div className={styles.summaryBar}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>build outcome</span>
              <span className={styles.summaryValue}>shipped</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>proven deliverability</span>
              <span className={styles.summaryValue}>
                {shippedFeedback.provenDeliveryConfidence.toFixed(1)}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>vs Agility&rsquo;s estimate</span>
              <span className={styles.summaryValue}>
                {shippedFeedback.confidenceChanged ? "REVISED" : "CONFIRMED"}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>build receipt → Agility</span>
              <span className={styles.summaryValueMono}>{short(shippedFeedback.buildReceipt)}</span>
            </div>
          </div>

          <p className={styles.lede} style={{ marginTop: "1.75rem" }}>
            And the gate cuts both ways: had the builder <strong>failed to pass it</strong> in
            budget, proven deliverability would fall to{" "}
            {refusedFeedback.provenDeliveryConfidence.toFixed(1)} —{" "}
            {STALE_DATA_STORY.sourceInitiative}&rsquo;s risk-adjusted score{" "}
            {hlScoreBefore} → {hlScoreAfter}, and Agility records a new decision. The portfolio
            won&rsquo;t keep funding what the build can&rsquo;t deliver.
          </p>
          <div className={styles.summaryBar}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>counterfactual</span>
              <span className={styles.summaryValue}>refused</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>{STALE_DATA_STORY.sourceInitiative} score</span>
              <span className={styles.summaryValue}>
                {hlScoreBefore} → {hlScoreAfter}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Agility ledger head</span>
              <span className={styles.summaryValueMono}>
                {short(portfolioBefore.head ?? "")} → {short(portfolioAfter.head ?? "")}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        This is Stage 3 — the third stage of the OMNIS loop, and the loop is now{" "}
        <em>closed</em>. Agility (Stage 1) decided <em>what</em> to build; 6D (Stage 2) specified{" "}
        <em>how</em>; the build leg (Stage 3) built it and gated it — and both legs feed{" "}
        <em>back</em> into Agility: 6D&rsquo;s re-estimated effort and the build leg&rsquo;s proven
        deliverability re-enter the portfolio, so Agility re-decides on what was{" "}
        <em>measured</em>, not guessed. The receipt rides the whole circle. Deterministic; the
        portfolio is synthetic. 🐦‍⬛ + 🔑
      </footer>
    </main>
  );
}
