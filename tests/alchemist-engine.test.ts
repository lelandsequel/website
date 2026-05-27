import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/alchemist/run/route.ts";
import { alchemistEngineManifest, runnerModes, runAlchemist } from "../lib/alchemist/engine.ts";

const creditPacket = `Adjusted EBITDA: $150.0mm
Gross debt: $605.0mm
Cash: $65.0mm
Cash interest: $48.0mm
Maintenance capex: $32.0mm
Cash taxes: $18.0mm
Working capital outflow: $10.0mm
Source: 10-K FY2026 management case`;

const csvCreditPacket = `Metric,Value,Source
Adjusted EBITDA,$150.0mm,FY2026 management case
Gross debt,$605.0mm,debt schedule WP-CREDIT-01
Cash,$65.0mm,bank statement
Cash interest,$48.0mm,credit model
Maintenance capex,$32.0mm,management case
Cash taxes,$18.0mm,tax schedule
Working capital outflow,$10.0mm,NWC bridge`;

const financePackets = {
  merger: `Acquirer standalone EPS: $5.25
Acquirer diluted shares: 220.0mm
Acquirer share price: $75.00
Target diluted shares: 75.0mm
Offer price: $48.80 per target share
Unaffected target share price: $40.00
Cash consideration: 65.0%
New debt coupon: 6.5%
Cash tax rate: 25.0%
Year 2 pre-tax run-rate synergies: $120.0mm`,
  lbo: `Entry EBITDA: $120.0mm
Entry purchase multiple: 10.0x EBITDA
Opening debt: 5.5x entry EBITDA
Year 5 EBITDA: $165.0mm
Exit multiple: 9.0x EBITDA
Exit net debt: $380.0mm`,
  sotp: `Payments EBITDA: $18.4bn; allowed multiple: 13.0x
Merchant software EBITDA: $4.9bn; allowed multiple: 8.5x
Consumer credit EBITDA: $3.2bn; allowed multiple: 6.0x
Corporate overhead expense: $1.6bn; capitalization multiple: 7.0x
Net debt, leases, and cash bridge: ($36.5bn)
Diluted shares: 750.0mm
Consumer credit charge-offs are above peer median`,
  scenarios: `Downside: 2.0% revenue growth, 23.0% EBITDA margin, $3.12bn CY+1 EBITDA, $18.7bn equity value
Bear: 4.0% revenue growth, 25.0% EBITDA margin, $3.55bn CY+1 EBITDA, $22.0bn equity value
Base: 7.0% revenue growth, 27.0% EBITDA margin, $4.10bn CY+1 EBITDA, $27.4bn equity value
Bull: 10.0% revenue growth, 29.0% EBITDA margin, $4.72bn CY+1 EBITDA, $34.1bn equity value
Bull customer-retention evidence is missing
Downside covenant cushion falls below 12.0%`,
  benchmark: `CY+1 EBITDA: $4.10bn
Net debt: $9.4bn
Diluted shares: 410.0mm
No peer list, company filings, fairness opinion, legal memo, tax memo, or board materials are supplied`,
};

test("ALCHEMIST manifest exposes every supported mode and a sealed corpus", () => {
  const manifest = alchemistEngineManifest();
  assert.equal(manifest.mode_count, runnerModes.length);
  assert.match(manifest.corpus_seal, /^sha256:[a-f0-9]{64}$/);
  assert.equal(manifest.modes.every(Boolean), true);
});

test("credit runner computes leverage, coverage, FCF cushion, and refusal metadata", () => {
  const result = runAlchemist({ mode: "credit", packet: creditPacket });
  assert.equal(result.verdict, "WATCH - CREDIT REVIEW REQUIRED");
  assert.equal(result.rows.find((item) => item.label === "Net debt / EBITDA")?.value, "3.6x");
  assert.equal(result.rows.find((item) => item.label === "EBITDA / cash interest")?.value, "3.1x");
  assert.equal(result.rows.find((item) => item.label === "FCF cushion")?.value, "$42.0mm");
  assert.ok(result.refusals.includes("No credit rating."));
  assert.match(result.metadata.corpus_seal, /^sha256:[a-f0-9]{64}$/);
  assert.ok(result.metadata.source_count > 0);
  assert.ok(result.rows.some((item) => item.label === "Parsed fields"));
});

test("runner parses CSV-ish packets without an LLM call", () => {
  const result = runAlchemist({ mode: "credit", packet: csvCreditPacket });
  assert.equal(result.rows.find((item) => item.label === "Net debt / EBITDA")?.value, "3.6x");
  assert.equal(result.rows.find((item) => item.label === "FCF cushion")?.value, "$42.0mm");
  assert.ok(result.metadata.parsed_field_count >= 7);
  assert.ok(result.audit.some((item) => item.label === "EVIDENCE_INDEX"));
});

