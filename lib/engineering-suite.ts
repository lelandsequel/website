import { createHash } from "node:crypto";

export type EngineeringMode =
  | "cadmus"
  | "vantage"
  | "prospector"
  | "luna"
  | "heimdall"
  | "vendor"
  | "access"
  | "buildgate";
export type FindingSeverity = "critical" | "high" | "medium" | "info";

export type EngineeringModule = {
  id: EngineeringMode;
  name: string;
  lane: string;
  headline: string;
  summary: string;
  route: string;
  accent: string;
  samplePacket: string;
};

export type EngineeringFinding = {
  code: string;
  severity: FindingSeverity;
  title: string;
  detail: string;
  remediation: string;
  evidence: string;
};

export type EngineeringArtifact = {
  label: string;
  value: string;
  detail: string;
};

export type EngineeringAuditStep = {
  label: string;
  value: string;
  detail: string;
};

export type EngineeringResult = {
  mode: EngineeringMode;
  product: string;
  verdict: string;
  score: number;
  posture: string;
  findings: EngineeringFinding[];
  refusals: string[];
  artifacts: EngineeringArtifact[];
  audit: EngineeringAuditStep[];
  benchmarkPrompt: string;
  metadata: {
    engine_version: string;
    corpus_seal: string;
    input_hash: string;
    parsed_lines: number;
    finding_count: number;
  };
};

const ENGINE_VERSION = "engineering-suite-runner-v0.1.0";
export const ENGINEERING_CORPUS_SEAL = `sha256:${sha256([
  "cadmus-intent-to-spec-v1",
  "vantage2-clarion-code-audit-v1",
  "prospector-estate-intelligence-v1",
  "luna-persistent-work-brief-v1",
  "heimdall-agent-governance-mcp-v1",
  "decision-gate-vendor-risk-v1",
  "access-right-size-drift-v1",
  "build-gate-standards-as-code-v1",
].join("|"))}`;

