import { sha256 } from "./corpus";

export type ParsedField = {
  label: string;
  normalizedLabel: string;
  rawValue: string;
  value: number | null;
  unit: "mm" | "bn" | "x" | "%" | "plain" | null;
  source: string;
};

export type SourceRef = {
  kind: "url" | "filing" | "workpaper" | "journal" | "invoice" | "policy" | "other";
  value: string;
};

export type ParsedPacket = {
  fields: ParsedField[];
  periods: string[];
  sourceRefs: SourceRef[];
  packetHash: string;
};

const FIELD_SPLIT = /:|=|,|\t/;
const NUMBER_PATTERN = /\(?\$?\s*(-?[\d,]+(?:\.\d+)?)\s*\)?\s*(bn|billion|mm|million|x|%)?/i;

export function parseSourcePacket(packet: string): ParsedPacket {
  const lines = packet
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const fields = lines.flatMap((line) => parseLine(line));
  return {
    fields,
    periods: extractPeriods(packet),
    sourceRefs: extractSourceRefs(packet),
    packetHash: `sha256:${sha256(packet)}`,
  };
}

export function readFieldValue(packet: string, labels: string[]) {
  const parsed = parseSourcePacket(packet);
  const normalizedLabels = labels.map(normalizeLabel);
  const exact = parsed.fields.find((field) =>
    normalizedLabels.some((label) => field.normalizedLabel === label || field.normalizedLabel.endsWith(label)),
  );
  if (exact?.value !== null && exact?.value !== undefined) return exact.value;

  const fuzzy = parsed.fields.find((field) =>
    normalizedLabels.some((label) => field.normalizedLabel.includes(label) || label.includes(field.normalizedLabel)),
  );
  if (fuzzy?.value !== null && fuzzy?.value !== undefined) return fuzzy.value;

  return null;
}

export function evidenceSummary(packet: string) {
  const parsed = parseSourcePacket(packet);
  const sourceCount = parsed.sourceRefs.length;
  const periodCount = parsed.periods.length;
  const fieldCount = parsed.fields.length;
  const hasExternalSources = sourceCount > 0;
  const hasPeriods = periodCount > 0;

  return {
    fieldCount,
    sourceCount,
    periodCount,
    hasExternalSources,
    hasPeriods,
    evidenceHash: `sha256:${sha256(JSON.stringify({ refs: parsed.sourceRefs, periods: parsed.periods }))}`,
  };
}

export function sourceRefLabels(packet: string) {
  const refs = parseSourcePacket(packet).sourceRefs;
  return refs.slice(0, 5).map((ref) => `${ref.kind}: ${ref.value}`);
}

function parseLine(line: string): ParsedField[] {
  if (line.startsWith("{") || line.startsWith("[") || line.startsWith("}")) return parseJsonishLine(line);
  const splitIndex = line.search(FIELD_SPLIT);
  if (splitIndex < 1) return [];
  const label = line.slice(0, splitIndex).replace(/^[-*•]\s*/, "").trim();
  const rawValue = line.slice(splitIndex + 1).trim();
  if (!label || !rawValue) return [];

  return [{
    label,
    normalizedLabel: normalizeLabel(label),
    rawValue,
    value: parseNumericValue(rawValue),
    unit: parseUnit(rawValue),
    source: line,
  }];
}

function parseJsonishLine(line: string) {
  try {
    const value = JSON.parse(line);
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    return Object.entries(value).map(([label, raw]) => ({
      label,
      normalizedLabel: normalizeLabel(label),
      rawValue: String(raw),
      value: parseNumericValue(String(raw)),
      unit: parseUnit(String(raw)),
      source: line,
    }));
  } catch {
    return [];
  }
}

function parseNumericValue(raw: string) {
  const match = raw.match(NUMBER_PATTERN);
  if (!match) return null;
  const numeric = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return null;
  const unit = match[2]?.toLowerCase();
  if (unit === "bn" || unit === "billion") return numeric * 1000;
  return numeric;
}

function parseUnit(raw: string): ParsedField["unit"] {
  const match = raw.match(NUMBER_PATTERN);
  const unit = match?.[2]?.toLowerCase();
  if (unit === "billion" || unit === "bn") return "bn";
  if (unit === "million" || unit === "mm") return "mm";
  if (unit === "x") return "x";
  if (unit === "%") return "%";
  return match ? "plain" : null;
}

function extractPeriods(packet: string) {
  const matches = packet.match(/\b(?:FY|CY|Q[1-4]|month|period|as of|through)\s*[-\w/+. ]{2,24}/gi) ?? [];
  return Array.from(new Set(matches.map((item) => item.trim()))).slice(0, 8);
}

function extractSourceRefs(packet: string): SourceRef[] {
  const refs: SourceRef[] = [];
  const urlMatches = packet.match(/https?:\/\/[^\s)]+/gi) ?? [];
  refs.push(...urlMatches.map((value) => ({ kind: "url" as const, value })));

  const sourcePatterns: Array<[SourceRef["kind"], RegExp]> = [
    ["filing", /\b(?:10-K|10-Q|8-K|S-1|DEF 14A|earnings release|management case|bank model|QoE)\b[^.\n]*/gi],
    ["workpaper", /\b(?:WP|workpaper|binder|trial balance|bank statement|support file)\b[^.\n]*/gi],
    ["journal", /\b(?:JE|journal entry|entry id)\b[^.\n]*/gi],
    ["invoice", /\b(?:invoice|PO|purchase order|receipt)\b[^.\n]*/gi],
    ["policy", /\b(?:policy|approval matrix|threshold|control owner)\b[^.\n]*/gi],
  ];

  for (const [kind, pattern] of sourcePatterns) {
    const matches = packet.match(pattern) ?? [];
    refs.push(...matches.map((value) => ({ kind, value: value.trim() })));
  }

  return uniqueRefs(refs).slice(0, 12);
}

function uniqueRefs(refs: SourceRef[]) {
  const seen = new Set<string>();
  return refs.filter((ref) => {
    const key = `${ref.kind}:${ref.value.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeLabel(label: string) {
  return label
    .toLowerCase()
    .replace(/[$()[\]{}]/g, " ")
    .replace(/[_/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
