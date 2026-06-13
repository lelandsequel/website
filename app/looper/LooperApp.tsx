"use client";

// LOOPER — the plain-language product surface (client).
//
// Pure presentation. Every result is computed DETERMINISTICALLY on the server
// (page.tsx) and handed down as plain JSON. This component only toggles WHICH
// funded pick is shown — no engine runs in the browser. There is ZERO engine /
// phase / grammar vocabulary on anything a user can see here; the real names
// live only in the opt-in guided tour. 🐦‍⬛ + 🔑

import { useState } from "react";
import type { CSSProperties } from "react";

import {
  Section,
  Card,
  Pill,
  ReceiptBar,
  FrontierPanel,
  T,
} from "@/components/omnis/ui";
import { LOOPER } from "@/lib/products/copy";

// ── view-model (built entirely on the server) ──────────────────────────────────
export interface PlanCardVM {
  key: string;
  title: string;
  items: string[];
}

export interface FrontierVM {
  ambiguous: number;
  looseEnds: number;
  mergesToConfirm: number;
  points: string[];
}

export interface ReprioRowVM {
  id: string;
  title: string;
  weeks: number;
  newlyFunded: boolean;
  isTarget: boolean;
}

export interface ReprioVM {
  weeksBefore: number;
  weeksAfter: number;
  capacity: number;
  before: ReprioRowVM[];
  after: ReprioRowVM[];
  newlyFunded: string[];
}

export interface LooperVM {
  id: string;
  title: string;
  worth: string;
  reach: string;
  mandate: boolean;
  roughWeeks: number;
  realWeeks: number;
  sizeDropped: boolean;
  plan: PlanCardVM[];
  frontier: FrontierVM;
  record: string;
  reprio: ReprioVM | null;
}