export const engineeringModules: EngineeringModule[] = [
  {
    id: "cadmus",
    name: "CADMUS",
    lane: "SPECIFY",
    headline: "Brain dump to airtight spec",
    summary:
      "Built for overloaded founders and idea-heavy teams: paste the messy intent, get a buildable spec with acceptance tests, non-goals, constraints, and release blockers.",
    route: "/omnis/cadmus",
    accent: "#6f38ff",
    samplePacket: `Task: Convert this founder note into a build-ready spec. Refuse handoff if the packet is not buildable.

Founder note:
I need an AI agent dashboard ASAP. It should pull from Slack, Google Drive, GitHub, and random folders, figure out what matters, create specs, maybe open tickets, and help the team stop losing important context. Admins need all access. Contractors need some access. I want it live soon and better than our current mess.

Known constraints:
- Do not leak client documents.
- SOC 2 evidence matters.
- GitHub and Google OAuth are likely.
- Mobile can come later.

Required output:
Release decision, missing proof, spec blockers, open questions, and what must be written before engineering starts.`,
  },
  {
    id: "vantage",
    name: "VANTAGE 2.0",
    lane: "VERIFY",
    headline: "Code fixes with release discipline",
    summary:
      "Finds what will break, leak, drift, or embarrass you before code ships. VANTAGE 2.0 turns code review into deterministic findings and fix-ready release gates.",
    route: "/omnis/vantage",
    accent: "#18a978",
    samplePacket: `Task: Review this code packet and decide whether it can merge.

Diff summary:
- Adds POST /api/run that accepts arbitrary JavaScript snippets.
- Uses eval(req.body.script) inside the request handler.
- Logs process.env.OPENAI_API_KEY when DEBUG=true.
- Updates package.json but no lockfile diff is attached.
- No tests, no lint output, and no rollback plan included.

Required posture:
Return merge decision, severity findings, missing proof, and what must change before release.`,
  },
  {
    id: "prospector",
    name: "PROSPECTOR",
    lane: "DISCOVER",
    headline: "Messy estate to diligence map",
    summary:
      "Searches the hard drives, repos, Confluence pages, folders, and forgotten docs; then tells you what is good, what is risky, what is missing, and what to fix first.",
    route: "/omnis/prospector",
    accent: "#8b5cf6",
    samplePacket: `Task: Run software estate diligence on this acquisition packet.

Estate packet:
- 14 services across Node, Python, and one legacy Rails app.
- Payments service has no named owner.
- CI is disabled on three repos.
- S3 uploads bucket is public-read for customer documents.
- Auth service depends on a deprecated JWT package.
- No SBOM, no license inventory, and no architecture diagram.
- Data warehouse jobs are business-critical but undocumented.

Required posture:
Return release decision, risk tiers, missing proof, modernization plan, and diligence blockers.`,
  },
  {
    id: "luna",
    name: "LUNA",
    lane: "REMEMBER",
    headline: "Computer activity to work brief",
    summary:
      "Turns activity traces, notes, screenshots, meeting fragments, and local work logs into a readable brief with evidence boundaries and export-ready receipts.",
    route: "/omnis/luna",
    accent: "#5a2ee6",
    samplePacket: `Task: Write a work brief from this activity packet. Refuse claims that are not supported by the packet.

Activity packet:
- 09:12 opened ALCHEMIST finance workbench at /finance-models/cipher-dcf?target=MPC.
- 09:18 compared DCF output against public oil/refining tickers and noted unsupported assumptions.
- 09:36 opened OMNIS desktop and ran VANTAGE against the current project folder.
- 09:41 PROSPECTOR scan started on /Users/sokpyeon/projects with status-bar progress enabled.
- 10:04 reviewed Littlebird-style memory UX screenshots and wrote LUNA+COSMIC product-spec notes.
- Evidence attached: screenshot names, local route URLs, hash-stamped run records, and exported JSON receipts.

Required output:
One readable paragraph brief, evidence index, unsupported-memory refusals, and what can be exported.`,
  },
  {
    id: "heimdall",
    name: "HEIMDALL",
    lane: "GOVERN",
    headline: "Agent access, governed and refused",
    summary:
      "Paste an AI agent's declared tools, data, and actions. HEIMDALL applies MCP-style governance: what's allowed, what's refused, and the audit boundary — so agents scale without creating new security or privacy risk.",
    route: "/omnis/heimdall",
    accent: "#4A7BA7",
    samplePacket: `Task: Govern this AI agent before it goes live. Refuse if it can reach unrestricted tools or data.

Agent manifest:
- Name: ops-assistant
- Tools requested: Slack, Google Drive, GitHub, shell exec, internal HR database
- Data: "needs all access to be useful"; can read client documents and employee records
- Actions: can open tickets, deploy to staging, and send emails on the user's behalf
- Admins get full access; contractors get "some" access
- No scope allowlist, no audit log, and no human approval step are described

Required posture:
Return the governance decision, refused scopes, MCP boundary gaps, audit requirements, and what must change before this agent ships.`,
  },
  {
    id: "vendor",
    name: "DECISION GATE",
    lane: "GATE",
    headline: "Third-party risk, accepted or refused on proof",
    summary:
      "Paste a vendor, SaaS, or dependency packet. The Decision Gate returns an evidence-grounded accept / hold / reject — never a 'low risk' claim from prose alone.",
    route: "/omnis/vendor",
    accent: "#b26a00",
    samplePacket: `Task: Decide whether to approve this vendor for a client-facing, critical path.

Vendor packet:
- Vendor: NimbusQueue (managed message broker)
- Sits on the critical path for payment notifications; no fallback described
- Stores customer email + transaction metadata; data residency not specified
- No SOC 2 or ISO attestation attached
- Uptime/SLA not on record
- Their SDK depends on a deprecated TLS library

Required posture:
Return accept / hold / reject, the missing evidence, the resilience risk, and conditions for approval.`,
  },
  {
    id: "access",
    name: "ACCESS LENS",
    lane: "RIGHT-SIZE",
    headline: "Least privilege from real usage",
    summary:
      "Paste entitlements against observed usage. ACCESS LENS flags standing privilege, drift, and over-permissioned grants — and refuses a least-privilege claim without usage evidence.",
    route: "/omnis/access",
    accent: "#18a978",
    samplePacket: `Task: Right-size this access grant against how it's actually used.

Access packet:
- Identity: svc-reporting (service account)
- Entitlements: admin on the data warehouse, write to the prod payments DB, wildcard read on all S3 buckets
- Observed usage (90 days): read-only queries on two reporting tables; payments DB never accessed; one S3 prefix used
- Grant is standing (no expiry); no recertification on record

Required posture:
Return the right-sizing decision, unused entitlements to revoke, standing-privilege risk, and the review cadence to add.`,
  },
  {
    id: "buildgate",
    name: "BUILD GATE",
    lane: "ENFORCE",
    headline: "Standards enforced at build time",
    summary:
      "Paste a dependency manifest. The Build Gate checks for required approved SDKs, disallowed versions, pinning, and a lockfile — and emits a manifest. Standards as code, not a reminder.",
    route: "/omnis/buildgate",
    accent: "#6f38ff",
    samplePacket: `Task: Run the build-time governance gate on this manifest.

Manifest packet:
- Language: Node (package.json)
- Dependencies: express ^4, lodash *, left-pad latest, jsonwebtoken 8.0.0
- Missing: the approved security SDK and the observability SDK required by policy
- jsonwebtoken 8.0.0 has a known CVE / is outside the approved range
- No package-lock.json is committed

Required posture:
Return the build gate decision (pass/fail), missing required dependencies, disallowed versions, and the dependency manifest to emit.`,
  },
];

export function getEngineeringModule(mode: string): EngineeringModule | null {
  return engineeringModules.find((module) => module.id === mode) ?? null;
}

export function isEngineeringMode(mode: string): mode is EngineeringMode {
  return engineeringModules.some((module) => module.id === mode);
}

export function engineeringManifest() {
  return {
    generated_by: "OMNIS deterministic engineering suite",
    engine_version: ENGINE_VERSION,
    corpus_seal: ENGINEERING_CORPUS_SEAL,
    modes: engineeringModules.map(({ id, name, lane, route, headline }) => ({ id, name, lane, route, headline })),
  };
}

export function runEngineeringSuite(mode: EngineeringMode, packet: string): EngineeringResult {
  const module = getEngineeringModule(mode);
  if (!module) throw new Error(`Unsupported engineering mode: ${mode}`);

  const cleanPacket = packet.trim();
  if (!cleanPacket) return missingPacketResult(module, packet);

  if (mode === "cadmus") return runCadmus(module, cleanPacket);
  if (mode === "vantage") return runVantage(module, cleanPacket);
  if (mode === "prospector") return runProspector(module, cleanPacket);
  if (mode === "luna") return runLuna(module, cleanPacket);
  if (mode === "heimdall") return runHeimdall(module, cleanPacket);
  if (mode === "vendor") return runVendorGate(module, cleanPacket);
  if (mode === "access") return runAccessLens(module, cleanPacket);
  return runBuildGate(module, cleanPacket);
}

