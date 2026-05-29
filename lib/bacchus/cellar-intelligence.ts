import { createHash } from "node:crypto";
import { BACCHUS_CELLAR_SAMPLES } from "./cellar-samples";

export type BacchusCellarDecision = "PRIORITIZE" | "NURTURE" | "REVIEW" | "REFUSE";
export type BacchusCellarTone = "success" | "warning" | "danger" | "neutral";

export type BacchusCellarMetric = {
  label: string;
  value: string;
  tone: BacchusCellarTone;
  detail: string;
};

export type BacchusCellarPlanItem = {
  title: string;
  detail: string;
};

export type BacchusCellarRefusal = {
  code: string;
  severity: "HARD" | "SOFT";
  message: string;
  remediation: string;
};

export type BacchusCellarProofRow = {
  id: string;
  source: string;
  detail: string;
  hash: string;
};

export type BacchusCellarResult = {
  runId: string;
  decision: BacchusCellarDecision;
  fitScore: number;
  confidence: number;
  accountName: string;
  accountType: string;
  lane: string;
  headline: string;
  brief: string;
  firstMove: string;
  metrics: BacchusCellarMetric[];
  signals: string[];
  placementPlan: BacchusCellarPlanItem[];
  trainingPacket: BacchusCellarPlanItem[];
  depletionPlan: BacchusCellarPlanItem[];
  refusals: BacchusCellarRefusal[];
  proofRows: BacchusCellarProofRow[];
  metadata: {
    engine_version: string;
    corpus_seal: string;
    input_hash: string;
    parsed_lines: number;
    generated_at: string;
    source_policy: string;
  };
};

const ENGINE_VERSION = "bacchus-cellar-intelligence-v0.1.0";
export const BACCHUS_CELLAR_CORPUS_SEAL = `sha256:${sha256([
  "premium-spirits-account-fit-v1",
  "hospitality-training-packet-v1",
  "depletion-cadence-v1",
  "compliance-refusal-boundary-v1",
].join("|"))}`;

const prestigeSignals = [
  "luxury",
  "fine dining",
  "steakhouse",
  "private club",
  "hotel",
  "resort",
  "omakase",
  "sommelier",
  "reserve",
  "cigar",
  "vip",
  "private dining",
  "corporate event",
  "tasting menu",
  "allocated",
  "boutique",
];

const programSignals = [
  "cocktail",
  "rum",
  "whiskey",
  "bourbon",
  "tequila",
  "spirits",
  "backbar",
  "beverage director",
  "bar manager",
  "staff education",
  "training",
  "tasting",
  "menu",
  "pairing",
];

const proofSignals = [
  "menu",
  "photo",
  "screenshot",
  "buyer notes",
  "meeting notes",
  "pos",
  "event calendar",
  "invoice",
  "depletion",
  "proof available",
];

const hardRiskSignals = [
  "underage",
  "minor",
  "unlicensed",
  "no license",
  "kickback",
  "under-the-table",
  "bribe",
  "hide",
  "illegal",
  "off book",
];

const softRiskSignals = [
  "free product",
  "free-goods",
  "free goods",
  "guaranteed sell-through",
  "guaranteed sales",
  "investment return",
  "health claim",
  "medical",
  "cure",
  "invented awards",
];

export function bacchusCellarManifest() {
  return {
    generated_by: "BACCHUS Cellar Intelligence",
    engine_version: ENGINE_VERSION,
    corpus_seal: BACCHUS_CELLAR_CORPUS_SEAL,
    route: "/api/bacchus/cellar/run",
    source_policy:
      "Customer-supplied account packets plus deterministic account-fit, training, depletion, and compliance-boundary rules. No live scraping and no guaranteed sell-through claims.",
    samples: BACCHUS_CELLAR_SAMPLES.map(({ id, label }) => ({ id, label })),
  };
}

