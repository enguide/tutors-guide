// prisma/seed.ts
import bcrypt from "bcryptjs";
import { Role, ClassYear, Category } from "@prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Starting database seed...");

  // 1. Clean existing records in reverse dependency order
  await prisma.enrollment.deleteMany();
  await prisma.licensePool.deleteMany();
  await prisma.result.deleteMany();
  await prisma.response.deleteMany();
  await prisma.section.deleteMany();
  await prisma.test.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.school.deleteMany();

  // 2. Default Organization & School
  const defaultOrg = await prisma.organization.create({
    data: {
      id: "org-apex-prep",
      name: "Apex Prep Academy",
    },
  });

  const defaultSchool = await prisma.school.create({
    data: {
      id: "school-lincoln-high",
      name: "Lincoln High School",
    },
  });

  // 3. User Profiles
  const hashedPassword = await bcrypt.hash("AdminPass123!", 10);

  await prisma.profile.create({
    data: {
      id: "prof-admin-01",
      firstName: "Platform",
      lastName: "Admin",
      email: "admin@testplatform.com",
      password: hashedPassword,
      classYear: ClassYear.OTHER,
      role: Role.ADMIN,
      orgId: defaultOrg.id,
      schoolId: defaultSchool.id,
    },
  });

  const studentProfile = await prisma.profile.create({
    data: {
      id: "prof-student-01",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@testplatform.com",
      password: hashedPassword,
      classYear: ClassYear.JUNIOR,
      role: Role.STUDENT,
      schoolId: defaultSchool.id,
    },
  });

  // 4. Create an Individual License Pool (SAT + ACT Bundle) for Jane Doe
  const studentPool = await prisma.licensePool.create({
    data: {
      name: "Jane Doe - SAT & ACT Combo",
      seatLimit: 1,
      categories: [Category.SAT, Category.ACT],
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      purchaserId: studentProfile.id,
    },
  });

  // 5. Enroll student into their pool
  await prisma.enrollment.create({
    data: {
      profileId: studentProfile.id,
      licensePoolId: studentPool.id,
      status: "ACTIVE",
    },
  });

  // 6. Create an Organization License Pool (Apex Prep - 25 Seats for SAT)
  await prisma.licensePool.create({
    data: {
      name: "Apex Prep Academy - Fall 2026 Cohort",
      orgId: defaultOrg.id,
      seatLimit: 25,
      categories: [Category.SAT],
      inviteCode: "APEX-SAT-2026",
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("Database seeded successfully with LicensePools & Enrollments.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });