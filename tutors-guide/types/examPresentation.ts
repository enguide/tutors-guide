// types/examPresentation.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParsedSection, TestMetadata, QuestionFrontmatter } from "@/types/content";
import { SectionExamConfig, SupportedExamCategory } from "@/types/examConfig";
import { AccommodationSettings } from "@/types/accommodations";
import { TestShellLayoutProps } from "@/types/examLayout";

export interface DirectionsProps {
  category: SupportedExamCategory;
  testTitle: string;
  sectionTitle: string;
  questionCount: number;
  timeLimitSeconds: number;
  config: SectionExamConfig;
  isResuming: boolean;
  onBeginSection: () => void;
}

export interface ReviewProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  testId: string;
  sectionId: string;
  sectionTitle: string;
  questions: QuestionFrontmatter[];
  answers: Record<string, any>;
  onJumpToQuestion: (index: number) => void;
}

export interface IntermissionProps {
  testId: string;
  category: string;
  remainingSeconds: number;
  formattedTime: string;
  isMounted: boolean;
  onResumeEarly: () => void;
}

export interface TransitionProps {
  category?: SupportedExamCategory | string;
  testTitle?: string;
  sectionTitle?: string;
}

export interface ExamPresentationTheme {
  Directions?: React.FC<DirectionsProps> | null;
  Shell: React.FC<TestShellLayoutProps>;
  Review: React.FC<ReviewProps>;
  Intermission?: React.FC<IntermissionProps>;
  Transition?: React.FC<TransitionProps>;
  autoStartSection?: boolean; // When true, starts directly into the section shell
}