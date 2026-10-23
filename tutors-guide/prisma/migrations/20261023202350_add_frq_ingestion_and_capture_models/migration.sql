-- CreateEnum
CREATE TYPE "FrqSubmissionStatus" AS ENUM ('PENDING_INGESTION', 'UPLOADED', 'CROPPED', 'PENDING_AUDIT', 'EVALUATED', 'FAILED');

-- CreateEnum
CREATE TYPE "CaptureSessionStatus" AS ENUM ('ACTIVE', 'CAPTURED', 'EXPIRED');

-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'FRQ_HANDWRITTEN';

-- CreateTable
CREATE TABLE "FrqSubmission" (
    "id" TEXT NOT NULL,
    "status" "FrqSubmissionStatus" NOT NULL DEFAULT 'PENDING_INGESTION',
    "fullSheetUrl" TEXT,
    "storageKey" TEXT,
    "mimeType" TEXT,
    "fileSizeBytes" INTEGER,
    "sheetPageNumber" INTEGER,
    "detectedExamCode" TEXT,
    "detectedQuestion" INTEGER,
    "profileId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FrqSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrqSubCrop" (
    "id" TEXT NOT NULL,
    "subPartLabel" TEXT NOT NULL,
    "cropUrl" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "bbox" JSONB,
    "transcription" TEXT,
    "pointsAwarded" DOUBLE PRECISION DEFAULT 0,
    "pointsPossible" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "rubricBreakdown" JSONB,
    "needsHumanAudit" BOOLEAN NOT NULL DEFAULT false,
    "auditReason" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewerNotes" TEXT,
    "frqSubmissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FrqSubCrop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaptureSession" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "status" "CaptureSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "profileId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "frqSubmissionId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaptureSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FrqSubmission_profileId_testId_sectionId_idx" ON "FrqSubmission"("profileId", "testId", "sectionId");

-- CreateIndex
CREATE INDEX "FrqSubmission_questionId_idx" ON "FrqSubmission"("questionId");

-- CreateIndex
CREATE INDEX "FrqSubCrop_frqSubmissionId_idx" ON "FrqSubCrop"("frqSubmissionId");

-- CreateIndex
CREATE INDEX "FrqSubCrop_needsHumanAudit_idx" ON "FrqSubCrop"("needsHumanAudit");

-- CreateIndex
CREATE INDEX "FrqSubCrop_reviewedById_idx" ON "FrqSubCrop"("reviewedById");

-- CreateIndex
CREATE UNIQUE INDEX "CaptureSession_sessionToken_key" ON "CaptureSession"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "CaptureSession_frqSubmissionId_key" ON "CaptureSession"("frqSubmissionId");

-- CreateIndex
CREATE INDEX "CaptureSession_sessionToken_idx" ON "CaptureSession"("sessionToken");

-- CreateIndex
CREATE INDEX "CaptureSession_profileId_questionId_idx" ON "CaptureSession"("profileId", "questionId");

-- AddForeignKey
ALTER TABLE "FrqSubmission" ADD CONSTRAINT "FrqSubmission_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrqSubmission" ADD CONSTRAINT "FrqSubmission_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrqSubmission" ADD CONSTRAINT "FrqSubmission_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrqSubCrop" ADD CONSTRAINT "FrqSubCrop_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrqSubCrop" ADD CONSTRAINT "FrqSubCrop_frqSubmissionId_fkey" FOREIGN KEY ("frqSubmissionId") REFERENCES "FrqSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptureSession" ADD CONSTRAINT "CaptureSession_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptureSession" ADD CONSTRAINT "CaptureSession_frqSubmissionId_fkey" FOREIGN KEY ("frqSubmissionId") REFERENCES "FrqSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
