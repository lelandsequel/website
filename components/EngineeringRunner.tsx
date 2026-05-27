"use client";

import { useEffect, useId, useState } from "react";
import type { EngineeringMode, EngineeringModule, EngineeringResult } from "@/lib/engineering-suite";
import styles from "@/app/omnis/omnis.module.css";

type ApiState =
  | { status: "idle"; result: null; error: null }
  | { status: "loading"; result: null; error: null }
  | { status: "ready"; result: EngineeringResult; error: null }
  | { status: "error"; result: null; error: string };

type AccessGateState = {
  limit: number;
  remaining: number;
  resetAt: string;
} | null;

async function runEngineering(mode: EngineeringMode, packet: string, signal: AbortSignal) {
  const response = await fetch("/api/omnis/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, packet }),
    signal,
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? "Engineering runner failed.");
  return {
    result: payload.result as EngineeringResult,
    accessGate: parseAccessGate(response, payload.access_gate ?? payload.demo_gate),
  };
}

function initialState(): ApiState {
  return { status: "loading", result: null, error: null };
}

export default function EngineeringRunner({ module }: { module: EngineeringModule }) {
  const [packet, setPacket] = useState(module.samplePacket);
  const [state, setState] = useState<ApiState>(initialState);
  const [copyStatus, setCopyStatus] = useState("Copy LLM prompt");
  const [downloadStatus, setDownloadStatus] = useState("Export JSON");
  const [runStatus, setRunStatus] = useState("Run packet");
  const [accessGate, setAccessGate] = useState<AccessGateState>(null);
  const fileInputId = useId();
  const result = state.status === "ready" ? state.result : null;

  const runPacket = (packetToRun = packet, signal?: AbortSignal) => {
    if (!packetToRun.trim()) {
      setState({ status: "idle", result: null, error: null });
      return;
    }
    const activeSignal = signal ?? new AbortController().signal;
    setRunStatus("Running...");
    setState(initialState());
    runEngineering(module.id, packetToRun, activeSignal)
      .then((next) => {
        setAccessGate(next.accessGate);
        setState({ status: "ready", result: next.result, error: null });
      })
      .catch((error: Error) => {
        if (!activeSignal.aborted) setState({ status: "error", result: null, error: error.message });
      })
      .finally(() => {
        if (!activeSignal.aborted) setRunStatus("Run packet");
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    setPacket(module.samplePacket);
    runPacket(module.samplePacket, controller.signal);
    return () => controller.abort();
  }, [module.id, module.samplePacket]);

  const handleCopyPrompt = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.benchmarkPrompt)
      .then(() => setCopyStatus("Copied"))
      .catch(() => setCopyStatus("Copy failed"));
    window.setTimeout(() => setCopyStatus("Copy LLM prompt"), 1400);
  };

  const handleExport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${module.id}-${result.metadata.input_hash.slice(7, 19)}.json`;
    link.click();
    URL.revokeObjectURL(href);
    setDownloadStatus("Exported");
    window.setTimeout(() => setDownloadStatus("Export JSON"), 1400);
  };

  const handleFile = (file: File) => {
    if (file.size > 1_000_000) {
      setState({ status: "error", result: null, error: "Upload a sanitized TXT, MD, JSON, or CSV packet under 1 MB." });
      return;
    }
    file.text()
      .then((text) => {
        setPacket(text);
        setState({ status: "idle", result: null, error: null });
      })
      .catch(() => setState({ status: "error", result: null, error: "Could not read that file." }));
  };

  return (
    <section className={styles.runner}>
      <div className={styles.runnerHeader}>
        <div>
          <span>{module.name} deterministic workbench</span>
          <h2>{module.headline}</h2>
        </div>
        <div className={styles.runnerActions}>
          {accessGate ? (
            <span className={styles.usagePill}>
              {accessGate.remaining}/{accessGate.limit} runs left
            </span>
          ) : null}
          <button type="button" onClick={() => runPacket(packet)} disabled={!packet.trim() || state.status === "loading"}>
            {state.status === "loading" ? "Running..." : runStatus}
          </button>
          <a href="/api/omnis/run" target="_blank" rel="noopener noreferrer">API manifest</a>
          <button type="button" onClick={handleCopyPrompt} disabled={!result}>{copyStatus}</button>
          <button type="button" onClick={handleExport} disabled={!result}>{downloadStatus}</button>
        </div>
      </div>

      <div className={styles.runnerGrid}>
        <div className={styles.inputPanel}>
          <div className={styles.panelTopline}>
            <span>Source packet</span>
            <label htmlFor={fileInputId}>Upload packet</label>
            <input
              id={fileInputId}
              type="file"
              accept=".txt,.md,.json,.csv"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
          <textarea
            value={packet}
            onChange={(event) => {
              setPacket(event.target.value);
              setState({ status: "idle", result: null, error: null });
            }}
            spellCheck={false}
            aria-label={`${module.name} source packet`}
          />
        </div>

        <div className={styles.outputPanel}>
          <div className={styles.verdictCard}>
            <span>Verdict</span>
            <strong>{state.status === "ready" ? state.result.verdict : state.status === "error" ? "RUNNER ERROR" : state.status === "idle" ? "READY TO RUN" : "RUNNING"}</strong>
            <p>
              {state.status === "ready"
                ? state.result.posture
                : state.status === "error"
                  ? state.error
                  : state.status === "idle"
                    ? "Packet changed. Run the deterministic checks when you are ready."
                    : "Deterministic checks are evaluating the packet."}
            </p>
            {result ? (
              <div className={styles.scoreRail} aria-label={`Score ${result.score}`}>
                <div style={{ width: `${result.score}%`, background: module.accent }} />
              </div>
            ) : null}
          </div>

          {result ? (
            <>
              <div className={styles.artifactGrid}>
                {result.artifacts.map((artifact) => (
                  <div key={artifact.label}>
                    <span>{artifact.label}</span>
                    <strong>{artifact.value}</strong>
                    <p>{artifact.detail}</p>
                  </div>
                ))}
              </div>

              <div className={styles.findingTable}>
                <div className={styles.findingHead}>
                  <span>Severity</span>
                  <span>Finding</span>
                  <span>Remediation</span>
                </div>
                {result.findings.length ? result.findings.map((finding) => (
                  <div className={styles.findingRow} key={finding.code}>
                    <span data-severity={finding.severity}>{finding.severity}</span>
                    <div>
                      <strong>{finding.code} · {finding.title}</strong>
                      <p>{finding.detail}</p>
                      <small>{finding.evidence}</small>
                    </div>
                    <p>{finding.remediation}</p>
                  </div>
                )) : (
                  <div className={styles.cleanState}>No findings detected by this deterministic rule corpus.</div>
                )}
              </div>

              <div className={styles.auditStrip}>
                {result.audit.map((step) => (
                  <div key={step.label}>
                    <span>{step.label}</span>
                    <strong>{step.value}</strong>
                    <p>{step.detail}</p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function parseAccessGate(response: Response, gate: unknown): AccessGateState {
  const limit = Number(response.headers.get("x-public-run-limit") ?? response.headers.get("x-demo-rate-limit"));
  const remaining = Number(response.headers.get("x-public-run-remaining") ?? response.headers.get("x-demo-rate-remaining"));
  const resetAt = response.headers.get("x-public-run-reset") ?? response.headers.get("x-demo-rate-reset");

  if (Number.isFinite(limit) && Number.isFinite(remaining) && resetAt) {
    return { limit, remaining, resetAt };
  }

  if (
    typeof gate === "object" &&
    gate !== null &&
    "limit" in gate &&
    "remaining" in gate &&
    "reset_at" in gate &&
    typeof gate.limit === "number" &&
    typeof gate.remaining === "number" &&
    typeof gate.reset_at === "string"
  ) {
    return { limit: gate.limit, remaining: gate.remaining, resetAt: gate.reset_at };
  }

  return null;
}
