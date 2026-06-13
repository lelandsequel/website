"use client";

// LOOPER — the live, type-it-yourself tool. An MD/ED types a real idea, hits
// Run, and watches the engine work on THEIR words. Renders with a pre-run
// `initial` so the page is never blank; a calm loading state while a run is in
// flight; a friendly message if the engine can't read the input; and the five
// plain result sections when it can. ZERO engine vocabulary lives here — every
// visible string comes from `LOOPER` copy or the already-plain `ToolResult`.
// The engine names live ONLY in the opt-in tour. 🐦‍⬛ + 🔑

import { useState, useTransition, type CSSProperties } from "react";

import { Section, Card, FrontierPanel, ReceiptBar, T } from "@/components/omnis/ui";
import { LOOPER } from "@/lib/products/copy";
import { runLooper } from "./actions";
import type { ToolResult } from "./derive";

const TOOL = LOOPER.tool!;
type Example = (typeof TOOL.examples)[number];

const textareaStyle: CSSProperties = {
  background: T.bg,
  border: `1px solid ${T.border}`,
  color: T.ink,
  padding: "0.7rem 0.85rem",
  borderRadius: 10,
  width: "100%",
  fontFamily: T.sans,
  fontSize: "0.98rem",
  lineHeight: 1.55,
  resize: "vertical",
};

const guessInputStyle: CSSProperties = {
  background: T.bg,
  border: `1px solid ${T.border}`,
  color: T.ink,
  padding: "0.55rem 0.7rem",
  borderRadius: 8,
  width: 90,
  fontFamily: T.sans,
  fontSize: "0.92rem",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontFamily: T.mono,
  fontSize: 12,
  letterSpacing: "0.06em",
  color: T.faint,
  marginBottom: "0.5rem",
};

function chipStyle(active: boolean): CSSProperties {
  return {
    fontFamily: T.mono,
    fontSize: 12,
    padding: "4px 11px",
    borderRadius: 999,
    cursor: "pointer",
    color: active ? T.ink : T.muted,
    background: active ? `${T.accent}1f` : "transparent",
    border: `1px solid ${active ? `${T.accent}66` : T.border}`,
  };
}

