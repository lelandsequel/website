"use client";

import { useEffect, useId, useState } from "react";
import type { RunnerMode, RunnerResult } from "@/lib/alchemist/engine";
import {
  AuditTrail,
  ListPanel,
  RunnerRows,
  RunnerStatePanel,
  SourcePacketPanel,
  packetStats,
  runnerStateLabel,
  supportsSecSeed,
  type ApiState,
  type SecSeedState,
} from "@/components/AlchemistRunnerPanels";

type ManifestState =
  | { status: "loading"; manifest: null; error: null }
  | { status: "ready"; manifest: ApiManifest; error: null }
  | { status: "error"; manifest: null; error: string };

type ApiManifest = {
  engine_version?: string;
  corpus_seal?: string;
  mode_count?: number;
  modes?: unknown[];
};

type SecPacketResponse = {
  packet?: {
    ticker: string;
    entity: string;
    packet: string;
    warnings?: string[];
  };
  error?: string;
};

type AccessGateState = {
  limit: number;
  remaining: number;
  resetAt: string;
} | null;

function emptyState(): ApiState {
  return { status: "loading", result: null, error: null };
}

async function runViaApi(mode: RunnerMode, packet: string, signal: AbortSignal) {
  const response = await fetch("/api/alchemist/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, packet }),
    signal,
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? "ALCHEMIST runner failed.");
  return {
    result: payload.result as RunnerResult,
    accessGate: parseAccessGate(response, payload.access_gate ?? payload.demo_gate),
  };
}

async function buildSecPacket(mode: RunnerMode, ticker: string) {
  const response = await fetch("/api/alchemist/public-company", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, ticker }),
  });
  const payload = await response.json() as SecPacketResponse;
  if (!response.ok || !payload.packet) throw new Error(payload.error ?? "SEC packet builder failed.");
  return payload.packet;
}

async function copyJson(result: RunnerResult | null, mode: RunnerMode, packet: string, onDone: (status: string) => void) {
  if (!result) return;
  try {
    await navigator.clipboard.writeText(JSON.stringify(buildJsonPayload(result, mode, packet), null, 2));
    onDone("Copied JSON");
  } catch {
    onDone("Copy failed");
  }
  window.setTimeout(() => onDone("Copy JSON"), 1600);
}

function downloadJson(result: RunnerResult | null, mode: RunnerMode, packet: string, onDone: (status: string) => void) {
  if (!result) return;
  const blob = new Blob([JSON.stringify(buildJsonPayload(result, mode, packet), null, 2)], { type: "application/json" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = `alchemist-${mode}-${result.metadata.input_hash.slice(7, 19)}.json`;
  link.click();
  URL.revokeObjectURL(href);
  onDone("Downloaded");
  window.setTimeout(() => onDone("Download JSON"), 1600);
}

function buildJsonPayload(result: RunnerResult, mode: RunnerMode, packet: string) {
  return { generated_by: "ALCHEMIST deterministic runner", api: "/api/alchemist/run", method: "POST", mode, packet, result };
}

async function readUploadedPacket(file: File) {
  const maxBytes = 1_000_000;
  const maxChars = 80_000;
  if (file.size > maxBytes) throw new Error(`File is ${formatBytes(file.size)}. Upload a sanitized packet under ${formatBytes(maxBytes)}.`);
  const text = await file.text();
  if (text.length > maxChars) throw new Error(`Packet has ${text.length.toLocaleString()} characters. Keep packets under ${maxChars.toLocaleString()}.`);
  return text;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AlchemistLiveRunner(props: {
  mode: RunnerMode;
  title: string;
  intro: string;
  initialPacket: string;
}) {
  const { mode, title, intro, initialPacket } = props;
  const [packet, setPacket] = useState(initialPacket);
  const [apiState, setApiState] = useState<ApiState>(emptyState);
  const [manifestState, setManifestState] = useState<ManifestState>({ status: "loading", manifest: null, error: null });
  const [uploadStatus, setUploadStatus] = useState("Drop or choose TXT, CSV, JSON, or MD under 1 MB.");
  const [copyStatus, setCopyStatus] = useState("Copy JSON");
  const [downloadStatus, setDownloadStatus] = useState("Download JSON");
  const [runStatus, setRunStatus] = useState("Run packet");
  const [accessGate, setAccessGate] = useState<AccessGateState>(null);
  const [ticker, setTicker] = useState("");
  const [secSeed, setSecSeed] = useState<SecSeedState>(initialSeedState(mode));
  const fileInputId = useId();
  const textareaId = useId();
  const effectiveApiState: ApiState = packet.trim() ? apiState : { status: "idle", result: null, error: null };
  const result = effectiveApiState.status === "ready" ? effectiveApiState.result : null;
  const manifest = manifestState.status === "ready" ? manifestState.manifest : null;

  const runPacket = (packetToRun = packet, signal?: AbortSignal) => {
    if (!packetToRun.trim()) {
      setApiState({ status: "idle", result: null, error: null });
      return;
    }
    const activeSignal = signal ?? new AbortController().signal;
    setRunStatus("Running...");
    setApiState(emptyState());
    runViaApi(mode, packetToRun, activeSignal)
      .then((next) => {
        setAccessGate(next.accessGate);
        setApiState({ status: "ready", result: next.result, error: null });
      })
      .catch((error: Error) => {
        if (!activeSignal.aborted) setApiState({ status: "error", result: null, error: error.message });
      })
      .finally(() => {
        if (!activeSignal.aborted) setRunStatus("Run packet");
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    runPacket(initialPacket, controller.signal);
    return () => controller.abort();
  }, [mode, initialPacket]);
  useManifestEffect(setManifestState);

  const handlePacketChange = (text: string) => {
    setPacket(text);
    setApiState({ status: "idle", result: null, error: null });
  };

  const handleFile = (file: File) => {
    setUploadStatus(`Reading ${file.name} (${formatBytes(file.size)})...`);
    readUploadedPacket(file)
      .then((text) => {
        setPacket(text);
        setApiState({ status: "idle", result: null, error: null });
        setUploadStatus(`Loaded ${file.name} (${formatBytes(file.size)}, ${packetStats(text)}).`);
      })
      .catch((error: Error) => setUploadStatus(error.message));
  };

  const handleSecSeed = () => {
    const cleanTicker = ticker.trim().toUpperCase();
    if (!cleanTicker) return setSecSeed({ status: "error", message: "Enter a ticker first." });
    setSecSeed({ status: "loading", message: `Building ${mode.toUpperCase()} packet for ${cleanTicker} from SEC Company Facts...` });
    buildSecPacket(mode, cleanTicker)
      .then((nextPacket) => {
        setPacket(nextPacket.packet);
        setApiState({ status: "idle", result: null, error: null });
        const warnings = nextPacket.warnings?.length ? ` Warnings: ${nextPacket.warnings.join(" ")}` : "";
        setSecSeed({ status: "ready", message: `Loaded ${nextPacket.entity} (${nextPacket.ticker}) from SEC Company Facts.${warnings}` });
      })
      .catch((error: Error) => setSecSeed({ status: "error", message: error.message }));
  };

  return (
    <section className="alchemist-live-runner">
      <RunnerHeader
        title={title}
        intro={intro}
        canCopy={Boolean(result)}
        canRun={Boolean(packet.trim()) && apiState.status !== "loading"}
        accessGate={accessGate}
        runStatus={apiState.status === "loading" ? "Running..." : runStatus}
        copyStatus={copyStatus}
        downloadStatus={downloadStatus}
        onRun={() => runPacket(packet)}
        onCopy={() => copyJson(result, mode, packet, setCopyStatus)}
        onDownload={() => downloadJson(result, mode, packet, setDownloadStatus)}
      />
      <ManifestStrip manifest={manifest} state={manifestState} />
      <div className="live-runner-grid">
        <SourcePacketPanel
          fileInputId={fileInputId}
          textareaId={textareaId}
          packet={packet}
          uploadStatus={uploadStatus}
          mode={mode}
          ticker={ticker}
          secSeed={secSeed}
          onFile={handleFile}
          onPacketChange={handlePacketChange}
          onTickerChange={setTicker}
          onSecSeed={handleSecSeed}
        />
        <VerdictPanel state={effectiveApiState} result={result} />
      </div>
      {result ? <ResultDetails result={result} /> : null}
    </section>
  );
}

function useManifestEffect(setManifestState: (state: ManifestState) => void) {
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/alchemist/run", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Manifest request failed.");
        return response.json() as Promise<ApiManifest>;
      })
      .then((manifest) => setManifestState({ status: "ready", manifest, error: null }))
      .catch((error: Error) => {
        if (!controller.signal.aborted) setManifestState({ status: "error", manifest: null, error: error.message });
      });
    return () => controller.abort();
  }, [setManifestState]);
}

