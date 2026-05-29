"use client";

import { useEffect, useState } from "react";
import { BACCHUS_CELLAR_SAMPLES } from "@/lib/bacchus/cellar-samples";
import type { BacchusCellarResult, BacchusCellarTone } from "@/lib/bacchus/cellar-intelligence";

type ApiState =
  | { status: "loading"; result: null; error: null; remaining: null }
  | { status: "ready"; result: BacchusCellarResult; error: null; remaining: number | null }
  | { status: "error"; result: null; error: string; remaining: null };

const initialSample = BACCHUS_CELLAR_SAMPLES[0];

export default function BacchusCellarRunner() {
  const [packet, setPacket] = useState(initialSample.packet);
  const [sampleId, setSampleId] = useState(initialSample.id);
  const [state, setState] = useState<ApiState>({ status: "loading", result: null, error: null, remaining: null });
  const [copyStatus, setCopyStatus] = useState("Copy brief");
  const [jsonStatus, setJsonStatus] = useState("Export JSON");

  const run = async (nextPacket = packet) => {
    setState({ status: "loading", result: null, error: null, remaining: null });
    try {
      const response = await fetch("/api/bacchus/cellar/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packet: nextPacket }),
      });
      const payload = await response.json() as {
        result?: BacchusCellarResult;
        error?: string;
        access_gate?: { remaining: number };
      };
      if (!response.ok || !payload.result) throw new Error(payload.error ?? "BACCHUS run failed.");
      setState({
        status: "ready",
        result: payload.result,
        error: null,
        remaining: typeof payload.access_gate?.remaining === "number" ? payload.access_gate.remaining : null,
      });
    } catch (error) {
      setState({
        status: "error",
        result: null,
        error: error instanceof Error ? error.message : "BACCHUS run failed.",
        remaining: null,
      });
    }
  };

  useEffect(() => {
    void run(initialSample.packet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = state.status === "ready" ? state.result : null;

  return (
    <section className="alchemist-live-runner" style={{ borderTop: "3px solid #7D2348" }}>
      <div className="live-runner-header">
        <div>
          <span>BACCHUS · distributor workbench</span>
          <h2>Cellar Intelligence</h2>
          <p>
            Paste an account packet and BACCHUS returns account fit, first move, staff education,
            depletion cadence, refusal boundaries, and a proof chain a distributor can hand to a principal.
          </p>
        </div>
        <div className="live-runner-actions">
          <button type="button" className="copy-button primary" disabled={state.status === "loading"} onClick={() => void run(packet)}>
            {state.status === "loading" ? "Running..." : "Run account"}
          </button>
          <a href="/api/bacchus/cellar/run" target="_blank" rel="noopener noreferrer">API manifest</a>
          <button type="button" className="copy-button" disabled={!result} onClick={() => copyBrief(result, setCopyStatus)}>
            {copyStatus}
          </button>
          <button type="button" className="copy-button" disabled={!result} onClick={() => exportJson(result, setJsonStatus)}>
            {jsonStatus}
          </button>
          {state.status === "ready" && state.remaining !== null ? <span className="demo-usage-pill">{state.remaining} runs left</span> : null}
        </div>
      </div>

      <div className="live-runner-manifest" aria-live="polite">
        <span>POST /api/bacchus/cellar/run</span>
        <strong>{result ? `${result.decision} · ${result.fitScore}/100` : state.status === "error" ? "Run failed" : "Scoring account"}</strong>
        <code>{result?.metadata.corpus_seal ?? (state.status === "error" ? state.error : "Resolving account fit + proof boundaries")}</code>
      </div>

      <div className="live-runner-grid">
        <div className="live-runner-input" style={{ alignContent: "start" }}>
          <span className="live-runner-input-head">
            <strong>Account packet</strong>
            <em>{packet.length.toLocaleString()} chars</em>
          </span>
          <select
            value={sampleId}
            aria-label="Sample account packet"
            onChange={(event) => {
              const sample = BACCHUS_CELLAR_SAMPLES.find((item) => item.id === event.target.value);
              if (!sample) return;
              setSampleId(sample.id);
              setPacket(sample.packet);
              void run(sample.packet);
            }}
            style={{
              display: "block",
              boxSizing: "border-box",
              height: 42,
              minHeight: 42,
              maxHeight: 42,
              border: "1px solid var(--accent-border)",
              borderRadius: 12,
              background: "rgba(255,255,255,0.9)",
              color: "var(--purple-900)",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.72rem",
              fontWeight: 900,
              letterSpacing: "0.04em",
              padding: "0 0.75rem",
              textTransform: "uppercase",
            }}
          >
            {BACCHUS_CELLAR_SAMPLES.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.label}
              </option>
            ))}
          </select>
          <label className="live-runner-textarea-label" htmlFor="bacchus-cellar-packet">
            Account evidence
          </label>
          <textarea
            id="bacchus-cellar-packet"
            value={packet}
            onChange={(event) => {
              setPacket(event.target.value);
              setSampleId("custom");
            }}
            spellCheck={false}
          />
          <small>
            Useful packets include account type, buyer, current beverage program, distributor goal,
            available proof, and any compliance constraints.
          </small>
        </div>

        <div className="live-runner-output">
          {state.status === "loading" ? (
            <div className="live-runner-empty">
              <strong>Running BACCHUS</strong>
              <p>Scoring account fit, parsing proof, building training/depletion plan, and checking refusal boundaries.</p>
            </div>
          ) : null}

          {state.status === "error" ? (
            <div className="live-runner-empty error">
              <strong>BACCHUS request failed</strong>
              <p>{state.error}</p>
            </div>
          ) : null}

          {result ? <ResultView result={result} /> : null}
        </div>
      </div>
    </section>
  );
}

