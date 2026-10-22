// actions/institutional.ts
'use server';

import { prisma } from "@/lib/prisma";
import { requireStaffSession, requireOrgAdminSession } from "@/lib/guards";
import { EnrollmentStatus, LinkStatus, Role } from "@prisma/client";
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
  enrollmentId: string; // enrollmentId for institutional or linkId for direct students
  name: string;
  email: string;
  classYear: string;
  enrolledAt: Date;
  status: EnrollmentStatus;
  licensePoolId: string | null;
  licensePoolName: string;
  categories: string[];
  completedExamCount: number;
  sourceType: "INSTITUTIONAL" | "DIRECT_MENTORSHIP";
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

  // 1. Fetch direct mentorship links for this staff member (tutor/admin)
  const directLinks = await prisma.tutorStudentLink.findMany({
    where: {
      tutorId: staff.id,
      status: LinkStatus.ACTIVE,
    },
    include: {
      student: {
        include: {
          _count: {
            select: { summaries: true },
          },
          enrollments: {
            where: { status: EnrollmentStatus.ACTIVE },
            include: {
              licensePool: {
                select: { categories: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Map direct mentorship links into unified roster items
  const directRoster: StudentRosterItem[] = directLinks.map((link) => {
    // Derive categories from student's own active license pool entitlements
    const studentCategories = Array.from(
      new Set(
        link.student.enrollments.flatMap((e) => e.licensePool.categories)
      )
    );

    return {
      profileId: link.student.id,
      enrollmentId: link.id, // Store linkId for identification
      name: `${link.student.firstName} ${link.student.lastName}`.trim() || link.student.email,
      email: link.student.email,
      classYear: link.student.classYear,
      enrolledAt: link.createdAt,
      status: EnrollmentStatus.ACTIVE,
      licensePoolId: null,
      licensePoolName: "Direct Mentorship",
      categories: studentCategories.length > 0 ? studentCategories : ["Self-Enrolled"],
      completedExamCount: link.student._count.summaries,
      sourceType: "DIRECT_MENTORSHIP",
    };
  });

  // 2. If user is independent without an organization, return direct roster immediately
  if (!orgId) {
    return {
      orgName: "Independent / Private Practice",
      metrics: {
        totalPurchasedSeats: 0,
        activeAllocatedSeats: 0,
        availableVacancies: 0,
        licensePools: [],
      },
      roster: directRoster,
    };
  }

  // 3. Fetch institutional data (organization, license pools, pool enrollments)
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

  const institutionalRoster: StudentRosterItem[] = enrollments.map((e) => ({
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
    sourceType: "INSTITUTIONAL",
  }));

  // 4. Combine rosters, deduplicating by profileId (Institutional takes precedence if both exist)
  const existingProfileIds = new Set(institutionalRoster.map((item) => item.profileId));
  const filteredDirectRoster = directRoster.filter(
    (item) => !existingProfileIds.has(item.profileId)
  );

  const combinedRoster = [...institutionalRoster, ...filteredDirectRoster].sort(
    (a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
  );

  return {
    orgName: org?.name || "Organization",
    metrics: {
      totalPurchasedSeats,
      activeAllocatedSeats,
      availableVacancies,
      licensePools: formattedPools,
    },
    roster: combinedRoster,
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