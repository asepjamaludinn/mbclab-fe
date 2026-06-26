import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/student") && !refreshToken) {
    return NextResponse.redirect(new URL("/login/student", request.url));
  }

  if (pathname.startsWith("/admin") && !refreshToken) {
    return NextResponse.redirect(new URL("/login/admin", request.url));
  }

  if (pathname.startsWith("/login") && refreshToken) {
    return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*", "/login/:path*"],
};
