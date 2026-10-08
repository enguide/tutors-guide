"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuestionType } from "@prisma/client";

export interface AutosavePayload {
  testId: string;
  sectionId: string;
  questionId: string;
  sectionOrder: number;
  responseOrder: number;
  responseType: QuestionType;
  selectedOptionId?: string | null;
  frqUserAnswer?: string | null;
  correctAnswerKey: string;
  timeSpentOnResponse?: number;
  usedCalculator?: boolean;
}

export async function autosaveResponse(payload: AutosavePayload) {
  const session = await auth();
  const profileId = session?.user?.id;

  if (!profileId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const isCorrect =
      payload.responseType === "MC"
        ? (payload.selectedOptionId ?? "").trim().toUpperCase() ===
          payload.correctAnswerKey.trim().toUpperCase()
        : (payload.frqUserAnswer ?? "").trim().toLowerCase() ===
          payload.correctAnswerKey.trim().toLowerCase();

    // Check existing record to update `changedAnswer` telemetry
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
      },
    });

    const hasChangedAnswer = existing
      ? payload.responseType === "MC"
        ? existing.selectedOptionId !== payload.selectedOptionId
        : existing.frqUserAnswer !== payload.frqUserAnswer
      : false;

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
        correctAnswerKey: payload.correctAnswerKey,
        isCorrect,
        timeSpentOnResponse: payload.timeSpentOnResponse ?? 0,
        usedCalculator: payload.usedCalculator ?? false,
        changedAnswer: hasChangedAnswer,
      },
      update: {
        selectedOptionId: payload.selectedOptionId ?? null,
        frqUserAnswer: payload.frqUserAnswer ?? null,
        isCorrect,
        timeSpentOnResponse: {
          increment: payload.timeSpentOnResponse ?? 0,
        },
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