function ResultView({ result }: { result: BacchusCellarResult }) {
  return (
    <>
      <span>{result.accountName}</span>
      <h3>{result.headline}</h3>
      <p>{result.brief}</p>
      <div className="live-runner-rows">
        <div>
          <strong>First move</strong>
          <code>{result.firstMove}</code>
          <small>{result.accountType} · {result.lane}</small>
        </div>
      </div>

      <div className="live-runner-rows" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {result.metrics.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.label}</strong>
            <code style={{ color: toneColor(metric.tone) }}>{metric.value}</code>
            <small>{metric.detail}</small>
          </div>
        ))}
      </div>

      <PlanBlock title="Placement plan" items={result.placementPlan} />
      <PlanBlock title="Staff training packet" items={result.trainingPacket} />
      <PlanBlock title="Depletion cadence" items={result.depletionPlan} />

      <div className="live-runner-grid compact">
        <div className="live-runner-output" style={{ padding: 0, border: 0, background: "transparent" }}>
          <span>Refusals</span>
          {result.refusals.length ? (
            result.refusals.map((refusal) => (
              <p key={refusal.code}>
                <strong>{refusal.code} · {refusal.severity}</strong>
                <br />
                {refusal.message}
                <br />
                <small>{refusal.remediation}</small>
              </p>
            ))
          ) : (
            <p>No refusal emitted on this account packet.</p>
          )}
        </div>
        <div className="live-runner-output chain" style={{ padding: 0, border: 0, background: "transparent", marginTop: 0 }}>
          <span>Proof rows</span>
          <div className="live-runner-chain">
            {result.proofRows.map((row) => (
              <div key={row.id}>
                <strong>{row.id} · {row.source}</strong>
                <code>{row.hash}</code>
                <small>{row.detail}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PlanBlock({ title, items }: { title: string; items: Array<{ title: string; detail: string }> }) {
  return (
    <div className="live-runner-output" style={{ marginTop: "1rem" }}>
      <span>{title}</span>
      <div className="live-runner-rows">
        {items.map((item) => (
          <div key={item.title}>
            <strong>{item.title}</strong>
            <small>{item.detail}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function toneColor(tone: BacchusCellarTone) {
  if (tone === "success") return "#08734f";
  if (tone === "warning") return "#9a5b00";
  if (tone === "danger") return "#b2471d";
  return "var(--accent)";
}

async function copyBrief(result: BacchusCellarResult | null, setStatus: (status: string) => void) {
  if (!result) return;
  const text = [
    result.headline,
    "",
    result.brief,
    "",
    `First move: ${result.firstMove}`,
    "",
    "Placement plan:",
    ...result.placementPlan.map((item) => `- ${item.title}: ${item.detail}`),
    "",
    "Training packet:",
    ...result.trainingPacket.map((item) => `- ${item.title}: ${item.detail}`),
    "",
    "Depletion cadence:",
    ...result.depletionPlan.map((item) => `- ${item.title}: ${item.detail}`),
  ].join("\n");
  try {
    await navigator.clipboard.writeText(text);
    setStatus("Copied");
  } catch {
    setStatus("Copy failed");
  }
  window.setTimeout(() => setStatus("Copy brief"), 1400);
}

function exportJson(result: BacchusCellarResult | null, setStatus: (status: string) => void) {
  if (!result) return;
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${result.accountName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-bacchus-cellar.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  setStatus("Exported");
  window.setTimeout(() => setStatus("Export JSON"), 1400);
}
