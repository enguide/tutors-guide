// types/content.ts
import { SectionExamConfig, SupportedExamCategory } from "./examConfig";

export type QuestionType = "MC" | "FR" | "FRQ_HANDWRITTEN";

export type QuestionLayoutMode = "split" | "single";

export type TestLifecycleStatus = "draft" | "published" | "archived";

export interface QuestionOption {
  id: string;
  text: string;
}

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export interface QuestionFrontmatter {
  id: string;
  questionNumber: number;
  questionType: QuestionType;
  correctAnswer: string;
  prompt: string;
  stimulus?: string; // Discrete per-question stimulus / passage
  passage?: string;  // Alias for backward compatibility
  layout?: QuestionLayoutMode;
  options?: QuestionOption[];
  domain?: string;
  skill?: string;
  difficulty?: QuestionDifficulty | string;
  explanation?: string;
}

export interface SectionFrontmatter {
  sectionId: string;
  sectionTitle: string;
  sectionOrder: number;
  timeLimit: number;
  config?: Partial<SectionExamConfig>;
  questions: QuestionFrontmatter[];
}

export interface SectionManifest {
  id: string;
  file: string;
  order: number;
  title: string;
  timeLimit: number;
  config?: Partial<SectionExamConfig>;
  hasIntermissionAfter?: boolean;
  intermissionDuration?: number;
}

export interface AdaptiveRoutingRule {
  threshold: number;
  onPass: string;
  onFail: string;
}

export interface AdaptiveStage {
  stageIndex: number;
  sectionId: string;
  routing: AdaptiveRoutingRule;
}

export interface TestMetadata {
  id: string;
  title: string;
  status?: TestLifecycleStatus; // Defaults to "published" when omitted
  category: SupportedExamCategory;
  description: string;
  config?: Partial<SectionExamConfig>;
  isAdaptive?: boolean;
  stages?: AdaptiveStage[];
  sections: SectionManifest[];
  scoring?: ExamScoringConfig;
}

export interface ParsedSection {
  frontmatter: SectionFrontmatter;
  content: string;
  category?: string;
  testId?: string;
}

export interface LinearCurveMapping {
  // Raw or normalized ability score -> Scaled score
  [scorePoint: number]: number;
}

export interface APGradeCutoffs {
  // Minimum composite raw score required for each grade (1-5)
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface DifficultyWeightMatrix {
  routing: { Easy: number; Medium: number; Hard: number };
  hard: { Easy: number; Medium: number; Hard: number };
  easy: { Easy: number; Medium: number; Hard: number };
}

export interface AdaptiveDomainCurveSet {
  easy: LinearCurveMapping; // Maps normalized weighted ability (0–100) -> 200–610
  hard: LinearCurveMapping; // Maps normalized weighted ability (0–100) -> 460–800
}

export interface AdaptiveScoringConfig {
  difficultyWeights?: Partial<DifficultyWeightMatrix>;
  /**
   * Optional per-test equating curves keyed by domain ("rw" | "math") or stage baseline sectionId.
   * Keys inside `easy` / `hard` map normalized weighted ability (0–100) to 200–800 scaled scores.
   */
  domainCurves?: Record<string, AdaptiveDomainCurveSet>;
  /**
   * Optional explicit raw-score fallback curves keyed by `${sectionId}:easy` or `${sectionId}:hard`.
   */
  branchRawCurves?: Record<string, LinearCurveMapping>;
}

export interface ExamScoringConfig {
  scaleType:
    | "SAT_ADAPTIVE"
    | "SAT_LINEAR"
    | "ACT_CONCORDANCE"
    | "AP_WEIGHTED"
    | "GRE_SECTION"
    | "ACADEMIC_MASTERY";
  percentileTable?: Record<number, string>;
  // For dSAT & adaptive exams: psychometric item weights & branch equating tables
  adaptiveConfig?: AdaptiveScoringConfig;
  // For ACT & standard linear sections: maps sectionId or subject domain to raw->scaled curve
  curves?: Record<string, LinearCurveMapping>;
  // For AP exams: custom section multipliers and composite grade boundaries
  apWeights?: {
    mcSectionIds: string[];
    mcMultiplier: number;     // e.g. 1.2
    frqSectionIds: string[];
    frqMultiplier: number;    // e.g. 1.0
    gradeCutoffs: APGradeCutoffs;
  };
  // For GRE: section-specific scaling tables
  greConfig?: {
    verbalCurves?: Record<string, LinearCurveMapping>;
    quantCurves?: Record<string, LinearCurveMapping>;
  };
}