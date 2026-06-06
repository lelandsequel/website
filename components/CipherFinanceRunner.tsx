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

  const runTicker = async (nextTicker = ticker) => {
    const clean = nextTicker.trim().toUpperCase() || "NVDA";
    setTicker(clean);
    setState({ status: "loading", result: null, error: null });
    try {
      const response = await fetch("/api/cipher/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, ticker: clean }),
      });
      const payload = await response.json() as { result?: CipherWorkbenchResult; error?: string };
      if (!payload.result) throw new Error(payload.error ?? "CIPHER run failed.");
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
    <section className="alchemist-live-runner">
      <div className="live-runner-header cipher-runner-header">
        <div>
          <span>Live local CIPHER runner</span>
          <h2>{mode === "dcf" ? "CIPHER DCF" : "CIPHER COMPS"}</h2>
          <p>
            SEC Company Facts and market snapshots resolve inside JourdanLabs. No iframe,
            no external embed dependency, no hidden fallback company.
          </p>
        </div>
        <div className="live-runner-actions cipher-runner-actions">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void runTicker(ticker);
            }}
            style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
          >
            <input
              value={ticker}
              onChange={(event) => setTicker(event.target.value.toUpperCase())}
              aria-label="Ticker"
              placeholder="NVDA"
              inputMode="text"
              autoCapitalize="characters"
              style={{
                minWidth: 128,
                border: "1px solid var(--bg-border)",
                borderRadius: 14,
                padding: "0.9rem 1rem",
                fontFamily: "var(--font-geist-mono), monospace",
                fontWeight: 850,
                fontSize: "1rem",
              }}
            />
            <button type="submit" className="copy-button primary" disabled={state.status === "loading"}>
              {state.status === "loading" ? "Running..." : mode === "dcf" ? "Run DCF" : "Run COMPS"}
            </button>
          </form>
          <a href={`/api/cipher/run?mode=${mode}&ticker=${ticker || "NVDA"}`} target="_blank" rel="noopener noreferrer">
            JSON endpoint
          </a>
          <button
            type="button"
            className="copy-button"
            disabled={!result}
            onClick={() => copyResult(result, setCopyStatus)}
          >
            {copyStatus}
          </button>
        </div>
      </div>

      <div className="live-runner-manifest" aria-live="polite">
        <span>POST /api/cipher/run</span>
        <strong>{result ? `${result.mode.toUpperCase()} | ${result.decision}` : state.status === "error" ? "Run failed" : "Running source chain"}</strong>
        <code>{result?.corpusSeal ?? (state.status === "error" ? state.error : "Resolving SEC facts + market data")}</code>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {["NVDA", "SND", "CVX", "MPC", "HD"].map((quickTicker) => (
          <button
            key={quickTicker}
            type="button"
            className="copy-button"
            disabled={state.status === "loading"}
            onClick={() => void runTicker(quickTicker)}
          >
            {quickTicker}
          </button>
        ))}
      </div>

      {state.status === "loading" ? (
        <div className="live-runner-empty">
          <strong>Running CIPHER</strong>
          <p>Resolving ticker, pulling SEC Company Facts, fetching market snapshot, and recomputing the model.</p>
        </div>
      ) : null}

      {state.status === "error" ? (
        <div className="live-runner-empty error">
          <strong>CIPHER request failed</strong>
          <p>{state.error}</p>
        </div>
      ) : null}

      {result ? <ResultView result={result} /> : null}
    </section>
  );
}

function ResultView({ result }: { result: CipherWorkbenchResult }) {
  return (
    <>
      <div className="live-runner-output">
        <span>{result.company}</span>
        <h3>{result.headline}</h3>
        <p>{result.summary}</p>
        <div className="live-runner-rows">
          <div>
            <strong>Run ID</strong>
            <code>{result.runId}</code>
            <small>{result.generatedAt}</small>
          </div>
          <div>
            <strong>Sector</strong>
            <code>{result.sector}</code>
            <small>{result.ticker}</small>
          </div>
          {result.metrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.label}</strong>
              <code>{metric.value}</code>
              <small>{metric.tone ?? "neutral"}</small>
            </div>
          ))}
        </div>
      </div>

      {result.peerRows?.length ? <PeerTable result={result} /> : null}

      <div className="live-runner-grid compact">
        <div className="live-runner-output">
          <span>Refusals</span>
          {result.refusals.length ? (
            result.refusals.map((item) => (
              <p key={item.code}>
                <strong>{item.code} · {item.severity}</strong>
                <br />
                {item.message}
                <br />
                <small>{item.remediation}</small>
              </p>
            ))
          ) : (
            <p>No refusal emitted on this run.</p>
          )}
        </div>
        <div className="live-runner-output chain">
          <span>LUNA-style proof rows</span>
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
