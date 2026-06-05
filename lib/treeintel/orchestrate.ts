import { buildReport, type TitleReport, type ReconContext } from "./engine";
import { geocodeCensus, searchCourtListener, type CourtHit } from "./sources";

export type ReconOutcome = { ok: true; report: TitleReport } | { ok: false; error: string };

// Live every time. Leg 1: Census verifies the real address. Leg 2: CourtListener
// returns real federal court records for the owner name. No synthetic data — the
// legs we haven't wired are reported as "not checked," never invented.
export async function recon(addressInput: string, owner?: string): Promise<ReconOutcome> {
  const address = addressInput.trim();
  if (!address) return { ok: false, error: "Provide a property address." };

  const geo = await geocodeCensus(address);

  const ownerName = owner?.trim() || undefined;
  let court: ReconContext["court"] = { ran: false, ok: false, hits: [] as CourtHit[], total: 0 };
  if (ownerName) {
    const r = await searchCourtListener(ownerName);
    court = { ran: true, ok: r.ok, hits: r.hits, total: r.total };
  }

  return { ok: true, report: buildReport({ addressInput: address, geo, owner: ownerName, court }) };
}
