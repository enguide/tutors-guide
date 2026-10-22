/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tests/[category]/[testId]/results/page.tsx
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTestMetadata, getSectionById } from "@/lib/contentLoader";
import { synthesizeAdaptiveTestScores } from "@/lib/scoring/adaptiveScorer";
import { TestAnalyticsClient } from "@/components/analytics/TestAnalyticsClient";
import { StudentNavbar } from "@/components/navigation/StudentNavbar";
import { StaffInspectionBar } from "@/components/navigation/StaffInspectionBar";
import { Category, LinkStatus, QuestionType, Role } from "@prisma/client";
import { QuestionFrontmatter } from "@/types/content";
import {
  EnrichedResponseItem,
  SectionResultData,
  TestSummaryData,
  AdaptiveTrajectoryData,
} from "@/types/analytics";

export const instant = false;

interface ResultsPageProps {
  params: Promise<{
    category: string;
    testId: string;
  }>;
  searchParams: Promise<{
    studentId?: string;
  }>;
}

function parseCategorySlug(slug: string): Category | null {
  const normalized = slug.trim().toUpperCase();
  if (Object.values(Category).includes(normalized as Category)) {
    return normalized as Category;
  }
  return null;
}

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

/**
 * High-fidelity skeleton matching the exact height, structure, and geometry
 * of TestAnalyticsClient and UnifiedAnalyticsDashboard.
 * min-h-[140vh] guarantees vertical scrollbar presence from initial paint.
 */
