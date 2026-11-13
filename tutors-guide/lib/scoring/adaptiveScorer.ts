// lib/scoring/adaptiveScorer.ts
import {
  AdaptiveDomainCurveSet,
  AdaptiveScoringConfig,
  DifficultyWeightMatrix,
  QuestionDifficulty,
  TestMetadata,
} from "@/types/content";
import { lookupScaledScore } from "./curveEngine";

export interface ItemScoringRecord {
  questionId: string;
  sectionId: string;
  isCorrect: boolean;
  difficulty?: string;
  domain?: string;
}

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
  // Extended psychometric telemetry (backward-compatible)
  domainKey: "rw" | "math" | "general";
  weightedEarned: number;
  weightedMax: number;
  normalizedAbility: number; // 0–100 scale
  abilityTheta: number;      // Standardized -3.00 to +3.00 IRT-proxy
  equatingBand: [number, number];
}

export interface AdaptiveScoreSynthesis {
  compositeScore: number;
  stageSummaries: StageScoreSummary[];
  trajectoryDescription: string;
}

/**
 * Calibrated item weights reflecting dSAT Multistage Testing (MST) psychometric leverage.
 * Hard items in M2-Hard carry maximum scale lift; Easy items in M1/M2-Easy anchor the floor.
 */
export const DEFAULT_DSAT_DIFFICULTY_WEIGHTS: DifficultyWeightMatrix = {
  routing: { Easy: 1.0, Medium: 1.18, Hard: 1.38 },
  hard: { Easy: 1.15, Medium: 1.38, Hard: 1.65 },
  easy: { Easy: 0.85, Medium: 1.0, Hard: 1.18 },
};

/**
 * Official Bluebook-calibrated equating curves mapping normalized weighted ability (0–100)
 * across M1 + M2 to a 200–800 section score (rounded to nearest 10).
 *
 * Calibrated around routing thresholds:
 * - Reading & Writing: 15/27 (~55.6% raw -> ~57–60 normalized routing ability)
 * - Mathematics:       13/22 (~59.1% raw -> ~60–63 normalized routing ability)
 *
 * Notice the realistic 460–610 overlap band between top M2-Easy and bottom M2-Hard.
 */
export const DEFAULT_DSAT_EQUATING_CURVES: Record<"rw" | "math", AdaptiveDomainCurveSet> = {
  rw: {
    // M2-Easy track: floor 200, ceiling 610
    easy: {
      0: 200,
      10: 240,
      20: 290,
      30: 340,
      40: 390,
      50: 440,
      60: 480,
      70: 520,
      80: 560,
      90: 590,
      100: 610,
    },
    // M2-Hard track: floor 460 (if student clears 15/27 M1 cutoff then misses all of M2-Hard), ceiling 800
    hard: {
      0: 460,
      20: 460,
      28: 480,
      35: 510,
      42: 550,
      50: 590,
      58: 630,
      66: 670,
      74: 710,
      82: 740,
      90: 770,
      96: 790,
      100: 800,
    },
  },
  math: {
    // M2-Easy track: floor 200, ceiling 610
    easy: {
      0: 200,
      10: 240,
      20: 290,
      30: 340,
      40: 390,
      50: 440,
      60: 480,
      70: 520,
      80: 560,
      90: 590,
      100: 610,
    },
    // M2-Hard track: floor 460 (if student clears 13/22 M1 cutoff then misses all of M2-Hard), ceiling 800
    hard: {
      0: 460,
      22: 460,
      30: 490,
      38: 530,
      46: 570,
      54: 610,
      62: 650,
      70: 690,
      78: 730,
      86: 760,
      93: 780,
      97: 790,
      100: 800,
    },
  },
};

/**
 * Normalizes raw difficulty strings (handling typos like "Mediumq") to canonical levels.
 */
export function normalizeQuestionDifficulty(raw?: string): QuestionDifficulty {
  if (!raw) return "Medium";
  const cleaned = raw.trim().toLowerCase();
  if (cleaned.startsWith("easy")) return "Easy";
  if (cleaned.startsWith("hard")) return "Hard";
  return "Medium";
}

/**
 * Infers whether a stage belongs to Reading & Writing or Mathematics.
 */
function inferSATStageDomain(
  baselineSectionId: string,
  stageIndex: number,
  items: ItemScoringRecord[]
): "rw" | "math" {
  const idLower = baselineSectionId.toLowerCase();
  if (idLower.includes("rw") || idLower.includes("eng") || idLower.includes("read")) {
    return "rw";
  }
  if (idLower.includes("-m1") || idLower.includes("math")) {
    return "math";
  }

  const mathDomains = new Set([
    "algebra",
    "advanced math",
    "problem-solving and data analysis",
    "problem solving and data analysis",
    "geometry and trigonometry",
  ]);
  const hasMathDomain = items.some(
    (it) => it.domain && mathDomains.has(it.domain.trim().toLowerCase())
  );
  if (hasMathDomain) return "math";

  return stageIndex === 1 ? "rw" : "math";
}

function resolveWeights(
  custom?: Partial<DifficultyWeightMatrix>
): DifficultyWeightMatrix {
  return {
    routing: { ...DEFAULT_DSAT_DIFFICULTY_WEIGHTS.routing, ...custom?.routing },
    hard: { ...DEFAULT_DSAT_DIFFICULTY_WEIGHTS.hard, ...custom?.hard },
    easy: { ...DEFAULT_DSAT_DIFFICULTY_WEIGHTS.easy, ...custom?.easy },
  };
}

function roundToNearestTen(score: number): number {
  return Math.round(score / 10) * 10;
}

export interface SATDomainCalculationResult {
  domainScore: number;
  weightedEarned: number;
  weightedMax: number;
  normalizedAbility: number;
  abilityTheta: number;
  equatingBand: [number, number];
}

/**
 * Calculates a 200–800 scaled domain score for Digital SAT using item-difficulty weighting
 * and branch-specific Bluebook equating tables (with automatic raw-count fallback).
 */
export function calculateSATDomainScore(params: {
  m1Raw: number;
  m1Total: number;
  m2Raw: number;
  m2Total: number;
  tier: "hard" | "easy";
  domainKey?: "rw" | "math";
  m1Items?: ItemScoringRecord[];
  m2Items?: ItemScoringRecord[];
  adaptiveConfig?: AdaptiveScoringConfig;
  baselineSectionId?: string;
}): SATDomainCalculationResult {
  const {
    m1Raw,
    m1Total,
    m2Raw,
    m2Total,
    tier,
    domainKey = "math",
    m1Items,
    m2Items,
    adaptiveConfig,
    baselineSectionId,
  } = params;

  const weights = resolveWeights(adaptiveConfig?.difficultyWeights);

  let weightedEarned = 0;
  let weightedMax = 0;

  if (m1Items && m1Items.length > 0 && m2Items && m2Items.length > 0) {
    for (const item of m1Items) {
      const diff = normalizeQuestionDifficulty(item.difficulty);
      const w = weights.routing[diff];
      weightedMax += w;
      if (item.isCorrect) weightedEarned += w;
    }

    const m2RoleWeights = tier === "hard" ? weights.hard : weights.easy;
    for (const item of m2Items) {
      const diff = normalizeQuestionDifficulty(item.difficulty);
      const w = m2RoleWeights[diff];
      weightedMax += w;
      if (item.isCorrect) weightedEarned += w;
    }
  } else {
    // Fallback when item-level records are unavailable: apply module-tier average weights
    const m1AvgWeight = 1.15;
    const m2AvgWeight = tier === "hard" ? 1.38 : 0.98;
    weightedEarned = m1Raw * m1AvgWeight + m2Raw * m2AvgWeight;
    weightedMax = m1Total * m1AvgWeight + m2Total * m2AvgWeight;
  }

  if (weightedMax <= 0) {
    return {
      domainScore: 200,
      weightedEarned: 0,
      weightedMax: 0,
      normalizedAbility: 0,
      abilityTheta: -3.0,
      equatingBand: [200, 200],
    };
  }

  const normalizedAbility = Math.max(
    0,
    Math.min(100, (weightedEarned / weightedMax) * 100)
  );

  // Check for explicit raw-score branch curve override in metadata.json
  const rawBranchKey = baselineSectionId ? `${baselineSectionId}:${tier}` : null;
  if (rawBranchKey && adaptiveConfig?.branchRawCurves?.[rawBranchKey]) {
    const rawScaled = lookupScaledScore(
      adaptiveConfig.branchRawCurves[rawBranchKey],
      m1Raw + m2Raw
    );
    const clamped = Math.min(800, Math.max(200, roundToNearestTen(rawScaled)));
    const abilityTheta = Number((((clamped - 500) / 100)).toFixed(2));
    return {
      domainScore: clamped,
      weightedEarned: Number(weightedEarned.toFixed(2)),
      weightedMax: Number(weightedMax.toFixed(2)),
      normalizedAbility: Number(normalizedAbility.toFixed(2)),
      abilityTheta,
      equatingBand: [Math.max(200, clamped - 10), Math.min(800, clamped + 10)],
    };
  }

  // Resolve equating curve (custom domain override -> default Bluebook domain curve)
  const curveSet: AdaptiveDomainCurveSet =
    (baselineSectionId && adaptiveConfig?.domainCurves?.[baselineSectionId]) ||
    adaptiveConfig?.domainCurves?.[domainKey] ||
    DEFAULT_DSAT_EQUATING_CURVES[domainKey];

  const activeCurve = tier === "hard" ? curveSet.hard : curveSet.easy;
  const interpolated = lookupScaledScore(activeCurve, normalizedAbility);

  const minFloor = tier === "hard" ? 460 : 200;
  const maxCeiling = tier === "hard" ? 800 : 610;
  const domainScore = Math.min(maxCeiling, Math.max(minFloor, roundToNearestTen(interpolated)));

  // Standardized IRT-proxy theta (-3.00 to +3.00 centered at 500)
  const abilityTheta = Number((((domainScore - 500) / 100)).toFixed(2));

  // Typical ±10–20 pt Standard Error of Measurement (SEM) band on dSAT
  const sem = tier === "hard" ? 10 : 20;
  const equatingBand: [number, number] = [
    Math.max(200, domainScore - sem),
    Math.min(800, domainScore + sem),
  ];

  return {
    domainScore,
    weightedEarned: Number(weightedEarned.toFixed(2)),
    weightedMax: Number(weightedMax.toFixed(2)),
    normalizedAbility: Number(normalizedAbility.toFixed(2)),
    abilityTheta,
    equatingBand,
  };
}

