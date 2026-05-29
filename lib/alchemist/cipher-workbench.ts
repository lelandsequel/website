import { createHash } from "node:crypto";

export type CipherMode = "dcf" | "comps";

export type CipherMetric = {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "warning" | "danger";
};

export type CipherProofRow = {
  id: string;
  source: string;
  detail: string;
  hash: string;
};

export type CipherRefusal = {
  code: string;
  severity: "HARD" | "SOFT";
  message: string;
  remediation: string;
};

export type CipherPeerRow = {
  ticker: string;
  company: string;
  sector: string;
  evRevenue: string;
  evEbitda: string;
  revenue: string;
  ebitda: string;
  refusal?: string;
};

export type CipherWorkbenchResult = {
  mode: CipherMode;
  runId: string;
  ticker: string;
  company: string;
  sector: string;
  decision: "PASS" | "REVIEW" | "REFUSE";
  headline: string;
  summary: string;
  generatedAt: string;
  corpusSeal: string;
  metrics: CipherMetric[];
  proofRows: CipherProofRow[];
  refusals: CipherRefusal[];
  peerRows?: CipherPeerRow[];
};

type SecTickerRow = {
  cik_str: number;
  ticker: string;
  title: string;
};

type SecFact = {
  accn?: string;
  end?: string;
  filed?: string;
  form?: string;
  fp?: string;
  fy?: number;
  start?: string;
  val?: number;
};

type SecFactTag = {
  units?: Record<string, readonly SecFact[]>;
};

type CompanyFactsResponse = {
  entityName?: string;
  facts?: {
    "us-gaap"?: Record<string, SecFactTag>;
  };
};

type SubmissionResponse = {
  name?: string;
  sic?: string;
  sicDescription?: string;
};

type PickedFact = {
  tag: string;
  unit: string;
  value: number;
  end: string;
  filed?: string;
  fy?: number;
  accn?: string;
};

type PublicCompanyProfile = {
  ticker: string;
  company: string;
  cik: number;
  sector: string;
  revenue: number;
  ebitda: number;
  ebit: number;
  fcf: number;
  netDebt: number;
  marketCap: number;
  shares: number;
  price: number;
  growth: number;
  taxRate: number;
  bookEquity: number;
  sources: string[];
};

const SEC_USER_AGENT = "JourdanLabs CIPHER public workbench leland@jourdanlabs.com";
const SEC_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json";
const ENGINE_VERSION = "cipher-local-workbench-v0.1.0";
const CORPUS_SEAL = `sha256:${sha256("cipher-local-workbench:dcf:comps:sec-company-facts:stooq-market-snapshot:v0.1.0")}`;

const revenueTags = [
  "Revenues",
  "RevenueFromContractWithCustomerExcludingAssessedTax",
  "RevenueFromContractWithCustomerIncludingAssessedTax",
  "SalesRevenueNet",
  "SalesRevenueGoodsNet",
  "OilAndGasRevenue",
];
const operatingIncomeTags = ["OperatingIncomeLoss"];
const pretaxTags = [
  "IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments",
  "IncomeLossFromContinuingOperationsBeforeIncomeTaxes",
  "IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest",
];
const interestTags = ["InterestExpenseDebt", "InterestExpenseNonOperating", "InterestExpense"];
const depreciationTags = [
  "DepreciationDepletionAndAmortization",
  "DepreciationAndAmortization",
  "DepreciationDepletionAndAmortizationExpense",
  "Depreciation",
];
const cfoTags = ["NetCashProvidedByUsedInOperatingActivities"];
const capexTags = [
  "PaymentsToAcquirePropertyPlantAndEquipment",
  "PaymentsToAcquireProductiveAssets",
  "PaymentsToAcquireOilAndGasPropertyAndEquipment",
  "CapitalExpendituresIncurredButNotYetPaid",
  "PropertyPlantAndEquipmentAdditions",
];
const taxTags = ["IncomeTaxExpenseBenefit"];
const debtTotalTags = [
  "LongTermDebtAndFinanceLeaseObligationsIncludingCurrentMaturities",
  "LongTermDebtAndCapitalLeaseObligationsIncludingCurrentMaturities",
  "LongTermDebtAndFinanceLeaseObligations",
  "LongTermDebtAndCapitalLeaseObligations",
];
const debtCurrentTags = ["LongTermDebtCurrent", "DebtCurrent", "ShortTermBorrowings"];
const debtNoncurrentTags = ["LongTermDebtNoncurrent", "LongTermDebt"];
const cashTags = [
  "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents",
  "CashAndCashEquivalentsAtCarryingValue",
  "Cash",
];
const equityTags = [
  "StockholdersEquity",
  "StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest",
];
const sharesInstantTags = [
  "EntityCommonStockSharesOutstanding",
  "SharesOutstanding",
  "CommonStocksIncludingAdditionalPaidInCapitalSharesOutstanding",
];
const sharesAnnualTags = ["WeightedAverageNumberOfDilutedSharesOutstanding"];

