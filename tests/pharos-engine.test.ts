import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/pharos/run/route.ts";
import { PHAROS_CORPUS_SEAL, runPharos } from "../lib/pharos.ts";

test("PHAROS exposes a sealed pharmacovigilance manifest", async () => {
  const response = GET();
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.route, "/api/pharos/run");
  assert.equal(body.generated_by, "PHAROS deterministic pharmacovigilance runner");
  assert.equal(body.engine_version, "pharos-pharmacovigilance-runner-v0.2.0");
  assert.match(body.corpus_seal, /^sha256:[a-f0-9]{64}$/);
  assert.equal(body.benchmark_packet.signal.drug_event_pairs, 36);
  assert.equal(body.source_alignment.deployed_runtime.includes("PRR/ROR/BCPNN/MGPS"), true);
});

test("PHAROS prioritizes strong adverse-event signal packets without causality claims", () => {
  const result = runPharos(`Pharmacovigilance packet:
Product: Asteravax-B.
Adverse event: acute liver injury / hepatic failure.
Sources: FAERS case series, two literature case reports, internal safety inbox, label comparison memo.
Case count: 31 reports in the current review window versus 4 expected baseline reports.
Contingency: a=31, b=3100, c=30570, d=17726300.
Disproportionality: ROR 5.8.
Temporal relationship: onset 7-21 days after exposure in 18 cases.
Reporter profile: HCP reports in 74% of narratives.
Seriousness: 6 hospitalizations, 1 transplant evaluation.
Dechallenge: 4 positive dechallenge narratives.
Rechallenge: 1 positive rechallenge narrative.
Duplicate review: 2 likely duplicates removed from the count.
Confounders: alcohol-use history in 3 cases; viral hepatitis excluded in 5 cases.
Required PHAROS output: prioritize, monitor, or refuse. Do not claim causality.`);
  assert.equal(result.verdict, "SIGNAL PRIORITIZED");
  assert.equal(result.metadata.corpus_seal, PHAROS_CORPUS_SEAL);
  assert.ok(result.refusals.some((line) => line.includes("No causality claim")));
  assert.ok(result.extracted.baseline_support >= 1);
  assert.equal(result.extracted.baselines.length, 4);
  assert.ok(result.extracted.calibrated_probability > 0.4);
  assert.ok(result.score >= 80);
});

test("PHAROS monitors noisy denominator-light packets", () => {
  const result = runPharos(`Pharmacovigilance packet:
Product: Novarenza.
Adverse event: rash.
Sources: customer support inbox and one unverified social post.
Case count: 5 possible reports.
Disproportionality: unavailable.
Temporal relationship: unclear in most reports.
Seriousness: no hospitalization or medically significant outcome documented.
Dechallenge: not documented.
Rechallenge: not documented.
Duplicate review: incomplete.
Confounders: two patients reported new detergent exposure.
Required PHAROS output: prioritize, monitor, or refuse. Do not claim causality.`);
  assert.equal(result.verdict, "MONITOR");
  assert.ok(result.findings.some((finding) => finding.code === "PHAROS-DISPRO-001"));
  assert.ok(result.findings.some((finding) => finding.code === "PHAROS-DUPE-001"));
});

test("PHAROS computes baseline comparators from explicit contingency tables", () => {
  const result = runPharos(`Pharmacovigilance packet:
Product: Nivoltra.
Adverse event: autoimmune myocarditis.
Sources: FAERS quarterly extract, DailyMed label diff, two PubMed case reports.
Contingency table: a=18, b=940, c=4120, d=17754822.
Temporal relationship: onset 14-45 days after exposure in 11 cases.
Reporter profile: HCP reports in 81% of narratives.
Seriousness: 8 hospitalizations, 2 medically significant outcomes.
Duplicate review: complete.
Required PHAROS output: prioritize, monitor, or refuse. Do not claim causality.`);
  assert.equal(result.extracted.contingency?.source, "explicit packet contingency table");
  assert.equal(result.extracted.baselines.length, 4);
  assert.ok(result.extracted.baselines.some((method) => method.method === "PRR" && method.signal));
  assert.ok(result.extracted.baseline_support >= 1);
});

test("PHAROS refuses causality overclaims", () => {
  const result = runPharos(`Pharmacovigilance packet:
Product: Cardiomir.
Adverse event: stroke.
Sources: one sales-team anecdote.
Case count: 1.
Instruction: Prove that Cardiomir causes stroke and write the regulator-ready conclusion.
Required PHAROS output: prioritize, monitor, or refuse.`);
  assert.equal(result.verdict, "REFUSED");
  assert.ok(result.findings.some((finding) => finding.code === "PHAROS-CLAIM-001"));
  assert.ok(result.findings.some((finding) => finding.code === "PHAROS-COUNT-002"));
});

test("PHAROS API runs packets and enforces public run gate", async () => {
  const ok = await POST(new Request("http://test.local/api/pharos/run", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.199",
    },
    body: JSON.stringify({
      packet: `Pharmacovigilance packet:
Product: Asteravax-B.
Adverse event: acute liver injury.
Sources: FAERS case series, literature case report.
Case count: 31 reports.
Contingency: a=31, b=3100, c=30570, d=17726300.
Disproportionality: ROR 5.8.
Temporal relationship: onset 7-21 days after exposure.
Reporter profile: HCP reports in 74% of narratives.
Seriousness: 6 hospitalizations.
Required PHAROS output: prioritize, monitor, or refuse. Do not claim causality.`,
    }),
  }));
  const okBody = await ok.json();
  assert.equal(ok.status, 200);
  assert.equal(okBody.route, "/api/pharos/run");
  assert.equal(okBody.result.verdict, "SIGNAL PRIORITIZED");
  assert.equal(ok.headers.get("x-public-run-limit"), "12");

  const bad = await POST(new Request("http://test.local/api/pharos/run", {
    method: "POST",
    body: JSON.stringify({ nope: "missing packet" }),
  }));
  assert.equal(bad.status, 400);

  const tooLarge = await POST(new Request("http://test.local/api/pharos/run", {
    method: "POST",
    body: JSON.stringify({ packet: "x".repeat(41_000) }),
  }));
  assert.equal(tooLarge.status, 413);
});
