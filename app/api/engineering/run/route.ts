import { NextResponse } from "next/server";
import { checkDemoRateLimit, rateLimitExceededBody, rateLimitHeaders } from "@/lib/demo-rate-limit";
import { engineeringManifest, isEngineeringMode, runEngineeringSuite } from "@/lib/engineering-suite";

export const dynamic = "force-dynamic";

const MAX_PACKET_CHARS = 80_000;
const CANONICAL_ROUTE = "/api/omnis/run";

export function GET() {
  return NextResponse.json({
    route: CANONICAL_ROUTE,
    ...engineeringManifest(),
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isPayload(body)) {
    return NextResponse.json({ error: "Expected { mode, packet }." }, { status: 400 });
  }

  if (!isEngineeringMode(body.mode)) {
    return NextResponse.json({ error: `Unsupported OMNIS mode: ${body.mode}` }, { status: 400 });
  }

  if (body.packet.length > MAX_PACKET_CHARS) {
    return NextResponse.json(
      { error: `Packet exceeds ${MAX_PACKET_CHARS.toLocaleString()} character deterministic runner limit.` },
      { status: 413 },
    );
  }

  const rate = checkDemoRateLimit(request, {
    namespace: `omnis:${body.mode}`,
    limit: 12,
    windowMs: 60 * 60 * 1000,
  });
  if (!rate.ok) {
    return NextResponse.json(rateLimitExceededBody(rate), {
      status: 429,
      headers: rateLimitHeaders(rate),
    });
  }

  const result = runEngineeringSuite(body.mode, body.packet);
  return NextResponse.json({
    generated_by: "OMNIS deterministic engineering suite",
    route: CANONICAL_ROUTE,
    mode: body.mode,
    engine_version: result.metadata.engine_version,
    corpus_seal: result.metadata.corpus_seal,
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

function isPayload(value: unknown): value is { mode: string; packet: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "mode" in value &&
    "packet" in value &&
    typeof value.mode === "string" &&
    typeof value.packet === "string"
  );
}