export default function LooperApp({ picks }: { picks: LooperVM[] }) {
  // Default to the pick that carries the on-the-spot re-decide (the payoff), so
  // the surprise is visible on load; else the first pick.
  const defaultId = (picks.find((p) => p.reprio) ?? picks[0])?.id ?? "";
  const [selectedId, setSelectedId] = useState(defaultId);
  const sel = picks.find((p) => p.id === selectedId) ?? picks[0];
  if (!sel) return null;

  return (
    <>
      {/* ── 1 · Everything on the table — the interactive lineup ───────────── */}
      <Section label={LOOPER.stages[0].label} title={LOOPER.stages[0].plain}>
        <div data-tour="lineup" style={lineupGrid}>
          {picks.map((p) => {
            const on = p.id === sel.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                aria-pressed={on}
                style={lineupItem(on)}
              >
                <span style={lineupTop}>
                  <span style={{ fontFamily: T.mono, color: T.faint, fontSize: 12 }}>
                    {p.id}
                  </span>
                  {p.mandate && <Pill color={T.gold}>MUST-DO</Pill>}
                </span>
                <span style={{ fontWeight: 700, color: T.ink, lineHeight: 1.3 }}>
                  {p.title}
                </span>
                <span style={lineupMeta}>
                  <span>{p.worth}</span>
                  <span style={{ color: T.faint }}>·</span>
                  <span>reaches {p.reach}</span>
                  <span style={{ color: T.faint }}>·</span>
                  <span>
                    looks like <strong style={{ color: T.ink }}>{p.roughWeeks}w</strong>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p style={hint}>
          Showing the plan for <strong style={{ color: T.ink }}>{sel.title}</strong>.
          Pick another to send it down the line.
        </p>
      </Section>

      {/* ── 2 · The plan for your top pick — plain cards ───────────────────── */}
      <Section label={LOOPER.stages[2].label} title={LOOPER.stages[2].plain}>
        <div data-tour="plan" style={planGrid}>
          {sel.plan.map((c) => (
            <Card key={c.key}>
              <p style={cardLabel}>{c.title}</p>
              {c.items.length ? (
                <ul style={cardList}>
                  {c.items.map((it, i) => (
                    <li key={i} style={{ marginBottom: 5 }}>
                      {it}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: T.faint, fontSize: "0.9rem", margin: 0 }}>
                  Nothing flagged here for this one.
                </p>
              )}
            </Card>
          ))}
        </div>
      </Section>

      {/* ── 3 · The surprise — rough size → real size + the lineup re-decides ─ */}
      <Section label={LOOPER.stages[3].label} title={LOOPER.stages[3].plain}>
        <div data-tour="surprise">
          <Card style={{ marginBottom: "1.1rem" }}>
            <p style={cardLabel}>You guessed → what it actually is</p>
            <p style={bigSize}>
              <span style={{ color: T.faint }}>{sel.roughWeeks}w</span>
              <span style={{ color: T.faint, margin: "0 0.5rem" }}>→</span>
              <span style={{ color: sel.sizeDropped ? T.green : T.ink }}>
                {sel.realWeeks}w
              </span>
            </p>
            <p style={{ color: T.muted, fontSize: "0.95rem", margin: 0 }}>
              {sel.sizeDropped
                ? "Broken into a real plan, it's a fraction of the gut-guess — so the freed-up time lets more ideas through."
                : "Broken into a real plan, the size held about where you guessed."}
            </p>
          </Card>

          {sel.reprio ? (
            <>
              <div style={reprioGrid}>
                <div>
                  <div style={reprioHead}>
                    <span>Before · your guess</span>
                    <span style={{ color: T.faint }}>
                      {sel.reprio.weeksBefore}w of {sel.reprio.capacity}w used
                    </span>
                  </div>
                  <ul style={reprioList}>
                    {sel.reprio.before.map((r) => (
                      <li key={r.id} style={reprioRow(false, r.isTarget)}>
                        <span style={{ fontFamily: T.mono, color: T.faint, fontSize: 11 }}>
                          {r.id}
                        </span>
                        <span style={reprioName}>{r.title}</span>
                        <span style={{ fontFamily: T.mono, fontSize: 12 }}>{r.weeks}w</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div style={reprioHead}>
                    <span>After · the real size</span>
                    <span style={{ color: T.faint }}>
                      {sel.reprio.weeksAfter}w of {sel.reprio.capacity}w used
                    </span>
                  </div>
                  <ul style={reprioList}>
                    {sel.reprio.after.map((r) => (
                      <li key={r.id} style={reprioRow(r.newlyFunded, r.isTarget)}>
                        <span style={{ fontFamily: T.mono, color: T.faint, fontSize: 11 }}>
                          {r.id}
                        </span>
                        <span style={reprioName}>{r.title}</span>
                        <span style={{ fontFamily: T.mono, fontSize: 12 }}>{r.weeks}w</span>
                        {r.newlyFunded && <Pill color={T.green}>NEW</Pill>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p style={hint}>
                {sel.reprio.newlyFunded.length
                  ? `The freed-up time pulled ${sel.reprio.newlyFunded.length} more idea${
                      sel.reprio.newlyFunded.length === 1 ? "" : "s"
                    } onto this round — decided on the spot.`
                  : "The lineup re-decided on the spot with the real size in hand."}
              </p>
            </>
          ) : (
            <p style={hint}>
              Pick the top item in the lineup to watch the whole round re-decide
              on the real size.
            </p>
          )}
        </div>
      </Section>

      {/* ── 4 · The one human call — the frontier, honestly ────────────────── */}
      <Section label={LOOPER.humanCall.label} title={LOOPER.humanCall.plain}>
        <div data-tour="humancall">
          <FrontierPanel
            stats={[
              { n: sel.frontier.ambiguous, label: "ambiguous requirement(s)" },
              { n: sel.frontier.looseEnds, label: "loose end(s)" },
              { n: sel.frontier.mergesToConfirm, label: "merge(s) to confirm" },
            ]}
            items={sel.frontier.points}
          />
        </div>
      </Section>

      {/* ── 5 · Proof — plain points + one signed-record line ──────────────── */}
      <Section label="The receipt" title="Why you can trust what you just saw.">
        <div data-tour="proof">
          <ReceiptBar
            items={[
              ...LOOPER.proof.map((p) => ({ label: "›", value: p })),
              {
                label: "signed record",
                value: `${sel.record} · re-runs identically`,
                color: T.green,
              },
            ]}
          />
        </div>
      </Section>
    </>
  );
}

// ── inline styles (dark product tokens) ────────────────────────────────────────
const lineupGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
  gap: 10,
};

const lineupItem = (on: boolean): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  gap: 7,
  textAlign: "left",
  cursor: "pointer",
  border: `1px solid ${on ? T.accent : T.border}`,
  background: on ? `${T.accent}14` : T.surface,
  borderRadius: 12,
  padding: "0.85rem 0.95rem",
  color: T.ink,
  font: "inherit",
  transition: "border-color .15s ease, background .15s ease",
});

const lineupTop: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
};

const lineupMeta: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  fontSize: "0.85rem",
  color: T.muted,
  flexWrap: "wrap",
};

const hint: CSSProperties = {
  color: T.faint,
  fontSize: "0.9rem",
  margin: "0.9rem 0 0",
};

const planGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

const cardLabel: CSSProperties = {
  fontFamily: T.mono,
  fontSize: 11,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: T.accent,
  margin: "0 0 0.6rem",
};

const cardList: CSSProperties = {
  margin: 0,
  paddingLeft: "1.05rem",
  color: T.muted,
  fontSize: "0.92rem",
  lineHeight: 1.55,
};

const bigSize: CSSProperties = {
  fontFamily: T.mono,
  fontSize: "clamp(2rem, 6vw, 3rem)",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  margin: "0.2rem 0 0.6rem",
};

const reprioGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 14,
};

const reprioHead: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: 8,
  fontFamily: T.mono,
  fontSize: 11.5,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: T.muted,
  marginBottom: 8,
};

const reprioList: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const reprioRow = (isNew: boolean, isTarget: boolean): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 9,
  border: `1px solid ${isNew ? `${T.green}66` : isTarget ? `${T.accent}55` : T.border}`,
  background: isNew ? `${T.green}12` : T.surface,
  borderRadius: 9,
  padding: "0.5rem 0.7rem",
});

const reprioName: CSSProperties = {
  flex: 1,
  fontSize: "0.9rem",
  color: T.ink,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