function initialSeedState(mode: RunnerMode): SecSeedState {
  return {
    status: "idle",
    message: supportsSecSeed(mode)
      ? "Optional: enter a public ticker to seed this packet from live SEC Company Facts."
      : "This model needs a deal, segment, or accounting packet; a single ticker is not enough evidence.",
  };
}

function RunnerHeader(props: {
  title: string;
  intro: string;
  canCopy: boolean;
  canRun: boolean;
  accessGate: AccessGateState;
  runStatus: string;
  copyStatus: string;
  downloadStatus: string;
  onRun: () => void;
  onCopy: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="live-runner-header">
      <div>
        <span>Live deterministic API runner</span>
        <h2>{props.title}</h2>
        <p>{props.intro}</p>
      </div>
      <div className="live-runner-actions">
        {props.accessGate ? (
          <span className="demo-usage-pill">
            {props.accessGate.remaining}/{props.accessGate.limit} runs left
          </span>
        ) : null}
        <button type="button" className="copy-button primary" disabled={!props.canRun} onClick={props.onRun}>{props.runStatus}</button>
        <a href="/api/alchemist/run" target="_blank" rel="noopener noreferrer">API manifest</a>
        <button type="button" className="copy-button" disabled={!props.canCopy} onClick={props.onCopy}>{props.copyStatus}</button>
        <button type="button" className="copy-button" disabled={!props.canCopy} onClick={props.onDownload}>{props.downloadStatus}</button>
      </div>
    </div>
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

function ManifestStrip({ manifest, state }: { manifest: ApiManifest | null; state: ManifestState }) {
  return (
    <div className="live-runner-manifest" aria-live="polite">
      <span>POST /api/alchemist/run</span>
      <strong>{manifest ? `${manifest.engine_version ?? "engine"} | ${manifest.mode_count ?? manifest.modes?.length ?? "multi"} modes` : state.status === "error" ? "Manifest unavailable" : "Loading manifest"}</strong>
      <code>{manifest?.corpus_seal ?? state.error ?? "Fetching API manifest metadata"}</code>
    </div>
  );
}

function VerdictPanel({ state, result }: { state: ApiState; result: RunnerResult | null }) {
  return (
    <div className="live-runner-output">
      <span>Verdict</span>
      <h3>{runnerStateLabel(state)}</h3>
      {result ? <p>{result.posture}</p> : <RunnerStatePanel state={state} />}
      {result ? <RunnerRows result={result} /> : null}
    </div>
  );
}

function ResultDetails({ result }: { result: RunnerResult }) {
  return (
    <>
      <div className="live-runner-grid compact">
        <ListPanel title="Blockers" items={result.blockers} fallback="No blockers detected by this deterministic runner." />
        <ListPanel title="Refusals" items={result.refusals} fallback="No refusals emitted." />
      </div>
      <AuditTrail result={result} />
    </>
  );
}
