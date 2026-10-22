-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('PENDING', 'ACTIVE', 'REVOKED');

-- CreateTable
CREATE TABLE "TutorStudentLink" (
    "id" TEXT NOT NULL,
    "status" "LinkStatus" NOT NULL DEFAULT 'PENDING',
    "tutorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorStudentLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TutorStudentLink_tutorId_idx" ON "TutorStudentLink"("tutorId");

-- CreateIndex
CREATE INDEX "TutorStudentLink_studentId_idx" ON "TutorStudentLink"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "TutorStudentLink_tutorId_studentId_key" ON "TutorStudentLink"("tutorId", "studentId");

-- AddForeignKey
ALTER TABLE "TutorStudentLink" ADD CONSTRAINT "TutorStudentLink_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorStudentLink" ADD CONSTRAINT "TutorStudentLink_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
