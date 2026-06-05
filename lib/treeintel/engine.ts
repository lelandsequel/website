import { createHash } from "node:crypto";
import type { CourtHit, GeocodeResult } from "./sources";

// TreeIntel is honest about coverage: it scores ONLY the legs it actually read
// (live, real data), and lists every leg it could not read as "not checked,"
// with what unlocks it. No synthetic data. No invented findings.

export type ReconContext = {
  addressInput: string;
  geo: GeocodeResult; // real Census result, or null if the address didn't resolve
  owner?: string; // owner name (user-provided in v1; auto on Regrid key later)
  court: { ran: boolean; ok: boolean; hits: CourtHit[]; total: number };
};

export type CloudLead = { nature: CourtHit["nature"]; caseName: string; court: string; date?: string; url?: string };
export type NotChecked = { leg: string; why: string; unlock: string };

export type TitleReport = {
  address: string;
  addressVerified: boolean;
  location?: string;
  owner?: string;
  verdict: "ADDRESS NOT FOUND" | "OWNER NEEDED" | "NO COURT RECORDS" | "REVIEW — COURT RECORDS" | "MULTIPLE COURT CLOUDS";
  score: number;
  headline: string;
  coverageNote: string;
  cloudLeads: CloudLead[];
  courtTotal: number;
  notChecked: NotChecked[];
  facts: { label: string; value: string }[];
  sources: { name: string; status: "live" | "not wired"; detail: string }[];
  receipt: { engine_version: string; input_hash: string; checked: string[] };
};

const ENGINE_VERSION = "treeintel-engine-v0.2.0-live";
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

const NATURE_WEIGHT: Record<CourtHit["nature"], number> = {
  foreclosure: 20,
  bankruptcy: 16,
  "tax / lien": 15,
  "judgment / civil": 8,
};

function notWiredLegs(hasOwner: boolean): NotChecked[] {
  const legs: NotChecked[] = [
    { leg: "Owner of record (by address)", why: hasOwner ? "Using the name you provided." : "Not resolved from the address.", unlock: "Connect a free Regrid key for nationwide auto-owner, or type the owner name." },
    { leg: "Owner deceased?", why: "Death records not queried.", unlock: "Connect a free FamilySearch dev key (flags historical deaths)." },
    { leg: "Heir / family tree", why: "Heirship not built.", unlock: "FamilySearch kinship + obituary mining (after a death is confirmed)." },
    { leg: "Deed chain of title", why: "Recorder index not read.", unlock: "County recorder access (per-county — the real engineering lift)." },
    { leg: "County liens / tax", why: "County recorder not read.", unlock: "County recorder / treasurer access (per-county)." },
  ];
  return hasOwner ? legs.slice(1) : legs;
}

export function buildReport(ctx: ReconContext): TitleReport {
  const checked: string[] = [];
  const sources: TitleReport["sources"] = [];

  // ── Address (Census, live) ───────────────────────────────────────────────
  const addressVerified = !!ctx.geo;
  sources.push({ name: "US Census Geocoder", status: "live", detail: addressVerified ? "address verified" : "no match" });
  if (addressVerified) checked.push("address");
  const location = ctx.geo ? [ctx.geo.county, ctx.geo.state].filter(Boolean).join(", ") : undefined;

  // ── Court records (CourtListener, live) ──────────────────────────────────
  const cloudLeads: CloudLead[] = ctx.court.hits.map((h) => ({ nature: h.nature, caseName: h.caseName, court: h.court, date: h.date, url: h.url }));
  if (ctx.court.ran) {
    sources.push({ name: "CourtListener / RECAP (federal)", status: ctx.court.ok ? "live" : "not wired", detail: ctx.court.ok ? `${ctx.court.total.toLocaleString()} name matches` : "lookup failed (rate limit?)" });
    if (ctx.court.ok) checked.push("federal court records");
  } else {
    sources.push({ name: "CourtListener / RECAP (federal)", status: "not wired", detail: "needs an owner name to search" });
  }

  // ── Honest score: ONLY from real court leads. Capped. ────────────────────
  const raw = cloudLeads.reduce((s, c) => s + NATURE_WEIGHT[c.nature], 0);
  const score = Math.min(100, raw);

  // ── Verdict ──────────────────────────────────────────────────────────────
  let verdict: TitleReport["verdict"];
  let headline: string;
  if (!addressVerified) {
    verdict = "ADDRESS NOT FOUND";
    headline = "The US Census geocoder couldn't resolve this address. Check the spelling, or it may be new/rural.";
  } else if (!ctx.owner) {
    verdict = "OWNER NEEDED";
    headline = "Address verified. Add the owner's name (or connect a Regrid key) and TreeIntel scans the federal court records live.";
  } else if (ctx.court.total === 0) {
    verdict = "NO COURT RECORDS";
    headline = `No federal court records match "${ctx.owner}". That clears the federal-court leg — county records still need checking.`;
  } else if (score >= 41) {
    verdict = "MULTIPLE COURT CLOUDS";
    headline = `Federal court records matching "${ctx.owner}" — bankruptcies/foreclosures/liens among them. Review and confirm identity before relying on any.`;
  } else {
    verdict = "REVIEW — COURT RECORDS";
    headline = `Federal court records match "${ctx.owner}". They're name matches — confirm identity before treating any as a cloud.`;
  }

  const notChecked = notWiredLegs(!!ctx.owner);
  sources.push(
    { name: "Regrid / county parcel (owner)", status: "not wired", detail: "free Regrid key, or per-county ArcGIS" },
    { name: "FamilySearch (death + heirs)", status: "not wired", detail: "free dev key" },
    { name: "County recorder (deed chain, liens)", status: "not wired", detail: "per-county — the real lift" },
  );

  const facts: { label: string; value: string }[] = [
    { label: "Address", value: ctx.geo?.matched ?? ctx.addressInput },
    { label: "County", value: location ?? "—" },
    { label: "Owner searched", value: ctx.owner ?? "— (not provided)" },
    { label: "Court name-matches", value: ctx.court.ran && ctx.court.ok ? ctx.court.total.toLocaleString() : "—" },
  ];

  return {
    address: ctx.geo?.matched ?? ctx.addressInput,
    addressVerified,
    location,
    owner: ctx.owner,
    verdict,
    score,
    headline,
    coverageNote: `Checked live: ${checked.join(", ") || "nothing"}. Not checked: ${notChecked.map((n) => n.leg.toLowerCase()).join(", ")} — each needs a key or per-county records access (below).`,
    cloudLeads,
    courtTotal: ctx.court.total,
    notChecked,
    facts,
    sources,
    receipt: { engine_version: ENGINE_VERSION, input_hash: `sha256:${sha(JSON.stringify({ a: ctx.addressInput, o: ctx.owner }))}`, checked },
  };
}

export const VERDICT_COLOR: Record<TitleReport["verdict"], string> = {
  "ADDRESS NOT FOUND": "var(--ti-dim)",
  "OWNER NEEDED": "var(--ti-accent)",
  "NO COURT RECORDS": "var(--ti-green)",
  "REVIEW — COURT RECORDS": "var(--ti-amber)",
  "MULTIPLE COURT CLOUDS": "var(--ti-orange)",
};