export function runBacchusCellar(packet: string): BacchusCellarResult {
  const cleanPacket = packet.trim();
  const generatedAt = new Date().toISOString();
  const inputHash = sha256(cleanPacket || "empty-packet");
  const parsedLines = cleanPacket ? cleanPacket.split(/\r?\n/).filter((line) => line.trim()).length : 0;

  if (!cleanPacket) {
    return buildEmptyResult(inputHash, parsedLines, generatedAt);
  }

  const lower = normalize(cleanPacket);
  const accountName = parseField(cleanPacket, "Account") ?? firstMeaningfulLine(cleanPacket) ?? "Unnamed account";
  const accountType = inferAccountType(lower);
  const lane = inferLane(lower);
  const signals = uniq([
    ...matchedSignals(lower, prestigeSignals),
    ...matchedSignals(lower, programSignals),
    ...matchedSignals(lower, proofSignals),
  ]);

  const refusals = buildRefusals(lower, accountName, signals);
  const hardRefusal = refusals.some((refusal) => refusal.severity === "HARD");
  const score = hardRefusal ? Math.min(38, fitScore(lower, signals) - 32) : fitScore(lower, signals);
  const confidence = confidenceScore(cleanPacket, signals, refusals);
  const decision = decide(score, confidence, hardRefusal, refusals);
  const firstMove = firstMoveFor(decision, accountType, lane, lower);
  const placementPlan = buildPlacementPlan(accountType, lane, lower, decision);
  const trainingPacket = buildTrainingPacket(accountType, lane, lower, decision);
  const depletionPlan = buildDepletionPlan(score, lane, decision);
  const runId = `bacchus_cellar_${shortHash(`${accountName}:${inputHash}:${generatedAt}`)}`;

  return {
    runId,
    decision,
    fitScore: clamp(score, 0, 100),
    confidence,
    accountName,
    accountType,
    lane,
    headline: headlineFor(decision, accountName),
    brief: briefFor(decision, accountName, accountType, lane, score, signals, refusals),
    firstMove,
    metrics: buildMetrics(score, confidence, signals, refusals, accountType, lane),
    signals,
    placementPlan,
    trainingPacket,
    depletionPlan,
    refusals,
    proofRows: buildProofRows(runId, cleanPacket, accountName, accountType, lane, signals, refusals, decision),
    metadata: {
      engine_version: ENGINE_VERSION,
      corpus_seal: BACCHUS_CELLAR_CORPUS_SEAL,
      input_hash: inputHash,
      parsed_lines: parsedLines,
      generated_at: generatedAt,
      source_policy:
        "Account packet supplied by operator; BACCHUS computes fit, education, depletion, proof, and refusal boundaries deterministically.",
    },
  };
}

function buildEmptyResult(inputHash: string, parsedLines: number, generatedAt: string): BacchusCellarResult {
  const runId = `bacchus_cellar_${shortHash(`empty:${generatedAt}`)}`;
  const refusals: BacchusCellarRefusal[] = [{
    code: "BACCHUS-PACKET-001",
    severity: "HARD",
    message: "No account packet supplied.",
    remediation: "Paste the account name, type, buyer, current beverage program, distributor goal, and available proof.",
  }];

  return {
    runId,
    decision: "REFUSE",
    fitScore: 0,
    confidence: 0,
    accountName: "No packet",
    accountType: "Unresolved",
    lane: "Premium spirits",
    headline: "BACCHUS refused an empty account packet.",
    brief: "BACCHUS cannot score an account, generate a staff packet, or create a depletion plan without account evidence.",
    firstMove: "Attach a real account packet.",
    metrics: buildMetrics(0, 0, [], refusals, "Unresolved", "Premium spirits"),
    signals: [],
    placementPlan: [],
    trainingPacket: [],
    depletionPlan: [],
    refusals,
    proofRows: buildProofRows(runId, "", "No packet", "Unresolved", "Premium spirits", [], refusals, "REFUSE"),
    metadata: {
      engine_version: ENGINE_VERSION,
      corpus_seal: BACCHUS_CELLAR_CORPUS_SEAL,
      input_hash: inputHash,
      parsed_lines: parsedLines,
      generated_at: generatedAt,
      source_policy: "No customer packet supplied.",
    },
  };
}

function fitScore(lower: string, signals: string[]) {
  let score = 34;
  score += matchedSignals(lower, prestigeSignals).length * 5;
  score += matchedSignals(lower, programSignals).length * 3;
  score += matchedSignals(lower, proofSignals).length * 3;
  if (/\bbuyer\b|\bbeverage director\b|\bowner\b|\bgm\b|\bbar manager\b/.test(lower)) score += 8;
  if (/\bprivate dining\b|\bevent\b|\btasting\b|\btraining\b/.test(lower)) score += 8;
  if (/\brum\b/.test(lower)) score += 8;
  if (/\bno formal\b|\blimited\b|\bmissing\b|\bunknown\b/.test(lower)) score -= 5;
  if (/\bunknown\b/.test(lower)) score -= 8;
  if (signals.length < 5) score -= 10;
  return clamp(score, 0, 100);
}

