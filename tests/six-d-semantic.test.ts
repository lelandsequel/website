// 6D Semantic Layer (Tier 2) — the intent semantic model, proven:
//   1. Reconciliation — three "agent" mentions collapse to ONE canonical entity.
//   2. Determinism — same intent → byte-identical model across runs.
//   3. Before/after — the semantic layer captures what the keyword path misses.
//   4. Provenance — every canonical entity carries WAKE (source refs + audit hash).
//   5. Honest frontier — the residual gap is a populated, inspectable field.
//
// Style mirrors tests/six-d-engine.test.ts. Run: tsx --test tests/six-d-semantic.test.ts

import { test } from "node:test";
import assert from "node:assert/strict";

import { buildIntentIndex, normalizeIntent, type RawIntent } from "../lib/six-d/engine";
import { EXAMPLE_INTENT } from "../lib/six-d/example";
import { actorsIn } from "../lib/six-d/helpers";
import type { IntentRef, PhaseArtifact, PhaseCtx } from "../lib/six-d/types";
import {
  actorsFrom,
  buildSemanticModel,
  definePhaseSemantic,
  designPhaseSemantic,
  systemsFrom,
  type IntentSemanticModel,
} from "../lib/six-d/semantic";

const model = (raw: RawIntent): IntentSemanticModel => {
  const intent = normalizeIntent(raw);
  return buildSemanticModel(intent, buildIntentIndex(intent));
};

const ctxFor = (raw: RawIntent): { ctx: PhaseCtx; m: IntentSemanticModel } => {
  const intent = normalizeIntent(raw);
  const index: IntentRef[] = buildIntentIndex(intent);
  const byId = new Map();
  for (const a of index) byId.set(a.id, a);
  const upstream: PhaseArtifact[] = [];
  return { ctx: { intent, index, byId, upstream }, m: buildSemanticModel(intent, index) };
};

// An intent that names the SAME actor three different ways across atoms.
const THREE_AGENTS: RawIntent = {
  title: "Servicing agents need a faster console",
  context: "The agent triggers actions from one screen. Servicing agents do this all day.",
  goals: ["Preserve agent speed on low-risk work"],
  constraints: ["Must use the enterprise identity provider"],
  sourceMaterial: [],
};

test("reconciliation: 'the agent' / 'servicing agents' / 'agents' collapse to ONE canonical entity", () => {
  const m = model(THREE_AGENTS);
  const actors = actorsFrom(m);

  // Exactly one canonical actor entity, despite ≥3 distinct surface mentions.
  assert.equal(actors.length, 1, `expected 1 canonical actor, got ${actors.length}: ${actors.map((a) => a.display).join(", ")}`);
  const agent = actors[0];
  assert.equal(agent.key, "agent");
  assert.equal(agent.id, "ent_actor_agent");

  // It absorbed multiple distinct surface variants…
  assert.ok(agent.variants.length >= 2, `expected ≥2 variants, got: ${JSON.stringify(agent.variants)}`);
  assert.ok(
    agent.variants.some((v) => /servicing/i.test(v)),
    `expected a 'servicing agent(s)' variant, got: ${JSON.stringify(agent.variants)}`,
  );

  // …and it carries provenance back to MULTIPLE intent atoms (title/context/goal).
  assert.ok(agent.sourceRefs.length >= 2, `expected ≥2 sourceRefs, got: ${JSON.stringify(agent.sourceRefs)}`);
  assert.ok(agent.wake.auditHash.length > 0, "WAKE produced no audit hash");
  assert.ok(agent.wake.transforms.includes("coalesce"), "WAKE did not record the coalesce transform");
});

test("before/after: the keyword path cannot tell three mentions are one entity; the semantic path can", () => {
  // KEYWORD (v1): actorsIn returns the singular term once, but with NO notion of
  // an entity, NO variants captured, NO provenance, NO id.
  const intentText = [THREE_AGENTS.title, THREE_AGENTS.context, ...THREE_AGENTS.goals, ...THREE_AGENTS.constraints].join(" ");
  const kw = actorsIn(intentText);
  assert.deepEqual(kw, ["agent"]); // a bare string; that's all v1 has

  // SEMANTIC (Tier 2): a structured entity carrying everything the string lost.
  const agent = actorsFrom(model(THREE_AGENTS))[0];
  assert.equal(typeof kw[0], "string");
  assert.equal(typeof agent, "object");
  assert.ok(agent.variants.length > kw.length, "semantic layer captured no extra surface variants over the keyword string");
  assert.ok(agent.sourceRefs.length >= 1 && "id" in agent && "wake" in agent, "semantic entity is missing id/provenance the keyword path never had");
});

