"use client";

import { useEffect, useMemo, useState } from "react";

type Account = {
  id: string;
  name: string;
  city: string;
  state: string;
  concept: string;
  status: string;
  avgCheck: number;
  privateDining?: boolean;
  hasMichelin?: boolean;
  hasForbes?: boolean;
  hasBeard?: boolean;
  hotelAffiliation?: string;
  membershipClub?: boolean;
  chefKnown?: boolean;
  marketScore?: number;
  beverageScore?: number;
  caviarOnMenu?: boolean;
  menuSignals?: string[];
  decisionMaker?: string;
  currentSupplier?: string;
  preferredSpecies?: string;
  preferredTinSize?: string;
  serviceStyle?: string;
  priceBand?: string;
  monthlyVolumeOz?: number;
  targetMonthlyVolumeOz?: number;
  estimatedAnnualValue?: number;
  marginPercent?: number;
  lastPurchaseAt?: string;
  nextReorderAt?: string;
  reorderCadenceDays?: number;
  buyerNotes?: string;
  sourceRefs?: string[];
  score?: Score;
  purchases?: Purchase[];
};

type Score = {
  fitScore: number;
  confidence: number;
  decision: "SURFACE" | "MONITOR" | "EXCLUDE";
  risk: "LOST" | "UNKNOWN" | "PROSPECT" | "AT_RISK" | "OVERDUE" | "DUE_SOON" | "ON_TRACK";
  components: Record<string, number>;
  flags: string[];
  recommendation: string;
};

type Purchase = {
  orderedAt: string;
  productName: string;
  species: string;
  tinSize: string;
  quantity: number;
  totalOunces: number;
  revenue: number;
  margin: number;
  notes: string;
};

type AuditEntry = {
  sequence: number;
  at: string;
  action: string;
  entityType: string;
  entityId: string;
  payloadHash: string;
  prevHash: string;
  hash: string;
};

type State = {
  version: string;
  createdAt: string;
  updatedAt: string;
  tenant: { name: string; territory: string[] };
  accounts: Account[];
  audit: AuditEntry[];
};

type View = "dashboard" | "accounts" | "queue" | "signal" | "receipts";

const dayMs = 24 * 60 * 60 * 1000;

function nowIso() {
  return new Date().toISOString();
}

function addDays(days: number) {
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

function daysUntil(value?: string) {
  if (!value) return null;
  return Math.ceil((new Date(value).getTime() - Date.now()) / dayMs);
}

function stableJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  return `{${Object.keys(value as Record<string, unknown>)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableJson((value as Record<string, unknown>)[key])}`)
    .join(",")}}`;
}

function hash(value: unknown) {
  const text = typeof value === "string" ? value : stableJson(value);
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function money(value?: number) {
  const n = Number(value || 0);
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${Math.round(n).toLocaleString()}`;
}

function pct(value?: number) {
  return `${Math.round(Number(value || 0))}%`;
}

function riskFor(account: Account): Score["risk"] {
  const due = daysUntil(account.nextReorderAt);
  if (account.status === "LOST") return "LOST";
  if (due === null) return account.lastPurchaseAt ? "UNKNOWN" : "PROSPECT";
  if (due < -14) return "AT_RISK";
  if (due < 0) return "OVERDUE";
  if (due <= 10) return "DUE_SOON";
  return "ON_TRACK";
}

function conceptBonus(concept = "") {
  const key = concept.toUpperCase();
  if (["OMAKASE", "TASTING_MENU", "HOTEL_DINING", "MEMBERS_CLUB"].includes(key)) return 1;
  if (["SEAFOOD", "STEAKHOUSE", "FINE_DINING", "RAW_BAR"].includes(key)) return 0.85;
  if (["BRASSERIE", "LOUNGE"].includes(key)) return 0.62;
  return 0.38;
}

function recommendationFor(decision: Score["decision"], fitScore: number, confidence: number, risk: Score["risk"]) {
  if (decision === "EXCLUDE") return "Do not spend rep time until the account profile changes.";
  if (confidence < 0.72) return "Collect proof: menu scrape, buyer name, caviar fit evidence, and source refs before outreach.";
  if (risk === "OVERDUE" || risk === "AT_RISK") return "Call today with a reorder save: confirm last tin velocity and offer a right-sized restock.";
  if (risk === "DUE_SOON") return "Call this week. Anchor the ask around service margin and a controlled next reorder.";
  if (fitScore >= 82) return "High-priority outreach. Lead with menu economics, chef prestige, and reliable luxury supply.";
  return "Keep warm. Add proof, sample selectively, and wait for a sharper buying trigger.";
}