const peerSets: Record<string, readonly string[]> = {
  Energy: ["XOM", "COP", "SHEL", "BP", "TTE", "MPC", "VLO", "PSX"],
  Semiconductors: ["AMD", "AVGO", "TSM", "ASML", "MU", "QCOM", "TXN"],
  Retail: ["LOW", "WMT", "COST", "TGT", "TSCO", "BBY"],
  "Industrial Materials": ["MLM", "VMC", "SUM", "EXP", "USLM"],
  "Public Company": ["AAPL", "MSFT", "GOOGL", "AMZN", "META"],
};

const profileCache = new Map<string, Promise<PublicCompanyProfile | null>>();

export async function runCipherWorkbench(mode: CipherMode, requestedTicker: string): Promise<CipherWorkbenchResult> {
  const ticker = normalizeTicker(requestedTicker);
  if (!ticker) return missingTicker(mode);

  const profile = await resolvePublicCompanyProfile(ticker);
  if (!profile) return sourceRefusal(mode, ticker);

  return mode === "comps" ? runComps(profile) : runDcf(profile);
}

export function cipherWorkbenchManifest() {
  return {
    engine_version: ENGINE_VERSION,
    corpus_seal: CORPUS_SEAL,
    modes: ["dcf", "comps"],
    source_policy: "SEC Company Facts + SEC submissions metadata + Stooq market snapshot; no external iframe.",
  };
}

