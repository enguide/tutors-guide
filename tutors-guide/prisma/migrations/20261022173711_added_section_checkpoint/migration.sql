-- CreateTable
CREATE TABLE "SectionCheckpoint" (
    "id" TEXT NOT NULL,
    "timeRemainingSeconds" INTEGER NOT NULL,
    "lastQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "navigationHistory" JSONB,
    "clientUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SectionCheckpoint_profileId_idx" ON "SectionCheckpoint"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "SectionCheckpoint_profileId_testId_sectionId_key" ON "SectionCheckpoint"("profileId", "testId", "sectionId");

-- AddForeignKey
ALTER TABLE "SectionCheckpoint" ADD CONSTRAINT "SectionCheckpoint_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
