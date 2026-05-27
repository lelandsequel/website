export type RunnerMode =
  | "credit"
  | "merger"
  | "lbo"
  | "sotp"
  | "scenarios"
  | "benchmark"
  | "close"
  | "recon"
  | "journal"
  | "flux"
  | "binder"
  | "policy"
  | "control";

export type RunnerRow = {
  label: string;
  value: string;
  detail: string;
};

export type RunnerResult = {
  metadata: {
    engine_version: string;
    corpus_seal: string;
    input_hash: string;
    evidence_hash: string;
    mode: RunnerMode;
    parsed_field_count: number;
    source_count: number;
    period_count: number;
    rule_count: number;
  };
  verdict: string;
  posture: string;
  rows: RunnerRow[];
  blockers: string[];
  refusals: string[];
  audit: RunnerRow[];
};

export type RunnerPayload = {
  mode: RunnerMode;
  packet: string;
};