function runCadmus(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];

  addIfMissing(findings, lower, /\bacceptance\s+tests?\b|\bacceptance\s+criteria\b|\bgiven\b[\s\S]*\bwhen\b[\s\S]*\bthen\b/, {
    code: "CADMUS-SPEC-001",
    severity: "high",
    title: "Acceptance tests absent",
    detail: "The packet does not define testable acceptance behavior.",
    remediation: "Add user-visible acceptance tests before assigning implementation.",
    evidence: "No acceptance-test phrase found.",
  });
  addIfMissing(findings, lower, /\brole\b|\badmin\b|\buser\b|\bowner\b|\breviewer\b|\bpermission\b|\baccess\b/, {
    code: "CADMUS-SPEC-002",
    severity: "high",
    title: "Actor and permission model incomplete",
    detail: "The spec cannot be implemented safely until roles and access boundaries are named.",
    remediation: "Declare actors, permissions, and workspace visibility rules.",
    evidence: "Role/access signals are missing or too thin.",
  });
  addIfMissing(findings, lower, /\bnon[-\s]?goals?\b|\bout\s+of\s+scope\b|\bnot\s+included\b|\bdefer(?:red)?\b/, {
    code: "CADMUS-SPEC-003",
    severity: "medium",
    title: "Non-goals missing",
    detail: "A build packet without non-goals invites scope drift.",
    remediation: "Name what V1 explicitly will not build.",
    evidence: "No non-goal boundary found.",
  });
  addIfMissing(findings, lower, /\bsecurity\b|\bprivacy\b|\bsoc\s*2\b|\bpii\b|\bssn\b|\bencrypt(?:ion|ed)?\b|\baudit\b/, {
    code: "CADMUS-SPEC-004",
    severity: "medium",
    title: "Security evidence boundary missing",
    detail: "The packet does not name the security or privacy constraints that control implementation.",
    remediation: "Add data classification, storage, audit, and privacy requirements.",
    evidence: "No security/privacy proof term found.",
  });

  const vagueHits = countPatterns(lower, [/\bsoon\b/, /\beventually\b/, /\bfast(?:er)?\b/, /\betc\b/, /\bmake\s+it\s+better\b/]);
  if (vagueHits >= 2) {
    findings.push({
      code: "CADMUS-SPEC-005",
      severity: "medium",
      title: "Vague delivery language",
      detail: "The packet includes time or quality language that cannot be tested.",
      remediation: "Replace vague phrasing with measurable scope, milestone, and quality bars.",
      evidence: `${vagueHits} vague intent signals detected.`,
    });
  }

  const score = scoreFromFindings(findings);
  const verdict =
    findings.some((finding) => finding.severity === "high")
      ? "SPEC REVIEW REQUIRED"
      : findings.length
        ? "SPEC READY WITH WARNINGS"
        : "SPEC PACKET RELEASED";

  return buildResult(module, packet, verdict, score, findings, [
    "No implementation handoff while high-severity spec gaps remain.",
    "No invented product requirements outside the packet.",
    "No silent expansion of scope beyond declared non-goals.",
  ], [
    { label: "Spec posture", value: verdict, detail: `${findings.length} deterministic spec finding(s)` },
    { label: "Acceptance packet", value: findings.some((f) => f.code === "CADMUS-SPEC-001") ? "missing" : "present", detail: "Acceptance criteria gate" },
    { label: "Build handoff", value: score >= 85 ? "ready" : "blocked", detail: "CADMUS emits the build packet only when the spec is testable." },
  ]);
}

function runVantage(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];

  addIfPresent(findings, lower, /\beval\s*\(|\bnew\s+function\b|\bfunction\s*\(\s*["'`]return/i, {
    code: "VANTAGE-RUNTIME-001",
    severity: "critical",
    title: "Dynamic code execution",
    detail: "The packet executes untrusted or runtime-provided code.",
    remediation: "Remove dynamic execution and replace it with a constrained parser or allowlisted operation map.",
    evidence: "eval/new Function signal detected.",
  });
  addIfPresent(findings, lower, /process\.env|api[_\s-]?key|secret|token/, {
    code: "VANTAGE-SECRET-001",
    severity: "critical",
    title: "Secret exposure risk",
    detail: "The packet references secrets, tokens, or environment variables in a release path.",
    remediation: "Remove secret logging, add redaction tests, and verify no secrets enter client-visible output.",
    evidence: "Secret/env signal detected.",
  });
  addIfPresent(findings, lower, /child_process|\bexec\s*\(|\bspawn\s*\(|rm\s+-rf|fs\.rm/, {
    code: "VANTAGE-RUNTIME-002",
    severity: "high",
    title: "Unsafe process or filesystem operation",
    detail: "The packet can run shell commands or destructive filesystem operations.",
    remediation: "Gate privileged operations behind explicit allowlists, dry-runs, and audit logs.",
    evidence: "process/filesystem risk signal detected.",
  });
  addIfPresent(findings, lower, /innerhtml|dangerouslysetinnerhtml|document\.write/, {
    code: "VANTAGE-XSS-001",
    severity: "high",
    title: "Unsafe HTML sink",
    detail: "The packet writes untrusted content into an HTML sink.",
    remediation: "Use safe rendering primitives and sanitization with tests.",
    evidence: "HTML sink signal detected.",
  });
  addIfPresent(findings, lower, /sql.*\+|\+\s*where|raw\s+query|prisma\.\$queryrawunsafe/, {
    code: "VANTAGE-DATA-001",
    severity: "high",
    title: "Query injection surface",
    detail: "The packet suggests string-composed queries or unsafe raw database access.",
    remediation: "Use parameterized queries and add malicious-input fixtures.",
    evidence: "Unsafe query signal detected.",
  });
  addIfMissing(findings, lower, /\btest(?:s|ed|ing)?\b|\bvitest\b|\bjest\b|\bplaywright\b|\blint\b|\bbuild\b/, {
    code: "VANTAGE-PROOF-001",
    severity: "medium",
    title: "Release proof missing",
    detail: "No test, lint, build, or verification evidence is present.",
    remediation: "Attach build output, targeted tests, and regression fixtures before merge.",
    evidence: "No verification artifact signal found.",
  });
  addIfMissing(findings, lower, /\blockfile\b|package-lock|pnpm-lock|yarn\.lock|bun\.lock/, {
    code: "VANTAGE-SUPPLY-001",
    severity: "medium",
    title: "Dependency proof incomplete",
    detail: "Dependency changes require a lockfile or provenance trail.",
    remediation: "Attach lockfile diff and dependency rationale.",
    evidence: "No lockfile signal found.",
  });

  if (!/(diff|code|repo|package|route|function|handler|component|api)/.test(lower)) {
    findings.push({
      code: "VANTAGE-PROOF-002",
      severity: "info",
      title: "Code evidence thin",
      detail: "The packet does not look like a code review packet.",
      remediation: "Paste a diff summary, file list, dependency changes, and verification output.",
      evidence: "Code-review terms absent.",
    });
  }

  const score = scoreFromFindings(findings);
  const critical = findings.filter((finding) => finding.severity === "critical").length;
  const high = findings.filter((finding) => finding.severity === "high").length;
  const verdict = critical ? "REFUSE - RELEASE BLOCKED" : high ? "REVIEW - HIGH RISK" : findings.length ? "PASS WITH FINDINGS" : "PASS - NO RELEASE BLOCKERS";

  return buildResult(module, packet, verdict, score, findings, [
    "No merge approval while critical findings remain.",
    "No severity downgrade without a changed diff and verification artifact.",
    "No claim of safe release from prose alone.",
  ], [
    { label: "Critical findings", value: String(critical), detail: "Release-blocking classes" },
    { label: "High findings", value: String(high), detail: "Human review required before merge" },
    { label: "Verification posture", value: score >= 90 ? "clean" : "blocked", detail: "VANTAGE 2.0 reject-first gate" },
  ]);
}

function runProspector(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];

  addIfPresent(findings, lower, /public[-\s]?read|public\s+s3|world[-\s]?readable|open\s+bucket/, {
    code: "PROSPECTOR-DATA-001",
    severity: "critical",
    title: "Public customer-data surface",
    detail: "The estate packet indicates customer data may be publicly reachable.",
    remediation: "Lock storage policy, rotate exposed assets, and attach access-review proof.",
    evidence: "Public storage signal detected.",
  });
  addIfPresent(findings, lower, /\bsecret\b|\bapi[_\s-]?key\b|\btoken\b|credential/, {
    code: "PROSPECTOR-SEC-001",
    severity: "high",
    title: "Secret-management gap",
    detail: "The estate has a secret or credential exposure signal.",
    remediation: "Run secret scan, rotate impacted credentials, and add prevention checks.",
    evidence: "Secret-management signal detected.",
  });
  addIfPresent(findings, lower, /no\s+(?:named\s+)?owner|unknown\s+owner|orphan(?:ed)?|unowned/, {
    code: "PROSPECTOR-OWN-001",
    severity: "high",
    title: "Service ownership gap",
    detail: "A critical service lacks a named owner.",
    remediation: "Assign owner, escalation path, and runtime accountability before diligence release.",
    evidence: "Owner-gap signal detected.",
  });
  addIfPresent(findings, lower, /ci\s+(?:is\s+)?disabled|no\s+ci|without\s+ci|manual\s+deploy/, {
    code: "PROSPECTOR-DELIVERY-001",
    severity: "medium",
    title: "Delivery-control gap",
    detail: "The estate has disabled or missing CI evidence.",
    remediation: "Restore CI, publish required checks, and capture passing build receipts.",
    evidence: "CI gap signal detected.",
  });
  addIfPresent(findings, lower, /deprecated|eol|end[-\s]?of[-\s]?life|unsupported/, {
    code: "PROSPECTOR-DEPS-001",
    severity: "medium",
    title: "Deprecated dependency or runtime",
    detail: "A runtime or dependency has unsupported-version risk.",
    remediation: "Add upgrade lane and version-risk owner to the modernization queue.",
    evidence: "Deprecated/EOL signal detected.",
  });
  addIfMissing(findings, lower, /\bsbom\b|\blicen[cs]e\s+inventory\b|\bdependency\s+inventory\b/, {
    code: "PROSPECTOR-SUPPLY-001",
    severity: "medium",
    title: "Supply-chain inventory missing",
    detail: "No SBOM, license inventory, or dependency inventory is attached.",
    remediation: "Generate SBOM and license inventory before diligence handoff.",
    evidence: "No supply-chain inventory signal found.",
  });
  addIfMissing(findings, lower, /\barchitecture\s+diagram\b|\bservice\s+map\b|\bdata\s+flow\b|\bsequence\s+diagram\b/, {
    code: "PROSPECTOR-ARCH-001",
    severity: "medium",
    title: "Architecture proof missing",
    detail: "The packet lacks the diagrams needed to reason about blast radius.",
    remediation: "Attach service map, data-flow diagram, and dependency graph.",
    evidence: "No architecture-proof signal found.",
  });

  const score = scoreFromFindings(findings);
  const critical = findings.filter((finding) => finding.severity === "critical").length;
  const high = findings.filter((finding) => finding.severity === "high").length;
  const verdict = critical ? "REFUSE - DILIGENCE BLOCKED" : high ? "RISK REVIEW REQUIRED" : findings.length ? "MODERNIZATION QUEUE READY" : "ESTATE PACKET RELEASED";

  return buildResult(module, packet, verdict, score, findings, [
    "No clean diligence memo while critical data exposure remains.",
    "No modernization estimate without owner, architecture, and supply-chain evidence.",
    "No unsupported claim that the estate is migration-ready.",
  ], [
    { label: "Estate risk", value: critical ? "critical" : high ? "high" : "managed", detail: `${findings.length} diligence signal(s)` },
    { label: "Modernization queue", value: findings.length ? `${findings.length} item(s)` : "empty", detail: "Sorted by deterministic severity" },
    { label: "Diligence posture", value: score >= 85 ? "releaseable" : "blocked", detail: "PROSPECTOR requires proof before confidence." },
  ]);
}

function runLuna(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];

  addIfMissing(findings, lower, /\b\d{1,2}:\d{2}\b|\b(am|pm)\b|\bjan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec\b|\btoday\b|\byesterday\b/, {
    code: "LUNA-TIME-001",
    severity: "medium",
    title: "Timeline anchors missing",
    detail: "The packet does not provide enough time anchors to reconstruct what happened.",
    remediation: "Attach timestamps, session windows, calendar anchors, or ordered event records.",
    evidence: "No timestamp/date signal found.",
  });
  addIfMissing(findings, lower, /\bscreenshot\b|\burl\b|\broute\b|\bfile\b|\bfolder\b|\bpath\b|\bjson\b|\breceipt\b|\blog\b|\bhash\b|\bexport\b/, {
    code: "LUNA-EVIDENCE-001",
    severity: "high",
    title: "Evidence index incomplete",
    detail: "A memory brief needs named evidence so the reader can inspect where the claim came from.",
    remediation: "Attach screenshots, route URLs, filenames, local paths, logs, receipts, or hashes.",
    evidence: "No inspectable-evidence signal found.",
  });
  addIfPresent(findings, lower, /\bprivate key\b|\bpassword\b|\btoken\b|\bapi[_\s-]?key\b|\bsecret\b|\bssn\b|\bsocial security\b|\bcredit card\b/, {
    code: "LUNA-PRIVACY-001",
    severity: "critical",
    title: "Sensitive capture boundary",
    detail: "The packet contains a sensitive-data signal that should not be summarized into a portable brief.",
    remediation: "Redact secrets and personal data before generating or exporting the brief.",
    evidence: "Sensitive-data term detected.",
  });
  addIfMissing(findings, lower, /\bwhat\s+i\s+did\b|\bbrief\b|\bsummary\b|\bworkstream\b|\bactivity\b|\bopened\b|\bran\b|\breviewed\b|\bwrote\b|\bexported\b/, {
    code: "LUNA-BRIEF-001",
    severity: "medium",
    title: "Brief intent unclear",
    detail: "The packet does not clearly state the activity or memory question LUNA should answer.",
    remediation: "Name the question, time window, and desired brief format.",
    evidence: "No brief/activity intent signal found.",
  });
  addIfMissing(findings, lower, /\brefuse\b|\bunsupported\b|\bnot supported\b|\bevidence boundary\b|\bdo not invent\b|\bclaim\b/, {
    code: "LUNA-BOUNDARY-001",
    severity: "info",
    title: "Unsupported-memory boundary missing",
    detail: "The packet does not explicitly tell LUNA how to treat unsupported memory claims.",
    remediation: "Add a boundary such as: refuse claims not backed by the activity packet.",
    evidence: "No refusal/evidence-boundary signal found.",
  });

  const score = scoreFromFindings(findings);
  const critical = findings.filter((finding) => finding.severity === "critical").length;
  const high = findings.filter((finding) => finding.severity === "high").length;
  const verdict = critical
    ? "REFUSE - MEMORY BRIEF BLOCKED"
    : high
      ? "BRIEF REVIEW REQUIRED"
      : findings.length
        ? "BRIEF READY WITH GAPS"
        : "BRIEF RELEASED";

  return buildResult(module, packet, verdict, score, findings, [
    "No invented activity claims outside the packet.",
    "No portable brief while sensitive data remains unredacted.",
    "No confidence claim without named evidence records.",
  ], [
    { label: "Brief posture", value: verdict, detail: `${findings.length} memory-proof finding(s)` },
    { label: "Evidence index", value: high ? "incomplete" : "usable", detail: "Screenshots, paths, receipts, logs, and hashes gate the brief." },
    { label: "Export boundary", value: critical ? "blocked" : "available", detail: "Evidence bundle can be exported only after privacy checks pass." },
  ]);
}

function runHeimdall(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];

  addIfPresent(findings, lower, /all\s+access|full\s+access|wildcard|unrestricted|admin\s+to\s+everything|needs?\s+everything/, {
    code: "HEIMDALL-SCOPE-001",
    severity: "critical",
    title: "Over-broad agent access",
    detail: "The agent requests unrestricted or wildcard access to tools or data.",
    remediation: "Replace blanket access with an explicit allowlist of tools, scopes, and data sources per task.",
    evidence: "Wildcard / 'all access' grant detected.",
  });
  addIfPresent(findings, lower, /\bpii\b|client\s+(?:data|document)|\bssn\b|personal\s+data|customer\s+record|employee\s+record|hr\s+database/, {
    code: "HEIMDALL-DATA-001",
    severity: "high",
    title: "Sensitive-data reach without boundary",
    detail: "The agent can reach client PII, employee records, or sensitive systems.",
    remediation: "Scope data access to the minimum needed, add redaction, and require justification per access.",
    evidence: "Sensitive-data access signal detected.",
  });
  addIfPresent(findings, lower, /\bexec\b|\bshell\b|child_process|\bdeploy\b|wire\s+transfer|send\s+(?:email|payment)|delete|irreversible|on\s+the\s+user'?s\s+behalf/, {
    code: "HEIMDALL-ACTION-001",
    severity: "high",
    title: "Irreversible action without human gate",
    detail: "The agent can take irreversible or high-impact actions without approval.",
    remediation: "Require human-in-the-loop approval for irreversible actions; the agent proposes, it does not execute.",
    evidence: "Irreversible-action capability detected.",
  });
  addIfMissing(findings, lower, /allowlist|\bscoped?\b|least\s+privilege|permission\s+boundary|approved\s+tools?/, {
    code: "HEIMDALL-MCP-001",
    severity: "high",
    title: "No scope boundary (MCP rule)",
    detail: "The agent definition lacks an explicit tool/data scope boundary.",
    remediation: "Declare an MCP-style allowlist: exactly which tools and data the agent may use.",
    evidence: "No scope/allowlist boundary found.",
  });
  addIfMissing(findings, lower, /\baudit\b|\blog\b|\btrail\b|\breceipt\b|tamper[-\s]?evident/, {
    code: "HEIMDALL-AUDIT-001",
    severity: "medium",
    title: "No audit trail declared",
    detail: "The agent does not declare an auditable record of what it accessed and did.",
    remediation: "Require a tamper-evident log of every tool call, data read, and action taken.",
    evidence: "No audit/trail signal found.",
  });
  addIfMissing(findings, lower, /\brefuse\b|\bdeny\b|human[-\s]?in[-\s]?the[-\s]?loop|approval|guardrail|\bidentity\b|\bsoul\b/, {
    code: "HEIMDALL-REFUSAL-001",
    severity: "medium",
    title: "No refusal / identity boundary",
    detail: "The agent lacks a declared refusal boundary or signed identity.",
    remediation: "Define what the agent will refuse, and bind it to a signed identity (MAP THE SOUL).",
    evidence: "No refusal/identity boundary found.",
  });

  const score = scoreFromFindings(findings);
  const critical = findings.filter((f) => f.severity === "critical").length;
  const high = findings.filter((f) => f.severity === "high").length;
  const verdict = critical
    ? "REFUSE - AGENT BLOCKED"
    : high
      ? "GOVERNANCE REVIEW REQUIRED"
      : findings.length
        ? "GOVERNED WITH GUARDRAILS"
        : "AGENT CLEARED";

  return buildResult(module, packet, verdict, score, findings, [
    "No agent cleared while it can reach unrestricted tools or data.",
    "No irreversible action without a human-in-the-loop gate.",
    "No agent deployed without a scope boundary and an audit trail.",
  ], [
    { label: "Scope posture", value: critical ? "unrestricted" : "scoped", detail: "MCP allowlist boundary" },
    { label: "Refusal boundary", value: findings.some((f) => f.code === "HEIMDALL-REFUSAL-001") ? "missing" : "declared", detail: "What the agent will not do" },
    { label: "Audit trail", value: findings.some((f) => f.code === "HEIMDALL-AUDIT-001") ? "absent" : "present", detail: "Tamper-evident record of access + actions" },
  ]);
}

