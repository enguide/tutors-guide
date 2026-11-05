// lib/scoring/scoringEngine.ts
import { TestMetadata } from "@/types/content";
import { DEFAULT_SAT_CURVE, lookupScaledScore } from "./curveEngine";
import { synthesizeAdaptiveTestScores } from "./adaptiveScorer";
import { lookupPercentile, PercentileTable } from "./percentileEngine";

export interface SectionScoreInput {
  sectionId: string;
  numCorrect: number;
  totalQuestions: number;
  rawScore: number;
}

export interface FinalScoreSynthesis {
  compositeScore: number;
  percentile: string | null;
  scaledSectionScores: Record<string, number>;
  displayBadge: string;
  subscoreDetails: Record<string, unknown>;
}

/**
 * Calculates individual section scaled scores (e.g., ACT 1-36, SAT 200-800, GRE 130-170)
 * using metadata-defined curves or category-specific defaults.
 */
export function calculateSectionScaledScore(
  sectionId: string,
  rawScore: number,
  metadata: TestMetadata
): number | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scoring = (metadata as any).scoring;

  if (scoring?.curves && scoring.curves[sectionId]) {
    return lookupScaledScore(scoring.curves[sectionId], rawScore);
  }

  if (metadata.category === "ACT") {
    const ratio = Math.max(0, Math.min(1, rawScore / 40));
    return Math.max(1, Math.min(36, Math.round(ratio * 35) + 1));
  }

  if (metadata.category === "GRE") {
    const ratio = Math.max(0, Math.min(1, rawScore / 20));
    return Math.max(130, Math.min(170, Math.round(130 + ratio * 40)));
  }

  if (metadata.category === "AP_CALC") {
    return rawScore;
  }

  return null;
}

/**
 * Synthesizes completed section results into a category-accurate composite score
 * and structured subscore breakdown.
 */
