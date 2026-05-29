import { NextResponse } from "next/server";
import { cipherWorkbenchManifest, runCipherWorkbench, type CipherMode } from "@/lib/alchemist/cipher-workbench";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const url = new URL(request.url);
  const mode = normalizeMode(url.searchParams.get("mode"));
  const ticker = url.searchParams.get("ticker");

  if (!mode || !ticker) {
    return NextResponse.json({
      generated_by: "CIPHER local deterministic workbench",
      route: "/api/cipher/run",
      ...cipherWorkbenchManifest(),
    });
  }

  return run(mode, ticker);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!isShape(body)) {
    return NextResponse.json({ error: "Expected { mode, ticker }." }, { status: 400 });
  }

  const mode = normalizeMode(body.mode);
  if (!mode) {
    return NextResponse.json({ error: "Mode must be dcf or comps." }, { status: 400 });
  }

  return run(mode, body.ticker);
}

async function run(mode: CipherMode, ticker: string) {
  const result = await runCipherWorkbench(mode, ticker);
  return NextResponse.json(
    {
      generated_by: "CIPHER local deterministic workbench",
      route: "/api/cipher/run",
      result,
    },
    { status: result.decision === "REFUSE" ? 422 : 200 },
  );
}

function normalizeMode(value: string | null | undefined): CipherMode | null {
  return value === "dcf" || value === "comps" ? value : null;
}

function isShape(value: unknown): value is { mode: string; ticker: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "mode" in value &&
    "ticker" in value &&
    typeof value.mode === "string" &&
    typeof value.ticker === "string"
  );
}
