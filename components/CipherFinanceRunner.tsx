"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { CipherMode, CipherWorkbenchResult } from "@/lib/alchemist/cipher-workbench";

type RunState =
  | { status: "loading"; result: null; error: null }
  | { status: "ready"; result: CipherWorkbenchResult; error: null }
  | { status: "error"; result: null; error: string };

export default function CipherFinanceRunner({
  mode,
  initialTicker = "NVDA",
}: {
  mode: CipherMode;
  initialTicker?: string;
}) {
  const [ticker, setTicker] = useState(initialTicker);
  const [state, setState] = useState<RunState>({ status: "loading", result: null, error: null });
  const [copyStatus, setCopyStatus] = useState("Copy JSON");
  const [stageIndex, setStageIndex] = useState(0);

  const runTicker = async (nextTicker = ticker) => {
    const clean = nextTicker.trim().toUpperCase() || "NVDA";
    setTicker(clean);
    setStageIndex(0);
    setState({ status: "loading", result: null, error: null });
    try {
      const request = fetch("/api/cipher/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, ticker: clean }),
      }).then((response) => response.json() as Promise<{ result?: CipherWorkbenchResult; error?: string }>);

      const stageRun = animateStages(setStageIndex);
      const [payload] = await Promise.all([request, stageRun]);

      if (!payload.result) throw new Error(payload.error ?? "CIPHER run failed.");
      setStageIndex(4);
      setState({ status: "ready", result: payload.result, error: null });
      window.history.replaceState(null, "", `${window.location.pathname}?ticker=${payload.result.ticker}`);
    } catch (error) {
      setState({ status: "error", result: null, error: error instanceof Error ? error.message : "CIPHER run failed." });
    }
  };

  useEffect(() => {
    void runTicker(initialTicker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialTicker]);

  const result = state.status === "ready" ? state.result : null;

  return (
    <section className="cipher-workbench">
      <div className="cipher-runner-top">
        <div>
          <span>{mode === "dcf" ? "DCF workbench" : "COMPS workbench"}</span>
          <h2>{mode === "dcf" ? "CIPHER" : "COMPS"}</h2>
        </div>
        <div className="cipher-run-state" aria-live="polite">
          <strong>{result ? result.decision : state.status === "error" ? "ERROR" : "RUNNING"}</strong>
          <small>{result?.ticker ?? (ticker.trim().toUpperCase() || "NVDA")}</small>
        </div>
      </div>

      <div className="cipher-run-console">
        <div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void runTicker(ticker);
            }}
            className="cipher-ticker-form"
          >
            <input
              value={ticker}
              onChange={(event) => setTicker(event.target.value.toUpperCase())}
              aria-label="Ticker"
              placeholder="NVDA"
              inputMode="text"
              autoCapitalize="characters"
            />
            <button type="submit" className="copy-button primary" disabled={state.status === "loading"}>
              {state.status === "loading" ? "Running..." : mode === "dcf" ? "Run DCF" : "Run COMPS"}
            </button>
          </form>
          <div className="cipher-quick-row" aria-label="Example symbols">
            <span>Try</span>
            {["NVDA", "CVX", "MPC", "HD", "SND"].map((quickTicker) => (
              <button
                key={quickTicker}
                type="button"
                disabled={state.status === "loading"}
                onClick={() => void runTicker(quickTicker)}
              >
                {quickTicker}
              </button>
            ))}
          </div>
        </div>
        <div className="cipher-source-note">
          <strong>Source chain</strong>
          <span>{state.status === "loading" ? "Running stages" : result ? "Receipt sealed" : "Awaiting run"}</span>
        </div>
      </div>

      <CipherStageStrip mode={mode} status={state.status} stageIndex={stageIndex} />

      {state.status === "loading" ? (
        <div className="cipher-empty">
          <strong>Running CIPHER</strong>
          <p>Resolving the public filer, market snapshot, and model assumptions.</p>
        </div>
      ) : null}

      {state.status === "error" ? (
        <div className="cipher-empty error">
          <strong>CIPHER request failed</strong>
          <p>{state.error}</p>
        </div>
      ) : null}

      {result ? <ResultView result={result} copyStatus={copyStatus} setCopyStatus={setCopyStatus} /> : null}
    </section>
  );
}

async function animateStages(setStageIndex: (stageIndex: number) => void) {
  for (let index = 1; index <= 4; index += 1) {
    await new Promise((resolve) => window.setTimeout(resolve, 280));
    setStageIndex(index);
  }
}

