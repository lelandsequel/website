import type { RunnerMode, RunnerResult } from "@/lib/alchemist/engine";

export type ApiState =
  | { status: "idle"; result: null; error: null }
  | { status: "loading"; result: null; error: null }
  | { status: "ready"; result: RunnerResult; error: null }
  | { status: "error"; result: null; error: string };

export type SecSeedState =
  | { status: "idle"; message: string }
  | { status: "loading"; message: string }
  | { status: "ready"; message: string }
  | { status: "error"; message: string };

export function packetStats(packet: string) {
  return `${packet.length.toLocaleString()} chars`;
}

export function supportsSecSeed(mode: RunnerMode) {
  return mode === "credit" || mode === "lbo" || mode === "scenarios" || mode === "benchmark";
}

export function runnerStateLabel(state: ApiState) {
  if (state.status === "idle") return "Ready to run";
  if (state.status === "loading") return "Running deterministic API...";
  if (state.status === "error") return state.error;
  return state.result.verdict;
}

export function RunnerRows({ result }: { result: RunnerResult }) {
  return (
    <div className="live-runner-rows">
      <div>
        <strong>Corpus seal</strong>
        <code>{result.metadata.corpus_seal}</code>
        <small>{result.metadata.engine_version}; input {result.metadata.input_hash}</small>
      </div>
      <div>
        <strong>Parser intelligence</strong>
        <code>
          {result.metadata.parsed_field_count} fields | {result.metadata.source_count} sources |{" "}
          {result.metadata.period_count} periods
        </code>
        <small>Evidence index {result.metadata.evidence_hash}</small>
      </div>
      {result.rows.map((item) => (
        <div key={`${item.label}-${item.value}`}>
          <strong>{item.label}</strong>
          <code>{item.value}</code>
          <small>{item.detail}</small>
        </div>
      ))}
    </div>
  );
}

export function ListPanel({ title, items, fallback }: { title: string; items: string[]; fallback: string }) {
  return (
    <div className="live-runner-output">
      <span>{title}</span>
      {items.length ? items.map((item) => <p key={item}>{item}</p>) : <p>{fallback}</p>}
    </div>
  );
}

export function RunnerStatePanel({ state }: { state: ApiState }) {
  if (state.status === "idle") {
    return (
      <div className="live-runner-empty">
        <strong>Ready for a deliberate run</strong>
        <p>Paste, upload, or edit a sanitized packet, then run the deterministic API.</p>
      </div>
    );
  }

  if (state.status === "loading") {
    return (
      <div className="live-runner-empty">
        <strong>Running deterministic API</strong>
        <p>Computing verdict, blockers, refusals, metadata, and audit trail.</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="live-runner-empty error">
        <strong>Runner request failed</strong>
        <p>{state.error}</p>
      </div>
    );
  }

  return null;
}

export function AuditTrail({ result }: { result: RunnerResult }) {
  return (
    <div className="live-runner-output chain">
      <span>LUNA-style audit trail</span>
      <div className="live-runner-chain">
        {result.audit.map((item) => (
          <div key={item.label}>
            <strong>{item.label}</strong>
            <code>{item.value}</code>
            <small>{item.detail}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SourcePacketPanel({
  fileInputId,
  textareaId,
  packet,
  uploadStatus,
  mode,
  ticker,
  secSeed,
  onFile,
  onPacketChange,
  onTickerChange,
  onSecSeed,
}: {
  fileInputId: string;
  textareaId: string;
  packet: string;
  uploadStatus: string;
  mode: RunnerMode;
  ticker: string;
  secSeed: SecSeedState;
  onFile: (file: File) => void;
  onPacketChange: (packet: string) => void;
  onTickerChange: (ticker: string) => void;
  onSecSeed: () => void;
}) {
  const supportsSeed = supportsSecSeed(mode);
  return (
    <div className="live-runner-input">
      <span className="live-runner-input-head">
        <strong>Source packet</strong>
        <em>{packetStats(packet)}</em>
      </span>
      <label
        htmlFor={fileInputId}
        className="live-runner-file"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0];
          if (file) onFile(file);
        }}
      >
        <span>
          <strong>Upload packet</strong>
          <small>Accepted: .txt, .csv, .json, .md</small>
        </span>
        <span className="live-runner-file-button">Choose file</span>
        <input
          id={fileInputId}
          type="file"
          accept=".txt,.csv,.json,.md,text/plain,text/csv,application/json,text/markdown"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onFile(file);
          }}
        />
      </label>
      <small id={`${fileInputId}-status`}>{uploadStatus}</small>
      <SecSeedControls mode={mode} ticker={ticker} seed={secSeed} onTickerChange={onTickerChange} onSecSeed={onSecSeed} />
      <label className="live-runner-textarea-label" htmlFor={textareaId}>
        Packet text
      </label>
      <textarea
        id={textareaId}
        value={packet}
        aria-describedby={`${fileInputId}-status`}
        onChange={(event) => onPacketChange(event.target.value)}
      />
    </div>
  );
}

function SecSeedControls({
  mode,
  ticker,
  seed,
  onTickerChange,
  onSecSeed,
}: {
  mode: RunnerMode;
  ticker: string;
  seed: SecSeedState;
  onTickerChange: (ticker: string) => void;
  onSecSeed: () => void;
}) {
  const supportsSeed = supportsSecSeed(mode);
  return (
    <div className={`live-runner-sec-seed ${seed.status}`}>
      <span>
        <strong>SEC ticker seed</strong>
        <em>{supportsSeed ? "Company Facts packet builder" : "Packet required"}</em>
      </span>
      <div>
        <input
          value={ticker}
          disabled={!supportsSeed}
          onChange={(event) => onTickerChange(event.target.value.toUpperCase())}
          onKeyDown={(event) => {
            if (event.key === "Enter" && supportsSeed) {
              event.preventDefault();
              onSecSeed();
            }
          }}
          placeholder="NVDA"
          aria-label="Ticker symbol"
        />
        <button type="button" className="copy-button" disabled={!supportsSeed || seed.status === "loading"} onClick={onSecSeed}>
          {seed.status === "loading" ? "Building..." : "Build packet"}
        </button>
      </div>
      <small>{seed.message}</small>
    </div>
  );
}
