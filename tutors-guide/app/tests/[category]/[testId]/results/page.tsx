/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tests/[category]/[testId]/results/page.tsx
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTestMetadata, getSectionById } from "@/lib/contentLoader";
import { TestAnalyticsClient } from "@/components/analytics/TestAnalyticsClient";
import { Category, QuestionType } from "@prisma/client";
import { QuestionFrontmatter } from "@/types/content";
import { EnrichedResponseItem, SectionResultData, TestSummaryData } from "@/types/analytics";

interface ResultsPageProps {
  params: Promise<{
    category: string;
    testId: string;
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
}: {
  paramsPromise: Promise<{ category: string; testId: string }>;
}) {
  const { category: rawCategory, testId } = await paramsPromise;

  const categoryEnum = parseCategorySlug(rawCategory);
  if (!categoryEnum || categoryEnum === Category.NONE) {
    notFound();
  }

  // 1. Authenticate user
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/tests/${rawCategory}/${testId}/results`);
  }

  const profileId = session.user.id;

  // 2. Fetch metadata
  const metadata = await getTestMetadata(rawCategory.toLowerCase(), testId);
  if (!metadata) {
    notFound();
  }

  // 3. Fetch user results, responses, and section files concurrently
  const [testSummaryRecord, sectionResultRecords, userResponseRecords, sectionFiles] =
    await Promise.all([
      prisma.testSummary.findUnique({
        where: {
          testId_profileId: {
            testId,
            profileId,
          },
        },
      }),
      prisma.result.findMany({
        where: {
          testId,
          profileId,
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
          profileId,
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
    const firstSectionId = metadata.sections[0]?.id;
    if (firstSectionId) {
      redirect(`/tests/${rawCategory.toLowerCase()}/${testId}/${firstSectionId}`);
    }
    notFound();
  }

  // 4. Index questions from parsed markdown sections
  const questionMap = new Map<string, { question: QuestionFrontmatter; passageText?: string }>();
  for (const secData of sectionFiles) {
    if (secData?.frontmatter?.questions) {
      const sectionPassage = secData.content || "";
      for (const q of secData.frontmatter.questions) {
        questionMap.set(q.id, {
          question: q,
          passageText: (q as any).passage || sectionPassage || "",
        });
      }
    }
  }

  // 5. Enrich database responses with question frontmatter
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
      passageText: entry?.passageText || null, // <--- PASS DOWN PASSAGE
      options: qMeta?.options ?? [],
      domain: qMeta?.domain ?? "General",
      skill: qMeta?.skill ?? "General",
      difficulty: qMeta?.difficulty ?? "Medium",
      explanation: qMeta?.explanation ?? "",
    };
  });

  // 6. Shape section results
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

  // 7. Shape test summary
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

  return (
    <TestAnalyticsClient
      metadata={metadata}
      testSummary={formattedTestSummary}
      sectionResults={formattedSectionResults}
      responses={enrichedResponses}
    />

  );
}

function ResultsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 space-y-6 animate-pulse">
      <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
      <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
    </div>
  );
}

export default function ResultsPage({ params }: ResultsPageProps) {
  return (
    <Suspense fallback={<ResultsLoadingSkeleton />}>
      <ResultsContent paramsPromise={params} />
    </Suspense>
  );
}