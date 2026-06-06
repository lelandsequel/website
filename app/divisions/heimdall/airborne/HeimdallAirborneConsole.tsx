// Always the brake. Never the sword.
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AIRBORNE_SCENARIOS,
  JIM_DISPLAY,
  VERDICT_COPY,
  VERDICT_ORDER,
  evaluateScenario,
  latestStep,
  type AirborneScenario,
  type ChainStatus,
  type HeimdallOutcome,
  type LedgerEvent,
  type LedgerInput,
} from "./heimdall-airborne-data";
import styles from "./airborne.module.css";

const GENESIS = "GENESIS";

async function hashText(value: string) {
  if (globalThis.crypto?.subtle) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fallback-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function serialize(input: LedgerInput) {
  return JSON.stringify({
    type: input.type,
    scenarioId: input.scenarioId,
    time: input.time,
    label: input.label,
    value: input.value,
    verdict: input.verdict ?? null,
    display: input.display ?? null,
  });
}

async function appendLedgerEvent(events: LedgerEvent[], input: LedgerInput) {
  const parentHash = events.at(-1)?.hash ?? GENESIS;
  const seq = events.length + 1;
  const body = serialize(input);
  const hash = await hashText(`${parentHash}|${seq}|${body}`);
  return [...events, { ...input, seq, parentHash, hash, body }];
}

async function verifyLedger(events: LedgerEvent[]): Promise<ChainStatus> {
  let parentHash = GENESIS;
  for (const event of events) {
    if (event.parentHash !== parentHash) {
      return { ok: false, at: event.seq, label: `CHAIN BREAK AT #${event.seq}: parent mismatch` };
    }

    const expected = await hashText(`${event.parentHash}|${event.seq}|${event.body}`);
    if (expected !== event.hash) {
      return { ok: false, at: event.seq, label: `CHAIN BREAK AT #${event.seq}: recorded value changed` };
    }

    parentHash = event.hash;
  }

  return { ok: true, label: `CHAIN VERIFIED · ${events.length} EVENTS` };
}

function formatHash(hash: string) {
  if (hash === GENESIS) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
}

function makeObservationInput(scenario: AirborneScenario, stepIndex: number): LedgerInput {
  const step = latestStep(scenario, stepIndex);
  return {
    type: "OBSERVATION",
    scenarioId: scenario.id,
    time: step.time,
    label: step.label,
    value: `${step.observation} Confidence ${step.confidence}. Ambiguity ${step.ambiguity}. Tension ${step.tension}.`,
  };
}

function makeVerdictInput(scenario: AirborneScenario, outcome: HeimdallOutcome): LedgerInput {
  return {
    type: "VERDICT",
    scenarioId: scenario.id,
    time: "T+00:24",
    label: "HEIMDALL verdict",
    value: outcome.reason,
    verdict: outcome.verdict,
    display: outcome.display,
  };
}

export default function HeimdallAirborneConsole() {
  const [scenarioId, setScenarioId] = useState(AIRBORNE_SCENARIOS[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);
  const [ledger, setLedger] = useState<LedgerEvent[]>([]);
  const [chainStatus, setChainStatus] = useState<ChainStatus>({ ok: true, label: "CHAIN READY" });
  const [tampered, setTampered] = useState(false);

  const scenario = useMemo(
    () => AIRBORNE_SCENARIOS.find((item) => item.id === scenarioId) ?? AIRBORNE_SCENARIOS[0],
    [scenarioId],
  );
  const step = latestStep(scenario, stepIndex);
  const outcome = useMemo(() => evaluateScenario(scenario), [scenario]);
  const complete = stepIndex >= scenario.steps.length;
  const visibleSteps = scenario.steps.slice(0, Math.min(stepIndex + 1, scenario.steps.length));

  useEffect(() => {
    let cancelled = false;
    setLedger([]);
    setStepIndex(0);
    setTampered(false);
    setChainStatus({ ok: true, label: "CHAIN READY" });
    setIsStreaming(true);

    appendLedgerEvent([], makeObservationInput(scenario, 0)).then((next) => {
      if (!cancelled) setLedger(next);
    });

    return () => {
      cancelled = true;
    };
  }, [scenario]);

  useEffect(() => {
    if (!isStreaming) return undefined;

    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current + 1 < scenario.steps.length) return current + 1;
        setIsStreaming(false);
        return scenario.steps.length;
      });
    }, 1150);

    return () => window.clearInterval(timer);
  }, [isStreaming, scenario.steps.length]);

  useEffect(() => {
    if (stepIndex === 0 || stepIndex > scenario.steps.length) return;

    let cancelled = false;
    const input =
      stepIndex < scenario.steps.length
        ? makeObservationInput(scenario, stepIndex)
        : makeVerdictInput(scenario, outcome);

    setLedger((current) => {
      appendLedgerEvent(current, input).then((next) => {
        if (!cancelled) setLedger(next);
      });
      return current;
    });

    return () => {
      cancelled = true;
    };
  }, [outcome, scenario, stepIndex]);

  useEffect(() => {
    let cancelled = false;
    verifyLedger(ledger).then((status) => {
      if (!cancelled) setChainStatus(status);
    });
    return () => {
      cancelled = true;
    };
  }, [ledger]);

  const handleScenario = (id: string) => {
    setScenarioId(id);
  };

  const handleReplay = () => {
    setLedger([]);
    setStepIndex(0);
    setTampered(false);
    setChainStatus({ ok: true, label: "CHAIN READY" });
    setIsStreaming(true);
    appendLedgerEvent([], makeObservationInput(scenario, 0)).then(setLedger);
  };

  const handleTamper = () => {
    setLedger((current) => {
      const targetIndex = current.findIndex((event) => event.type === "VERDICT");
      if (targetIndex < 0) return current;
      return current.map((event, index) =>
        index === targetIndex
          ? {
              ...event,
              value: `${event.value} Tamper demo: value altered after seal.`,
              body: serialize({
                type: event.type,
                scenarioId: event.scenarioId,
                time: event.time,
                label: event.label,
                value: `${event.value} Tamper demo: value altered after seal.`,
                verdict: event.verdict,
                display: event.display,
              }),
            }
          : event,
      );
    });
    setTampered(true);
  };

  return (
    <div className={styles.console}>
      <section className={styles.heroGrid} aria-label="HEIMDALL verdict panel">
        <div className={styles.verdictPanel}>
          <div className={styles.panelTop}>
            <span>HEIMDALL Airborne Command Center</span>
            <strong>{complete ? "Final brake state" : "Fusing synthetic picture"}</strong>
          </div>
          <div className={styles.primaryVerdict}>
            <span>Jim-facing display</span>
            <strong>{complete ? outcome.display : JIM_DISPLAY.HOLD}</strong>
          </div>
          <div className={styles.internalVerdict}>
            <span>Internal verdict</span>
            <strong>{complete ? outcome.verdict : "HOLD"}</strong>
          </div>
          <p>{complete ? outcome.reason : "Live synthetic feed is unresolved. HEIMDALL defaults to restraint while the fused picture forms."}</p>
          {complete ? (
            <div className={styles.proofStack}>
              <span>Proof packet</span>
              {outcome.proof.map((row) => (
                <div key={row.label}>
                  <strong>{row.label}</strong>
                  <p>{row.value}</p>
                </div>
              ))}
            </div>
          ) : null}
          <div className={styles.humanFrame}>
            <span>Human-in-command</span>
            <p>Every HOLD is reviewed by a human, and every act remains owned by a human. The AI is the brake only.</p>
          </div>
        </div>

        <div className={styles.scenarioPanel}>
          <div className={styles.panelTop}>
            <span>Coalition brief scenario</span>
            <strong>{scenario.name}</strong>
          </div>
          <p>{scenario.brief}</p>
          <div className={styles.scenarioButtons} aria-label="Synthetic scenarios">
            {AIRBORNE_SCENARIOS.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => handleScenario(item.id)}
                aria-pressed={item.id === scenario.id}
              >
                {item.shortName}
              </button>
            ))}
          </div>
          <div className={styles.actionRow}>
            <button type="button" onClick={handleReplay}>Replay stream</button>
            <button type="button" onClick={handleTamper} disabled={!complete || tampered || !ledger.some((event) => event.type === "VERDICT")}>
              Tamper demo
            </button>
          </div>
        </div>
      </section>

      <section className={styles.fusionGrid} aria-label="Synthetic fused picture">
        <div className={styles.feedPanel}>
          <div className={styles.panelTop}>
            <span>Fused picture</span>
            <strong>{step.label}</strong>
          </div>
          <div className={styles.metricSet}>
            <Meter label="Confidence" value={step.confidence} />
            <Meter label="Ambiguity" value={step.ambiguity} />
            <Meter label="Tension" value={step.tension} />
          </div>
          <div className={styles.sensorList}>
            {step.sensorInputs.map((input) => (
              <div key={input}>
                <span>Sensor input</span>
                <p>{input}</p>
              </div>
            ))}
          </div>
          <div className={styles.brakeNote}>
            <span>{step.time}</span>
            <p>{step.brakeNote}</p>
          </div>
        </div>

        <div className={styles.timelinePanel}>
          <div className={styles.panelTop}>
            <span>Step stream</span>
            <strong>{isStreaming ? "Streaming" : "Complete"}</strong>
          </div>
          <ol className={styles.timeline}>
            {visibleSteps.map((item) => (
              <li key={item.id}>
                <span>{item.time}</span>
                <strong>{item.label}</strong>
                <p>{item.observation}</p>
              </li>
            ))}
            {complete ? (
              <li>
                <span>T+00:24</span>
                <strong>{outcome.verdict}</strong>
                <p>{scenario.reviewFrame}</p>
              </li>
            ) : null}
          </ol>
        </div>
      </section>

      <section className={styles.outputGrid} aria-label="Output space and decision log">
        <div className={styles.outputPanel}>
          <div className={styles.panelTop}>
            <span>Output space</span>
            <strong>Brake-only</strong>
          </div>
          <div className={styles.outputList}>
            {VERDICT_ORDER.map((verdict) => (
              <div key={verdict} data-active={complete && verdict === outcome.verdict}>
                <span>{verdict}</span>
                <strong>{JIM_DISPLAY[verdict]}</strong>
                <p>{VERDICT_COPY[verdict]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.logPanel}>
          <div className={styles.panelTop}>
            <span>Tamper-evident decision log</span>
            <strong data-ok={chainStatus.ok}>{chainStatus.label}</strong>
          </div>
          <div className={styles.logList}>
            {ledger.map((event) => (
              <article key={`${event.seq}-${event.hash}`} data-broken={!chainStatus.ok && chainStatus.at === event.seq}>
                <div>
                <span>#{event.seq.toString().padStart(2, "0")} · {event.type}</span>
                <strong>{event.display ?? event.verdict ?? event.label}</strong>
              </div>
                <p>{event.value}</p>
                <dl>
                  <div>
                    <dt>Parent</dt>
                    <dd>{formatHash(event.parentHash)}</dd>
                  </div>
                  <div>
                    <dt>Hash</dt>
                    <dd>{formatHash(event.hash)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.meter}>
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <i style={{ inlineSize: `${value}%` }} />
    </div>
  );
}
