// types/content.ts
import { SectionExamConfig, SupportedExamCategory } from "./examConfig";

export type QuestionType = "MC" | "FR";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuestionFrontmatter {
  id: string;
  questionNumber: number;
  questionType: QuestionType;
  correctAnswer: string;
  prompt: string;
  options?: QuestionOption[];
}

export interface SectionFrontmatter {
  sectionId: string;
  sectionTitle: string;
  sectionOrder: number;
  timeLimit: number;
  config?: Partial<SectionExamConfig>; // Section-level overrides
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
  config?: Partial<SectionExamConfig>; // Exam-wide overrides
  sections: SectionManifest[];
}

export interface ParsedSection {
  frontmatter: SectionFrontmatter;
  content: string;
}