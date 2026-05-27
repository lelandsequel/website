import type { RunnerMode } from "./types";

type CompanyTickerRecord = {
  cik_str: number;
  ticker: string;
  title: string;
};

type SecFactUnit = {
  val: number;
  fy?: number;
  fp?: string;
  form?: string;
  filed?: string;
  end?: string;
  accn?: string;
};

type CompanyFacts = {
  cik: number;
  entityName: string;
  facts?: {
    "us-gaap"?: Record<string, { units?: Record<string, SecFactUnit[]> }>;
  };
};

type FactValue = {
  tag: string;
  value: number;
  fy: number | null;
  end: string | null;
  filed: string | null;
  form: string | null;
  accn: string | null;
};

const secHeaders = {
  "User-Agent": "JourdanLabs ALCHEMIST public-workbench contact@jourdanlabs.com",
  Accept: "application/json",
};

const compatibleModes = new Set<RunnerMode>(["credit", "lbo", "scenarios", "benchmark"]);

export function canBuildSecPacket(mode: RunnerMode) {
  return compatibleModes.has(mode);
}

export async function buildPublicCompanyPacket(ticker: string, mode: RunnerMode) {
  const cleanTicker = ticker.trim().toUpperCase();
  if (!/^[A-Z0-9.-]{1,12}$/.test(cleanTicker)) {
    throw new Error("Ticker must be 1-12 letters/numbers.");
  }
  if (!canBuildSecPacket(mode)) {
    throw new Error(`${mode.toUpperCase()} needs a deal/segment packet; one ticker is not enough evidence.`);
  }

  const company = await resolveTicker(cleanTicker);
  const facts = await fetchCompanyFacts(company.cik_str);
  const metrics = extractMetrics(facts);
  const packet = packetForMode(mode, company, facts, metrics);

  return {
    ticker: cleanTicker,
    cik: company.cik_str,
    entity: facts.entityName || company.title,
    mode,
    packet,
    warnings: metrics.warnings,
  };
}

async function resolveTicker(ticker: string) {
  const response = await fetch("https://www.sec.gov/files/company_tickers.json", { headers: secHeaders });
  if (!response.ok) throw new Error(`SEC ticker lookup failed with ${response.status}.`);
  const records = Object.values(await response.json() as Record<string, CompanyTickerRecord>);
  const match = records.find((record) => record.ticker.toUpperCase() === ticker);
  if (!match) throw new Error(`SEC ticker lookup found no public filer for ${ticker}.`);
  return match;
}

async function fetchCompanyFacts(cik: number) {
  const padded = String(cik).padStart(10, "0");
  const response = await fetch(`https://data.sec.gov/api/xbrl/companyfacts/CIK${padded}.json`, {
    headers: secHeaders,
  });
  if (!response.ok) throw new Error(`SEC Company Facts lookup failed with ${response.status}.`);
  return await response.json() as CompanyFacts;
}

function extractMetrics(facts: CompanyFacts) {
  const revenue = latestUsd(facts, ["Revenues", "RevenueFromContractWithCustomerExcludingAssessedTax", "SalesRevenueNet"]);
  const operatingIncome = latestUsd(facts, ["OperatingIncomeLoss"]);
  const depreciation = latestUsd(facts, [
    "DepreciationDepletionAndAmortization",
    "DepreciationDepletionAndAmortizationExpense",
    "DepreciationAndAmortization",
  ]);
  const netIncome = latestUsd(facts, ["NetIncomeLoss"]);
  const cash = latestUsd(facts, [
    "CashAndCashEquivalentsAtCarryingValue",
    "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents",
  ], false);
  const currentDebt = latestUsd(facts, ["LongTermDebtCurrent", "ShortTermBorrowings", "DebtCurrent"], false);
  const longDebt = latestUsd(facts, [
    "LongTermDebt",
    "LongTermDebtAndFinanceLeaseObligations",
    "LongTermDebtNoncurrent",
  ], false);
  const interest = latestUsd(facts, ["InterestExpenseNonOperating", "InterestExpense"]);
  const taxes = latestUsd(facts, ["IncomeTaxExpenseBenefit"]);
  const cfo = latestUsd(facts, ["NetCashProvidedByUsedInOperatingActivities"]);
  const capex = latestUsd(facts, ["PaymentsToAcquirePropertyPlantAndEquipment"]);
  const shares = latestShares(facts, ["WeightedAverageNumberOfDilutedSharesOutstanding", "WeightedAverageNumberOfSharesOutstandingDiluted"]);

  const ebitda = operatingIncome && depreciation
    ? { ...operatingIncome, value: operatingIncome.value + Math.abs(depreciation.value), tag: `${operatingIncome.tag}+${depreciation.tag}` }
    : operatingIncome;
  const grossDebt = sumFacts([currentDebt, longDebt], "current debt + long-term debt");
  const netDebt = grossDebt && cash ? { ...grossDebt, value: grossDebt.value - cash.value, tag: "gross debt - cash" } : null;
  const maintenanceCapex = capex ? { ...capex, value: Math.abs(capex.value) } : null;
  const fcf = cfo && maintenanceCapex ? { ...cfo, value: cfo.value - maintenanceCapex.value, tag: `${cfo.tag}-${maintenanceCapex.tag}` } : null;

  const warnings = [
    !revenue ? "Revenue tag not resolved from SEC Company Facts." : "",
    !ebitda ? "EBITDA proxy not resolved; operating income may be missing." : "",
    !grossDebt ? "Debt tags not resolved; leverage math may refuse." : "",
    !interest ? "Interest expense tag not resolved; credit coverage may refuse." : "",
    !shares ? "Diluted share count not resolved." : "",
  ].filter(Boolean);

  return { revenue, operatingIncome, depreciation, ebitda, netIncome, cash, currentDebt, longDebt, grossDebt, netDebt, interest, taxes, cfo, maintenanceCapex, fcf, shares, warnings };
}

function latestUsd(facts: CompanyFacts, tags: string[], annual = true): FactValue | null {
  return latestFact(facts, tags, "USD", annual);
}

function latestShares(facts: CompanyFacts, tags: string[]): FactValue | null {
  return latestFact(facts, tags, "shares", true);
}

function latestFact(facts: CompanyFacts, tags: string[], unit: string, annual: boolean): FactValue | null {
  for (const tag of tags) {
    const values = facts.facts?.["us-gaap"]?.[tag]?.units?.[unit] ?? [];
    const candidates = values
      .filter((item) => Number.isFinite(item.val))
      .filter((item) => !annual || item.fp === "FY" || item.form?.includes("10-K"))
      .sort((a, b) => String(b.end ?? "").localeCompare(String(a.end ?? "")) || String(b.filed ?? "").localeCompare(String(a.filed ?? "")));
    const latest = candidates[0];
    if (latest) {
      return {
        tag,
        value: latest.val / (unit === "shares" ? 1_000_000 : 1_000_000),
        fy: latest.fy ?? null,
        end: latest.end ?? null,
        filed: latest.filed ?? null,
        form: latest.form ?? null,
        accn: latest.accn ?? null,
      };
    }
  }
  return null;
}

function sumFacts(values: Array<FactValue | null>, tag: string): FactValue | null {
  const present = values.filter((value): value is FactValue => value !== null);
  if (!present.length) return null;
  return {
    ...present[0],
    tag,
    value: present.reduce((sum, item) => sum + item.value, 0),
  };
}

function packetForMode(mode: RunnerMode, company: CompanyTickerRecord, facts: CompanyFacts, metrics: ReturnType<typeof extractMetrics>) {
  const common = commonPacket(company, facts, metrics);
  if (mode === "credit") return creditPacket(common, metrics);
  if (mode === "benchmark") return benchmarkPacket(common, metrics);
  if (mode === "lbo") return lboPacket(common, metrics);
  return scenarioPacket(common, metrics);
}

function commonPacket(company: CompanyTickerRecord, facts: CompanyFacts, metrics: ReturnType<typeof extractMetrics>) {
  const entity = facts.entityName || company.title;
  const basis = metrics.revenue?.fy ? `FY${metrics.revenue.fy}` : "latest annual SEC Company Facts";
  const source = secSource(company.cik_str, metrics.revenue ?? metrics.ebitda ?? metrics.grossDebt);
  return `SEC PUBLIC COMPANY PACKET
Ticker: ${company.ticker.toUpperCase()}
Entity: ${entity}
CIK: ${company.cik_str}
Fiscal periods: ${basis}; extracted live from SEC Company Facts

Source references:
- SEC Company Facts API: https://data.sec.gov/api/xbrl/companyfacts/CIK${String(company.cik_str).padStart(10, "0")}.json
- Primary filing reference: ${source}

Source facts:
- Revenue: ${field(metrics.revenue)}
- Operating income: ${field(metrics.operatingIncome)}
- D&A proxy: ${field(metrics.depreciation)}
- EBITDA proxy: ${field(metrics.ebitda)}
- Gross debt: ${field(metrics.grossDebt)}
- Cash: ${field(metrics.cash)}
- Net debt: ${field(metrics.netDebt)}
- Cash interest: ${field(metrics.interest)}
- Cash taxes: ${field(metrics.taxes)}
- CFO: ${field(metrics.cfo)}
- Maintenance capex: ${field(metrics.maintenanceCapex)}
- Free cash flow proxy: ${field(metrics.fcf)}
- Diluted shares: ${shareField(metrics.shares)}

Boundary notes:
- Values are SEC-backed historical facts/proxies, not forecasts.
- This packet does not include market price, covenant language, legal agreement text, debt maturity schedule, ratings reports, board materials, or investment-bank judgment.
- ALCHEMIST may compute arithmetic from supplied facts and must refuse conclusions that require missing evidence.`;
}

