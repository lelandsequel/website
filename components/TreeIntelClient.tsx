"use client";

import { useState } from "react";
import type { TitleReport } from "@/lib/treeintel/engine";

const VCOLOR: Record<TitleReport["verdict"], string> = {
  "ADDRESS NOT FOUND": "var(--ti-dim)",
  "OWNER NEEDED": "var(--ti-accent)",
  "NO COURT RECORDS": "var(--ti-green)",
  "REVIEW — COURT RECORDS": "var(--ti-amber)",
  "MULTIPLE COURT CLOUDS": "var(--ti-orange)",
};
const NCOLOR: Record<string, { bg: string; fg: string }> = {
  foreclosure: { bg: "rgba(240,88,79,0.15)", fg: "var(--ti-red)" },
  bankruptcy: { bg: "rgba(240,138,60,0.15)", fg: "var(--ti-orange)" },
  "tax / lien": { bg: "rgba(233,185,73,0.15)", fg: "var(--ti-amber)" },
  "judgment / civil": { bg: "rgba(78,161,255,0.15)", fg: "var(--ti-accent)" },
};

// Real example searches — companies (not private individuals) so the demo
// surfaces real public records without exposing a random person.
const EXAMPLES = [
  { address: "1600 Amphitheatre Pkwy, Mountain View, CA", owner: "Google LLC" },
  { address: "350 Fifth Ave, New York, NY", owner: "Wells Fargo" },
];

type Outcome = { ok: true; report: TitleReport } | { ok: false; error: string };

export default function TreeIntelClient() {
  const [address, setAddress] = useState("");
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  async function run(addr = address, own = owner) {
    const a = addr.trim();
    if (!a) return;
    setAddress(a);
    setOwner(own);
    setLoading(true);
    setOutcome(null);
    try {
      const res = await fetch("/api/treeintel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: a, owner: own.trim() || undefined }),
      });
      setOutcome(await res.json());
    } catch {
      setOutcome({ ok: false, error: "Network error." });
    } finally {
      setLoading(false);
    }
  }

  const r = outcome?.ok ? outcome.report : null;

  return (
    <>
      <div className="searchbar" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <input value={address} onChange={(e) => setAddress(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="Property address (required)" spellCheck={false} />
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <input value={owner} onChange={(e) => setOwner(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="Owner name (optional — unlocks the live court scan)" spellCheck={false} style={{ flex: "1 1 280px" }} />
          <button onClick={() => run()} disabled={loading || !address.trim()}>{loading ? "Running…" : "Run recon"}</button>
        </div>
      </div>
      <div className="samples">
        live examples:{" "}
        {EXAMPLES.map((ex, i) => (
          <span key={ex.owner}>
            {i > 0 && " · "}
            <button onClick={() => run(ex.address, ex.owner)}>{ex.owner} @ {ex.address.split(",")[0]}</button>
          </span>
        ))}
      </div>

      {outcome && !outcome.ok && (
        <div className="report"><div className="panel"><p className="err">{outcome.error}</p></div></div>
      )}

      {r && (
        <div className="report">
          <div className="verdictcard" style={{ borderColor: VCOLOR[r.verdict] }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <div className="label" style={{ color: VCOLOR[r.verdict] }}>{r.verdict}</div>
                <div className="gist">{r.headline}</div>
              </div>
              {r.cloudLeads.length > 0 && <div className="score" style={{ color: VCOLOR[r.verdict] }}>{r.score}<span style={{ fontSize: "1.1rem", color: "var(--ti-dim)" }}>/100</span></div>}
            </div>
            {r.cloudLeads.length > 0 && <div className="bar"><div style={{ width: `${r.score}%`, background: VCOLOR[r.verdict] }} /></div>}
            <div style={{ marginTop: "0.7rem", fontFamily: "var(--ti-mono)", fontSize: "0.72rem", color: "var(--ti-amber)" }}>
              {r.coverageNote}
            </div>
          </div>

          <div className="grid2">
            <div className="panel">
              <h3>What we read</h3>
              {r.facts.map((f) => (<div className="kv" key={f.label}><span className="k">{f.label}</span><span className="v">{f.value}</span></div>))}
            </div>
            <div className="panel">
              <h3>Data sources</h3>
              {r.sources.map((s) => (
                <div className="kv" key={s.name}>
                  <span className="k">{s.name}</span>
                  <span className="v sourcebadge"><span className={s.status === "live" ? "live" : "demo"}>{s.status === "live" ? "● LIVE" : "○ not wired"}</span></span>
                </div>
              ))}
            </div>
          </div>

          {r.cloudLeads.length > 0 && (
            <div className="panel">
              <h3>Federal court records — name matches ({r.courtTotal.toLocaleString()} total, top {r.cloudLeads.length})</h3>
              <p className="gist" style={{ fontSize: "0.78rem", marginTop: "-0.3rem", marginBottom: "0.6rem", color: "var(--ti-amber)" }}>
                These match the name — they are leads, not confirmed against this property. Open the docket and confirm identity before treating any as a cloud.
              </p>
              {r.cloudLeads.map((c, i) => (
                <div className="row" key={i}>
                  <span className="pill" style={{ background: NCOLOR[c.nature].bg, color: NCOLOR[c.nature].fg }}>{c.nature}</span>
                  <div className="body">
                    <div className="t">{c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer">{c.caseName}</a> : c.caseName}</div>
                    <div className="d">{c.court}{c.date ? ` · filed ${c.date}` : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="panel">
            <h3>Not checked — and what unlocks it</h3>
            {r.notChecked.map((n) => (
              <div className="row" key={n.leg}>
                <span className="pill" style={{ background: "rgba(98,112,140,0.18)", color: "var(--ti-muted)" }}>not checked</span>
                <div className="body">
                  <div className="t">{n.leg}</div>
                  <div className="d">{n.why} <span style={{ color: "var(--ti-accent)" }}>→ {n.unlock}</span></div>
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="receipt">
              deterministic over what it read · scored only from live data, never invented<br />
              {r.receipt.input_hash} · checked: {r.receipt.checked.join(", ") || "—"} · {r.receipt.engine_version}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