test("before/after: a mandated SYSTEM is reconciled as an entity, where the keyword path has no system concept at all", () => {
  const m = model(EXAMPLE_INTENT);
  const systems = systemsFrom(m);
  // The example names "the enterprise identity provider" + an "audit trail".
  assert.ok(systems.length >= 1, `expected ≥1 system entity, got ${systems.length}`);
  const idp = systems.find((s) => /provider/i.test(s.display) || s.key.includes("provider"));
  assert.ok(idp, `expected an identity-provider system entity, got: ${systems.map((s) => s.display).join(", ")}`);

  // The keyword helpers have NO API that returns systems as entities — only
  // substring buckets. This asserts the capability is net-new, not a reshuffle.
  // (bucketsFor would only tag the text "auth"; it can't name the provider.)
  assert.ok(idp.id.startsWith("ent_system_"), "system entity lacks a stable namespaced id");
  assert.ok(idp.sourceRefs.length >= 1, "system entity lacks provenance");
});

test("requirement typing: constraints get EARS/modality/budget typing the keyword path never produced", () => {
  const m = model(EXAMPLE_INTENT);
  // "Must use the enterprise identity provider for step-up" → mandatory + mechanism.
  const mech = m.requirements.find((r) => r.typing.canonical.mechanism !== undefined);
  assert.ok(mech, "no requirement captured a mandated mechanism");
  assert.equal(mech!.typing.modality, "mandatory");

  // "Added latency budget: under 2s" → a measurable budget typed as {value,unit}.
  const budgeted = m.requirements.find((r) => r.typing.canonical.budget !== undefined);
  assert.ok(budgeted, "no requirement captured a numeric budget");
  const b = budgeted!.typing.canonical.budget as { value: number; unit: string };
  assert.equal(b.value, 2);
  assert.equal(b.unit, "s");

  // "No change to existing role permissions" → an exclusion (polarity).
  const excl = m.requirements.find((r) => r.typing.polarity === "exclude");
  assert.ok(excl, "no requirement was typed as an exclusion");
});

test("determinism: same intent → byte-identical semantic model and fingerprint across runs", () => {
  const a = model(EXAMPLE_INTENT);
  const b = model(EXAMPLE_INTENT);
  assert.deepStrictEqual(a, b);
  assert.equal(a.fingerprint, b.fingerprint);
  assert.match(a.fingerprint, /^[0-9a-f]{8}$/);
});

test("sensitivity: a one-word change to the intent changes the fingerprint", () => {
  const a = model(EXAMPLE_INTENT);
  const mutated: RawIntent = {
    ...EXAMPLE_INTENT,
    goals: [...EXAMPLE_INTENT.goals.slice(0, -1), "Capture a partial audit trail"],
  };
  const c = model(mutated);
  assert.notEqual(a.fingerprint, c.fingerprint);
});

test("provenance integrity: every canonical entity's sourceRefs resolve to real intent atoms", () => {
  const intent = normalizeIntent(EXAMPLE_INTENT);
  const index = buildIntentIndex(intent);
  const ids = new Set(index.map((a) => a.id));
  const m = buildSemanticModel(intent, index);
  for (const e of m.entities) {
    assert.ok(e.sourceRefs.length > 0, `entity ${e.id} has no provenance`);
    for (const ref of e.sourceRefs) {
      assert.ok(ids.has(ref), `entity ${e.id} references a non-existent atom: ${ref}`);
    }
  }
});

test("honest frontier: the model reports its own residual gap as a populated, inspectable field", () => {
  // A messy intent that names an out-of-lexicon actor ("the underwriter") and a
  // free-narrative obligation that matches no EARS template.
  const MESSY: RawIntent = {
    title: "Loan adjudication tweaks",
    context: "Sometimes the underwriter and the funder disagree about a file and it gets stuck for days.",
    goals: ["Make the back-and-forth less painful for everyone involved"],
    constraints: ["Keep it reasonable"],
    sourceMaterial: [],
  };
  const m = model(MESSY);
  const f = m.frontier;

  // The frontier is not empty hand-waving — it carries concrete, countable signal.
  assert.ok(Array.isArray(f.llmRequiredFor) && f.llmRequiredFor.length > 0, "frontier names nothing as LLM-required");
  // "underwriter"/"funder" are agentive nouns outside the lexicon → flagged, NOT
  // silently invented as entities.
  assert.ok(
    f.unclassifiedHints.some((h) => /underwriter|funder/i.test(h.token)),
    `expected an out-of-lexicon agentive hint, got: ${JSON.stringify(f.unclassifiedHints.map((h) => h.token))}`,
  );
  // The vague goal ("less painful…") matches no controlled grammar → narrative.
  assert.ok(f.narrativeRequirements >= 1, "expected ≥1 narrative (un-typeable) requirement");

  // CRUCIAL honesty check: the parser did NOT fabricate canonical entities for the
  // unknown nouns — they live in the frontier, not in entities.
  const actorKeys = m.entities.filter((e) => e.role === "actor").map((e) => e.key);
  assert.ok(!actorKeys.includes("underwriter"), "parser invented an entity it could not actually classify");
});