function confidenceScore(packet: string, signals: string[], refusals: BacchusCellarRefusal[]) {
  let score = 38;
  if (/account:/i.test(packet)) score += 10;
  if (/city:/i.test(packet)) score += 8;
  if (/type:/i.test(packet)) score += 8;
  if (/buyer:/i.test(packet)) score += 10;
  if (/current program:/i.test(packet)) score += 10;
  if (/proof available:/i.test(packet)) score += 10;
  score += Math.min(10, signals.length);
  score -= refusals.filter((refusal) => refusal.severity === "HARD").length * 32;
  score -= refusals.filter((refusal) => refusal.severity === "SOFT").length * 8;
  return clamp(score, 0, 100);
}

function decide(score: number, confidence: number, hardRefusal: boolean, refusals: BacchusCellarRefusal[]): BacchusCellarDecision {
  if (hardRefusal) return "REFUSE";
  if (refusals.some((refusal) => refusal.severity === "SOFT") || confidence < 58) return "REVIEW";
  if (score >= 78 && confidence >= 72) return "PRIORITIZE";
  if (score >= 56) return "NURTURE";
  return "REVIEW";
}

function buildRefusals(lower: string, accountName: string, signals: string[]): BacchusCellarRefusal[] {
  const refusals: BacchusCellarRefusal[] = [];
  const hardHits = matchedSignals(lower, hardRiskSignals);
  const softHits = matchedSoftRiskSignals(lower);

  if (hardHits.length) {
    refusals.push({
      code: "BACCHUS-COMPLIANCE-001",
      severity: "HARD",
      message: `Account packet includes hard compliance risk signals: ${hardHits.join(", ")}.`,
      remediation: "Do not proceed. Require licensing proof, owner-approved documentation, and compliance review before any placement activity.",
    });
  }
  if (softHits.length) {
    refusals.push({
      code: "BACCHUS-CLAIMS-001",
      severity: "SOFT",
      message: `Packet includes claim or promotion language BACCHUS will not endorse: ${softHits.join(", ")}.`,
      remediation: "Rewrite the account plan around legal trade practice, education, service quality, and documented buyer demand.",
    });
  }
  if (accountName === "Unnamed account") {
    refusals.push({
      code: "BACCHUS-PROOF-001",
      severity: "SOFT",
      message: "Account identity is not explicit.",
      remediation: "Add a named account before routing this to a distributor rep or supplier principal.",
    });
  }
  if (!signals.some((signal) => proofSignals.includes(signal))) {
    refusals.push({
      code: "BACCHUS-PROOF-002",
      severity: "SOFT",
      message: "No account proof artifact is visible in the packet.",
      remediation: "Attach menu evidence, buyer notes, photos, POS category mix, or event calendar before prioritizing.",
    });
  }
  return refusals;
}

function buildMetrics(
  score: number,
  confidence: number,
  signals: string[],
  refusals: BacchusCellarRefusal[],
  accountType: string,
  lane: string,
): BacchusCellarMetric[] {
  return [
    {
      label: "Fit score",
      value: `${clamp(score, 0, 100)}/100`,
      tone: score >= 78 ? "success" : score >= 56 ? "warning" : "danger",
      detail: "Weighted prestige, buyer, program, proof, and risk signals.",
    },
    {
      label: "Confidence",
      value: `${confidence}/100`,
      tone: confidence >= 72 ? "success" : confidence >= 58 ? "warning" : "danger",
      detail: "Completeness of account packet and proof fields.",
    },
    {
      label: "Signals",
      value: String(signals.length),
      tone: signals.length >= 10 ? "success" : signals.length >= 5 ? "warning" : "danger",
      detail: "Matched account-fit and proof signals.",
    },
    {
      label: "Refusals",
      value: String(refusals.length),
      tone: refusals.some((refusal) => refusal.severity === "HARD") ? "danger" : refusals.length ? "warning" : "success",
      detail: "Compliance, proof, and claim boundaries emitted by BACCHUS.",
    },
    {
      label: "Account type",
      value: accountType,
      tone: "neutral",
      detail: "Deterministic type inferred from supplied packet.",
    },
    {
      label: "Lane",
      value: lane,
      tone: "neutral",
      detail: "Distributor program lane for the account plan.",
    },
  ];
}