export function synthesizeExamComposite(
  metadata: TestMetadata,
  results: SectionScoreInput[]
): FinalScoreSynthesis {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scoring = (metadata as any).scoring;
  const customPercentileTable: PercentileTable | undefined = scoring?.percentileTable;

  // Helper to resolve percentile consistently across exam types
  const resolvePercentile = (score: number) => {
    const res = lookupPercentile(metadata.category, score, customPercentileTable);
    return res || null;
  };

  // -------------------------------------------------------------
  // 1. AP EXAMINATIONS (Calculus AB/BC, etc.)
  // -------------------------------------------------------------
  if (metadata.category === "AP_CALC" || scoring?.scaleType === "AP_WEIGHTED") {
    const mcIds: string[] = scoring?.apWeights?.mcSectionIds || [
      "ap-calc-ab-t1-s1a",
      "ap-calc-ab-t1-s1b",
    ];
    const frqIds: string[] = scoring?.apWeights?.frqSectionIds || [
      "ap-calc-ab-t1-s2a",
      "ap-calc-ab-t1-s2b",
    ];
    const mcMultiplier: number = scoring?.apWeights?.mcMultiplier ?? 1.2;
    const frqMultiplier: number = scoring?.apWeights?.frqMultiplier ?? 1.0;

    const cutoffs: Record<number, number> = scoring?.apWeights?.gradeCutoffs ?? {
      5: 68,
      4: 54,
      3: 41,
      2: 30,
      1: 0,
    };

    let mcRaw = 0;
    let frqRaw = 0;
    const scaledSectionScores: Record<string, number> = {};

    results.forEach((r) => {
      if (mcIds.includes(r.sectionId)) {
        mcRaw += r.numCorrect;
        scaledSectionScores[r.sectionId] = r.numCorrect;
      } else if (frqIds.includes(r.sectionId)) {
        frqRaw += r.rawScore;
        scaledSectionScores[r.sectionId] = r.rawScore;
      } else {
        mcRaw += r.numCorrect;
        scaledSectionScores[r.sectionId] = r.numCorrect;
      }
    });

    const compositeRaw = Math.round(mcRaw * mcMultiplier + frqRaw * frqMultiplier);

    let apGrade = 1;
    if (compositeRaw >= cutoffs[5]) apGrade = 5;
    else if (compositeRaw >= cutoffs[4]) apGrade = 4;
    else if (compositeRaw >= cutoffs[3]) apGrade = 3;
    else if (compositeRaw >= cutoffs[2]) apGrade = 2;

    return {
      compositeScore: apGrade,
      percentile: resolvePercentile(apGrade),
      scaledSectionScores,
      displayBadge: `Score: ${apGrade} / 5 (${compositeRaw}/108 pts)`,
      subscoreDetails: {
        compositeRaw,
        mcRaw,
        frqRaw,
        mcWeighted: Math.round(mcRaw * mcMultiplier * 10) / 10,
        frqWeighted: Math.round(frqRaw * frqMultiplier * 10) / 10,
      },
    };
  }

  // -------------------------------------------------------------
  // 2. DIGITAL SAT (Adaptive Multi-Stage or Linear)
  // -------------------------------------------------------------
  if (metadata.category === "SAT") {
    if (metadata.isAdaptive) {
      const adaptiveMap = new Map<string, { numCorrect: number; totalQuestions: number }>();
      results.forEach((r) =>
        adaptiveMap.set(r.sectionId, {
          numCorrect: r.numCorrect,
          totalQuestions: r.totalQuestions,
        })
      );

      const adaptiveSynthesis = synthesizeAdaptiveTestScores(metadata, adaptiveMap);
      const scaledSectionScores: Record<string, number> = {};
      adaptiveSynthesis.stageSummaries.forEach((s) => {
        scaledSectionScores[s.baselineSectionId] = s.domainScore;
      });

      return {
        compositeScore: adaptiveSynthesis.compositeScore,
        percentile: resolvePercentile(adaptiveSynthesis.compositeScore),
        scaledSectionScores,
        displayBadge: `${adaptiveSynthesis.compositeScore} / 1600`,
        subscoreDetails: {
          stages: adaptiveSynthesis.stageSummaries,
          trajectory: adaptiveSynthesis.trajectoryDescription,
        },
      };
    } else {
      const totalCorrect = results.reduce((acc, r) => acc + r.numCorrect, 0);
      const scaled = lookupScaledScore(DEFAULT_SAT_CURVE.sectionCurves.English, totalCorrect);
      return {
        compositeScore: scaled,
        percentile: resolvePercentile(scaled),
        scaledSectionScores: {},
        displayBadge: `${scaled} / 1600`,
        subscoreDetails: {},
      };
    }
  }

  // -------------------------------------------------------------
  // 3. ACT EXAMINATIONS
  // -------------------------------------------------------------
  if (metadata.category === "ACT") {
    const scaledSectionScores: Record<string, number> = {};
    let subscoreSum = 0;
    let sectionCount = 0;

    results.forEach((r) => {
      let scaled = 20;
      if (scoring?.curves && scoring.curves[r.sectionId]) {
        scaled = lookupScaledScore(scoring.curves[r.sectionId], r.numCorrect);
      } else {
        const ratio = r.totalQuestions > 0 ? r.numCorrect / r.totalQuestions : 0;
        scaled = Math.max(1, Math.min(36, Math.round(ratio * 35) + 1));
      }
      scaledSectionScores[r.sectionId] = scaled;
      subscoreSum += scaled;
      sectionCount++;
    });

    const compositeScore = sectionCount > 0 ? Math.round(subscoreSum / sectionCount) : 1;

    return {
      compositeScore,
      percentile: resolvePercentile(compositeScore),
      scaledSectionScores,
      displayBadge: `ACT Composite: ${compositeScore}`,
      subscoreDetails: {
        scaledSectionScores,
      },
    };
  }

  // -------------------------------------------------------------
  // 4. GRE EXAMINATIONS
  // -------------------------------------------------------------
  if (metadata.category === "GRE") {
    const scaledSectionScores: Record<string, number> = {};
    let compositeScore = 0;

    results.forEach((r) => {
      let scaled = 150;
      if (scoring?.curves && scoring.curves[r.sectionId]) {
        scaled = lookupScaledScore(scoring.curves[r.sectionId], r.numCorrect);
      } else {
        const ratio = r.totalQuestions > 0 ? r.numCorrect / r.totalQuestions : 0;
        scaled = Math.max(130, Math.min(170, Math.round(130 + ratio * 40)));
      }
      scaledSectionScores[r.sectionId] = scaled;
      compositeScore += scaled;
    });

    return {
      compositeScore,
      percentile: resolvePercentile(compositeScore),
      scaledSectionScores,
      displayBadge: `GRE Score: ${compositeScore}`,
      subscoreDetails: {
        scaledSectionScores,
      },
    };
  }

  // -------------------------------------------------------------
  // 5. GENERIC / FALLBACK SCORER
  // -------------------------------------------------------------
  const totalRaw = results.reduce((acc, r) => acc + r.numCorrect, 0);
  return {
    compositeScore: totalRaw,
    percentile: null,
    scaledSectionScores: {},
    displayBadge: `Raw Score: ${totalRaw}`,
    subscoreDetails: {},
  };
}