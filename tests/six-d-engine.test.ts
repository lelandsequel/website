// 6D Workbench engine — the four non-negotiables, proven:
//   1. Determinism — same intent, same bytes, same receipt.
//   2. Refusal — thin input yields open questions, never invented facts.
//   3. Traceability — every element resolves back to the intent.
//   4. CADMUS lineage — the dev prompts carry the engine's grounding discipline.

import { test } from "node:test";
import assert from "node:assert/strict";

import { lineage, runSixD, validateTrace, verifyRun, type RawIntent } from "../lib/six-d/engine";
import { EXAMPLE_INTENT } from "../lib/six-d/example";
import { stableStringify } from "../lib/six-d/helpers";
import { bundleMarkdown } from "../lib/six-d/markdown";

const THIN_INTENT: RawIntent = {
  title: "Make the dashboard better",
  context: "It feels slow sometimes.",
  goals: ["Improve it"],
  constraints: [],
  sourceMaterial: [],
};

test("determinism: same intent → identical manifest and receipt", async () => {
  const a = await runSixD(EXAMPLE_INTENT);
  const b = await runSixD(EXAMPLE_INTENT);
  assert.deepStrictEqual(a, b);
  assert.equal(a.receipt, b.receipt);
  assert.match(a.receipt, /^[0-9a-f]{64}$/);
});

test("sensitivity: a one-word change to the intent changes the receipt", async () => {
  const a = await runSixD(EXAMPLE_INTENT);
  const mutated: RawIntent = {
    ...EXAMPLE_INTENT,
    goals: [...EXAMPLE_INTENT.goals.slice(0, -1), "Capture a partial audit trail"],
  };
  const c = await runSixD(mutated);
  assert.notEqual(a.receipt, c.receipt);
});

test("verifyRun: recomputes the same hash from the manifest's own intent", async () => {
  const a = await runSixD(EXAMPLE_INTENT);
  const v = await verifyRun(a);
  assert.equal(v.ok, true);
  assert.equal(v.recomputed, a.receipt);
});

test("canonicalization: key order cannot move the hash", () => {
  assert.equal(stableStringify({ b: 1, a: 2 }), '{"a":2,"b":1}');
  assert.equal(stableStringify({ a: 2, b: 1 }), stableStringify({ b: 1, a: 2 }));
  assert.equal(stableStringify([{ z: 0, a: [1, 2] }]), '[{"a":[1,2],"z":0}]');
});

test("structure: six phases in order, each with elements", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  assert.equal(m.artifacts.length, 6);
  assert.deepStrictEqual(
    m.artifacts.map((a) => a.phase),
    ["define", "design", "distribute", "develop", "detect", "deliver"],
  );
  for (const art of m.artifacts) {
    assert.ok(art.elements.length > 0, `${art.phase} produced no elements`);
  }
});

test("traceability: every element has resolvable sourceRefs; lineage reaches the intent", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const v = validateTrace(m);
  assert.equal(v.ok, true, JSON.stringify(v.problems, null, 2));

  // Walk a deep element (a test scenario) all the way back to an intent atom.
  const detect = m.artifacts.find((a) => a.phase === "detect")!;
  const scenario = detect.elements.find((e) => e.kind === "test_scenario")!;
  const chain = lineage(m, scenario.id);
  assert.ok(
    chain.some((id) => id.startsWith("intent.")),
    `lineage of ${scenario.id} never reached the intent: ${chain.join(" ← ")}`,
  );
});

test("refusal: a thin intent yields open questions, not invented specifics", async () => {
  const m = await runSixD(THIN_INTENT);
  const oqs = m.artifacts.flatMap((a) => a.openQuestions);
  assert.ok(oqs.length >= 3, `expected ≥3 open questions, got ${oqs.length}`);

  // The vague goal gets a metric with TBD + a matching question — no number.
  const define = m.artifacts.find((a) => a.phase === "define")!;
  const metric = define.elements.find((e) => e.kind === "success_metric")!;
  assert.match(metric.body, /TBD/);
  assert.ok(!/\d/.test(metric.body), `metric invented a number: ${metric.body}`);
  assert.ok(
    define.openQuestions.some((q) => /no numeric target/i.test(q.question)),
    "missing the no-numeric-target open question",
  );
  // No exclusions stated → asked for, not invented.
  assert.ok(
    define.openQuestions.some((q) => /out-of-scope/i.test(q.question)),
    "missing the out-of-scope open question",
  );
});

test("honest blocking gap: audit-write failure policy is asked, not assumed", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const develop = m.artifacts.find((a) => a.phase === "develop")!;
  const blocking = develop.openQuestions.filter((q) => q.blocking);
  assert.ok(
    blocking.some((q) => /proceed or block/i.test(q.question)),
    "expected the blocking audit-write open question",
  );
});

test("CADMUS lineage: every dev prompt carries the grounding discipline verbatim", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const develop = m.artifacts.find((a) => a.phase === "develop")!;
  const prompts = develop.elements.filter((e) => e.kind === "dev_prompt");
  assert.ok(prompts.length >= 3, `expected a dev prompt per story, got ${prompts.length}`);
  for (const p of prompts) {
    assert.match(p.body, /Do not invent facts, sources, names, numbers, or citations\./);
    assert.match(p.body, /Ground every claim/);
  }
});

test("coverage: every acceptance criterion has at least one test scenario", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const detect = m.artifacts.find((a) => a.phase === "detect")!;
  const coverage = detect.elements.find((e) => e.kind === "coverage_map")!;
  assert.ok(!/UNCOVERED/.test(coverage.body), `uncovered AC:\n${coverage.body}`);
  assert.ok(!detect.openQuestions.some((q) => q.blocking), "detect raised a blocking coverage gap");
});

test("export: the bundle carries the receipt and the honest framing", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const md = bundleMarkdown(m);
  assert.ok(md.includes(m.receipt));
  assert.match(md, /reviewed by its accountable owner/);
  assert.match(md, /refuses to invent/);
});