test("accounting runner blocks unsupported close release", () => {
  const packet = "Close binder has missing payroll tie-out, unresolved cash difference, revenue cutoff blocker, and reviewer queue not approved.";
  const result = runAlchemist({ mode: "binder", packet });
  assert.equal(result.verdict, "BLOCKED - HUMAN REVIEW REQUIRED");
  for (const blocker of ["MISSING_PROOF", "MISMATCH", "POLICY_CONFLICT", "OPEN_REVIEW"]) {
    assert.ok(result.blockers.includes(blocker));
  }
  assert.ok(result.refusals.includes("No audit opinion."));
});

test("accounting modes refuse release when mode-specific evidence is absent", () => {
  const result = runAlchemist({ mode: "journal", packet: "JE-1047 amount $84.0mm. Support attached." });
  assert.equal(result.verdict, "BLOCKED - HUMAN REVIEW REQUIRED");
  assert.ok(result.blockers.includes("MISSING_APPROVER"));
});

test("all banking modules produce API-grade metadata, audit rows, and deterministic refusals", () => {
  for (const [mode, packet] of Object.entries(financePackets)) {
    const result = runAlchemist({ mode: mode as keyof typeof financePackets, packet });
    assert.match(result.metadata.input_hash, /^sha256:[a-f0-9]{64}$/);
    assert.equal(result.metadata.mode, mode);
    assert.ok(result.audit.some((item) => item.label === "CORPUS_SEAL"));
    assert.ok(result.refusals.length > 0);
    assert.notEqual(result.verdict, "REFUSE - MISSING SOURCE FIELDS");
  }
});

test("every accounting module applies the same release gate contract", () => {
  const packet = "Workpaper has missing support, unresolved difference, policy conflict, and reviewer queue not approved.";
  for (const mode of ["close", "recon", "journal", "flux", "binder", "policy", "control"] as const) {
    const result = runAlchemist({ mode, packet });
    assert.equal(result.verdict, "BLOCKED - HUMAN REVIEW REQUIRED");
    assert.equal(result.metadata.mode, mode);
    assert.ok(result.audit.some((item) => item.label === "CORPUS_SEAL"));
    assert.ok(result.refusals.includes("No close release while blockers remain."));
  }
});

test("runner output is repeatable for identical inputs", () => {
  const first = runAlchemist({ mode: "credit", packet: creditPacket });
  const second = runAlchemist({ mode: "credit", packet: creditPacket });
  assert.deepEqual(first, second);
});

test("runner refuses missing source fields instead of fabricating", () => {
  const result = runAlchemist({ mode: "lbo", packet: "Entry EBITDA: $120.0mm" });
  assert.equal(result.verdict, "REFUSE - MISSING SOURCE FIELDS");
  assert.ok(result.blockers.includes("entry multiple"));
  assert.ok(result.refusals[0].includes("No recommendation"));
});

test("API manifest returns sealed engine metadata", async () => {
  const response = GET();
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.route, "/api/alchemist/run");
  assert.equal(body.engine_version, "alchemist-runner-v0.3.0");
  assert.equal(body.mode_count, runnerModes.length);
  assert.match(body.corpus_seal, /^sha256:[a-f0-9]{64}$/);
});

test("API POST runs packets and enforces payload limit", async () => {
  const ok = await POST(new Request("http://test.local/api/alchemist/run", {
    method: "POST",
    body: JSON.stringify({ mode: "credit", packet: creditPacket }),
  }));
  const okBody = await ok.json();
  assert.equal(ok.status, 200);
  assert.equal(okBody.route, "/api/alchemist/run");
  assert.equal(okBody.result.verdict, "WATCH - CREDIT REVIEW REQUIRED");

  const tooLarge = await POST(new Request("http://test.local/api/alchemist/run", {
    method: "POST",
    body: JSON.stringify({ mode: "credit", packet: "x".repeat(81_000) }),
  }));
  assert.equal(tooLarge.status, 413);
});

test("ALCHEMIST API caps public workbench runs per request subject", async () => {
  const body = JSON.stringify({ mode: "credit", packet: creditPacket });
  const headers = {
    "content-type": "application/json",
    "x-forwarded-for": "203.0.113.42",
  };

  for (let i = 0; i < 12; i += 1) {
    const response = await POST(new Request("http://test.local/api/alchemist/run", {
      method: "POST",
      headers,
      body,
    }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-public-run-limit"), "12");
  }

  const blocked = await POST(new Request("http://test.local/api/alchemist/run", {
    method: "POST",
    headers,
    body,
  }));
  const blockedBody = await blocked.json();
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get("x-public-run-remaining"), "0");
  assert.equal(blockedBody.error, "Public run gate exhausted for this IP window.");
});
