/* eslint-disable @typescript-eslint/no-explicit-any */
// actions/reporting.ts
'use server';

import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/guards";
import { Role } from "@prisma/client";

export interface CohortAnalyticsSummary {
  totalAttempts: number;
  averageComposite: number;
  averageTimeSpentSeconds: number;
  domainAccuracy: { domain: string; accuracyPercent: number; questionCount: number }[];
}

export async function getCohortAnalytics(categoryFilter?: string): Promise<CohortAnalyticsSummary> {
  const staff = await requireStaffSession();

  let orgId = staff.orgId;
  if (staff.role === Role.ADMIN && !orgId) {
    const firstOrg = await prisma.organization.findFirst({ select: { id: true } });
    orgId = firstOrg?.id || null;
  }

  if (!orgId) {
    return { totalAttempts: 0, averageComposite: 0, averageTimeSpentSeconds: 0, domainAccuracy: [] };
  }

  const summaries = await prisma.testSummary.findMany({
    where: {
      profile: { orgId },
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
      profile: { orgId },
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