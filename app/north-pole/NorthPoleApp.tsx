"use client";

// NORTH POLE — the "Build & check" centerpiece (client component).
//
// Presentation only. The server (page.tsx) ran the whole build twice
// deterministically — round 1 built the broken version, the check caught it and
// refused; round 2 fixed it and shipped clean — and handed down a plain JSON
// view-model. This component does ONE thing: let the reader toggle/step between
// the two rounds so the "it caught its own mistake and wouldn't ship" moment is
// the thing they touch. No engine runs in the browser. No jargon on the glass.
// 🐦‍⬛ + 🔑

import { useState } from "react";
import { Card, Pill, T } from "@/components/omnis/ui";

// ── View-model the server hands down (plain, serializable) ───────────────────

export interface CheckLineVM {
  /** The plain rule, in human words — no engine names. */
  rule: string;
  /** Did the build satisfy this rule? */
  ok: boolean;
  /** What actually happened, in plain words. */
  detail: string;
}

export interface RoundVM {
  /** 1 or 2. */
  n: number;
  /** True on the round the check refused to ship. */
  refused: boolean;
  /** Plain one-liner: what happened this round. */
  headline: string;
  /** The per-rule results, plain. */
  checks: CheckLineVM[];
  /** The single plain takeaway shown under the checks. */
  note: string;
  /** A short "signed record" line for this round (no hash-as-jargon framing). */
  signed: string;
}

export interface BuildVM {
  /** What got built, in plain words. */
  whatItBuilt: string;
  rounds: RoundVM[];
  /** The human-call note copy. */
  humanCallLabel: string;
  humanCallPlain: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function NorthPoleApp({ vm }: { vm: BuildVM }) {
  // Start on round 1 — the refusal IS the story; let them land on it first.
  const [active, setActive] = useState(0);
  const round = vm.rounds[active] ?? vm.rounds[0];
  const isRefused = round.refused;

  const accent = isRefused ? T.red : T.green;
  const passCount = round.checks.filter((c) => c.ok).length;

  return (
    <section style={{ marginBottom: "2.2rem" }} data-tour="build">
      <h2
        style={{
          fontSize: "0.78rem",
          fontFamily: T.mono,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: T.red,
          margin: "0 0 0.5rem",
        }}
      >
        Build &amp; check
      </h2>
      <p style={{ color: T.muted, fontSize: "0.95rem", margin: "0 0 1rem", maxWidth: "66ch" }}>
        It builds the thing — then checks its own work against the plan. This is the part
        nobody else ships:{" "}
        <strong style={{ color: T.ink }}>
          it caught its own mistake and wouldn&rsquo;t ship the broken version.
        </strong>{" "}
        Step through the two passes.
      </p>

      {/* What it built — plain */}
      <p
        style={{
          fontFamily: T.mono,
          fontSize: 12.5,
          color: T.faint,
          margin: "0 0 0.9rem",
        }}
      >
        Building: <span style={{ color: T.muted }}>{vm.whatItBuilt}</span>
      </p>

      {/* ── The two-pass toggle ─────────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Build passes"
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem" }}
      >
        {vm.rounds.map((r, i) => {
          const on = i === active;
          const col = r.refused ? T.red : T.green;
          return (
            <button
              key={r.n}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(i)}
              style={{
                fontFamily: T.mono,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.04em",
                cursor: "pointer",
                padding: "8px 15px",
                borderRadius: 999,
                border: `1px solid ${on ? col : T.border}`,
                background: on ? `${col}1f` : "transparent",
                color: on ? col : T.faint,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span aria-hidden="true" style={{ fontSize: 13, lineHeight: 1 }}>
                {r.refused ? "⛔" : "✅"}
              </span>
              Pass {r.n}
              <span style={{ fontWeight: 500, opacity: 0.85 }}>
                {r.refused ? "caught the mistake" : "shipped clean"}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── The active pass ─────────────────────────────────────────────────── */}
      <Card
        style={{
          borderColor: `${accent}66`,
          background: `${accent}0d`,
          padding: "1.05rem 1.15rem",
        }}
      >
        {/* Pass headline / verdict — plain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: "0.85rem",
          }}
        >
          <Pill color={accent}>Pass {round.n}</Pill>
          <span
            style={{
              fontFamily: T.mono,
              fontSize: 12.5,
              fontWeight: 800,
              letterSpacing: "0.03em",
              color: accent,
            }}
          >
            {isRefused ? "WOULD NOT SHIP" : "SHIPPED"}
          </span>
          <span style={{ color: T.muted, fontSize: "0.9rem" }}>{round.headline}</span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: T.mono,
              fontSize: 11.5,
              color: T.faint,
            }}
          >
            {passCount}/{round.checks.length} rules met
          </span>
        </div>

        {/* The plain checklist */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.4rem" }}>
          {round.checks.map((c, i) => {
            const col = c.ok ? T.green : T.red;
            return (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: "0.55rem 0.7rem",
                  borderRadius: 8,
                  border: `1px solid ${c.ok ? T.border : `${T.red}55`}`,
                  background: c.ok ? "transparent" : `${T.red}0d`,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{ color: col, fontSize: 14, lineHeight: 1.5, flexShrink: 0 }}
                >
                  {c.ok ? "✔" : "✕"}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ color: T.ink, fontSize: "0.92rem", lineHeight: 1.5 }}>
                    {c.rule}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontFamily: T.mono,
                      fontSize: 11.5,
                      color: col,
                      marginTop: 3,
                    }}
                  >
                    {c.ok ? "→ " : "✗ "}
                    {c.detail}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        {/* The plain takeaway for this pass */}
        <div
          style={{
            marginTop: "0.9rem",
            paddingLeft: "0.7rem",
            borderLeft: `2px solid ${accent}`,
            color: isRefused ? T.ink : T.muted,
            fontSize: "0.92rem",
            lineHeight: 1.55,
          }}
        >
          {round.note}
        </div>

        {/* Per-pass signed-record line — the only place a record id shows, small */}
        <div
          style={{
            marginTop: "0.8rem",
            fontFamily: T.mono,
            fontSize: 11,
            color: T.faint,
          }}
        >
          {round.signed}
        </div>
      </Card>

      {/* The "asks for help" note — small, no separate anchor */}
      <div
        style={{
          marginTop: "1.1rem",
          padding: "0.8rem 1rem",
          border: `1px solid ${T.green}44`,
          background: `${T.green}0a`,
          borderRadius: 10,
        }}
      >
        <span
          style={{
            fontFamily: T.mono,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: T.green,
          }}
        >
          {vm.humanCallLabel}
        </span>
        <p style={{ color: T.muted, fontSize: "0.92rem", lineHeight: 1.6, margin: "0.35rem 0 0" }}>
          {vm.humanCallPlain}
        </p>
      </div>
    </section>
  );
}
