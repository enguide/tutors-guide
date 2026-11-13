// lib/scoring/scoringEngine.ts
import { APGradeCutoffs, ExamScoringConfig, TestMetadata } from "@/types/content";
import { DEFAULT_SAT_CURVE, lookupScaledScore } from "./curveEngine";
import {
  ItemScoringRecord,
  synthesizeAdaptiveTestScores,
} from "./adaptiveScorer";
import { lookupPercentile } from "./percentileEngine";

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

export interface ScoringContext {
  metadata: TestMetadata;
  results: SectionScoreInput[];
  itemRecordsBySection?: Map<string, ItemScoringRecord[]>;
}

export type ExamScoringStrategy = (ctx: ScoringContext) => FinalScoreSynthesis;

/**
 * Strategy 1: Digital SAT (Multistage Adaptive & Linear Fallback)
 */
const satAdaptiveStrategy: ExamScoringStrategy = ({
  metadata,
  results,
  itemRecordsBySection,
}) => {
  const formOverrideTable = metadata.scoring?.percentileTable;

  if (metadata.isAdaptive && metadata.stages && metadata.stages.length > 0) {
    const adaptiveMap = new Map<string, { numCorrect: number; totalQuestions: number }>();
    results.forEach((r) =>
      adaptiveMap.set(r.sectionId, {
        numCorrect: r.numCorrect,
        totalQuestions: r.totalQuestions,
      })
    );

    const adaptiveSynthesis = synthesizeAdaptiveTestScores(
      metadata,
      adaptiveMap,
      itemRecordsBySection
    );

    const scaledSectionScores: Record<string, number> = {};
    adaptiveSynthesis.stageSummaries.forEach((s) => {
      scaledSectionScores[s.baselineSectionId] = s.domainScore;
    });

    return {
      compositeScore: adaptiveSynthesis.compositeScore,
      percentile: lookupPercentile("SAT", adaptiveSynthesis.compositeScore, formOverrideTable),
      scaledSectionScores,
      displayBadge: `${adaptiveSynthesis.compositeScore} / 1600`,
      subscoreDetails: {
        stages: adaptiveSynthesis.stageSummaries,
        trajectory: adaptiveSynthesis.trajectoryDescription,
      },
    };
  }

  // Non-adaptive linear SAT fallback
  const totalCorrect = results.reduce((acc, r) => acc + r.numCorrect, 0);
  const scaled = lookupScaledScore(DEFAULT_SAT_CURVE.sectionCurves.English, totalCorrect);

  return {
    compositeScore: scaled,
    percentile: lookupPercentile("SAT", scaled, formOverrideTable),
    scaledSectionScores: {},
    displayBadge: `${scaled} / 1600`,
    subscoreDetails: {},
  };
};

/**
 * Strategy 2: ACT (1–36 Subscores & Rounded Composite)
 */
const actConcordanceStrategy: ExamScoringStrategy = ({ metadata, results }) => {
  const scoring = metadata.scoring;
  const formOverrideTable = scoring?.percentileTable;
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
    percentile: lookupPercentile("ACT", compositeScore, formOverrideTable),
    scaledSectionScores,
    displayBadge: `ACT Composite: ${compositeScore}`,
    subscoreDetails: { scaledSectionScores },
  };
};

/**
 * Strategy 3: AP Weighted Examinations (MC + FRQ Multipliers -> 1–5 Grade)
 */
const apWeightedStrategy: ExamScoringStrategy = ({ metadata, results }) => {
  const scoring = metadata.scoring;
  const formOverrideTable = scoring?.percentileTable;
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
  const cutoffs: APGradeCutoffs = scoring?.apWeights?.gradeCutoffs ?? {
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
    percentile: lookupPercentile(metadata.category, apGrade, formOverrideTable),
    scaledSectionScores,
    displayBadge: `Score: ${apGrade} / 5 (${compositeRaw}/108 pts)`,
    subscoreDetails: { compositeRaw, mcRaw, frqRaw },
  };
};

/**
 * Strategy 4: ETS GRE (Supports both Section-Adaptive MST & Linear 130–170 Forms)
 */
