import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { POST, GET } from "../app/api/bacchus/cellar/run/route.ts";
import { BACCHUS_CELLAR_SAMPLES } from "../lib/bacchus/cellar-samples.ts";
import { runBacchusCellar } from "../lib/bacchus/cellar-intelligence.ts";

describe("BACCHUS Cellar Intelligence", () => {
  it("prioritizes a clean premium spirits account with proof", () => {
    const result = runBacchusCellar(BACCHUS_CELLAR_SAMPLES[0].packet);
    assert.equal(result.decision, "PRIORITIZE");
    assert.equal(result.accountName, "Hotel Aurelia Lobby Bar");
    assert.equal(result.lane, "Premium rum");
    assert.ok(result.fitScore >= 78);
    assert.equal(result.refusals.length, 0);
    assert.ok(result.placementPlan.length >= 3);
    assert.ok(result.trainingPacket.length >= 3);
    assert.ok(result.depletionPlan.length >= 3);
    assert.equal(result.proofRows.at(-1)?.id, "RELEASE_DECISION");
  });

  it("hard-refuses compliance-boundary packets", () => {
    const result = runBacchusCellar(BACCHUS_CELLAR_SAMPLES[3].packet);
    assert.equal(result.decision, "REFUSE");
    assert.ok(result.refusals.some((refusal) => refusal.code === "BACCHUS-COMPLIANCE-001" && refusal.severity === "HARD"));
    assert.match(result.firstMove, /Stop placement activity/);
  });

  it("serves an API manifest", async () => {
    const response = await GET();
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.route, "/api/bacchus/cellar/run");
    assert.equal(body.generated_by, "BACCHUS Cellar Intelligence");
    assert.ok(body.samples.length >= 4);
  });

  it("runs through the API route", async () => {
    const response = await POST(new Request("http://test.local/api/bacchus/cellar/run", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": `127.0.0.${Math.floor(Math.random() * 200) + 1}`,
      },
      body: JSON.stringify({ sampleId: "hotel-rum" }),
    }));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.route, "/api/bacchus/cellar/run");
    assert.equal(body.result.decision, "PRIORITIZE");
    assert.equal(body.result.accountName, "Hotel Aurelia Lobby Bar");
  });
});
