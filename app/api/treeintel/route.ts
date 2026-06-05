import { NextResponse } from "next/server";
import { recon } from "@/lib/treeintel/orchestrate";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected JSON { address, owner? }." }, { status: 400 });
  }
  const b = body as { address?: unknown; owner?: unknown };
  const address = typeof b?.address === "string" ? b.address : "";
  const owner = typeof b?.owner === "string" ? b.owner : undefined;
  if (!address.trim()) {
    return NextResponse.json({ ok: false, error: "Provide a property address." }, { status: 400 });
  }
  const out = await recon(address, owner);
  return NextResponse.json(out, { status: out.ok ? 200 : 400 });
}