const greSectionStrategy: ExamScoringStrategy = ({
  metadata,
  results,
  itemRecordsBySection,
}) => {
  const scoring = metadata.scoring;
  const formOverrideTable = scoring?.percentileTable;

  if (metadata.isAdaptive && metadata.stages && metadata.stages.length > 0) {
    const adaptiveMap = new Map<string, { numCorrect: number; totalQuestions: number }>();
    results.forEach((r) =>
      adaptiveMap.set(r.sectionId, {
        numCorrect: r.numCorrect,
        totalQuestions: r.totalQuestions,
      })
    );

    const adaptiveSynthesis = synthesizeAdaptiveTestScores(
      metadata,
      adaptiveMap,
      itemRecordsBySection
    );
    const scaledSectionScores: Record<string, number> = {};
    adaptiveSynthesis.stageSummaries.forEach((s) => {
      scaledSectionScores[s.baselineSectionId] = s.domainScore;
    });

    return {
      compositeScore: adaptiveSynthesis.compositeScore,
      percentile: lookupPercentile("GRE", adaptiveSynthesis.compositeScore, formOverrideTable),
      scaledSectionScores,
      displayBadge: `GRE Score: ${adaptiveSynthesis.compositeScore}`,
      subscoreDetails: {
        stages: adaptiveSynthesis.stageSummaries,
        trajectory: adaptiveSynthesis.trajectoryDescription,
      },
    };
  }

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
    percentile: lookupPercentile("GRE", compositeScore, formOverrideTable),
    scaledSectionScores,
    displayBadge: `GRE Score: ${compositeScore}`,
    subscoreDetails: { scaledSectionScores },
  };
};

/**
 * Strategy 5: Academic Mastery / Course Diagnostics
 */
const academicMasteryStrategy: ExamScoringStrategy = ({ results }) => {
  const totalEarned = results.reduce((acc, r) => acc + (r.rawScore ?? r.numCorrect), 0);
  const totalQuestions = results.reduce((acc, r) => acc + r.totalQuestions, 0);
  const pct = totalQuestions > 0 ? Math.round((totalEarned / totalQuestions) * 100) : 0;

  return {
    compositeScore: pct,
    percentile: null,
    scaledSectionScores: {},
    displayBadge: `${pct}% Mastery`,
    subscoreDetails: { totalEarned, totalQuestions },
  };
};

/**
 * Central Strategy Registry — register new standardized exams here without touching core runners.
 */
const SCORING_STRATEGIES: Record<ExamScoringConfig["scaleType"], ExamScoringStrategy> = {
  SAT_ADAPTIVE: satAdaptiveStrategy,
  SAT_LINEAR: satAdaptiveStrategy,
  ACT_CONCORDANCE: actConcordanceStrategy,
  AP_WEIGHTED: apWeightedStrategy,
  GRE_SECTION: greSectionStrategy,
  ACADEMIC_MASTERY: academicMasteryStrategy,
};

function resolveScaleType(metadata: TestMetadata): ExamScoringConfig["scaleType"] {
  if (metadata.scoring?.scaleType && SCORING_STRATEGIES[metadata.scoring.scaleType]) {
    return metadata.scoring.scaleType;
  }
  switch (metadata.category) {
    case "SAT":
      return "SAT_ADAPTIVE";
    case "ACT":
      return "ACT_CONCORDANCE";
    case "AP_CALC":
      return "AP_WEIGHTED";
    case "GRE":
      return "GRE_SECTION";
    default:
      return "ACADEMIC_MASTERY";
  }
}

export function calculateSectionScaledScore(
  sectionId: string,
  rawScore: number,
  metadata: TestMetadata
): number | null {
  const scoring = metadata.scoring;

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

export function synthesizeExamComposite(
  metadata: TestMetadata,
  results: SectionScoreInput[],
  itemRecordsBySection?: Map<string, ItemScoringRecord[]>
): FinalScoreSynthesis {
  const scaleType = resolveScaleType(metadata);
  const strategy = SCORING_STRATEGIES[scaleType] || academicMasteryStrategy;

  return strategy({
    metadata,
    results,
    itemRecordsBySection,
  });
}