// actions/completeTestSection.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateAnswer } from "@/lib/scoring/mathEvaluator";
import { QuestionFrontmatter } from "@/types/content";
import { DEFAULT_SAT_CURVE, lookupScaledScore } from "@/lib/scoring/curveEngine";
import { Category } from "@prisma/client";

interface CompleteSectionPayload {
  testId: string;
  testTitle: string;
  category: Category;
  sectionId: string;
  sectionOrder: number;
  timeRemainingSeconds: number;
  navigationHistory: { time: number; qIdx: number }[];
  questions: QuestionFrontmatter[];
  clientAnswers: Record<string, {
    selectedOptionId?: string;
    frqUserAnswer?: string;
    usedCalculator?: boolean;
    changedAnswer?: boolean;
    timeSpent?: number;
  }>;
}

export async function completeTestSection(payload: CompleteSectionPayload) {
  const session = await auth();
  const profileId = session?.user?.id;

  if (!profileId) {
    return { success: false, error: "Unauthorized" };
  }

  const {
    testId,
    testTitle,
    category,
    sectionId,
    sectionOrder,
    timeRemainingSeconds,
    navigationHistory,
    questions,
    clientAnswers,
  } = payload;

  try {
    // 1. Enforce one-and-done: Check if this section was already finalized
    const existingResult = await prisma.result.findUnique({
      where: {
        testId_profileId_sectionId: {
          testId,
          profileId,
          sectionId,
        },
      },
    });

    if (existingResult) {
      return { success: false, error: "Section already submitted." };
    }

    // 2. Finalize all response records
    let numCorrect = 0;

    await Promise.all(
      questions.map(async (q) => {
        const student = clientAnswers[q.id];
        const isCorrect = evaluateAnswer(
          q.questionType,
          q.questionType === "MC" ? student?.selectedOptionId : student?.frqUserAnswer,
          q.correctAnswer
        );

        if (isCorrect) numCorrect++;

        return prisma.response.upsert({
          where: {
            profileId_questionId: {
              profileId,
              questionId: q.id,
            },
          },
          create: {
            profileId,
            testId,
            sectionId,
            questionId: q.id,
            sectionOrder,
            responseOrder: q.questionNumber,
            responseType: q.questionType,
            selectedOptionId: student?.selectedOptionId ?? null,
            frqUserAnswer: student?.frqUserAnswer ?? null,
            correctAnswerKey: q.correctAnswer,
            isCorrect,
            timeSpentOnResponse: student?.timeSpent ?? 0,
            usedCalculator: student?.usedCalculator ?? false,
            changedAnswer: student?.changedAnswer ?? false,
          },
          update: {
  selectedOptionId: student?.selectedOptionId ?? null,
  frqUserAnswer: student?.frqUserAnswer ?? null,
  isCorrect,
  timeSpentOnResponse: student?.timeSpent ?? 0,
  usedCalculator: student?.usedCalculator ?? undefined,
  changedAnswer: student?.changedAnswer ?? undefined,
},
        });
      })
    );

    // 3. Persist the immutable section Result
    const totalQuestions = questions.length;

    await prisma.result.create({
      data: {
        profileId,
        testId,
        sectionId,
        testTitle,
        numCorrect,
        totalQuestions,
        rawScore: numCorrect,
        timeRemainingSeconds,
        navigationHistory,
      },
    });

    // 4. Check if the test is fully completed across all sections
    const testRecord = await prisma.test.findUnique({
      where: { id: testId },
      include: { sections: true },
    });

    const allSections = testRecord?.sections || [];
    const submittedResults = await prisma.result.findMany({
      where: { testId, profileId },
    });

    const isTestComplete =
      allSections.length > 0 && submittedResults.length === allSections.length;

    // 5. If all sections are finished, compute and persist the immutable TestSummary
    if (isTestComplete) {
      let compositeScore: number | null = null;

      if (category === "SAT") {
        // Look up scaled scores using the scoring curves
        const totalCorrect = submittedResults.reduce((acc, r) => acc + r.numCorrect, 0);
        // Compute math & verbal partitions based on section assignments
        compositeScore = lookupScaledScore(DEFAULT_SAT_CURVE.sectionCurves.English, totalCorrect);
      }

      await prisma.testSummary.upsert({
        where: {
          testId_profileId: {
            testId,
            profileId,
          },
        },
        create: {
          profileId,
          testId,
          testTitle,
          category,
          compositeScore,
        },
        update: {
          compositeScore,
        },
      });
    }

    return {
      success: true,
      isTestComplete,
      stats: {
        numCorrect,
        totalQuestions,
      },
    };
  } catch (error) {
    console.error("Error finalizing section:", error);
    return { success: false, error: "Database transaction failed." };
  }
}