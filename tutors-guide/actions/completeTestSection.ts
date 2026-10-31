// actions/completeTestSection.ts
"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateAnswer } from "@/lib/scoring/mathEvaluator";
import { QuestionFrontmatter } from "@/types/content";
import { getTestMetadata } from "@/lib/contentLoader";
import { evaluateNextExamRoute } from "@/lib/adaptive/branchingController";
import {
  calculateSectionScaledScore,
  synthesizeExamComposite,
} from "@/lib/scoring/scoringEngine";
import { Category, Prisma, QuestionType } from "@prisma/client";
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

/**
 * Derives the total dwell time spent per question by computing the duration 
 * of each interval in navigationHistory up to the final elapsed section time.
 */
function deriveTimeSpentFromNavigationHistory(
  navHistory: { time: number; qIdx: number }[],
  totalElapsedSeconds: number,
  totalQuestions: number
): number[] {
  const result = new Array(totalQuestions).fill(0);
  if (!navHistory || navHistory.length === 0) return result;

  for (let i = 0; i < navHistory.length; i++) {
    const current = navHistory[i];
    const nextTime =
      i + 1 < navHistory.length ? navHistory[i + 1].time : totalElapsedSeconds;

    const dwell = Math.max(0, nextTime - current.time);
    if (current.qIdx >= 0 && current.qIdx < totalQuestions) {
      result[current.qIdx] += dwell;
    }
  }

  return result;
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

    // 2. Fetch test metadata upfront for scoring and routing
    const metadata = await getTestMetadata(category.toLowerCase(), testId);
    if (!metadata) {
      throw new Error("Unable to resolve test metadata for scoring and routing.");
    }

    // 3. Fetch optical FRQ submissions & crops for this student in this section
    const frqSubmissions = await prisma.frqSubmission.findMany({
      where: {
        profileId,
        testId,
        sectionId,
      },
      include: {
        crops: true,
      },
    });

    // Map questionId -> { pointsEarned, pointsPossible, transcriptions[] }
    const frqScoreMap = new Map<
      string,
      { earned: number; possible: number; transcriptions: string[] }
    >();

    for (const sub of frqSubmissions) {
      const earned = sub.crops.reduce((acc, c) => acc + (c.pointsAwarded || 0), 0);
      const possible = sub.crops.reduce((acc, c) => acc + (c.pointsPossible || 1), 0);
      const pageTranscriptions = sub.crops
        .map((c) => (c.transcription ? `[Part ${c.subPartLabel}]: ${c.transcription}` : null))
        .filter((t): t is string => Boolean(t));

      const existing = frqScoreMap.get(sub.questionId);
      if (existing) {
        existing.earned += earned;
        existing.possible += possible;
        existing.transcriptions.push(...pageTranscriptions);
      } else {
        frqScoreMap.set(sub.questionId, {
          earned,
          possible,
          transcriptions: pageTranscriptions,
        });
      }
    }

    // 4. Derive question dwell times strictly from navigationHistory timeline
    const matchedSectionMeta = metadata.sections.find((s) => s.id === sectionId);
    const baseTimeLimit = matchedSectionMeta?.timeLimit ?? 0;
    const timeMultiplier = accommodations?.timeMultiplier ?? 1.0;
    const effectiveTotalLimit = Math.round(baseTimeLimit * timeMultiplier);
    const totalElapsedSeconds = Math.max(0, effectiveTotalLimit - timeRemainingSeconds);

    const computedDwellTimes = deriveTimeSpentFromNavigationHistory(
      navigationHistory,
      totalElapsedSeconds,
      questions.length
    );

    // 5. Finalize all response records
    let numCorrect = 0;
    let totalEarnedRawScore = 0;

    await Promise.all(
      questions.map(async (q, idx) => {
        const student = clientAnswers[q.id];
        let isCorrect = false;

        const isHandwrittenFrq =
          q.questionType === "FRQ_HANDWRITTEN" || frqScoreMap.has(q.id);

        if (isHandwrittenFrq && frqScoreMap.has(q.id)) {
          const frqData = frqScoreMap.get(q.id)!;
          // Full question credit if student earns maximum possible points across all parts
          isCorrect = frqData.earned >= frqData.possible && frqData.possible > 0;
          totalEarnedRawScore += frqData.earned;
          if (isCorrect) numCorrect++;
        } else {
          const standardType = q.questionType === "MC" ? "MC" : "FR";
          isCorrect = evaluateAnswer(
            standardType,
            q.questionType === "MC" ? student?.selectedOptionId : student?.frqUserAnswer,
            q.correctAnswer
          );
          if (isCorrect) {
            numCorrect++;
            totalEarnedRawScore += 1;
          }
        }

        const frqData = frqScoreMap.get(q.id);
        const aggregatedTranscription =
          frqData && frqData.transcriptions.length > 0
            ? frqData.transcriptions.join(" | ")
            : null;

        const resolvedFrqAnswer =
          aggregatedTranscription ?? student?.frqUserAnswer ?? null;

        const resolvedResponseType: QuestionType = isHandwrittenFrq
          ? QuestionType.FRQ_HANDWRITTEN
          : (q.questionType as unknown as QuestionType);

        const normalizedCorrectAnswerKey = String(q.correctAnswer ?? "").trim();
        const finalTimeSpent = computedDwellTimes[idx] ?? 0;

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
            responseType: resolvedResponseType,
            selectedOptionId: student?.selectedOptionId ?? null,
            frqUserAnswer: resolvedFrqAnswer,
            correctAnswerKey: normalizedCorrectAnswerKey,
            isCorrect,
            timeSpentOnResponse: finalTimeSpent,
            usedCalculator: student?.usedCalculator ?? false,
            changedAnswer: student?.changedAnswer ?? false,
          },
          update: {
            responseType: resolvedResponseType,
            selectedOptionId: student?.selectedOptionId ?? null,
            frqUserAnswer: resolvedFrqAnswer,
            correctAnswerKey: normalizedCorrectAnswerKey,
            isCorrect,
            timeSpentOnResponse: finalTimeSpent,
            usedCalculator: student?.usedCalculator ?? undefined,
            changedAnswer: student?.changedAnswer ?? undefined,
          },
        });
      })
    );

    // 6. Calculate section-level scaled score via the Scoring Engine
    const roundedRawScore = Math.round(totalEarnedRawScore);
    const scaledScore = calculateSectionScaledScore(sectionId, roundedRawScore, metadata);

    // 7a. Persist the immutable Result row with scaledScore
    const totalQuestions = questions.length;
    await prisma.result.create({
      data: {
        profileId,
        testId,
        sectionId,
        testTitle,
        numCorrect,
        totalQuestions,
        rawScore: roundedRawScore,
        scaledScore,
        timeRemainingSeconds,
        navigationHistory: navigationHistory as unknown as Prisma.InputJsonValue,
        accommodations: accommodations
          ? (accommodations as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });

    // 7b. Clean up in-flight SectionCheckpoint (draft has completed)
    await prisma.sectionCheckpoint.deleteMany({
      where: {
        profileId,
        testId,
        sectionId,
      },
    });

    // 8. Resolve next exam route (linear or adaptive branching)
    const submittedResults = await prisma.result.findMany({
      where: { testId, profileId },
      select: {
        sectionId: true,
        numCorrect: true,
        totalQuestions: true,
        rawScore: true,
      },
    });

    const submittedSectionIds = submittedResults.map((r) => r.sectionId);

    const routingDecision = evaluateNextExamRoute(
      metadata,
      sectionId,
      numCorrect,
      submittedSectionIds
    );

    // 9. If an intermission follows this section, set the HTTP-only server cookie
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

    // 10. Synthesize full exam composite score if complete across all stages
    if (routingDecision.isTestComplete) {
      const synthesis = synthesizeExamComposite(metadata, submittedResults);

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
          compositeScore: synthesis.compositeScore,
        },
        update: {
          compositeScore: synthesis.compositeScore,
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
        rawScore: roundedRawScore,
        scaledScore,
      },
    };
  } catch (error) {
    console.error("Error finalizing section:", error);
    return { success: false, error: "Database transaction failed." };
  }
}