import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const STAFF_ROLES = ["ORG_ADMIN", "TUTOR", "ADMIN"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role as string | undefined;

  const isProtectedExamRoute = nextUrl.pathname.startsWith("/tests");
  const isProtectedAdminRoute =
  nextUrl.pathname.startsWith("/tgadmin") ||
  nextUrl.pathname.startsWith("/api/tgadmin");
  const isProtectedDashboard = nextUrl.pathname.startsWith("/dashboard");

  // 1. Enforce authentication for protected areas
  if (!isLoggedIn && (isProtectedExamRoute || isProtectedAdminRoute || isProtectedDashboard)) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  // 2. Enforce staff/admin roles for /tgadmin
  if (isProtectedAdminRoute && (!userRole || !STAFF_ROLES.includes(userRole))) {
    return NextResponse.redirect(new URL("/dashboard?error=unauthorized_staff_access", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/tests/:path*",
    "/tgadmin/:path*",
    "/dashboard/:path*",
  ],
};