function runDcf(profile: PublicCompanyProfile): CipherWorkbenchResult {
  const generatedAt = new Date().toISOString();
  const wacc = profile.sector === "Semiconductors" ? 0.095 : profile.sector === "Retail" ? 0.085 : 0.09;
  const terminalGrowth = profile.growth > 0.12 ? 0.03 : 0.025;
  const normalizedFcf = profile.fcf > 0 ? profile.fcf : profile.ebit * (1 - profile.taxRate) * 0.65;
  const refusals: CipherRefusal[] = [];

  if (profile.revenue <= 0) {
    refusals.push(refusal("DCF-REV-001", "HARD", "Revenue is non-positive or unresolved.", "Attach a current filing with positive revenue before running DCF math."));
  }
  if (normalizedFcf <= 0) {
    refusals.push(refusal("DCF-FCF-001", "HARD", "Free cash flow proxy is non-positive.", "Provide normalized FCF support before presenting a DCF output."));
  }
  if (wacc <= terminalGrowth) {
    refusals.push(refusal("DCF-TV-001", "HARD", "WACC must exceed terminal growth.", "Raise discount rate or lower terminal growth before computing terminal value."));
  }

  const runId = `cipher_${shortHash(`dcf:${profile.ticker}:${generatedAt}`)}`;
  if (refusals.some((item) => item.severity === "HARD")) {
    return {
      mode: "dcf",
      runId,
      ticker: profile.ticker,
      company: profile.company,
      sector: profile.sector,
      decision: "REFUSE",
      headline: `CIPHER refused DCF output for ${profile.ticker}`,
      summary: "The engine found a hard denominator or source boundary before valuation math. It refused instead of dressing up a bad model.",
      generatedAt,
      corpusSeal: CORPUS_SEAL,
      metrics: [
        metric("Revenue", money(profile.revenue), "neutral"),
        metric("FCF proxy", money(normalizedFcf), "danger"),
        metric("WACC", percent(wacc), "neutral"),
        metric("Output", "refused", "danger"),
      ],
      proofRows: baseProofRows(profile, "dcf"),
      refusals,
    };
  }

  const explicitValue = range(5).reduce((sum, index) => {
    const year = index + 1;
    const fade = Math.max(profile.growth * (1 - index * 0.14), terminalGrowth);
    const fcf = normalizedFcf * (1 + fade) ** year;
    return sum + fcf / (1 + wacc) ** year;
  }, 0);
  const terminalFcf = normalizedFcf * (1 + terminalGrowth);
  const terminalValue = terminalFcf / (wacc - terminalGrowth) / (1 + wacc) ** 5;
  const enterpriseValue = explicitValue + terminalValue;
  const equityValue = enterpriseValue - profile.netDebt;
  const valuePerShare = equityValue / profile.shares;
  const marketPrice = profile.marketCap / profile.shares;
  const delta = valuePerShare / marketPrice - 1;

  if (profile.ebitda <= 0) {
    refusals.push(refusal("DCF-EBITDA-001", "SOFT", "EBITDA is non-positive, so the output must be treated as a cash-flow scenario requiring review.", "Do not present this as a price target; reconcile normalized EBITDA and cash flow first."));
  }

  return {
    mode: "dcf",
    runId,
    ticker: profile.ticker,
    company: profile.company,
    sector: profile.sector,
    decision: refusals.length ? "REVIEW" : "PASS",
    headline: `CIPHER DCF implies ${money(equityValue)} scenario equity value for ${profile.ticker}`,
    summary: "CIPHER computes a source-backed DCF scenario, stamps the assumptions, and refuses to call it a price target.",
    generatedAt,
    corpusSeal: CORPUS_SEAL,
    metrics: [
      metric("Enterprise value", money(enterpriseValue), "neutral"),
      metric("Equity value", money(equityValue), "warning"),
      metric("Scenario / share", dollars(valuePerShare), "warning"),
      metric("Scenario delta", percent(delta), "warning"),
    ],
    proofRows: [
      ...baseProofRows(profile, "dcf"),
      proof("DCF-001", "assumption", `WACC ${percent(wacc)}; terminal growth ${percent(terminalGrowth)}; revenue CAGR ${percent(profile.growth)}.`),
      proof("DCF-002", "compute", `PV explicit period ${money(explicitValue)} + PV terminal ${money(terminalValue)} = EV ${money(enterpriseValue)}.`),
      proof("DCF-003", "compute", `Equity value ${money(equityValue)} = EV ${money(enterpriseValue)} - net debt ${money(profile.netDebt)}.`),
    ],
    refusals,
  };
}