test("refuse-to-guess: an ambiguous partial-overlap merge is routed to review, not forced", () => {
  // Two systems whose phrases share a token but NOT a head noun: "access log" vs
  // "audit trail" would not merge (different heads). To exercise the review path,
  // use two phrases that union transitively without a shared head:
  //   "payment service" and "service gateway" share token "service" but heads
  //   differ (service vs gateway) → shared-token signal → review.
  const AMBIG: RawIntent = {
    title: "Wire the payment service to the service gateway",
    context: "The payment service calls out; the service gateway brokers it.",
    goals: ["Connect them"],
    constraints: [],
    sourceMaterial: [],
  };
  const m = model(AMBIG);
  // Either they were kept separate (2 entities) or flagged for review — never
  // silently fused into one wrong entity.
  const sys = systemsFrom(m);
  const fused = sys.find((s) => s.variants.length >= 2 && s.wake.signal === "shared-token");
  assert.ok(!fused, "sieve force-merged a shared-token-only cluster (should refuse)");
});

test("phase consumption (Define): stories cite the canonical actor entity, not a bare string", () => {
  const { ctx, m } = ctxFor(EXAMPLE_INTENT);
  const art = definePhaseSemantic(ctx, m);

  // The actor roster carries reconciled entities with ids + variants.
  const actorEls = art.elements.filter((e) => e.kind === "actor");
  assert.ok(actorEls.length >= 1, "Define produced no actor elements");
  assert.ok(actorEls.every((e) => typeof e.fields?.entityId === "string"), "an actor element lacks its entity id");

  // Each story binds to the canonical actor entity (downstream-shareable identity).
  const stories = art.elements.filter((e) => e.kind === "story");
  assert.ok(stories.length >= 1, "Define produced no stories");
  assert.ok(stories.every((s) => typeof s.fields?.actorEntity === "string"), "a story lacks its actorEntity binding");

  // Budgeted requirement → measurable AC carrying the typed budget.
  const acs = art.elements.filter((e) => e.kind === "acceptance_criterion");
  assert.ok(acs.some((a) => a.fields?.budget === "2s"), "the 2s budget did not become a typed acceptance criterion");

  // Narrative (un-typeable) requirements surface as honest open questions.
  assert.ok(
    art.openQuestions.some((q) => /EARS|controlled-grammar/i.test(q.question)),
    "narrative requirements were not surfaced as open questions",
  );
});

test("phase consumption (Design): each reconciled SYSTEM becomes a dependency ADR — net-new vs v1", () => {
  const { ctx, m } = ctxFor(EXAMPLE_INTENT);
  const art = designPhaseSemantic(ctx, m);

  const adrs = art.elements.filter((e) => e.kind === "adr");
  assert.ok(adrs.length >= 1, "Design produced no dependency ADRs from systems");
  // The identity provider must appear as a named dependency with its entity id.
  assert.ok(
    adrs.some((a) => /provider/i.test(a.title ?? "") && typeof a.fields?.entityId === "string"),
    `expected an identity-provider dependency ADR, got: ${adrs.map((a) => a.title).join(", ")}`,
  );
  // Direction line names the systems (v1 had no system concept at all).
  const dir = art.elements.find((e) => e.kind === "design_direction");
  assert.ok(dir && /Integrates with/i.test(dir.body), "design direction did not name integrated systems");
});

test("phase consumers are deterministic too: same intent → identical artifacts", () => {
  const a = ctxFor(EXAMPLE_INTENT);
  const b = ctxFor(EXAMPLE_INTENT);
  assert.deepStrictEqual(definePhaseSemantic(a.ctx, a.m), definePhaseSemantic(b.ctx, b.m));
  assert.deepStrictEqual(designPhaseSemantic(a.ctx, a.m), designPhaseSemantic(b.ctx, b.m));
});
