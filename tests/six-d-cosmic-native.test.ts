// 6D Workbench — COSMIC-native composition seam (Tiers 1 + 2 + 3 together).
//
// Proves the consolidated engine composes all three tiers over ONE intent into a
// coherent, deterministic view — and, crucially, that composing them does NOT
// perturb v1's byte-frozen manifest/receipt or Tier 1's run hash. That non-
// perturbation is the whole reason the merge is "composable, documented fusion
// seam" rather than a v1 rewrite: the semantic model (Tier 2) and the audit
// (Tier 3) ride ALONGSIDE the pipeline, derived from the same manifest.
//
// Mirrors the other suites' conventions: node:test, EXAMPLE_INTENT, an injected
// VantageRunner so nothing external runs. 🐦‍⬛ + 🔑

import { test } from "node:test";
import assert from "node:assert/strict";

import { runSixD } from "../lib/six-d/engine";
import { EXAMPLE_INTENT } from "../lib/six-d/example";
import { runSixDCosmic } from "../lib/six-d/cosmic";
import { buildSemanticModel } from "../lib/six-d/semantic";
import { runSixDCosmicNative } from "../lib/six-d/cosmic-native";
import type { VantageRunner } from "../lib/six-d/cosmic-audit";

// A spy runner that records whether VANTAGE was invoked. On EXAMPLE_INTENT the
// artifacts are skeletal, so Tier 3 must NOT call it (honest NOT_WORTHWHILE).
function spyRunner(): { runner: VantageRunner; called: () => boolean } {
  let was = false;
  const runner: VantageRunner = async () => {
    was = true;
    return { pulsar: { adversarialFindings: [] }, aurora: { score: 1, verdict: "APPROVED", topIssues: [] } };
  };
  return { runner, called: () => was };
}

test("composition: one call returns all three tiers, coherently bound to one run", async () => {
  const { runner, called } = spyRunner();
  const { run, ledger } = await runSixDCosmicNative(EXAMPLE_INTENT, { vantageRunner: runner });

  // Tier 2 — semantic model is present and is OF this intent.
  assert.equal(run.semantic.schema, "6d.semantic.v1");
  assert.equal(run.semantic.intentId, run.cosmic.manifest.intent.id);
  assert.ok(run.semantic.entities.length > 0, "semantic layer should reconcile entities");

  // Tier 1 — the pipeline run + its sealed ledger entry, parity preserved.
  assert.equal(run.cosmic.schema, "6d.cosmic.run.v1");
  assert.equal(run.entry.payloadHash, run.cosmic.runHash, "ledger entry seals the run hash");
  assert.equal(ledger.length, 1, "the run was chained exactly once");

  // Tier 3 — audit is bound to the SAME run and honestly refuses on skeletal code.
  assert.equal(run.audit.runReceipt, run.cosmic.manifest.receipt, "audit bound to the run it audited");
  assert.equal(run.audit.verdict, "NOT_WORTHWHILE");
  assert.equal(called(), false, "VANTAGE must not run on skeletal artifacts");
});

test("non-perturbation: composing the tiers leaves v1 + Tier 1 byte-identical", async () => {
  // Tier 1 alone.
  const soloLedger = (await import("../lib/six-d/cosmic")).Ledger;
  const ledgerA = new soloLedger();
  const { run: cosmicSolo } = await runSixDCosmic(EXAMPLE_INTENT, { ledger: ledgerA });

  // v1 alone.
  const v1Solo = await runSixD(EXAMPLE_INTENT);

  // The composed path.
  const { runner } = spyRunner();
  const { run: native } = await runSixDCosmicNative(EXAMPLE_INTENT, { vantageRunner: runner });

  // v1's manifest/receipt is identical whether run alone or through the seam.
  assert.equal(native.cosmic.manifest.receipt, v1Solo.receipt, "v1 receipt unchanged by composition");
  assert.deepStrictEqual(native.cosmic.manifest, v1Solo, "v1 manifest byte-identical through the seam");

  // Tier 1's run hash is identical whether run alone or through the seam.
  assert.equal(native.cosmic.runHash, cosmicSolo.runHash, "Tier 1 run hash unchanged by composition");
});

test("determinism: same intent ⇒ identical composed view across runs", async () => {
  const { runner: r1 } = spyRunner();
  const { runner: r2 } = spyRunner();
  const a = (await runSixDCosmicNative(EXAMPLE_INTENT, { vantageRunner: r1 })).run;
  const b = (await runSixDCosmicNative(EXAMPLE_INTENT, { vantageRunner: r2 })).run;

  // Each tier reproduces exactly.
  assert.equal(a.semantic.fingerprint, b.semantic.fingerprint, "Tier 2 fingerprint reproduces");
  assert.equal(a.cosmic.runHash, b.cosmic.runHash, "Tier 1 run hash reproduces");
  assert.equal(a.entry.payloadHash, b.entry.payloadHash, "ledger seal reproduces");
  assert.deepStrictEqual(a.audit, b.audit, "Tier 3 audit reproduces");
});

test("seam re-derives meaning from the run's own manifest (no drift vs a direct build)", async () => {
  const { runner } = spyRunner();
  const { run } = await runSixDCosmicNative(EXAMPLE_INTENT, { vantageRunner: runner });

  // Building the semantic model directly from the manifest must match what the
  // seam produced — proving the seam threads the SAME intent+index, not a re-parse.
  const direct = buildSemanticModel(run.cosmic.manifest.intent, run.cosmic.manifest.intentIndex);
  assert.equal(run.semantic.fingerprint, direct.fingerprint, "seam semantic model == direct build");
  assert.deepStrictEqual(run.semantic, direct);
});

test("chaining: the seam keeps the LUNA ledger growing across intents, verify() holds", async () => {
  const { runner: r1 } = spyRunner();
  const { runner: r2 } = spyRunner();

  const first = await runSixDCosmicNative(EXAMPLE_INTENT, { vantageRunner: r1 });
  assert.equal(first.ledger.length, 1);

  // A second, different intent chained onto the same ledger.
  const second = await runSixDCosmicNative(
    { ...EXAMPLE_INTENT, title: EXAMPLE_INTENT.title + " (v2)" },
    { ledger: first.ledger, vantageRunner: r2 },
  );
  assert.equal(second.ledger.length, 2, "second run chained onto the first");

  const v = await second.ledger.verify();
  assert.equal(v.ok, true, "the chain verifies end-to-end");
});
