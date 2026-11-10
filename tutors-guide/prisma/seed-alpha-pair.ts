// prisma/seed-alpha-pair.ts
import { PrismaClient, Role, ClassYear, LinkStatus, EnrollmentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = "1234";
  const hashedPassword = await bcrypt.hash(defaultPassword, 12);

  // 1. Define Credentials
  const adminEmail = "indiemoosedev@gmail.com";
  const tutorEmail = "cbullwinkle@highmountainprep.com";
  const studentEmail = "corinnemullinixc@gmail.com";
  const poolId = "alpha-pool-sat-only";

  console.log("Seeding Platform Profiles (Admin + Tutor + SAT Student)...");

  // 2. Provision SAT-Only License Pool
  const satPool = await prisma.licensePool.upsert({
    where: { id: poolId },
    update: {
      categories: ["SAT"],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    create: {
      id: poolId,
      name: "Alpha SAT Diagnostic License",
      seatLimit: 5,
      categories: ["SAT"],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  // 3. Upsert Global Admin Profile
  const admin = await prisma.profile.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
    },
    create: {
      firstName: "Christopher",
      lastName: "Bullwinkle",
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      classYear: ClassYear.OTHER,
      twoFactorAuthActivated: false,
    },
  });

  // 4. Upsert Tutor Profile (Leaves existing data untouched if already present)
  const tutor = await prisma.profile.upsert({
    where: { email: tutorEmail },
    update: {},
    create: {
      firstName: "Christopher",
      lastName: "Bullwinkle",
      email: tutorEmail,
      password: hashedPassword,
      role: Role.TUTOR,
      classYear: ClassYear.OTHER,
      twoFactorAuthActivated: false,
    },
  });

  // 5. Upsert Student Profile (Leaves existing data untouched if already present)
  const student = await prisma.profile.upsert({
    where: { email: studentEmail },
    update: {},
    create: {
      firstName: "Corinne",
      lastName: "Mullinix",
      email: studentEmail,
      password: hashedPassword,
      role: Role.STUDENT,
      classYear: ClassYear.JUNIOR,
      twoFactorAuthActivated: false,
    },
  });

  // 6. Enroll Student in the SAT License Pool
  await prisma.enrollment.upsert({
    where: {
      profileId_licensePoolId: {
        profileId: student.id,
        licensePoolId: satPool.id,
      },
    },
    update: {
      status: EnrollmentStatus.ACTIVE,
    },
    create: {
      profileId: student.id,
      licensePoolId: satPool.id,
      status: EnrollmentStatus.ACTIVE,
    },
  });

  // 7. Connect Tutor and Student via TutorStudentLink
  await prisma.tutorStudentLink.upsert({
    where: {
      tutorId_studentId: {
        tutorId: tutor.id,
        studentId: student.id,
      },
    },
    update: {
      status: LinkStatus.ACTIVE,
    },
    create: {
      tutorId: tutor.id,
      studentId: student.id,
      status: LinkStatus.ACTIVE,
    },
  });

  console.log("\n Successfully provisioned platform profiles:");
  console.log(`Admin:   ${admin.email} (Role: ADMIN)`);
  console.log(`Tutor:   ${tutor.email} (Role: TUTOR)`);
  console.log(`Student: ${student.email} (Role: STUDENT, Category: SAT)`);
  console.log(`Link:    ACTIVE between ${tutor.id} and ${student.id}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });