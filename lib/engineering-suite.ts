import { createHash } from "node:crypto";

export type EngineeringMode =
  | "cadmus"
  | "vantage"
  | "prospector"
  | "luna"
  | "heimdall"
  | "vendor"
  | "access"
  | "buildgate"
  | "warden"
  | "custodian"
  | "sunset"
  | "assay"
  | "herald";
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
  "heimdall-irreversible-edge-brake-v1",
  "decision-gate-vendor-risk-v1",
  "access-right-size-drift-v1",
  "build-gate-standards-as-code-v1",
  "warden-signed-agent-runtime-v1",
  "custodian-data-classification-egress-v1",
  "sunset-decommission-readiness-v1",
  "assay-model-deployment-risk-v1",
  "herald-grounded-brief-v1",
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
    lane: "BRAKE",
    headline: "The brake at the irreversible edge",
    summary:
      "Paste a high-consequence action an agent or pipeline is about to take. HEIMDALL stands at the edge of the decisions you can't take back — it refuses, or it escalates to a named human. It has no AUTHORIZE verdict. The human is the trigger; HEIMDALL is the brake.",
    route: "/omnis/heimdall",
    accent: "#4A7BA7",
    samplePacket: `Task: An autonomous agent is about to take this action. HEIMDALL stands at the irreversible edge — it refuses, or it escalates to a named human. It never authorizes.

Proposed action:
- Action: wire $2,400,000 from the operating account to a new external beneficiary
- Trigger: agent "treasury-bot" decided the invoice looked valid
- Authorization: none named; the agent intends to execute automatically
- Reversibility: none — once the wire settles it cannot be recalled
- Policy basis: not cited; no approval limit or runbook referenced
- Verification: beneficiary not verified; amount not reconciled
- Scope: single external beneficiary

Required posture:
Return HEIMDALL's disposition (REFUSE or ESCALATE — never AUTHORIZE), the irreversible-action class, what grounding is missing, and exactly what a named human must confirm before this can proceed.`,
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
  {
    id: "warden",
    name: "WARDEN",
    lane: "BIND",
    headline: "No agent runs unbound",
    summary:
      "Paste an AI agent's declared identity, tools, and actions. WARDEN binds it to a signed identity and a capability allowlist before it can run — refusing unsigned, unscoped, or unaudited agents. The runtime an agent lives inside, not a checklist.",
    route: "/omnis/warden",
    accent: "#2d6cdf",
    samplePacket: `Task: Bind this agent before it is allowed to run. Refuse if it has no signed identity or no scope boundary.

Agent manifest:
- Name: ops-assistant
- Identity: none — runs as a shared service token, no signed identity
- Tools requested: Slack, Google Drive, GitHub, shell exec, prod database (wildcard access "to be useful")
- Actions: can open tickets and run scripts on the user's behalf
- Allowlist: none declared
- Audit: no tamper-evident log of tool calls

Required posture:
Return the binding decision (bind / refuse), the missing signed identity, the over-broad scopes to cut, the allowlist that must be declared, and the audit requirement before this agent may run.`,
  },
  {
    id: "custodian",
    name: "CUSTODIAN",
    lane: "CLASSIFY",
    headline: "No sensitive data leaves uncontrolled",
    summary:
      "Paste a data flow or export. CUSTODIAN classifies sensitivity (PII / PCI / MNPI), detects egress past the perimeter, and refuses an uncontrolled export — no encryption, no need-to-know, no residency. Privacy enforced, not assumed.",
    route: "/omnis/custodian",
    accent: "#0e8f6e",
    samplePacket: `Task: Classify this data flow and decide whether the export may proceed. Refuse uncontrolled egress of sensitive data.

Data flow:
- Source: core banking customer table
- Fields: full name, account number, SSN, transaction history (PII + PCI)
- Action: export a CSV and upload it to a third-party analytics vendor outside the firm
- Controls: no encryption in transit, no tokenization, no redaction
- Recipients: vendor support team (no need-to-know stated)
- Residency: vendor stores data in an unspecified region (possible cross-border)

Required posture:
Return the data classification, the egress decision (clear / hold / refuse), the missing controls, and what must be true before any regulated data leaves the perimeter.`,
  },
  {
    id: "sunset",
    name: "SUNSET",
    lane: "RETIRE",
    headline: "No system dies while it's load-bearing",
    summary:
      "Paste a system proposed for decommission. SUNSET checks dependents, live traffic, ownership, data preservation, and rollback — and refuses to retire anything still load-bearing. A go / no-go gate for turning things off safely.",
    route: "/omnis/sunset",
    accent: "#d6552b",
    samplePacket: `Task: Decide whether this system is safe to decommission. Refuse if it is still load-bearing.

Decommission packet:
- System: legacy-rate-calc service
- Dependents: still called by the settlement pipeline and two downstream reports
- Traffic: ~4,000 production requests/day, active users this week
- Owner: none — the original team was reorganized away
- Data: no archive or retention plan for its historical outputs
- Rollback: no kill switch or staged cutover described

Required posture:
Return the decommission decision (go / hold / refuse), the active dependents and traffic that block it, the owner who must sign off, the data to preserve, and the rollback path required.`,
  },
  {
    id: "assay",
    name: "ASSAY",
    lane: "PROVE",
    headline: "No model ships unproven",
    summary:
      "Paste an AI/ML model deployment packet. ASSAY refuses a model that reaches production without evaluation, fairness testing, monitoring, a rollback path, and a model card. Responsible-AI release discipline, deterministic.",
    route: "/omnis/assay",
    accent: "#8a4fff",
    samplePacket: `Task: Decide whether this model may deploy to production. Refuse if it is unproven or auto-approved.

Model deployment packet:
- Model: credit-decisioning LLM, going to the production lending flow
- Evaluation: none attached; no held-out test set or accuracy measured
- Fairness: no bias or subgroup testing
- Monitoring: no drift detection, alerting, or telemetry described
- Rollback: no champion/challenger, canary, or revert path
- Model card: none; training data provenance unknown
- Process: set to auto-approve and self-deploy with no human sign-off

Required posture:
Return the deployment decision (deploy / hold / refuse), the missing evaluation and monitoring, the rollback path required, and what must be proven before this model can serve a decision.`,
  },
  {
    id: "herald",
    name: "HERALD",
    lane: "GROUND",
    headline: "No claim survives without a receipt",
    summary:
      "Paste a draft executive brief or readout. HERALD refuses any line that isn't grounded — numbers without a source, claims without evidence, no as-of date, no verifiable receipt. Every sentence cites its proof or gets cut.",
    route: "/omnis/herald",
    accent: "#b5882b",
    samplePacket: `Task: Ground this executive brief. Refuse claims that are not backed by a cited source or receipt.

Draft brief:
- "We obviously crushed the quarter and everyone agrees this is our best work."
- "Revenue is up 340% and churn is basically zero."
- "The new platform will definitely save $12M next year, guaranteed."
- "Adoption is through the roof across every region."
- No sources, no as-of date, no receipts, no ledger references are attached.

Required posture:
Return the grounding decision (grounded / revise / refuse), the unsupported claims, the numbers missing a source or date, and exactly what receipt each line needs before it can ship to the cabinet.`,
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
  if (mode === "buildgate") return runBuildGate(module, cleanPacket);
  if (mode === "warden") return runWarden(module, cleanPacket);
  if (mode === "custodian") return runCustodian(module, cleanPacket);
  if (mode === "sunset") return runSunset(module, cleanPacket);
  if (mode === "assay") return runAssay(module, cleanPacket);
  return runHerald(module, cleanPacket);
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

  // HEIMDALL stands at the irreversible edge. First: is there a high-consequence,
  // irreversible action here at all? If not, HEIMDALL stands down — it does not
  // authorize routine work. There is no AUTHORIZE verdict anywhere in this engine.
  const actionClasses: Array<[RegExp, string]> = [
    [/\bwire\b|\btransfer(?:s|red|ring)?\b|\bpayment\b|\bdisburse\b|\bremit\b|\bach\b|\bswift\b|settle(?:s|ment)?\b|\btrade\b|execute\s+(?:the\s+)?(?:order|trade)|move\s+(?:\$|funds|money|cash)/, "money movement"],
    [/\bdelete\b|drop\s+table|\bpurge\b|\bwipe\b|\btruncate\b|deprovision|\bdestroy\b|\berase\b|remove\s+(?:all|the|every)/, "destructive data change"],
    [/\bdeploy\b|release\s+to\s+prod|push\s+to\s+prod|\bcutover\b|\brollout\b|ship\s+to\s+prod|production\s+release/, "production release"],
    [/grant\s+(?:admin|access|root|privilege)|escalate\s+privilege|provision\s+(?:access|credential)|issue\s+(?:a\s+)?credential|add\s+to\s+(?:the\s+)?admin/, "privileged access grant"],
    [/send\s+to\s+external|\bpublish\b|\bdisclose\b|share\s+externally|post\s+publicly|email\s+(?:the\s+|all\s+)?customers?|notify\s+(?:all\s+)?customers/, "external disclosure"],
    [/close\s+(?:the\s+)?account|\bterminate\b|\boffboard\b|freeze\s+(?:the\s+)?account|suspend\s+(?:the\s+)?account|\brevoke\b/, "account lifecycle action"],
  ];
  const matched = actionClasses.find(([re]) => affirmsPresence(lower, re));
  const actionClass = matched ? matched[1] : null;

  if (!actionClass) {
    return buildResult(module, packet, "HOLD - NOT THE IRREVERSIBLE EDGE", 100, [], [
      "HEIMDALL guards only the irreversible edge — the decisions you can't take back.",
      "HEIMDALL has no AUTHORIZE verdict. Standing down on a reversible action is not approval.",
    ], [
      { label: "Irreversible action", value: "none detected", detail: "No high-consequence, irreversible action in this packet" },
      { label: "Disposition", value: "not HEIMDALL's edge", detail: "Route through the normal control; HEIMDALL stands down" },
      { label: "Authorize verdict", value: "does not exist", detail: "HEIMDALL refuses or escalates — it never authorizes" },
    ]);
  }

  // There IS an irreversible action. Every gap below is a reason to brake.
  addIfMissing(findings, lower, /approved\s+by|authorized\s+by|sign[-\s]?off|maker[-\s]?checker|dual\s+control|four[-\s]?eyes|named\s+approver|approver\s*:/, {
    code: "HEIMDALL-AUTH-001",
    severity: "critical",
    title: "No named human authorizer",
    detail: "An irreversible action is proposed with no named human who authorizes it.",
    remediation: "Bind the action to a named human authorizer. HEIMDALL escalates to them — it does not authorize.",
    evidence: "No human-authorizer signal found.",
  });
  addIfPresent(findings, lower, /auto[-\s]?execute|execute\s+automatically|automatically\s+execute|without\s+(?:human\s+|any\s+)?approval|no\s+(?:human\s+)?approval|skip(?:s|ping)?\s+(?:the\s+)?approval|bypass(?:es|ing)?\s+(?:the\s+)?(?:approval|control|gate|human)|no\s+human\s+in\s+the\s+loop|\bunattended\b|on\s+its\s+own/, {
    code: "HEIMDALL-RECKLESS-001",
    severity: "critical",
    title: "Proposes acting without a human",
    detail: "The action is set to execute automatically, bypassing the human gate.",
    remediation: "Remove auto-execute. The agent proposes; a named human authorizes; HEIMDALL only refuses or escalates.",
    evidence: "Auto-execute / bypass-human signal detected.",
  });
  addIfPresent(findings, lower, /all\s+(?:customers|accounts|users|records|rows)|every\s+(?:customer|account|user|record)|entire\s+(?:table|database|estate|fleet|ledger)|production[-\s]?wide|company[-\s]?wide|\bbulk\b|\bmass\b|wildcard|fleet[-\s]?wide/, {
    code: "HEIMDALL-BLAST-001",
    severity: "critical",
    title: "Unbounded blast radius",
    detail: "The irreversible action is not bounded — it can hit everything at once.",
    remediation: "Bound the action to a named, minimal scope. HEIMDALL refuses unbounded irreversible actions outright.",
    evidence: "Unbounded-scope signal detected.",
  });
  addIfPresent(findings, lower, /irreversible|cannot\s+be\s+(?:recalled|undone|reversed|recovered|reverted)|can'?t\s+be\s+(?:recalled|undone|reversed)|no\s+rollback|no\s+reversal|no\s+way\s+back|permanent(?:ly)?|\bterminal\b|unrecoverable|gone\s+for\s+good|once\s+(?:it|the\s+\w+)\s+settles?/, {
    code: "HEIMDALL-REVERSE-001",
    severity: "high",
    title: "No path back (terminal action)",
    detail: "The action is explicitly irreversible — no rollback, reversal window, or recovery path.",
    remediation: "Add a reversal window or recovery path, or treat as terminal and require senior, named authorization.",
    evidence: "Explicit-irreversibility signal detected.",
  });
  addIfMissing(findings, lower, /approved\s+limit|within\s+(?:the\s+)?(?:approved\s+)?limit|\brunbook\b|control\s+id|policy\s+(?:id|ref|reference|control)|delegated\s+authority|standard\s+operating/, {
    code: "HEIMDALL-POLICY-001",
    severity: "high",
    title: "No policy / authority basis",
    detail: "The action cites no policy, approval limit, or delegated authority that permits it.",
    remediation: "Cite the approval limit, runbook, or delegated authority that permits an action of this consequence.",
    evidence: "No policy/authority-basis signal found.",
  });
  addIfMissing(findings, lower, /verified|reconciled|validated|beneficiary\s+verified|counterparty\s+verified|checksum|evidence\s+attached|confirmation\s+(?:code|number)/, {
    code: "HEIMDALL-EVIDENCE-001",
    severity: "medium",
    title: "Inputs not verified",
    detail: "The facts the action relies on (beneficiary, amount, target) are not verified.",
    remediation: "Require verification of the action's key inputs before it reaches a human authorizer.",
    evidence: "No verification/evidence signal found.",
  });

  const score = scoreFromFindings(findings);
  const critical = findings.filter((f) => f.severity === "critical").length;
  // No AUTHORIZE path exists. Worst case: REFUSE. Best case: ESCALATE to a named human.
  const verdict = critical
    ? "REFUSE - IRREVERSIBLE WITHOUT GROUNDING"
    : "ESCALATE - HUMAN AUTHORIZATION REQUIRED";

  return buildResult(module, packet, verdict, score, findings, [
    "HEIMDALL has no AUTHORIZE verdict. It refuses, or it escalates to a named human.",
    "No irreversible action proceeds without a named human authorizer and a path back.",
    "No unbounded blast radius — ever. The human is the trigger; HEIMDALL is the brake.",
  ], [
    { label: "Irreversible action", value: actionClass, detail: "The high-consequence class HEIMDALL caught at the edge" },
    { label: "Disposition", value: critical ? "REFUSE" : "ESCALATE TO HUMAN", detail: "Refuse · Escalate — never authorize" },
    { label: "Human authorizer", value: findings.some((f) => f.code === "HEIMDALL-AUTH-001") ? "MISSING" : "named", detail: "HEIMDALL never authorizes — a human must" },
    { label: "Path back", value: findings.some((f) => f.code === "HEIMDALL-REVERSE-001") ? "none (terminal)" : "declared", detail: "Rollback / reversal window if it goes wrong" },
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

function runWarden(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];

  addIfMissing(findings, lower, /signed\s+identity|map\s+the\s+soul|cryptographic(?:ally)?\s+(?:signed|identity)|verifiable\s+id(?:entity)?|attested\s+identity|workload\s+identity/, {
    code: "WARDEN-IDENTITY-001",
    severity: "critical",
    title: "No signed identity",
    detail: "The agent has no signed, verifiable identity — it cannot be held accountable for what it does.",
    remediation: "Bind the agent to a signed identity (MAP THE SOUL) before it is allowed to run.",
    evidence: "No signed-identity signal found.",
  });
  addIfPresent(findings, lower, /wildcard|all\s+access|full\s+access|unrestricted|any\s+tool|admin\s+to\s+everything|needs?\s+everything/, {
    code: "WARDEN-SCOPE-001",
    severity: "critical",
    title: "Over-broad capability scope",
    detail: "The agent requests wildcard or unrestricted access to tools or data.",
    remediation: "Replace blanket access with an explicit per-task allowlist of tools, scopes, and data.",
    evidence: "Wildcard / 'all access' grant detected.",
  });
  addIfMissing(findings, lower, /allowlist|\bscoped?\b|least\s+privilege|permission\s+boundary|approved\s+tools?|capability\s+(?:list|boundary)/, {
    code: "WARDEN-ALLOWLIST-001",
    severity: "high",
    title: "No capability allowlist",
    detail: "The agent declares no allowlist of exactly which tools and data it may use.",
    remediation: "Declare an allowlist enforced at call time — the agent can touch nothing outside it.",
    evidence: "No allowlist/scope boundary found.",
  });
  addIfMissing(findings, lower, /\baudit\b|\blog\b|\btrail\b|\breceipt\b|tamper[-\s]?evident/, {
    code: "WARDEN-AUDIT-001",
    severity: "high",
    title: "No tamper-evident audit",
    detail: "The agent declares no auditable record of the tool calls and data it touches.",
    remediation: "Require a tamper-evident log of every call so the agent's behavior is reconstructable.",
    evidence: "No audit/trail signal found.",
  });
  addIfMissing(findings, lower, /human[-\s]?in[-\s]?the[-\s]?loop|human\s+approval|approval\s+step|\brefuse\b|guardrail/, {
    code: "WARDEN-HUMAN-001",
    severity: "medium",
    title: "No human gate on sensitive actions",
    detail: "Nothing routes sensitive or irreversible actions to a human before execution.",
    remediation: "Require human approval for sensitive actions; the agent proposes, a human disposes.",
    evidence: "No human-in-the-loop signal found.",
  });

  const score = scoreFromFindings(findings);
  const critical = findings.filter((f) => f.severity === "critical").length;
  const high = findings.filter((f) => f.severity === "high").length;
  const verdict = critical
    ? "REFUSE - AGENT UNBOUND"
    : high
      ? "BIND BEFORE RUN"
      : findings.length
        ? "BOUND WITH CONDITIONS"
        : "AGENT BOUND - CLEARED TO RUN";

  return buildResult(module, packet, verdict, score, findings, [
    "No agent runs without a signed identity.",
    "No agent runs with a wildcard scope — allowlist or nothing.",
    "No agent runs without a tamper-evident audit of every call.",
  ], [
    { label: "Identity", value: findings.some((f) => f.code === "WARDEN-IDENTITY-001") ? "UNSIGNED" : "signed", detail: "Signed, verifiable agent identity" },
    { label: "Capability scope", value: findings.some((f) => f.code === "WARDEN-SCOPE-001") ? "wildcard" : "allowlisted", detail: "Enforced at call time" },
    { label: "Audit", value: findings.some((f) => f.code === "WARDEN-AUDIT-001") ? "absent" : "tamper-evident", detail: "Reconstructable record of every call" },
  ]);
}

function runCustodian(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];

  const egress = affirmsPresence(lower, /export|send\s+(?:to\s+)?external|third[-\s]?party|upload\s+to|share\s+externally|public\s+bucket|outside\s+the\s+(?:firm|perimeter)|leaves?\s+the\s+perimeter|cross[-\s]?border|to\s+a\s+vendor/);
  const sensitive = affirmsPresence(lower, /\bpii\b|\bpci\b|\bmnpi\b|\bssn\b|social\s+security|account\s+number|card\s+number|customer\s+(?:data|record)|personal\s+data|material\s+non[-\s]?public|transaction\s+history|health\s+record/);

  if (sensitive) {
    addIfPresent(findings, lower, /\bpii\b|\bpci\b|\bmnpi\b|\bssn\b|social\s+security|account\s+number|card\s+number|customer\s+(?:data|record)|personal\s+data|material\s+non[-\s]?public|transaction\s+history|health\s+record/, {
      code: "CUSTODIAN-SENSITIVE-001",
      severity: "high",
      title: "Regulated / sensitive data in scope",
      detail: "The flow contains PII, PCI, MNPI, or other regulated data.",
      remediation: "Tag the data tier explicitly and apply the controls that tier requires before any movement.",
      evidence: "Sensitive-data class detected.",
    });
  }
  addIfMissing(findings, lower, /classif(?:ied|ication)|\bpublic\b|\binternal\b|confidential|restricted|sensitivity\s+(?:tier|level)|data\s+tier/, {
    code: "CUSTODIAN-CLASS-001",
    severity: "high",
    title: "Data not classified",
    detail: "The data carries no sensitivity classification, so no control tier can be applied.",
    remediation: "Classify the data (public / internal / confidential / restricted) before it moves.",
    evidence: "No classification signal found.",
  });
  if (egress) {
    addIfPresent(findings, lower, /export|send\s+(?:to\s+)?external|third[-\s]?party|upload\s+to|share\s+externally|public\s+bucket|outside\s+the\s+(?:firm|perimeter)|leaves?\s+the\s+perimeter|cross[-\s]?border/, {
      code: "CUSTODIAN-EGRESS-001",
      severity: "high",
      title: "Data leaves the perimeter",
      detail: "The flow moves data past the firm's boundary to an external destination.",
      remediation: "Treat as egress: require encryption, need-to-know, and an approved recipient before it leaves.",
      evidence: "Egress / external-transfer signal detected.",
    });
    addIfMissing(findings, lower, /encrypt(?:ion|ed)?|tokeniz|tokenis|redact|masked|\bdlp\b|need[-\s]?to[-\s]?know|approved\s+recipient|access\s+control/, {
      code: "CUSTODIAN-CONTROL-001",
      severity: "critical",
      title: "Uncontrolled egress",
      detail: "Sensitive data is leaving with no encryption, tokenization, redaction, or need-to-know control.",
      remediation: "Block until encryption-in-transit, minimization, and an approved, need-to-know recipient are in place.",
      evidence: "No egress-control signal found.",
    });
  }
  addIfMissing(findings, lower, /residency|in[-\s]?region|data\s+residency|approved\s+region|jurisdiction|\bregion\b/, {
    code: "CUSTODIAN-RESIDENCY-001",
    severity: "medium",
    title: "Residency not established",
    detail: "Where the data comes to rest (region / jurisdiction) is not specified.",
    remediation: "Pin the storage region to an approved jurisdiction; refuse unspecified cross-border rest.",
    evidence: "No data-residency signal found.",
  });

  const score = scoreFromFindings(findings);
  const critical = findings.filter((f) => f.severity === "critical").length;
  const verdict = critical
    ? "REFUSE - UNCONTROLLED EGRESS"
    : egress
      ? "HOLD - EGRESS CONTROLS REQUIRED"
      : sensitive
        ? "CLASSIFIED - HANDLE PER TIER"
        : findings.length
          ? "REVIEW - CLASSIFY BEFORE MOVING"
          : "CLEAR - NO REGULATED DATA";

  return buildResult(module, packet, verdict, score, findings, [
    "No regulated data leaves the perimeter without encryption and need-to-know.",
    "No data moves before it is classified.",
    "No unspecified cross-border rest for sensitive data.",
  ], [
    { label: "Data tier", value: sensitive ? "regulated (PII/PCI/MNPI)" : "no regulated data", detail: "Highest sensitivity detected" },
    { label: "Egress", value: egress ? (critical ? "uncontrolled" : "controls required") : "stays in-perimeter", detail: "Movement past the firm boundary" },
    { label: "Disposition", value: verdict.split(" - ")[0], detail: "Refuse · Hold · Classify · Clear" },
  ]);
}

