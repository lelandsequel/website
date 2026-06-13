// 6D Workbench — COSMIC pipeline (Tier 1) — the upgrade proven:
//   1. LUNA   — runs append to a hash-chained ledger; verify() walks it and names
//               the entry that broke on tamper.
//   2. AURORA — each artifact carries a verdict (NO_OBJECTION/HOLD/REFUSE); ≥1
//               REFUSE/HOLD maps from a REAL gap; REFUSE→RESOLVE→RECOMPUTE clears it.
//   3. VELLUM — unsourced elements are flagged UNBOUND and cannot ship as fact.
//   4. Determinism — same intent ⇒ identical artifacts AND identical ledger/chain
//               hashes across runs (no clock, no network, no Math.random).
//
// Style mirrors tests/six-d-engine.test.ts. The EXISTING v1 suite is unchanged.

import { test } from "node:test";
import assert from "node:assert/strict";

import { runSixD, type RawIntent } from "../lib/six-d/engine";
import { EXAMPLE_INTENT } from "../lib/six-d/example";
import type { RunManifest } from "../lib/six-d/types";

import {
  Ledger,
  MemoryLedgerStore,
  bindProvenance,
  unboundElements,
  runAuroraGate,
  applyResolutions,
  refuseResolveRecompute,
  buildCosmicRun,
  runSixDCosmic,
  runBatchCosmic,
  cosmicLedgerPayload,
  VERDICTS,
} from "../lib/six-d/cosmic";

const THIN_INTENT: RawIntent = {
  title: "Make the dashboard better",
  context: "It feels slow sometimes.",
  goals: ["Improve it"],
  constraints: [],
  sourceMaterial: [],
};

// A manifest clone with one fabricated, unsourced element injected — the honest
// way to exercise the UNBOUND/REFUSE floor (v1 itself never emits an unbound
// element on the example; that is the point of its trace discipline).
function withFabricatedElement(m: RunManifest): RunManifest {
  const t: RunManifest = structuredClone(m);
  t.artifacts[0].elements.push({
    id: "define.fabricated.1",
    kind: "fabricated",
    body: "An invented fact with no real source.",
    sourceRefs: ["intent.does.not.exist"],
  });
  return t;
}

// ── LUNA ──────────────────────────────────────────────────────────────────────

test("LUNA: a run appends a sealed entry; verify() is ok on an intact chain", async () => {
  const { entry, ledger } = await runSixDCosmic(EXAMPLE_INTENT);
  assert.equal(entry.seq, 1);
  assert.equal(entry.parentHash, null, "genesis entry has null parentHash");
  assert.match(entry.hash, /^[0-9a-f]{64}$/);
  assert.match(entry.payloadHash, /^[0-9a-f]{64}$/);
  const v = await ledger.verify();
  assert.equal(v.ok, true);
  assert.equal(v.ok && v.count, 1);
});

test("LUNA: each entry chains the previous entry's hash (parentHash === prior hash)", async () => {
  const { ledger, entries } = await runBatchCosmic([
    EXAMPLE_INTENT,
    THIN_INTENT,
    { ...EXAMPLE_INTENT, title: "Servicing Console — Step-Up Auth (v2)" },
  ]);
  assert.equal(entries.length, 3);
  assert.equal(entries[0].parentHash, null);
  assert.equal(entries[1].parentHash, entries[0].hash);
  assert.equal(entries[2].parentHash, entries[1].hash);
  const v = await ledger.verify();
  assert.equal(v.ok, true);
  assert.equal(v.ok && v.count, 3);
});

test("LUNA: verify() names the entry that broke on tamper (payload altered)", async () => {
  const { ledger, entries } = await runBatchCosmic([EXAMPLE_INTENT, THIN_INTENT, EXAMPLE_INTENT]);
  assert.equal((await ledger.verify()).ok, true);

  // Tamper with the SECOND entry's carried payload after the fact.
  const tampered = ledger.all;
  (tampered[1].payload as Record<string, unknown>).intentId = "tampered-intent-id";
  const broken = new Ledger(new MemoryLedgerStore(tampered));

  const v = await broken.verify();
  assert.equal(v.ok, false);
  assert.equal(!v.ok && v.at, 2, "verify() should point at the tampered entry (seq 2)");
  assert.ok(!v.ok && /payload altered/i.test(v.reason));
});

test("LUNA: verify() detects a snapped link (parentHash rewritten)", async () => {
  const { ledger } = await runBatchCosmic([EXAMPLE_INTENT, THIN_INTENT]);
  const entries = ledger.all;
  entries[1].parentHash = "0".repeat(64); // snap the link to entry 1
  const broken = new Ledger(new MemoryLedgerStore(entries));
  const v = await broken.verify();
  assert.equal(v.ok, false);
  assert.equal(!v.ok && v.at, 2);
  assert.ok(!v.ok && /chain broken/i.test(v.reason));
});

