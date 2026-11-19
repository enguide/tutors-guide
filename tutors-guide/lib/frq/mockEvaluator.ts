// lib/frq/mockEvaluator.ts
import { prisma } from "@/lib/prisma";
import { getSectionById, getTestMetadata } from "@/lib/contentLoader";
import { analyzeCropInkDensity } from "./inkCheck";
import { FrqSubmissionStatus, Prisma } from "@prisma/client";

export interface StoredRubricCriterion {
  id: string;
  criterion: string;
  earned: boolean;
  points: number;
  pointsPossible: number;
  reason: string;
  expectedLatex?: string;
  numericTolerance?: number;
  requiredUnits?: string;
  requiresJustification?: boolean;
  allowConsequentialCarryover?: boolean;
}

/**
 * Deterministic Proof-of-Process Evaluator (0 LLM tokens):
 * 1. Runs ink density analysis on the rectified crop buffer.
 *    - Blank boxes (< 0.35% dark interior pixels) auto-score to 0 with no human audit needed.
 * 2. Hydrates real atomic rubric criteria from the test's Markdown frontmatter.
 * 3. Routes non-blank boxes into the human audit queue (/tgadmin/frq-audit) with the
 *    exact rubric checklist ready for tutor verification.
 */
export async function evaluateFrqSubCropMock(
  cropId: string,
  auditReasonOverride?: string,
  cropJpegBuffer?: Buffer
) {
  const crop = await prisma.frqSubCrop.findUnique({
    where: { id: cropId },
    include: {
      frqSubmission: {
        include: {
          test: { select: { category: true } },
        },
      },
    },
  });

  if (!crop) return null;

  const { frqSubmission } = crop;

  // 1. Load authoritative question & sub-part rubric from Markdown frontmatter
  let subPartCriteria: StoredRubricCriterion[] = [];
  let fallbackNotes = "";
  let totalPointsPossible = crop.pointsPossible || 1.0;

  try {
    const categorySlug = frqSubmission.test.category.toLowerCase();
    const metadata = await getTestMetadata(categorySlug, frqSubmission.testId);
    const resolvedCat = metadata?.category?.toLowerCase() || categorySlug;
    const parsedSection = await getSectionById(
      resolvedCat,
      frqSubmission.testId,
      frqSubmission.sectionId
    );

    const question = parsedSection?.frontmatter.questions.find(
      (q) => q.id === frqSubmission.questionId
    );
    const subPartDef = question?.subParts?.find(
      (sp) => sp.label.trim().toUpperCase() === crop.subPartLabel.trim().toUpperCase()
    );

    if (subPartDef) {
      if (typeof subPartDef.points === "number" && subPartDef.points > 0) {
        totalPointsPossible = subPartDef.points;
      }
      fallbackNotes = subPartDef.rubricNotes || "";

      if (Array.isArray(subPartDef.criteria) && subPartDef.criteria.length > 0) {
        subPartCriteria = subPartDef.criteria.map((c) => ({
          id: c.id,
          criterion: c.description,
          earned: false,
          points: 0,
          pointsPossible: c.points,
          reason: "Pending review",
          expectedLatex: c.expectedLatex,
          numericTolerance: c.numericTolerance,
          requiredUnits: c.requiredUnits,
          requiresJustification: c.requiresJustification,
          allowConsequentialCarryover: c.allowConsequentialCarryover,
        }));
      }
    }
  } catch (err) {
    console.warn("[evaluateFrqSubCropMock] Could not load .md rubric:", err);
  }

  if (subPartCriteria.length === 0) {
    subPartCriteria = [
      {
        id: `${frqSubmission.questionId}-${crop.subPartLabel.toLowerCase()}-main`,
        criterion:
          fallbackNotes ||
          `Part ${crop.subPartLabel} response (${totalPointsPossible} pt${
            totalPointsPossible === 1 ? "" : "s"
          })`,
        earned: false,
        points: 0,
        pointsPossible: totalPointsPossible,
        reason: "Pending review",
      },
    ];
  }

  // 2. Deterministic Blank-Box Check (when cropBuffer is provided)
  if (cropJpegBuffer) {
    const ink = await analyzeCropInkDensity(cropJpegBuffer);
    if (ink.isBlank) {
      const blankCriteria = subPartCriteria.map((c) => ({
        ...c,
        earned: false,
        points: 0,
        reason: "No written response detected (blank response box).",
      }));

      const updatedBlankCrop = await prisma.frqSubCrop.update({
        where: { id: cropId },
        data: {
          transcription: "[Blank]",
          pointsAwarded: 0,
          pointsPossible: totalPointsPossible,
          rubricBreakdown: blankCriteria as unknown as Prisma.InputJsonValue,
          needsHumanAudit: Boolean(auditReasonOverride),
          auditReason: auditReasonOverride ?? null,
        },
      });

      await syncParentSubmissionStatus(crop.frqSubmissionId);
      return updatedBlankCrop;
    }
  }

  // 3. Non-blank crop -> route to Human Review Queue with structured .md rubric checklist
  const auditReason = auditReasonOverride ?? "PROOF_OF_PROCESS_HUMAN_REVIEW";

  const updatedCrop = await prisma.frqSubCrop.update({
    where: { id: cropId },
    data: {
      transcription: "",
      pointsAwarded: 0,
      pointsPossible: totalPointsPossible,
      rubricBreakdown: subPartCriteria as unknown as Prisma.InputJsonValue,
      needsHumanAudit: true,
      auditReason,
    },
  });

  await syncParentSubmissionStatus(crop.frqSubmissionId);
  return updatedCrop;
}

async function syncParentSubmissionStatus(frqSubmissionId: string) {
  const remainingUnevaluated = await prisma.frqSubCrop.count({
    where: {
      frqSubmissionId,
      transcription: null,
    },
  });

  if (remainingUnevaluated === 0) {
    const hasAuditFlag = await prisma.frqSubCrop.count({
      where: {
        frqSubmissionId,
        needsHumanAudit: true,
      },
    });

    await prisma.frqSubmission.update({
      where: { id: frqSubmissionId },
      data: {
        status:
          hasAuditFlag > 0
            ? FrqSubmissionStatus.PENDING_AUDIT
            : FrqSubmissionStatus.EVALUATED,
      },
    });
  }
}