function runVendorGate(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];

  addIfMissing(findings, lower, /soc\s*2|iso\s*27001|compliance|attestation|certification/, {
    code: "VENDOR-COMP-001",
    severity: "high",
    title: "No compliance evidence",
    detail: "No SOC 2 / ISO / compliance attestation is attached for this vendor.",
    remediation: "Request and file the vendor's current compliance attestations before approval.",
    evidence: "No compliance-evidence signal found.",
  });
  addIfMissing(findings, lower, /data\s+residency|\bregion\b|\bgdpr\b|encrypt/, {
    code: "VENDOR-DATA-001",
    severity: "high",
    title: "Data handling unclear",
    detail: "Data residency, encryption, or privacy handling is not specified.",
    remediation: "Confirm where data is stored, how it is encrypted, and the privacy terms.",
    evidence: "No data-handling signal found.",
  });
  addIfPresent(findings, lower, /single\s+point|no\s+fallback|no\s+redundanc|critical\s+path|sole\s+provider|hard\s+dependenc/, {
    code: "VENDOR-RESIL-001",
    severity: "high",
    title: "Single point of failure",
    detail: "The vendor sits on a critical path with no fallback.",
    remediation: "Define a fallback / degraded mode and a contractual continuity plan.",
    evidence: "Critical-path / no-fallback signal detected.",
  });
  addIfMissing(findings, lower, /\bsla\b|uptime|availability|\bsupport\s+terms?\b/, {
    code: "VENDOR-SLA-001",
    severity: "medium",
    title: "No SLA / uptime commitment",
    detail: "No service-level or uptime commitment is on record.",
    remediation: "Capture the SLA, uptime history, and incident-response terms.",
    evidence: "No SLA/uptime signal found.",
  });
  addIfPresent(findings, lower, /deprecated|eol|end[-\s]?of[-\s]?life|unmaintained|abandoned|outdated\s+(?:tls|library)/, {
    code: "VENDOR-DEPS-001",
    severity: "medium",
    title: "Unmaintained dependency",
    detail: "The vendor or its stack shows end-of-life or unmaintained signals.",
    remediation: "Flag for replacement and add a migration owner.",
    evidence: "EOL / unmaintained signal detected.",
  });

  const score = scoreFromFindings(findings);
  const high = findings.filter((f) => f.severity === "high").length;
  const verdict = high >= 2
    ? "REJECT - RISK TOO HIGH"
    : high
      ? "HOLD - EVIDENCE REQUIRED"
      : findings.length
        ? "ACCEPT WITH CONDITIONS"
        : "ACCEPT - LOW RISK";

  return buildResult(module, packet, verdict, score, findings, [
    "No vendor accepted on a critical path without a fallback plan.",
    "No approval without compliance and data-handling evidence.",
    "No 'low risk' claim from prose alone.",
  ], [
    { label: "Decision", value: verdict.split(" - ")[0], detail: "Evidence-grounded accept / hold / reject" },
    { label: "Compliance evidence", value: findings.some((f) => f.code === "VENDOR-COMP-001") ? "missing" : "on file", detail: "SOC 2 / ISO / attestation" },
    { label: "Resilience", value: findings.some((f) => f.code === "VENDOR-RESIL-001") ? "single point" : "managed", detail: "Critical-path fallback" },
  ]);
}

function runAccessLens(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];

  addIfPresent(findings, lower, /\badmin\b|\broot\b|wildcard|super\s*user|full\s+control|write\s+to\s+prod/, {
    code: "ACCESS-PRIV-001",
    severity: "high",
    title: "Standing privileged access",
    detail: "Admin / root / wildcard / prod-write entitlements are held on a standing basis.",
    remediation: "Convert standing privilege to time-bound, just-in-time elevation.",
    evidence: "Privileged-grant signal detected.",
  });
  addIfPresent(findings, lower, /\bunused\b|never\b[^.]{0,24}\b(?:used|accessed|logged)|not\s+(?:used|accessed)|no\s+(?:activity|logins?)|zero\s+(?:usage|activity)/, {
    code: "ACCESS-DRIFT-001",
    severity: "high",
    title: "Entitlement drift (unused access)",
    detail: "Entitlements are granted but show little or no matching usage.",
    remediation: "Revoke unused entitlements; enforce least privilege from observed usage.",
    evidence: "Unused-entitlement signal detected.",
  });
  addIfPresent(findings, lower, /\bstanding\b|no\s+expir|never\s+expir|no\s+recertif|no\s+review|without\s+(?:an?\s+)?(?:expir|review|recertif)|permanent\s+(?:grant|access)|indefinite/, {
    code: "ACCESS-REVIEW-001",
    severity: "medium",
    title: "No periodic review / expiry",
    detail: "Access lacks a recertification cadence or expiry (standing / permanent grant).",
    remediation: "Add time-bound grants and a recurring access review.",
    evidence: "Standing-grant / no-expiry signal detected.",
  });

  const score = scoreFromFindings(findings);
  const high = findings.filter((f) => f.severity === "high").length;
  const verdict = high >= 2
    ? "REFUSE - OVER-PERMISSIONED"
    : high
      ? "RIGHT-SIZE REQUIRED"
      : findings.length
        ? "REVIEW RECOMMENDED"
        : "LEAST-PRIVILEGE CLEAN";

  return buildResult(module, packet, verdict, score, findings, [
    "No standing privileged access without a just-in-time path.",
    "No retention of unused entitlements.",
    "No least-privilege claim without usage evidence.",
  ], [
    { label: "Privilege posture", value: high ? "over-permissioned" : "right-sized", detail: "Standing vs. just-in-time" },
    { label: "Drift", value: findings.some((f) => f.code === "ACCESS-DRIFT-001") ? "detected" : "none", detail: "Granted-but-unused entitlements" },
    { label: "Recertification", value: findings.some((f) => f.code === "ACCESS-REVIEW-001") ? "missing" : "scheduled", detail: "Time-bound + periodic review" },
  ]);
}

