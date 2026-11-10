// app/tests/[category]/[testId]/[sectionId]/page.tsx
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getTestMetadata,
  getSectionById,
  ensureTestInDatabase,
} from "@/lib/contentLoader";
import { resolveSectionConfig } from "@/lib/examConfigRegistry";
import { SupportedExamCategory } from "@/types/examConfig";
import { ExamClient, ExtendedServerCheckpointData } from "@/components/exam/ExamClient";
import { NavigationHistoryEntry } from "@/hooks/useTestProgress";
import { AccommodationSettings } from "@/types/accommodations";

export const instant = false;

interface ExamPageRouteProps {
  params: Promise<{
    category: string;
    testId: string;
    sectionId: string;
  }>;
}

export default async function ExamSectionPage({ params }: ExamPageRouteProps) {
  // Opt in to dynamic server request execution for Next.js 16 Dynamic IO
  await connection();

  const { category, testId, sectionId } = await params;
  const examCat = category.toUpperCase() as SupportedExamCategory;

  // 1. Authenticate user & enforce role permissions
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/tests/${category}/${testId}/${sectionId}`);
  }

  const userRole = session.user.role;
  const studentName = session.user.name || "Student Preview";
  const isAdmin = userRole === "ADMIN";
  const isStudent = userRole === "STUDENT";

  // ORG_ADMIN and TUTOR are barred from taking tests
  if (!isAdmin && !isStudent) {
    redirect(`/dashboard?notice=staff_restricted`);
  }

  // 2. Load test metadata upfront to verify specific course entitlement and structure
  const metadata = await getTestMetadata(category, testId);
  const section = await getSectionById(category, testId, sectionId);

  if (!metadata || !section) {
    notFound();
  }

  // 3. Granular Entitlement Verification
  const userEntitlements: string[] = session.user.entitlements || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requiredEntitlement: string = (metadata as any).entitlement || examCat;

  const hasAccess =
    isAdmin ||
    userEntitlements.includes(requiredEntitlement) ||
    userEntitlements.includes(examCat) ||
    userEntitlements.includes(`${examCat}:*`);

  if (!hasAccess) {
    redirect(`/dashboard?error=unauthorized_course&required=${encodeURIComponent(requiredEntitlement)}`);
  }

  // 4. Strict One-Way Lockout Guard: Prevent re-taking or re-entering finalized sections
  const alreadySubmitted = await prisma.result.findUnique({
    where: {
      testId_profileId_sectionId: {
        testId,
        profileId: session.user.id,
        sectionId,
      },
    },
    select: { id: true },
  });

  if (alreadySubmitted) {
    redirect(`/tests/${category}/${testId}`);
  }

  // Auto-sync: Guarantee this Test & Section exist in PostgreSQL before client boots
  await ensureTestInDatabase(metadata);

  // 5. Locate the section entry in metadata.json to pull its manifest config
  const manifestSection = metadata.sections.find((s) => s.id === sectionId);

  // 6. Cascade overrides: Category Defaults -> metadata.config -> metadata.sections[i].config -> frontmatter.config
  const effectiveConfig = resolveSectionConfig(
    examCat,
    metadata.config,
    {
      ...(manifestSection?.config || {}),
      ...(section.frontmatter.config || {}),
    }
  );

  // 7. Authoritative Server Check: Has this student started ANY section of this test?
  const [
    checkpointRecord, 
    existingResponses, 
    anyCompletedSection, 
    anyPriorCheckpoint
  ] = await Promise.all([
    // Checkpoint for THIS specific section
    prisma.sectionCheckpoint.findUnique({
      where: {
        profileId_testId_sectionId: {
          profileId: session.user.id,
          testId,
          sectionId,
        },
      },
    }),
    // Prior saved responses for THIS specific section
    prisma.response.findMany({
      where: {
        profileId: session.user.id,
        testId,
        sectionId,
      },
      select: {
        questionId: true,
        selectedOptionId: true,
        frqUserAnswer: true,
        timeSpentOnResponse: true,
        usedCalculator: true,
        changedAnswer: true,
      },
    }),
    // Did the student complete any earlier section of this test?
    prisma.result.findFirst({
      where: {
        testId,
        profileId: session.user.id,
      },
      select: {
        accommodations: true,
      },
    }),
    // Does the student have ANY checkpoint for this test across all sections?
    prisma.sectionCheckpoint.findFirst({
      where: {
        testId,
        profileId: session.user.id,
      },
      select: {
        accommodations: true,
      },
    }),
  ]);

  // If the student has any submitted section OR any checkpoint anywhere in this test, the exam has started.
  const isExamAttemptStarted = Boolean(anyCompletedSection || anyPriorCheckpoint || checkpointRecord);

  // Resolve accommodations from earlier sections in PostgreSQL if switching devices
  const resolvedAccommodations: AccommodationSettings | null =
    (checkpointRecord?.accommodations as unknown as AccommodationSettings) ||
    (anyPriorCheckpoint?.accommodations as unknown as AccommodationSettings) ||
    (anyCompletedSection?.accommodations as unknown as AccommodationSettings) ||
    null;

  const formattedCheckpoint: ExtendedServerCheckpointData | null = checkpointRecord
    ? {
        timeRemainingSeconds: checkpointRecord.timeRemainingSeconds,
        lastQuestionIndex: checkpointRecord.lastQuestionIndex,
        navigationHistory: Array.isArray(checkpointRecord.navigationHistory)
          ? (checkpointRecord.navigationHistory as unknown as NavigationHistoryEntry[])
          : null,
        accommodations: resolvedAccommodations,
        clientUpdatedAt: checkpointRecord.clientUpdatedAt.toISOString(),
      }
    : null;

  return (
    <ExamClient
      metadata={metadata}
      section={section}
      effectiveConfig={effectiveConfig}
      category={category}
      testId={testId}
      studentName={studentName}
      serverCheckpoint={formattedCheckpoint}
      serverResponses={existingResponses}
      isExamAttemptStarted={isExamAttemptStarted}
      serverAccommodations={resolvedAccommodations}
    />
  );
}