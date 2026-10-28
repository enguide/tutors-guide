// types/content.ts
import { SectionExamConfig, SupportedExamCategory } from "./examConfig";

export type QuestionType = "MC" | "FR" | "FRQ_HANDWRITTEN";

export type QuestionLayoutMode = "split" | "single";

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
  // Raw score -> Scaled score
  [rawScore: number]: number;
}

export interface APGradeCutoffs {
  // Minimum composite raw score required for each grade (1-5)
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ExamScoringConfig {
  scaleType: "SAT_ADAPTIVE" | "ACT_CONCORDANCE" | "AP_WEIGHTED" | "GRE_SECTION";
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