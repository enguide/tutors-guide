/*
  Warnings:

  - The values [ORG] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `packageType` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `seatLimit` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `tgpackage` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STUDENT', 'TUTOR', 'ORG_ADMIN', 'ADMIN', 'PARENT');
ALTER TABLE "public"."Profile" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Profile" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "Profile" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_profileId_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "packageType",
DROP COLUMN "seatLimit";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "tgpackage";

-- DropTable
DROP TABLE "Membership";

-- DropEnum
DROP TYPE "Package";

-- CreateTable
CREATE TABLE "LicensePool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "stripeSubscriptionId" TEXT,
    "seatLimit" INTEGER NOT NULL DEFAULT 1,
    "categories" "Category"[],
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "purchaserId" TEXT,
    "orgId" TEXT,
    "inviteCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LicensePool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "profileId" TEXT NOT NULL,
    "licensePoolId" TEXT NOT NULL,
    "firstAccessedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LicensePool_stripeSessionId_key" ON "LicensePool"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "LicensePool_inviteCode_key" ON "LicensePool"("inviteCode");

-- CreateIndex
CREATE INDEX "LicensePool_purchaserId_idx" ON "LicensePool"("purchaserId");

-- CreateIndex
CREATE INDEX "LicensePool_orgId_idx" ON "LicensePool"("orgId");

-- CreateIndex
CREATE INDEX "LicensePool_inviteCode_idx" ON "LicensePool"("inviteCode");

-- CreateIndex
CREATE INDEX "Enrollment_profileId_idx" ON "Enrollment"("profileId");

-- CreateIndex
CREATE INDEX "Enrollment_licensePoolId_idx" ON "Enrollment"("licensePoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_profileId_licensePoolId_key" ON "Enrollment"("profileId", "licensePoolId");

-- AddForeignKey
ALTER TABLE "LicensePool" ADD CONSTRAINT "LicensePool_purchaserId_fkey" FOREIGN KEY ("purchaserId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicensePool" ADD CONSTRAINT "LicensePool_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_licensePoolId_fkey" FOREIGN KEY ("licensePoolId") REFERENCES "LicensePool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
