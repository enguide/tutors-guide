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
  buildTestFrqManifest,
} from "@/lib/frq/manifest";
import {
  calculateSectionScaledScore,
  synthesizeExamComposite,
} from "@/lib/scoring/scoringEngine";
import { processAndCropFrqSubmission } from "@/lib/frq/cropper";
import { CaptureSessionStatus, Category, FrqSubmissionStatus, Prisma } from "@prisma/client";

export interface CreateCaptureSessionParams {
  testId: string;
  /** Optional: omit for test-wide capture across all FRQ sections; pass for single-section sandbox */
  sectionId?: string;
  questionId?: string;
}

async function resolveManifest(
  testId: string,
  sectionId?: string
): Promise<SectionFrqManifest | null> {
  const testRecord = await prisma.test.findUnique({
    where: { id: testId },
    select: { category: true },
  });

  const categorySlug = testRecord?.category?.toLowerCase() || "ap_calc";
  const metadata = await getTestMetadata(categorySlug, testId);
  const resolvedCatSlug = metadata?.category?.toLowerCase() || categorySlug;

  // Single-section manifest (e.g., sandbox)
  if (sectionId) {
    const parsedSection = await getSectionById(resolvedCatSlug, testId, sectionId);
    if (parsedSection?.frontmatter?.questions) {
      return buildSectionFrqManifest(
        testId,
        sectionId,
        parsedSection.frontmatter.questions,
        parsedSection.frontmatter.sectionTitle
      );
    }
    return null;
  }

  // Test-wide manifest across all sections in metadata
  if (!metadata) return null;

  const loadedSections = await Promise.all(
    metadata.sections.map(async (sec) => {
      const parsed = await getSectionById(resolvedCatSlug, testId, sec.id);
      return parsed?.frontmatter?.questions
        ? {
            sectionId: sec.id,
            sectionTitle: sec.title,
            questions: parsed.frontmatter.questions,
          }
        : null;
    })
  );

  const validSections = loadedSections.filter(
    (s): s is NonNullable<typeof s> => s !== null
  );

  return buildTestFrqManifest(testId, validSections);
}

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
        sectionId: sectionId ?? null,
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
        manifest = await resolveManifest(testId, sectionId);
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

    const manifest = await resolveManifest(testId, sectionId);
    const sessionToken = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(now.getTime() + 45 * 60 * 1000);

    const createdSession = await prisma.captureSession.create({
      data: {
        sessionToken,
        profileId,
        testId,
        sectionId: sectionId ?? null,
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
          orderBy: [{ sectionId: "asc" }, { questionId: "asc" }, { pageNumber: "asc" }],
          select: {
            id: true,
            sectionId: true,
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
      session.status !== CaptureSessionStatus.ACTIVE;

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

export async function getPresignedUploadForSession(
  sessionToken: string,
  contentType: string,
  targetQuestionId?: string,
  pageNumber: number = 1,
  targetSectionId?: string
) {
  const session = await prisma.captureSession.findUnique({
    where: { sessionToken },
  });

  if (
    !session ||
    session.status !== CaptureSessionStatus.ACTIVE ||
    session.expiresAt < new Date()
  ) {
    return { success: false, error: "Session is closed or expired." };
  }

  try {
    const fileExt = contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
      ? "webp"
      : "jpg";
    const secId = targetSectionId || session.sectionId || "unassigned-sec";
    const qId = targetQuestionId || session.questionId || "unassigned-q";
    const storageKey = `submissions/${session.testId}/${secId}/${qId}/p${pageNumber}_${Date.now()}.${fileExt}`;

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
        sectionId: secId,
        questionId: qId,
      },
    };
  } catch (error) {
    console.error("Error creating presigned upload:", error);
    return { success: false, error: "Upload configuration failed" };
  }
}

export async function finalizeSubmissionUpload({
  sessionToken,
  storageKey,
  publicUrl,
  mimeType,
  fileSizeBytes,
  sectionId,
  questionId,
  pageNumber = 1,
}: {
  sessionToken: string;
  storageKey: string;
  publicUrl: string;
  mimeType: string;
  fileSizeBytes?: number;
  sectionId?: string;
  questionId?: string;
  pageNumber?: number;
}) {
  try {
    const sessionRecord = await prisma.captureSession.findUnique({
      where: { sessionToken },
    });

    if (
      !sessionRecord ||
      sessionRecord.status !== CaptureSessionStatus.ACTIVE ||
      sessionRecord.expiresAt < new Date()
    ) {
      return { success: false, error: "Session is closed or expired." };
    }

    const manifest = sessionRecord.manifestSnapshot as unknown as SectionFrqManifest | null;
    const defaultSheet = manifest?.sheets[0];

    const resolvedQuestionId =
      questionId || sessionRecord.questionId || defaultSheet?.questionId;
    const resolvedSectionId =
      sectionId ||
      sessionRecord.sectionId ||
      manifest?.questions.find((q) => q.questionId === resolvedQuestionId)?.sectionId ||
      defaultSheet?.sectionId;

    if (!resolvedQuestionId || !resolvedSectionId) {
      return { success: false, error: "Section and question identifiers are required." };
    }

    const submission = await prisma.frqSubmission.upsert({
      where: {
        profileId_testId_sectionId_questionId_pageNumber: {
          profileId: sessionRecord.profileId,
          testId: sessionRecord.testId,
          sectionId: resolvedSectionId,
          questionId: resolvedQuestionId,
          pageNumber,
        },
      },
      create: {
        profileId: sessionRecord.profileId,
        testId: sessionRecord.testId,
        sectionId: resolvedSectionId,
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

export async function closeCaptureSession(sessionToken: string) {
  if (!sessionToken) {
    return { success: false, error: "Missing session token" };
  }

  try {
    await prisma.captureSession.updateMany({
      where: {
        sessionToken,
        status: CaptureSessionStatus.ACTIVE,
      },
      data: {
        status: CaptureSessionStatus.CAPTURED,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[closeCaptureSession] Error:", error);
    return { success: false, error: "Failed to close capture session." };
  }
}

/**
 * Called when the student clicks "Complete Section / View Results" at the end of an FRQ test.
 * Re-aggregates FrqSubCrop scores into each FRQ section's Result & Response rows and
 * updates TestSummary so the results dashboard reflects the uploaded sheets.
 */
export async function finalizeTestFrqCapture(testId: string, category: Category) {
  const session = await auth();
  const profileId = session?.user?.id;
  if (!profileId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const metadata = await getTestMetadata(category.toLowerCase(), testId);
    if (!metadata) {
      return { success: false, error: "Test metadata not found." };
    }

    const [frqSubmissions, existingResponses] = await Promise.all([
      prisma.frqSubmission.findMany({
        where: { profileId, testId },
        include: { crops: true },
      }),
      prisma.response.findMany({
        where: { profileId, testId },
        select: { questionId: true, sectionId: true },
      }),
    ]);

    const responseIdsBySection = new Map<string, Set<string>>();
    for (const r of existingResponses) {
      if (!responseIdsBySection.has(r.sectionId)) {
        responseIdsBySection.set(r.sectionId, new Set());
      }
      responseIdsBySection.get(r.sectionId)!.add(r.questionId);
    }

    // Group earned points & notes by sectionId -> target questionId (atomic part ID or parent ID)
    const bySection = new Map<
      string,
      Map<string, { earned: number; possible: number; notes: string[] }>
    >();

    for (const sub of frqSubmissions) {
      if (!bySection.has(sub.sectionId)) {
        bySection.set(sub.sectionId, new Map());
      }
      const qMap = bySection.get(sub.sectionId)!;
      const sectionResponseIds = responseIdsBySection.get(sub.sectionId);

      for (const c of sub.crops) {
        const atomicId = `${sub.questionId}${c.subPartLabel.trim().toLowerCase()}`;
        const targetQuestionId = sectionResponseIds?.has(atomicId)
          ? atomicId
          : sub.questionId;

        const earned = c.pointsAwarded || 0;
        const possible = c.pointsPossible || 1;
        const note = c.transcription
          ? `[Part ${c.subPartLabel}]: ${c.transcription}`
          : c.reviewerNotes
          ? `[Part ${c.subPartLabel}]: ${c.reviewerNotes}`
          : null;

        const existing = qMap.get(targetQuestionId);
        if (existing) {
          existing.earned += earned;
          existing.possible += possible;
          if (note) existing.notes.push(note);
        } else {
          qMap.set(targetQuestionId, {
            earned,
            possible,
            notes: note ? [note] : [],
          });
        }
      }
    }

    // Update Response and Result records for each FRQ section
    for (const [secId, qMap] of bySection.entries()) {
      let sectionRaw = 0;
      let sectionNumCorrect = 0;

      for (const [qId, data] of qMap.entries()) {
        const isCorrect = data.possible > 0 && data.earned >= data.possible;
        sectionRaw += data.earned;
        if (isCorrect) sectionNumCorrect++;

        await prisma.response.updateMany({
          where: { profileId, testId, sectionId: secId, questionId: qId },
          data: {
            isCorrect,
            frqUserAnswer:
              data.notes.length > 0 ? data.notes.join(" | ") : undefined,
          },
        });
      }

      const roundedRaw = Math.round(sectionRaw);
      const scaledScore = calculateSectionScaledScore(secId, roundedRaw, metadata);

      await prisma.result.updateMany({
        where: { profileId, testId, sectionId: secId },
        data: {
          numCorrect: sectionNumCorrect,
          rawScore: roundedRaw,
          scaledScore,
        },
      });
    }

    // Re-synthesize overall TestSummary composite score across all sections
    const allResults = await prisma.result.findMany({
      where: { profileId, testId },
      select: {
        sectionId: true,
        numCorrect: true,
        totalQuestions: true,
        rawScore: true,
      },
    });

    if (allResults.length > 0) {
      const synthesis = synthesizeExamComposite(metadata, allResults);
      await prisma.testSummary.upsert({
        where: { testId_profileId: { testId, profileId } },
        create: {
          profileId,
          testId,
          testTitle: metadata.title,
          category,
          compositeScore: synthesis.compositeScore,
          percentile: synthesis.percentile,
        },
        update: {
          compositeScore: synthesis.compositeScore,
          percentile: synthesis.percentile,
        },
      });
    }

    // Mark active capture sessions for this test as CAPTURED
    await prisma.captureSession.updateMany({
      where: { profileId, testId, status: CaptureSessionStatus.ACTIVE },
      data: { status: CaptureSessionStatus.CAPTURED },
    });

    return { success: true };
  } catch (err) {
    console.error("[finalizeTestFrqCapture] Error:", err);
    return { success: false, error: "Failed to finalize FRQ scores." };
  }
}