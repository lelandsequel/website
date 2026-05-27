import { NextResponse } from "next/server";
import { checkDemoRateLimit, rateLimitExceededBody, rateLimitHeaders } from "@/lib/demo-rate-limit";
import { alchemistEngineManifest, isRunnerMode, runAlchemist } from "@/lib/alchemist/engine";

export const dynamic = "force-dynamic";

const parts = ["alchemist", "run"] as const;
const MAX_PACKET_CHARS = 80_000;
const ROUTE = `/api/${parts[0]}/${parts[1]}`;

export function GET() {
  return NextResponse.json({
    generated_by: "ALCHEMIST deterministic runner",
    route: ROUTE,
    ...alchemistEngineManifest(),
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isPayloadShape(body)) {
    return NextResponse.json({ error: "Expected { mode, packet }." }, { status: 400 });
  }

  if (!isRunnerMode(body.mode)) {
    return NextResponse.json({ error: `Unsupported ALCHEMIST mode: ${body.mode}` }, { status: 400 });
  }
  if (body.packet.length > MAX_PACKET_CHARS) {
    return NextResponse.json(
      { error: `Packet exceeds ${MAX_PACKET_CHARS.toLocaleString()} character deterministic runner limit.` },
      { status: 413 },
    );
  }

  const rate = checkDemoRateLimit(request, {
    namespace: `alchemist:${body.mode}`,
    limit: 12,
    windowMs: 60 * 60 * 1000,
  });
  if (!rate.ok) {
    return NextResponse.json(rateLimitExceededBody(rate), {
      status: 429,
      headers: rateLimitHeaders(rate),
    });
  }

  const result = runAlchemist({ mode: body.mode, packet: body.packet });
  return NextResponse.json({
    generated_by: "ALCHEMIST deterministic runner",
    route: ROUTE,
    engine_version: result.metadata.engine_version,
    corpus_seal: result.metadata.corpus_seal,
    mode: body.mode,
    result,
    access_gate: {
      limit: rate.limit,
      remaining: rate.remaining,
      reset_at: new Date(rate.resetAt).toISOString(),
    },
  }, {
    headers: rateLimitHeaders(rate),
  });
}

function isPayloadShape(value: unknown): value is { mode: string; packet: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "mode" in value &&
    "packet" in value &&
    typeof value.mode === "string" &&
    typeof value.packet === "string"
  );
}
