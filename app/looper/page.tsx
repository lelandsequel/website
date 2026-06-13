import type { Metadata } from "next";

import { prioritize, INITIATIVES, type Initiative } from "@/lib/agility";
import {
  initiativeToIntent,
  artifactsToInitiativeUpdate,
} from "@/lib/loop/adapter";
import { runSixDCosmicSemantic } from "@/lib/six-d/semantic/run-semantic";
import type { IntentSemanticModel } from "@/lib/six-d/semantic/model";

import { Shell, Hero, Footer } from "@/components/omnis/ui";
import { ProductNav } from "@/components/products/ProductNav";
import GuidedTour from "@/components/tour/GuidedTour";
import { LOOPER } from "@/lib/products/copy";

import LooperApp, {
  type LooperVM,
  type PlanCardVM,
  type FrontierVM,
  type ReprioVM,
} from "./LooperApp";

// ── plain-language metadata ────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: `${LOOPER.name} — ${LOOPER.oneLiner}`,
  description: LOOPER.sub,
};

// The loop runs against a real team budget. Same number the /loop demo uses, so
// the lineup and the re-decide are honest.
const CAPACITY = 12;
// The headline pick that carries the "you guessed huge, it's actually small"
// payoff — a large rough estimate the plan decomposes far smaller, freeing room.
const HEADLINE_TARGET = "HL-002";

const shortHash = (h: string): string =>
  h.length > 16 ? `${h.slice(0, 8)}…${h.slice(-6)}` : h;

// ─────────────────────────────────────────────────────────────────────────────
// Plain plan cards. The spec produced typed requirements + reconciled entities;
// we turn those into the four cards a non-technical buyer reads — WITHOUT any
// engine/phase/grammar vocabulary on the surface. (All derivation is here on the
// server; the client only renders.)
// ─────────────────────────────────────────────────────────────────────────────
function buildPlanCards(m: IntentSemanticModel): PlanCardVM[] {
  // "what it must do" — the affirmative obligations, plain text, capped for scan.
  const mustDo = m.requirements
    .filter((r) => r.typing.polarity !== "exclude")
    .map((r) => r.text)
    .slice(0, 4);

  // "what it connects to" — the reconciled entities, by their presentable label.
  const connectsTo = m.entities.map((e) => e.display).slice(0, 6);

  // "the one rule it can't break" — an exclusion/negative obligation if one
  // exists, else the strongest mandatory requirement. We surface ONE, plainly.
  const ruleClause =
    m.requirements.find((r) => r.typing.polarity === "exclude") ??
    m.requirements.find((r) => r.typing.modality === "mandatory");
  const cantBreak = ruleClause ? ruleClause.text : "";

  // "how we'll know it's done" — every must-do clause is a checkable line.
  const doneWhen = m.requirements
    .filter((r) => r.typing.modality === "mandatory" || r.typing.ears !== "narrative")
    .map((r) => r.text)
    .slice(0, 4);

  return [
    { key: "must", title: "What it has to do", items: mustDo },
    { key: "connects", title: "What it connects to", items: connectsTo },
    {
      key: "rule",
      title: "The one rule it can't break",
      items: cantBreak ? [cantBreak] : [],
    },
    { key: "done", title: "How we'll know it's done", items: doneWhen },
  ];
}

// The frontier, in plain counts — the honest "where a person is still needed".
function buildFrontier(m: IntentSemanticModel): FrontierVM {
  return {
    ambiguous: m.frontier.narrativeRequirements,
    looseEnds: m.frontier.unresolvedTokens.length,
    mergesToConfirm: m.frontier.reviewQueue.length,
    points: m.frontier.llmRequiredFor,
  };
}

// ── the closed-loop re-decide (before/after) for the headline pick ─────────────
async function buildReprio(target: Initiative): Promise<ReprioVM> {
  const pass1 = prioritize(INITIATIVES, { capacity: CAPACITY });

  const { run, entry } = await runSixDCosmicSemantic(initiativeToIntent(target));
  const upd = artifactsToInitiativeUpdate(run, target, entry.hash);

  const updated: Initiative[] = INITIATIVES.map((i) =>
    i.id === target.id
      ? { ...i, effortTeamWeeks: upd.reEstimatedEffortTeamWeeks }
      : i,
  );
  const pass2 = prioritize(updated, { capacity: CAPACITY });

  const before = new Set(pass1.funded.map((f) => f.id));
  const newlyFunded = pass2.funded
    .map((f) => f.id)
    .filter((id) => !before.has(id));

  return {
    weeksBefore: pass1.capacityUsed,
    weeksAfter: pass2.capacityUsed,
    capacity: CAPACITY,
    before: pass1.funded.map((f) => ({
      id: f.id,
      title: f.title,
      weeks: f.effortTeamWeeks,
      newlyFunded: false,
      isTarget: f.id === target.id,
    })),
    after: pass2.funded.map((f) => ({
      id: f.id,
      title: f.title,
      weeks: f.effortTeamWeeks,
      newlyFunded: newlyFunded.includes(f.id),
      isTarget: f.id === target.id,
    })),
    newlyFunded,
  };
}

export default async function LooperPage() {
  // ── decide — what fits this round (deterministic, server-side) ───────────────
  const portfolio = prioritize(INITIATIVES, { capacity: CAPACITY });

  // ── plan every funded pick: run the spec, read its meaning + size + frontier ──
  const picks: LooperVM[] = [];
  for (const init of portfolio.funded) {
    const intent = initiativeToIntent(init);
    const { run, entry } = await runSixDCosmicSemantic(intent);
    const update = artifactsToInitiativeUpdate(run, init, entry.hash);

    // The reconciled meaning lives inside the run's manifest. Cast via `unknown`
    // (the base manifest type doesn't declare `.semantic`).
    const m = (run.manifest as unknown as { semantic: IntentSemanticModel })
      .semantic;

    const isHeadline = init.id === HEADLINE_TARGET;

    picks.push({
      id: init.id,
      title: init.title,
      // "what it's worth" — the plain value lever + who it reaches.
      worth: init.valueType,
      reach: `${init.reach.value.toLocaleString()} ${init.reach.unit}`,
      mandate: Boolean(init.mandate),
      roughWeeks: init.effortTeamWeeks,
      realWeeks: update.reEstimatedEffortTeamWeeks,
      sizeDropped: update.reEstimatedEffortTeamWeeks < init.effortTeamWeeks,
      plan: buildPlanCards(m),
      frontier: buildFrontier(m),
      // a single plain "signed record" line — the only place a hash appears.
      record: shortHash(entry.hash),
      // the on-the-spot re-decide attaches only to the headline pick.
      reprio: isHeadline ? await buildReprio(init) : null,
    });
  }

  // Order so the headline payoff pick is first (selected on load).
  picks.sort((a, b) =>
    a.reprio ? -1 : b.reprio ? 1 : a.id.localeCompare(b.id),
  );

  return (
    <Shell>
      <ProductNav current="/looper" />

      <Hero kicker={LOOPER.kicker} title={LOOPER.tagline} chip="SYNTHETIC DATA">
        {LOOPER.sub}
      </Hero>

      <LooperApp picks={picks} />

      <Footer>
        Decide what to build, write the plan for the top pick, and see the real
        size — then decide again. Nothing here is guessed: the same inputs give
        the same answer every time, and every line traces back to something you
        asked for. 🐦‍⬛ + 🔑
      </Footer>

      <GuidedTour
        steps={LOOPER.tour}
        storageKey={LOOPER.storageKey}
        launchLabel="How it works"
      />
    </Shell>
  );
}
