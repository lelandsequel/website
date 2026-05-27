import { createHash } from "node:crypto";
import type { RunnerMode } from "./types";

export const ALCHEMIST_ENGINE_VERSION = "alchemist-runner-v0.3.0";

export type ModeDefinition = {
  mode: RunnerMode;
  division: "banking" | "accounting";
  computes: string[];
  requiredEvidence: string[];
  refusalConditions: string[];
};

export const modeDefinitions: ModeDefinition[] = [
  {
    mode: "credit",
    division: "banking",
    computes: ["net debt", "net debt / EBITDA", "EBITDA / cash interest", "FCF cushion"],
    requiredEvidence: ["EBITDA", "gross debt", "cash", "cash interest"],
    refusalConditions: ["missing required financials", "covenant/legal interpretation", "credit rating", "lending recommendation"],
  },
  {
    mode: "merger",
    division: "banking",
    computes: ["offer premium", "equity purchase value", "new debt", "new shares", "EPS impact"],
    requiredEvidence: ["acquirer EPS", "acquirer shares", "target shares", "offer price", "consideration mix"],
    refusalConditions: ["fairness opinion", "board recommendation", "tax/legal advice", "unsupported synergies"],
  },
  {
    mode: "lbo",
    division: "banking",
    computes: ["purchase EV", "opening debt", "sponsor equity", "exit equity value", "MOIC", "IRR"],
    requiredEvidence: ["entry EBITDA", "entry multiple", "opening debt", "exit EBITDA", "exit multiple", "exit debt"],
    refusalConditions: ["bid recommendation", "debt-capacity opinion", "covenant interpretation"],
  },
  {
    mode: "sotp",
    division: "banking",
    computes: ["segment values", "overhead deduction", "equity bridge", "per-share value"],
    requiredEvidence: ["segment EBITDA", "segment multiples", "net debt", "diluted shares"],
    refusalConditions: ["invented peer set", "unsupported holdco discount", "tax leakage", "investment recommendation"],
  },
  {
    mode: "scenarios",
    division: "banking",
    computes: ["case table", "case flags", "proof gaps"],
    requiredEvidence: ["at least two scenario rows"],
    refusalConditions: ["forecast approval", "board-approved label", "lender-case claim", "investment recommendation"],
  },
  {
    mode: "benchmark",
    division: "banking",
    computes: ["valuation bridge", "visible controls", "refusal score posture"],
    requiredEvidence: ["EBITDA", "net debt", "diluted shares"],
    refusalConditions: ["model-suitability claim", "hidden reasoning request", "buy/sell/hold recommendation"],
  },
  ...(["close", "recon", "journal", "flux", "binder", "policy", "control"] as RunnerMode[]).map((mode) => ({
    mode,
    division: "accounting" as const,
    computes: ["packet hash", "detected blockers", "release decision", "mode"],
    requiredEvidence: ["source packet text", "workpaper facts", "support status"],
    refusalConditions: ["audit opinion", "accounting advice", "legal advice", "unsupported close release"],
  })),
];

export const ALCHEMIST_CORPUS_CANONICAL = JSON.stringify(modeDefinitions);
export const ALCHEMIST_CORPUS_SEAL = `sha256:${sha256(ALCHEMIST_CORPUS_CANONICAL)}`;

export function getModeDefinition(mode: RunnerMode) {
  return modeDefinitions.find((definition) => definition.mode === mode) ?? null;
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
