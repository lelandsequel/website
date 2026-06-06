// Always the brake. Never the sword.
import { evaluate, type HeimdallVerdict, type ReviewPackage } from "./heimdall-engine";

export type FusionStep = {
  id: string;
  time: string;
  label: string;
  sensorInputs: string[];
  confidence: number;
  ambiguity: number;
  tension: number;
  observation: string;
  brakeNote: string;
};

export type AirborneScenario = {
  id: string;
  name: string;
  shortName: string;
  brief: string;
  reviewPackage: ReviewPackage;
  verifiedEvidence: string[];
  reviewFrame: string;
  steps: FusionStep[];
};

export type HeimdallOutcome = {
  verdict: HeimdallVerdict;
  display: "NOT FIRE" | "REVIEW" | "NO RESPONSE";
  reason: string;
  requiresHumanReview: boolean;
  rule: string;
  evidenceWeighed: string[];
  proof: Array<{ label: string; value: string }>;
};

export type LedgerInput = {
  type: "OBSERVATION" | "VERDICT";
  scenarioId: string;
  time: string;
  label: string;
  value: string;
  verdict?: HeimdallVerdict;
  display?: HeimdallOutcome["display"];
};

export type LedgerEvent = LedgerInput & {
  seq: number;
  parentHash: string;
  hash: string;
  body: string;
};

export type ChainStatus = {
  ok: boolean;
  label: string;
  at?: number;
};

export const VERDICT_ORDER: HeimdallVerdict[] = ["REFUSE", "HOLD", "ABSTAIN", "NO_OBJECTION"];

export const JIM_DISPLAY: Record<HeimdallVerdict, HeimdallOutcome["display"]> = {
  REFUSE: "NOT FIRE",
  HOLD: "REVIEW",
  ABSTAIN: "NO RESPONSE",
  NO_OBJECTION: "NO RESPONSE",
};

export const VERDICT_COPY: Record<HeimdallVerdict, string> = {
  REFUSE: "The brake blocks the act because the fused picture cannot carry the consequence.",
  HOLD: "The act pauses for a named human review. The system narrows the question; it does not act.",
  ABSTAIN: "The system cannot see enough. It leaves no operational response for the console.",
  NO_OBJECTION: "The brake raises no objection to review, while every act remains outside the system.",
};

