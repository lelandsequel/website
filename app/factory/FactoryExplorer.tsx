"use client";

// FACTORY EXPLORER — Stage 3 Build + Gate (client component).
//
// Pure presentation: all data is computed deterministically on the server
// (page.tsx) and passed down as a plain JSON view-model. This component handles
// interactive expand/collapse of round details only — no engine runs in the
// browser.
// 🐦‍⬛ + 🔑

import { useState } from "react";
import styles from "./factory.module.css";

// ── View-model types ──────────────────────────────────────────────────────────

export interface ProbeVM {
  id: string;
  text: string;
  blocking: boolean;
  pass: boolean;
  detail: string;
}

export interface ResolveNeedVM {
  acId: string;
  required: string;
}

export interface RoundVM {
  round: number;
  verdict: "NO_OBJECTION" | "HOLD" | "REFUSE";
  probes: ProbeVM[];
  resolve: ResolveNeedVM[];
  ledgerSeq: number;
  ledgerHash: string;
  summary: string;
}

export interface FactoryVM {
  storyId: string;
  sourceInitiative: string;
  status: "shipped" | "refused-exhausted";
  roundsToGreen: number | null;
  ledgerHead: string;
  rounds: RoundVM[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const short = (h: string): string =>
  h.length > 20 ? `${h.slice(0, 10)}…${h.slice(-6)}` : h;

const verdictBadgeClass = (v: string): string =>
  v === "REFUSE"
    ? styles.verdictBadgeRefuse
    : v === "HOLD"
      ? styles.verdictBadge // hold is rare; keep plain
      : styles.verdictBadgeOk;

const roundCardClass = (v: string): string =>
  v === "REFUSE"
    ? `${styles.roundCard} ${styles.roundCardRefuse}`
    : v === "NO_OBJECTION"
      ? `${styles.roundCard} ${styles.roundCardOk}`
      : styles.roundCard;

// ── Main component ────────────────────────────────────────────────────────────

export default function FactoryExplorer({ vm }: { vm: FactoryVM }) {
  // All rounds start expanded so the arc is immediately legible on load.
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set(vm.rounds.map((r) => r.round)));

  const toggle = (round: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(round) ? next.delete(round) : next.add(round);
      return next;
    });

