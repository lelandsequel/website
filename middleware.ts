import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Serve any casing of /treeintel (e.g. the branded /TreeIntel) at the canonical
// /treeintel page via a rewrite — no redirect, so no case-insensitive loop.
// Pure pass-through for every other route.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== "/treeintel" && pathname.toLowerCase() === "/treeintel") {
    const url = request.nextUrl.clone();
    url.pathname = "/treeintel";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|api/).*)",
};