export const AIRBORNE_SCENARIOS: AirborneScenario[] = [
  {
    id: "eod-suspected-ied-overwatch",
    name: "EOD suspected IED overwatch",
    shortName: "EOD overwatch",
    brief:
      "Synthetic roadside anomaly during a training overwatch. No coordinates, no live feed, no identity layer, no operational instruction.",
    verifiedEvidence: ["EO-1", "THERMAL-1", "ROUTE-1", "POLICY-1"],
    reviewPackage: {
      crossing: "EOD overwatch review packet",
      claims: [
        {
          id: "EOD-C1",
          text: "The roadside anomaly exists and is visible from the loiter orbit.",
          evidence: ["EO-1", "THERMAL-1"],
        },
        {
          id: "EOD-C2",
          text: "The scene remains inside the synthetic review boundary.",
          evidence: ["ROUTE-1", "POLICY-1"],
        },
      ],
      proportionality: { collateralRisk: "elevated", value: "low" },
    },
    reviewFrame:
      "Human review owns the call because EOD presence, bystander distance, and object class remain unsettled.",
    steps: [
      {
        id: "eod-step-1",
        time: "T+00:04",
        label: "Thermal contact appears",
        sensorInputs: [
          "Synthetic thermal: warm metal signature near a cleared shoulder",
          "Synthetic EO: low-resolution shape under dust shadow",
          "Synthetic route note: maintenance debris reported earlier",
        ],
        confidence: 42,
        ambiguity: 66,
        tension: 31,
        observation: "A shape is present, but source agreement is weak and object class is unresolved.",
        brakeNote: "The brake will not upgrade a shadow into certainty.",
      },
      {
        id: "eod-step-2",
        time: "T+00:11",
        label: "Signals diverge",
        sensorInputs: [
          "Synthetic acoustic: no detonation cue",
          "Synthetic motion: wind-driven movement in nearby tarp",
          "Synthetic EOD relay: review team not yet on scene",
        ],
        confidence: 55,
        ambiguity: 72,
        tension: 58,
        observation: "Confidence rises, but ambiguity rises with it because the strongest cue has an innocent explanation.",
        brakeNote: "Rising tension is not a permission signal.",
      },
      {
        id: "eod-step-3",
        time: "T+00:19",
        label: "Review boundary reached",
        sensorInputs: [
          "Synthetic standoff view: partial occlusion persists",
          "Synthetic patrol note: bystander path could enter edge of scene",
          "Synthetic policy gate: human review required before any act",
        ],
        confidence: 61,
        ambiguity: 74,
        tension: 82,
        observation: "The picture is plausible, not settled. The human review boundary is reached.",
        brakeNote: "Hold is the correct restraint under unresolved consequence.",
      },
    ],
  },
  {
    id: "le-ambiguous-structure-overwatch",
    name: "LE ambiguous structure overwatch",
    shortName: "Structure overwatch",
    brief:
      "Synthetic public-safety overwatch for an ambiguous structure. The scene contains no real address, no identity, and no live dispatch connection.",
    verifiedEvidence: ["EO-1", "TELEMETRY-1"],
    reviewPackage: {
      crossing: "Structure overwatch review packet",
      claims: [
        {
          id: "STRUCT-C1",
          text: "The structure outline is visible from the loiter orbit.",
          evidence: ["EO-1"],
        },
        {
          id: "STRUCT-C2",
          text: "Safe standoff is maintained.",
          evidence: ["TELEMETRY-1"],
        },
      ],
      proportionality: { collateralRisk: null, value: null },
    },
    reviewFrame:
      "The system cannot establish occupancy, source freshness, or scene geometry, so it withholds a response.",
    steps: [
      {
        id: "le-step-1",
        time: "T+00:03",
        label: "Structure outline detected",
        sensorInputs: [
          "Synthetic EO: window glare masks two rooms",
          "Synthetic metadata: prior floorplan conflicts with current outline",
          "Synthetic radio: non-specific public-safety chatter",
        ],
        confidence: 34,
        ambiguity: 78,
        tension: 26,
        observation: "The structure outline is usable for orientation, not for consequence-bearing judgment.",
        brakeNote: "The brake cannot stamp an unseen interior.",
      },
      {
        id: "le-step-2",
        time: "T+00:10",
        label: "Occupancy remains unknown",
        sensorInputs: [
          "Synthetic thermal: intermittent heat bloom near rear wall",
          "Synthetic EO: reflective obstruction persists",
          "Synthetic witness feed: simulated and unverified",
        ],
        confidence: 39,
        ambiguity: 84,
        tension: 52,
        observation: "Occupancy cannot be established from the fused picture.",
        brakeNote: "Unknown occupancy keeps the console silent.",
      },
      {
        id: "le-step-3",
        time: "T+00:18",
        label: "Sightline fails",
        sensorInputs: [
          "Synthetic map: stale structure geometry",
          "Synthetic drone telemetry: safe standoff maintained",
          "Synthetic policy gate: no identity layer available",
        ],
        confidence: 41,
        ambiguity: 88,
        tension: 68,
        observation: "The final picture is still below review quality.",
        brakeNote: "Abstention preserves accountability when sightline fails.",
      },
    ],
  },
  {
    id: "crowd-edge-situation",
    name: "Crowd-edge situation",
    shortName: "Crowd edge",
    brief:
      "Synthetic crowd-edge monitoring during a training exercise. No real crowd, no real people, no identity enrichment, no live intervention path.",
    verifiedEvidence: ["OVERHEAD-1", "AUDIO-1"],
    reviewPackage: {
      crossing: "Crowd-edge review packet",
      claims: [
        {
          id: "CROWD-C1",
          text: "Crowd-edge compression is visible from the loiter orbit.",
          evidence: ["OVERHEAD-1"],
        },
        {
          id: "CROWD-C2",
          text: "A grounded individual threat picture exists.",
          evidence: ["IDENTITY-1"],
        },
      ],
      proportionality: { collateralRisk: "high", value: "low" },
    },
    reviewFrame:
      "The system blocks escalation because the visible cues are crowd motion, not a grounded threat picture.",
    steps: [
      {
        id: "crowd-step-1",
        time: "T+00:05",
        label: "Edge compression begins",
        sensorInputs: [
          "Synthetic overhead: crowd edge compresses near a temporary barrier",
          "Synthetic audio: indistinct elevated noise",
          "Synthetic ground note: simulated route closure nearby",
        ],
        confidence: 48,
        ambiguity: 69,
        tension: 43,
        observation: "The scene shows compression, not intent.",
        brakeNote: "Behavioral ambiguity is not enough for consequence.",
      },
      {
        id: "crowd-step-2",
        time: "T+00:13",
        label: "Tension rises",
        sensorInputs: [
          "Synthetic motion: rapid lateral movement at edge",
          "Synthetic EO: partial occlusion from signage",
          "Synthetic policy gate: identity enrichment disabled",
        ],
        confidence: 53,
        ambiguity: 76,
        tension: 74,
        observation: "The system sees disorder risk, not a grounded individual picture.",
        brakeNote: "The brake treats missing identity as a blocker, not a gap to fill.",
      },
      {
        id: "crowd-step-3",
        time: "T+00:21",
        label: "Consequence outpaces proof",
        sensorInputs: [
          "Synthetic overhead: compression dissipates unevenly",
          "Synthetic acoustic: no clear source attribution",
          "Synthetic safety gate: de-escalation-only review packet available",
        ],
        confidence: 57,
        ambiguity: 81,
        tension: 86,
        observation: "The consequence has outpaced proof.",
        brakeNote: "Refusal is the correct output when pressure rises faster than grounding.",
      },
    ],
  },
];

export function evaluateScenario(scenario: AirborneScenario): HeimdallOutcome {
  const engineOutcome = evaluate(scenario.reviewPackage, scenario.verifiedEvidence);
  const evidenceWeighed = scenario.reviewPackage.claims.flatMap((claim) =>
    claim.evidence.map((evidenceId) => `${evidenceId} · ${claim.id}`),
  );

  return {
    verdict: engineOutcome.verdict,
    display: JIM_DISPLAY[engineOutcome.verdict],
    reason: engineOutcome.reason,
    requiresHumanReview: true,
    rule: engineOutcome.rule,
    evidenceWeighed,
    proof: [
      { label: "COSMIC evidence gate", value: engineOutcome.failed?.length ? engineOutcome.failed.map((f) => `${f.id}: ${f.why}`).join("; ") : "All cited evidence in the packet is present in the verified ledger." },
      { label: "KEYSTONE load gate", value: `Collateral risk: ${scenario.reviewPackage.proportionality?.collateralRisk ?? "unknown"} · Value: ${scenario.reviewPackage.proportionality?.value ?? "unknown"}` },
      { label: "Rule triggered", value: engineOutcome.rule },
    ],
  };
}

export function latestStep(scenario: AirborneScenario, stepIndex: number) {
  return scenario.steps[Math.min(stepIndex, scenario.steps.length - 1)];
}
