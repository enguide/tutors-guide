// types/content.ts
import { SectionExamConfig, SupportedExamCategory } from "./examConfig";

export type QuestionType = "MC" | "FR";

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
}

export interface ParsedSection {
  frontmatter: SectionFrontmatter;
  content: string;
  category?: string;
  testId?: string;
}