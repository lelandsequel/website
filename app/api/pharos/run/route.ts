import { NextResponse } from "next/server";
import { checkDemoRateLimit, rateLimitExceededBody, rateLimitHeaders } from "@/lib/demo-rate-limit";
import { pharosManifest, runPharos } from "@/lib/pharos";

export const dynamic = "force-dynamic";

const MAX_PACKET_CHARS = 40_000;
const ROUTE = "/api/pharos/run";

export function GET() {
  return NextResponse.json({
    route: ROUTE,
    ...pharosManifest(),
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
    return NextResponse.json({ error: "Expected { packet }." }, { status: 400 });
  }

  if (body.packet.length > MAX_PACKET_CHARS) {
    return NextResponse.json(
      { error: `Packet exceeds ${MAX_PACKET_CHARS.toLocaleString()} character PHAROS runner limit.` },
      { status: 413 },
    );
  }

  const rate = checkDemoRateLimit(request, {
    namespace: "pharos",
    limit: 12,
    windowMs: 60 * 60 * 1000,
  });
  if (!rate.ok) {
    return NextResponse.json(rateLimitExceededBody(rate), {
      status: 429,
      headers: rateLimitHeaders(rate),
    });
  }

  const result = runPharos(body.packet);
  return NextResponse.json({
    generated_by: "PHAROS deterministic pharmacovigilance runner",
    route: ROUTE,
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

function isPayload(value: unknown): value is { packet: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "packet" in value &&
    typeof value.packet === "string"
  );
}