async function runComps(profile: PublicCompanyProfile): Promise<CipherWorkbenchResult> {
  const generatedAt = new Date().toISOString();
  const peers = peerSet(profile);
  const peerProfiles = await Promise.all(peers.map((ticker) => resolvePublicCompanyProfile(ticker)));
  const validPeers = peerProfiles.filter((item): item is PublicCompanyProfile => Boolean(item));
  const peerRows = [profile, ...validPeers].map(toPeerRow);
  const targetEvRevenue = ev(profile) / profile.revenue;
  const revenueMultiples = validPeers.filter((peer) => peer.revenue > 0).map((peer) => ev(peer) / peer.revenue).sort((a, b) => a - b);
  const medianRevenueMultiple = median(revenueMultiples);
  const impliedEv = medianRevenueMultiple ? medianRevenueMultiple * profile.revenue : null;
  const refusals: CipherRefusal[] = [];

  if (profile.revenue <= 0) {
    refusals.push(refusal("COMPS-REV-001", "HARD", "Revenue is non-positive or unresolved.", "Attach a current filing with positive revenue before revenue multiples."));
  }
  if (profile.ebitda <= 0) {
    refusals.push(refusal("COMPS-EBITDA-001", "HARD", "EV/EBITDA refused because EBITDA is non-positive.", "Use revenue multiples or provide normalized EBITDA support."));
  }
  if (validPeers.length < 3) {
    refusals.push(refusal("COMPS-PEER-001", "SOFT", "Fewer than three peer profiles resolved from live sources.", "Review peer selection or add manual peers before external use."));
  }

  return {
    mode: "comps",
    runId: `comps_${shortHash(`comps:${profile.ticker}:${generatedAt}`)}`,
    ticker: profile.ticker,
    company: profile.company,
    sector: profile.sector,
    decision: refusals.some((item) => item.severity === "HARD") ? "REVIEW" : "PASS",
    headline: `${profile.ticker} screens at ${formatMultiple(targetEvRevenue)} EV / Revenue`,
    summary: "COMPS builds a live public peer table and refuses unsafe denominators instead of filling every cell.",
    generatedAt,
    corpusSeal: CORPUS_SEAL,
    metrics: [
      metric("Target EV / Revenue", formatMultiple(targetEvRevenue), "neutral"),
      metric("Peer median EV / Revenue", medianRevenueMultiple ? formatMultiple(medianRevenueMultiple) : "refused", medianRevenueMultiple ? "neutral" : "danger"),
      metric("Median-implied EV", impliedEv ? money(impliedEv) : "refused", impliedEv ? "neutral" : "danger"),
      metric("Resolved peers", `${validPeers.length}/${peers.length}`, validPeers.length >= 3 ? "success" : "warning"),
    ],
    proofRows: [
      ...baseProofRows(profile, "comps"),
      proof("COMPS-001", "peer_policy", `Peer candidates: ${peers.join(", ")}.`),
      proof("COMPS-002", "compute", `Target EV / Revenue = ${money(ev(profile))} / ${money(profile.revenue)}.`),
      proof("COMPS-003", "refusal_scan", `${refusals.length} refusal(s) emitted across peer and denominator checks.`),
    ],
    refusals,
    peerRows,
  };
}

async function resolvePublicCompanyProfile(requestedTicker: string): Promise<PublicCompanyProfile | null> {
  const ticker = normalizeTicker(requestedTicker);
  if (!ticker) return null;

  const existing = profileCache.get(ticker);
  if (existing) return existing;

  const promise = resolvePublicCompanyProfileUncached(ticker).catch(() => null);
  profileCache.set(ticker, promise);
  return promise;
}

async function resolvePublicCompanyProfileUncached(ticker: string): Promise<PublicCompanyProfile | null> {
  const company = await resolveTicker(ticker);
  if (!company) return null;

  const cik = String(company.cik_str).padStart(10, "0");
  const factsUrl = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`;
  const submissionsUrl = `https://data.sec.gov/submissions/CIK${cik}.json`;
  const [facts, submissions, market] = await Promise.all([
    fetchJson<CompanyFactsResponse>(factsUrl, true),
    fetchJson<SubmissionResponse>(submissionsUrl, true),
    fetchStooqQuote(ticker),
  ]);

  const usGaap = facts?.facts?.["us-gaap"];
  if (!usGaap || !market) return null;

  const revenueSeries = annualSeries(usGaap, revenueTags, "USD");
  const revenue = latest(revenueSeries);
  const operatingIncome = latest(annualSeries(usGaap, operatingIncomeTags, "USD"));
  const pretax = latest(annualSeries(usGaap, pretaxTags, "USD"));
  const depreciation = latest(annualSeries(usGaap, depreciationTags, "USD"));
  const cfo = latest(annualSeries(usGaap, cfoTags, "USD"));
  const capex = latest(annualSeries(usGaap, capexTags, "USD"));
  const tax = latest(annualSeries(usGaap, taxTags, "USD"));
  const equity = latestInstant(usGaap, equityTags, "USD");
  const cash = latestInstant(usGaap, cashTags, "USD");
  const debt = resolveDebt(usGaap);
  const shares =
    latestInstant(usGaap, sharesInstantTags, "shares") ??
    latest(annualSeries(usGaap, sharesAnnualTags, "shares"));

  if (!revenue || !cfo || !capex || !equity || !shares) return null;

  const ebitValue = operatingIncome?.value ?? sumFacts(pretax, latest(annualSeries(usGaap, interestTags, "USD")));
  if (ebitValue === undefined) return null;

  const depreciationValue = depreciation?.value ?? 0;
  const sector = sectorFromSic(submissions?.sic, submissions?.sicDescription);
  const sharesMillions = toMillions(shares.value);
  if (sharesMillions <= 0 || revenue.value <= 0) return null;

  const taxRate = clamp(pretax?.value && tax ? tax.value / pretax.value : 0.21, 0.05, 0.4);
  const netDebt = toMillions((debt?.value ?? 0) - (cash?.value ?? 0));
  const marketCap = market.close * sharesMillions;

  return {
    ticker,
    company: submissions?.name ?? facts.entityName ?? company.title,
    cik: company.cik_str,
    sector,
    revenue: toMillions(revenue.value),
    ebitda: toMillions(ebitValue + depreciationValue),
    ebit: toMillions(ebitValue),
    fcf: toMillions(cfo.value - Math.abs(capex.value)),
    netDebt,
    marketCap,
    shares: sharesMillions,
    price: market.close,
    growth: calculateGrowth(revenueSeries),
    taxRate,
    bookEquity: toMillions(equity.value),
    sources: [
      `SEC ticker resolution: ${SEC_TICKERS_URL}`,
      `SEC Company Facts: ${factsUrl}`,
      `SEC submissions metadata: ${submissionsUrl}`,
      `Market snapshot: Stooq close $${market.close.toFixed(2)} for ${market.symbol} on ${market.date}`,
      `${revenue.tag} FY${revenue.fy ?? "latest"} revenue ${money(toMillions(revenue.value))} filed ${revenue.filed ?? "unknown"}`,
    ],
  };
}