function runSunset(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];

  addIfPresent(findings, lower, /still\s+called|active\s+dependent|downstream|consumer|depended\s+on\s+by|upstream\s+of|integrat(?:ed|ion)\s+with|relies\s+on\s+it/, {
    code: "SUNSET-DEPS-001",
    severity: "critical",
    title: "Active dependents",
    detail: "Other systems still depend on this one — retiring it breaks them.",
    remediation: "Migrate or retire every dependent first; do not decommission while it is depended on.",
    evidence: "Active-dependent signal detected.",
  });
  addIfPresent(findings, lower, /live\s+traffic|production\s+traffic|serving|requests?\s*\/?\s*(?:day|hour|min|second)|active\s+users|in\s+active\s+use|\bqps\b|requests\s+per/, {
    code: "SUNSET-TRAFFIC-001",
    severity: "critical",
    title: "Still serving live traffic",
    detail: "The system is still taking production traffic from real users.",
    remediation: "Drain and redirect traffic to zero before decommission; confirm with monitoring.",
    evidence: "Live-traffic signal detected.",
  });
  addIfMissing(findings, lower, /owner|owned\s+by|steward|accountable|responsible\s+team|raci/, {
    code: "SUNSET-OWNER-001",
    severity: "high",
    title: "No accountable owner",
    detail: "No named owner exists to authorize and answer for the decommission.",
    remediation: "Assign an accountable owner who signs off on the retirement.",
    evidence: "No ownership signal found.",
  });
  addIfMissing(findings, lower, /archiv|retention|backup|data\s+(?:migrated|preserved|exported)|preserved|snapshot\s+taken/, {
    code: "SUNSET-DATA-001",
    severity: "high",
    title: "Data not preserved",
    detail: "There is no archive, retention, or migration plan for the system's data.",
    remediation: "Archive or migrate the data with a retention record before turning anything off.",
    evidence: "No data-preservation signal found.",
  });
  addIfMissing(findings, lower, /rollback|restore|reversible|kill\s+switch|staged\s+cutover|canary|phased/, {
    code: "SUNSET-ROLLBACK-001",
    severity: "medium",
    title: "No rollback path",
    detail: "If the decommission goes wrong, there is no described way to bring it back.",
    remediation: "Stage the cutover with a kill switch and a restore path before final shutdown.",
    evidence: "No rollback/staging signal found.",
  });

  const score = scoreFromFindings(findings);
  const critical = findings.filter((f) => f.severity === "critical").length;
  const high = findings.filter((f) => f.severity === "high").length;
  const verdict = critical
    ? "REFUSE - STILL LOAD-BEARING"
    : high
      ? "HOLD - NOT READY TO RETIRE"
      : findings.length
        ? "GO WITH CONDITIONS"
        : "GO - SAFE TO DECOMMISSION";

  return buildResult(module, packet, verdict, score, findings, [
    "No system is retired while another depends on it.",
    "No shutdown while it still serves live traffic.",
    "No decommission without a named owner, preserved data, and a rollback path.",
  ], [
    { label: "Load-bearing", value: critical ? "YES — blocked" : "no", detail: "Active dependents or live traffic" },
    { label: "Owner", value: findings.some((f) => f.code === "SUNSET-OWNER-001") ? "MISSING" : "named", detail: "Who signs off the retirement" },
    { label: "Disposition", value: verdict.split(" - ")[0], detail: "Refuse · Hold · Go" },
  ]);
}