/**
 * Synthesizes adaptive exam results across all completed stages and branches.
 */
export function synthesizeAdaptiveTestScores(
  metadata: TestMetadata,
  resultsMap: Map<string, { numCorrect: number; totalQuestions: number }>,
  itemRecordsBySection?: Map<string, ItemScoringRecord[]>
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
    const baseResult = resultsMap.get(stage.sectionId) || {
      numCorrect: 0,
      totalQuestions: 0,
    };
    const passed = baseResult.numCorrect >= stage.routing.threshold;
    const routedSectionId = passed ? stage.routing.onPass : stage.routing.onFail;
    const routedTier: "hard" | "easy" = passed ? "hard" : "easy";
    const routedResult = resultsMap.get(routedSectionId) || {
      numCorrect: 0,
      totalQuestions: 0,
    };

    const m1Items = itemRecordsBySection?.get(stage.sectionId);
    const m2Items = itemRecordsBySection?.get(routedSectionId);

    if (metadata.category === "SAT") {
      const domainKey = inferSATStageDomain(stage.sectionId, stage.stageIndex, [
        ...(m1Items || []),
        ...(m2Items || []),
      ]);

      const calc = calculateSATDomainScore({
        m1Raw: baseResult.numCorrect,
        m1Total: baseResult.totalQuestions,
        m2Raw: routedResult.numCorrect,
        m2Total: routedResult.totalQuestions,
        tier: routedTier,
        domainKey,
        m1Items,
        m2Items,
        adaptiveConfig: metadata.scoring?.adaptiveConfig,
        baselineSectionId: stage.sectionId,
      });

      stageSummaries.push({
        stageIndex: stage.stageIndex,
        baselineSectionId: stage.sectionId,
        baselineRaw: baseResult.numCorrect,
        baselineTotal: baseResult.totalQuestions,
        routedSectionId,
        routedTier,
        routedRaw: routedResult.numCorrect,
        routedTotal: routedResult.totalQuestions,
        domainScore: calc.domainScore,
        domainKey,
        weightedEarned: calc.weightedEarned,
        weightedMax: calc.weightedMax,
        normalizedAbility: calc.normalizedAbility,
        abilityTheta: calc.abilityTheta,
        equatingBand: calc.equatingBand,
      });
    } else if (metadata.category === "GRE") {
      // Section-adaptive GRE support (130–170 per stage with difficulty tier bonus)
      const combinedRaw = baseResult.numCorrect + routedResult.numCorrect;
      const combinedMax = baseResult.totalQuestions + routedResult.totalQuestions;
      const ratio = combinedMax > 0 ? combinedRaw / combinedMax : 0;
      const floor = routedTier === "hard" ? 148 : 130;
      const ceiling = routedTier === "hard" ? 170 : 156;
      const domainScore = Math.max(
        floor,
        Math.min(ceiling, Math.round(floor + ratio * (ceiling - floor)))
      );

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
        domainKey: "general",
        weightedEarned: combinedRaw,
        weightedMax: combinedMax,
        normalizedAbility: Number((ratio * 100).toFixed(2)),
        abilityTheta: Number((((domainScore - 150) / 10)).toFixed(2)),
        equatingBand: [Math.max(130, domainScore - 1), Math.min(170, domainScore + 1)],
      });
    } else {
      // Default sum fallback for future custom adaptive exams
      const combinedRaw = baseResult.numCorrect + routedResult.numCorrect;
      const combinedMax = baseResult.totalQuestions + routedResult.totalQuestions;
      stageSummaries.push({
        stageIndex: stage.stageIndex,
        baselineSectionId: stage.sectionId,
        baselineRaw: baseResult.numCorrect,
        baselineTotal: baseResult.totalQuestions,
        routedSectionId,
        routedTier,
        routedRaw: routedResult.numCorrect,
        routedTotal: routedResult.totalQuestions,
        domainScore: combinedRaw,
        domainKey: "general",
        weightedEarned: combinedRaw,
        weightedMax: combinedMax,
        normalizedAbility: combinedMax > 0 ? Number(((combinedRaw / combinedMax) * 100).toFixed(2)) : 0,
        abilityTheta: 0,
        equatingBand: [combinedRaw, combinedRaw],
      });
    }
  }

  const compositeScore = stageSummaries.reduce((acc, s) => acc + s.domainScore, 0);

  const trajectoryDescription = stageSummaries
    .map((s) => `Stage ${s.stageIndex}: ${s.routedTier.toUpperCase()}`)
    .join(" | ");

  return {
    compositeScore,
    stageSummaries,
    trajectoryDescription,
  };
}