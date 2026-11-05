import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, getSecret, verifySessionToken } from "@/lib/auth/session";

// Optimistic gate for admin *pages*. Route handlers re-check via requireAdmin().
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const valid = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
    getSecret()
  );
  if (valid) return NextResponse.next();

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