function runAssay(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];

  addIfMissing(findings, lower, /\beval(?:uation)?\b|benchmark|held[-\s]?out|test\s+set|accuracy|validated|\bf1\b|precision|recall/, {
    code: "ASSAY-EVAL-001",
    severity: "critical",
    title: "No evaluation",
    detail: "The model reaches production with no measured accuracy or held-out evaluation.",
    remediation: "Attach an evaluation on a held-out set with the metrics that matter for this use.",
    evidence: "No evaluation signal found.",
  });
  addIfPresent(findings, lower, /auto[-\s]?approve|self[-\s]?deploy|ship\s+without\s+review|no\s+human\s+sign|deploy\s+automatically|without\s+(?:any\s+)?review/, {
    code: "ASSAY-AUTO-001",
    severity: "critical",
    title: "Auto-approved deployment",
    detail: "The model is set to ship to production with no human sign-off.",
    remediation: "Require a named human approval before a model serves real decisions.",
    evidence: "Auto-approve / self-deploy signal detected.",
  });
  addIfMissing(findings, lower, /bias|fairness|disparate|subgroup|demographic|equit/, {
    code: "ASSAY-BIAS-001",
    severity: "high",
    title: "No fairness testing",
    detail: "No bias or subgroup fairness testing is described for a consequential model.",
    remediation: "Test for disparate impact across protected subgroups before deployment.",
    evidence: "No fairness/bias signal found.",
  });
  addIfMissing(findings, lower, /monitor|drift|observability|alerting|telemetry|logging/, {
    code: "ASSAY-MONITOR-001",
    severity: "high",
    title: "No production monitoring",
    detail: "No drift detection, alerting, or telemetry is in place for the live model.",
    remediation: "Wire drift + performance monitoring with alerts before go-live.",
    evidence: "No monitoring signal found.",
  });
  addIfMissing(findings, lower, /rollback|fallback|champion|challenger|shadow|canary|revert/, {
    code: "ASSAY-ROLLBACK-001",
    severity: "high",
    title: "No rollback path",
    detail: "There is no champion/challenger, canary, or revert path if the model misbehaves.",
    remediation: "Stage with a canary and keep a revert path to the prior model.",
    evidence: "No rollback signal found.",
  });
  addIfMissing(findings, lower, /model\s+card|datasheet|documented|provenance|training\s+data|lineage/, {
    code: "ASSAY-CARD-001",
    severity: "medium",
    title: "No model card",
    detail: "The model ships with no card documenting its intended use, data, and limits.",
    remediation: "Publish a model card with intended use, training-data provenance, and known limits.",
    evidence: "No model-card signal found.",
  });

  const score = scoreFromFindings(findings);
  const critical = findings.filter((f) => f.severity === "critical").length;
  const high = findings.filter((f) => f.severity === "high").length;
  const verdict = critical
    ? "REFUSE - MODEL UNPROVEN"
    : high
      ? "HOLD - EVIDENCE REQUIRED"
      : findings.length
        ? "DEPLOY WITH CONDITIONS"
        : "PROVEN - CLEARED TO DEPLOY";

  return buildResult(module, packet, verdict, score, findings, [
    "No model ships without a held-out evaluation.",
    "No model serves a decision without monitoring and a rollback path.",
    "No model auto-deploys without a named human sign-off.",
  ], [
    { label: "Evaluation", value: findings.some((f) => f.code === "ASSAY-EVAL-001") ? "MISSING" : "measured", detail: "Held-out accuracy on the metrics that matter" },
    { label: "Monitoring", value: findings.some((f) => f.code === "ASSAY-MONITOR-001") ? "absent" : "live", detail: "Drift + performance alerting" },
    { label: "Disposition", value: verdict.split(" - ")[0], detail: "Refuse · Hold · Deploy" },
  ]);
}