function scoreAccount(account: Account): Score {
  const avgCheck = Number(account.avgCheck || 0);
  const prestigeMarkers = [
    account.hasMichelin,
    account.hasForbes,
    account.hasBeard,
    account.hotelAffiliation,
    account.membershipClub,
  ].filter(Boolean).length;
  const menuHits = (account.menuSignals || []).filter(Boolean).length;
  const caviarHit = account.caviarOnMenu ? 1 : 0;
  const buyerSignals = [
    account.decisionMaker,
    account.currentSupplier,
    account.preferredSpecies,
    account.serviceStyle,
    account.buyerNotes,
  ].filter(Boolean).length;
  const sourceCount = (account.sourceRefs || []).length;
  const risk = riskFor(account);

  const luxury = Math.min(100, 20 + avgCheck / 4 + prestigeMarkers * 12 + conceptBonus(account.concept) * 22);
  const menu = Math.min(100, caviarHit * 45 + menuHits * 12 + conceptBonus(account.concept) * 30);
  const beverage = Math.min(100, Number(account.beverageScore || 45) + (account.privateDining ? 10 : 0));
  const neighborhood = Math.min(100, Number(account.marketScore || 50) + (account.city ? 10 : 0));
  const chef = Math.min(100, 40 + prestigeMarkers * 13 + (account.chefKnown ? 18 : 0));
  const operational = Math.min(100, 35 + buyerSignals * 9 + (Number(account.monthlyVolumeOz || 0) > 20 ? 10 : 0));
  const timing = Math.min(100, risk === "DUE_SOON" ? 96 : risk === "OVERDUE" ? 88 : risk === "AT_RISK" ? 75 : 55);
  const fitScore = luxury * 0.25 + menu * 0.2 + beverage * 0.15 + neighborhood * 0.15 + chef * 0.1 + operational * 0.1 + timing * 0.05;
  const confidence = Math.min(0.98, 0.42 + sourceCount * 0.08 + menuHits * 0.04 + buyerSignals * 0.035 + (account.lastPurchaseAt ? 0.08 : 0));
  const flags = [];
  if (confidence < 0.72) flags.push("AURORA-HOLD: confidence below 0.72; monitor until more proof lands");
  if (!account.decisionMaker) flags.push("MISSING-BUYER: decision maker not identified");
  if (!account.sourceRefs?.length) flags.push("MISSING-SOURCE: no source references attached");
  if (avgCheck < 85) flags.push("LOW-CHECK: average check may not support caviar service");
  if (risk === "AT_RISK") flags.push("REORDER-RISK: account is more than 14 days past expected reorder");

  let decision: Score["decision"] = "MONITOR";
  if (fitScore >= 75 && confidence >= 0.72 && !flags.some((flag) => flag.startsWith("LOW-CHECK"))) decision = "SURFACE";
  if (avgCheck < 65 || account.status === "CLOSED") decision = "EXCLUDE";

  return {
    fitScore: Number(fitScore.toFixed(1)),
    confidence: Number(confidence.toFixed(2)),
    decision,
    risk,
    components: {
      luxury: Math.round(luxury),
      menu: Math.round(menu),
      beverage: Math.round(beverage),
      neighborhood: Math.round(neighborhood),
      chef: Math.round(chef),
      operational: Math.round(operational),
      timing: Math.round(timing),
    },
    flags,
    recommendation: recommendationFor(decision, fitScore, confidence, risk),
  };
}

