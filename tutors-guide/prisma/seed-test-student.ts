// prisma/seed-test-student.ts
import { PrismaClient, Role, ClassYear, Category, EnrollmentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "student.tester@example.com";
  const rawPassword = "Password123!";
  const hashedPassword = await bcrypt.hash(rawPassword, 12);

  console.log(`Upserting test student: ${email}...`);

  // 1. Upsert Profile
  const student = await prisma.profile.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: Role.STUDENT,
      classYear: ClassYear.SENIOR,
    },
    create: {
      firstName: "Diagnostic",
      lastName: "Tester",
      email,
      password: hashedPassword,
      role: Role.STUDENT,
      classYear: ClassYear.SENIOR,
    },
  });

  // 2. Upsert an all-inclusive 365-day License Pool
  const pool = await prisma.licensePool.upsert({
    where: { id: "test-pool-all-categories" },
    update: {
      categories: [Category.SAT, Category.ACT, Category.AP_CALC, Category.GRE],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    create: {
      id: "test-pool-all-categories",
      name: "Full Diagnostic Suite (SAT, ACT, AP, GRE)",
      seatLimit: 10,
      categories: [Category.SAT, Category.ACT, Category.AP_CALC, Category.GRE],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  // 3. Upsert Active Enrollment
  await prisma.enrollment.upsert({
    where: {
      profileId_licensePoolId: {
        profileId: student.id,
        licensePoolId: pool.id,
      },
    },
    update: {
      status: EnrollmentStatus.ACTIVE,
    },
    create: {
      profileId: student.id,
      licensePoolId: pool.id,
      status: EnrollmentStatus.ACTIVE,
    },
  });

  console.log(`\nSuccessfully provisioned test student:`);
  console.log(`Email:    ${email}`);
  console.log(`Password: ${rawPassword}`);
  console.log(`Entitlements: SAT, ACT, AP_CALC, GRE\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });