import { ALCHEMIST_CORPUS_SEAL, ALCHEMIST_ENGINE_VERSION, getModeDefinition, modeDefinitions } from "./corpus";
import { isAccountingMode, runAccounting } from "./accounting";
import { runBenchmark, runCredit, runLbo, runMerger, runScenarios, runSotp } from "./finance";
import { missingResult } from "./primitives";
import type { RunnerMode, RunnerPayload, RunnerResult } from "./types";

export type { RunnerMode, RunnerPayload, RunnerResult, RunnerRow } from "./types";

export const runnerModes: RunnerMode[] = [
  "credit",
  "merger",
  "lbo",
  "sotp",
  "scenarios",
  "benchmark",
  "close",
  "recon",
  "journal",
  "flux",
  "binder",
  "policy",
  "control",
];

export function isRunnerMode(mode: string): mode is RunnerMode {
  return runnerModes.includes(mode as RunnerMode);
}

export function runAlchemist(payload: RunnerPayload): RunnerResult {
  const packet = payload.packet.trim();
  if (!packet) return missingResult(payload.mode, payload.packet, ["packet text"]);
  if (payload.mode === "credit") return runCredit(packet);
  if (payload.mode === "merger") return runMerger(packet);
  if (payload.mode === "lbo") return runLbo(packet);
  if (payload.mode === "sotp") return runSotp(packet);
  if (payload.mode === "scenarios") return runScenarios(packet);
  if (payload.mode === "benchmark") return runBenchmark(packet);
  if (isAccountingMode(payload.mode)) return runAccounting(payload.mode, packet);
  return missingResult(payload.mode, packet, ["supported runner mode"]);
}

export function alchemistEngineManifest() {
  return {
    engine_version: ALCHEMIST_ENGINE_VERSION,
    corpus_seal: ALCHEMIST_CORPUS_SEAL,
    modes: runnerModes.map((mode) => getModeDefinition(mode)),
    mode_count: modeDefinitions.length,
  };
}