const seedAccounts: Account[] = [
  {
    id: "harborview-miami",
    name: "Harborview",
    city: "Miami",
    state: "FL",
    concept: "SEAFOOD",
    status: "ACTIVE",
    avgCheck: 165,
    privateDining: true,
    hasForbes: true,
    marketScore: 88,
    beverageScore: 82,
    caviarOnMenu: true,
    menuSignals: ["raw bar", "seafood tower", "vodka service", "private dining"],
    decisionMaker: "Executive Chef / GM",
    currentSupplier: "Legacy distributor",
    preferredSpecies: "SIBERIAN",
    preferredTinSize: "50g",
    serviceStyle: "Seafood tower upgrade and standalone tin service",
    monthlyVolumeOz: 42,
    targetMonthlyVolumeOz: 64,
    estimatedAnnualValue: 73500,
    marginPercent: 38,
    lastPurchaseAt: addDays(-17),
    nextReorderAt: addDays(4),
    reorderCadenceDays: 21,
    buyerNotes: "Strong raw bar velocity. Keep next call focused on consistent tin size and service margin.",
    sourceRefs: ["menu:raw-bar-caviar", "crm:last-order", "rep:chef-call"],
  },
  {
    id: "palmetto-club-palm-beach",
    name: "The Palmetto Club",
    city: "Palm Beach",
    state: "FL",
    concept: "MEMBERS_CLUB",
    status: "ACTIVE",
    avgCheck: 300,
    privateDining: true,
    membershipClub: true,
    hasForbes: true,
    marketScore: 96,
    beverageScore: 92,
    caviarOnMenu: true,
    menuSignals: ["member dining", "private events", "champagne list", "holiday service"],
    decisionMaker: "Club GM",
    currentSupplier: "Direct luxury purveyor",
    preferredSpecies: "OSETRA",
    preferredTinSize: "125g",
    serviceStyle: "Member dining supplement and private event caviar service",
    monthlyVolumeOz: 58,
    targetMonthlyVolumeOz: 84,
    estimatedAnnualValue: 112000,
    marginPercent: 42,
    lastPurchaseAt: addDays(-6),
    nextReorderAt: addDays(16),
    reorderCadenceDays: 21,
    buyerNotes: "Private events can double volume during winter season.",
    sourceRefs: ["crm:purchase-history", "event-calendar:winter", "rep:gm-note"],
  },
  {
    id: "akari-manhattan",
    name: "Akari",
    city: "Manhattan",
    state: "NY",
    concept: "OMAKASE",
    status: "SAMPLING",
    avgCheck: 350,
    hasMichelin: true,
    chefKnown: true,
    marketScore: 94,
    beverageScore: 86,
    menuSignals: ["omakase", "uni", "toro", "supplement"],
    decisionMaker: "Chef de Cuisine",
    preferredSpecies: "OSETRA",
    preferredTinSize: "30g",
    serviceStyle: "Omakase bump supplement",
    targetMonthlyVolumeOz: 36,
    estimatedAnnualValue: 48500,
    marginPercent: 35,
    buyerNotes: "Chef prefers low salinity and clean finish; follow with Osetra comparison set.",
    sourceRefs: ["menu:omakase", "press:chef-profile", "rep:sample-request"],
  },
  {
    id: "persimmon-austin",
    name: "Persimmon",
    city: "Austin",
    state: "TX",
    concept: "TASTING_MENU",
    status: "PROPOSAL",
    avgCheck: 195,
    hasMichelin: true,
    hasBeard: true,
    chefKnown: true,
    marketScore: 84,
    beverageScore: 78,
    menuSignals: ["tasting menu", "seasonal course", "champagne pairing"],
    decisionMaker: "Executive Chef",
    preferredSpecies: "KALUGA",
    preferredTinSize: "50g",
    serviceStyle: "Dedicated caviar course on tasting menu",
    targetMonthlyVolumeOz: 28,
    estimatedAnnualValue: 39200,
    marginPercent: 36,
    buyerNotes: "Proposal should anchor around tasting menu economics, not commodity pricing.",
    sourceRefs: ["press:award", "menu:tasting", "crm:proposal-draft"],
  },
  {
    id: "rosewood-manor-dallas",
    name: "Rosewood Manor",
    city: "Dallas",
    state: "TX",
    concept: "HOTEL_DINING",
    status: "PRE_OPENING",
    avgCheck: 220,
    privateDining: true,
    hasForbes: true,
    hotelAffiliation: "Rosewood Hotels",
    marketScore: 90,
    beverageScore: 88,
    menuSignals: ["hotel opening", "private dining", "champagne", "chef announcement"],
    decisionMaker: "Opening F&B Director",
    preferredSpecies: "OSETRA",
    targetMonthlyVolumeOz: 72,
    estimatedAnnualValue: 98000,
    marginPercent: 40,
    buyerNotes: "Pre-opening account. Win list placement before suppliers harden.",
    sourceRefs: ["press:hotel-opening", "permit:restaurant", "linkedin:fbdirector"],
  },
  {
    id: "market-oyster-bar-houston",
    name: "Market Oyster Bar",
    city: "Houston",
    state: "TX",
    concept: "RAW_BAR",
    status: "PROSPECT",
    avgCheck: 58,
    marketScore: 54,
    beverageScore: 50,
    menuSignals: ["oysters", "beer program"],
    estimatedAnnualValue: 9000,
    marginPercent: 25,
    buyerNotes: "Too casual for BACCHUS rep focus unless the concept or menu changes.",
    sourceRefs: ["menu:public-scan", "rep:drive-by"],
  },
];

function appendAudit(state: State, action: string, entityType: string, entityId: string, payload: unknown): State {
  const prevHash = state.audit.at(-1)?.hash || "GENESIS";
  const entry = {
    sequence: state.audit.length + 1,
    at: nowIso(),
    action,
    entityType,
    entityId,
    payloadHash: hash(payload),
    prevHash,
    hash: "",
  };
  entry.hash = hash(entry);
  return { ...state, updatedAt: nowIso(), audit: [...state.audit, entry] };
}

function initialState(): State {
  const accounts = seedAccounts.map((account) => ({ ...account, score: scoreAccount(account) }));
  let state: State = {
    version: "1.0.0-web",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    tenant: { name: "Altima Caviar", territory: ["TX", "FL", "LA", "NY", "NJ", "TN"] },
    accounts,
    audit: [],
  };
  state = appendAudit(state, "SEED_STATE", "workspace", "altima-caviar", { accounts: accounts.length });
  return state;
}

function accountBrief(account: Account) {
  const score = account.score || scoreAccount(account);
  const cityLine = [account.city, account.state].filter(Boolean).join(", ");
  const opener = `${account.name}${cityLine ? ` in ${cityLine}` : ""} is a ${account.concept.replace(/_/g, " ").toLowerCase()} account with an AURORA fit score of ${score.fitScore} and ${pct(score.confidence * 100)} confidence.`;
  const decision =
    score.decision === "SURFACE"
      ? "ROE surfaces this account for rep action."
      : score.decision === "MONITOR"
        ? "ROE keeps this account in monitor until more buyer proof lands."
        : "ROE refuses rep focus for now.";
  const economics = `Estimated annual value is ${money(account.estimatedAnnualValue)}, with target monthly volume of ${account.targetMonthlyVolumeOz || account.monthlyVolumeOz || 0} oz and expected margin around ${pct(account.marginPercent)}.`;
  const reorder = account.nextReorderAt
    ? `Next reorder is tracked for ${new Date(account.nextReorderAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}; risk state is ${score.risk.replace(/_/g, " ")}.`
    : "No reorder date is set yet.";
  const flags = score.flags.length ? `Open flags: ${score.flags.join("; ")}.` : "No hard blockers are open.";
  return `${opener} ${decision} ${economics} ${reorder} ${flags} Recommended next move: ${score.recommendation}`;
}

function tone(value: string) {
  if (["SURFACE", "ON_TRACK"].includes(value)) return "green";
  if (["MONITOR", "DUE_SOON", "PROPOSAL"].includes(value)) return "amber";
  if (["EXCLUDE", "AT_RISK", "OVERDUE"].includes(value)) return "red";
  return "gold";
}

function Pill({ value, forced }: { value: string; forced?: string }) {
  return <span className={`roe-pill ${forced || tone(value)}`}>{value.replace(/_/g, " ")}</span>;
}

export default function BacchusRoeWebApp() {
  const [state, setState] = useState<State>(() => initialState());
  const [view, setView] = useState<View>("dashboard");
  const [filter, setFilter] = useState("ALL");
  const [briefId, setBriefId] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bacchus-roe-web-state");
      if (saved) {
        const parsed = JSON.parse(saved) as State;
        setState({ ...parsed, accounts: parsed.accounts.map((account) => ({ ...account, score: scoreAccount(account) })) });
      }
    } catch {
      setState(initialState());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bacchus-roe-web-state", JSON.stringify(state));
    if (!briefId && state.accounts[0]) setBriefId(state.accounts[0].id);
  }, [state, briefId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const accounts = useMemo(() => state.accounts.map((account) => ({ ...account, score: scoreAccount(account) })), [state.accounts]);
  const surfaced = accounts.filter((account) => account.score?.decision === "SURFACE");
  const active = accounts.filter((account) => account.status === "ACTIVE");
  const reorderQueue = accounts
    .filter((account) => ["DUE_SOON", "OVERDUE", "AT_RISK"].includes(account.score?.risk || ""))
    .sort((a, b) => Number(b.estimatedAnnualValue || 0) - Number(a.estimatedAnnualValue || 0));
  const annualValue = accounts.reduce((sum, account) => sum + Number(account.estimatedAnnualValue || 0), 0);
  const targetOunces = accounts.reduce((sum, account) => sum + Number(account.targetMonthlyVolumeOz || account.monthlyVolumeOz || 0), 0);
  const weightedMargin = annualValue
    ? accounts.reduce((sum, account) => sum + Number(account.estimatedAnnualValue || 0) * Number(account.marginPercent || 0), 0) / annualValue
    : 0;
  const chainOk = state.audit.every((entry, index) => index === 0 || entry.prevHash === state.audit[index - 1].hash);
  const selectedBrief = accounts.find((account) => account.id === briefId) || accounts[0];

  function save(nextAccounts: Account[], action: string, entityId: string, payload: unknown) {
    setState((current) =>
      appendAudit(
        {
          ...current,
          accounts: nextAccounts.map((account) => ({ ...account, score: scoreAccount(account) })),
        },
        action,
        "account",
        entityId,
        payload,
      ),
    );
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ ...state, accounts, chainOk }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bacchus-roe-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function addAccount(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    if (!name) return;
    const city = String(data.get("city") || "").trim();
    const account: Account = {
      id: `${name}-${city}-${data.get("state") || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name,
      city,
      state: String(data.get("state") || "").trim(),
      concept: String(data.get("concept") || "FINE_DINING"),
      status: "PROSPECT",
      avgCheck: Number(data.get("avgCheck") || 0),
      marketScore: 70,
      beverageScore: 65,
      estimatedAnnualValue: Number(data.get("estimatedAnnualValue") || 0),
      targetMonthlyVolumeOz: Number(data.get("targetMonthlyVolumeOz") || 0),
      marginPercent: Number(data.get("marginPercent") || 0),
      decisionMaker: String(data.get("decisionMaker") || ""),
      preferredSpecies: String(data.get("preferredSpecies") || ""),
      menuSignals: String(data.get("notes") || "").split(",").map((x) => x.trim()).filter(Boolean),
      buyerNotes: String(data.get("notes") || ""),
      sourceRefs: String(data.get("decisionMaker") || "") ? ["manual:web-entry", "rep:decision-maker"] : ["manual:web-entry"],
    };
    const next = accounts.filter((item) => item.id !== account.id).concat({ ...account, score: scoreAccount(account) });
    save(next, "UPSERT_ACCOUNT", account.id, account);
    form.reset();
    setView("accounts");
    setToast("Account scored");
  }

  function recordPurchase(form: HTMLFormElement) {
    const data = new FormData(form);
    const accountId = String(data.get("accountId") || "");
    const cadence = Number(data.get("cadence") || 21);
    const revenue = Number(data.get("revenue") || 0);
    const margin = Number(data.get("margin") || 0);
    const totalOunces = Number(data.get("totalOunces") || 0);
    const purchase: Purchase = {
      orderedAt: nowIso(),
      productName: String(data.get("productName") || "Reserve Caviar"),
      species: String(data.get("species") || "OSETRA"),
      tinSize: String(data.get("tinSize") || "50g"),
      quantity: Number(data.get("quantity") || 1),
      totalOunces,
      revenue,
      margin,
      notes: String(data.get("notes") || ""),
    };
    const next = accounts.map((account) => {
      if (account.id !== accountId) return account;
      const updated: Account = {
        ...account,
        status: "ACTIVE",
        lastPurchaseAt: purchase.orderedAt,
        nextReorderAt: addDays(cadence),
        reorderCadenceDays: cadence,
        preferredSpecies: purchase.species,
        preferredTinSize: purchase.tinSize,
        monthlyVolumeOz: totalOunces ? Number((totalOunces * (30 / cadence)).toFixed(1)) : account.monthlyVolumeOz,
        estimatedAnnualValue: revenue ? Number((revenue * (365 / cadence)).toFixed(0)) : account.estimatedAnnualValue,
        marginPercent: revenue ? Number(((margin / revenue) * 100).toFixed(1)) : account.marginPercent,
        purchases: [...(account.purchases || []), purchase],
      };
      return { ...updated, score: scoreAccount(updated) };
    });
    save(next, "RECORD_PURCHASE", accountId, purchase);
    setToast("Purchase recorded");
  }

  return (
    <div className="roe-app">
      <style>{roeCss}</style>
      <aside className="roe-rail">
        <div className="roe-brand">
          <b>BACCHUS ROE</b>
          <span>Altima Caviar</span>
        </div>
        <nav>
          {[
            ["dashboard", "Dashboard"],
            ["accounts", "Accounts"],
            ["queue", "Reorders"],
            ["signal", "Intake"],
            ["receipts", "Receipts"],
          ].map(([id, label]) => (
            <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id as View)}>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="roe-main">
        <div className="roe-topbar">
          <div>
            <div className="roe-eyebrow">Altima Caviar - BACCHUS</div>
            <h1>Account Pipeline</h1>
          </div>
          <div className="roe-actions">
            <button className="roe-btn" onClick={() => setState(initialState())}>Reset</button>
            <button className="roe-btn" onClick={exportJson}>Export JSON</button>
            <button className="roe-btn primary" onClick={() => setView("signal")}>New Account</button>
          </div>
        </div>

        {view === "dashboard" && (
          <section>
            <div className="roe-grid roe-metrics">
              <Metric label="Surfaced" value={`${surfaced.length} / ${accounts.length}`} sub="accounts rep-ready" />
              <Metric label="Annual pipeline" value={money(annualValue)} sub="weighted buyer value" />
              <Metric label="Target volume" value={`${Math.round(targetOunces)} oz`} sub="monthly opportunity" />
              <Metric label="Weighted margin" value={`${Math.round(weightedMargin)}%`} sub="across valued accounts" />
            </div>
            <div className="roe-split">
              <Card title="Priority accounts" badge="surface">
                <AccountTable accounts={surfaced.sort((a, b) => (b.score?.fitScore || 0) - (a.score?.fitScore || 0)).slice(0, 8)} />
              </Card>
              <Card title="Reorder alerts" badge={`${reorderQueue.length} alerts`}>
                {reorderQueue.length ? reorderQueue.map((account) => <AccountMini key={account.id} account={account} />) : <p className="roe-muted">No reorder alerts open.</p>}
              </Card>
            </div>
          </section>
        )}

        {view === "accounts" && (
          <section>
            <div className="roe-section-title">
              <h2>Account intelligence</h2>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="ALL">All decisions</option>
                <option value="SURFACE">SURFACE</option>
                <option value="MONITOR">MONITOR</option>
                <option value="EXCLUDE">EXCLUDE</option>
              </select>
            </div>
            <div className="roe-account-grid">
              {accounts.filter((account) => filter === "ALL" || account.score?.decision === filter).map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </section>
        )}

        {view === "queue" && (
          <section className="roe-split">
            <Card title="Reorder queue" badge="call list">
              <AccountTable accounts={reorderQueue} />
            </Card>
            <Card title="Record purchase" badge="cadence">
              <form className="roe-form" onSubmit={(event) => { event.preventDefault(); recordPurchase(event.currentTarget); }}>
                <label>Account<select name="accountId">{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
                <label>Species<select name="species"><option>OSETRA</option><option>SIBERIAN</option><option>KALUGA</option><option>BELUGA_HYBRID</option><option>WHITE_STURGEON</option></select></label>
                <label>Product<input name="productName" defaultValue="Reserve Caviar" /></label>
                <label>Tin size<input name="tinSize" defaultValue="50g" /></label>
                <label>Quantity<input name="quantity" type="number" defaultValue="8" /></label>
                <label>Total ounces<input name="totalOunces" type="number" defaultValue="16" /></label>
                <label>Revenue<input name="revenue" type="number" defaultValue="4800" /></label>
                <label>Margin<input name="margin" type="number" defaultValue="1824" /></label>
                <label>Cadence days<input name="cadence" type="number" defaultValue="21" /></label>
                <textarea name="notes" placeholder="Call notes, chef reaction, objections, service detail" />
                <button className="roe-btn primary" type="submit">Record and rescore</button>
              </form>
            </Card>
          </section>
        )}

        {view === "signal" && (
          <section className="roe-split">
            <Card title="Account intake" badge="score">
              <form className="roe-form" onSubmit={(event) => { event.preventDefault(); addAccount(event.currentTarget); }}>
                <label>Name<input name="name" required placeholder="Restaurant or club" /></label>
                <label>City<input name="city" placeholder="Houston" /></label>
                <label>State<input name="state" placeholder="TX" /></label>
                <label>Concept<select name="concept"><option>FINE_DINING</option><option>OMAKASE</option><option>SEAFOOD</option><option>HOTEL_DINING</option><option>MEMBERS_CLUB</option><option>STEAKHOUSE</option><option>TASTING_MENU</option></select></label>
                <label>Average check<input name="avgCheck" type="number" defaultValue="175" /></label>
                <label>Estimated annual value<input name="estimatedAnnualValue" type="number" defaultValue="50000" /></label>
                <label>Target monthly ounces<input name="targetMonthlyVolumeOz" type="number" defaultValue="30" /></label>
                <label>Margin percent<input name="marginPercent" type="number" defaultValue="38" /></label>
                <label>Decision maker<input name="decisionMaker" placeholder="Chef / GM / F&B Director" /></label>
                <label>Preferred species<input name="preferredSpecies" placeholder="OSETRA" /></label>
                <textarea name="notes" placeholder="Menu signals separated by commas, source refs, buyer notes" />
                <button className="roe-btn primary" type="submit">Score account</button>
              </form>
            </Card>
            <Card title="Client boundary" badge="no server">
              <p className="roe-brief">This web build stores demo workspace data in browser storage for fast client review. Export JSON produces the evidence packet for follow-up. No DMG, no install, no login friction.</p>
            </Card>
          </section>
        )}

        {view === "receipts" && (
          <section className="roe-split">
            <Card title="Receipt chain" badge={chainOk ? "PASS" : "FAIL"}>
              <div className="roe-log">
                {state.audit.slice(-10).reverse().map((entry) => (
                  <div className="roe-log-row" key={entry.hash}>
                    <span>#{entry.sequence}</span>
                    <b>{entry.action}</b>
                    <span>{entry.hash} prev {entry.prevHash.slice(0, 8)}</span>
                    <span>{new Date(entry.at).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Account brief" badge="copy">
              <select value={briefId} onChange={(event) => setBriefId(event.target.value)}>
                {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
              </select>
              <p className="roe-brief">{selectedBrief ? accountBrief(selectedBrief) : "No account selected."}</p>
              <button className="roe-btn" onClick={() => { navigator.clipboard.writeText(selectedBrief ? accountBrief(selectedBrief) : ""); setToast("Brief copied"); }}>Copy brief</button>
            </Card>
          </section>
        )}
      </main>
      {toast ? <div className="roe-toast">{toast}</div> : null}
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="roe-card roe-metric"><span>{label}</span><strong>{value}</strong><div className="roe-muted">{sub}</div></div>;
}

function Card({ title, badge, children }: { title: string; badge: string; children: React.ReactNode }) {
  return <div className="roe-card"><div className="roe-section-title"><h2>{title}</h2><Pill value={badge} forced="gold" /></div>{children}</div>;
}

function AccountTable({ accounts }: { accounts: Account[] }) {
  if (!accounts.length) return <p className="roe-muted">No rows in this view.</p>;
  return (
    <div className="roe-table-wrap">
      <table>
        <thead><tr><th>Account</th><th>Decision</th><th>Score</th><th>Value</th><th>Next move</th></tr></thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td><b>{account.name}</b><div className="roe-muted">{[account.city, account.state].filter(Boolean).join(", ")}</div></td>
              <td><Pill value={account.score?.decision || "MONITOR"} /></td>
              <td className="roe-mono">{account.score?.fitScore}</td>
              <td>{money(account.estimatedAnnualValue)}</td>
              <td>{account.score?.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AccountMini({ account }: { account: Account }) {
  return (
    <div className="roe-mini">
      <div><b>{account.name}</b><Pill value={account.score?.risk || "UNKNOWN"} /></div>
      <p>Next: {account.nextReorderAt ? new Date(account.nextReorderAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "-"} - {money(account.estimatedAnnualValue)} annual</p>
    </div>
  );
}

function AccountCard({ account }: { account: Account }) {
  const score = account.score || scoreAccount(account);
  return (
    <article className="roe-card roe-account-card">
      <header><div><h3>{account.name}</h3><p>{[account.city, account.state, account.concept].filter(Boolean).join(" - ")}</p></div><Pill value={score.decision} /></header>
      <div><span className="roe-eyebrow">AURORA score</span><strong>{score.fitScore}</strong><span className="roe-muted"> confidence {Math.round(score.confidence * 100)}%</span></div>
      <p>{score.recommendation}</p>
      <div className="roe-bars">
        {Object.entries(score.components).map(([key, value]) => (
          <div className="roe-bar" key={key}><span>{key}</span><div><i style={{ width: `${value}%` }} /></div><b>{value}</b></div>
        ))}
      </div>
      <p><b>Buyer:</b> {account.decisionMaker || "unknown"}<br /><b>Preference:</b> {[account.preferredSpecies, account.preferredTinSize].filter(Boolean).join(" / ") || "-"}</p>
    </article>
  );
}

const roeCss = `
.roe-app{--roe-bg:#090806;--roe-panel:#11100d;--roe-panel2:#17140f;--roe-ink:#f7f1e4;--roe-muted:#9c907c;--roe-line:#2a241a;--roe-gold:#d7b46a;--roe-gold2:#8c6a2d;--roe-green:#6ee7a8;--roe-amber:#f4c15f;--roe-red:#ff776b;display:grid;grid-template-columns:270px minmax(0,1fr);min-height:calc(100vh - 76px);background:radial-gradient(circle at 20% 0%,rgba(215,180,106,.14),transparent 30%),var(--roe-bg);color:var(--roe-ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.roe-app *{box-sizing:border-box}.roe-app button,.roe-app input,.roe-app select,.roe-app textarea{font:inherit}.roe-rail{border-right:1px solid var(--roe-line);background:rgba(9,8,6,.92);padding:22px;position:sticky;top:76px;height:calc(100vh - 76px)}.roe-brand{display:grid;gap:4px;margin-bottom:28px}.roe-brand b{font-family:Georgia,serif;letter-spacing:.08em;font-size:22px;color:var(--roe-gold)}.roe-brand span,.roe-eyebrow{color:var(--roe-muted);font-size:11px;text-transform:uppercase;letter-spacing:.16em}.roe-rail nav{display:grid;gap:8px}.roe-rail button{width:100%;text-align:left;border:1px solid transparent;background:transparent;color:var(--roe-muted);padding:11px 12px;border-radius:8px;cursor:pointer}.roe-rail button.active,.roe-rail button:hover{color:var(--roe-ink);background:rgba(215,180,106,.08);border-color:rgba(215,180,106,.18)}
.roe-main{padding:26px;min-width:0}.roe-topbar{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:22px}.roe-topbar h1{margin:0;font-family:Georgia,serif;font-size:clamp(30px,4vw,52px);letter-spacing:-.04em;line-height:.94}.roe-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.roe-btn{border:1px solid var(--roe-line);background:var(--roe-panel);color:var(--roe-ink);border-radius:8px;padding:10px 12px;text-decoration:none;font-size:13px;cursor:pointer}.roe-btn.primary{background:linear-gradient(180deg,#dfbf70,#a57b32);color:#12100a;border-color:#c99b3a;font-weight:800}.roe-grid{display:grid;gap:14px}.roe-metrics{grid-template-columns:repeat(4,minmax(0,1fr));margin-bottom:16px}.roe-card{border:1px solid var(--roe-line);background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01));border-radius:8px;padding:16px;box-shadow:0 18px 50px rgba(0,0,0,.22)}.roe-metric span{color:var(--roe-muted);font-size:11px;text-transform:uppercase;letter-spacing:.14em}.roe-metric strong{display:block;margin-top:9px;font-size:28px;letter-spacing:-.03em}.roe-split{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(320px,.75fr);gap:14px}.roe-section-title{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}.roe-section-title h2{margin:0;font-size:15px;letter-spacing:.02em}.roe-table-wrap{overflow:visible}.roe-app table{width:100%;border-collapse:collapse;table-layout:fixed}.roe-app th{text-align:left;color:var(--roe-muted);font-size:11px;text-transform:uppercase;letter-spacing:.12em;font-weight:600;border-bottom:1px solid var(--roe-line);padding:9px 7px}.roe-app td{border-bottom:1px solid rgba(42,36,26,.65);padding:11px 7px;color:rgba(247,241,228,.82);vertical-align:top;overflow-wrap:anywhere}.roe-app th:nth-child(1),.roe-app td:nth-child(1){width:26%}.roe-app th:nth-child(2),.roe-app td:nth-child(2){width:15%}.roe-app th:nth-child(3),.roe-app td:nth-child(3){width:10%}.roe-app th:nth-child(4),.roe-app td:nth-child(4){width:12%}.roe-app th:nth-child(5),.roe-app td:nth-child(5){width:37%}.roe-muted{color:var(--roe-muted)}.roe-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.roe-pill{display:inline-flex;border:1px solid rgba(255,255,255,.12);color:var(--roe-muted);border-radius:999px;padding:3px 8px;font-size:11px;white-space:nowrap;text-transform:uppercase}.roe-pill.gold{color:var(--roe-gold);border-color:rgba(215,180,106,.38);background:rgba(215,180,106,.1)}.roe-pill.green{color:var(--roe-green);border-color:rgba(110,231,168,.3);background:rgba(110,231,168,.08)}.roe-pill.amber{color:var(--roe-amber);border-color:rgba(244,193,95,.3);background:rgba(244,193,95,.08)}.roe-pill.red{color:var(--roe-red);border-color:rgba(255,119,107,.3);background:rgba(255,119,107,.08)}
.roe-mini{border:1px solid var(--roe-line);border-radius:8px;padding:12px;margin-bottom:10px;background:rgba(255,255,255,.02)}.roe-mini div{display:flex;justify-content:space-between;gap:10px}.roe-mini p{margin:6px 0 0;color:var(--roe-muted);font-size:12px}.roe-account-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}.roe-account-card{display:grid;gap:12px}.roe-account-card header{display:flex;justify-content:space-between;gap:12px}.roe-account-card h3{margin:0;font-size:18px}.roe-account-card p{margin:0;color:var(--roe-muted);font-size:13px;line-height:1.45}.roe-account-card strong{font-size:34px;display:inline-block;margin-right:8px}.roe-bars{display:grid;gap:8px}.roe-bar{display:grid;grid-template-columns:110px 1fr 42px;gap:10px;align-items:center;font-size:12px;color:var(--roe-muted)}.roe-bar div{height:7px;border-radius:99px;background:#29241b;overflow:hidden}.roe-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--roe-gold2),var(--roe-gold));border-radius:inherit}.roe-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.roe-form label{display:grid;gap:5px;color:var(--roe-muted);font-size:11px;text-transform:uppercase;letter-spacing:.12em}.roe-app input,.roe-app select,.roe-app textarea{width:100%;border:1px solid var(--roe-line);background:#0b0a08;color:var(--roe-ink);border-radius:7px;padding:10px}.roe-app textarea{min-height:120px;resize:vertical;grid-column:1/-1;line-height:1.45}.roe-brief{color:rgba(247,241,228,.78);line-height:1.6;font-size:14px}.roe-log{display:grid;gap:8px}.roe-log-row{display:grid;grid-template-columns:50px 140px minmax(0,1fr) 98px;gap:10px;align-items:center;border:1px solid var(--roe-line);background:rgba(255,255,255,.02);border-radius:7px;padding:10px;font-size:12px}.roe-log-row span:nth-child(3){overflow-wrap:anywhere;color:var(--roe-muted);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.roe-toast{position:fixed;right:20px;bottom:20px;background:#18140f;border:1px solid rgba(215,180,106,.4);color:var(--roe-ink);padding:13px 15px;border-radius:8px;box-shadow:0 12px 40px rgba(0,0,0,.4);z-index:50}
@media(max-width:1100px){.roe-app{grid-template-columns:1fr}.roe-rail{position:static;height:auto}.roe-metrics,.roe-split{grid-template-columns:1fr}.roe-topbar{display:grid}.roe-actions{justify-content:flex-start}}@media(max-width:640px){.roe-main{padding:18px}.roe-rail{padding:16px}.roe-form{grid-template-columns:1fr}.roe-account-grid{grid-template-columns:1fr}.roe-log-row{grid-template-columns:1fr}.roe-table-wrap{overflow:auto}.roe-app table{min-width:660px}}
`;
