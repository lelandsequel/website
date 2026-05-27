import type { RunnerMode, RunnerResult } from "./types";
import { audit, hashText, metadata, row } from "./primitives";
import { evidenceSummary, sourceRefLabels } from "./packet";

const accountingModes = new Set<RunnerMode>([
  "close",
  "recon",
  "journal",
  "flux",
  "binder",
  "policy",
  "control",
]);

const blockerRules: Array<[string, RegExp]> = [
  ["MISSING_PROOF", /\bmissing|not attached|no support|unsupported|without support/],
  ["MISMATCH", /\bmismatch|does not tie|doesn't tie|difference|out of balance|unbalanced/],
  ["STALE_ITEM", /\bstale|older than|aged|180 days/],
  ["POLICY_CONFLICT", /\bpolicy conflict|below threshold|cutoff|capitalization|approval matrix/],
  ["OPEN_REVIEW", /\bunresolved|blocker|review|not approved|queue/],
  ["VARIANCE_GAP", /\bvariance|strong demand|volume|price|mix|timing/],
];

const requiredEvidenceByMode: Partial<Record<RunnerMode, Array<[string, RegExp]>>> = {
  close: [
    ["trial balance", /\btrial balance|TB\b/i],
    ["cash reconciliation", /\bcash rec|cash reconciliation|bank statement/i],
    ["review status", /\breviewer|review queue|approved|not approved/i],
  ],
  recon: [
    ["subledger", /\bsubledger|sub-ledger|detail/i],
    ["general ledger", /\bGL\b|general ledger/i],
    ["difference explanation", /\bdifference|variance|reconcil/i],
  ],
  journal: [
    ["journal entry id", /\bJE\b|journal entry|entry id/i],
    ["approver", /\bapprover|prepared by|reviewed by/i],
    ["support reference", /\bsupport|invoice|contract|calculation/i],
  ],
  flux: [
    ["current period", /\bcurrent period|actual|FY|Q[1-4]|month/i],
    ["prior/budget comparator", /\bprior|budget|forecast|plan/i],
    ["variance explanation", /\bvariance|bridge|driver|explanation/i],
  ],
  binder: [
    ["binder index", /\bbinder|index|checklist|close package/i],
    ["workpaper status", /\bprepared|reviewed|complete|not approved|queue/i],
    ["support references", /\bsupport|attachment|statement|schedule|invoice/i],
  ],
  policy: [
    ["policy reference", /\bpolicy|threshold|approval matrix|capitalization/i],
    ["transaction evidence", /\binvoice|purchase order|contract|receipt/i],
    ["decision requested", /\bcapitalize|expense|classify|approve|release/i],
  ],
  control: [
    ["control id", /\bcontrol|SOX|owner|frequency/i],
    ["evidence", /\bevidence|screenshot|log|sample|support/i],
    ["exception status", /\bexception|deficiency|remediat|passed|failed/i],
  ],
};

export function isAccountingMode(mode: RunnerMode) {
  return accountingModes.has(mode);
}

export function runAccounting(mode: RunnerMode, packet: string): RunnerResult {
  const lower = packet.toLowerCase();
  const evidence = evidenceSummary(packet);
  const requiredEvidence = requiredEvidenceByMode[mode] ?? [];
  const missingEvidence = requiredEvidence
    .filter(([, pattern]) => !pattern.test(packet))
    .map(([label]) => label);
  const blockers = blockerRules
    .filter(([, pattern]) => pattern.test(lower))
    .map(([label]) => label);
  const allBlockers = [
    ...blockers,
    ...missingEvidence.map((label) => `MISSING_${label.toUpperCase().replace(/\W+/g, "_")}`),
  ];
  const verdict = allBlockers.length ? "BLOCKED - HUMAN REVIEW REQUIRED" : "REVIEW READY - NO BLOCKERS DETECTED";
  const rows = [
    row("Packet hash", hashText(packet), "Content-addressed source packet."),
    row("Parsed fields", String(evidence.fieldCount), "Fields extracted from pasted/uploaded packet."),
    row("Source refs", String(evidence.sourceCount), sourceRefLabels(packet).join(" | ") || "No explicit source references supplied."),
    row("Detected blockers", String(allBlockers.length), allBlockers.length ? allBlockers.join(", ") : "No blocker keywords or required-evidence gaps detected."),
    row("Release decision", allBlockers.length ? "REFUSE RELEASE" : "REVIEW READY", "Deterministic release gate."),
    row("Mode", mode.toUpperCase(), "Accounting workpaper mode."),
  ];

  return {
    metadata: metadata(mode, packet),
    verdict,
    posture: "Prepares accounting workpapers; refuses assurance, audit opinions, legal advice, and unsupported close release.",
    rows,
    blockers: allBlockers,
    refusals: [
      "No audit opinion.",
      "No accounting advice.",
      "No legal advice.",
      "No close release while blockers remain.",
    ],
    audit: audit(packet, mode, verdict, rows),
  };
}
