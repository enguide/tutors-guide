// actions/autosave.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateAnswer } from "@/lib/scoring/mathEvaluator";
import { Prisma, QuestionType } from "@prisma/client";

export interface AutosavePayload {
  testId: string;
  sectionId: string;
  questionId: string;
  sectionOrder: number;
  responseOrder: number;
  responseType: QuestionType;
  selectedOptionId?: string | null;
  frqUserAnswer?: string | null;
  correctAnswerKey: string | number;
  timeSpentOnResponse?: number;
  usedCalculator?: boolean;
}

export interface CheckpointPayload {
  testId: string;
  sectionId: string;
  timeRemainingSeconds: number;
  lastQuestionIndex: number;
  navigationHistory?: { time: number; qIdx: number }[];
  clientUpdatedAt?: number;
}

export async function saveSectionCheckpoint(payload: CheckpointPayload) {
  const session = await auth();
  const profileId = session?.user?.id;

  if (!profileId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const clientDate = payload.clientUpdatedAt
      ? new Date(payload.clientUpdatedAt)
      : new Date();

    await prisma.sectionCheckpoint.upsert({
      where: {
        profileId_testId_sectionId: {
          profileId,
          testId: payload.testId,
          sectionId: payload.sectionId,
        },
      },
      create: {
        profileId,
        testId: payload.testId,
        sectionId: payload.sectionId,
        timeRemainingSeconds: Math.max(0, Math.round(payload.timeRemainingSeconds)),
        lastQuestionIndex: payload.lastQuestionIndex,
        navigationHistory: payload.navigationHistory
          ? (payload.navigationHistory as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        clientUpdatedAt: clientDate,
      },
      update: {
        timeRemainingSeconds: Math.max(0, Math.round(payload.timeRemainingSeconds)),
        lastQuestionIndex: payload.lastQuestionIndex,
        navigationHistory: payload.navigationHistory
          ? (payload.navigationHistory as unknown as Prisma.InputJsonValue)
          : undefined,
        clientUpdatedAt: clientDate,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Save section checkpoint error:", error);
    return { success: false, error: "Checkpoint upsert failed" };
  }
}

export async function autosaveResponse(payload: AutosavePayload) {
  const session = await auth();
  const profileId = session?.user?.id;

  if (!profileId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const normalizedCorrectKey = String(payload.correctAnswerKey ?? "").trim();
    const studentAnswer =
      payload.responseType === "MC"
        ? payload.selectedOptionId
        : payload.frqUserAnswer;

    // Only run math evaluation for MC and typed FR questions
    let isCorrect = false;
    if (payload.responseType === "MC" || payload.responseType === "FR") {
      isCorrect = evaluateAnswer(
        payload.responseType,
        studentAnswer,
        payload.correctAnswerKey
      );
    }

    const existing = await prisma.response.findUnique({
      where: {
        profileId_questionId: {
          profileId,
          questionId: payload.questionId,
        },
      },
      select: {
        selectedOptionId: true,
        frqUserAnswer: true,
        timeSpentOnResponse: true,
      },
    });

    const hasChangedAnswer = existing
      ? payload.responseType === "MC"
        ? existing.selectedOptionId !== payload.selectedOptionId
        : existing.frqUserAnswer !== payload.frqUserAnswer
      : false;

    // Preserve monotonic time increments across queued or out-of-order network calls
    const incomingTimeSpent = payload.timeSpentOnResponse ?? 0;
    const resolvedTimeSpent = existing
      ? Math.max(existing.timeSpentOnResponse ?? 0, incomingTimeSpent)
      : incomingTimeSpent;

    await prisma.response.upsert({
      where: {
        profileId_questionId: {
          profileId,
          questionId: payload.questionId,
        },
      },
      create: {
        profileId,
        testId: payload.testId,
        sectionId: payload.sectionId,
        questionId: payload.questionId,
        sectionOrder: payload.sectionOrder,
        responseOrder: payload.responseOrder,
        responseType: payload.responseType,
        selectedOptionId: payload.selectedOptionId ?? null,
        frqUserAnswer: payload.frqUserAnswer ?? null,
        correctAnswerKey: normalizedCorrectKey,
        isCorrect,
        timeSpentOnResponse: resolvedTimeSpent,
        usedCalculator: payload.usedCalculator ?? false,
        changedAnswer: hasChangedAnswer,
      },
      update: {
        selectedOptionId: payload.selectedOptionId ?? null,
        frqUserAnswer: payload.frqUserAnswer ?? null,
        correctAnswerKey: normalizedCorrectKey,
        isCorrect,
        timeSpentOnResponse: resolvedTimeSpent,
        usedCalculator: payload.usedCalculator ?? undefined,
        changedAnswer: hasChangedAnswer ? true : undefined,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Autosave response error:", error);
    return { success: false, error: "Database upsert failed" };
  }
}