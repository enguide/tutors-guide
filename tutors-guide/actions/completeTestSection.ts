// actions/completeTestSection.ts
"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateAnswer } from "@/lib/scoring/mathEvaluator";
import { QuestionFrontmatter } from "@/types/content";
import { DEFAULT_SAT_CURVE, lookupScaledScore } from "@/lib/scoring/curveEngine";
import { getTestMetadata } from "@/lib/contentLoader";
import { evaluateNextExamRoute } from "@/lib/adaptive/branchingController";
import { synthesizeAdaptiveTestScores } from "@/lib/scoring/adaptiveScorer";
import { Category, Prisma } from "@prisma/client";
import { AccommodationSettings } from "@/types/accommodations";

interface CompleteSectionPayload {
  testId: string;
  testTitle: string;
  category: Category;
  sectionId: string;
  sectionOrder: number;
  timeRemainingSeconds: number;
  navigationHistory: { time: number; qIdx: number }[];
  questions: QuestionFrontmatter[];
  clientAnswers: Record<
    string,
    {
      selectedOptionId?: string;
      frqUserAnswer?: string;
      usedCalculator?: boolean;
      changedAnswer?: boolean;
      timeSpent?: number;
    }
  >;
  accommodations?: AccommodationSettings;
}

export async function completeTestSection(payload: CompleteSectionPayload) {
  const session = await auth();
  const profileId = session?.user?.id;
  const userRole = session?.user?.role;

  if (!profileId) {
    return { success: false, error: "Unauthorized" };
  }

  if (userRole !== "STUDENT") {
    return {
      success: false,
      error: "Instructional staff accounts are barred from submitting exam attempts.",
    };
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
    accommodations,
  } = payload;

  try {
    // 1. Strict one-way guard: Verify section has not already been finalized
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

    // 3a. Persist the immutable Result row
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
        navigationHistory: navigationHistory as unknown as Prisma.InputJsonValue,
        accommodations: accommodations
          ? (accommodations as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });

    // 3b. Clean up in-flight SectionCheckpoint (draft has completed)
    await prisma.sectionCheckpoint.deleteMany({
      where: {
        profileId,
        testId,
        sectionId,
      },
    });

    // 4. Resolve next exam route (linear or adaptive branching)
    const metadata = await getTestMetadata(category.toLowerCase(), testId);
    if (!metadata) {
      throw new Error("Unable to resolve test metadata for routing.");
    }

    const submittedResults = await prisma.result.findMany({
      where: { testId, profileId },
      select: { sectionId: true, numCorrect: true, totalQuestions: true },
    });

    const submittedSectionIds = submittedResults.map((r) => r.sectionId);

    const routingDecision = evaluateNextExamRoute(
      metadata,
      sectionId,
      numCorrect,
      submittedSectionIds
    );

    // 5. If an intermission follows this section, set the HTTP-only server cookie
    if (routingDecision.isIntermission) {
      const duration = routingDecision.intermissionDuration || 600;
      const breakEndsAt = Date.now() + duration * 1000;

      const cookieStore = await cookies();
      cookieStore.set(`break_${testId}`, breakEndsAt.toString(), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: duration,
      });
    }

    // 6. Check whether the full exam is completed across all stages
    if (routingDecision.isTestComplete) {
      let compositeScore: number | null = null;

      const resultsMap = new Map<string, { numCorrect: number; totalQuestions: number }>();
      submittedResults.forEach((r) => {
        resultsMap.set(r.sectionId, {
          numCorrect: r.numCorrect,
          totalQuestions: r.totalQuestions,
        });
      });

      if (metadata.isAdaptive) {
        const adaptiveSynthesis = synthesizeAdaptiveTestScores(metadata, resultsMap);
        compositeScore = adaptiveSynthesis.compositeScore;
      } else if (category === "SAT") {
        const totalCorrect = submittedResults.reduce((acc, r) => acc + r.numCorrect, 0);
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
      nextSectionId: routingDecision.nextSectionId,
      isIntermission: routingDecision.isIntermission,
      intermissionDuration: routingDecision.intermissionDuration,
      isTestComplete: routingDecision.isTestComplete,
      tierSelected: routingDecision.tierSelected,
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