// actions/frqAudit.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTestMetadata } from "@/lib/contentLoader";
import {
  calculateSectionScaledScore,
  synthesizeExamComposite,
} from "@/lib/scoring/scoringEngine";
import { FrqSubmissionStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getPendingAuditCrops() {
  const session = await auth();
  const userId = session?.user?.id;
  const role = session?.user?.role;

  if (!userId || (role !== "ADMIN" && role !== "ORG_ADMIN" && role !== "TUTOR")) {
    return { success: false, error: "Unauthorized access to audit queue." };
  }

  try {
    const crops = await prisma.frqSubCrop.findMany({
      where: {
        needsHumanAudit: true,
        reviewedAt: null,
      },
      include: {
        frqSubmission: {
          include: {
            profile: {
              select: { firstName: true, lastName: true, email: true },
            },
            test: {
              select: { title: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, crops };
  } catch (error) {
    console.error("Failed to load audit queue:", error);
    return { success: false, error: "Database query failed." };
  }
}

export async function resolveCropAudit({
  cropId,
  pointsAwarded,
  transcription,
  reviewerNotes,
  rubricBreakdown,
}: {
  cropId: string;
  pointsAwarded: number;
  transcription?: string;
  reviewerNotes?: string;
  rubricBreakdown?: unknown;
}) {
  const session = await auth();
  const reviewerId = session?.user?.id;
  const role = session?.user?.role;

  if (!reviewerId || (role !== "ADMIN" && role !== "ORG_ADMIN" && role !== "TUTOR")) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const updatedCrop = await prisma.frqSubCrop.update({
      where: { id: cropId },
      data: {
        pointsAwarded,
        transcription: transcription !== undefined ? transcription : undefined,
        ...(rubricBreakdown !== undefined
          ? { rubricBreakdown: rubricBreakdown as Prisma.InputJsonValue }
          : {}),
        needsHumanAudit: false,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
        reviewerNotes,
      },
      include: {
        frqSubmission: {
          include: {
            test: { select: { category: true } },
          },
        },
      },
    });

    const { frqSubmission } = updatedCrop;

    // Update parent FrqSubmission status to EVALUATED if no other crops on this sheet need audit
    const remainingAudits = await prisma.frqSubCrop.count({
      where: {
        frqSubmissionId: frqSubmission.id,
        needsHumanAudit: true,
      },
    });

    if (remainingAudits === 0) {
      await prisma.frqSubmission.update({
        where: { id: frqSubmission.id },
        data: { status: FrqSubmissionStatus.EVALUATED },
      });
    }

    // Re-aggregate student's Response, Result, and TestSummary if test results exist
    const { profileId, testId } = frqSubmission;
    const category = frqSubmission.test.category;
    const existingResults = await prisma.result.findMany({
      where: { profileId, testId },
      select: {
        sectionId: true,
        numCorrect: true,
        totalQuestions: true,
        rawScore: true,
      },
    });

    if (existingResults.length > 0) {
      const metadata = await getTestMetadata(category.toLowerCase(), testId);
      if (metadata) {
        const [allSubmissions, existingResponses] = await Promise.all([
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

        const bySection = new Map<
          string,
          Map<string, { earned: number; possible: number; notes: string[] }>
        >();

        for (const sub of allSubmissions) {
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
            const statusSummary = `${earned}/${possible} pts${
              earned >= possible ? " (Full Credit)" : ""
            }`;
            const detailText = c.transcription || c.reviewerNotes || "";
            const note = detailText
              ? `${statusSummary} — ${detailText}`
              : statusSummary;

            const existing = qMap.get(targetQuestionId);
            if (existing) {
              existing.earned += earned;
              existing.possible += possible;
              existing.notes.push(note);
            } else {
              qMap.set(targetQuestionId, {
                earned,
                possible,
                notes: [note],
              });
            }
          }
        }

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

        const refreshedResults = await prisma.result.findMany({
          where: { profileId, testId },
          select: {
            sectionId: true,
            numCorrect: true,
            totalQuestions: true,
            rawScore: true,
          },
        });

        const synthesis = synthesizeExamComposite(metadata, refreshedResults);
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
    }

    revalidatePath("/tgadmin/frq-audit");
    return { success: true };
  } catch (error) {
    console.error("Failed to resolve crop audit:", error);
    return { success: false, error: "Audit resolution failed." };
  }
}