export default function LooperTool({ initial }: { initial: ToolResult }) {
  const [idea, setIdea] = useState(TOOL.examples[0].idea);
  const [guess, setGuess] = useState(TOOL.examples[0].guess?.toString() ?? "");
  const [result, setResult] = useState<ToolResult>(initial);
  const [pending, start] = useTransition();

  function run() {
    const g = guess.trim() ? Number(guess) : undefined;
    start(async () => setResult(await runLooper(idea, g)));
  }

  function pickExample(ex: Example) {
    setIdea(ex.idea);
    setGuess(ex.guess?.toString() ?? "");
    start(async () => setResult(await runLooper(ex.idea, ex.guess)));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      {/* 1 — Input card */}
      <div data-tour="input" style={{ marginBottom: "2.2rem" }}>
        <Card>
          <label htmlFor="looper-idea" style={labelStyle}>
            {TOOL.inputLabel}
          </label>
          <textarea
            id="looper-idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder={TOOL.placeholder}
            rows={5}
            style={textareaStyle}
          />
          <div
            style={{
              display: "flex",
              gap: "0.9rem",
              alignItems: "flex-end",
              flexWrap: "wrap",
              marginTop: "0.85rem",
            }}
          >
            <div>
              <label htmlFor="looper-guess" style={labelStyle}>
                {TOOL.guessLabel}
              </label>
              <input
                id="looper-guess"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                inputMode="numeric"
                style={guessInputStyle}
              />
            </div>
            <button
              type="button"
              onClick={run}
              disabled={pending}
              style={{
                fontFamily: T.sans,
                fontSize: "0.95rem",
                fontWeight: 700,
                padding: "0.6rem 1.3rem",
                borderRadius: 9,
                border: "none",
                cursor: pending ? "default" : "pointer",
                background: T.accent,
                color: "#0a0c14",
                opacity: pending ? 0.6 : 1,
              }}
            >
              {pending ? "Running…" : TOOL.runLabel}
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: "1.05rem",
            }}
          >
            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.faint, marginRight: "0.2rem" }}>
              {TOOL.examplesLabel}
            </span>
            {TOOL.examples.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => pickExample(ex)}
                style={chipStyle(idea === ex.idea)}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* 2 — Loading state */}
      {pending ? (
        <Card style={{ borderColor: `${T.border}`, color: T.muted }}>
          <span style={{ color: T.faint, fontSize: "0.95rem" }}>Reading your idea…</span>
        </Card>
      ) : !result.ok ? (
        /* 3 — Friendly message (no error vibe) */
        <Card style={{ borderColor: `${T.gold}66` }}>
          <span style={{ color: T.ink, fontSize: "0.98rem", lineHeight: 1.55 }}>{result.message}</span>
        </Card>
      ) : (
        /* 4 — The five result sections */
        <>
          {/* reconciled */}
          <div data-tour="reconciled">
            <Section label={TOOL.sections.reconciled}>
              <p style={{ color: T.muted, fontSize: "0.95rem", margin: "0 0 1rem" }}>
                LOOPER pulled <strong style={{ color: T.ink }}>{result.distinctParts}</strong> moving parts out of
                your words.
              </p>
              {result.reconciled.length === 0 ? (
                <Card style={{ color: T.muted }}>
                  <span style={{ fontSize: "0.92rem" }}>
                    No duplicate names to merge on this one — it read each part as distinct.
                  </span>
                </Card>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                  {result.reconciled.map((r) => (
                    <Card key={r.display}>
                      <div style={{ fontSize: "0.98rem", color: T.ink }}>
                        <strong>{r.display}</strong>
                      </div>
                      <div style={{ color: T.muted, fontSize: "0.9rem", margin: "0.3rem 0 0.4rem" }}>
                        {r.variants.map((v, i) => (
                          <span key={i}>
                            {i > 0 && <span style={{ color: T.faint }}> · </span>}
                            &ldquo;{v}&rdquo;
                          </span>
                        ))}
                      </div>
                      <div style={{ color: T.green, fontSize: "0.88rem" }}>↳ merged into one</div>
                    </Card>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* plan */}
          <div data-tour="plan">
            <Section label={TOOL.sections.plan}>
              <div
                style={{
                  display: "grid",
                  gap: "0.8rem",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                }}
              >
                {result.plan.map((card) => (
                  <Card key={card.key}>
                    <div style={{ fontSize: "0.97rem", color: T.ink, marginBottom: "0.55rem" }}>
                      <strong>{card.title}</strong>
                    </div>
                    {card.items.length === 0 ? (
                      <span style={{ color: T.faint, fontSize: "0.9rem" }}>—</span>
                    ) : (
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: "1.1rem",
                          color: T.muted,
                          fontSize: "0.91rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {card.items.map((it, i) => (
                          <li key={i} style={{ marginBottom: 3 }}>
                            {it}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                ))}
              </div>
            </Section>
          </div>

          {/* size — BIG */}
          <div data-tour="size">
            <Section label={TOOL.sections.size}>
              {result.realWeeks <= 0 ? (
                <Card>
                  <div style={{ fontSize: "1.4rem", color: T.ink, lineHeight: 1.35 }}>
                    {result.guessWeeks != null ? (
                      <>
                        you guessed <strong>{result.guessWeeks}w</strong> — this one&rsquo;s small enough to{" "}
                        <strong style={{ color: T.green }}>ship in under a week</strong>.
                      </>
                    ) : (
                      <>
                        Small enough to <strong style={{ color: T.green }}>ship in under a week</strong>.
                      </>
                    )}
                  </div>
                </Card>
              ) : result.guessWeeks != null ? (
                <Card>
                  <div style={{ fontSize: "1.4rem", color: T.ink, lineHeight: 1.35 }}>
                    you guessed <strong>{result.guessWeeks}w</strong> → real plan{" "}
                    <strong style={{ color: T.green, fontSize: "1.9rem" }}>{result.realWeeks}w</strong>
                  </div>
                  {result.realWeeks < result.guessWeeks && (
                    <div style={{ color: T.muted, fontSize: "0.98rem", marginTop: "0.5rem" }}>
                      that&rsquo;s {result.guessWeeks - result.realWeeks} weeks smaller than the gut-guess.
                    </div>
                  )}
                </Card>
              ) : (
                <Card>
                  <div style={{ fontSize: "1.4rem", color: T.ink, lineHeight: 1.35 }}>
                    Real plan:{" "}
                    <strong style={{ color: T.green, fontSize: "1.9rem" }}>{result.realWeeks} weeks</strong>
                  </div>
                </Card>
              )}
            </Section>
          </div>

          {/* humancall — the frontier */}
          <div data-tour="humancall">
            <Section label={LOOPER.humanCall.label} title={LOOPER.humanCall.plain}>
              <FrontierPanel
                stats={[
                  { n: result.frontier.ambiguous, label: "ambiguous requirement(s)" },
                  { n: result.frontier.looseEnds, label: "loose end(s)" },
                  { n: result.frontier.mergesToConfirm, label: "merge(s) to confirm" },
                ]}
                items={result.frontier.points}
              />
            </Section>
          </div>

          {/* proof — the receipt */}
          <div data-tour="proof">
            <Section label={TOOL.sections.proof}>
              <ReceiptBar
                items={[
                  {
                    label: "checks",
                    value: `${result.checks.ok} ok · ${result.checks.hold} hold · ${result.checks.refuse} stop`,
                    color: T.green,
                  },
                  { label: "signed record", value: result.record, color: T.accent },
                  { label: "", value: "re-runs identically" },
                ]}
              />
              <ul
                style={{
                  margin: "0.9rem 0 0",
                  paddingLeft: "1.1rem",
                  color: T.faint,
                  fontSize: "0.86rem",
                  lineHeight: 1.6,
                }}
              >
                {LOOPER.proof.map((p, i) => (
                  <li key={i} style={{ marginBottom: 3 }}>
                    {p}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </>
      )}
    </div>
  );
}