async function resolveTicker(ticker: string): Promise<SecTickerRow | undefined> {
  const rows = await fetchJson<Record<string, SecTickerRow>>(SEC_TICKERS_URL, true);
  return rows ? Object.values(rows).find((row) => row.ticker.toUpperCase() === ticker) : undefined;
}

async function fetchJson<T>(url: string, sec = false): Promise<T | undefined> {
  const response = await fetch(url, {
    headers: sec ? { "User-Agent": SEC_USER_AGENT, Accept: "application/json" } : undefined,
    next: { revalidate: 60 * 60 * 12 },
  } as RequestInit & { next: { revalidate: number } });
  if (!response.ok) return undefined;
  return await response.json() as T;
}

async function fetchStooqQuote(ticker: string): Promise<{ symbol: string; date: string; close: number } | undefined> {
  const symbol = `${ticker.toLowerCase()}.us`;
  const response = await fetch(`https://stooq.com/q/l/?s=${encodeURIComponent(symbol)}&f=sd2t2ohlcv&h&e=csv`, {
    next: { revalidate: 60 * 15 },
  } as RequestInit & { next: { revalidate: number } });
  if (!response.ok) return undefined;
  const row = (await response.text()).trim().split(/\r?\n/)[1]?.split(",");
  const close = Number(row?.[6]);
  if (!row || !Number.isFinite(close) || close <= 0) return undefined;
  return { symbol: row[0] ?? symbol.toUpperCase(), date: row[1] ?? "unknown", close };
}

function annualSeries(usGaap: Record<string, SecFactTag>, tags: readonly string[], unit: string): readonly PickedFact[] {
  let bestSeries: readonly PickedFact[] = [];
  for (const tag of tags) {
    const facts = usGaap[tag]?.units?.[unit];
    if (!facts) continue;
    const byEnd = new Map<string, PickedFact>();
    facts
      .filter(isAnnualFact)
      .map((fact) => toPickedFact(tag, unit, fact))
      .filter((fact): fact is PickedFact => Boolean(fact))
      .sort(comparePickedFacts)
      .forEach((fact) => byEnd.set(fact.end, fact));
    const deduped = [...byEnd.values()].sort(comparePickedFacts);
    if (isBetterSeries(deduped, bestSeries)) bestSeries = deduped;
  }
  return bestSeries;
}

function latest(series: readonly PickedFact[]): PickedFact | undefined {
  return series.at(-1);
}