function CipherStageStrip({ mode, status, stageIndex }: { mode: CipherMode; status: RunState["status"]; stageIndex: number }) {
  const stages = [
    ["01", "Resolve ticker"],
    ["02", "SEC facts"],
    ["03", "Market snapshot"],
    ["04", mode === "dcf" ? "Compute DCF" : "Build comps"],
    ["05", "Seal receipt"],
  ];
  return (
    <div className="cipher-stage-strip" aria-label="CIPHER run stages">
      {stages.map(([number, label], index) => {
        const stateClass = status === "ready" ? "done" : status === "error" ? "error" : index < stageIndex ? "done" : index === stageIndex ? "active" : "pending";
        return (
          <div className={stateClass} key={label}>
            <span>{number}</span>
            <strong>{label}</strong>
          </div>
        );
      })}
    </div>
  );
}

function ResultView({
  result,
  copyStatus,
  setCopyStatus,
}: {
  result: CipherWorkbenchResult;
  copyStatus: string;
  setCopyStatus: (status: string) => void;
}) {
  return (
    <>
      <div className="cipher-result-card">
        <div className="cipher-result-head">
          <div>
            <span>{result.company}</span>
            <h3>{result.headline}</h3>
          </div>
          <strong className={`cipher-verdict ${result.decision.toLowerCase()}`}>{result.decision}</strong>
        </div>
        <div className="cipher-metric-grid">
          {result.metrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.label}</strong>
              <code>{metric.value}</code>
              <small>{metric.tone ?? "computed"}</small>
            </div>
          ))}
        </div>
        <p>{result.summary}</p>
      </div>

      {result.peerRows?.length ? <PeerTable result={result} /> : null}

      <details className="cipher-details">
        <summary>Receipts, refusals, and JSON</summary>
        <div className="cipher-detail-grid">
          <div>
            <span>Run</span>
            <p><strong>Run ID</strong><br /><code>{result.runId}</code></p>
            <p><strong>Generated</strong><br />{result.generatedAt}</p>
            <p><strong>Corpus seal</strong><br /><code>{result.corpusSeal}</code></p>
          </div>
          <div>
            <span>Refusals</span>
            {result.refusals.length ? (
              result.refusals.map((item) => (
                <p key={item.code}>
                  <strong>{item.code} · {item.severity}</strong><br />
                  {item.message}<br />
                  <small>{item.remediation}</small>
                </p>
              ))
            ) : (
              <p>No refusal emitted on this run.</p>
            )}
          </div>
          <div>
            <span>Proof rows</span>
            {result.proofRows.map((proofRow) => (
              <p key={proofRow.id}>
                <strong>{proofRow.id} · {proofRow.source}</strong><br />
                <code>{proofRow.hash}</code><br />
                <small>{proofRow.detail}</small>
              </p>
            ))}
          </div>
          <div>
            <span>Export</span>
            <button
              type="button"
              className="copy-button"
              onClick={() => copyResult(result, setCopyStatus)}
            >
              {copyStatus}
            </button>
          </div>
        </div>
      </details>
    </>
  );
}

function PeerTable({ result }: { result: CipherWorkbenchResult }) {
  return (
    <div className="live-runner-output">
      <span>Peer set</span>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead>
            <tr>
              {["Ticker", "Company", "EV / Revenue", "EV / EBITDA", "Revenue", "EBITDA", "Refusal"].map((head) => (
                <th key={head} style={cellStyle("left", true)}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.peerRows?.map((peer) => (
              <tr key={peer.ticker}>
                <td style={cellStyle("left")}>{peer.ticker}</td>
                <td style={cellStyle("left")}>{peer.company}</td>
                <td style={cellStyle()}>{peer.evRevenue}</td>
                <td style={cellStyle()}>{peer.evEbitda}</td>
                <td style={cellStyle()}>{peer.revenue}</td>
                <td style={cellStyle()}>{peer.ebitda}</td>
                <td style={cellStyle("left")}>{peer.refusal ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function cellStyle(textAlign: "left" | "right" = "right", header = false): CSSProperties {
  return {
    textAlign,
    padding: "0.8rem",
    borderBottom: "1px solid var(--bg-border)",
    color: header ? "var(--text-primary)" : "var(--text-secondary)",
    fontSize: header ? "0.72rem" : "0.82rem",
    fontWeight: header ? 900 : 700,
    textTransform: header ? "uppercase" : "none",
    letterSpacing: header ? "0.08em" : "0",
  };
}

async function copyResult(result: CipherWorkbenchResult | null, setCopyStatus: (status: string) => void) {
  if (!result) return;
  try {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopyStatus("Copied");
  } catch {
    setCopyStatus("Copy failed");
  }
  window.setTimeout(() => setCopyStatus("Copy JSON"), 1400);
}
