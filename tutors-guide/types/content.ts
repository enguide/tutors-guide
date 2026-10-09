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
  options?: QuestionOption[];
  
  // Granular Diagnostic Analytics Metadata (Optional with fallbacks)
  domain?: string;              // e.g. "Craft and Structure", "Algebra", "Advanced Math"
  skill?: string;               // e.g. "Words in Context", "Linear Equations", "Function Notation"
  difficulty?: QuestionDifficulty | string; // "Easy" | "Medium" | "Hard"
  explanation?: string;         // Comprehensive rationale for review
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
}

export interface TestMetadata {
  id: string;
  title: string;
  category: SupportedExamCategory;
  description: string;
  config?: Partial<SectionExamConfig>;
  sections: SectionManifest[];
}

// types/content.ts
export interface ParsedSection {
  frontmatter: SectionFrontmatter;
  content: string;
  category?: string;
  testId?: string;
}