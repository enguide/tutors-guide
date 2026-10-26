// config/pricing.ts
import { Category } from "@prisma/client";

export type ExamCategory = "college-admissions" | "academic" | "graduate";

export interface PricingCategoryConfig {
  id: ExamCategory;
  label: string;
}

export const EXAM_CATEGORIES: PricingCategoryConfig[] = [
  { id: "college-admissions", label: "SAT & ACT Examinations" },
  { id: "academic", label: "Academic Exams" },
  { id: "graduate", label: "Graduate Entrance" },
];

export interface PricingTier {
  key: string;
  category: ExamCategory;
  title: string;
  badge?: string;
  popular?: boolean;
  priceCents: number;
  categories: Category[];
  description: string;
  features: string[];
}

export const PRICING_TIERS: Record<string, PricingTier> = {
  ALL: {
    key: "ALL",
    category: "college-admissions",
    title: "Dual SAT & ACT Program",
    badge: "Comprehensive",
    popular: true,
    priceCents: 25000, // $250.00
    categories: [Category.SAT, Category.ACT],
    description: "Complete diagnostic access across both exams to determine natural test fit and maximize scoring potential.",
    features: [
      "Complete suite of Digital SAT adaptive exams (Bluebook emulation)",
      "Complete suite of full-length ACT diagnostic exams (TestNav emulation)",
      "Side-by-side diagnostic comparison to identify which exam favors the student",
      "Behavioral audits tracking time spent, question navigation order, and revised answers",
      "Granular error analysis by sub-skill and question format",
      "Full question reviews with clear, thorough explanations",
      "One full year of access across both testing suites",
    ],
  },
  SAT: {
    key: "SAT",
    category: "college-admissions",
    title: "Digital SAT Diagnostic Program",
    priceCents: 15000, // $150.00
    categories: [Category.SAT],
    description: "Official-fidelity practice matching the College Board Bluebook testing experience and adaptive stages.",
    features: [
      "True multi-stage adaptive testing (CAT) with easy and hard route calibration",
      "Item-by-item timing traces to spot pacing bottlenecks and fatigue",
      "Answer-change audit revealing whether second-guessing improved or reduced accuracy",
      "Question triage filterable by domain, skill, and difficulty tier",
      "Thorough, step-by-step written explanations for every question",
      "One full year of testing and review access",
    ],
  },
  ACT: {
    key: "ACT",
    category: "college-admissions",
    title: "ACT Diagnostic Program",
    priceCents: 15000, // $150.00
    categories: [Category.ACT],
    description: "Authentic full-length practice mirroring official ACT TestNav presentation, timing, and section transitions.",
    features: [
      "Standard 4-section full-length diagnostic exams with authentic breaks",
      "Official TestNav interface presentation, tools, and contrast modes",
      "Stamina and fatigue analytics tracking accuracy decline across late sections",
      "Skill-by-skill performance radar across English, Math, Reading, and Science",
      "In-depth answer explanations dissecting correct options and distractors",
      "One full year of testing and review access",
    ],
  },
  AP_CALC: {
    key: "AP_CALC",
    category: "academic",
    title: "AP Calculus Diagnostic Program",
    badge: "Academic",
    popular: true,
    priceCents: 12000, // $120.00
    categories: [Category.AP_CALC],
    description: "Rigorous curriculum coverage for AB and BC problem sets with comprehensive solution steps.",
    features: [
      "Full modular diagnostic coverage across core AB and BC units",
      "Algorithmic grading for both free-response and multiple-choice questions",
      "Calculator vs. non-calculator section pacing metrics",
      "Error diagnosis categorized by conceptual topic and theorem application",
      "Step-by-step solution derivations for all question sets",
      "One full year of testing and review access",
    ],
  },
  GRE: {
    key: "GRE",
    category: "graduate",
    title: "GRE Diagnostic Program",
    badge: "Graduate",
    popular: true,
    priceCents: 18000, // $180.00
    categories: [Category.GRE],
    description: "Section-adaptive testing calibrated for competitive graduate and professional admissions.",
    features: [
      "Authentic section-level adaptive routing mechanics",
      "Numeric-entry and multi-select question format grading",
      "Time-per-question analysis to pinpoint pacing traps",
      "Granular diagnostic review by quantitative and verbal sub-domains",
      "In-depth answer explanations and solution pathways",
      "One full year of testing and review access",
    ],
  },
};