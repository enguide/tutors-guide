/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/frq/mockEvaluator.ts
import { prisma } from "@/lib/prisma";
import { FrqSubmissionStatus } from "@prisma/client";

export interface MockRubricCriterion {
  criterion: string;
  earned: boolean;
  points: number;
  reason: string;
}

/**
 * Simulates an evaluator pass on cropped sub-parts.
 * In Epic 17, this gets replaced by the Dual-Engine Vision Consensus & o3-mini/o1 reasoning pipeline.
 */
export async function evaluateFrqSubCropMock(cropId: string) {
  const crop = await prisma.frqSubCrop.findUnique({
    where: { id: cropId },
    include: { frqSubmission: true },
  });

  if (!crop) return null;

  // Simulate evaluation delay
  await new Promise((res) => setTimeout(res, 800));

  // Synthetic transcription and criteria matching AP Calculus AB/BC standards
  const isPartA = crop.subPartLabel === "A" || crop.subPartLabel === "C";
  const mockTranscription = isPartA
    ? "\\int_{0}^{4} R(t)\\,dt = 32.4"
    : "f'(2) = \\lim_{h \\to 0} \\frac{f(2+h)-f(2)}{h} = -3";

  // Deterministic mock scoring based on label
  const mockRubric: MockRubricCriterion[] = isPartA
    ? [
        {
          criterion: "Integral setup with correct limits [0, 4]",
          earned: true,
          points: 1.0,
          reason: "Correct limits and integrand specified.",
        },
        {
          criterion: "Terminal evaluation and units",
          earned: true,
          points: 1.0,
          reason: "Accurately calculated with proper units of measurement.",
        },
      ]
    : [
        {
          criterion: "Difference quotient setup or derivative formula",
          earned: true,
          points: 1.0,
          reason: "Correctly applied definition of derivative.",
        },
        {
          criterion: "Terminal evaluation",
          earned: false,
          points: 0.0,
          reason: "Arithmetic slip in final subtraction step.",
        },
      ];

  const pointsAwarded = mockRubric.reduce((acc, c) => acc + (c.earned ? c.points : 0), 0);
  const pointsPossible = mockRubric.reduce((acc, c) => acc + c.points, 0);

  // Update crop with mock scores and transcription
  const updatedCrop = await prisma.frqSubCrop.update({
    where: { id: cropId },
    data: {
      transcription: mockTranscription,
      pointsAwarded,
      pointsPossible,
      rubricBreakdown: mockRubric as any,
      // For demonstration, keep false unless sub-part is 'D' to test the review queue
      needsHumanAudit: crop.subPartLabel === "D",
      auditReason: crop.subPartLabel === "D" ? "SYNTHETIC_UNCERTAINTY_FLAG" : null,
    },
  });

  // Check if all crops in the parent submission are evaluated
  const remainingUnevaluated = await prisma.frqSubCrop.count({
    where: {
      frqSubmissionId: crop.frqSubmissionId,
      transcription: null,
    },
  });

  if (remainingUnevaluated === 0) {
    const hasAuditFlag = await prisma.frqSubCrop.count({
      where: {
        frqSubmissionId: crop.frqSubmissionId,
        needsHumanAudit: true,
      },
    });

    await prisma.frqSubmission.update({
      where: { id: crop.frqSubmissionId },
      data: {
        status: hasAuditFlag > 0 ? FrqSubmissionStatus.PENDING_AUDIT : FrqSubmissionStatus.EVALUATED,
      },
    });
  }

  return updatedCrop;
}