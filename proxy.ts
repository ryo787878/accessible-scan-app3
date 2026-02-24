import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { canonicalPathname } from "@/lib/seo/routes";

function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalized = canonicalPathname(pathname);

  if (!pathname.startsWith("/_next") && !pathname.startsWith("/api") && !pathname.includes(".") && normalized !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = normalized;
    return withSecurityHeaders(NextResponse.redirect(url, 308));
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/:path*"],
};