function buildPlacementPlan(accountType: string, lane: string, lower: string, decision: BacchusCellarDecision): BacchusCellarPlanItem[] {
  if (decision === "REFUSE") {
    return [{ title: "No placement action", detail: "BACCHUS blocks placement until the hard compliance boundary is cleared with proof." }];
  }

  const plan: BacchusCellarPlanItem[] = [
    {
      title: "Anchor the serve",
      detail: lane.includes("rum")
        ? "Lead with one neat-pour ritual and one menu cocktail. Do not make the account choose between education and velocity."
        : "Lead with one premium serve, one education moment, and one reorder trigger tied to buyer behavior.",
    },
    {
      title: "Route by room",
      detail: accountType.includes("Hotel")
        ? "Split the plan across lobby bar, private dining, and corporate events so each room has a clean reason to carry the bottle."
        : accountType.includes("Retail")
          ? "Treat the shelf as a guided education surface: tasting card, staff script, and customer segment notes."
          : "Give the beverage lead a service path, the staff a script, and the owner a simple depletion readout.",
    },
    {
      title: "Make proof visible",
      detail: "Attach menu screenshots, backbar photos, buyer notes, and first-order assumptions before the rep asks for commitment.",
    },
  ];

  if (/\bprivate dining\b|\bevent\b|\btasting\b/.test(lower)) {
    plan.push({
      title: "Use the event wedge",
      detail: "Position the first order around a private tasting or dinner so the account sees staff competence and guest response in one controlled window.",
    });
  }

  return plan;
}

function buildTrainingPacket(accountType: string, lane: string, lower: string, decision: BacchusCellarDecision): BacchusCellarPlanItem[] {
  if (decision === "REFUSE") {
    return [{ title: "Training held", detail: "Do not train staff on a placement BACCHUS has refused. Clear proof and compliance first." }];
  }

  return [
    {
      title: "Thirty-second story",
      detail: lane.includes("rum")
        ? "Teach origin, age/style, flavor profile, and why it belongs beside whiskey and tequila without pretending it is either one."
        : "Teach origin, category, service temperature, glassware, and the account-specific reason this product is on the list.",
    },
    {
      title: "Serve spec",
      detail: "Document neat pour, cocktail build, garnish, glassware, price, and the words staff should avoid when a guest asks why it is premium.",
    },
    {
      title: "Objection handling",
      detail: accountType.includes("Retail")
        ? "Give staff three customer bridges: whiskey collector, tequila explorer, and gift buyer."
        : "Give servers three guest bridges: after-dinner pour, cocktail discovery, and private-room pairing.",
    },
    {
      title: "Manager check",
      detail: "Manager signs off only after staff can explain the product without unsupported awards, health claims, or guaranteed-demand language.",
    },
  ];
}

function buildDepletionPlan(score: number, lane: string, decision: BacchusCellarDecision): BacchusCellarPlanItem[] {
  if (decision === "REFUSE") {
    return [{ title: "No depletion cadence", detail: "No reorder or sell-through tracking starts until compliance proof exists." }];
  }

  const opening = score >= 78 ? "one case or controlled allocation" : score >= 56 ? "three to six bottles" : "sample-led follow-up only";
  const check = score >= 78 ? "14 days" : "21 days";

  return [
    {
      title: "Opening allocation",
      detail: `Start with ${opening}; BACCHUS will not recommend a larger push without proof of room velocity and staff adoption.`,
    },
    {
      title: "First check",
      detail: `Check depletion in ${check}. Compare bottles sold, staff mentions, menu placement, event usage, and buyer feedback.`,
    },
    {
      title: "Reorder trigger",
      detail: lane.includes("rum")
        ? "Reorder only when neat-pour adoption or cocktail velocity is visible in the account notes."
        : "Reorder only when the account can point to a documented buyer segment and actual pull-through.",
    },
    {
      title: "Supplier readout",
      detail: "Export a one-page packet with fit score, proof rows, first-order logic, and what changed since the last visit.",
    },
  ];
}

function firstMoveFor(decision: BacchusCellarDecision, accountType: string, lane: string, lower: string) {
  if (decision === "REFUSE") return "Stop placement activity and request compliance proof.";
  if (decision === "REVIEW") return "Tighten the account packet before pitching the buyer.";
  if (accountType.includes("Hotel")) return "Book a beverage-director tasting tied to lobby bar and private dining use cases.";
  if (accountType.includes("Retail")) return "Run a collector-facing tasting with staff scripts and shelf proof.";
  if (/\bprivate dining\b|\bevent\b|\btasting\b/.test(lower)) return "Use the next private event as the controlled placement wedge.";
  return lane.includes("rum")
    ? "Pitch the two-serve plan: neat ritual plus one account-specific cocktail."
    : "Pitch a small first allocation with staff education and a dated depletion check.";
}