// ── AURORA ──────────────────────────────────────────────────────────────────────

test("AURORA: every artifact carries a verdict from the fixed vocabulary", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const gate = await runAuroraGate(m);
  assert.equal(gate.artifacts.length, 6);
  const allowed = new Set(Object.values(VERDICTS));
  for (const av of gate.artifacts) {
    assert.ok(allowed.has(av.verdict), `${av.phase} has an unknown verdict ${av.verdict}`);
    assert.ok(av.reason.length > 0, `${av.phase} verdict has no reason`);
  }
});

test("AURORA: ≥1 REFUSE/HOLD maps from a REAL gap (the blocking audit-write OQ → REFUSE)", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const gate = await runAuroraGate(m);

  // The Develop phase carries v1's genuine blocking open question
  // ("if the audit write fails, does the action proceed or block?").
  const develop = gate.artifacts.find((a) => a.phase === "develop")!;
  assert.equal(develop.verdict, VERDICTS.REFUSE, "blocking gap must floor the phase to REFUSE");
  assert.ok(
    develop.resolves.some((n) => n.blocking && /proceed or block/i.test(n.required)),
    "the REFUSE must trace to the real audit-write gap, not an invented one",
  );

  // And there is at least one HOLD somewhere (non-blocking gaps).
  assert.ok(
    gate.artifacts.some((a) => a.verdict === VERDICTS.HOLD),
    "expected ≥1 HOLD from a real non-blocking gap",
  );

  // The toy open-questions are now verdicts: every outstanding need has a key.
  assert.ok(gate.outstanding.length >= 3);
  for (const need of gate.outstanding) assert.match(need.key, /^(oq|unbound):/);
});

test("AURORA: REFUSE→RESOLVE→RECOMPUTE clears the gap when a resolution is supplied", async () => {
  const m = await runSixD(EXAMPLE_INTENT);

  const before = await runAuroraGate(m);
  assert.equal(before.artifacts.find((a) => a.phase === "develop")!.verdict, VERDICTS.REFUSE);
  const outstandingBefore = before.outstanding.length;

  const loop = await refuseResolveRecompute(m, [
    {
      key: "oq:develop.oq.1",
      answer: "If the audit write fails, the action BLOCKS and is queued for retry.",
    },
  ]);

  assert.deepEqual(loop.resolvedKeys, ["oq:develop.oq.1"]);
  assert.ok(loop.outcomes.every((o) => o.accepted));
  assert.equal(
    loop.after.artifacts.find((a) => a.phase === "develop")!.verdict,
    VERDICTS.NO_OBJECTION,
    "resolving the blocking gap must lift the phase to NO_OBJECTION",
  );
  assert.equal(loop.after.outstanding.length, outstandingBefore - 1);
});

test("AURORA: an unresolved REFUSE stays refused — we don't estimate", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  // Supply nothing. The blocking gap remains; develop stays REFUSE.
  const loop = await refuseResolveRecompute(m, []);
  assert.equal(loop.resolvedKeys.length, 0);
  assert.equal(loop.after.artifacts.find((a) => a.phase === "develop")!.verdict, VERDICTS.REFUSE);
});

test("AURORA: an UNBOUND resolution is rejected without a real source binding", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const tampered = withFabricatedElement(m);
  const gate = await runAuroraGate(tampered);

  // No sourceRef → rejected; the refusal stands (no-bullshit floor).
  const bare = applyResolutions(tampered, gate, [
    { key: "unbound:define.fabricated.1", answer: "trust me" },
  ]);
  assert.equal(bare.outcomes[0].accepted, false);
  assert.ok(/sourceRef/i.test(bare.outcomes[0].reason));
  assert.equal(bare.resolvedKeys.size, 0);

  // A real, resolvable sourceRef → accepted.
  const bound = applyResolutions(tampered, gate, [
    { key: "unbound:define.fabricated.1", answer: "bind it", sourceRef: "intent.title" },
  ]);
  assert.equal(bound.outcomes[0].accepted, true);
  assert.ok(bound.resolvedKeys.has("unbound:define.fabricated.1"));
});

// ── VELLUM ──────────────────────────────────────────────────────────────────────

test("VELLUM: every v1 element on the example binds to a source (none UNBOUND)", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const prov = await bindProvenance(m);
  assert.equal(prov.length, m.artifacts.reduce((n, a) => n + a.elements.length, 0));
  assert.equal(unboundElements(prov).length, 0, "v1's trace discipline should leave nothing unbound");
  // Every BOUND element has at least one resolved binding carrying a source hash.
  for (const p of prov) {
    if (p.status === "BOUND") {
      assert.ok(
        p.bindings.some((b) => b.resolved && /^[0-9a-f]{64}$/.test(b.sourceHash ?? "")),
        `${p.elementId} is BOUND but has no hashed source binding`,
      );
    }
  }
});