function AnalyticsLoadingSkeleton({ testTitle }: { testTitle?: string }) {
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 pb-28 animate-pulse min-h-[140vh]">
      {/* Sticky Tab Bar Skeleton */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30 mb-6">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-none" />
            <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-none" />
          </div>
          {testTitle ? (
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline-block">
              {testTitle}
            </span>
          ) : (
            <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded-none hidden sm:block" />
          )}
        </div>
      </div>

      {/* Main Analytics Canvas Skeleton */}
      <div className="max-w-[1350px] mx-auto px-1 sm:px-8 space-y-6">
        {/* Top Pacing / Score Card */}
        <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-none p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="space-y-2">
              <div className="h-6 w-64 bg-slate-200 dark:bg-slate-800 rounded-none" />
              <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded-none" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-none" />
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-none" />
              <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-none" />
            </div>
          </div>
          {/* Chart bar placeholders */}
          <div className="h-40 w-full flex items-end gap-2 pt-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-none"
                style={{ height: `${Math.max(25, (i * 21) % 100)}%` }}
              />
            ))}
          </div>
        </div>

        {/* Section Navigation Chart Card */}
        <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-none p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="h-5 w-44 bg-slate-200 dark:bg-slate-800 rounded-none" />
            <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded-none" />
          </div>
          <div className="h-64 w-full bg-slate-100 dark:bg-slate-900 border border-border/40 rounded-none flex items-center justify-center">
            <div className="h-4 w-52 bg-slate-200 dark:bg-slate-800 rounded-none" />
          </div>
        </div>

        {/* Accuracy & Breakdown Dual Column */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left: Topics and Skills Accordion */}
          <div className="w-full lg:w-2/3 bg-card border border-slate-200 dark:border-slate-800 rounded-none p-6 space-y-4">
            <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-none" />
            <div className="h-12 w-full bg-slate-100 dark:bg-slate-900 border border-border/40 rounded-none" />
            <div className="h-12 w-full bg-slate-100 dark:bg-slate-900 border border-border/40 rounded-none" />
            <div className="h-12 w-full bg-slate-100 dark:bg-slate-900 border border-border/40 rounded-none" />
            <div className="h-12 w-full bg-slate-100 dark:bg-slate-900 border border-border/40 rounded-none" />
          </div>

          {/* Right: Difficulty Bar Chart */}
          <div className="w-full lg:w-1/3 bg-card border border-slate-200 dark:border-slate-800 rounded-none p-6 space-y-4">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-none" />
            <div className="h-56 w-full bg-slate-100 dark:bg-slate-900 border border-border/40 rounded-none flex flex-col justify-around p-4">
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-none" />
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-none" />
              <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function ResultsDataContent({
  rawCategory,
  testId,
  targetProfileId,
  isStaffInspection,
}: {
  rawCategory: string;
  testId: string;
  targetProfileId: string;
  isStaffInspection: boolean;
}) {
  await connection();

  const metadata = await getTestMetadata(rawCategory.toLowerCase(), testId);
  if (!metadata) {
    notFound();
  }

  // Fetch student test results, responses, and parsed markdown sections
  const [testSummaryRecord, sectionResultRecords, userResponseRecords, sectionFiles] =
    await Promise.all([
      prisma.testSummary.findUnique({
        where: {
          testId_profileId: {
            testId,
            profileId: targetProfileId,
          },
        },
      }),
      prisma.result.findMany({
        where: {
          testId,
          profileId: targetProfileId,
        },
        orderBy: {
          section: {
            sectionOrder: "asc",
          },
        },
        include: {
          section: true,
        },
      }),
      prisma.response.findMany({
        where: {
          testId,
          profileId: targetProfileId,
        },
        orderBy: [
          { sectionOrder: "asc" },
          { responseOrder: "asc" },
        ],
      }),
      Promise.all(
        metadata.sections.map((s) =>
          getSectionById(rawCategory.toLowerCase(), testId, s.id)
        )
      ),
    ]);

  if (sectionResultRecords.length === 0) {
    if (isStaffInspection) {
      notFound();
    }
    const firstSectionId = metadata.sections[0]?.id;
    if (firstSectionId) {
      redirect(`/tests/${rawCategory.toLowerCase()}/${testId}/${firstSectionId}`);
    }
    notFound();
  }

  // Index questions and passage stimuli
  const questionMap = new Map<string, { question: QuestionFrontmatter; passageText?: string }>();
  for (const secData of sectionFiles) {
    if (secData?.frontmatter?.questions) {
      const sectionPassage = secData.content || "";
      for (const q of secData.frontmatter.questions) {
        questionMap.set(q.id, {
          question: q,
          passageText: q.stimulus || (q as any).passage || sectionPassage || "",
        });
      }
    }
  }

  // Enrich database responses with parsed frontmatter
  const enrichedResponses: EnrichedResponseItem[] = userResponseRecords.map((r) => {
    const entry = questionMap.get(r.questionId);
    const qMeta = entry?.question;
    return {
      id: r.id,
      questionId: r.questionId,
      responseOrder: r.responseOrder,
      sectionOrder: r.sectionOrder,
      sectionId: r.sectionId,
      responseType: r.responseType as QuestionType,
      selectedOptionId: r.selectedOptionId,
      frqUserAnswer: r.frqUserAnswer,
      correctAnswerKey: r.correctAnswerKey,
      isCorrect: r.isCorrect,
      timeSpentOnResponse: r.timeSpentOnResponse ?? 0,
      usedCalculator: r.usedCalculator,
      changedAnswer: r.changedAnswer,
      prompt: qMeta?.prompt ?? "",
      passageText: entry?.passageText || null,
      options: qMeta?.options ?? [],
      domain: qMeta?.domain ?? "General",
      skill: qMeta?.skill ?? "General",
      difficulty: qMeta?.difficulty ?? "Medium",
      explanation: qMeta?.explanation ?? "",
    };
  });

  const formattedSectionResults: SectionResultData[] = sectionResultRecords.map((sr) => ({
    id: sr.id,
    sectionId: sr.sectionId,
    testTitle: sr.testTitle,
    numCorrect: sr.numCorrect,
    totalQuestions: sr.totalQuestions,
    rawScore: sr.rawScore,
    scaledScore: sr.scaledScore,
    timeRemainingSeconds: sr.timeRemainingSeconds,
    navigationHistory: Array.isArray(sr.navigationHistory)
      ? (sr.navigationHistory as { time: number; qIdx: number }[])
      : null,
    section: {
      id: sr.section.id,
      title: sr.section.title,
      sectionOrder: sr.section.sectionOrder,
      timeLimit: sr.section.timeLimit,
    },
  }));

  const formattedTestSummary: TestSummaryData | null = testSummaryRecord
    ? {
        id: testSummaryRecord.id,
        testId: testSummaryRecord.testId,
        testTitle: testSummaryRecord.testTitle,
        category: testSummaryRecord.category,
        compositeScore: testSummaryRecord.compositeScore,
        percentile: testSummaryRecord.percentile,
        completedAt: testSummaryRecord.completedAt,
      }
    : null;

  let adaptiveTrajectory: AdaptiveTrajectoryData | null = null;
  if (metadata.isAdaptive) {
    const resultsMap = new Map<string, { numCorrect: number; totalQuestions: number }>();
    sectionResultRecords.forEach((sr) => {
      resultsMap.set(sr.sectionId, {
        numCorrect: sr.numCorrect,
        totalQuestions: sr.totalQuestions,
      });
    });
    adaptiveTrajectory = synthesizeAdaptiveTestScores(metadata, resultsMap);
  }

  return (
    <TestAnalyticsClient
      metadata={metadata}
      testSummary={formattedTestSummary}
      sectionResults={formattedSectionResults}
      responses={enrichedResponses}
      adaptiveTrajectory={adaptiveTrajectory}
    />
  );
}

