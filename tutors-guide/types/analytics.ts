// types/analytics.ts
import { Category, QuestionType } from "@prisma/client";

export interface EnrichedResponseItem {
  id: string;
  questionId: string;
  responseOrder: number;
  sectionOrder: number;
  sectionId: number | string;
  responseType: QuestionType;
  selectedOptionId?: string | null;
  frqUserAnswer?: string | null;
  correctAnswerKey: string;
  isCorrect: boolean;
  timeSpentOnResponse: number;
  usedCalculator?: boolean;
  changedAnswer?: boolean;
  prompt: string;
  passageText?: string | null; // <--- ADD THIS
  options: { id: string; text: string }[];
  domain: string;
  skill: string;
  difficulty: string;
  explanation: string;
}

export interface SectionResultData {
  id: string;
  sectionId: string;
  testTitle: string;
  numCorrect: number;
  totalQuestions: number;
  rawScore: number;
  scaledScore: number | null;
  timeRemainingSeconds: number;
  navigationHistory: { time: number; qIdx: number }[] | null;
  section: {
    id: string;
    title: string;
    sectionOrder: number;
    timeLimit: number;
  };
}

export interface TestSummaryData {
  id: string;
  testId: string;
  testTitle: string;
  category: Category;
  compositeScore: number | null;
  percentile: string | null;
  completedAt: Date;
}

// Category pacing benchmarks in seconds per question
export const CATEGORY_PACING_TARGETS: Record<string, Record<string, number>> = {
  SAT: {
    reading_writing: 71, // 32 min / 27 questions ≈ 71s
    math: 95,            // 35 min / 22 questions ≈ 95s
    default: 80,
  },
  ACT: {
    english: 36,
    math: 60,
    reading: 52,
    science: 52,
    default: 50,
  },
  AP_CALC: {
    default: 120,
  },
  GRE: {
    verbal: 90,
    quantitative: 105,
    default: 95,
  },
};