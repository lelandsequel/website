import { NextResponse } from "next/server";
import { checkDemoRateLimit, rateLimitExceededBody, rateLimitHeaders } from "@/lib/demo-rate-limit";
import { buildSpec, llmPrompt, specMarkdown, type CadmusInput } from "@/lib/cadmus";

export const dynamic = "force-dynamic";

const MAX_FIELD_CHARS = 12_000;
const UNLOCK_PASSWORD = process.env.CADMUS_UNLOCK_PASSWORD || "LelandIsAmazing";

type Payload = CadmusInput & {
  unlockPassword?: string;
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isPayload(body)) {
    return NextResponse.json({ error: "Expected a CADMUS input payload." }, { status: 400 });
  }

  const input = cleanInput(body);
  if (!input.intent.trim()) {
    return NextResponse.json({ error: "Intent is required before CADMUS can run." }, { status: 400 });
  }

  if (Object.values(input).some((value) => String(value ?? "").length > MAX_FIELD_CHARS)) {
    return NextResponse.json({ error: `CADMUS fields are capped at ${MAX_FIELD_CHARS.toLocaleString()} characters.` }, { status: 413 });
  }

  const unlocked = body.unlockPassword === UNLOCK_PASSWORD;
  const rate = unlocked
    ? null
    : checkDemoRateLimit(request, {
        namespace: "cadmus:spec-generator",
        limit: 2,
        windowMs: 1000 * 60 * 60 * 24 * 365,
      });

  if (rate && !rate.ok) {
    return NextResponse.json(
      {
        ...rateLimitExceededBody(rate),
        requires_password: true,
        detail: "CADMUS public access is limited to 2 runs per IP. Ask Leland for the unlock password to keep running it.",
      },
      {
        status: 429,
        headers: rateLimitHeaders(rate),
      },
    );
  }

  const spec = buildSpec(input);
  return NextResponse.json(
    {
      generated_by: "CADMUS deterministic spec generator",
      route: "/api/cadmus/run",
      result: {
        spec,
        spec_markdown: specMarkdown(spec),
        llm_prompt: llmPrompt(spec),
      },
      access_gate: unlocked
        ? {
            unlocked: true,
            limit: "password",
            remaining: "unlocked",
            reset_at: null,
          }
        : rate && {
            unlocked: false,
            limit: rate.limit,
            remaining: rate.remaining,
            reset_at: new Date(rate.resetAt).toISOString(),
          },
    },
    {
      headers: rate ? rateLimitHeaders(rate) : undefined,
    },
  );
}

function isPayload(value: unknown): value is Payload {
  return typeof value === "object" && value !== null && "intent" in value && typeof value.intent === "string";
}

function cleanInput(input: Payload): CadmusInput {
  return {
    intent: input.intent ?? "",
    role: input.role ?? "",
    audience: input.audience ?? "",
    done: input.done ?? "",
    nonGoals: input.nonGoals ?? "",
    constraints: input.constraints ?? "",
    format: input.format ?? "",
  };
}
