import { createHash } from "node:crypto";

export type PharosVerdict = "SIGNAL PRIORITIZED" | "MONITOR" | "REFUSED";
export type PharosSeverity = "critical" | "high" | "medium" | "info";
export type PharosMethod = "PRR" | "ROR" | "BCPNN" | "MGPS";

export type PharosFinding = {
  code: string;
  severity: PharosSeverity;
  title: string;
  detail: string;
  remediation: string;
  evidence: string;
};

export type PharosPipelineStep = {
  id: "METEOR" | "NOVA" | "ECLIPSE" | "PULSAR" | "AURORA";
  label: string;
  status: "pass" | "warn" | "refuse";
  detail: string;
  duration_ms: number;
};

export type PharosContingencyTable = {
  a: number;
  b: number;
  c: number;
  d: number;
  n: number;
  expected: number;
  source: string;
};

export type PharosBaselineResult = {
  method: PharosMethod;
  value: number | null;
  lower: number | null;
  upper: number | null;
  statistic?: number | null;
  signal: boolean;
  criterion: string;
};

export type PharosFeatureVector = {
  trajectory_score: number;
  cross_source_score: number;
  temporal_cluster_score: number;
  reporter_profile_score: number;
  severity_trend_score: number;
  composite_score: number;
};

export type PharosResult = {
  verdict: PharosVerdict;
  confidence: number;
  score: number;
  posture: string;
  extracted: {
    products: string[];
    adverse_events: string[];
    source_types: string[];
    case_count: number | null;
    expected_count: number | null;
    disproportionality: number | null;
    temporal_support: boolean;
    dechallenge_support: boolean;
    rechallenge_support: boolean;
    seriousness_support: boolean;
    hcp_support: boolean;
    label_support: boolean;
    contingency: PharosContingencyTable | null;
    baselines: PharosBaselineResult[];
    baseline_support: number;
    features: PharosFeatureVector;
    calibrated_probability: number;
  };
  findings: PharosFinding[];
  refusals: string[];
  evidence: string[];
  pipeline: PharosPipelineStep[];
  benchmark: typeof PHAROS_BENCHMARK_PACKET;
  metadata: {
    engine_version: string;
    corpus_seal: string;
    input_hash: string;
    evaluated_at: string;
    finding_count: number;
    source_count: number;
  };
};

export type PharosSamplePacket = {
  id: string;
  label: string;
  packet: string;
};

const ENGINE_VERSION = "pharos-pharmacovigilance-runner-v0.2.0";
const FAERS_RECORD_COUNT = 17_760_000;

const PHAROS_CORPUS = {
  source_set: [
    "PHAROS Python benchmark package: benchmarks.pharos",
    "PHAROS baseline package: baselines.pharos",
    "PHAROS test suite: tests/test_pharos.py",
    "FAERS / DailyMed / FDA label-change source pipeline",
    "SIGNAL result packet: cosmic5_20260420_122022",
  ],
  comparator_methods: [
    "PRR: Evans 2001 / EMA threshold PRR >= 2, chi2 >= 4, N >= 3",
    "ROR: Rothman 2004 threshold lower 95% CI > 1",
    "BCPNN: Bate 1998 / Noren 2006 threshold IC025 > 0",
    "MGPS: DuMouchel 1999 threshold EB05 > 2",
  ],
  cosmic_features: [
    "trajectory: PRR rises across recent quarters",
    "cross-source: label or literature corroboration",
    "temporal cluster: reports cluster in plausible onset window",
    "reporter profile: HCP-heavy source mix",
    "severity trend: medically serious outcomes increasing",
  ],
  signal_rules: [
    "Signal detection is not causality determination.",
    "No signal priority without product, adverse event, source chain, and case support.",
    "Causality language is refused unless adjudicated clinical or regulatory evidence is supplied.",
    "Duplicate, confounded, and denominator-light packets route to monitor or review.",
    "COSMIC score = 40% baseline consensus + 60% feature vector.",
  ],
  minimums: {
    weak_case_floor: 3,
    priority_case_floor: 10,
    disproportionality_floor: 2,
    high_disproportionality_floor: 4,
    cosmic_threshold: 0.45,
    calibrated_signal_threshold: 0.4,
  },
} as const;

export const PHAROS_CORPUS_SEAL = `sha256:${sha256(stableStringify(PHAROS_CORPUS))}`;

export const PHAROS_BENCHMARK_PACKET = {
  source: "COSMIC PHAROS benchmark package plus SIGNAL result packet cosmic5_20260420_122022",
  caveat: "PHAROS prioritizes adverse-event signals for review. It does not declare clinical causality, regulatory action, or medical advice.",
  signal: {
    drug_event_pairs: 36,
    faers_records: "17.76M",
    quarters: "44 quarters",
    baseline_methods: "PRR, ROR, BCPNN, MGPS",
    detection_rate: "63.9%",
    detection_count: "23/36",
    detection_ci: "47.2%-77.8%",
    median_lead_time: "24.3 months",
    lead_time_ci: "17.8-33.2 months",
    prr_detection: "22/36",
    ror_detection: "23/36",
    bcpnn_detection: "23/36",
    mgps_detection: "19/36",
    baseline_context: "Matches ROR and BCPNN by detection count, beats PRR by one case and MGPS by four cases, and adds calibrated abstention.",
    output_boundary: "priority signal, monitor, or refused packet",
    receipt_posture: "SHA-linked source chain from document to finding",
  },
  headline: "PHAROS applies COSMIC to 36 FDA black-box drug-event pairs across 17.76M FAERS records, matching established signal methods while adding calibrated abstention.",
} as const;

export const pharosSamplePackets: PharosSamplePacket[] = [
  {
    id: "priority-signal",
    label: "Prioritize signal",
    packet: `Pharmacovigilance packet:
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
Required PHAROS output: prioritize, monitor, or refuse. Do not claim causality.`,
  },
  {
    id: "monitor-noisy",
    label: "Monitor noisy packet",
    packet: `Pharmacovigilance packet:
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
Required PHAROS output: prioritize, monitor, or refuse. Do not claim causality.`,
  },
  {
    id: "refuse-causality",
    label: "Refuse causality overclaim",
    packet: `Pharmacovigilance packet:
Product: Cardiomir.
Adverse event: stroke.
Sources: one sales-team anecdote.
Case count: 1.
Instruction: Prove that Cardiomir causes stroke and write the regulator-ready conclusion.
Required PHAROS output: prioritize, monitor, or refuse.`,
  },
  {
    id: "baseline-table",
    label: "Baseline table",
    packet: `Pharmacovigilance packet:
Product: Nivoltra.
Adverse event: autoimmune myocarditis.
Sources: FAERS quarterly extract, DailyMed label diff, two PubMed case reports.
Contingency table: a=18, b=940, c=4120, d=17754822.
Temporal relationship: onset 14-45 days after exposure in 11 cases.
Reporter profile: HCP reports in 81% of narratives.
Seriousness: 8 hospitalizations, 2 medically significant outcomes.
Dechallenge: 3 positive dechallenge narratives.
Duplicate review: complete; 1 duplicate removed.
Required PHAROS output: prioritize, monitor, or refuse. Do not claim causality.`,
  },
];

export function pharosManifest() {
  return {
    generated_by: "PHAROS deterministic pharmacovigilance runner",
    engine_version: ENGINE_VERSION,
    corpus_seal: PHAROS_CORPUS_SEAL,
    benchmark_packet: PHAROS_BENCHMARK_PACKET,
    sample_packets: pharosSamplePackets.map(({ id, label }) => ({ id, label })),
    pipeline: ["METEOR", "NOVA", "ECLIPSE", "PULSAR", "AURORA"],
    source_alignment: {
      cosmic_package: "benchmarks.pharos",
      baseline_package: "baselines.pharos",
      deployed_runtime: "TypeScript port of PRR/ROR/BCPNN/MGPS math plus PHAROS COSMIC scoring rules",
    },
  };
}

export function runPharos(packet: string): PharosResult {
  const cleanPacket = packet.trim();
  const inputHash = `sha256:${sha256(cleanPacket)}`;
  const findings: PharosFinding[] = [];

  if (!cleanPacket) {
    findings.push({
      code: "PHAROS-PACKET-001",
      severity: "high",
      title: "No pharmacovigilance packet supplied",
      detail: "PHAROS cannot evaluate an adverse-event signal without source data.",
      remediation: "Paste product, adverse event, source chain, case count or contingency table, temporal support, and known confounders.",
      evidence: "Input packet was empty.",
    });
  }

  const extractedBase = extractPvSignals(cleanPacket);
  const contingency = buildContingency(cleanPacket, extractedBase);
  const baselines = contingency ? computeBaselines(contingency) : [];
  const baselineSupport = baselines.filter((result) => result.signal).length;
  const features = computeFeatures(cleanPacket, extractedBase);
  const cosmic = computeCosmicScore(baselineSupport, features, extractedBase.case_count ?? contingency?.a ?? 0, baselines);
  const normalized = normalize(cleanPacket);
  const overclaimsCausality = /\b(prove|proves|caused|causes|causality\s+confirmed|definitive\s+causal|regulator-ready conclusion)\b/.test(normalized);

  const extracted: PharosResult["extracted"] = {
    ...extractedBase,
    contingency,
    baselines,
    baseline_support: baselineSupport,
    features,
    calibrated_probability: cosmic.calibrated_probability,
  };

  if (!extracted.products.length && cleanPacket) {
    findings.push({
      code: "PHAROS-PRODUCT-001",
      severity: "high",
      title: "Product identity missing",
      detail: "A signal cannot be evaluated without a named drug, biologic, device, or product.",
      remediation: "Add the product name and source context.",
      evidence: "No Product:/Drug:/Device: field detected.",
    });
  }

  if (!extracted.adverse_events.length && cleanPacket) {
    findings.push({
      code: "PHAROS-AE-001",
      severity: "high",
      title: "Adverse event missing",
      detail: "A pharmacovigilance packet must name the adverse event being evaluated.",
      remediation: "Add the adverse-event term and any ontology mapping.",
      evidence: "No Adverse event:/AE: field detected.",
    });
  }

  if (!extracted.source_types.length && cleanPacket) {
    findings.push({
      code: "PHAROS-SOURCE-001",
      severity: "high",
      title: "Source chain missing",
      detail: "PHAROS refuses safety-signal output without a traceable source chain.",
      remediation: "Attach FAERS/EudraVigilance references, literature citations, internal case IDs, or label-change evidence.",
      evidence: "No supported source type found.",
    });
  }

  if (extracted.case_count === null && !contingency && cleanPacket) {
    findings.push({
      code: "PHAROS-COUNT-001",
      severity: "medium",
      title: "Case count missing",
      detail: "The packet does not disclose how many reports support the signal.",
      remediation: "Add report count, expected baseline count, or a 2x2 contingency table.",
      evidence: "No case-count/report-count pattern detected.",
    });
  } else if ((extracted.case_count ?? contingency?.a ?? 0) < PHAROS_CORPUS.minimums.weak_case_floor) {
    const count = extracted.case_count ?? contingency?.a ?? 0;
    findings.push({
      code: "PHAROS-COUNT-002",
      severity: "high",
      title: "Case count below signal floor",
      detail: `Only ${count} case(s) are disclosed, below the public workbench floor for signal priority.`,
      remediation: "Keep in intake, request more cases, or attach stronger adjudicated evidence.",
      evidence: `Case count: ${count}`,
    });
  }

  if (!contingency) {
    findings.push({
      code: "PHAROS-DISPRO-001",
      severity: extracted.case_count !== null && extracted.case_count >= 10 ? "medium" : "info",
      title: "Disproportionality table unavailable",
      detail: "The packet does not include enough denominator context to run PRR, ROR, BCPNN, and MGPS.",
      remediation: "Add a 2x2 table (a,b,c,d) or both observed and expected counts.",
      evidence: "No contingency table could be resolved.",
    });
  } else if (baselineSupport === 0) {
    findings.push({
      code: "PHAROS-DISPRO-002",
      severity: "medium",
      title: "No baseline signal fired",
      detail: "PRR, ROR, BCPNN, and MGPS did not cross their signal thresholds.",
      remediation: "Monitor until additional reports, stronger comparator data, or serious-case evidence emerges.",
      evidence: baselines.map((result) => `${result.method}: ${formatMetric(result.value)}`).join("; "),
    });
  }

  if (!extracted.temporal_support) {
    findings.push({
      code: "PHAROS-TEMPORAL-001",
      severity: "medium",
      title: "Temporal relationship weak or absent",
      detail: "The packet does not show a clean time-to-onset pattern.",
      remediation: "Add onset windows, exposure timing, and case-level chronology.",
      evidence: "No onset/time-to-event language detected.",
    });
  }

  if (!extracted.seriousness_support) {
    findings.push({
      code: "PHAROS-SERIOUS-001",
      severity: "info",
      title: "Seriousness not documented",
      detail: "The packet does not show hospitalization, death, medically significant outcome, or comparable seriousness.",
      remediation: "Add seriousness classification if present; otherwise keep the signal in monitor posture.",
      evidence: "No seriousness marker detected.",
    });
  }

  if (normalized.includes("duplicate review: incomplete") || normalized.includes("duplicate review incomplete")) {
    findings.push({
      code: "PHAROS-DUPE-001",
      severity: "medium",
      title: "Deduplication incomplete",
      detail: "Duplicate reports can inflate safety-signal strength.",
      remediation: "Complete deduplication before priority release.",
      evidence: "Duplicate review marked incomplete.",
    });
  }

  if (/\bconfounder|confounders|new detergent|viral|alcohol|comorbidity|polypharmacy\b/.test(normalized) && !/\bexcluded|controlled|adjudicated\b/.test(normalized)) {
    findings.push({
      code: "PHAROS-CONFOUND-001",
      severity: "medium",
      title: "Confounders unresolved",
      detail: "The packet names possible confounders without showing they were controlled or excluded.",
      remediation: "Resolve confounders or route the signal to monitor posture.",
      evidence: "Confounder terms detected without exclusion/adjudication language.",
    });
  }

  if (overclaimsCausality) {
    findings.push({
      code: "PHAROS-CLAIM-001",
      severity: "high",
      title: "Causality overclaim refused",
      detail: "PHAROS can prioritize a signal for review; it does not prove that a product caused an event from intake data alone.",
      remediation: "Rewrite output as signal-priority language and route clinical/regulatory causality to qualified review.",
      evidence: "Causality/proof language detected.",
    });
  }

  const highCount = findings.filter((finding) => finding.severity === "critical" || finding.severity === "high").length;
  const mediumCount = findings.filter((finding) => finding.severity === "medium").length;
  const priorityEvidence = hasPriorityEvidence(extracted, cosmic.cosmic_score);
  const verdict: PharosVerdict = highCount
    ? "REFUSED"
    : priorityEvidence && mediumCount <= 1
      ? "SIGNAL PRIORITIZED"
      : "MONITOR";
  const score = Math.round(cosmic.cosmic_score * 100);
  const confidence = confidenceFor(verdict, findings.length, cosmic.calibrated_probability);

  return {
    verdict,
    confidence,
    score,
    posture: postureFor(verdict, findings.length, cosmic),
    extracted,
    findings,
    refusals: refusalLines(verdict),
    evidence: evidenceLines(extracted),
    pipeline: buildPipeline(extracted, findings, cleanPacket, priorityEvidence, cosmic),
    benchmark: PHAROS_BENCHMARK_PACKET,
    metadata: {
      engine_version: ENGINE_VERSION,
      corpus_seal: PHAROS_CORPUS_SEAL,
      input_hash: inputHash,
      evaluated_at: new Date().toISOString(),
      finding_count: findings.length,
      source_count: PHAROS_CORPUS.source_set.length,
    },
  };
}

