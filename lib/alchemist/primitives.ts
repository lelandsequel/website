import type { RunnerMode, RunnerResult, RunnerRow } from "./types";
import { ALCHEMIST_CORPUS_SEAL, ALCHEMIST_ENGINE_VERSION, getModeDefinition, sha256 } from "./corpus";
import { evidenceSummary, readFieldValue, sourceRefLabels } from "./packet";

export function hashText(input: string) {
  return `sha256:${sha256(input)}`;
}

export function compact(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function readValue(packet: string, labels: string[]) {
  const parsedValue = readFieldValue(packet, labels);
  if (parsedValue !== null) return parsedValue;

  const lines = packet.split(/\n+/);
  for (const label of labels) {
    const line = findLine(lines, label);
    const match = line?.slice(line.toLowerCase().indexOf(label.toLowerCase()) + label.length)
      .match(/:?\s*\(?\$?(-?[\d,.]+)\)?\s*(bn|mm|x|%)?/i);
    if (!match) continue;

    const raw = Number(match[1].replace(/,/g, ""));
    return match[2]?.toLowerCase() === "bn" ? raw * 1000 : raw;
  }
  return null;
}

export function findLine(lines: string[], label: string) {
  const needle = label.toLowerCase();
  return lines.find((candidate) => candidate.toLowerCase().includes(needle));
}

export function money(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1000) return `$${(value / 1000).toFixed(1)}bn`;
  return `$${value.toFixed(1)}mm`;
}

export function multiple(value: number) {
  const normalized = Math.abs(value) < 0.05 ? 0 : value;
  return `${normalized.toFixed(1)}x`;
}

export function percent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function perShare(value: number) {
  return `$${value.toFixed(2)}`;
}

export function row(label: string, value: string, detail: string): RunnerRow {
  return { label, value, detail };
}

export function audit(packet: string, mode: RunnerMode, verdict: string, rows: RunnerRow[]) {
  const seed = `${mode}:${packet}`;
  const evidence = evidenceSummary(packet);
  const sourceCount = `${evidence.sourceCount} source${evidence.sourceCount === 1 ? "" : "s"}`;
  return [
    row("GENESIS", hashText(seed), "Packet hash locked for this run."),
    row("CORPUS_SEAL", ALCHEMIST_CORPUS_SEAL, "Sealed ALCHEMIST rules corpus."),
    row("PARSE_PACKET", `${evidence.fieldCount} parsed fields`, "Deterministic label/number extraction from text, CSV-ish rows, or JSON-ish lines; no LLM call."),
    row("EVIDENCE_INDEX", sourceCount, sourceRefLabels(packet).join(" | ") || "No explicit source references supplied."),
    row("APPLY_RULES", mode.toUpperCase(), "Mode-specific arithmetic and refusal boundaries applied."),
    row("AURORA_GATE", verdict, "Unsafe conclusions are blocked before display."),
    row("LUNA_CHAIN", hashText(`${seed}:${verdict}:${rows.map((item) => item.value).join("|")}`), "Tamper-evident chain head."),
  ];
}

export function metadata(mode: RunnerMode, packet: string) {
  const definition = getModeDefinition(mode);
  const evidence = evidenceSummary(packet);
  return {
    engine_version: ALCHEMIST_ENGINE_VERSION,
    corpus_seal: ALCHEMIST_CORPUS_SEAL,
    input_hash: hashText(packet),
    evidence_hash: evidence.evidenceHash,
    mode,
    parsed_field_count: evidence.fieldCount,
    source_count: evidence.sourceCount,
    period_count: evidence.periodCount,
    rule_count: definition
      ? definition.computes.length + definition.requiredEvidence.length + definition.refusalConditions.length
      : 0,
  };
}

export function missingResult(mode: RunnerMode, packet: string, missing: string[]): RunnerResult {
  const verdict = "REFUSE - MISSING SOURCE FIELDS";
  const rows = missing.map((item) => row(item, "missing", "Required for deterministic computation."));
  return {
    metadata: metadata(mode, packet),
    verdict,
    posture: "ALCHEMIST refuses to fabricate the missing math.",
    rows,
    blockers: missing,
    refusals: ["No recommendation, valuation conclusion, release decision, or approval can be produced."],
    audit: audit(packet, mode, verdict, rows),
  };
}

export function missingLabels(fields: Array<[string, number | null]>) {
  return fields.filter(([, value]) => value === null).map(([label]) => label);
}