export default async function ResultsPage({ params, searchParams }: ResultsPageProps) {
  const [{ category: rawCategory, testId }, { studentId }] = await Promise.all([
    params,
    searchParams,
  ]);

  const categoryEnum = parseCategorySlug(rawCategory);
  if (!categoryEnum || categoryEnum === Category.NONE) {
    notFound();
  }

  // 1. Authenticate user synchronously before entering Suspense
  const session = await auth();
  if (!session?.user?.id) {
    const callbackTarget = studentId
      ? `/tests/${rawCategory}/${testId}/results?studentId=${studentId}`
      : `/tests/${rawCategory}/${testId}/results`;
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackTarget)}`);
  }

  // 2. Resolve target student and verify tenancy
  let targetProfileId = session.user.id;
  let isStaffInspection = false;
  let inspectedStudentInfo: { id: string; name: string; email: string } | null = null;

  if (studentId && studentId !== session.user.id) {
    const userRole = session.user.role as Role;
    const allowedStaffRoles: Role[] = [Role.ORG_ADMIN, Role.TUTOR, Role.ADMIN];

    if (!allowedStaffRoles.includes(userRole)) {
      redirect(`/tests/${rawCategory.toLowerCase()}/${testId}/results`);
    }

    const studentProfile = await prisma.profile.findUnique({
      where: { id: studentId },
      select: { id: true, firstName: true, lastName: true, email: true, orgId: true },
    });

    if (!studentProfile) {
      notFound();
    }

    // Compound Tenancy Check: Admin OR shared organization OR active peer mentorship link
    if (userRole !== Role.ADMIN) {
      const sharesOrg =
        Boolean(session.user.orgId) &&
        Boolean(studentProfile.orgId) &&
        session.user.orgId === studentProfile.orgId;

      const hasActiveMentorshipLink = await prisma.tutorStudentLink.findFirst({
        where: {
          tutorId: session.user.id,
          studentId: studentProfile.id,
          status: LinkStatus.ACTIVE,
        },
      });

      if (!sharesOrg && !hasActiveMentorshipLink) {
        redirect("/tgadmin?error=unauthorized_student_access");
      }
    }

    targetProfileId = studentProfile.id;
    isStaffInspection = true;
    inspectedStudentInfo = {
      id: studentProfile.id,
      name: `${studentProfile.firstName} ${studentProfile.lastName}`.trim() || studentProfile.email,
      email: studentProfile.email,
    };
  }

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col"
      style={{ scrollbarGutter: "stable" }}
    >
      {/* 
        The Navigation Header is mounted OUTSIDE Suspense.
        It renders immediately on initial paint and never flickers, shifts, or unmounts.
      */}
      {isStaffInspection && inspectedStudentInfo ? (
        <StaffInspectionBar student={inspectedStudentInfo} />
      ) : (
        <StudentNavbar
          user={{ name: session.user.name, email: session.user.email }}
          onSignOut={handleSignOut}
        />
      )}

      {/* Analytics Content wrapped in the matching height skeleton */}
      <div className="flex-1">
        <Suspense fallback={<AnalyticsLoadingSkeleton />}>
          <ResultsDataContent
            rawCategory={rawCategory}
            testId={testId}
            targetProfileId={targetProfileId}
            isStaffInspection={isStaffInspection}
          />
        </Suspense>
      </div>
    </div>
  );
}