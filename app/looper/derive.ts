// LOOPER — turn a sealed semantic run into the plain, serializable result the
// live tool renders. ALL derivation lives here; the client only displays.
//
// No engine vocabulary ever crosses into a returned string — named, not faked:
// the numbers are the engine's, the words are for humans. Reused by both the
// server action (live runs) and the page (the pre-run example). 🐦‍⬛ + 🔑

import type { CosmicRun } from "@/lib/six-d/cosmic";
import type { IntentSemanticModel } from "@/lib/six-d/semantic/model";
import { reEstimateTeamWeeks } from "@/lib/loop/adapter";

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

/** An entity the engine merged from two or more surface forms. */
export interface ReconciledVM {
  display: string;
  variants: string[];
}

/** The whole live-run result, fully serializable for the client. */
export type ToolResult =
  | { ok: false; message: string }
  | {
      ok: true;
      title: string;
      distinctParts: number;
      reconciled: ReconciledVM[];
      plan: PlanCardVM[];
      realWeeks: number;
      guessWeeks: number | null;
      frontier: FrontierVM;
      record: string;
      checks: { ok: number; hold: number; refuse: number };
    };

export function shortHash(h: string): string {
  return h.length > 16 ? `${h.slice(0, 8)}…${h.slice(-6)}` : h;
}

// The four plain plan cards — derived from typed requirements + reconciled
// entities, WITHOUT any engine/phase/grammar vocabulary on the surface.
export function buildPlanCards(m: IntentSemanticModel): PlanCardVM[] {
  const mustDo = m.requirements
    .filter((r) => r.typing.polarity !== "exclude")
    .map((r) => r.text)
    .slice(0, 4);

  const connectsTo = m.entities.map((e) => e.display).slice(0, 6);

  const ruleClause =
    m.requirements.find((r) => r.typing.polarity === "exclude") ??
    m.requirements.find((r) => r.typing.modality === "mandatory");
  const cantBreak = ruleClause ? ruleClause.text : "";

  const doneWhen = m.requirements
    .filter((r) => r.typing.modality === "mandatory" || r.typing.ears !== "narrative")
    .map((r) => r.text)
    .slice(0, 4);

  return [
    { key: "must", title: "What it has to do", items: mustDo },
    { key: "connects", title: "What it connects to", items: connectsTo },
    { key: "rule", title: "The one rule it can't break", items: cantBreak ? [cantBreak] : [] },
    { key: "done", title: "How we'll know it's done", items: doneWhen },
  ];
}

// The frontier, in plain counts. We restate the engine's REAL counts in plain
// English; we never pass its raw grammar vocabulary to the surface.
export function buildFrontier(m: IntentSemanticModel): FrontierVM {
  const ambiguous = m.frontier.narrativeRequirements;
  const looseEnds = m.frontier.unresolvedTokens.length;
  const mergesToConfirm = m.frontier.reviewQueue.length;

  const points: string[] = [];
  if (ambiguous > 0)
    points.push(
      `${ambiguous} requirement${ambiguous === 1 ? " is" : "s are"} written as free-form prose — a person should confirm how to read ${ambiguous === 1 ? "it" : "them"} before we build.`,
    );
  if (looseEnds > 0)
    points.push(
      `${looseEnds} loose end${looseEnds === 1 ? "" : "s"} the system couldn't pin down on its own — worth a quick human look.`,
    );
  if (mergesToConfirm > 0)
    points.push(
      `${mergesToConfirm} possible duplicate${mergesToConfirm === 1 ? "" : "s"} to confirm before we treat them as one thing.`,
    );
  if (points.length === 0)
    points.push("Nothing ambiguous on this one — the system could read all of it cleanly.");

  return { ambiguous, looseEnds, mergesToConfirm, points };
}

/**
 * Turn a sealed run into the plain result the tool renders. Pure + serializable.
 * `title` is the short label derived from the idea; `guessWeeks` is the user's
 * optional gut-estimate (null when not given).
 */
export function deriveToolResult(
  run: CosmicRun,
  entryHash: string,
  title: string,
  guessWeeks?: number,
): ToolResult {
  const m = (run.manifest as unknown as { semantic: IntentSemanticModel }).semantic;

  const reconciled: ReconciledVM[] = m.entities
    .filter((e) => e.variants.length >= 2)
    .map((e) => ({ display: e.display, variants: e.variants }));

  return {
    ok: true,
    title,
    distinctParts: m.entities.length,
    reconciled,
    plan: buildPlanCards(m),
    realWeeks: reEstimateTeamWeeks(run),
    guessWeeks: typeof guessWeeks === "number" ? guessWeeks : null,
    frontier: buildFrontier(m),
    record: shortHash(entryHash),
    checks: {
      ok: run.gate.summary.NO_OBJECTION,
      hold: run.gate.summary.HOLD,
      refuse: run.gate.summary.REFUSE,
    },
  };
}
