// prisma/seed.ts
import bcrypt from "bcryptjs";
import { Role, ClassYear, Category, EnrollmentStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Starting database seed...");

  // 1. Clean existing records in reverse dependency order
  await prisma.passwordResetToken.deleteMany();
  await prisma.testSummary.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.licensePool.deleteMany();
  await prisma.result.deleteMany();
  await prisma.response.deleteMany();
  await prisma.section.deleteMany();
  await prisma.test.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.school.deleteMany();

  console.log("Existing records cleared.");

  // 2. Organization & School
  const testOrg = await prisma.organization.create({
    data: {
      id: "org-apex-prep",
      name: "Apex Prep Academy",
    },
  });

  const testSchool = await prisma.school.create({
    data: {
      id: "school-lincoln-high",
      name: "Lincoln High School",
    },
  });

  // 3. Password hash for "1234"
  const passwordHash = await bcrypt.hash("1234", 10);

  // All available exam categories to grant complete test content access
  const allTestCategories = [
    Category.SAT,
    Category.ACT,
    Category.AP_CALC,
    Category.GRE,
    Category.ACADEMIC,
  ];

  // 4. Create Org Admin, Tutor, and Student (all tied to Apex Prep Academy)
  const orgAdmin = await prisma.profile.create({
    data: {
      id: "prof-org-admin",
      firstName: "Sarah",
      lastName: "Connor",
      email: "admin@apexprep.com",
      password: passwordHash,
      classYear: ClassYear.OTHER,
      role: Role.ORG_ADMIN,
      orgId: testOrg.id,
      schoolId: testSchool.id,
    },
  });

  const tutor = await prisma.profile.create({
    data: {
      id: "prof-tutor",
      firstName: "Marcus",
      lastName: "Wright",
      email: "tutor@apexprep.com",
      password: passwordHash,
      classYear: ClassYear.OTHER,
      role: Role.TUTOR,
      orgId: testOrg.id,
      schoolId: testSchool.id,
    },
  });

  const student = await prisma.profile.create({
    data: {
      id: "prof-student",
      firstName: "Jane",
      lastName: "Doe",
      email: "student@apexprep.com",
      password: passwordHash,
      classYear: ClassYear.JUNIOR,
      role: Role.STUDENT,
      orgId: testOrg.id,
      schoolId: testSchool.id,
    },
  });

  // 5. Create an Organization License Pool containing all categories
  const orgLicensePool = await prisma.licensePool.create({
    data: {
      id: "pool-apex-all-access",
      name: "Apex Prep Academy - All Access Cohort",
      seatLimit: 50,
      categories: allTestCategories,
      inviteCode: "ORG-APEX26",
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      orgId: testOrg.id,
      purchaserId: orgAdmin.id,
    },
  });

  // 6. Enroll users into the pool so they inherit all categories during auth()
  await prisma.enrollment.createMany({
    data: [
      {
        profileId: student.id,
        licensePoolId: orgLicensePool.id,
        status: EnrollmentStatus.ACTIVE,
      },
      {
        profileId: tutor.id,
        licensePoolId: orgLicensePool.id,
        status: EnrollmentStatus.ACTIVE,
      },
      {
        profileId: orgAdmin.id,
        licensePoolId: orgLicensePool.id,
        status: EnrollmentStatus.ACTIVE,
      },
    ],
  });

  // 7. Seed sample Test, Section, and Result so tgadmin analytics and inspection work immediately
  const sampleTest = await prisma.test.create({
    data: {
      id: "sat-practice-1",
      title: "Digital SAT Practice Test 1",
      category: Category.SAT,
      sections: {
        create: [
          {
            id: "sat-practice-1-s1",
            title: "Reading and Writing - Module 1",
            sectionOrder: 1,
            timeLimit: 1920,
          },
          {
            id: "sat-practice-1-s2",
            title: "Math - Module 1",
            sectionOrder: 2,
            timeLimit: 2100,
          },
        ],
      },
    },
  });

  // Sample completed exam result for Jane Doe
  await prisma.result.createMany({
    data: [
      {
        testId: sampleTest.id,
        profileId: student.id,
        sectionId: "sat-practice-1-s1",
        numCorrect: 23,
        totalQuestions: 27,
        rawScore: 23,
        scaledScore: 680,
        timeRemainingSeconds: 240,
        testTitle: "Digital SAT Practice Test 1",
        navigationHistory: [
          { time: 0, qIdx: 0 },
          { time: 60, qIdx: 1 },
          { time: 130, qIdx: 2 },
        ],
      },
      {
        testId: sampleTest.id,
        profileId: student.id,
        sectionId: "sat-practice-1-s2",
        numCorrect: 20,
        totalQuestions: 22,
        rawScore: 20,
        scaledScore: 700,
        timeRemainingSeconds: 180,
        testTitle: "Digital SAT Practice Test 1",
        navigationHistory: [
          { time: 0, qIdx: 0 },
          { time: 75, qIdx: 1 },
          { time: 150, qIdx: 2 },
        ],
      },
    ],
  });

  await prisma.testSummary.create({
    data: {
      testId: sampleTest.id,
      profileId: student.id,
      testTitle: "Digital SAT Practice Test 1",
      category: Category.SAT,
      compositeScore: 1380,
      percentile: "92nd",
    },
  });

  console.log(`
Database seeded successfully!
==================================================
Organization: Apex Prep Academy (org-apex-prep)
Join Code:    ORG-APEX26
Categories:   SAT, ACT, AP_CALC, GRE, ACADEMIC
Password:     1234 (for all accounts)

Accounts Created:
1. ORG_ADMIN: admin@apexprep.com
2. TUTOR:     tutor@apexprep.com
3. STUDENT:   student@apexprep.com
==================================================
  `);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });