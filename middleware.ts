import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper untuk decode JWT payload di Edge Runtime (tanpa verifikasi signature)
function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const activeToken = accessToken || refreshToken;

  if (!activeToken) {
    if (pathname.startsWith("/student")) {
      return NextResponse.redirect(new URL("/login/student", request.url));
    }
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }
    return NextResponse.next();
  }

  const payload = decodeJwtPayload(activeToken);
  const userRole = payload?.role;

  if (pathname.startsWith("/student") && userRole !== "STUDENT") {
    return NextResponse.redirect(new URL("/login/admin", request.url));
  }

  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/login/student", request.url));
  }

  if (pathname.startsWith("/login")) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (userRole === "STUDENT") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*", "/login/:path*"],
};