function latestInstant(usGaap: Record<string, SecFactTag>, tags: readonly string[], unit: string): PickedFact | undefined {
  let best: PickedFact | undefined;
  for (const tag of tags) {
    const facts = usGaap[tag]?.units?.[unit];
    if (!facts) continue;
    const picked = facts
      .filter(isInstantFact)
      .map((fact) => toPickedFact(tag, unit, fact))
      .filter((fact): fact is PickedFact => Boolean(fact))
      .sort(comparePickedFacts)
      .at(-1);
    if (picked && (!best || comparePickedFacts(best, picked) < 0)) best = picked;
  }
  return best;
}

function resolveDebt(usGaap: Record<string, SecFactTag>) {
  const total = latestInstant(usGaap, debtTotalTags, "USD");
  if (total) return total;
  const current = latestInstant(usGaap, debtCurrentTags, "USD");
  const noncurrent = latestInstant(usGaap, debtNoncurrentTags, "USD");
  if (current && noncurrent) {
    return {
      tag: `${current.tag}+${noncurrent.tag}`,
      unit: "USD",
      value: current.value + noncurrent.value,
      end: current.end >= noncurrent.end ? current.end : noncurrent.end,
      filed: current.filed ?? noncurrent.filed,
      fy: current.fy ?? noncurrent.fy,
    };
  }
  return noncurrent ?? current;
}

function isAnnualFact(fact: SecFact): boolean {
  if (!fact.end || typeof fact.val !== "number") return false;
  if (fact.form !== "10-K" && fact.form !== "10-K/A") return false;
  if (fact.fp && fact.fp !== "FY") return false;
  if (!fact.start) return true;
  const start = Date.parse(fact.start);
  const end = Date.parse(fact.end);
  const days = (end - start) / 86_400_000;
  return Number.isFinite(days) && days >= 300 && days <= 380;
}

function isInstantFact(fact: SecFact): boolean {
  return Boolean(fact.end && typeof fact.val === "number" && !fact.start);
}

function toPickedFact(tag: string, unit: string, fact: SecFact): PickedFact | undefined {
  if (!fact.end || typeof fact.val !== "number") return undefined;
  return { tag, unit, value: fact.val, end: fact.end, filed: fact.filed, fy: fact.fy, accn: fact.accn };
}

function comparePickedFacts(left: PickedFact, right: PickedFact): number {
  return left.end.localeCompare(right.end) || (left.filed ?? "").localeCompare(right.filed ?? "");
}

function isBetterSeries(candidate: readonly PickedFact[], current: readonly PickedFact[]) {
  const candidateLatest = candidate.at(-1);
  const currentLatest = current.at(-1);
  if (!candidateLatest) return false;
  if (!currentLatest) return true;
  return comparePickedFacts(currentLatest, candidateLatest) < 0;
}

function calculateGrowth(series: readonly PickedFact[]): number {
  const positive = series.filter((fact) => fact.value > 0).slice(-5);
  if (positive.length < 2) return 0.04;
  const first = positive[0]!;
  const last = positive.at(-1)!;
  return clamp((last.value / first.value) ** (1 / Math.max(positive.length - 1, 1)) - 1, -0.25, 0.35);
}

function sectorFromSic(sic: string | undefined, description: string | undefined) {
  const text = `${sic ?? ""} ${description ?? ""}`.toLowerCase();
  if (text.includes("semiconductor")) return "Semiconductors";
  if (text.includes("petroleum") || text.includes("oil") || text.includes("gas") || text.includes("refining")) return "Energy";
  if (text.includes("mining") || text.includes("quarry") || text.includes("sand") || text.includes("construction materials")) return "Industrial Materials";
  if (sic?.startsWith("5") || text.includes("retail")) return "Retail";
  return "Public Company";
}

function sumFacts(left: PickedFact | undefined, right: PickedFact | undefined): number | undefined {
  if (!left && !right) return undefined;
  return (left?.value ?? 0) + (right?.value ?? 0);
}

function peerSet(profile: PublicCompanyProfile) {
  const peers = peerSets[profile.sector] ?? peerSets["Public Company"]!;
  return peers.filter((ticker) => ticker !== profile.ticker).slice(0, 5);
}

