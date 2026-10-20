// app/api/tgadmin/export-csv/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const allowedRoles: Role[] = [Role.ORG_ADMIN, Role.TUTOR, Role.ADMIN];
  if (!allowedRoles.includes(session.user.role as Role)) {
    return new NextResponse("Forbidden: Staff access required", { status: 403 });
  }

  let orgId = session.user.orgId;
  if (session.user.role === Role.ADMIN && !orgId) {
    const firstOrg = await prisma.organization.findFirst({ select: { id: true } });
    orgId = firstOrg?.id || null;
  }

  if (!orgId) {
    return new NextResponse("No organization found to export", { status: 400 });
  }

  const testSummaries = await prisma.testSummary.findMany({
    where: { profile: { orgId } },
    include: {
      profile: {
        select: { firstName: true, lastName: true, email: true, classYear: true },
      },
    },
    orderBy: { completedAt: "desc" },
  });

  const headers = [
    "Student Name",
    "Email",
    "Class Year",
    "Exam Title",
    "Category",
    "Composite Score",
    "Percentile",
    "Completed Date",
  ];

  const rows = testSummaries.map((ts) => [
    `"${ts.profile.firstName} ${ts.profile.lastName}"`,
    `"${ts.profile.email}"`,
    `"${ts.profile.classYear}"`,
    `"${ts.testTitle.replace(/"/g, '""')}"`,
    `"${ts.category}"`,
    ts.compositeScore ?? "N/A",
    `"${ts.percentile ?? "N/A"}"`,
    `"${ts.completedAt.toISOString()}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const filename = `cohort_diagnostic_roster_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, no-cache",
    },
  });
}