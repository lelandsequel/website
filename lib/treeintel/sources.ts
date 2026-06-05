// REAL data adapters — keyless, hit live on every request. No synthetic data.
// Each leg either returns real records, or is honestly reported as "not wired."

export type GeocodeResult = {
  matched: string;
  state?: string;
  county?: string;
  lat?: number;
  lon?: number;
} | null;

// US Census Geocoder — free, keyless. Verifies the address is real + returns county.
export async function geocodeCensus(address: string): Promise<GeocodeResult> {
  const url =
    `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress` +
    `?address=${encodeURIComponent(address)}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "TreeIntel/0.1" }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    const d = await res.json();
    const m = d?.result?.addressMatches?.[0];
    if (!m) return null;
    const counties = m.geographies?.["Counties"];
    return {
      matched: m.matchedAddress,
      state: m.addressComponents?.state,
      county: counties?.[0]?.NAME,
      lat: m.coordinates?.y,
      lon: m.coordinates?.x,
    };
  } catch {
    return null;
  }
}

export type CourtHit = {
  caseName: string;
  court: string;
  date?: string;
  docket?: string;
  nature: "bankruptcy" | "tax / lien" | "foreclosure" | "judgment / civil";
  url?: string;
};

// CourtListener / RECAP (Free Law Project) — free API, keyless (rate-limited;
// a free COURTLISTENER_TOKEN raises limits). Real federal dockets: judgments,
// bankruptcy, foreclosure, tax matters tied to a party name.
export async function searchCourtListener(
  name: string,
  limit = 8,
): Promise<{ ok: boolean; hits: CourtHit[]; total: number }> {
  const token = process.env.COURTLISTENER_TOKEN;
  const url =
    `https://www.courtlistener.com/api/rest/v4/search/` +
    `?q=${encodeURIComponent(`"${name}"`)}&type=r&order_by=score%20desc`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "TreeIntel/0.1", ...(token ? { Authorization: `Token ${token}` } : {}) },
      signal: AbortSignal.timeout(18000),
    });
    if (!res.ok) return { ok: false, hits: [], total: 0 };
    const d = await res.json();
    const hits: CourtHit[] = (d.results ?? []).slice(0, limit).map((r: Record<string, unknown>) => {
      const court = String(r.court ?? r.court_id ?? "");
      const nature = String(r.suitNature ?? "");
      const isBankr = /bankr/i.test(court) || r.chapter != null;
      const isTax = /tax|lien/i.test(nature);
      const isForeclose = /foreclos|real\s+propert|mortgage/i.test(nature);
      return {
        caseName: String(r.caseName ?? r.docketNumber ?? "case"),
        court,
        date: (r.dateFiled ?? r.dateTerminated ?? r.dateArgued) as string | undefined,
        docket: r.docketNumber as string | undefined,
        nature: isBankr ? "bankruptcy" : isTax ? "tax / lien" : isForeclose ? "foreclosure" : "judgment / civil",
        url: r.docket_absolute_url ? `https://www.courtlistener.com${r.docket_absolute_url}` : undefined,
      };
    });
    return { ok: true, hits, total: Number(d.count ?? hits.length) };
  } catch {
    return { ok: false, hits: [], total: 0 };
  }
}
