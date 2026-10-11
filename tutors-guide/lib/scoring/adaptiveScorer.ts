// lib/scoring/adaptiveScorer.ts
import { TestMetadata } from "@/types/content";

export interface StageScoreSummary {
  stageIndex: number;
  baselineSectionId: string;
  baselineRaw: number;
  baselineTotal: number;
  routedSectionId: string;
  routedTier: "hard" | "easy";
  routedRaw: number;
  routedTotal: number;
  domainScore: number;
}

export interface AdaptiveScoreSynthesis {
  compositeScore: number;
  stageSummaries: StageScoreSummary[];
  trajectoryDescription: string;
}

/**
 * Calculates a 200–800 scaled domain score for Digital SAT based on adaptive tier routing.
 * Capped when routed to the standard/easy tier; full scale when routed to hard tier.
 */
export function calculateSATDomainScore(
  m1Raw: number,
  m1Total: number,
  m2Raw: number,
  m2Total: number,
  tier: "hard" | "easy"
): number {
  const combinedRaw = m1Raw + m2Raw;
  const combinedMax = m1Total + m2Total;

  if (combinedMax === 0) return 200;

  if (tier === "easy") {
    // Easy tier ceiling: max 610, min 200
    const ratio = combinedRaw / combinedMax;
    const rawScaled = 200 + Math.round(ratio * 410);
    // Round to nearest 10 like standard SAT scoring
    const rounded = Math.round(rawScaled / 10) * 10;
    return Math.min(610, Math.max(200, rounded));
  } else {
    // Hard tier: min 450, max 800
    const ratio = combinedRaw / combinedMax;
    const rawScaled = 450 + Math.round(ratio * 350);
    const rounded = Math.round(rawScaled / 10) * 10;
    return Math.min(800, Math.max(450, rounded));
  }
}

/**
 * Synthesizes adaptive exam results across all completed stages and branches.
 */
export function synthesizeAdaptiveTestScores(
  metadata: TestMetadata,
  resultsMap: Map<string, { numCorrect: number; totalQuestions: number }>
): AdaptiveScoreSynthesis {
  const stageSummaries: StageScoreSummary[] = [];

  if (!metadata.stages || metadata.stages.length === 0) {
    let totalCorrect = 0;
    for (const r of resultsMap.values()) {
      totalCorrect += r.numCorrect;
    }
    return {
      compositeScore: totalCorrect,
      stageSummaries: [],
      trajectoryDescription: "Linear",
    };
  }

  for (const stage of metadata.stages) {
    const baseResult = resultsMap.get(stage.sectionId) || { numCorrect: 0, totalQuestions: 0 };
    const passed = baseResult.numCorrect >= stage.routing.threshold;
    const routedSectionId = passed ? stage.routing.onPass : stage.routing.onFail;
    const routedTier: "hard" | "easy" = passed ? "hard" : "easy";
    const routedResult = resultsMap.get(routedSectionId) || { numCorrect: 0, totalQuestions: 0 };

    let domainScore = 0;
    if (metadata.category === "SAT") {
      domainScore = calculateSATDomainScore(
        baseResult.numCorrect,
        baseResult.totalQuestions,
        routedResult.numCorrect,
        routedResult.totalQuestions,
        routedTier
      );
    } else {
      // Default sum fallback for other CAT tests
      domainScore = baseResult.numCorrect + routedResult.numCorrect;
    }

    stageSummaries.push({
      stageIndex: stage.stageIndex,
      baselineSectionId: stage.sectionId,
      baselineRaw: baseResult.numCorrect,
      baselineTotal: baseResult.totalQuestions,
      routedSectionId,
      routedTier,
      routedRaw: routedResult.numCorrect,
      routedTotal: routedResult.totalQuestions,
      domainScore,
    });
  }

  // Calculate composite
  let compositeScore = 0;
  if (metadata.category === "SAT") {
    compositeScore = stageSummaries.reduce((acc, s) => acc + s.domainScore, 0);
  } else {
    compositeScore = stageSummaries.reduce((acc, s) => acc + s.domainScore, 0);
  }

  const trajectoryDescription = stageSummaries
    .map((s) => `Stage ${s.stageIndex}: ${s.routedTier.toUpperCase()}`)
    .join(" | ");

  return {
    compositeScore,
    stageSummaries,
    trajectoryDescription,
  };
}