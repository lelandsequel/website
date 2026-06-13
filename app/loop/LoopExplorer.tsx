"use client";

// THE AGILITY ↔ 6D LOOP — interactive explorer (client).
//
// Pure presentation. Every loop result is computed DETERMINISTICALLY on the
// server (page.tsx) and handed down as a plain JSON view-model. This component
// only toggles WHICH funded initiative's spec is shown — no engine runs in the
// browser, nothing here is non-deterministic.
// 🐦‍⬛ + 🔑

import { useState } from "react";
import styles from "./loop.module.css";

type Verdict = "NO_OBJECTION" | "HOLD" | "REFUSE";

export interface PhaseVerdictVM {
  phase: string;
  n: number;
  verdict: Verdict;
  reason: string;
}

export interface OpenIssueVM {
  key: string;
  phase: string;
  verdict: "REFUSE" | "HOLD";
  blocking: boolean;
  required: string;
}

export interface TraceVM {
  /** The Agility evidence field, e.g. "reach". */
  evidenceField: string;
  /** The evidence source string, e.g. "Partnerships TAM model 2026-Q1". */
  evidenceSource: string;
  /** The 6D source atom id it became, e.g. "intent.source.1". */
  atomId: string;
  /** The 6D artifact element that cites it, e.g. "define.assumption.1". */
  elementId: string;
  elementKind: string;
  /** VELLUM status of that element. */
  bound: boolean;
  /** sha256 of the bound source (first 16 chars shown). */
  sourceHash: string;
}

export interface ReprioRowVM {
  id: string;
  title: string;
  weeks: number;
  newlyFunded: boolean;
  isTarget: boolean;
}

export interface FundedVM {
  id: string;
  title: string;
  valueType: string;
  rank: number;
  mandate: boolean;
  roughWeeks: number;
  reach: string;
  // 6D spec results
  v1Receipt: string;
  cosmicRunHash: string;
  specReceipt: string;
  gateSummary: { NO_OBJECTION: number; HOLD: number; REFUSE: number };
  phases: PhaseVerdictVM[];
  trace: TraceVM | null;
  // reverse-leg feedback
  reEstimatedWeeks: number;
  reEstimateDiffers: boolean;
  dependencyCount: number;
  openIssues: OpenIssueVM[];
  verdict: "ready" | "needs-resolution";
  // closed-loop re-prioritize (only present for the headline target)
  reprio: {
    capacityBefore: number;
    capacityAfter: number;
    headBefore: string;
    headAfter: string;
    before: ReprioRowVM[];
    after: ReprioRowVM[];
    newlyFunded: string[];
  } | null;
}

const short = (h: string): string => (h.length > 20 ? `${h.slice(0, 12)}…${h.slice(-8)}` : h);

const verdictClass = (v: Verdict | "ready" | "needs-resolution"): string =>
  v === "REFUSE" || v === "needs-resolution"
    ? styles.refuse
    : v === "HOLD"
      ? styles.hold
      : styles.ok;

export default function LoopExplorer({ funded }: { funded: FundedVM[] }) {
  // Default to the initiative carrying the closed-loop re-prioritize (the
  // headline payoff), so STEP 5 is visible on load; else the first funded item.
  const defaultId = (funded.find((f) => f.reprio) ?? funded[0])?.id ?? "";
  const [selectedId, setSelectedId] = useState(defaultId);
  const sel = funded.find((f) => f.id === selectedId) ?? funded[0];
  if (!sel) return null;

  return (
    <>
      {/* ── STEP 1 · Agility decides — the funded NOW queue ────────────────── */}
      <section className={styles.section}>
        <h2>
          <span className={styles.step}>STEP 1</span>
          <span className={styles.engine}>AGILITY</span> decides — the funded NOW queue
        </h2>
        <p className={styles.lede}>
          Agility ran the seed portfolio through{" "}
          <code>intake → score → tier → allocate</code> and funded the queue below against
          capacity. Pick one to send it down the architecture pipeline.
        </p>
        <div className={styles.queue}>
          {funded.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedId(f.id)}
              className={`${styles.queueItem} ${f.id === sel.id ? styles.queueItemActive : ""}`}
              aria-pressed={f.id === sel.id}
            >
              <span className={styles.queueTop}>
                <span className={styles.qid}>{f.id}</span>
                <span className={styles.qtitle}>{f.title}</span>
                {f.mandate && <span className={styles.mandateTag}>MANDATE</span>}
              </span>
              <span className={styles.qmeta}>
                <span>
                  rank <strong>#{f.rank}</strong>
                </span>
                <span>
                  rough <strong>{f.roughWeeks}w</strong>
                </span>
                <span>{f.valueType}</span>
              </span>
            </button>
          ))}
        </div>
        <p className={styles.pickHint}>
          Showing: <code>{sel.id}</code> — {sel.title}
        </p>
      </section>

      {/* ── STEP 2 · 6D specs it — verdict-gated artifacts ─────────────────── */}
      <section className={styles.section}>
        <h2>
          <span className={styles.step}>STEP 2</span>
          <span className={styles.engine}>6D COSMIC</span> specs it — verdict-gated artifacts
        </h2>
        <p className={styles.lede}>
          <code>initiativeToIntent({sel.id})</code> → <code>runSixDCosmic(intent)</code>. The
          six phases run deterministically; <strong>AURORA</strong> issues a verdict per phase,{" "}
          <strong>VELLUM</strong> binds every element to a source, <strong>LUNA</strong> seals the
          run into the chain.
        </p>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3>
              {sel.id} · {sel.title}
            </h3>
            <span className={`${styles.pill} ${verdictClass(sel.verdict)}`}>{sel.verdict}</span>
          </div>

          <div className={styles.grid}>
            {sel.phases.map((p) => (
              <div key={p.phase} className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.phaseN}>{p.n}</span>
                  <span className={styles.phaseName}>{p.phase}</span>
                  <span className={`${styles.pill} ${verdictClass(p.verdict)}`}>{p.verdict}</span>
                </div>
                <p className={styles.cardReason}>{p.reason}</p>
              </div>
            ))}
          </div>

          <div className={styles.receiptBar}>
            <span>
              <span className={styles.recLabel}>v1 receipt</span>
              <code>{short(sel.v1Receipt)}</code>
            </span>
            <span>
              <span className={styles.recLabel}>COSMIC run hash</span>
              <code>{short(sel.cosmicRunHash)}</code>
            </span>
            <span>
              <span className={styles.recLabel}>LUNA chain head</span>
              <code>{short(sel.specReceipt)}</code>
            </span>
            <span>
              <span className={styles.recLabel}>gate</span>
              <code>
                {sel.gateSummary.NO_OBJECTION} ok · {sel.gateSummary.HOLD} hold ·{" "}
                {sel.gateSummary.REFUSE} refuse
              </code>
            </span>
          </div>
        </div>
      </section>

      {/* ── STEP 3 · Provenance flows Agility → 6D (load-bearing) ──────────── */}
      <section className={styles.section}>
        <h2>
          <span className={styles.step}>STEP 3</span>
          The receipt rides the circle — <span className={styles.engine}>VELLUM</span> provenance
        </h2>
        <p className={styles.lede}>
          The load-bearing claim: Agility&rsquo;s <code>evidence</code> becomes 6D{" "}
          <code>sourceMaterial</code>, which VELLUM hash-binds. A real artifact element traces back
          — unbroken — to where Agility says the number came from.
        </p>
        {sel.trace ? (
          <div className={styles.trace}>
            <div className={styles.traceFlow}>
              <span className={styles.traceNode}>
                <small>Agility evidence</small>
                <code>
                  {sel.trace.evidenceField}: {sel.trace.evidenceSource}
                </code>
              </span>
              <span className={styles.traceArrow}>→ initiativeToIntent →</span>
              <span className={styles.traceNode}>
                <small>6D source atom</small>
                <code>{sel.trace.atomId}</code>
              </span>
              <span className={styles.traceArrow}>→ cited by →</span>
              <span className={styles.traceNode}>
                <small>
                  6D element ({sel.trace.elementKind}){" "}
                  {sel.trace.bound && <span className={styles.estTo}>BOUND</span>}
                </small>
                <code>{sel.trace.elementId}</code>
              </span>
            </div>
            <p className={styles.traceHash}>
              VELLUM source hash: {short(sel.trace.sourceHash)} — the element cannot ship as fact
              unless this binds.
            </p>
          </div>
        ) : (
          <p className={styles.note}>
            This initiative&rsquo;s artifacts didn&rsquo;t happen to cite an evidence atom directly
            on this run — the flow-through is identical; the trace just landed on intent context
            atoms instead. (See <code>HL-001</code> for a direct evidence-source citation.)
          </p>
        )}
      </section>

      {/* ── STEP 4 · 6D feeds back to Agility — re-estimate + open issues ──── */}
      <section className={styles.section}>
        <h2>
          <span className={styles.step}>STEP 4</span>
          <span className={styles.engine}>6D</span> feeds back — <code>artifactsToInitiativeUpdate</code>
        </h2>
        <p className={styles.lede}>
          The spec measured the <strong>real, decomposed size</strong> (Distribute slices,
          S/M/L → 1/2/4&nbsp;wk) and surfaced every open issue AURORA refused or held. That feeds
          back to Agility.
        </p>
        <div className={styles.feedback}>
          <div className={styles.metric}>
            <p className={styles.metricLabel}>Re-estimated effort</p>
            <p className={styles.metricBig}>
              <span className={styles.estFrom}>{sel.roughWeeks}w</span>
              <span className={styles.estArrow}>→</span>
              <span className={styles.estTo}>{sel.reEstimatedWeeks}w</span>
            </p>
            <p className={styles.metricSub}>
              {sel.reEstimateDiffers
                ? "The decomposed size differs from the rough estimate — exactly the signal the loop exists to catch."
                : "Decomposed size matched the rough estimate this time."}
            </p>
          </div>
          <div className={styles.metric}>
            <p className={styles.metricLabel}>Open issues fed back</p>
            <p className={styles.metricBig}>{sel.openIssues.length}</p>
            <p className={styles.metricSub}>
              {sel.dependencyCount} spec-derived dependenc
              {sel.dependencyCount === 1 ? "y" : "ies"} ·{" "}
              <span className={verdictClass(sel.verdict)}>{sel.verdict}</span>
            </p>
          </div>
        </div>
        {sel.openIssues.length > 0 && (
          <ul className={styles.issues}>
            {sel.openIssues.slice(0, 6).map((iss) => (
              <li key={iss.key}>
                <span className={styles.issuePhase}>[{iss.phase}]</span>{" "}
                <span className={verdictClass(iss.verdict)}>{iss.verdict}</span>
                {iss.blocking ? " (blocking)" : ""} — {iss.required}
              </li>
            ))}
            {sel.openIssues.length > 6 && <li>…and {sel.openIssues.length - 6} more.</li>}
          </ul>
        )}
      </section>

      {/* ── STEP 5 · Agility re-decides — the queue re-prioritizes ─────────── */}
      {sel.reprio && (
        <section className={styles.section}>
          <h2>
            <span className={styles.step}>STEP 5</span>
            <span className={styles.engine}>AGILITY</span> re-decides — the queue re-prioritizes
          </h2>
          <p className={styles.lede}>
            Feed the real <strong>{sel.reEstimatedWeeks}w</strong> back into Agility&rsquo;s{" "}
            <code>allocate</code> in place of the rough <strong>{sel.roughWeeks}w</strong>. Freed
            capacity pulls benched work onto the funded queue — and the Agility ledger head moves,
            so the re-decision is recorded.
          </p>
          <div className={styles.reprio}>
            <div className={styles.reprioCol}>
              <div className={styles.reprioLabel}>
                <span>Before · rough size</span>
                <span>{sel.reprio.capacityBefore}w used</span>
              </div>
              <ul className={styles.queueList}>
                {sel.reprio.before.map((r) => (
                  <li
                    key={r.id}
                    className={`${styles.queueRow} ${r.isTarget ? styles.rowChanged : ""}`}
                  >
                    <code>{r.id}</code>
                    <span className={styles.queueRowName}>{r.title}</span>
                    <span className={styles.queueRowWeeks}>{r.weeks}w</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.reprioCol}>
              <div className={styles.reprioLabel}>
                <span>After · real size</span>
                <span>{sel.reprio.capacityAfter}w used</span>
              </div>
              <ul className={styles.queueList}>
                {sel.reprio.after.map((r) => (
                  <li
                    key={r.id}
                    className={`${styles.queueRow} ${r.newlyFunded ? styles.rowNew : ""} ${
                      r.isTarget ? styles.rowChanged : ""
                    }`}
                  >
                    <code>{r.id}</code>
                    <span className={styles.queueRowName}>{r.title}</span>
                    <span className={styles.queueRowWeeks}>{r.weeks}w</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className={styles.note}>
            Agility ledger head: <code>{short(sel.reprio.headBefore)}</code> →{" "}
            <code>{short(sel.reprio.headAfter)}</code>. Newly funded:{" "}
            <strong>{sel.reprio.newlyFunded.join(", ") || "none"}</strong>. Decide → specify →
            measure → re-decide.
          </p>
        </section>
      )}
    </>
  );
}
