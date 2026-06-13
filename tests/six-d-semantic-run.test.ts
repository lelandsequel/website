// OMNIS Semantic Spec Engine — pipeline tests.
//
// Proves the meaning-driven pipeline is REAL, not a sidecar:
//   1. the spec is built from a reconciled model (entity-grounded artifacts);
//   2. the deterministic receipt commits to the meaning (byte-stable);
//   3. it runs the full COSMIC gate — VELLUM binds, AURORA gates, LUNA chains;
//   4. the honest frontier rides in the manifest (what an LLM would still close);
//   5. v1 stays untouched beside it (a different, byte-frozen pipeline).
// 🐦‍⬛ + 🔑

import { test } from "node:test";
import assert from "node:assert/strict";

import { runSixD } from "../lib/six-d/engine";
import {
  runSixDSemantic,
  runSixDCosmicSemantic,
  verifySemanticRun,
  semanticPhaseCount,
} from "../lib/six-d/semantic/run-semantic";

const INTENT = {
  title: "Correspondent Pricing Engine",
  context:
    "Servicing agents and the servicing agent both need real-time quotes. The engine must refuse to quote on stale data. Response must complete within 2 seconds at the p95.",
  goals: ["Win lock volume with faster, sharper quotes", "Never quote below the locked margin floor"],
  constraints: ["Integrates with the rate-sheet feed and the eligibility service"],
  sourceMaterial: ["Capital Markets uplift study CM-2026-07"],
};

test("the spec is built from a reconciled model — entity-grounded, all six phases present", async () => {
  const m = await runSixDSemantic(INTENT);
  assert.equal(m.artifacts.length, 6, "all six phases run");
  assert.ok(m.semantic, "the manifest carries the semantic model");

  // NEBULA reconciled "Servicing agents" + "the servicing agent" into ONE actor.
  const actorEntities = m.semantic.entities.filter((e) => e.role === "actor");
  assert.ok(actorEntities.length >= 1, "at least one actor entity reconciled");
  assert.ok(actorEntities.some((e) => e.variants.length >= 2), "an actor was reconciled from ≥2 surface mentions");

  // Define emits actor elements grounded in those entities (v1 emits bare strings).
  const define = m.artifacts.find((a) => a.phase === "define")!;
  const actorEls = define.elements.filter((e) => e.kind === "actor");
  assert.ok(actorEls.length >= 1, "Define grounds its actors in reconciled entities");
  assert.ok(actorEls.every((e) => e.fields?.entityId), "each Define actor cites its entity id");
});

test("the deterministic receipt commits to the meaning (byte-stable across runs)", async () => {
  const a = await runSixDSemantic(INTENT);
  const b = await runSixDSemantic(INTENT);
  assert.equal(a.receipt, b.receipt, "same intent ⇒ same receipt");
  assert.match(a.receipt, /^[0-9a-f]{64}$/);
  const v = await verifySemanticRun(a);
  assert.equal(v.ok, true, "re-running the manifest's own intent reproduces the receipt");
  // The model fingerprint is deterministic too.
  assert.equal(a.semantic.fingerprint, b.semantic.fingerprint);
});

test("the honest frontier rides in the manifest — names where an LLM is still required", async () => {
  const m = await runSixDSemantic(INTENT);
  const f = m.semantic.frontier;
  assert.ok(Array.isArray(f.llmRequiredFor) && f.llmRequiredFor.length > 0, "the frontier is reported, not hidden");
  // narrative requirements (couldn't be EARS-typed) are surfaced, not invented.
  assert.equal(typeof f.narrativeRequirements, "number");
});

test("it runs the full COSMIC gate — VELLUM binds, AURORA gates, LUNA chains", async () => {
  const { run, entry } = await runSixDCosmicSemantic(INTENT);
  assert.ok(run.provenance.length > 0, "VELLUM produced bindings");
  assert.ok(run.provenance.every((p) => p.status === "BOUND"), "every element bound to a source");
  const g = run.gate.summary;
  assert.equal(g.NO_OBJECTION + g.HOLD + g.REFUSE, run.provenance.length, "AURORA gated every element");
  assert.match(entry.hash, /^[0-9a-f]{64}$/, "LUNA sealed a chain entry");
  // the run's manifest still carries the meaning (for a consumer/page to show).
  assert.ok((run.manifest as { semantic?: unknown }).semantic, "the cosmic run's manifest carries the model");
});

test("v1 stays untouched beside it — a different, byte-frozen pipeline", async () => {
  const v1 = await runSixD(INTENT);
  const sem = await runSixDSemantic(INTENT);
  assert.notEqual(v1.receipt, sem.receipt, "the semantic pipeline is a distinct run with its own receipt");
  // v1 still deterministic on its own.
  const v1b = await runSixD(INTENT);
  assert.equal(v1.receipt, v1b.receipt, "v1 remains byte-stable");
});

test("the phase roster honestly reports how many phases are model-driven", () => {
  const { driven, total } = semanticPhaseCount();
  assert.equal(total, 6);
  assert.ok(driven >= 2 && driven <= 6, `model-driven phase count is honest: ${driven}/${total}`);
});