function runBuildGate(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];

  addIfPresent(findings, lower, /\bmissing\b[^.]{0,40}(?:security|observability|required|approved|mcp|smart)\s*sdk|\b(?:no|without|lacks?)\b[^.]{0,30}(?:security|observability|required|approved|mcp|smart)\s*sdk|\bmissing\s+the\s+required\b|\blacks?\s+(?:the\s+)?(?:required|approved)\b/, {
    code: "BUILD-DEP-001",
    severity: "high",
    title: "Required approved SDK missing",
    detail: "A required approved dependency (security / observability / MCP SDK) is not present.",
    remediation: "Add the required approved dependencies before the build can pass.",
    evidence: "Missing-required-dependency signal detected.",
  });
  addIfPresent(findings, lower, /deprecated|eol|vulnerab|\bcve\b|outside\s+the\s+approved|unapproved|known\s+issue/, {
    code: "BUILD-VER-001",
    severity: "high",
    title: "Disallowed / vulnerable version",
    detail: "A dependency is outside approved version ranges or has a known issue.",
    remediation: "Upgrade to an approved, patched version range.",
    evidence: "Disallowed / vulnerable version signal detected.",
  });
  addIfPresent(findings, lower, /\blatest\b|\*|>=|\^|~|unpinned|version\s+range/, {
    code: "BUILD-PIN-001",
    severity: "medium",
    title: "Unpinned dependency versions",
    detail: "Version ranges or 'latest' allow unapproved versions into the build.",
    remediation: "Pin to approved version ranges and enforce at build time.",
    evidence: "Unpinned-version signal detected.",
  });
  addIfPresent(findings, lower, /no\s+(?:lock\s?file|package-lock|lock)|without\s+(?:a\s+)?lock|missing\s+(?:a\s+)?lock|lock\s?file\s+(?:is\s+)?(?:missing|absent)|not\s+committed|uncommitted\s+lock/, {
    code: "BUILD-LOCK-001",
    severity: "medium",
    title: "No lockfile / provenance",
    detail: "No lockfile is present to make the build reproducible.",
    remediation: "Commit a lockfile and emit a dependency manifest at build time.",
    evidence: "Missing-lockfile signal detected.",
  });

  const score = scoreFromFindings(findings);
  const high = findings.filter((f) => f.severity === "high").length;
  const verdict = high
    ? "FAIL - BUILD GATE BLOCKED"
    : findings.length
      ? "PASS WITH WARNINGS"
      : "PASS - MANIFEST CLEAN";

  return buildResult(module, packet, verdict, score, findings, [
    "No build passes while a required approved dependency is missing.",
    "No manifest released with disallowed or vulnerable versions.",
    "No reproducible-build claim without a lockfile.",
  ], [
    { label: "Gate", value: verdict.split(" - ")[0], detail: "Build-time standards-as-code" },
    { label: "Required deps", value: findings.some((f) => f.code === "BUILD-DEP-001") ? "missing" : "present", detail: "Approved SDK presence" },
    { label: "Manifest", value: high ? "blocked" : "emitted", detail: "Dependency + version manifest" },
  ]);
}

