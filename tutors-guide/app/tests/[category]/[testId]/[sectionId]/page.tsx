// app/tests/[category]/[testId]/[sectionId]/page.tsx
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getTestMetadata,
  getSectionById,
  ensureTestInDatabase,
  resolveTestStatus,
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
  await connection();

  const { category, testId, sectionId } = await params;
  const examCat = category.toUpperCase() as SupportedExamCategory;

  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/tests/${category}/${testId}/${sectionId}`);
  }

  const userRole = session.user.role;
  const studentName = session.user.name || "Student Preview";
  const isAdmin = userRole === "ADMIN";
  const isStudent = userRole === "STUDENT";

  if (!isAdmin && !isStudent) {
    redirect(`/dashboard?notice=staff_restricted`);
  }

  const metadata = await getTestMetadata(category, testId);
  const section = await getSectionById(category, testId, sectionId);

  if (!metadata || !section) {
    notFound();
  }

  const testStatus = resolveTestStatus(metadata);
  if (testStatus !== "published" && !isAdmin) {
    notFound();
  }

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

  await ensureTestInDatabase(metadata);

  // Check whether ANY section in this exam uses FRQ_HANDWRITTEN (false for SAT, ACT, GRE, etc.)
  let hasHandwrittenFrqs = section.frontmatter.questions.some(
    (q) => q.questionType === "FRQ_HANDWRITTEN"
  );

  if (!hasHandwrittenFrqs && metadata.sections.length > 1) {
    const otherSections = await Promise.all(
      metadata.sections
        .filter((s) => s.id !== sectionId)
        .map((s) => getSectionById(category, testId, s.id))
    );
    hasHandwrittenFrqs = otherSections.some((sec) =>
      sec?.frontmatter?.questions?.some((q) => q.questionType === "FRQ_HANDWRITTEN")
    );
  }

  const manifestSection = metadata.sections.find((s) => s.id === sectionId);

  const effectiveConfig = resolveSectionConfig(
    examCat,
    metadata.config,
    {
      ...(manifestSection?.config || {}),
      ...(section.frontmatter.config || {}),
    }
  );

  const [
    checkpointRecord,
    existingResponses,
    anyCompletedSection,
    anyPriorCheckpoint,
  ] = await Promise.all([
    prisma.sectionCheckpoint.findUnique({
      where: {
        profileId_testId_sectionId: {
          profileId: session.user.id,
          testId,
          sectionId,
        },
      },
    }),
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
    prisma.result.findFirst({
      where: {
        testId,
        profileId: session.user.id,
      },
      select: {
        accommodations: true,
      },
    }),
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

  const isExamAttemptStarted = Boolean(anyCompletedSection || anyPriorCheckpoint || checkpointRecord);

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
      hasHandwrittenFrqs={hasHandwrittenFrqs}
    />
  );
}