test("VELLUM: an unsourced element is flagged UNBOUND and cannot ship as fact (→ REFUSE)", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const tampered = withFabricatedElement(m);

  const prov = await bindProvenance(tampered);
  const unbound = unboundElements(prov);
  assert.equal(unbound.length, 1);
  assert.equal(unbound[0].elementId, "define.fabricated.1");
  assert.match(unbound[0].reason ?? "", /resolve/i);

  // AURORA turns UNBOUND into REFUSE at the element and floors the phase.
  const gate = await runAuroraGate(tampered);
  const define = gate.artifacts.find((a) => a.phase === "define")!;
  const fab = define.elements.find((e) => e.elementId === "define.fabricated.1")!;
  assert.equal(fab.verdict, VERDICTS.REFUSE);
  assert.ok(/UNBOUND/i.test(fab.reason));
  assert.equal(define.verdict, VERDICTS.REFUSE);
});

test("VELLUM: an element with no sourceRefs at all is UNBOUND", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const t: RunManifest = structuredClone(m);
  t.artifacts[1].elements.push({
    id: "design.orphan.1",
    kind: "orphan",
    body: "No refs at all.",
    sourceRefs: [],
  });
  const prov = await bindProvenance(t);
  const orphan = prov.find((p) => p.elementId === "design.orphan.1")!;
  assert.equal(orphan.status, "UNBOUND");
  assert.match(orphan.reason ?? "", /no sourceRefs/i);
});

// ── Determinism ──────────────────────────────────────────────────────────────────

test("determinism: same intent ⇒ identical CosmicRun (artifacts, provenance, gate, runHash)", async () => {
  const a = await buildCosmicRun(EXAMPLE_INTENT);
  const b = await buildCosmicRun(EXAMPLE_INTENT);
  assert.deepStrictEqual(a.manifest, b.manifest);
  assert.deepStrictEqual(a.provenance, b.provenance);
  assert.deepStrictEqual(a.gate, b.gate);
  assert.equal(a.runHash, b.runHash);
  assert.match(a.runHash, /^[0-9a-f]{64}$/);
});

test("determinism: same intent ⇒ identical ledger/chain hashes across independent runs", async () => {
  const r1 = await runSixDCosmic(EXAMPLE_INTENT); // fresh ledger, genesis
  const r2 = await runSixDCosmic(EXAMPLE_INTENT); // fresh ledger, genesis
  assert.equal(r1.entry.payloadHash, r2.entry.payloadHash, "same run ⇒ same payload hash");
  assert.equal(r1.entry.hash, r2.entry.hash, "same run at the same chain position ⇒ same seal");
  assert.equal(r1.run.runHash, r2.run.runHash);
});

test("determinism: a whole batch reproduces the identical chain head", async () => {
  const batch = [EXAMPLE_INTENT, THIN_INTENT, { ...EXAMPLE_INTENT, title: "Variant" }];
  const a = await runBatchCosmic(batch);
  const b = await runBatchCosmic(batch);
  const va = await a.ledger.verify();
  const vb = await b.ledger.verify();
  assert.equal(va.ok && vb.ok, true);
  assert.equal(va.ok && va.head, vb.ok ? vb.head : null, "identical batch ⇒ identical chain head");
  assert.deepEqual(a.entries.map((e) => e.hash), b.entries.map((e) => e.hash));
});

test("sensitivity: a one-word intent change changes the run hash and the chain entry", async () => {
  const a = await runSixDCosmic(EXAMPLE_INTENT);
  const mutated: RawIntent = {
    ...EXAMPLE_INTENT,
    goals: [...EXAMPLE_INTENT.goals.slice(0, -1), "Capture a partial audit trail"],
  };
  const b = await runSixDCosmic(mutated);
  assert.notEqual(a.run.runHash, b.run.runHash);
  assert.notEqual(a.entry.payloadHash, b.entry.payloadHash);
});

test("integrity: the ledger payload equals the canonical cosmicLedgerPayload (parity)", async () => {
  const { run, entry } = await runSixDCosmic(EXAMPLE_INTENT);
  assert.deepStrictEqual(entry.payload, cosmicLedgerPayload(run));
});

// ── v1 untouched ────────────────────────────────────────────────────────────────

test("non-regression: the COSMIC run consumes v1 byte-identically", async () => {
  const v1 = await runSixD(EXAMPLE_INTENT);
  const cosmic = await buildCosmicRun(EXAMPLE_INTENT);
  // The COSMIC pipeline wraps the v1 manifest without altering it.
  assert.deepStrictEqual(cosmic.manifest, v1);
  assert.equal(cosmic.manifest.receipt, v1.receipt);
});
