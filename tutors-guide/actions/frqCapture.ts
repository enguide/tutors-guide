// actions/frqCapture.ts
"use server";

import crypto from "crypto";
import { after } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPresignedUploadPost } from "@/lib/storage/s3";
import { getSectionById, getTestMetadata } from "@/lib/contentLoader";
import {
  SectionFrqManifest,
  buildSectionFrqManifest,
} from "@/lib/frq/manifest";
import { processAndCropFrqSubmission } from "@/lib/frq/cropper";
import { CaptureSessionStatus, FrqSubmissionStatus, Prisma } from "@prisma/client";

export interface CreateCaptureSessionParams {
  testId: string;
  sectionId: string;
  questionId?: string;
}

/**
 * Resolves and caches the SectionFrqManifest so mobile & desktop clients
 * know the exact questions, sheet counts, and sub-part rubrics in a single DB lookup.
 */
async function resolveManifestForSection(
  testId: string,
  sectionId: string
): Promise<SectionFrqManifest | null> {
  // Look up test category in DB first
  const testRecord = await prisma.test.findUnique({
    where: { id: testId },
    select: { category: true },
  });

  const categorySlug = testRecord?.category?.toLowerCase() || "ap_calc";
  const parsedSection = await getSectionById(categorySlug, testId, sectionId);
  if (parsedSection?.frontmatter?.questions) {
    return buildSectionFrqManifest(
      testId,
      sectionId,
      parsedSection.frontmatter.questions
    );
  }

  // Fallback: check metadata category if DB category wasn't populated
  const meta = await getTestMetadata(categorySlug, testId);
  if (meta) {
    const fallbackSection = await getSectionById(
      meta.category.toLowerCase(),
      testId,
      sectionId
    );
    if (fallbackSection?.frontmatter?.questions) {
      return buildSectionFrqManifest(
        testId,
        sectionId,
        fallbackSection.frontmatter.questions
      );
    }
  }

  return null;
}

/**
 * Creates or reuses a tokenized capture session scoped to the whole section,
 * persisting a manifestSnapshot so 1,000+ concurrent scans require zero filesystem reads.
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
      let manifest = existingSession.manifestSnapshot as unknown as SectionFrqManifest | null;
      if (!manifest) {
        manifest = await resolveManifestForSection(testId, sectionId);
        if (manifest) {
          await prisma.captureSession.update({
            where: { id: existingSession.id },
            data: { manifestSnapshot: manifest as unknown as Prisma.InputJsonValue },
          });
        }
      }

      return {
        success: true,
        sessionToken: existingSession.sessionToken,
        expiresAt: existingSession.expiresAt.toISOString(),
        manifest,
        submissions: existingSession.frqSubmissions,
      };
    }

    const manifest = await resolveManifestForSection(testId, sectionId);
    const sessionToken = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);

    const createdSession = await prisma.captureSession.create({
      data: {
        sessionToken,
        profileId,
        testId,
        sectionId,
        questionId: questionId || null,
        manifestSnapshot: manifest
          ? (manifest as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
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
      manifest,
      submissions: createdSession.frqSubmissions,
    };
  } catch (error) {
    console.error("Failed to create capture session:", error);
    return { success: false, error: "Failed to create capture session." };
  }
}

/**
 * Lightweight, uncached status check invoked by desktop clients via POST Server Action
 * (bypasses Next.js 16 cacheComponents GET caching completely).
 */
export async function getCaptureSessionStatus(sessionToken: string) {
  if (!sessionToken) {
    return { success: false, error: "Missing session token" };
  }

  try {
    const session = await prisma.captureSession.findUnique({
      where: { sessionToken },
      select: {
        id: true,
        status: true,
        expiresAt: true,
        manifestSnapshot: true,
        frqSubmissions: {
          orderBy: [{ questionId: "asc" }, { pageNumber: "asc" }],
          select: {
            id: true,
            questionId: true,
            pageNumber: true,
            status: true,
            fullSheetUrl: true,
            deskewedSheetUrl: true,
            processingError: true,
            crops: {
              orderBy: { subPartLabel: "asc" },
              select: {
                id: true,
                subPartLabel: true,
                cropUrl: true,
                pointsPossible: true,
                pointsAwarded: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      return { success: false, error: "Session not found" };
    }

    const isExpired =
      session.expiresAt < new Date() ||
      session.status === CaptureSessionStatus.EXPIRED;

    return {
      success: true,
      isExpired,
      manifest: session.manifestSnapshot,
      submissions: session.frqSubmissions,
    };
  } catch (err) {
    console.error("[getCaptureSessionStatus] Error:", err);
    return { success: false, error: "Failed to fetch capture status" };
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
      : contentType.includes("webp")
      ? "webp"
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
 * Finalizes an upload, upserts the FrqSubmission, and schedules fiducial deskewing
 * & cropping inside Next.js `after()` so Vercel keeps the function alive until finished.
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

    const manifest = sessionRecord.manifestSnapshot as unknown as SectionFrqManifest | null;
    const defaultFirstQuestionId = manifest?.questions[0]?.questionId;
    const resolvedQuestionId =
      questionId || sessionRecord.questionId || defaultFirstQuestionId;

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
        processingError: null,
      },
      update: {
        captureSessionId: sessionRecord.id,
        status: FrqSubmissionStatus.UPLOADED,
        fullSheetUrl: publicUrl,
        storageKey,
        mimeType,
        fileSizeBytes,
        processingError: null,
      },
    });

    // Next.js `after()` guarantees Vercel waits for cropping to finish after returning the response
    after(async () => {
      try {
        await processAndCropFrqSubmission(submission.id);
      } catch (cropErr) {
        console.error("[FRQ Cropper] Background processing failed:", cropErr);
      }
    });

    return { success: true, submission };
  } catch (error) {
    console.error("Error finalizing submission upload:", error);
    return { success: false, error: "Finalizing upload failed." };
  }
}