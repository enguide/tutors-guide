// lib/scoring/curveEngine.ts
import { SupportedExamCategory } from "@/types/examConfig";

export interface TestScoreCurve {
  // Maps raw score -> scaled score (e.g. 54 -> 800)
  [rawScore: number]: number;
}

export interface ExamCurveDefinition {
  testId: string;
  category: SupportedExamCategory;
  // Scaled sections (e.g., "English", "Math" for SAT; "English", "Math", "Reading", "Science" for ACT)
  sectionCurves: Record<string, TestScoreCurve>;
  calculateComposite: (sectionScaledScores: Record<string, number>) => number;
}

// SAT Default Conversion Curves (can be overridden per test)
export const DEFAULT_SAT_CURVE: ExamCurveDefinition = {
  testId: "default-sat",
  category: "SAT",
  sectionCurves: {
    English: {
      0: 200, 5: 210, 10: 290, 15: 360, 20: 410, 25: 470, 30: 560,
      35: 610, 40: 660, 45: 710, 50: 760, 53: 790, 54: 800,
    },
    Math: {
      0: 200, 5: 210, 10: 290, 15: 390, 20: 490, 25: 540, 30: 590,
      35: 650, 40: 750, 42: 780, 43: 790, 44: 800,
    },
  },
  calculateComposite: (scores) => {
    const eng = scores["English"] ?? 200;
    const math = scores["Math"] ?? 200;
    return eng + math;
  },
};

// Interpolate nearest scaled score if raw score falls between curve definitions
export function lookupScaledScore(curve: TestScoreCurve, rawScore: number): number {
  if (curve[rawScore] !== undefined) return curve[rawScore];
  
  const rawPoints = Object.keys(curve).map(Number).sort((a, b) => a - b);
  if (rawPoints.length === 0) return rawScore;

  if (rawScore <= rawPoints[0]) return curve[rawPoints[0]];
  if (rawScore >= rawPoints[rawPoints.length - 1]) {
    return curve[rawPoints[rawPoints.length - 1]];
  }

  // Linear interpolation between the two closest points
  let lower = rawPoints[0];
  let upper = rawPoints[rawPoints.length - 1];
  for (let i = 0; i < rawPoints.length - 1; i++) {
    if (rawScore >= rawPoints[i] && rawScore <= rawPoints[i + 1]) {
      lower = rawPoints[i];
      upper = rawPoints[i + 1];
      break;
    }
  }

  const ratio = (rawScore - lower) / (upper - lower);
  return Math.round(curve[lower] + ratio * (curve[upper] - curve[lower]));
}