function runHerald(module: EngineeringModule, packet: string): EngineeringResult {
  const lower = normalize(packet);
  const findings: EngineeringFinding[] = [];
  const hasNumbers = /\d+\s*%|\$\s*\d|\b\d+x\b|\d{2,}/.test(lower);

  addIfMissing(findings, lower, /\bcit(?:e|ation|ed)\b|\bsource\b|\breceipt\b|\bhash\b|reference|evidence|per\s+the|\[\d|according\s+to|ledger/, {
    code: "HERALD-CITATION-001",
    severity: "high",
    title: "Claims without citations",
    detail: "The brief makes assertions with no source, receipt, or reference behind them.",
    remediation: "Attach a source or receipt to every claim; cut what can't be cited.",
    evidence: "No citation/source signal found.",
  });
  addIfPresent(findings, lower, /everyone\s+(?:knows|agrees)|obviously|clearly\s+the\s+best|trust\s+me|no\s+doubt|surely|basically\s+zero|through\s+the\s+roof|crushed\s+(?:it|the)|best\s+work/, {
    code: "HERALD-CLAIM-001",
    severity: "high",
    title: "Unsupported superlatives",
    detail: "The brief leans on persuasion words ('obviously', 'everyone agrees', 'crushed it') in place of evidence.",
    remediation: "Replace each superlative with a measured number and its source, or remove it.",
    evidence: "Unsupported-superlative language detected.",
  });
  addIfPresent(findings, lower, /\bguaranteed\b|will\s+definitely|definitely\s+(?:save|grow|win)|certain\s+to|promis(?:e|ed)\s+to/, {
    code: "HERALD-FORECAST-001",
    severity: "high",
    title: "Guaranteed forecast",
    detail: "A future projection is stated as a certainty with no basis or confidence range.",
    remediation: "State projections with assumptions and a range, not as guarantees.",
    evidence: "Guaranteed-forecast language detected.",
  });
  if (hasNumbers) {
    addIfMissing(findings, lower, /\bsource\b|as\s+of|measured|per\s+the|baseline|methodology|\bcit/, {
      code: "HERALD-METRIC-001",
      severity: "medium",
      title: "Numbers without provenance",
      detail: "Figures are quoted with no source, as-of date, or measurement basis.",
      remediation: "Give every number a source and an as-of date, or mark it as an estimate.",
      evidence: "Quantitative claim without provenance.",
    });
  }
  addIfMissing(findings, lower, /as\s+of|dated|timestamp|\bq[1-4]\b|fy\d|20\d{2}|this\s+(?:quarter|month|week)/, {
    code: "HERALD-DATE-001",
    severity: "medium",
    title: "No as-of date",
    detail: "The brief carries no as-of date, so a reader can't tell if it's current.",
    remediation: "Stamp the brief and its key figures with an as-of date.",
    evidence: "No as-of date signal found.",
  });
  addIfMissing(findings, lower, /receipt|\bhash\b|ledger|sha256|verifiable|tamper[-\s]?evident/, {
    code: "HERALD-RECEIPT-001",
    severity: "high",
    title: "No verifiable receipts",
    detail: "Nothing in the brief is backed by a verifiable receipt a reader could re-check.",
    remediation: "Regenerate the brief from a ledger so every line cites a hash a reader can verify.",
    evidence: "No receipt/ledger signal found.",
  });

  const score = scoreFromFindings(findings);
  const high = findings.filter((f) => f.severity === "high").length;
  const verdict = high >= 3
    ? "REFUSE - UNGROUNDED BRIEF"
    : high
      ? "REVISE - CITE OR CUT"
      : findings.length
        ? "GROUNDED WITH GAPS"
        : "GROUNDED - EVERY LINE CITED";

  return buildResult(module, packet, verdict, score, findings, [
    "No claim survives without a source or a receipt.",
    "No number ships without provenance and an as-of date.",
    "No projection is stated as a guarantee.",
  ], [
    { label: "Citations", value: findings.some((f) => f.code === "HERALD-CITATION-001") ? "MISSING" : "present", detail: "A source behind every claim" },
    { label: "Receipts", value: findings.some((f) => f.code === "HERALD-RECEIPT-001") ? "none" : "verifiable", detail: "Re-checkable ledger hashes" },
    { label: "Disposition", value: verdict.split(" - ")[0], detail: "Refuse · Revise · Grounded" },
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

// A positive/grounding signal counts as PRESENT only if it appears in a
// NON-negated position. "no encryption", "evaluation: none", "without a
// lockfile" must NOT satisfy a presence requirement — the gate fires instead
// of being fooled by the negated mention. (Inverse of the addIfPresent guard.)
function affirmsPresence(lower: string, pattern: RegExp): boolean {
  const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(lower)) !== null) {
    if (!isNegated(lower, m.index)) return true;
    if (m.index === re.lastIndex) re.lastIndex++;
  }
  return false;
}

function addIfMissing(findings: EngineeringFinding[], lower: string, pattern: RegExp, finding: EngineeringFinding) {
  if (!affirmsPresence(lower, pattern)) findings.push(finding);
}

// A bad-signal keyword only counts if it is NOT negated within its own clause.
// The cue must sit between a negator and the match, spanning only words / spaces /
// hyphens (punctuation ends the negation scope), e.g. "no wildcard", "not deprecated",
// "cannot send email", "no eval or child_process". Absence rules ("no expiry",
// "no fallback") bake the negator INTO their pattern, so the text *before* the match
// has no preceding negator and they still fire correctly.
const NEGATION_CUE = /\b(?:no|not|never|without|cannot|can['’]?t|won['’]?t|don['’]?t|doesn['’]?t|isn['’]?t|aren['’]?t|wasn['’]?t|weren['’]?t|lacks?|lacking|absent|excludes?|excluding|prohibits?|forbids?|denies|disallows?|prevents?|free\s+of|zero)\b[\s\w-]{0,18}$/;

function isNegated(lower: string, index: number): boolean {
  return NEGATION_CUE.test(lower.slice(Math.max(0, index - 26), index));
}

function addIfPresent(findings: EngineeringFinding[], lower: string, pattern: RegExp, finding: EngineeringFinding) {
  const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(lower)) !== null) {
    if (!isNegated(lower, m.index)) { findings.push(finding); return; }
    if (m.index === re.lastIndex) re.lastIndex++; // guard against zero-width matches
  }
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