  return (
    <>
      {/* ── STEP 1 · The build loop — REFUSE → RESOLVE → RECOMPUTE ───────── */}
      <section className={styles.section}>
        <h2>
          <span className={styles.step}>THE LOOP</span>
          <span className={styles.engine}>BUILD + GATE</span> — REFUSE → RESOLVE → RECOMPUTE
        </h2>
        <p className={styles.lede}>
          Each round: the builder ships code → the validator runs the acceptance criteria as{" "}
          <strong>executable probes</strong> → AURORA renders a verdict. On{" "}
          <code>REFUSE</code> the exact failing criteria are handed back; on{" "}
          <code>NO_OBJECTION</code> the build ships. Every round is sealed into the LUNA chain.
        </p>

        <div className={styles.loop}>
          {vm.rounds.map((round, idx) => {
            const isOpen = expanded.has(round.round);
            const isRefuse = round.verdict === "REFUSE";
            const isLast = idx === vm.rounds.length - 1;
            const hasResolve = round.resolve.length > 0;

            return (
              <div key={round.round}>
                {/* ── Round card ── */}
                <div className={roundCardClass(round.verdict)}>
                  <div className={styles.roundHead}>
                    <span className={styles.roundNum}>Round {round.round}</span>
                    <span
                      className={`${styles.verdictBadge} ${verdictBadgeClass(round.verdict)}`}
                    >
                      {round.verdict}
                    </span>
                    {round.verdict === "NO_OBJECTION" && (
                      <span className={styles.roundShippedNote}>shipped.</span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggle(round.round)}
                      style={{
                        marginLeft: "auto",
                        background: "none",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "6px",
                        color: "#8b8b95",
                        cursor: "pointer",
                        fontSize: "0.72rem",
                        padding: "0.15em 0.6em",
                        fontFamily: "var(--font-mono, ui-monospace, monospace)",
                      }}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? "collapse" : "expand"}
                    </button>
                  </div>

                  {isOpen && (
                    <>
                      {/* Probe results */}
                      <ul className={styles.probeList}>
                        {round.probes.map((probe) => (
                          <li
                            key={probe.id}
                            className={`${styles.probeItem} ${!probe.pass ? styles.probeItemFail : ""}`}
                          >
                            <span className={styles.probeMark}>
                              {probe.pass ? "✔" : "✖"}
                            </span>
                            <div className={styles.probeBody}>
                              <div className={styles.probeText}>
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono, ui-monospace, monospace)",
                                    fontSize: "0.7rem",
                                    color: "#7d7d88",
                                    marginRight: "0.35rem",
                                  }}
                                >
                                  {probe.id}
                                </span>
                                {probe.text}
                                {probe.blocking && (
                                  <span
                                    className={styles.blockingTag}
                                    style={{ marginLeft: "0.4rem" }}
                                  >
                                    BLOCKING
                                  </span>
                                )}
                              </div>
                              <div
                                className={`${styles.probeDetail} ${!probe.pass ? styles.probeDetailFail : ""}`}
                              >
                                {probe.detail}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {/* REFUSE → RESOLVE panel (only on refuse rounds with resolve needs) */}
                      {isRefuse && hasResolve && (
                        <div className={styles.resolvePanel}>
                          <div className={styles.resolvePanelHead}>
                            <span className={styles.resolvePanelLabel}>
                              REFUSE → RESOLVE
                            </span>
                            <span className={styles.resolvePanelSub}>
                              handed back to the builder — these must be satisfied before
                              the next round ships.
                            </span>
                          </div>
                          <ul className={styles.resolveList}>
                            {round.resolve.map((need) => (
                              <li key={need.acId} className={styles.resolveItem}>
                                <span className={styles.resolveAcId}>{need.acId}</span>
                                <span className={styles.resolveRequired}>
                                  {need.required}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Round receipt */}
                      <div className={styles.roundReceipt}>
                        <span>
                          <span className={styles.recLabel}>ledger seq</span>
                          <code>{round.ledgerSeq}</code>
                        </span>
                        <span>
                          <span className={styles.recLabel}>round seal (LUNA)</span>
                          <code>{short(round.ledgerHash)}</code>
                        </span>
                        <span>
                          <span className={styles.recLabel}>summary</span>
                          <code style={{ fontSize: "0.7rem", color: "#8b8b95" }}>
                            {round.summary}
                          </code>
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Connector between rounds — show RECOMPUTE after a REFUSE */}
                {!isLast && (
                  <div className={styles.loopConnector}>
                    <div className={styles.connectorLine} />
                    {isRefuse && (
                      <span className={styles.connectorLabel}>
                        RECOMPUTE — builder self-corrects →
                      </span>
                    )}
                    <div className={styles.connectorLine} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── STEP 2 · The LUNA chain ───────────────────────────────────────── */}
      <section className={styles.section}>
        <h2>
          <span className={styles.step}>CHAIN</span>
          <span className={styles.engine}>LUNA</span> — every round sealed, append-only
        </h2>
        <p className={styles.lede}>
          Every round is sealed into the LUNA chain at the moment it completes. The chain head
          moves on each round; the final head commits the build&rsquo;s whole history. It verifies:
          truncate, reorder, or alter any round and the head breaks.
        </p>

        <div className={styles.lunaChain}>
          {vm.rounds.map((round, idx) => (
            <div key={round.round} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div className={styles.lunaLink}>
                <span className={styles.lunaLinkLabel}>round {round.round}</span>
                <span className={styles.lunaLinkSeq}>seq {round.ledgerSeq}</span>
                <span className={styles.lunaLinkHash}>{short(round.ledgerHash)}</span>
              </div>
              {idx < vm.rounds.length - 1 && (
                <span className={styles.lunaArrow}>→</span>
              )}
            </div>
          ))}
          <span className={styles.lunaArrow}>→</span>
          <div className={styles.lunaHead}>
            <span className={styles.lunaHeadLabel}>ledger head</span>
            <span>{short(vm.ledgerHead)}</span>
          </div>
        </div>
        <p className={styles.lunaCaption}>
          Ledger head: <code style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)", fontSize: "0.75rem" }}>{short(vm.ledgerHead)}</code> —
          every round sealed into the append-only chain; it verifies.
        </p>
      </section>
    </>
  );
}
