// proxy.ts
import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const STAFF_ROLES = ["ORG_ADMIN", "TUTOR", "ADMIN"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role as string | undefined;

  const isStaff = userRole ? STAFF_ROLES.includes(userRole) : false;
  const isStudent = userRole === "STUDENT";

  const isProtectedExamRunner =
    nextUrl.pathname.startsWith("/tests") && !nextUrl.pathname.includes("/results");
  const isProtectedAdminRoute =
    nextUrl.pathname.startsWith("/tgadmin") || nextUrl.pathname.startsWith("/api/tgadmin");
  const isProtectedDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isProtectedSettings = nextUrl.pathname.startsWith("/settings");
  const isProtectedLinkTutor = nextUrl.pathname.startsWith("/link-tutor");

  // 1. Unauthenticated users: redirect to login
  if (
    !isLoggedIn &&
    (isProtectedExamRunner ||
      isProtectedAdminRoute ||
      isProtectedDashboard ||
      isProtectedSettings ||
      isProtectedLinkTutor)
  ) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  // 2. Staff safety guard: Staff are barred from student testing surfaces and student dashboard
  if (isStaff) {
    if (isProtectedDashboard || isProtectedExamRunner) {
      return NextResponse.redirect(
        new URL("/tgadmin?notice=staff_restricted_from_student_views", nextUrl)
      );
    }
  }

  // 3. Student safety guard: Students are barred from staff/admin portal
  if (isStudent && isProtectedAdminRoute) {
    return NextResponse.redirect(
      new URL("/dashboard?error=unauthorized_staff_access", nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/tests/:path*",
    "/tgadmin/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/link-tutor/:path*",
  ],
};