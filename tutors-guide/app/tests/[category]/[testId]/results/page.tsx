/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tests/[category]/[testId]/results/page.tsx
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTestMetadata, getSectionById } from "@/lib/contentLoader";
import { synthesizeAdaptiveTestScores } from "@/lib/scoring/adaptiveScorer";
import { TestAnalyticsClient } from "@/components/analytics/TestAnalyticsClient";
import { Category, QuestionType, Role } from "@prisma/client";
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

async function ResultsContent({
  paramsPromise,
  searchParamsPromise,
}: {
  paramsPromise: Promise<{ category: string; testId: string }>;
  searchParamsPromise: Promise<{ studentId?: string }>;
}) {
  await connection();

  const [{ category: rawCategory, testId }, { studentId }] = await Promise.all([
    paramsPromise,
    searchParamsPromise,
  ]);

  const categoryEnum = parseCategorySlug(rawCategory);
  if (!categoryEnum || categoryEnum === Category.NONE) {
    notFound();
  }

  // 1. Authenticate user
  const session = await auth();
  if (!session?.user?.id) {
    const callbackTarget = studentId
      ? `/tests/${rawCategory}/${testId}/results?studentId=${studentId}`
      : `/tests/${rawCategory}/${testId}/results`;
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackTarget)}`);
  }

  // 2. Resolve target profile and enforce multi-tenant isolation
  let targetProfileId = session.user.id;
  let isStaffInspection = false;

  if (studentId && studentId !== session.user.id) {
    const userRole = session.user.role as Role;
    const allowedStaffRoles: Role[] = [Role.ORG_ADMIN, Role.TUTOR, Role.ADMIN];

    if (!allowedStaffRoles.includes(userRole)) {
      redirect(`/tests/${rawCategory.toLowerCase()}/${testId}/results`);
    }

    const studentProfile = await prisma.profile.findUnique({
      where: { id: studentId },
      select: { id: true, orgId: true, schoolId: true },
    });

    if (!studentProfile) {
      notFound();
    }

    // Strict tenancy verification for non-superadmins
    if (userRole !== Role.ADMIN) {
      const sharesOrg =
        Boolean(session.user.orgId) &&
        Boolean(studentProfile.orgId) &&
        session.user.orgId === studentProfile.orgId;

      if (!sharesOrg) {
        redirect("/tgadmin?error=unauthorized_student_access");
      }
    }

    targetProfileId = studentProfile.id;
    isStaffInspection = true;
  }

  // 3. Fetch test metadata from filesystem
  const metadata = await getTestMetadata(rawCategory.toLowerCase(), testId);
  if (!metadata) {
    notFound();
  }

  // 4. Fetch target student's results, responses, and section markdown stimuli
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

  // 5. Index questions and passages from parsed markdown sections
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

  // 6. Enrich database responses with question frontmatter
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

  // 7. Shape section results
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

  // 8. Shape test summary
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

  // 9. Compute adaptive trajectory data if test is adaptive
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

function ResultsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 space-y-6 animate-pulse">
      <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-none" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-none" />
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-none" />
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-none" />
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-none" />
      </div>
      <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-none" />
    </div>
  );
}

export default function ResultsPage({ params, searchParams }: ResultsPageProps) {
  return (
    <Suspense fallback={<ResultsLoadingSkeleton />}>
      <ResultsContent
        paramsPromise={params}
        searchParamsPromise={searchParams}
      />
    </Suspense>
  );
}