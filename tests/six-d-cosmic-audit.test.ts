// 6D → COSMIC · Tier 3 — generated-artifact audit, proven in both directions.
//
//   A. Honest refusal — the REAL current 6D run produces only prompts/stubs/
//      skeletons, so the gate returns NOT_WORTHWHILE and does NOT invoke
//      VANTAGE or fabricate a clean pass. (the load-bearing "we don't bullshit")
//   B. Real teeth — when an artifact DOES carry runnable code with a planted
//      unsafe pattern, the gate routes it to VANTAGE and surfaces the finding
//      as a HIGH-severity REFUSE.
//
// (A) and the classifier run with no external dependency. (B) uses an injected
// runner that mirrors VANTAGE's real PULSAR output shape, so `npm test` stays
// hermetic. An *optional* third test shells out to the REAL VANTAGE when
// RUN_REAL_VANTAGE=1, proving the finding empirically against the live engine.

import { test } from "node:test";
import assert from "node:assert/strict";

import { runSixD, type RawIntent } from "../lib/six-d/engine";
import { EXAMPLE_INTENT } from "../lib/six-d/example";
import type { PhaseArtifact, RunManifest } from "../lib/six-d/types";
import {
  auditGeneratedArtifacts,
  classifyManifest,
} from "../lib/six-d/cosmic-audit";
import { classifyElement } from "../lib/six-d/cosmic-audit/classify";
import type {
  VantageReportSlice,
  VantageRunner,
} from "../lib/six-d/cosmic-audit/types";

// ── A · the real engine's artifacts are not auditable; gate refuses honestly ──

test("classification: every code-shaped artifact of a real 6D run is skeletal", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const classified = classifyManifest(m);
  assert.ok(classified.length > 0, "expected some code-shaped artifacts");
  // Not a single one is runnable code — they are prompts, stubs, skeletons.
  const runnable = classified.filter((c) => c.auditable);
  assert.equal(
    runnable.length,
    0,
    `expected 0 runnable artifacts, got: ${runnable.map((c) => c.elementId).join(", ")}`,
  );
  // And every one carries a concrete, honest reason for being unauditable.
  for (const c of classified) {
    assert.ok(c.reason.length > 20, `${c.elementId} has no real reason`);
    assert.notEqual(c.auditability, "runnable_code");
  }
});

test("gate: real run → NOT_WORTHWHILE, VANTAGE never invoked, no fabricated pass", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  let runnerCalled = false;
  const spyRunner: VantageRunner = async () => {
    runnerCalled = true;
    return emptyReport();
  };
  const audit = await auditGeneratedArtifacts(m, { runner: spyRunner });

  assert.equal(audit.verdict, "NOT_WORTHWHILE");
  assert.equal(audit.vantageInvoked, false);
  assert.equal(runnerCalled, false, "VANTAGE must NOT run on skeletal artifacts");
  assert.equal(audit.findings.length, 0);
  // The refusal names exactly what would make Tier 3 worthwhile.
  assert.match(audit.resolution, /real runnable code/i);
  assert.match(audit.resolution, /always-green gate/i);
  assert.equal(audit.runReceipt, m.receipt); // bound to the run it audited
});

test("determinism: the audit is identical across runs (same manifest, same runner)", async () => {
  const m = await runSixD(EXAMPLE_INTENT);
  const a = await auditGeneratedArtifacts(m, { runner: async () => emptyReport() });
  const b = await auditGeneratedArtifacts(m, { runner: async () => emptyReport() });
  assert.deepStrictEqual(a, b);
});

// ── B · a planted unsafe runnable artifact IS flagged ─────────────────────────

test("classifier flags a planted unsafe artifact as runnable_code", () => {
  const c = classifyElement(plantedUnsafeContractElement());
  assert.equal(c.auditability, "runnable_code");
  assert.equal(c.auditable, true);
  assert.ok(c.signals.hasAwait && c.signals.hasJsonParse);
  assert.ok(c.signals.extractedFunctions >= 1);
});

test("gate: a planted unsafe runnable artifact → VANTAGE runs → HIGH → REFUSE", async () => {
  const m = manifestWithRunnableArtifact();
  let dirSeen: string | null = null;
  // Fake runner mirrors VANTAGE's REAL PULSAR output for an unhandled async +
  // JSON.parse (verified against the live engine — see RUN_REAL_VANTAGE test).
  const fakeVantage: VantageRunner = async (dir) => {
    dirSeen = dir;
    const fs = await import("node:fs");
    const path = await import("node:path");
    const files = fs.readdirSync(dir);
    const target = files.find((f) => f.endsWith(".ts")) ?? files[0];
    const file = path.join(dir, target);
    return {
      pulsar: {
        adversarialFindings: [
          {
            file,
            line: 2,
            type: "async-race",
            severity: "HIGH",
            description:
              "Async function without error boundary — unhandled rejection will crash runtime",
            testCase: "Call commitStepUp() when the network returns 500",
          },
          {
            file,
            line: 4,
            type: "error-boundary",
            severity: "MED",
            description:
              "JSON.parse() without try/catch — malformed JSON will throw SyntaxError",
          },
        ],
      },
      aurora: { score: 0.42, verdict: "REJECTED", topIssues: [] },
    };
  };

  const audit = await auditGeneratedArtifacts(m, { runner: fakeVantage });

  assert.equal(audit.vantageInvoked, true);
  assert.ok(dirSeen, "the runner should have received a materialised directory");
  assert.equal(audit.verdict, "REFUSE");
  const high = audit.findings.filter((f) => f.severity === "HIGH");
  assert.equal(high.length, 1, "expected exactly one HIGH finding");
  // The finding is attributed back to the generating 6D artifact, not a bare path.
  assert.equal(high[0].elementId, "develop.contract.1");
  assert.match(audit.resolution, /HIGH-severity/);
  assert.match(audit.summary, /REFUSE/);
});

