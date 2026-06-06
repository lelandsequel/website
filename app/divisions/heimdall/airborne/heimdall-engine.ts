// Always the brake. Never the sword.
export const VERDICTS = Object.freeze({
  REFUSE: "REFUSE",
  HOLD: "HOLD",
  ABSTAIN: "ABSTAIN",
  NO_OBJECTION: "NO_OBJECTION",
} as const);

export type HeimdallVerdict = (typeof VERDICTS)[keyof typeof VERDICTS];

export type EvidenceClaim = {
  id: string;
  text: string;
  evidence: string[];
};

export type Proportionality = {
  collateralRisk: "low" | "elevated" | "high" | null;
  value: "low" | "high" | null;
};

export type ReviewPackage = {
  crossing: string;
  claims: EvidenceClaim[];
  proportionality: Proportionality | null;
};

export type HeimdallEngineOutcome = {
  verdict: HeimdallVerdict;
  requiresHuman: true;
  reason: string;
  rule: "COSMIC_EVIDENCE_GATE" | "KEYSTONE_LOAD_GATE" | "NO_OBJECTION_GATE";
  failed?: Array<{ id: string; text: string; why: string }>;
};

function cosmic(claims: EvidenceClaim[], verifiedEvidence: string[]) {
  const have = new Set(verifiedEvidence);
  const failed = [];

  for (const claim of claims) {
    const cited = claim.evidence ?? [];
    const grounded = cited.length > 0 && cited.every((evidenceId) => have.has(evidenceId));

    if (!grounded) {
      failed.push({
        id: claim.id,
        text: claim.text,
        why: cited.length ? "cited evidence not verified" : "no evidence cited",
      });
    }
  }

  return failed;
}

function keystone(proportionality: Proportionality | null) {
  if (!proportionality || proportionality.collateralRisk == null || proportionality.value == null) {
    return {
      ok: false,
      abstain: true,
      why: "proportionality cannot be assessed; the brake will not stamp what it cannot see",
    };
  }

  if (proportionality.collateralRisk === "high") {
    return {
      ok: false,
      abstain: false,
      why: "collateral risk is high; the package does not bear the load of the moment",
    };
  }

  if (proportionality.collateralRisk === "elevated" && proportionality.value !== "high") {
    return {
      ok: false,
      abstain: false,
      why: "elevated collateral risk is not justified by the stated value",
    };
  }

  return { ok: true, abstain: false, why: "" };
}

export function evaluate(pkg: ReviewPackage, verifiedEvidence: string[]): HeimdallEngineOutcome {
  const failed = cosmic(pkg.claims ?? [], verifiedEvidence ?? []);

  if (failed.length) {
    return {
      verdict: VERDICTS.REFUSE,
      requiresHuman: true,
      failed,
      reason: `Unsupported claim(s): ${failed.map((claim) => claim.id).join(", ")}. The crossing cannot pass on this evidence.`,
      rule: "COSMIC_EVIDENCE_GATE",
    };
  }

  const load = keystone(pkg.proportionality);

  if (load.abstain) {
    return {
      verdict: VERDICTS.ABSTAIN,
      requiresHuman: true,
      reason: load.why,
      rule: "KEYSTONE_LOAD_GATE",
    };
  }

  if (!load.ok) {
    return {
      verdict: VERDICTS.HOLD,
      requiresHuman: true,
      reason: load.why,
      rule: "KEYSTONE_LOAD_GATE",
    };
  }

  return {
    verdict: VERDICTS.NO_OBJECTION,
    requiresHuman: true,
    reason: "All claims are grounded and proportionality holds. The brake raises no objection; authority remains entirely with the human operator.",
    rule: "NO_OBJECTION_GATE",
  };
}
