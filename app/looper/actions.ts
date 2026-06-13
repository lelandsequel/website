"use server";

// LOOPER — the live "Run" path. An MD/ED types a real idea and hits Run; this
// runs the deterministic, keyless engine on THEIR words, server-side, and hands
// back a plain result. It must NEVER let an error reach their screen: empty or
// too-short input gets a friendly nudge; anything the engine can't read cleanly
// degrades to a plain message instead of a stack trace. 🐦‍⬛ + 🔑

import { runSixDCosmicSemantic } from "@/lib/six-d/semantic/run-semantic";
import { deriveToolResult, type ToolResult } from "./derive";

/**
 * Shape a free-text idea into intent slots the way `initiativeToIntent` shapes a
 * roadmap initiative: the idea's own clauses become the goals — the units of
 * work the engine slices into sized stories. The user's sentences ARE the goals;
 * nothing is invented, the size is the engine's real decomposition of them.
 */
function ideaToIntent(idea: string) {
  const sentences = idea
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
  const goals = sentences.length ? sentences.slice(0, 8) : [idea.slice(0, 200)];

  const first = idea.split(/[.\n]/)[0].trim();
  const title = first ? (first.length > 64 ? `${first.slice(0, 61)}…` : first) : "Your idea";

  return { title, context: idea, goals, constraints: [] as string[], sourceMaterial: [] as string[] };
}

export async function runLooper(idea: string, guessWeeks?: number): Promise<ToolResult> {
  const trimmed = (idea ?? "").trim();
  if (trimmed.length < 12) {
    return { ok: false, message: "Tell LOOPER a sentence or two about what you want to build." };
  }
  // Cap length so a paste-bomb can't stall the run.
  const capped = trimmed.slice(0, 4000);
  const guess =
    typeof guessWeeks === "number" && Number.isFinite(guessWeeks) && guessWeeks > 0
      ? Math.round(guessWeeks)
      : undefined;

  try {
    const intent = ideaToIntent(capped);
    const { run, entry } = await runSixDCosmicSemantic(intent);
    return deriveToolResult(run, entry.hash, intent.title, guess);
  } catch {
    return {
      ok: false,
      message:
        "LOOPER couldn't read that one cleanly — try describing what the thing should do, in a sentence or two.",
    };
  }
}
