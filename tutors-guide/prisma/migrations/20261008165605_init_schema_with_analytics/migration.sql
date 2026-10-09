-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TUTOR', 'ORG', 'ADMIN', 'PARENT');

-- CreateEnum
CREATE TYPE "Package" AS ENUM ('NONE', 'SAT', 'ACT', 'AP_CALC', 'GRE', 'ALL');

-- CreateEnum
CREATE TYPE "ClassYear" AS ENUM ('FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR', 'OTHER');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('NONE', 'SAT', 'ACT', 'AP_CALC', 'GRE', 'ACADEMIC');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MC', 'FR');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "seatLimit" INTEGER NOT NULL DEFAULT 0,
    "packageType" "Package" NOT NULL DEFAULT 'NONE',
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "classYear" "ClassYear" NOT NULL,
    "tgpackage" "Package" NOT NULL DEFAULT 'NONE',
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "schoolId" TEXT,
    "orgId" TEXT,
    "twoFactorAuthSecret" TEXT,
    "twoFactorAuthActivated" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "tgpackage" "Package" NOT NULL DEFAULT 'NONE',
    "stripeSessionId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'NONE',

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sectionOrder" INTEGER NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "testId" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "responseOrder" INTEGER NOT NULL,
    "sectionOrder" INTEGER NOT NULL,
    "timeSpentOnResponse" INTEGER DEFAULT 0,
    "questionId" TEXT NOT NULL,
    "responseType" "QuestionType" NOT NULL DEFAULT 'MC',
    "selectedOptionId" TEXT,
    "frqUserAnswer" TEXT,
    "correctAnswerKey" TEXT NOT NULL,
    "usedCalculator" BOOLEAN NOT NULL DEFAULT false,
    "changedAnswer" BOOLEAN NOT NULL DEFAULT false,
    "profileId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "numCorrect" INTEGER NOT NULL DEFAULT 0,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "rawScore" INTEGER NOT NULL DEFAULT 0,
    "scaledScore" INTEGER,
    "timeRemainingSeconds" INTEGER NOT NULL DEFAULT 0,
    "navigationHistory" JSONB,
    "testTitle" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSummary" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "testTitle" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'NONE',
    "compositeScore" INTEGER,
    "percentile" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tokenExpiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_stripeCustomerId_key" ON "Organization"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "Organization_stripeCustomerId_idx" ON "Organization"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE INDEX "Profile_email_idx" ON "Profile"("email");

-- CreateIndex
CREATE INDEX "Profile_orgId_idx" ON "Profile"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_stripeSessionId_key" ON "Membership"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_profileId_key" ON "Membership"("profileId");

-- CreateIndex
CREATE INDEX "Section_testId_idx" ON "Section"("testId");

-- CreateIndex
CREATE INDEX "Response_profileId_testId_idx" ON "Response"("profileId", "testId");

-- CreateIndex
CREATE UNIQUE INDEX "Response_profileId_questionId_key" ON "Response"("profileId", "questionId");

-- CreateIndex
CREATE INDEX "Result_profileId_idx" ON "Result"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Result_testId_profileId_sectionId_key" ON "Result"("testId", "profileId", "sectionId");

-- CreateIndex
CREATE INDEX "TestSummary_profileId_idx" ON "TestSummary"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "TestSummary_testId_profileId_key" ON "TestSummary"("testId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_id_key" ON "PasswordResetToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSummary" ADD CONSTRAINT "TestSummary_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSummary" ADD CONSTRAINT "TestSummary_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