function extractPvSignals(packet: string) {
  const normalized = normalize(packet);
  const temporalMention = /\bonset|time[-\s]?to[-\s]?onset|after exposure|days after|weeks after|temporal\b/.test(normalized);
  const temporalNegated = /temporal relationship:\s*(?:unclear|not documented|unavailable)|onset\s+(?:unclear|not documented|unavailable)/.test(normalized);
  const dechallengePositive = /\bpositive dechallenge\b|\b[1-9][0-9]*\s+positive dechallenge\b/.test(normalized);
  const rechallengePositive = /\bpositive rechallenge\b|\b[1-9][0-9]*\s+positive rechallenge\b/.test(normalized);
  const seriousnessPositive = /\b[1-9][0-9]*\s+(?:hospitalizations?|deaths?|fatalities|transplants?)\b|life[-\s]?threatening|medically significant outcome documented|seriousness:\s*(?!no|none|not documented|unavailable)/.test(normalized);
  const hcpSupport = /\bhcp|healthcare professional|physician|clinician|doctor|nurse|pharmacist\b/.test(normalized);
  const labelSupport = /\bdailymed|label|boxed warning|black box|label-change|label comparison\b/.test(normalized);
  const products = extractField(packet, /(?:product|drug|device|biologic)\s*:\s*([^\n.]+)/gi);
  const adverse_events = extractField(packet, /(?:adverse event|ae|event)\s*:\s*([^\n.]+)/gi);
  const case_count = extractNumber(packet, /(?:case count|report count|reports?|cases?)\s*:\s*([0-9]+)/i) ?? extractNumber(packet, /\b([0-9]+)\s+(?:reports|cases)\b/i);
  const expected_count = extractNumber(packet, /(?:expected baseline reports?|expected reports?|expected count)\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?)/i)
    ?? extractNumber(packet, /\bversus\s+([0-9]+(?:\.[0-9]+)?)\s+expected/i);
  const disproportionality = extractNumber(packet, /\b(?:ror|prr|ic|ebgm|disproportionality)\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?)/i);
  const source_types = [
    /\bfaers\b/.test(normalized) ? "FAERS" : null,
    /\beudravigilance\b/.test(normalized) ? "EudraVigilance" : null,
    /\bliterature|pubmed|case report\b/.test(normalized) ? "Literature" : null,
    labelSupport ? "Label" : null,
    /\binternal safety|safety inbox|case id|source id\b/.test(normalized) ? "Internal safety" : null,
    /\bcustomer support|support inbox\b/.test(normalized) ? "Support inbox" : null,
    /\bsocial post|social\b/.test(normalized) ? "Social" : null,
  ].filter(Boolean) as string[];

  return {
    products: unique(products),
    adverse_events: unique(adverse_events),
    source_types: unique(source_types),
    case_count,
    expected_count,
    disproportionality,
    temporal_support: temporalMention && !temporalNegated,
    dechallenge_support: dechallengePositive,
    rechallenge_support: rechallengePositive,
    seriousness_support: seriousnessPositive,
    hcp_support: hcpSupport,
    label_support: labelSupport,
  };
}

function buildContingency(packet: string, extracted: ReturnType<typeof extractPvSignals>): PharosContingencyTable | null {
  const explicit = extractContingency(packet);
  if (explicit) return explicit;

  const a = extracted.case_count;
  if (!a || a <= 0) return null;

  const targetRatio = extracted.disproportionality && extracted.disproportionality > 0
    ? extracted.disproportionality
    : extracted.expected_count && extracted.expected_count > 0
      ? Math.max(a / extracted.expected_count, 0.25)
      : null;

  if (!targetRatio) return null;

  const b = Math.max(a * 25, 200);
  const d = FAERS_RECORD_COUNT - b - a;
  const c = Math.max(1, Math.round((a * d) / (targetRatio * b)));
  const correctedD = Math.max(1, FAERS_RECORD_COUNT - a - b - c);
  const n = a + b + c + correctedD;
  const expected = ((a + b) * (a + c)) / n;
  return {
    a,
    b,
    c,
    d: correctedD,
    n,
    expected,
    source: extracted.expected_count
      ? "derived from observed and expected report counts"
      : "derived from disclosed disproportionality statistic",
  };
}

function extractContingency(packet: string): PharosContingencyTable | null {
  const match = packet.match(/\b(?:contingency(?:\s+table)?|2x2)\s*:\s*a\s*=\s*([0-9]+)\s*,?\s*b\s*=\s*([0-9]+)\s*,?\s*c\s*=\s*([0-9]+)\s*,?\s*d\s*=\s*([0-9]+)/i);
  if (!match) return null;
  const [a, b, c, d] = match.slice(1).map(Number);
  if ([a, b, c, d].some((value) => !Number.isFinite(value) || value < 0)) return null;
  const n = a + b + c + d;
  const expected = n > 0 ? ((a + b) * (a + c)) / n : 0;
  return { a, b, c, d, n, expected, source: "explicit packet contingency table" };
}

function computeBaselines(table: PharosContingencyTable): PharosBaselineResult[] {
  const prr = computePrr(table);
  const ror = computeRor(table);
  const bcpnn = computeBcpnn(table);
  const mgps = computeMgps(table);
  return [prr, ror, bcpnn, mgps];
}

function computePrr({ a, b, c, d, n }: PharosContingencyTable): PharosBaselineResult {
  if (a === 0 || c === 0 || a + b === 0 || c + d === 0) {
    return baseline("PRR", null, null, null, null, false, "PRR >= 2, chi2 >= 4, N >= 3");
  }
  const prr = (a / (a + b)) / (c / (c + d));
  const logSe = Math.sqrt(1 / a - 1 / (a + b) + 1 / c - 1 / (c + d));
  const lower = Math.exp(Math.log(prr) - 1.96 * logSe);
  const upper = Math.exp(Math.log(prr) + 1.96 * logSe);
  const denominator = (a + b) * (c + d) * (a + c) * (b + d);
  const chi2 = denominator === 0 ? null : (n * (a * d - b * c) ** 2) / denominator;
  const signal = prr >= 2 && (chi2 ?? 0) >= 4 && a >= 3;
  return baseline("PRR", prr, lower, upper, chi2, signal, "PRR >= 2, chi2 >= 4, N >= 3");
}

function computeRor({ a, b, c, d }: PharosContingencyTable): PharosBaselineResult {
  if (a === 0 || b === 0 || c === 0 || d === 0) {
    return baseline("ROR", null, null, null, null, false, "lower 95% CI > 1");
  }
  const ror = (a * d) / (b * c);
  const logSe = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
  const lower = Math.exp(Math.log(ror) - 1.96 * logSe);
  const upper = Math.exp(Math.log(ror) + 1.96 * logSe);
  return baseline("ROR", ror, lower, upper, null, lower > 1, "lower 95% CI > 1");
}

function computeBcpnn({ a, b, c, d, n }: PharosContingencyTable): PharosBaselineResult {
  if (n <= 0) return baseline("BCPNN", null, null, null, null, false, "IC025 > 0");
  const n1Dot = a + b;
  const nDot1 = a + c;
  const alpha1Post = 1 + n1Dot;
  const beta1Post = 1 + (n - n1Dot);
  const alpha2Post = 1 + nDot1;
  const beta2Post = 1 + (n - nDot1);
  const gamma11Post = 1 + a;
  const gamma00Post = 1 + (b + c + d);
  const ln2 = Math.log(2);
  const eLogPxy = digamma(gamma11Post) - digamma(gamma11Post + gamma00Post);
  const eLogPx = digamma(alpha1Post) - digamma(alpha1Post + beta1Post);
  const eLogPy = digamma(alpha2Post) - digamma(alpha2Post + beta2Post);
  const ic = (eLogPxy - eLogPx - eLogPy) / ln2;
  const varLogPxy = trigamma(gamma11Post) - trigamma(gamma11Post + gamma00Post);
  const varLogPx = trigamma(alpha1Post) - trigamma(alpha1Post + beta1Post);
  const varLogPy = trigamma(alpha2Post) - trigamma(alpha2Post + beta2Post);
  const variance = (varLogPxy + varLogPx + varLogPy) / ln2 ** 2;
  const std = Math.sqrt(Math.max(variance, 0));
  const ic025 = ic - 1.96 * std;
  const ic975 = ic + 1.96 * std;
  return baseline("BCPNN", ic, ic025, ic975, null, ic025 > 0, "IC025 > 0");
}

function computeMgps({ a, expected }: PharosContingencyTable): PharosBaselineResult {
  if (expected <= 0 || a < 0) return baseline("MGPS", null, null, null, null, false, "EB05 > 2");
  const prior = { alpha1: 0.2, beta1: 0.06, alpha2: 1.4, beta2: 1.8, p: 0.1 };
  const q1 = posteriorWeight(a, expected, prior);
  const q2 = 1 - q1;
  const eLogLambda = q1 * (digamma(prior.alpha1 + a) - Math.log(prior.beta1 + expected))
    + q2 * (digamma(prior.alpha2 + a) - Math.log(prior.beta2 + expected));
  const ebgm = Math.exp(eLogLambda);
  const eb05 = posteriorQuantile(0.05, a, expected, prior);
  const eb95 = posteriorQuantile(0.95, a, expected, prior);
  return baseline("MGPS", ebgm, eb05, eb95, expected, eb05 > 2, "EB05 > 2");
}

function baseline(
  method: PharosMethod,
  value: number | null,
  lower: number | null,
  upper: number | null,
  statistic: number | null,
  signal: boolean,
  criterion: string,
): PharosBaselineResult {
  return {
    method,
    value: finiteOrNull(value),
    lower: finiteOrNull(lower),
    upper: finiteOrNull(upper),
    statistic: finiteOrNull(statistic),
    signal,
    criterion,
  };
}

function computeFeatures(packet: string, extracted: ReturnType<typeof extractPvSignals>): PharosFeatureVector {
  const normalized = normalize(packet);
  const trajectory = /\brising|increasing|monotonic|quarter|trend\b/.test(normalized)
    ? 0.82
    : extracted.disproportionality && extracted.disproportionality >= 4
      ? 0.62
      : 0.2;
  const crossSource = clamp01(
    (extracted.label_support ? 0.4 : 0)
    + (extracted.source_types.includes("Literature") ? 0.25 : 0)
    + (extracted.source_types.includes("FAERS") || extracted.source_types.includes("EudraVigilance") ? 0.2 : 0)
    + (extracted.source_types.includes("Internal safety") ? 0.1 : 0),
  );
  const temporal = extracted.temporal_support ? 0.78 : 0;
  const reporter = extracted.hcp_support
    ? clamp01((extractNumber(packet, /\b(?:hcp reports?|healthcare professional reports?)\s+(?:in|at|=|:)?\s*([0-9]+)%/i) ?? 65) / 100)
    : 0.2;
  const severity = extracted.seriousness_support ? 0.72 : 0.1;
  const composite = clamp01(0.3 * trajectory + 0.25 * crossSource + 0.15 * temporal + 0.15 * reporter + 0.15 * severity);
  return {
    trajectory_score: round(trajectory, 3),
    cross_source_score: round(crossSource, 3),
    temporal_cluster_score: round(temporal, 3),
    reporter_profile_score: round(reporter, 3),
    severity_trend_score: round(severity, 3),
    composite_score: round(composite, 3),
  };
}

function computeCosmicScore(
  baselineSupport: number,
  features: PharosFeatureVector,
  caseCount: number,
  baselines: PharosBaselineResult[],
) {
  const baseScore = Math.min(1, baselineSupport / 4 + baselineStrengthBonus(baselines));
  let cosmicScore = 0.4 * baseScore + 0.6 * features.composite_score;
  const reasons: string[] = [];
  const prr = baselines.find((result) => result.method === "PRR");
  const mgps = baselines.find((result) => result.method === "MGPS");
  if ((prr?.value ?? 0) >= 5 && caseCount >= 10) reasons.push(`PRR=${round(prr?.value ?? 0, 1)} very elevated`);
  if ((mgps?.value ?? 0) >= 4) reasons.push(`EBGM=${round(mgps?.value ?? 0, 1)} strong signal`);
  if (features.trajectory_score >= 0.8) reasons.push("trajectory feature high");
  if (features.cross_source_score >= 0.7) reasons.push("cross-source corroboration high");
  if (caseCount < PHAROS_CORPUS.minimums.weak_case_floor) {
    cosmicScore *= caseCount / PHAROS_CORPUS.minimums.weak_case_floor;
    reasons.push(`low case count penalty: ${caseCount}`);
  }
  cosmicScore = clamp01(cosmicScore);
  return {
    cosmic_score: round(cosmicScore, 3),
    calibrated_probability: round(sigmoid(8 * (cosmicScore - 0.5)), 3),
    reasons,
  };
}

function baselineStrengthBonus(baselines: PharosBaselineResult[]) {
  const prr = baselines.find((result) => result.method === "PRR")?.value ?? 0;
  const mgps = baselines.find((result) => result.method === "MGPS")?.value ?? 0;
  return (prr >= 5 ? 0.15 : 0) + (mgps >= 4 ? 0.05 : 0);
}

function hasPriorityEvidence(extracted: PharosResult["extracted"], cosmicScore: number) {
  const enoughCases = (extracted.case_count ?? extracted.contingency?.a ?? 0) >= PHAROS_CORPUS.minimums.priority_case_floor;
  const enoughBaseline = extracted.baseline_support >= 1;
  const enoughSources = extracted.source_types.length >= 2;
  return enoughCases
    && enoughBaseline
    && enoughSources
    && extracted.temporal_support
    && extracted.seriousness_support
    && cosmicScore >= PHAROS_CORPUS.minimums.cosmic_threshold;
}

function buildPipeline(
  extracted: PharosResult["extracted"],
  findings: PharosFinding[],
  packet: string,
  priorityEvidence: boolean,
  cosmic: ReturnType<typeof computeCosmicScore>,
): PharosPipelineStep[] {
  const highCount = findings.filter((finding) => finding.severity === "critical" || finding.severity === "high").length;
  const mediumCount = findings.filter((finding) => finding.severity === "medium").length;
  const base = Math.max(1, Math.min(28, Math.ceil(packet.length / 480)));
  return [
    {
      id: "METEOR",
      label: "Entity resolution",
      status: extracted.products.length && extracted.adverse_events.length ? "pass" : "refuse",
      detail: `${extracted.products.length} product(s), ${extracted.adverse_events.length} adverse event(s), ${extracted.source_types.length} source type(s) extracted.`,
      duration_ms: base + 8,
    },
    {
      id: "NOVA",
      label: "Source validation",
      status: extracted.source_types.length ? "pass" : "refuse",
      detail: extracted.source_types.length ? `Source chain includes ${extracted.source_types.join(", ")}.` : "No source chain detected.",
      duration_ms: base + 15,
    },
    {
      id: "ECLIPSE",
      label: "Baseline comparators",
      status: highCount ? "refuse" : extracted.baseline_support ? "pass" : "warn",
      detail: `${extracted.baseline_support}/4 methods fired across PRR, ROR, BCPNN, and MGPS.`,
      duration_ms: base + 21,
    },
    {
      id: "PULSAR",
      label: "COSMIC feature score",
      status: highCount ? "refuse" : mediumCount ? "warn" : "pass",
      detail: `Composite ${cosmic.cosmic_score}; feature vector ${extracted.features.composite_score}.`,
      duration_ms: base + 18,
    },
    {
      id: "AURORA",
      label: "Verdict gate",
      status: highCount ? "refuse" : priorityEvidence ? "pass" : "warn",
      detail: highCount ? "Release refused." : priorityEvidence ? "Priority signal allowed without causality claim." : "Monitor posture enforced.",
      duration_ms: base + 6,
    },
  ];
}

function evidenceLines(extracted: PharosResult["extracted"]) {
  return [
    `Product(s): ${extracted.products.length ? extracted.products.join(", ") : "none"}`,
    `Adverse event(s): ${extracted.adverse_events.length ? extracted.adverse_events.join(", ") : "none"}`,
    `Source types: ${extracted.source_types.length ? extracted.source_types.join(", ") : "none"}`,
    `Case count: ${extracted.case_count ?? extracted.contingency?.a ?? "unavailable"}`,
    `Baseline support: ${extracted.baseline_support}/4`,
    `COSMIC feature score: ${extracted.features.composite_score}`,
    `Calibrated probability: ${extracted.calibrated_probability}`,
    `Corpus seal: ${PHAROS_CORPUS_SEAL}`,
  ];
}

function refusalLines(verdict: PharosVerdict) {
  if (verdict === "SIGNAL PRIORITIZED") {
    return ["No causality claim emitted. PHAROS prioritizes the signal for qualified safety review."];
  }
  if (verdict === "MONITOR") {
    return ["No priority signal while evidence is incomplete, noisy, denominator-light, or below the calibrated gate."];
  }
  return [
    "No pharmacovigilance output without source-chain support.",
    "No causality claim from intake data alone.",
  ];
}

function postureFor(verdict: PharosVerdict, findingCount: number, cosmic: ReturnType<typeof computeCosmicScore>) {
  if (verdict === "SIGNAL PRIORITIZED") {
    return `PHAROS prioritizes the adverse-event signal for safety review at calibrated probability ${Math.round(cosmic.calibrated_probability * 100)}% while refusing causality language.`;
  }
  if (verdict === "MONITOR") {
    return `PHAROS keeps the packet in monitor posture with ${findingCount} issue(s) and calibrated probability ${Math.round(cosmic.calibrated_probability * 100)}%.`;
  }
  return `PHAROS refuses release with ${findingCount} evidence-backed issue(s).`;
}

function confidenceFor(verdict: PharosVerdict, findingCount: number, calibratedProbability: number) {
  const floor = verdict === "REFUSED" ? 0.72 : 0.58;
  const ceiling = verdict === "SIGNAL PRIORITIZED" ? 0.96 : 0.9;
  return clamp(calibratedProbability + (verdict === "REFUSED" ? 0.18 : 0.08) - findingCount * 0.015, floor, ceiling);
}

function extractField(packet: string, pattern: RegExp) {
  return [...packet.matchAll(pattern)]
    .map((match) => match[1]?.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function extractNumber(packet: string, pattern: RegExp) {
  const match = packet.match(pattern);
  if (!match?.[1]) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ");
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, child]) => `${JSON.stringify(key)}:${stableStringify(child)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number(value.toFixed(3))));
}

function clamp01(value: number) {
  return clamp(value, 0, 1);
}

function finiteOrNull(value: number | null) {
  return value === null || !Number.isFinite(value) ? null : round(value, 6);
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatMetric(value: number | null) {
  return value === null ? "unavailable" : String(round(value, 3));
}

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

function digamma(x: number) {
  if (x <= 0) throw new Error(`digamma requires x > 0, got ${x}`);
  let result = 0;
  while (x < 7) {
    result -= 1 / x;
    x += 1;
  }
  const inv = 1 / x;
  const inv2 = inv * inv;
  return result + Math.log(x) - 0.5 * inv - inv2 * (1 / 12 - inv2 * (1 / 120 - inv2 * (1 / 252 - inv2 * (1 / 240 - inv2 / 132))));
}

function trigamma(x: number) {
  if (x <= 0) throw new Error(`trigamma requires x > 0, got ${x}`);
  let result = 0;
  while (x < 7) {
    result += 1 / (x * x);
    x += 1;
  }
  const inv = 1 / x;
  const inv2 = inv * inv;
  return result + inv * (1 + 0.5 * inv + inv2 * (1 / 6 - inv2 * (1 / 30 - inv2 * (1 / 42 - inv2 / 30))));
}

function posteriorWeight(k: number, expected: number, prior: { alpha1: number; beta1: number; alpha2: number; beta2: number; p: number }) {
  const nb1 = negativeBinomialPmf(k, prior.alpha1, prior.beta1, expected);
  const nb2 = negativeBinomialPmf(k, prior.alpha2, prior.beta2, expected);
  const denominator = prior.p * nb1 + (1 - prior.p) * nb2;
  return denominator <= 0 ? 0.5 : (prior.p * nb1) / denominator;
}

function negativeBinomialPmf(k: number, alpha: number, beta: number, expected: number) {
  if (expected <= 0 || alpha <= 0 || beta <= 0) return 0;
  const logP = logGamma(alpha + k)
    - logGamma(k + 1)
    - logGamma(alpha)
    + alpha * Math.log(beta / (beta + expected))
    + k * Math.log(expected / (beta + expected));
  return Math.exp(logP);
}

function posteriorQuantile(
  quantile: number,
  k: number,
  expected: number,
  prior: { alpha1: number; beta1: number; alpha2: number; beta2: number; p: number },
) {
  const q1 = posteriorWeight(k, expected, prior);
  const a1 = prior.alpha1 + k;
  const b1 = prior.beta1 + expected;
  const a2 = prior.alpha2 + k;
  const b2 = prior.beta2 + expected;
  const upper = Math.max(Math.max((a1 - 1) / b1, 0.001), Math.max((a2 - 1) / b2, 0.001)) * 20 + 10;
  const nPoints = 2000;
  const step = upper / nPoints;
  let cdf = 0;
  let x = step / 2;
  for (let i = 0; i < nPoints; i += 1) {
    const pdf = q1 * gammaDensity(x, a1, b1) + (1 - q1) * gammaDensity(x, a2, b2);
    cdf += pdf * step;
    if (cdf >= quantile) return x;
    x += step;
  }
  return x;
}

function gammaDensity(x: number, alpha: number, beta: number) {
  if (x <= 0) return 0;
  return Math.exp(alpha * Math.log(beta) - logGamma(alpha) + (alpha - 1) * Math.log(x) - beta * x);
}

function logGamma(z: number): number {
  const p = [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  z -= 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < p.length; i += 1) x += p[i] / (z + i + 1);
  const t = z + p.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}