function briefFor(
  decision: BacchusCellarDecision,
  accountName: string,
  accountType: string,
  lane: string,
  score: number,
  signals: string[],
  refusals: BacchusCellarRefusal[],
) {
  if (decision === "REFUSE") {
    return `${accountName} is blocked for ${lane.toLowerCase()} placement because the packet contains a hard compliance boundary. BACCHUS keeps the distributor out of the danger zone, preserves the evidence trail, and asks for proof before anyone spends relationship capital.`;
  }

  const signalText = signals.slice(0, 4).join(", ") || "thin account evidence";
  const refusalText = refusals.length ? " The run includes review boundaries that must be cleared before a supplier-facing packet goes out." : "";
  return `${accountName} reads as a ${accountType.toLowerCase()} fit for ${lane.toLowerCase()} work at ${clamp(score, 0, 100)}/100. The strongest signals are ${signalText}. BACCHUS recommends a controlled placement, staff education, and a dated depletion check instead of generic case pushing.${refusalText}`;
}

function headlineFor(decision: BacchusCellarDecision, accountName: string) {
  if (decision === "PRIORITIZE") return `${accountName} is a priority account.`;
  if (decision === "NURTURE") return `${accountName} is worth nurturing.`;
  if (decision === "REVIEW") return `${accountName} needs proof before push.`;
  return `${accountName} is refused until compliance clears.`;
}

function buildProofRows(
  runId: string,
  packet: string,
  accountName: string,
  accountType: string,
  lane: string,
  signals: string[],
  refusals: BacchusCellarRefusal[],
  decision: BacchusCellarDecision,
): BacchusCellarProofRow[] {
  const rows = [
    ["INPUT_PACKET", "operator_supplied", packet ? `${packet.length} chars parsed` : "empty packet"],
    ["CLASSIFY_ACCOUNT", "bacchus:rules", `${accountName} -> ${accountType}`],
    ["DETECT_LANE", "bacchus:rules", lane],
    ["SCORE_FIT", "bacchus:rules", `${signals.length} signal(s): ${signals.slice(0, 8).join(", ") || "none"}`],
    ["REFUSAL_GATE", "bacchus:rules", refusals.length ? refusals.map((item) => item.code).join(", ") : "no refusal emitted"],
    ["RELEASE_DECISION", "bacchus:rules", decision],
  ] as const;

  let prev = shortHash(runId);
  return rows.map(([id, source, detail]) => {
    const hash = shortHash(`${prev}:${id}:${source}:${detail}`);
    prev = hash;
    return { id, source, detail, hash };
  });
}

function parseField(packet: string, field: string) {
  const pattern = new RegExp(`^\\s*${field}\\s*:\\s*(.+)$`, "im");
  return packet.match(pattern)?.[1]?.trim();
}

function firstMeaningfulLine(packet: string) {
  return packet.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
}

function inferAccountType(lower: string) {
  if (/\bhotel\b|\bresort\b/.test(lower)) return "Hotel account";
  if (/\bretail\b|\bliquor store\b|\bshop\b/.test(lower)) return "Retail account";
  if (/\bprivate club\b|\bclub\b/.test(lower)) return "Private club account";
  if (/\bsteakhouse\b/.test(lower)) return "Steakhouse account";
  if (/\bbar\b|\bcocktail\b/.test(lower)) return "Bar account";
  if (/\brestaurant\b|\bfine dining\b/.test(lower)) return "Restaurant account";
  return "Hospitality account";
}

function inferLane(lower: string) {
  if (/\brum\b/.test(lower)) return "Premium rum";
  if (/\bwhiskey\b|\bbourbon\b/.test(lower)) return "Premium whiskey";
  if (/\btequila\b|\bmezcal\b/.test(lower)) return "Premium agave";
  if (/\bretail\b|\bshelf\b/.test(lower)) return "Premium spirits retail";
  return "Premium spirits";
}

function matchedSignals(lower: string, signals: readonly string[]) {
  return signals.filter((signal) => lower.includes(signal));
}

function matchedSoftRiskSignals(lower: string) {
  return softRiskSignals.filter((signal) => {
    const index = lower.indexOf(signal);
    if (index < 0) return false;
    const prefix = lower.slice(Math.max(0, index - 18), index);
    return !/\b(no|not|without)\s+(?:a\s+|any\s+|the\s+)?$/.test(prefix);
  });
}

function uniq(values: string[]) {
  return Array.from(new Set(values));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function shortHash(value: string) {
  return sha256(value).slice(0, 16);
}
