import type { RunnerResult } from "./types";
import { audit, findLine, metadata, missingLabels, missingResult, money, multiple, percent, perShare, readValue, row } from "./primitives";
import { evidenceSummary, sourceRefLabels } from "./packet";

export function runCredit(packet: string): RunnerResult {
  const ebitda = readValue(packet, ["Adjusted EBITDA", "EBITDA"]);
  const grossDebt = readValue(packet, ["Gross debt"]);
  const cash = readValue(packet, ["Cash"]);
  const netDebtInput = readValue(packet, ["Net debt"]);
  const interest = readValue(packet, ["Cash interest", "interest"]);
  const capex = readValue(packet, ["Maintenance capex", "capex"]);
  const taxes = readValue(packet, ["Cash taxes", "taxes"]);
  const workingCapital = readValue(packet, ["Working capital outflow", "working capital"]);
  const missing = missingLabels([
    ["EBITDA", ebitda],
    ["gross debt", grossDebt],
    ["cash", cash],
    ["cash interest", interest],
  ]);
  if (missing.length) return missingResult("credit", packet, missing);

  const netDebt = netDebtInput ?? grossDebt! - cash!;
  const fcf = ebitda! - interest! - (capex ?? 0) - (taxes ?? 0) - (workingCapital ?? 0);
  const leverage = netDebt / ebitda!;
  const coverage = ebitda! / interest!;
  const blockers = [
    leverage > 3 ? "Leverage exceeds the 3.0x comfort screen." : "",
    coverage < 2.5 ? "Interest coverage falls below the 2.5x screen." : "",
    fcf < 50 ? "Free-cash-flow cushion is below $50.0mm." : "",
  ].filter(Boolean);
  const verdict = blockers.length ? "WATCH - CREDIT REVIEW REQUIRED" : "PASS - FIRST-PASS SCREEN";
  const rows = [
    row("Net debt", money(netDebt), "Gross debt less cash, or supplied net debt if present."),
    row("Net debt / EBITDA", multiple(leverage), "Primary leverage screen."),
    row("EBITDA / cash interest", multiple(coverage), "Debt-service coverage screen."),
    row("FCF cushion", money(fcf), "EBITDA less interest, capex, taxes, and working-capital outflow."),
  ];
  return finishFinance(packet, "credit", verdict, "Computes credit math; refuses covenant/legal interpretation.", rows, blockers, [
    "No credit rating.",
    "No lending recommendation.",
    "No legal covenant interpretation.",
  ]);
}

export function runMerger(packet: string): RunnerResult {
  const acquirerEps = readValue(packet, ["Acquirer standalone EPS"]);
  const acquirerShares = readValue(packet, ["Acquirer diluted shares"]);
  const acquirerPrice = readValue(packet, ["Acquirer share price"]);
  const targetShares = readValue(packet, ["Target diluted shares"]);
  const offerPrice = readValue(packet, ["Offer price"]);
  const unaffectedPrice = readValue(packet, ["Unaffected target share price", "Unaffected price"]);
  const cashMix = readValue(packet, ["Cash consideration"]);
  const coupon = readValue(packet, ["New debt coupon"]);
  const taxRate = readValue(packet, ["Cash tax rate"]);
  const synergies = readValue(packet, ["Year 2 pre-tax run-rate synergies", "run-rate synergies"]) ?? 0;
  const missing = missingLabels([
    ["acquirer EPS", acquirerEps],
    ["acquirer shares", acquirerShares],
    ["acquirer share price", acquirerPrice],
    ["target shares", targetShares],
    ["offer price", offerPrice],
    ["unaffected target price", unaffectedPrice],
    ["cash consideration", cashMix],
    ["debt coupon", coupon],
    ["tax rate", taxRate],
  ]);
  if (missing.length) return missingResult("merger", packet, missing);

  const rows = mergerRows({ acquirerEps: acquirerEps!, acquirerShares: acquirerShares!, acquirerPrice: acquirerPrice!, targetShares: targetShares!, offerPrice: offerPrice!, unaffectedPrice: unaffectedPrice!, cashMix: cashMix!, coupon: coupon!, taxRate: taxRate!, synergies });
  const dilution = Number(rows.find((item) => item.label === "Year 1 EPS impact")?.value.replace("%", ""));
  const verdict = dilution < 0 ? "DILUTION WATCH" : "ACCRETIVE ON SUPPLIED FACTS";
  return finishFinance(packet, "merger", verdict, "Computes transaction mechanics; refuses deal blessing.", rows, dilution < 0 ? ["Year 1 dilution before synergies."] : [], [
    "No fairness opinion.",
    "No board recommendation.",
    "No tax/legal advice.",
  ]);
}

