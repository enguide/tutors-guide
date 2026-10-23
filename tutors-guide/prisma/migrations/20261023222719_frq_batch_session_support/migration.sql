/*
  Warnings:

  - You are about to drop the column `frqSubmissionId` on the `CaptureSession` table. All the data in the column will be lost.
  - You are about to drop the column `sheetPageNumber` on the `FrqSubmission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId,testId,sectionId,questionId,pageNumber]` on the table `FrqSubmission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CaptureSession" DROP CONSTRAINT "CaptureSession_frqSubmissionId_fkey";

-- DropIndex
DROP INDEX "CaptureSession_frqSubmissionId_key";

-- DropIndex
DROP INDEX "CaptureSession_profileId_questionId_idx";

-- AlterTable
ALTER TABLE "CaptureSession" DROP COLUMN "frqSubmissionId",
ALTER COLUMN "questionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FrqSubmission" DROP COLUMN "sheetPageNumber",
ADD COLUMN     "captureSessionId" TEXT,
ADD COLUMN     "pageNumber" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "CaptureSession_profileId_testId_sectionId_idx" ON "CaptureSession"("profileId", "testId", "sectionId");

-- CreateIndex
CREATE INDEX "FrqSubmission_captureSessionId_idx" ON "FrqSubmission"("captureSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "FrqSubmission_profileId_testId_sectionId_questionId_pageNum_key" ON "FrqSubmission"("profileId", "testId", "sectionId", "questionId", "pageNumber");

-- AddForeignKey
ALTER TABLE "FrqSubmission" ADD CONSTRAINT "FrqSubmission_captureSessionId_fkey" FOREIGN KEY ("captureSessionId") REFERENCES "CaptureSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
