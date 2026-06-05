import type { Metadata } from "next";
import TreeIntelClient from "@/components/TreeIntelClient";
import "./treeintel.css";

export const metadata: Metadata = {
  title: "TreeIntel — a live title-cloud scan before you tie up the deal",
  description:
    "Type a property address and owner. TreeIntel verifies the address against the US Census and scans federal court records (judgments, bankruptcies, liens) for the owner — live, real, no synthetic data — and tells you plainly what it checked and what it couldn't.",
  robots: { index: false, follow: false },
};

export default function TreeIntelPage() {
  return (
    <div className="ti">
      <main className="wrap">
        <span className="eyebrow">TreeIntel · JourdanLabs · v0.2 · live data</span>
        <h1>A live title-cloud scan before you tie up the deal.</h1>
        <p className="sub">
          Type an address and the owner. TreeIntel verifies the address against the US Census and scans federal court
          records — judgments, bankruptcies, liens — for that owner, <strong>live and real</strong>. Then it tells you
          plainly what it checked and what it couldn&apos;t. No synthetic data. If a leg isn&apos;t wired yet, it says so.
        </p>
        <TreeIntelClient />
        <p className="foot">
          Real & live, keyless: <strong>US Census Geocoder</strong> + <strong>CourtListener / RECAP</strong>. The deeper
          legs — owner-by-address, owner death, the heir tree, the deed chain, county liens — are honestly marked
          &ldquo;not checked&rdquo; until their free keys (Regrid · FamilySearch) or per-county records access are wired.
          Court records are <em>name matches</em> — confirm identity before relying on any. Not legal advice; resolving
          living heirs implicates FCRA/DPPA — get counsel before that step.
        </p>
      </main>
    </div>
  );
}
