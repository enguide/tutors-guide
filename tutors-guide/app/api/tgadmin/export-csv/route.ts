// app/api/tgadmin/export-csv/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LinkStatus, Role } from "@prisma/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const allowedRoles: Role[] = [Role.ORG_ADMIN, Role.TUTOR, Role.ADMIN];
  if (!allowedRoles.includes(session.user.role as Role)) {
    return new NextResponse("Forbidden: Staff access required", { status: 403 });
  }

  let profileIds: string[] = [];

  if (session.user.orgId) {
    // 1. Institutional staff: export students belonging to their organization
    const orgProfiles = await prisma.profile.findMany({
      where: { orgId: session.user.orgId, role: Role.STUDENT },
      select: { id: true },
    });
    profileIds = orgProfiles.map((p) => p.id);
  } else if (session.user.role === Role.ADMIN) {
    // 2. Super admin without explicit org: fallback to first org or all students
    const firstOrg = await prisma.organization.findFirst({ select: { id: true } });
    if (firstOrg) {
      const orgProfiles = await prisma.profile.findMany({
        where: { orgId: firstOrg.id, role: Role.STUDENT },
        select: { id: true },
      });
      profileIds = orgProfiles.map((p) => p.id);
    } else {
      const allStudents = await prisma.profile.findMany({
        where: { role: Role.STUDENT },
        select: { id: true },
      });
      profileIds = allStudents.map((p) => p.id);
    }
  } else {
    // 3. Independent Tutor: export students connected via active peer-to-peer mentorship links
    const directLinks = await prisma.tutorStudentLink.findMany({
      where: {
        tutorId: session.user.id,
        status: LinkStatus.ACTIVE,
      },
      select: { studentId: true },
    });
    profileIds = directLinks.map((l) => l.studentId);
  }

  // Also include any direct peer-linked students for hybrid tutors belonging to an org
  if (session.user.role === Role.TUTOR && session.user.orgId) {
    const directLinks = await prisma.tutorStudentLink.findMany({
      where: {
        tutorId: session.user.id,
        status: LinkStatus.ACTIVE,
      },
      select: { studentId: true },
    });
    const directIds = directLinks.map((l) => l.studentId);
    profileIds = Array.from(new Set([...profileIds, ...directIds]));
  }

  if (profileIds.length === 0) {
    return new NextResponse("No student records found to export", { status: 400 });
  }

  const testSummaries = await prisma.testSummary.findMany({
    where: { profileId: { in: profileIds } },
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