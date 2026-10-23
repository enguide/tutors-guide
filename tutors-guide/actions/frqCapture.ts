// actions/frqCapture.ts
"use server";

import crypto from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPresignedUploadPost } from "@/lib/storage/s3";
import { processAndCropFrqSubmission } from "@/lib/frq/cropper";
import { CaptureSessionStatus, FrqSubmissionStatus } from "@prisma/client";

export interface CreateCaptureSessionParams {
  testId: string;
  sectionId: string;
  questionId?: string;
}

/**
 * Creates or reuses a tokenized capture session scoped to the whole section.
 */
export async function getOrCreateCaptureSession(params: CreateCaptureSessionParams) {
  const session = await auth();
  const profileId = session?.user?.id;

  if (!profileId) {
    return { success: false, error: "Unauthorized" };
  }

  const { testId, sectionId, questionId } = params;
  const now = new Date();

  try {
    // Check for an active session that hasn't expired yet
    const existingSession = await prisma.captureSession.findFirst({
      where: {
        profileId,
        testId,
        sectionId,
        status: CaptureSessionStatus.ACTIVE,
        expiresAt: { gt: new Date(now.getTime() + 2 * 60 * 1000) },
      },
      include: {
        frqSubmissions: {
          include: { crops: true },
        },
      },
    });

    if (existingSession) {
      return {
        success: true,
        sessionToken: existingSession.sessionToken,
        expiresAt: existingSession.expiresAt.toISOString(),
        submissions: existingSession.frqSubmissions,
      };
    }

    const sessionToken = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30-minute window for post-exam upload

    const createdSession = await prisma.captureSession.create({
      data: {
        sessionToken,
        profileId,
        testId,
        sectionId,
        questionId: questionId || null,
        expiresAt,
        status: CaptureSessionStatus.ACTIVE,
      },
      include: {
        frqSubmissions: {
          include: { crops: true },
        },
      },
    });

    return {
      success: true,
      sessionToken: createdSession.sessionToken,
      expiresAt: createdSession.expiresAt.toISOString(),
      submissions: createdSession.frqSubmissions,
    };
  } catch (error) {
    console.error("Failed to create capture session:", error);
    return { success: false, error: "Failed to create capture session." };
  }
}

/**
 * Returns a pre-signed S3/R2 direct upload POST configuration scoped to this session.
 */
export async function getPresignedUploadForSession(
  sessionToken: string,
  contentType: string,
  targetQuestionId?: string,
  pageNumber: number = 1
) {
  const session = await prisma.captureSession.findUnique({
    where: { sessionToken },
  });

  if (!session || session.status === CaptureSessionStatus.EXPIRED || session.expiresAt < new Date()) {
    return { success: false, error: "Session invalid or expired" };
  }

  try {
    const fileExt = contentType.includes("png")
      ? "png"
      : contentType.includes("pdf")
      ? "pdf"
      : "jpg";
    const qId = targetQuestionId || session.questionId || "unassigned";
    const storageKey = `submissions/${session.testId}/${session.sectionId}/${qId}/p${pageNumber}_${Date.now()}.${fileExt}`;

    const presigned = await createPresignedUploadPost({
      storageKey,
      contentType,
    });

    return {
      success: true,
      presigned,
      session: {
        profileId: session.profileId,
        testId: session.testId,
        sectionId: session.sectionId,
        questionId: qId,
      },
    };
  } catch (error) {
    console.error("Error creating presigned upload:", error);
    return { success: false, error: "Upload configuration failed" };
  }
}

/**
 * Finalizes an upload (from desktop fallback or mobile capture), upserts the FrqSubmission
 * for that specific question and pageNumber, and triggers the coordinate cropper.
 */
export async function finalizeSubmissionUpload({
  sessionToken,
  storageKey,
  publicUrl,
  mimeType,
  fileSizeBytes,
  questionId,
  pageNumber = 1,
}: {
  sessionToken: string;
  storageKey: string;
  publicUrl: string;
  mimeType: string;
  fileSizeBytes?: number;
  questionId?: string;
  pageNumber?: number;
}) {
  try {
    const sessionRecord = await prisma.captureSession.findUnique({
      where: { sessionToken },
    });

    if (!sessionRecord) {
      return { success: false, error: "Session not found." };
    }

    const resolvedQuestionId = questionId || sessionRecord.questionId;
    if (!resolvedQuestionId) {
      return { success: false, error: "Question identifier is required." };
    }

    const submission = await prisma.frqSubmission.upsert({
      where: {
        profileId_testId_sectionId_questionId_pageNumber: {
          profileId: sessionRecord.profileId,
          testId: sessionRecord.testId,
          sectionId: sessionRecord.sectionId,
          questionId: resolvedQuestionId,
          pageNumber,
        },
      },
      create: {
        profileId: sessionRecord.profileId,
        testId: sessionRecord.testId,
        sectionId: sessionRecord.sectionId,
        questionId: resolvedQuestionId,
        pageNumber,
        captureSessionId: sessionRecord.id,
        status: FrqSubmissionStatus.UPLOADED,
        fullSheetUrl: publicUrl,
        storageKey,
        mimeType,
        fileSizeBytes,
      },
      update: {
        captureSessionId: sessionRecord.id,
        status: FrqSubmissionStatus.UPLOADED,
        fullSheetUrl: publicUrl,
        storageKey,
        mimeType,
        fileSizeBytes,
      },
    });

    // Automatically trigger normalizer & cropping pipeline asynchronously
    processAndCropFrqSubmission(submission.id).catch((cropErr) => {
      console.error("[FRQ Cropper] Failed to process crops asynchronously:", cropErr);
    });

    return { success: true, submission };
  } catch (error) {
    console.error("Error finalizing submission upload:", error);
    return { success: false, error: "Finalizing upload failed." };
  }
}