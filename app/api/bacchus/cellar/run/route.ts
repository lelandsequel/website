import { NextResponse } from "next/server";
import { checkDemoRateLimit, rateLimitExceededBody, rateLimitHeaders } from "@/lib/demo-rate-limit";
import { BACCHUS_CELLAR_SAMPLES } from "@/lib/bacchus/cellar-samples";
import { bacchusCellarManifest, runBacchusCellar } from "@/lib/bacchus/cellar-intelligence";

export const dynamic = "force-dynamic";

const ROUTE = "/api/bacchus/cellar/run";
const MAX_PACKET_CHARS = 50_000;

export function GET() {
  return NextResponse.json({
    ...bacchusCellarManifest(),
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
    return NextResponse.json({ error: "Expected { packet } or { sampleId }." }, { status: 400 });
  }

  const packet = resolvePacket(body);
  if (packet.length > MAX_PACKET_CHARS) {
    return NextResponse.json(
      { error: `Packet exceeds ${MAX_PACKET_CHARS.toLocaleString()} character BACCHUS runner limit.` },
      { status: 413 },
    );
  }

  const rate = checkDemoRateLimit(request, {
    namespace: "bacchus:cellar",
    limit: 18,
    windowMs: 60 * 60 * 1000,
  });
  if (!rate.ok) {
    return NextResponse.json(rateLimitExceededBody(rate), {
      status: 429,
      headers: rateLimitHeaders(rate),
    });
  }

  const result = runBacchusCellar(packet);
  return NextResponse.json({
    generated_by: "BACCHUS Cellar Intelligence",
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

function isPayload(value: unknown): value is { packet?: string; sampleId?: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    (("packet" in value && typeof value.packet === "string") ||
      ("sampleId" in value && typeof value.sampleId === "string"))
  );
}

function resolvePacket(body: { packet?: string; sampleId?: string }) {
  if (body.packet?.trim()) return body.packet;
  const sample = BACCHUS_CELLAR_SAMPLES.find((item) => item.id === body.sampleId);
  return sample?.packet ?? "";
}