function toPeerRow(profile: PublicCompanyProfile): CipherPeerRow {
  const evRevenue = profile.revenue > 0 ? formatMultiple(ev(profile) / profile.revenue) : "refused";
  const evEbitda = profile.ebitda > 0 ? formatMultiple(ev(profile) / profile.ebitda) : "refused";
  return {
    ticker: profile.ticker,
    company: profile.company,
    sector: profile.sector,
    evRevenue,
    evEbitda,
    revenue: money(profile.revenue),
    ebitda: money(profile.ebitda),
    refusal: profile.ebitda > 0 ? undefined : "Negative or zero EBITDA; EV/EBITDA refused.",
  };
}

function baseProofRows(profile: PublicCompanyProfile, mode: CipherMode) {
  return [
    proof("SRC-001", "company_facts", `${profile.ticker} ${profile.company}; CIK ${profile.cik}; sector ${profile.sector}.`),
    proof("SRC-002", "market_snapshot", `Market cap ${money(profile.marketCap)} from price ${dollars(profile.price)} and ${profile.shares.toFixed(1)}mm shares.`),
    proof("SRC-003", "source_chain", profile.sources.join(" | ")),
    proof("POL-001", "boundary", `${mode.toUpperCase()} output is deterministic model math, not investment advice, a price target, fairness opinion, or recommendation.`),
  ];
}

function sourceRefusal(mode: CipherMode, ticker: string): CipherWorkbenchResult {
  const generatedAt = new Date().toISOString();
  return {
    mode,
    runId: `${mode}_${shortHash(`${mode}:${ticker}:${generatedAt}:source-refusal`)}`,
    ticker,
    company: `${ticker} - source data required`,
    sector: "Unknown",
    decision: "REFUSE",
    headline: `${mode === "dcf" ? "CIPHER" : "COMPS"} refused ${ticker} before compute`,
    summary: "The runner could not build a complete SEC + market source packet. It refused instead of substituting stale or made-up numbers.",
    generatedAt,
    corpusSeal: CORPUS_SEAL,
    metrics: [
      metric("Ticker", ticker, "neutral"),
      metric("SEC facts", "not complete", "danger"),
      metric("Market snapshot", "not complete", "danger"),
      metric("Output", "refused", "danger"),
    ],
    proofRows: [
      proof("SRC-REQUEST-001", "target_request", `Requested ticker ${ticker}.`),
      proof("SRC-POLICY-001", "anti_fabrication", "No fallback ticker, stale canned profile, or placeholder company was used."),
    ],
    refusals: [
      refusal("SRC-DATA-001", "HARD", "No complete source bundle is available for this ticker.", "Try another listed public ticker or attach source data through the packet runner."),
    ],
  };
}

function missingTicker(mode: CipherMode): CipherWorkbenchResult {
  return sourceRefusal(mode, "UNKNOWN");
}

function proof(id: string, source: string, detail: string): CipherProofRow {
  return { id, source, detail, hash: shortHash(`${id}:${source}:${detail}`) };
}

function refusal(code: string, severity: "HARD" | "SOFT", message: string, remediation: string): CipherRefusal {
  return { code, severity, message, remediation };
}

function metric(label: string, value: string, tone: CipherMetric["tone"] = "neutral"): CipherMetric {
  return { label, value, tone };
}

function ev(profile: PublicCompanyProfile) {
  return profile.marketCap + profile.netDebt;
}

function median(values: readonly number[]) {
  if (!values.length) return null;
  const middle = Math.floor(values.length / 2);
  return values.length % 2 ? values[middle]! : (values[middle - 1]! + values[middle]!) / 2;
}

function formatMultiple(value: number) {
  return Number.isFinite(value) ? `${value.toFixed(1)}x` : "refused";
}

function normalizeTicker(value: string) {
  const ticker = value.trim().toUpperCase();
  return /^[A-Z0-9.-]{1,12}$/.test(ticker) ? ticker : "";
}

function toMillions(value: number) {
  return value / 1_000_000;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function money(value: number) {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}T`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(2)}B`;
  return `${sign}$${abs.toFixed(abs >= 100 ? 0 : 1)}M`;
}

function dollars(value: number) {
  return `$${value.toFixed(2)}`;
}

function percent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function range(length: number) {
  return Array.from({ length }, (_, index) => index);
}

function shortHash(value: string) {
  return sha256(value).slice(0, 16);
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
