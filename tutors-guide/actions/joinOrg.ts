"use server";

import { prisma } from "@/lib/prisma";
import { EnrollmentStatus, Role, ClassYear } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function redeemInviteCode(formData: {
  inviteCode: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  classYear?: ClassYear;
}) {
  const code = formData.inviteCode.trim();
  const email = formData.email.toLowerCase().trim();

  return await prisma.$transaction(async (tx) => {
    // 1. Validate License Pool and Seat Capacity
    const pool = await tx.licensePool.findUnique({
      where: { inviteCode: code },
      include: {
        enrollments: {
          where: { status: EnrollmentStatus.ACTIVE },
        },
      },
    });

    if (!pool) throw new Error("Invalid institutional invite code.");
    if (new Date() > pool.expiresAt) throw new Error("This license pool has expired.");
    if (pool.enrollments.length >= pool.seatLimit) throw new Error("This pool has no remaining seats available.");

    // 2. Fetch or Create Student Profile
    let student = await tx.profile.findUnique({ where: { email } });

    if (!student) {
      if (!formData.password) throw new Error("Password is required for new registration.");
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      student = await tx.profile.create({
        data: {
          email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: hashedPassword,
          classYear: formData.classYear || ClassYear.OTHER,
          role: Role.STUDENT,
          orgId: pool.orgId,
        },
      });
    }

    // 3. Upsert Active Enrollment
    const enrollment = await tx.enrollment.upsert({
      where: {
        profileId_licensePoolId: {
          profileId: student.id,
          licensePoolId: pool.id,
        },
      },
      update: { status: EnrollmentStatus.ACTIVE },
      create: {
        profileId: student.id,
        licensePoolId: pool.id,
        status: EnrollmentStatus.ACTIVE,
      },
    });

    return {
      success: true,
      email: student.email,
      poolName: pool.name,
      categories: pool.categories,
      enrollmentId: enrollment.id,
    };
  });
}