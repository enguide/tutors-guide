
import bcrypt from "bcryptjs";
import {
  Role,
  Package,
  ClassYear,
  Category,
} from "@prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Starting database seed...");

  // 1. Clean existing records (in reverse dependency order)
  await prisma.result.deleteMany();
  await prisma.response.deleteMany();
  await prisma.section.deleteMany();
  await prisma.test.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.school.deleteMany();

  // 2. Seed Default Organization & School for B2B testing
  const defaultOrg = await prisma.organization.create({
    data: {
      id: "org-apex-prep",
      name: "Apex Prep Academy",
      seatLimit: 25,
      packageType: Package.ALL,
    },
  });

  const defaultSchool = await prisma.school.create({
    data: {
      id: "school-lincoln-high",
      name: "Lincoln High School",
    },
  });

  // 3. Seed Mock Admin & Student Profiles
  const hashedPassword = await bcrypt.hash("AdminPass123!", 10);

  const adminProfile = await prisma.profile.create({
    data: {
      id: "prof-admin-01",
      firstName: "Platform",
      lastName: "Admin",
      email: "admin@testplatform.com",
      password: hashedPassword,
      classYear: ClassYear.OTHER,
      role: Role.ADMIN,
      tgpackage: Package.ALL,
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
      tgpackage: Package.SAT,
      schoolId: defaultSchool.id,
    },
  });

  // 4. Seed Mock Test & Sections matching content/tests/sat/sat-practice-1/
  const testId = "sat-practice-1";

  const test = await prisma.test.create({
    data: {
      id: testId,
      title: "Digital SAT Practice Test 1",
      category: Category.SAT,
      sections: {
        create: [
          {
            id: `${testId}-s1`,
            title: "Reading and Writing - Module 1",
            sectionOrder: 1,
            timeLimit: 1920, // 32 minutes in seconds
          },
          {
            id: `${testId}-s2`,
            title: "Reading and Writing - Module 2",
            sectionOrder: 2,
            timeLimit: 1920,
          },
          {
            id: `${testId}-s3`,
            title: "Math - Module 1",
            sectionOrder: 3,
            timeLimit: 2100, // 35 minutes in seconds
          },
          {
            id: `${testId}-s4`,
            title: "Math - Module 2",
            sectionOrder: 4,
            timeLimit: 2100,
          },
        ],
      },
    },
    include: {
      sections: true,
    },
  });

  console.log(`Database seeded successfully:`);
  console.log(` - Admin: ${adminProfile.email}`);
  console.log(` - Student: ${studentProfile.email}`);
  console.log(` - Test: ${test.title} (${test.sections.length} sections)`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });