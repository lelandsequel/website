import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/omnis/run/route.ts";
import { GET as LEGACY_GET, POST as LEGACY_POST } from "../app/api/engineering/run/route.ts";
import { ENGINEERING_CORPUS_SEAL, engineeringModules, runEngineeringSuite } from "../lib/engineering-suite.ts";

test("OMNIS exposes a sealed manifest", async () => {
  const response = GET();
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.route, "/api/omnis/run");
  assert.equal(body.generated_by, "OMNIS deterministic engineering suite");
  assert.equal(body.engine_version, "engineering-suite-runner-v0.1.0");
  assert.equal(body.modes.length, engineeringModules.length);
  assert.match(body.corpus_seal, /^sha256:[a-f0-9]{64}$/);
});

test("CADMUS turns incomplete intent into review-required spec findings", () => {
  const result = runEngineeringSuite("cadmus", "Build the onboarding thing fast. Make it better soon.");
  assert.equal(result.verdict, "SPEC REVIEW REQUIRED");
  assert.ok(result.findings.some((finding) => finding.code === "CADMUS-SPEC-001"));
  assert.ok(result.refusals.includes("No implementation handoff while high-severity spec gaps remain."));
  assert.equal(result.metadata.corpus_seal, ENGINEERING_CORPUS_SEAL);
});

test("VANTAGE 2.0 blocks unsafe code packets", () => {
  const result = runEngineeringSuite("vantage", "Diff adds eval(req.body.script), logs process.env.API_KEY, and has no tests.");
  assert.equal(result.verdict, "REFUSE - RELEASE BLOCKED");
  assert.ok(result.findings.some((finding) => finding.code === "VANTAGE-RUNTIME-001"));
  assert.ok(result.findings.some((finding) => finding.code === "VANTAGE-SECRET-001"));
  assert.ok(result.score < 50);
});

test("VANTAGE 2.0 catches raw SQL built by string concatenation", () => {
  const result = runEngineeringSuite(
    "vantage",
    "Diff adds raw SQL query built by string concatenation, with package-lock.json and passing tests attached.",
  );
  assert.equal(result.verdict, "REVIEW - HIGH RISK");
  assert.ok(result.findings.some((finding) => finding.code === "VANTAGE-DATA-001"));
});

test("PROSPECTOR blocks critical diligence packets", () => {
  const result = runEngineeringSuite("prospector", "Public S3 bucket with customer docs. No named owner. No SBOM. No architecture diagram.");
  assert.equal(result.verdict, "REFUSE - DILIGENCE BLOCKED");
  assert.ok(result.findings.some((finding) => finding.code === "PROSPECTOR-DATA-001"));
  assert.ok(result.benchmarkPrompt.includes("Do not invent missing evidence."));
});

test("LUNA refuses unsupported memory briefs without evidence", () => {
  const result = runEngineeringSuite("luna", "Tell me what I did yesterday. I think I worked on the app.");
  assert.equal(result.verdict, "BRIEF REVIEW REQUIRED");
  assert.ok(result.findings.some((finding) => finding.code === "LUNA-EVIDENCE-001"));
  assert.ok(result.refusals.includes("No invented activity claims outside the packet."));
});

test("OMNIS API runs packets and enforces limits", async () => {
  const ok = await POST(new Request("http://test.local/api/omnis/run", {
    method: "POST",
    body: JSON.stringify({ mode: "vantage", packet: "Diff adds eval(req.body.script), logs process.env.API_KEY, and has no tests." }),
  }));
  const okBody = await ok.json();
  assert.equal(ok.status, 200);
  assert.equal(okBody.route, "/api/omnis/run");
  assert.equal(okBody.result.verdict, "REFUSE - RELEASE BLOCKED");

  const badMode = await POST(new Request("http://test.local/api/omnis/run", {
    method: "POST",
    body: JSON.stringify({ mode: "nope", packet: "hello" }),
  }));
  assert.equal(badMode.status, 400);

  const tooLarge = await POST(new Request("http://test.local/api/omnis/run", {
    method: "POST",
    body: JSON.stringify({ mode: "cadmus", packet: "x".repeat(81_000) }),
  }));
  assert.equal(tooLarge.status, 413);
});

test("OMNIS API caps public workbench runs per request subject", async () => {
  const body = JSON.stringify({ mode: "prospector", packet: "Public S3 bucket with customer docs. No SBOM." });
  const headers = {
    "content-type": "application/json",
    "x-forwarded-for": "203.0.113.77",
  };

  for (let i = 0; i < 12; i += 1) {
    const response = await POST(new Request("http://test.local/api/omnis/run", {
      method: "POST",
      headers,
      body,
    }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-public-run-limit"), "12");
  }

  const blocked = await POST(new Request("http://test.local/api/omnis/run", {
    method: "POST",
    headers,
    body,
  }));
  const blockedBody = await blocked.json();
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get("x-public-run-remaining"), "0");
  assert.equal(blockedBody.error, "Public run gate exhausted for this IP window.");
});

test("legacy engineering API reports OMNIS metadata and shares the OMNIS public run gate", async () => {
  const manifest = LEGACY_GET();
  const manifestBody = await manifest.json();
  assert.equal(manifest.status, 200);
  assert.equal(manifestBody.route, "/api/omnis/run");
  assert.equal(manifestBody.generated_by, "OMNIS deterministic engineering suite");

  const body = JSON.stringify({ mode: "cadmus", packet: "Build onboarding fast. No acceptance tests yet." });
  const headers = {
    "content-type": "application/json",
    "x-forwarded-for": "203.0.113.88",
  };

  const canonical = await POST(new Request("http://test.local/api/omnis/run", {
    method: "POST",
    headers,
    body,
  }));
  assert.equal(canonical.status, 200);
  assert.equal(canonical.headers.get("x-public-run-remaining"), "11");

  const legacy = await LEGACY_POST(new Request("http://test.local/api/engineering/run", {
    method: "POST",
    headers,
    body,
  }));
  const legacyBody = await legacy.json();
  assert.equal(legacy.status, 200);
  assert.equal(legacy.headers.get("x-public-run-remaining"), "10");
  assert.equal(legacyBody.route, "/api/omnis/run");
  assert.equal(legacyBody.generated_by, "OMNIS deterministic engineering suite");
});
