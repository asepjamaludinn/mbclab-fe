import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

const STUDENT_PASSWORD_EXEMPT_PATHS = ["/student/account"];

const ADMIN_FORCE_PASSWORD_LANDING_PATH = "/admin/dashboard";
const ADMIN_PASSWORD_EXEMPT_PATHS = [ADMIN_FORCE_PASSWORD_LANDING_PATH];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const activeToken = accessToken || refreshToken;
  const payload = activeToken ? decodeJwtPayload(activeToken) : null;
  const userRole = payload?.role;
  const mustChangePassword = payload?.mustChangePassword === true;

  if (!activeToken || !payload) {
    if (pathname.startsWith("/student")) {
      return NextResponse.redirect(new URL("/login/student", request.url));
    }
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/student") && userRole !== "STUDENT") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }

  if (pathname.startsWith("/login")) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (userRole === "STUDENT") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
  }

  if (mustChangePassword && userRole === "STUDENT") {
    const isExempt = STUDENT_PASSWORD_EXEMPT_PATHS.some((p) =>
      pathname.startsWith(p),
    );
    if (pathname.startsWith("/student") && !isExempt) {
      const url = new URL("/student/account", request.url);
      url.searchParams.set("forceChangePassword", "1");
      return NextResponse.redirect(url);
    }
  }

  if (mustChangePassword && userRole === "ADMIN") {
    const isExempt = ADMIN_PASSWORD_EXEMPT_PATHS.some((p) =>
      pathname.startsWith(p),
    );
    if (pathname.startsWith("/admin") && !isExempt) {
      const url = new URL(ADMIN_FORCE_PASSWORD_LANDING_PATH, request.url);
      url.searchParams.set("forceChangePassword", "1");
      return NextResponse.redirect(url);
    }

    if (
      pathname.startsWith(ADMIN_FORCE_PASSWORD_LANDING_PATH) &&
      request.nextUrl.searchParams.get("forceChangePassword") !== "1"
    ) {
      const url = request.nextUrl.clone();
      url.searchParams.set("forceChangePassword", "1");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*", "/login/:path*"],
};
