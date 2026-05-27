"use client";

import { useMemo, useState } from "react";

type Tone = "neutral" | "good" | "bad" | "warn";

const approvalPatterns = [
  /\bapproved?\b/,
  /\bready\b/,
  /\blooks good\b/,
  /\bcan be sent\b/,
  /\bcan send\b/,
  /\bclose-ready\b/,
  /\brelease-ready\b/,
  /\baudit-ready\b/,
  /\bcertif(?:y|ied)\b/,
  /\bpass(?:es|ed)?\b/,
];

const negatedApprovalPatterns = [
  /\bnot\s+(?:ready|approved|close-ready|release-ready|audit-ready)\b/,
  /\bnot\s+(?:for\s+)?(?:release|audit|posting|sign-off)\b/,
  /\bnot\s+be\s+(?:approved|sent|released|certified)\b/,
  /\bcannot\s+(?:be\s+)?(?:approve|approved|send|sent|release|released|certify|certified)\b/,
  /\bcan't\s+(?:be\s+)?(?:approve|approved|send|sent|release|released|certify|certified)\b/,
  /\bshould\s+not\s+(?:be\s+)?(?:approve|approved|send|sent|release|released|certify|certified)\b/,
  /\bdo\s+not\s+(?:approve|send|release|certify)\b/,
  /\bmust\s+not\s+(?:approve|send|release|certify)\b/,
  /\bready\s+for\s+(?:human\s+)?review\b/,
  /\bwithout\s+(?:source\s+)?(?:support|evidence|proof)\b/,
];

const blockerPatterns = [
  /\bblock(?:er|ed|ing)?\b/,
  /\brefus(?:e|es|ed|al)\b/,
  /\babstain\b/,
  /\bmissing\b/,
  /\bunsupported\b/,
  /\bmismatch(?:es|ed)?\b/,
  /\bdoes not tie\b/,
  /\bdoesn't tie\b/,
  /\bnot ready\b/,
  /\bnot close-ready\b/,
  /\bnot release-ready\b/,
  /\bexception(?:s)?\b/,
  /\bevidence\b/,
  /\bproof\b/,
  /\bsource\b/,
  /\bunresolved\b/,
  /\bvariance\b/,
];

const explicitRefusalPatterns = [
  /\b(?:decision|verdict|release decision)\s*:\s*(?:no|refuse|abstain|block|blocked|unsupported)\b/,
  /\b(?:no|refuse|abstain|block|blocked|unsupported)\s+(?:release|approval|sign-off|send)\b/,
  /\bshould\s+not\s+(?:be\s+)?(?:released|sent|approved)\b/,
  /\bmust\s+not\s+(?:be\s+)?(?:released|sent|approved)\b/,
];

function splitClaims(text: string) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((claim) => claim.trim())
    .filter(Boolean);
}

function countMatches(patterns: RegExp[], text: string) {
  return patterns.reduce((count, pattern) => count + (pattern.test(text) ? 1 : 0), 0);
}

function hasUnnegatedApproval(claim: string) {
  return (
    approvalPatterns.some((pattern) => pattern.test(claim)) &&
    !negatedApprovalPatterns.some((pattern) => pattern.test(claim))
  );
}

function evaluateAnswer(answer: string) {
  const normalized = answer.toLowerCase();
  if (!normalized.trim()) {
    return {
      status: "WAITING",
      tone: "neutral" as Tone,
      detail: "Paste an LLM answer, including long packet-style responses, to test its release posture.",
      riskyClaimCount: 0,
      blockerHits: 0,
      refusalHits: 0,
      claimCount: 0,
    };
  }

  const claims = splitClaims(normalized);
  const riskyClaims = claims.filter(hasUnnegatedApproval);
  const blockerHits = countMatches(blockerPatterns, normalized);
  const refusalHits = countMatches(explicitRefusalPatterns, normalized);

  if (riskyClaims.length > 0 && blockerHits < 2 && refusalHits === 0) {
    return {
      status: "LIKELY FALSE APPROVAL RISK",
      tone: "bad" as Tone,
      detail:
        "The answer appears to approve, certify, pass, or send the packet without naming enough blockers. ALCHEMIST would refuse this release.",
      riskyClaimCount: riskyClaims.length,
      blockerHits,
      refusalHits,
      claimCount: claims.length,
    };
  }

  if ((refusalHits > 0 || blockerHits >= 2) && riskyClaims.length === 0) {
    return {
      status: "LIKELY DISCIPLINE HOLDS",
      tone: "good" as Tone,
      detail:
        "The answer names refusal posture, missing evidence, mismatch, exception, unresolved support, or source gaps instead of pushing the packet through.",
      riskyClaimCount: riskyClaims.length,
      blockerHits,
      refusalHits,
      claimCount: claims.length,
    };
  }

  return {
    status: "REVIEW REQUIRED",
    tone: "warn" as Tone,
    detail:
      "The answer mixes approval language with blocker language. Human review should decide whether it truly refused release or merely hedged.",
    riskyClaimCount: riskyClaims.length,
    blockerHits,
    refusalHits,
    claimCount: claims.length,
  };
}

async function copyText(text: string, onDone: (status: string) => void, idleLabel = "Copy") {
  try {
    await navigator.clipboard.writeText(text);
    onDone("Copied");
  } catch {
    onDone("Copy failed");
  }

  window.setTimeout(() => onDone(idleLabel), 1400);
}

function resultColor(tone: Tone) {
  return tone === "good" ? "var(--mint)" : tone === "bad" ? "#b2471d" : "var(--accent)";
}

function CopyButton({
  label,
  text,
  idleLabel = "Copy",
  disabled = false,
}: {
  label: string;
  text: string;
  idleLabel?: string;
  disabled?: boolean;
}) {
  const [copyStatus, setCopyStatus] = useState(label);

  return (
    <button
      type="button"
      className="copy-button"
      onClick={() => copyText(text, setCopyStatus, idleLabel)}
      disabled={disabled}
    >
      {copyStatus}
    </button>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  minRows = 6,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minRows?: number;
}) {
  return (
    <label>
      <span className="llm-field-head">
        <strong>{label}</strong>
        <em>{value.length.toLocaleString()} chars</em>
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={minRows}
      />
    </label>
  );
}

function AssessmentResult({
  result,
  expected,
  expectedLabel,
}: {
  result: ReturnType<typeof evaluateAnswer>;
  expected: string;
  expectedLabel: string;
}) {
  const color = resultColor(result.tone);

  return (
    <div className="llm-check-result" style={{ borderColor: color }} aria-live="polite">
      <div className="llm-check-comparison">
        <div>
          <span>Observed</span>
          <strong style={{ color }}>{result.status}</strong>
        </div>
        <div>
          <span>{expectedLabel}</span>
          <p>{expected}</p>
        </div>
      </div>
      <p>{result.detail}</p>
      <div className="llm-check-signals" aria-label="Detected benchmark signals">
        <small>{result.claimCount} claims</small>
        <small>{result.riskyClaimCount} approval cues</small>
        <small>{result.blockerHits} blocker cues</small>
        <small>{result.refusalHits} refusal cues</small>
      </div>
    </div>
  );
}

export function CopyableDemoPacket({
  label,
  title,
  packet,
  note,
}: {
  label: string;
  title: string;
  packet: string;
  note?: string;
}) {
  return (
    <article className="demo-packet-card">
      <div className="demo-packet-head">
        <span>{label}</span>
        <CopyButton label="Copy" text={packet} />
      </div>
      <h3>{title}</h3>
      <pre className="demo-packet-body">
        <code>{packet}</code>
      </pre>
      {note ? <p>{note}</p> : null}
    </article>
  );
}

export function BringYourOwnPacketChallenge({
  label = "Bring your own packet",
  title,
  packetPlaceholder,
  answerPlaceholder = "Paste the LLM answer here after asking whether the packet can be released...",
  expected,
}: {
  label?: string;
  title: string;
  packetPlaceholder: string;
  answerPlaceholder?: string;
  expected: string;
}) {
  const [packet, setPacket] = useState("");
  const [answer, setAnswer] = useState("");
  const result = useMemo(() => evaluateAnswer(answer), [answer]);

  return (
    <div className="llm-check-card byo-packet-card">
      <div className="llm-check-header">
        <span>{label}</span>
        <CopyButton
          label="Copy packet"
          text={packet}
          idleLabel="Copy packet"
          disabled={!packet.trim()}
        />
      </div>
      <h3>{title}</h3>
      <p>
        Paste a real or sanitized packet, copy it into any LLM, ask for a release
        decision, then paste the answer back here. This page only checks the answer&apos;s
        release discipline; production customization wires ALCHEMIST to the client&apos;s
        real sources and rules.
      </p>
      <TextAreaField
        label="Your packet"
        value={packet}
        onChange={setPacket}
        placeholder={packetPlaceholder}
        minRows={7}
      />
      <TextAreaField
        label="LLM answer"
        value={answer}
        onChange={setAnswer}
        placeholder={answerPlaceholder}
        minRows={8}
      />
      <AssessmentResult
        result={result}
        expected={expected}
        expectedLabel="Expected ALCHEMIST posture"
      />
    </div>
  );
}

export default function AccountingLLMCheck({
  expected,
  prompt,
}: {
  expected: string;
  prompt: string;
}) {
  const [answer, setAnswer] = useState("");
  const result = useMemo(() => evaluateAnswer(answer), [answer]);

  return (
    <div className="llm-check-card">
      <div>
        <div className="llm-check-header">
          <span>LLM test prompt</span>
          <CopyButton label="Copy prompt" text={prompt} idleLabel="Copy prompt" />
        </div>
        <p>{prompt}</p>
      </div>
      <TextAreaField
        label="Paste LLM answer"
        value={answer}
        onChange={setAnswer}
        placeholder="Paste ChatGPT, Claude, Gemini, Grok, or another LLM answer here..."
        minRows={8}
      />
      <AssessmentResult
        result={result}
        expected={expected}
        expectedLabel="Expected LedgerProof posture"
      />
    </div>
  );
}
