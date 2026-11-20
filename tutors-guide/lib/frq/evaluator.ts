// lib/frq/evaluator.ts
import { prisma } from "@/lib/prisma";
import { getSectionById, getTestMetadata } from "@/lib/contentLoader";
import { analyzeCropInkDensity } from "./inkCheck";
import { FrqSubmissionStatus, Prisma } from "@prisma/client";

export type GradingPipelineStage =
  | "STAGE_1_HUMAN_MVP"
  | "STAGE_2_LLM_SHADOW_AUDIT"
  | "STAGE_3_AUTONOMOUS";

export const ACTIVE_GRADING_STAGE: GradingPipelineStage = "STAGE_1_HUMAN_MVP";

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
  /** Populated in Stage 2/3 when LLM evaluates prior to human review */
  aiEarned?: boolean;
  aiReason?: string;
}

export interface StoredRubricPayload {
  stage: GradingPipelineStage;
  questionNumber?: number;
  questionPrompt?: string;
  subPartNotes?: string;
  aiSuggestedPoints?: number | null;
  criteria: StoredRubricCriterion[];
}

/**
 * Stage-aware FRQ Sub-Crop Evaluator:
 * - Gate 1: Deterministic ink density check auto-scores blank boxes to 0 (no human audit needed).
 * - Stage 1 (STAGE_1_HUMAN_MVP): Hydrates atomic .md rubric checklist & routes every inked crop
 *   to /tgadmin/frq-audit for one-click tutor grading (zero manual LaTeX required).
 */
export async function evaluateFrqSubCrop(
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

  // 1. Load authoritative question prompt & sub-part atomic criteria from Markdown frontmatter
  let criteria: StoredRubricCriterion[] = [];
  let subPartNotes = "";
  let questionNumber: number | undefined;
  let questionPrompt = "";
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

    if (question) {
      questionNumber = question.questionNumber;

      const rawCombinedPrompt = [question.stimulus, question.prompt]
        .filter((part): part is string => Boolean(part && part.trim().length > 0))
        .join("\n\n---\n\n");

      const assetBase = `/content/tests/${resolvedCat}/${frqSubmission.testId}/assets`;

      questionPrompt = rawCombinedPrompt.replace(
        /\]\(\.\/assets\//g,
        `](${assetBase}/`
      );
    }

    const subPartDef = question?.subParts?.find(
      (sp) => sp.label.trim().toUpperCase() === crop.subPartLabel.trim().toUpperCase()
    );

    if (subPartDef) {
      if (typeof subPartDef.points === "number" && subPartDef.points > 0) {
        totalPointsPossible = subPartDef.points;
      }
      subPartNotes = subPartDef.rubricNotes || "";

      if (Array.isArray(subPartDef.criteria) && subPartDef.criteria.length > 0) {
        criteria = subPartDef.criteria.map((c) => ({
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
    console.warn("[evaluateFrqSubCrop] Could not load .md rubric:", err);
  }

  if (criteria.length === 0) {
    criteria = [
      {
        id: `${frqSubmission.questionId}-${crop.subPartLabel.toLowerCase()}-main`,
        criterion:
          subPartNotes ||
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

  // 2. Gate 1: Deterministic Blank-Box Check
  if (cropJpegBuffer) {
    const ink = await analyzeCropInkDensity(cropJpegBuffer);
    if (ink.isBlank) {
      const blankPayload: StoredRubricPayload = {
        stage: ACTIVE_GRADING_STAGE,
        questionNumber,
        questionPrompt,
        subPartNotes,
        aiSuggestedPoints: 0,
        criteria: criteria.map((c) => ({
          ...c,
          earned: false,
          points: 0,
          reason: "Blank response box (auto-scored 0).",
        })),
      };

      const updatedBlankCrop = await prisma.frqSubCrop.update({
        where: { id: cropId },
        data: {
          transcription: "[Blank]",
          pointsAwarded: 0,
          pointsPossible: totalPointsPossible,
          rubricBreakdown: blankPayload as unknown as Prisma.InputJsonValue,
          needsHumanAudit: Boolean(auditReasonOverride),
          auditReason: auditReasonOverride ?? null,
        },
      });

      await syncParentSubmissionStatus(crop.frqSubmissionId);
      return updatedBlankCrop;
    }
  }

  // 3. Stage 1 Human-in-the-Loop MVP: Flag every inked crop for one-click tutor checklist review
  const payload: StoredRubricPayload = {
    stage: ACTIVE_GRADING_STAGE,
    questionNumber,
    questionPrompt,
    subPartNotes,
    aiSuggestedPoints: null,
    criteria,
  };

  const auditReason = auditReasonOverride ?? "STAGE_1_HUMAN_GRADING";

  const updatedCrop = await prisma.frqSubCrop.update({
    where: { id: cropId },
    data: {
      transcription: "",
      pointsAwarded: 0,
      pointsPossible: totalPointsPossible,
      rubricBreakdown: payload as unknown as Prisma.InputJsonValue,
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
