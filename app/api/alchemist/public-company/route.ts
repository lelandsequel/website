import { NextResponse } from "next/server";
import { buildPublicCompanyPacket, canBuildSecPacket } from "@/lib/alchemist/sec";
import { isRunnerMode, runAlchemist } from "@/lib/alchemist/engine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isShape(body)) {
    return NextResponse.json({ error: "Expected { ticker, mode }." }, { status: 400 });
  }

  if (!isRunnerMode(body.mode)) {
    return NextResponse.json({ error: `Unsupported ALCHEMIST mode: ${body.mode}` }, { status: 400 });
  }

  if (!canBuildSecPacket(body.mode)) {
    return NextResponse.json(
      { error: `${body.mode.toUpperCase()} needs a deal/segment packet; one ticker is not enough evidence.` },
      { status: 422 },
    );
  }

  try {
    const packet = await buildPublicCompanyPacket(body.ticker, body.mode);
    const result = runAlchemist({ mode: body.mode, packet: packet.packet });
    return NextResponse.json({
      generated_by: "ALCHEMIST SEC packet builder",
      route: "/api/alchemist/public-company",
      packet,
      result,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "SEC packet builder failed." }, { status: 502 });
  }
}

function isShape(value: unknown): value is { ticker: string; mode: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "ticker" in value &&
    "mode" in value &&
    typeof value.ticker === "string" &&
    typeof value.mode === "string"
  );
}
