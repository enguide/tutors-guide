// actions/institutional.ts
'use server';

import { prisma } from "@/lib/prisma";
import { requireStaffSession, requireOrgAdminSession } from "@/lib/guards";
import { EnrollmentStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export interface SeatMetrics {
  totalPurchasedSeats: number;
  activeAllocatedSeats: number;
  availableVacancies: number;
  licensePools: {
    id: string;
    name: string;
    seatLimit: number;
    usedSeats: number;
    inviteCode: string | null;
    expiresAt: Date;
    categories: string[];
  }[];
}

export interface StudentRosterItem {
  profileId: string;
  enrollmentId: string;
  name: string;
  email: string;
  classYear: string;
  enrolledAt: Date;
  status: EnrollmentStatus;
  licensePoolId: string;
  licensePoolName: string;
  categories: string[];
  completedExamCount: number;
}

export async function getInstitutionalOverview(): Promise<{
  orgName: string;
  metrics: SeatMetrics;
  roster: StudentRosterItem[];
}> {
  const staff = await requireStaffSession();

  let orgId = staff.orgId;
  if (staff.role === Role.ADMIN && !orgId) {
    const firstOrg = await prisma.organization.findFirst({ select: { id: true } });
    orgId = firstOrg?.id || null;
  }

  if (!orgId) {
    return {
      orgName: "Independent / Unassigned",
      metrics: { totalPurchasedSeats: 0, activeAllocatedSeats: 0, availableVacancies: 0, licensePools: [] },
      roster: [],
    };
  }

  const [org, licensePools, enrollments] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: orgId },
      select: { name: true },
    }),
    prisma.licensePool.findMany({
      where: { orgId },
      include: {
        _count: {
          select: {
            enrollments: {
              where: { status: EnrollmentStatus.ACTIVE },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.enrollment.findMany({
      where: {
        licensePool: { orgId },
      },
      include: {
        profile: {
          include: {
            _count: {
              select: { summaries: true },
            },
          },
        },
        licensePool: {
          select: { id: true, name: true, categories: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalPurchasedSeats = licensePools.reduce((acc, p) => acc + p.seatLimit, 0);
  const activeAllocatedSeats = licensePools.reduce((acc, p) => acc + p._count.enrollments, 0);
  const availableVacancies = Math.max(0, totalPurchasedSeats - activeAllocatedSeats);

  const formattedPools = licensePools.map((p) => ({
    id: p.id,
    name: p.name,
    seatLimit: p.seatLimit,
    usedSeats: p._count.enrollments,
    inviteCode: p.inviteCode,
    expiresAt: p.expiresAt,
    categories: p.categories,
  }));

  const roster: StudentRosterItem[] = enrollments.map((e) => ({
    profileId: e.profile.id,
    enrollmentId: e.id,
    name: `${e.profile.firstName} ${e.profile.lastName}`.trim() || e.profile.email,
    email: e.profile.email,
    classYear: e.profile.classYear,
    enrolledAt: e.createdAt,
    status: e.status,
    licensePoolId: e.licensePool.id,
    licensePoolName: e.licensePool.name,
    categories: e.licensePool.categories,
    completedExamCount: e.profile._count.summaries,
  }));

  return {
    orgName: org?.name || "Organization",
    metrics: {
      totalPurchasedSeats,
      activeAllocatedSeats,
      availableVacancies,
      licensePools: formattedPools,
    },
    roster,
  };
}

export async function refreshPoolInviteCode(licensePoolId: string) {
  const admin = await requireOrgAdminSession();

  const pool = await prisma.licensePool.findUnique({
    where: { id: licensePoolId },
    select: { orgId: true },
  });

  if (!pool || (admin.role !== Role.ADMIN && pool.orgId !== admin.orgId)) {
    throw new Error("Unauthorized to modify this license pool");
  }

  const newCode = `ORG-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  await prisma.licensePool.update({
    where: { id: licensePoolId },
    data: { inviteCode: newCode },
  });

  revalidatePath("/tgadmin");
  return { success: true, inviteCode: newCode };
}

export async function revokeStudentSeat(enrollmentId: string) {
  const admin = await requireOrgAdminSession();

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { licensePool: { select: { orgId: true } } },
  });

  if (!enrollment || (admin.role !== Role.ADMIN && enrollment.licensePool.orgId !== admin.orgId)) {
    throw new Error("Unauthorized to revoke this enrollment");
  }

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: EnrollmentStatus.REVOKED },
  });

  revalidatePath("/tgadmin");
  return { success: true };
}