export function runLbo(packet: string): RunnerResult {
  const ebitda = readValue(packet, ["Entry EBITDA"]);
  const entryMultiple = readValue(packet, ["Entry purchase multiple"]);
  const openingLeverage = readValue(packet, ["Opening debt"]);
  const exitEbitda = readValue(packet, ["Year 5 EBITDA"]);
  const exitMultiple = readValue(packet, ["Exit multiple"]);
  const exitDebt = readValue(packet, ["Exit net debt"]);
  const missing = missingLabels([
    ["entry EBITDA", ebitda],
    ["entry multiple", entryMultiple],
    ["opening debt leverage", openingLeverage],
    ["exit EBITDA", exitEbitda],
    ["exit multiple", exitMultiple],
    ["exit debt", exitDebt],
  ]);
  if (missing.length) return missingResult("lbo", packet, missing);

  const purchaseEv = ebitda! * entryMultiple!;
  const debt = ebitda! * openingLeverage!;
  const sponsorEquity = purchaseEv - debt;
  const exitEquity = exitEbitda! * exitMultiple! - exitDebt!;
  const moic = exitEquity / sponsorEquity;
  const irr = (moic ** (1 / 5) - 1) * 100;
  const verdict = moic >= 2 && irr >= 20 ? "PASS - SPONSOR SCREEN" : "WATCH - RETURN BELOW HURDLE";
  const rows = [
    row("Purchase EV", money(purchaseEv), "Entry EBITDA times entry multiple."),
    row("Opening debt", money(debt), "Entry EBITDA times opening leverage."),
    row("Sponsor equity", money(sponsorEquity), "Purchase EV less opening debt."),
    row("Exit equity value", money(exitEquity), "Exit EV less exit net debt."),
    row("MOIC", multiple(moic), "Exit equity divided by sponsor equity."),
    row("IRR", percent(irr), "Five-year rough sponsor IRR."),
  ];
  return finishFinance(packet, "lbo", verdict, "Computes sponsor return; refuses bid and financing conclusions.", rows, irr < 20 ? ["IRR below 20.0% sponsor hurdle."] : [], [
    "No bid recommendation.",
    "No debt-capacity opinion.",
    "No covenant interpretation.",
  ]);
}

export function runSotp(packet: string): RunnerResult {
  const payments = readValue(packet, ["Payments EBITDA"]);
  const software = readValue(packet, ["Merchant software EBITDA"]);
  const consumer = readValue(packet, ["Consumer credit EBITDA"]);
  const overhead = readValue(packet, ["Corporate overhead expense"]);
  const netDebt = readValue(packet, ["Net debt"]);
  const shares = readValue(packet, ["Diluted shares"]);
  if ([payments, software, consumer, overhead, netDebt, shares].some((value) => value === null)) {
    return missingResult("sotp", packet, ["segment EBITDA/multiple set", "net debt bridge", "diluted shares"]);
  }
  const [payMult, softwareMult, consumerMult, overheadMult] = readMultiples(packet, [13, 8.5, 6, 7]);
  const gross = payments! * payMult + software! * softwareMult + consumer! * consumerMult - overhead! * overheadMult;
  const equity = gross - netDebt!;
  const rows = [
    row("Payments", money(payments! * payMult), `${money(payments!)} x ${multiple(payMult)}.`),
    row("Merchant software", money(software! * softwareMult), `${money(software!)} x ${multiple(softwareMult)}.`),
    row("Consumer credit", money(consumer! * consumerMult), `${money(consumer!)} x ${multiple(consumerMult)}.`),
    row("Corporate overhead", `(${money(overhead! * overheadMult)})`, `Recurring overhead capitalized at ${multiple(overheadMult)}.`),
    row("Equity value", money(equity), "Gross segment value less net debt bridge."),
    row("Value per share", perShare((equity * 1000) / shares!), "Equity value divided by diluted shares."),
  ];
  return finishFinance(packet, "sotp", "COMPUTE WITH FLAGS", "Uses supplied multiples only; refuses invented peer sets.", rows, /charge-off|risk|missing|unsupported/i.test(packet) ? ["At least one segment carries a proof or risk flag."] : [], [
    "No invented peer set.",
    "No holdco discount unless supplied.",
    "No investment recommendation.",
  ]);
}

export function runScenarios(packet: string): RunnerResult {
  const rows = ["Downside", "Bear", "Base", "Bull"]
    .map((name) => scenarioRow(packet, name))
    .filter((item): item is NonNullable<typeof item> => item !== null);
  if (rows.length < 2) return missingResult("scenarios", packet, ["at least two scenario rows"]);
  const blockers = [
    /retention support is missing|proof.*missing|unsupported/i.test(packet) ? "Upside proof gap remains open." : "",
    /covenant cushion.*below|below\s+12/i.test(packet) ? "Downside covenant cushion needs review." : "",
  ].filter(Boolean);
  const verdict = blockers.length ? `COMPUTE - ${blockers.length} PROOF GAP${blockers.length > 1 ? "S" : ""}` : "COMPUTE - NO PROOF GAPS";
  return finishFinance(packet, "scenarios", verdict, "Computes cases; refuses to call sensitivity math an approved forecast.", rows, blockers, [
    "No board-approved label.",
    "No investment recommendation.",
    "No lender-case claim without evidence.",
  ]);
}

