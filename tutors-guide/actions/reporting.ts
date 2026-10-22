/* eslint-disable @typescript-eslint/no-explicit-any */
// actions/reporting.ts
'use server';

import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/guards";
import { LinkStatus, Role } from "@prisma/client";

export interface CohortAnalyticsSummary {
  totalAttempts: number;
  averageComposite: number;
  averageTimeSpentSeconds: number;
  domainAccuracy: { domain: string; accuracyPercent: number; questionCount: number }[];
}

export async function getCohortAnalytics(categoryFilter?: string): Promise<CohortAnalyticsSummary> {
  const staff = await requireStaffSession();

  let profileIds: string[] = [];

  if (staff.orgId) {
    const orgProfiles = await prisma.profile.findMany({
      where: { orgId: staff.orgId },
      select: { id: true },
    });
    profileIds = orgProfiles.map((p) => p.id);
  } else if (staff.role === Role.ADMIN) {
    const allProfiles = await prisma.profile.findMany({
      where: { role: Role.STUDENT },
      select: { id: true },
    });
    profileIds = allProfiles.map((p) => p.id);
  } else {
    // Independent Tutor: fetch student IDs from active direct mentorship links
    const directLinks = await prisma.tutorStudentLink.findMany({
      where: {
        tutorId: staff.id,
        status: LinkStatus.ACTIVE,
      },
      select: { studentId: true },
    });
    profileIds = directLinks.map((l) => l.studentId);
  }

  if (profileIds.length === 0) {
    return { totalAttempts: 0, averageComposite: 0, averageTimeSpentSeconds: 0, domainAccuracy: [] };
  }

  const summaries = await prisma.testSummary.findMany({
    where: {
      profileId: { in: profileIds },
      ...(categoryFilter && categoryFilter !== "ALL" ? { category: categoryFilter as any } : {}),
      compositeScore: { not: null },
    },
    select: { compositeScore: true, testId: true, profileId: true },
  });

  const totalAttempts = summaries.length;
  const averageComposite =
    totalAttempts > 0
      ? Math.round(summaries.reduce((sum, s) => sum + (s.compositeScore || 0), 0) / totalAttempts)
      : 0;

  const responses = await prisma.response.findMany({
    where: {
      profileId: { in: profileIds },
      ...(categoryFilter && categoryFilter !== "ALL" ? { test: { category: categoryFilter as any } } : {}),
    },
    select: {
      isCorrect: true,
      timeSpentOnResponse: true,
    },
  });

  const totalTime = responses.reduce((acc, r) => acc + (r.timeSpentOnResponse || 0), 0);
  const averageTimeSpentSeconds = responses.length > 0 ? Math.round(totalTime / responses.length) : 0;

  return {
    totalAttempts,
    averageComposite,
    averageTimeSpentSeconds,
    domainAccuracy: [],
  };
}