function creditPacket(common: string, metrics: ReturnType<typeof extractMetrics>) {
  return `${common}

Credit screen inputs:
- Adjusted EBITDA: ${field(metrics.ebitda)}
- Gross debt: ${field(metrics.grossDebt)}
- Cash: ${field(metrics.cash)}
- Net debt: ${field(metrics.netDebt)}
- Cash interest: ${field(metrics.interest)}
- Maintenance capex: ${field(metrics.maintenanceCapex)}
- Cash taxes: ${field(metrics.taxes)}
- Working capital outflow: $0.0mm (not sourced; neutral placeholder for first-pass screen only)

Screen rules:
- PASS leverage if net debt / EBITDA <= 3.0x; WATCH if 3.0x to 4.0x; FAIL above 4.0x.
- PASS coverage if EBITDA / cash interest >= 2.5x.
- WATCH free cash flow cushion if below $50.0mm.
- ABSTAIN on credit rating, lending recommendation, covenant/legal interpretation, or collateral sufficiency.`;
}

function benchmarkPacket(common: string, metrics: ReturnType<typeof extractMetrics>) {
  return `${common}

Benchmark inputs:
- CY+1 EBITDA: ${field(metrics.ebitda)}
- Net debt: ${field(metrics.netDebt)}
- Diluted shares: ${shareField(metrics.shares)}
- Peer list: missing; no peer set or fairness materials supplied.

Benchmark task:
- Compute visible valuation bridge cases only.
- Refuse peer-set invention, fairness opinion, buy/sell/hold language, and model-suitability claims.`;
}

function lboPacket(common: string, metrics: ReturnType<typeof extractMetrics>) {
  const ebitda = metrics.ebitda?.value ?? 0;
  const netDebt = Math.max(metrics.netDebt?.value ?? 0, 0);
  const yearFive = ebitda ? ebitda * 1.25 : 0;
  return `${common}

Illustrative LBO sensitivity inputs:
- Entry EBITDA: ${field(metrics.ebitda)}
- Entry purchase multiple: 10.0x EBITDA (user-supplied illustrative assumption, not SEC fact)
- Opening debt: ${ebitda ? "4.5x entry EBITDA" : "missing"}
- Year 5 EBITDA: ${moneyText(yearFive)} (illustrative 25.0% growth case, not SEC fact)
- Exit multiple: 9.0x EBITDA (user-supplied illustrative assumption, not SEC fact)
- Exit net debt: ${moneyText(netDebt)} (uses current SEC net debt as conservative placeholder)

Boundary task:
- Compute sponsor-return math only.
- Refuse bid recommendation, debt-capacity opinion, solvency view, lender appetite, and covenant interpretation.`;
}

function scenarioPacket(common: string, metrics: ReturnType<typeof extractMetrics>) {
  const revenue = metrics.revenue?.value ?? 0;
  const ebitda = metrics.ebitda?.value ?? 0;
  const margin = revenue && ebitda ? (ebitda / revenue) * 100 : 20;
  return `${common}

Scenario rows:
Downside: -5.0% revenue growth, ${Math.max(margin - 4, 1).toFixed(1)}% EBITDA margin, ${moneyText(ebitda * 0.82)} EBITDA, ${moneyText((metrics.netDebt?.value ?? 0) + ebitda * 6)} equity value
Base: 0.0% revenue growth, ${margin.toFixed(1)}% EBITDA margin, ${moneyText(ebitda)} EBITDA, ${moneyText((metrics.netDebt?.value ?? 0) + ebitda * 8)} equity value
Bull: 8.0% revenue growth, ${(margin + 3).toFixed(1)}% EBITDA margin, ${moneyText(ebitda * 1.2)} EBITDA, ${moneyText((metrics.netDebt?.value ?? 0) + ebitda * 10)} equity value

Scenario task:
- Compute case table and proof gaps only.
- Refuse board-approved forecast labels, financing certainty, lender-case claims, and investment recommendation.`;
}

function field(value: FactValue | null) {
  if (!value) return "missing";
  return `${moneyText(value.value)} (${value.tag}${value.fy ? `, FY${value.fy}` : ""}${value.end ? `, end ${value.end}` : ""})`;
}

function shareField(value: FactValue | null) {
  if (!value) return "missing";
  return `${value.value.toFixed(1)}mm (${value.tag}${value.fy ? `, FY${value.fy}` : ""})`;
}

function moneyText(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1000) return `$${(value / 1000).toFixed(2)}bn`;
  return `$${value.toFixed(1)}mm`;
}

function secSource(cik: number, fact: FactValue | null) {
  if (!fact?.accn) return `SEC CIK ${cik} Company Facts latest available filing`;
  const accession = fact.accn.replace(/-/g, "");
  return `https://www.sec.gov/Archives/edgar/data/${cik}/${accession}/${fact.accn}-index.htm`;
}