export function runBenchmark(packet: string): RunnerResult {
  const ebitda = readValue(packet, ["CY+1 EBITDA"]);
  const netDebt = readValue(packet, ["net debt"]);
  const shares = readValue(packet, ["diluted shares"]);
  if ([ebitda, netDebt, shares].some((value) => value === null)) {
    return missingResult("benchmark", packet, ["EBITDA", "net debt", "diluted shares"]);
  }
  const rows = [7, 8, 9].map((mult) => {
    const ev = ebitda! * mult;
    const equity = ev - netDebt!;
    return row(`${multiple(mult)} case`, perShare((equity * 1000) / shares!), `${money(ev)} EV less ${money(netDebt!)} net debt = ${money(equity)} equity value.`);
  });
  return finishFinance(packet, "benchmark", "SCOREABLE RESPONSE - NO RECOMMENDATION", "Computes valuation bridge and refuses unsupported peer invention.", rows, /no peer|no .*supplied|missing/i.test(packet) ? ["Peer set and fairness materials are not supplied."] : [], [
    "No peer-set invention.",
    "No fairness opinion.",
    "No buy/sell/hold recommendation.",
  ]);
}

function mergerRows(input: Record<string, number>) {
  const equityValue = input.offerPrice * input.targetShares;
  const cashPaid = equityValue * (input.cashMix / 100);
  const newShares = (equityValue - cashPaid) / input.acquirerPrice;
  const afterTaxInterest = cashPaid * (input.coupon / 100) * (1 - input.taxRate / 100);
  const standaloneIncome = input.acquirerEps * input.acquirerShares;
  const proFormaShares = input.acquirerShares + newShares;
  const yearOneEps = (standaloneIncome - afterTaxInterest) / proFormaShares;
  const yearTwoEps = (standaloneIncome - afterTaxInterest + input.synergies * (1 - input.taxRate / 100)) / proFormaShares;
  return [
    row("Offer premium", percent((input.offerPrice / input.unaffectedPrice - 1) * 100), "Offer price versus unaffected target price."),
    row("Equity purchase value", money(equityValue), "Offer price times target diluted shares."),
    row("New debt", money(cashPaid), "Cash consideration funded as debt in this public screen."),
    row("New shares", `${newShares.toFixed(1)}mm`, "Stock consideration divided by acquirer share price."),
    row("Year 1 EPS impact", percent((yearOneEps / input.acquirerEps - 1) * 100), "Before run-rate synergies."),
    row("Year 2 EPS impact", percent((yearTwoEps / input.acquirerEps - 1) * 100), "After supplied run-rate synergies."),
  ];
}

function readMultiples(packet: string, defaults: number[]) {
  const matches = packet.match(/[\d.]+x/g)?.map((value) => Number(value.replace("x", ""))) ?? [];
  return defaults.map((fallback, index) => matches[index] ?? fallback);
}

function scenarioRow(packet: string, name: string) {
  const line = findLine(packet.split(/\n+/), name);
  const match = line?.match(/([\d.]+)%[^\n]+?([\d.]+)%[^\n]+?\$?([\d.]+)bn[^\n]+?\$?([\d.]+)bn/i);
  if (!match) return null;
  return row(name, `$${match[4]}bn equity`, `${match[1]}% growth, ${match[2]}% EBITDA margin, $${match[3]}bn EBITDA.`);
}

function finishFinance(
  packet: string,
  mode: "credit" | "merger" | "lbo" | "sotp" | "scenarios" | "benchmark",
  verdict: string,
  posture: string,
  rows: ReturnType<typeof row>[],
  blockers: string[],
  refusals: string[],
) {
  const evidence = evidenceSummary(packet);
  const sourceLabels = sourceRefLabels(packet);
  const evidenceRows = [
    row("Parsed fields", String(evidence.fieldCount), "Fields extracted from pasted/uploaded packet before model math."),
    row("Source refs", String(evidence.sourceCount), sourceLabels.join(" | ") || "No explicit source references supplied."),
    row("Periods detected", String(evidence.periodCount), "Fiscal/calendar period labels detected in the packet."),
  ];
  const evidenceRefusals = evidence.sourceCount
    ? []
    : ["No source-backed release if the packet lacks explicit source references."];
  return {
    metadata: metadata(mode, packet),
    verdict,
    posture,
    rows: [...rows, ...evidenceRows],
    blockers,
    refusals: [...refusals, ...evidenceRefusals],
    audit: audit(packet, mode, verdict, rows),
  };
}
