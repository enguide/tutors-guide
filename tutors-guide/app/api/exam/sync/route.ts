// app/api/exam/sync/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateAnswer } from "@/lib/scoring/mathEvaluator";
import { Prisma, QuestionType } from "@prisma/client";
import { AccommodationSettings } from "@/types/accommodations";

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
  accommodations?: AccommodationSettings;
  clientUpdatedAt?: number;
}

interface ExamSyncRequestBody {
  response?: AutosavePayload;
  checkpoint?: CheckpointPayload;
}

export async function POST(req: Request) {
  const session = await auth();
  const profileId = session?.user?.id;

  if (!profileId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: ExamSyncRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const { response: responsePayload, checkpoint: checkpointPayload } = body;

  if (!responsePayload && !checkpointPayload) {
    return NextResponse.json({ success: true });
  }

  const testId = responsePayload?.testId ?? checkpointPayload!.testId;
  const sectionId = responsePayload?.sectionId ?? checkpointPayload!.sectionId;

  try {
    // 1. Guard: Reject writes if the section has already been finalized
    const existingResult = await prisma.result.findUnique({
      where: {
        testId_profileId_sectionId: {
          testId,
          profileId,
          sectionId,
        },
      },
      select: { id: true },
    });

    if (existingResult) {
      return NextResponse.json(
        { success: false, error: "Section already submitted; sync rejected." },
        { status: 409 }
      );
    }

    const operations: Prisma.PrismaPromise<unknown>[] = [];

    // 2. Prepare Response Upsert (if included)
    if (responsePayload) {
      const normalizedCorrectKey = String(responsePayload.correctAnswerKey ?? "").trim();
      const studentAnswer =
        responsePayload.responseType === "MC"
          ? responsePayload.selectedOptionId
          : responsePayload.frqUserAnswer;

      let isCorrect = false;
      if (responsePayload.responseType === "MC" || responsePayload.responseType === "FR") {
        isCorrect = evaluateAnswer(
          responsePayload.responseType,
          studentAnswer,
          responsePayload.correctAnswerKey
        );
      }

      const existingResponse = await prisma.response.findUnique({
        where: {
          profileId_questionId: {
            profileId,
            questionId: responsePayload.questionId,
          },
        },
        select: {
          selectedOptionId: true,
          frqUserAnswer: true,
          timeSpentOnResponse: true,
        },
      });

      const hasChangedAnswer = existingResponse
        ? responsePayload.responseType === "MC"
          ? existingResponse.selectedOptionId !== responsePayload.selectedOptionId
          : existingResponse.frqUserAnswer !== responsePayload.frqUserAnswer
        : false;

      // Preserve monotonic time increments across queued or out-of-order network calls
      const incomingTimeSpent = responsePayload.timeSpentOnResponse ?? 0;
      const resolvedTimeSpent = existingResponse
        ? Math.max(existingResponse.timeSpentOnResponse ?? 0, incomingTimeSpent)
        : incomingTimeSpent;

      operations.push(
        prisma.response.upsert({
          where: {
            profileId_questionId: {
              profileId,
              questionId: responsePayload.questionId,
            },
          },
          create: {
            profileId,
            testId: responsePayload.testId,
            sectionId: responsePayload.sectionId,
            questionId: responsePayload.questionId,
            sectionOrder: responsePayload.sectionOrder,
            responseOrder: responsePayload.responseOrder,
            responseType: responsePayload.responseType,
            selectedOptionId: responsePayload.selectedOptionId ?? null,
            frqUserAnswer: responsePayload.frqUserAnswer ?? null,
            correctAnswerKey: normalizedCorrectKey,
            isCorrect,
            timeSpentOnResponse: resolvedTimeSpent,
            usedCalculator: responsePayload.usedCalculator ?? false,
            changedAnswer: hasChangedAnswer,
          },
          update: {
            selectedOptionId: responsePayload.selectedOptionId ?? null,
            frqUserAnswer: responsePayload.frqUserAnswer ?? null,
            correctAnswerKey: normalizedCorrectKey,
            isCorrect,
            timeSpentOnResponse: resolvedTimeSpent,
            usedCalculator: responsePayload.usedCalculator ?? undefined,
            changedAnswer: hasChangedAnswer ? true : undefined,
          },
        })
      );
    }

    // 3. Prepare Section Checkpoint Upsert (if included)
    if (checkpointPayload) {
      const clientDate = checkpointPayload.clientUpdatedAt
        ? new Date(checkpointPayload.clientUpdatedAt)
        : new Date();

      operations.push(
        prisma.sectionCheckpoint.upsert({
          where: {
            profileId_testId_sectionId: {
              profileId,
              testId: checkpointPayload.testId,
              sectionId: checkpointPayload.sectionId,
            },
          },
          create: {
            profileId,
            testId: checkpointPayload.testId,
            sectionId: checkpointPayload.sectionId,
            timeRemainingSeconds: Math.max(
              0,
              Math.round(checkpointPayload.timeRemainingSeconds)
            ),
            lastQuestionIndex: checkpointPayload.lastQuestionIndex,
            navigationHistory: checkpointPayload.navigationHistory
              ? (checkpointPayload.navigationHistory as unknown as Prisma.InputJsonValue)
              : Prisma.JsonNull,
            accommodations: checkpointPayload.accommodations
              ? (checkpointPayload.accommodations as unknown as Prisma.InputJsonValue)
              : Prisma.JsonNull,
            clientUpdatedAt: clientDate,
          },
          update: {
            timeRemainingSeconds: Math.max(
              0,
              Math.round(checkpointPayload.timeRemainingSeconds)
            ),
            lastQuestionIndex: checkpointPayload.lastQuestionIndex,
            navigationHistory: checkpointPayload.navigationHistory
              ? (checkpointPayload.navigationHistory as unknown as Prisma.InputJsonValue)
              : undefined,
            accommodations: checkpointPayload.accommodations
              ? (checkpointPayload.accommodations as unknown as Prisma.InputJsonValue)
              : undefined,
            clientUpdatedAt: clientDate,
          },
        })
      );
    }

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /api/exam/sync] Sync transaction error:", error);
    return NextResponse.json(
      { success: false, error: "Database sync failed" },
      { status: 500 }
    );
  }
}