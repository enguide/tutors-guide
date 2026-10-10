import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isProtectedExamRoute = nextUrl.pathname.startsWith("/tests");
  const isProtectedAdminRoute = nextUrl.pathname.startsWith("/tgadmin");
  const isProtectedDashboard = nextUrl.pathname.startsWith("/dashboard");

  // 1. Enforce authentication for protected areas
  if (!isLoggedIn && (isProtectedExamRoute || isProtectedAdminRoute || isProtectedDashboard)) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  // 2. Enforce admin role for /tgadmin
  if (isProtectedAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
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