test("gate: planted unsafe artifact with only MED findings → HOLD", async () => {
  const m = manifestWithRunnableArtifact();
  const medOnly: VantageRunner = async (dir) => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const f = path.join(dir, fs.readdirSync(dir)[0]);
    return {
      pulsar: {
        adversarialFindings: [
          {
            file: f,
            line: 4,
            type: "error-boundary",
            severity: "MED",
            description: "JSON.parse() without try/catch",
          },
        ],
      },
      aurora: { score: 0.6, verdict: "REJECTED", topIssues: [] },
    };
  };
  const audit = await auditGeneratedArtifacts(m, { runner: medOnly });
  assert.equal(audit.verdict, "HOLD");
});

// ── Optional · prove it empirically against the REAL VANTAGE ──────────────────
// Skipped by default so `npm test` is hermetic. Run with:
//   RUN_REAL_VANTAGE=1 npx tsx --test tests/six-d-cosmic-audit.test.ts

test(
  "REAL VANTAGE: a planted unsafe artifact yields a HIGH finding (opt-in)",
  { skip: process.env.RUN_REAL_VANTAGE !== "1" },
  async () => {
    const { subprocessVantageRunner } = await import(
      "../lib/six-d/cosmic-audit/vantage-runner"
    );
    // A multi-function unsafe module — large/complex enough to clear ECLIPSE's
    // risk filter so PULSAR actually inspects it (documented engine caveat).
    const m = manifestWithBigUnsafeArtifact();
    const audit = await auditGeneratedArtifacts(m, {
      runner: subprocessVantageRunner(),
    });
    assert.equal(audit.vantageInvoked, true);
    assert.ok(
      audit.findings.some((f) => f.severity === "HIGH"),
      `expected a HIGH finding from real VANTAGE, got: ${JSON.stringify(audit.findings)}`,
    );
    assert.equal(audit.verdict, "REFUSE");
  },
);

// ── helpers ───────────────────────────────────────────────────────────────────

function emptyReport(): VantageReportSlice {
  return {
    pulsar: { adversarialFindings: [] },
    aurora: { score: 1, verdict: "APPROVED", topIssues: [] },
  };
}

/** A `contract` element whose body is REAL runnable code with unsafe patterns. */
function plantedUnsafeContractElement() {
  return {
    id: "develop.contract.1",
    kind: "contract",
    title: "Reference implementation (planted unsafe)",
    body: [
      "export async function commitStepUp(actionId: string) {",
      "  const res = await fetch(`/api/step-up/${actionId}`);",
      "  const data = JSON.parse(await res.text());",
      "  if (data.passed) { return true; } else { return false; }",
      "}",
    ].join("\n"),
    sourceRefs: ["intent.title"],
    fields: { language: "ts" },
  };
}

/** Build a real 6D manifest, then splice in the planted runnable artifact. */
function manifestWithRunnableArtifact(): RunManifest {
  return spliceRunnable(plantedUnsafeContractElement());
}

function manifestWithBigUnsafeArtifact(): RunManifest {
  const parts: string[] = [];
  for (let fn = 0; fn < 6; fn++) {
    let body = `export async function handler${fn}(a: string, b: number) {\n`;
    for (let i = 0; i < 30; i++) {
      body += `  if (b === ${i} && a) { await fetch('/x/' + a); } else if (b > ${i}) { b = b - 1; }\n`;
    }
    body += "  const res = await fetch('/api/step-up/' + a);\n";
    body += "  const data = JSON.parse(await res.text());\n";
    body += "  return data.passed;\n}\n\n";
    parts.push(body);
  }
  return spliceRunnable({
    id: "develop.contract.1",
    kind: "contract",
    title: "Reference implementation (planted, multi-function)",
    body: parts.join(""),
    sourceRefs: ["intent.title"],
    fields: { language: "ts" },
  });
}

/**
 * A near-real manifest: the actual EXAMPLE_INTENT run, but with one Develop
 * element swapped for a planted runnable artifact. Simulates a future phase
 * that emits real code, without touching v1.
 */
function spliceRunnable(el: ReturnType<typeof plantedUnsafeContractElement>): RunManifest {
  const THIN: RawIntent = EXAMPLE_INTENT;
  // We synthesise a minimal-but-valid manifest deterministically.
  const develop: PhaseArtifact = {
    phase: "develop",
    n: 4,
    name: "Develop",
    role: "SWE",
    deliverable: "Engineering handoff",
    elements: [el],
    openQuestions: [],
  };
  return {
    schema: "6d.run.v1",
    intent: {
      id: "planted",
      title: THIN.title,
      context: THIN.context,
      goals: THIN.goals,
      constraints: THIN.constraints,
      sourceMaterial: THIN.sourceMaterial,
    },
    intentIndex: [{ id: "intent.title", kind: "title", text: THIN.title }],
    artifacts: [develop],
    generatedBy: "test",
    receipt: "0".repeat(64),
  };
}
