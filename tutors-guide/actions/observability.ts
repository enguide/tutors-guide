// actions/observability.ts
'use server';

import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/guards";
import { LinkStatus, Role } from "@prisma/client";

export interface StudentCompletedExamItem {
  testId: string;
  testTitle: string;
  category: string;
  compositeScore: number | null;
  percentile: string | null;
  completedAt: Date;
}

export async function getStudentExamsForStaff(targetProfileId: string): Promise<{
  student: { id: string; name: string; email: string; orgId: string | null };
  exams: StudentCompletedExamItem[];
}> {
  const staff = await requireStaffSession();

  const student = await prisma.profile.findUnique({
    where: { id: targetProfileId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      orgId: true,
      schoolId: true,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  // Tenancy verification: superadmin, shared organization, or active direct mentorship
  if (staff.role !== Role.ADMIN) {
    const sharesOrg = staff.orgId && student.orgId && staff.orgId === student.orgId;
    const hasDirectLink = await prisma.tutorStudentLink.findFirst({
      where: {
        tutorId: staff.id,
        studentId: targetProfileId,
        status: LinkStatus.ACTIVE,
      },
    });

    if (!sharesOrg && !hasDirectLink) {
      throw new Error("Forbidden: You do not have authorization to view this student's diagnostics.");
    }
  }

  const summaries = await prisma.testSummary.findMany({
    where: { profileId: targetProfileId },
    orderBy: { completedAt: "desc" },
  });

  return {
    student: {
      id: student.id,
      name: `${student.firstName} ${student.lastName}`.trim() || student.email,
      email: student.email,
      orgId: student.orgId,
    },
    exams: summaries.map((s) => ({
      testId: s.testId,
      testTitle: s.testTitle,
      category: s.category,
      compositeScore: s.compositeScore,
      percentile: s.percentile,
      completedAt: s.completedAt,
    })),
  };
}