function buildResult(
  module: EngineeringModule,
  packet: string,
  verdict: string,
  score: number,
  findings: EngineeringFinding[],
  refusals: string[],
  artifacts: EngineeringArtifact[],
): EngineeringResult {
  const inputHash = `sha256:${sha256(packet)}`;
  const findingCount = findings.length;

  return {
    mode: module.id,
    product: module.name,
    verdict,
    score,
    posture: postureFor(verdict, findingCount),
    findings,
    refusals,
    artifacts,
    audit: [
      { label: "CORPUS_SEAL", value: ENGINEERING_CORPUS_SEAL.slice(0, 18), detail: "Engineering suite deterministic rule corpus" },
      { label: "PACKET_HASH", value: inputHash.slice(0, 18), detail: "Input packet hash" },
      { label: "RUNNER", value: ENGINE_VERSION, detail: `${module.name} ${module.lane.toLowerCase()} gate` },
      { label: "DECISION", value: verdict, detail: `${findingCount} finding(s), score ${score}` },
    ],
    benchmarkPrompt: buildBenchmarkPrompt(module, packet),
    metadata: {
      engine_version: ENGINE_VERSION,
      corpus_seal: ENGINEERING_CORPUS_SEAL,
      input_hash: inputHash,
      parsed_lines: packet.split(/\r?\n/).filter((line) => line.trim()).length,
      finding_count: findingCount,
    },
  };
}

function missingPacketResult(module: EngineeringModule, packet: string): EngineeringResult {
  return buildResult(module, packet, "REFUSE - MISSING PACKET", 0, [{
    code: `${module.name}-INPUT-001`,
    severity: "critical",
    title: "No packet supplied",
    detail: "The deterministic runner needs a source packet before it can emit a decision.",
    remediation: "Paste a sanitized spec, code-review, estate, or activity packet.",
    evidence: "Packet was empty.",
  }], ["No output without source packet."], [
    { label: "Input", value: "missing", detail: "Paste a packet to run this workbench." },
  ]);
}

function addIfMissing(findings: EngineeringFinding[], lower: string, pattern: RegExp, finding: EngineeringFinding) {
  if (!pattern.test(lower)) findings.push(finding);
}

function addIfPresent(findings: EngineeringFinding[], lower: string, pattern: RegExp, finding: EngineeringFinding) {
  if (pattern.test(lower)) findings.push(finding);
}

function countPatterns(lower: string, patterns: RegExp[]) {
  return patterns.reduce((count, pattern) => count + (pattern.test(lower) ? 1 : 0), 0);
}

function scoreFromFindings(findings: EngineeringFinding[]) {
  const penalty = findings.reduce((sum, finding) => {
    if (finding.severity === "critical") return sum + 32;
    if (finding.severity === "high") return sum + 18;
    if (finding.severity === "medium") return sum + 9;
    return sum + 3;
  }, 0);
  return Math.max(0, 100 - penalty);
}

function postureFor(verdict: string, findingCount: number) {
  if (verdict.startsWith("REFUSE")) return "Blocked. The runner found release-breaking evidence gaps or unsafe behavior.";
  if (verdict.includes("REVIEW")) return "Review required. The packet can be worked, but it is not clean enough for automatic release.";
  if (findingCount > 0) return "Operationally useful with visible findings. Nothing is silently waived.";
  return "Clean deterministic pass. No release blockers detected by this rule corpus.";
}

function buildBenchmarkPrompt(module: EngineeringModule, packet: string) {
  return `You are evaluating a ${module.name} packet. Return a release decision, severity-ranked findings, missing proof, refusal boundaries, and next actions. Do not invent missing evidence.\n\n${packet}`;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, " ");
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
