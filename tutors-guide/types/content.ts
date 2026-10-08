export type QuestionType = "MC" | "FR";

export interface QuestionOption {
  id: string; // "A", "B", "C", "D"
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
  questions: QuestionFrontmatter[];
}

export interface SectionManifest {
  id: string;
  file: string;
  order: number;
  title: string;
  timeLimit: number;
}

export interface TestMetadata {
  id: string;
  title: string;
  category: "SAT" | "ACT";
  description: string;
  sections: SectionManifest[];
}

export interface ParsedSection {
  frontmatter: SectionFrontmatter;
  content: string; // Raw markdown passage/intro
}