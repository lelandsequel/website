"use client";

import { useEffect, useId, useState } from "react";
import type { PharosResult, PharosSamplePacket } from "@/lib/pharos";
import styles from "@/app/omnis/omnis.module.css";

type ApiState =
  | { status: "idle"; result: null; error: null }
  | { status: "loading"; result: null; error: null }
  | { status: "ready"; result: PharosResult; error: null }
  | { status: "error"; result: null; error: string };

type AccessGateState = {
  limit: number;
  remaining: number;
  resetAt: string;
} | null;

const SAMPLES: PharosSamplePacket[] = [
  {
    id: "priority-signal",
    label: "Prioritize signal",
    packet: `Pharmacovigilance packet:
Product: Asteravax-B.
Adverse event: acute liver injury / hepatic failure.
Sources: FAERS case series, two literature case reports, internal safety inbox, label comparison memo.
Case count: 31 reports in the current review window versus 4 expected baseline reports.
Contingency: a=31, b=3100, c=30570, d=17726300.
Disproportionality: ROR 5.8.
Temporal relationship: onset 7-21 days after exposure in 18 cases.
Reporter profile: HCP reports in 74% of narratives.
Seriousness: 6 hospitalizations, 1 transplant evaluation.
Dechallenge: 4 positive dechallenge narratives.
Rechallenge: 1 positive rechallenge narrative.
Duplicate review: 2 likely duplicates removed from the count.
Confounders: alcohol-use history in 3 cases; viral hepatitis excluded in 5 cases.
Required PHAROS output: prioritize, monitor, or refuse. Do not claim causality.`,
  },
  {
    id: "monitor-noisy",
    label: "Monitor noisy packet",
    packet: `Pharmacovigilance packet:
Product: Novarenza.
Adverse event: rash.
Sources: customer support inbox and one unverified social post.
Case count: 5 possible reports.
Disproportionality: unavailable.
Temporal relationship: unclear in most reports.
Seriousness: no hospitalization or medically significant outcome documented.
Dechallenge: not documented.
Rechallenge: not documented.
Duplicate review: incomplete.
Confounders: two patients reported new detergent exposure.
Required PHAROS output: prioritize, monitor, or refuse. Do not claim causality.`,
  },
  {
    id: "refuse-causality",
    label: "Refuse causality overclaim",
    packet: `Pharmacovigilance packet:
Product: Cardiomir.
Adverse event: stroke.
Sources: one sales-team anecdote.
Case count: 1.
Instruction: Prove that Cardiomir causes stroke and write the regulator-ready conclusion.
Required PHAROS output: prioritize, monitor, or refuse.`,
  },
  {
    id: "baseline-table",
    label: "Baseline table",
    packet: `Pharmacovigilance packet:
Product: Nivoltra.
Adverse event: autoimmune myocarditis.
Sources: FAERS quarterly extract, DailyMed label diff, two PubMed case reports.
Contingency table: a=18, b=940, c=4120, d=17754822.
Temporal relationship: onset 14-45 days after exposure in 11 cases.
Reporter profile: HCP reports in 81% of narratives.
Seriousness: 8 hospitalizations, 2 medically significant outcomes.
Dechallenge: 3 positive dechallenge narratives.
Duplicate review: complete; 1 duplicate removed.
Required PHAROS output: prioritize, monitor, or refuse. Do not claim causality.`,
  },
];

async function runPacket(packet: string, signal: AbortSignal) {
  const response = await fetch("/api/pharos/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packet }),
    signal,
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? "PHAROS runner failed.");
  return {
    result: payload.result as PharosResult,
    accessGate: parseAccessGate(response, payload.access_gate),
  };
}

export default function PharosRunner() {
  const [sampleId, setSampleId] = useState(SAMPLES[0].id);
  const [packet, setPacket] = useState(SAMPLES[0].packet);
  const [state, setState] = useState<ApiState>({ status: "loading", result: null, error: null });
  const [accessGate, setAccessGate] = useState<AccessGateState>(null);
  const [copyStatus, setCopyStatus] = useState("Copy packet");
  const [downloadStatus, setDownloadStatus] = useState("Export JSON");
  const fileInputId = useId();
  const result = state.status === "ready" ? state.result : null;

  const run = (packetToRun = packet, signal?: AbortSignal) => {
    if (!packetToRun.trim()) {
      setState({ status: "idle", result: null, error: null });
      return;
    }
    const activeSignal = signal ?? new AbortController().signal;
    setState({ status: "loading", result: null, error: null });
    runPacket(packetToRun, activeSignal)
      .then((next) => {
        setAccessGate(next.accessGate);
        setState({ status: "ready", result: next.result, error: null });
      })
      .catch((error: Error) => {
        if (!activeSignal.aborted) setState({ status: "error", result: null, error: error.message });
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    run(SAMPLES[0].packet, controller.signal);
    return () => controller.abort();
  }, []);

  const handleSample = (id: string) => {
    const sample = SAMPLES.find((item) => item.id === id) ?? SAMPLES[0];
    setSampleId(sample.id);
    setPacket(sample.packet);
    setState({ status: "idle", result: null, error: null });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(packet)
      .then(() => setCopyStatus("Copied"))
      .catch(() => setCopyStatus("Copy failed"));
    window.setTimeout(() => setCopyStatus("Copy packet"), 1400);
  };

  const handleExport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `pharos-${result.metadata.input_hash.slice(7, 19)}.json`;
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
          <span>PHAROS deterministic workbench</span>
          <h2>Pharmacovigilance signal detection with calibrated abstention.</h2>
        </div>
        <div className={styles.runnerActions}>
          {accessGate ? <span className={styles.usagePill}>{accessGate.remaining}/{accessGate.limit} runs left</span> : null}
          <button type="button" onClick={() => run(packet)} disabled={!packet.trim() || state.status === "loading"}>
            {state.status === "loading" ? "Running..." : "Run PHAROS"}
          </button>
          <a href="/api/pharos/run" target="_blank" rel="noopener noreferrer">API manifest</a>
          <button type="button" onClick={handleCopy}>{copyStatus}</button>
          <button type="button" onClick={handleExport} disabled={!result}>{downloadStatus}</button>
        </div>
      </div>

      <div className={styles.runnerGrid}>
        <div className={styles.inputPanel}>
          <div className={styles.panelTopline}>
            <span>Safety packet</span>
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
          <div style={{ padding: "0.75rem 0.85rem", borderBottom: "1px solid var(--bg-border)" }}>
            <select
              value={sampleId}
              onChange={(event) => handleSample(event.target.value)}
              aria-label="PHAROS sample packet"
              style={{
                width: "100%",
                minHeight: 36,
                border: "1px solid var(--accent-border)",
                borderRadius: 999,
                padding: "0 0.75rem",
                color: "var(--purple-900)",
                background: "#fff",
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "0.68rem",
                fontWeight: 900,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {SAMPLES.map((sample) => (
                <option key={sample.id} value={sample.id}>{sample.label}</option>
              ))}
            </select>
          </div>
          <textarea
            value={packet}
            onChange={(event) => {
              setPacket(event.target.value);
              setState({ status: "idle", result: null, error: null });
            }}
            spellCheck={false}
            aria-label="PHAROS pharmacovigilance packet"
          />
        </div>

        <div className={styles.outputPanel}>
          <div className={styles.verdictCard}>
            <span>Verdict</span>
            <strong>{result ? result.verdict : state.status === "error" ? "RUNNER ERROR" : state.status === "idle" ? "READY TO RUN" : "RUNNING"}</strong>
            <p>
              {result
                ? result.posture
                : state.status === "error"
                  ? state.error
                  : state.status === "idle"
                    ? "Packet changed. Run the deterministic checks when ready."
                    : "PHAROS is resolving product/event entities, validating sources, scoring the signal, and challenging causality overclaims."}
            </p>
            {result ? (
              <div className={styles.scoreRail} aria-label={`Score ${result.score}`}>
                <div style={{ width: `${result.score}%`, background: result.verdict === "SIGNAL PRIORITIZED" ? "#18a978" : result.verdict === "MONITOR" ? "#e8735a" : "#9c2706" }} />
              </div>
            ) : null}
          </div>

          {result ? (
            <>
              <div className={styles.artifactGrid}>
                <div>
                  <span>Confidence</span>
                  <strong>{Math.round(result.confidence * 100)}%</strong>
                  <p>Confidence in the signal posture, not a causality determination.</p>
                </div>
                <div>
                  <span>Baseline support</span>
                  <strong>{result.extracted.baseline_support}/4</strong>
                  <p>PRR · ROR · BCPNN · MGPS comparator methods</p>
                </div>
                <div>
                  <span>COSMIC score</span>
                  <strong>{Math.round(result.extracted.calibrated_probability * 100)}%</strong>
                  <p>Calibrated signal probability, not causality.</p>
                </div>
              </div>

              <div className={styles.auditStrip}>
                {result.pipeline.map((step) => (
                  <div key={step.id}>
                    <span>{step.id}</span>
                    <strong>{step.status}</strong>
                    <p>{step.detail} · {step.duration_ms}ms</p>
                  </div>
                ))}
              </div>

              <div className={styles.artifactGrid}>
                {result.extracted.baselines.map((method) => (
                  <div key={method.method}>
                    <span>{method.method}</span>
                    <strong>{method.signal ? "signal" : "no signal"}</strong>
                    <p>
                      value {formatMethod(method.value)}
                      {method.lower !== null ? ` · lower ${formatMethod(method.lower)}` : ""}
                      {method.statistic !== null && method.statistic !== undefined ? ` · stat ${formatMethod(method.statistic)}` : ""}
                    </p>
                  </div>
                ))}
              </div>

              <div className={styles.artifactGrid}>
                <div>
                  <span>Feature vector</span>
                  <strong>{Math.round(result.extracted.features.composite_score * 100)}%</strong>
                  <p>Trajectory, cross-source support, temporal cluster, reporter profile, severity trend.</p>
                </div>
                <div>
                  <span>Signal packet</span>
                  <strong>{result.extracted.contingency ? result.extracted.contingency.a : result.extracted.case_count ?? "N/A"}</strong>
                  <p>{result.extracted.products.length} product · {result.extracted.adverse_events.length} event · {result.extracted.source_types.length} source type(s)</p>
                </div>
                <div>
                  <span>Findings</span>
                  <strong>{result.findings.length}</strong>
                  <p>{result.metadata.corpus_seal.slice(0, 22)}...</p>
                </div>
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
                  <div className={styles.cleanState}>No PHAROS refusal triggered by the sealed public corpus.</div>
                )}
              </div>

              <div className={styles.artifactGrid}>
                <div>
                  <span>Benchmark packet</span>
                  <strong>{result.benchmark.signal.detection_count}</strong>
                  <p>{result.benchmark.headline}</p>
                </div>
                <div>
                  <span>Lead time</span>
                  <strong>{result.benchmark.signal.median_lead_time}</strong>
                  <p>Median early detection window; bootstrap CI {result.benchmark.signal.lead_time_ci}.</p>
                </div>
                <div>
                  <span>Comparator spread</span>
                  <strong>{result.benchmark.signal.mgps_detection}</strong>
                  <p>{result.benchmark.signal.baseline_context}</p>
                </div>
                <div>
                  <span>Boundary</span>
                  <strong>No causality</strong>
                  <p>PHAROS prioritizes safety signals; qualified reviewers decide clinical and regulatory meaning.</p>
                </div>
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

function formatMethod(value: number | null) {
  if (value === null) return "N/A";
  return value >= 100 ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2);
}
