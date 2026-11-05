// config/pricing.ts

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
  entitlements: string[]; // e.g. ["SAT"], ["AP:CALC"], ["ACADEMIC:DIFF_EQ"]
  description: string;
  features: string[];
}

export const PRICING_TIERS: Record<string, PricingTier> = {
  // --- Standardized Exams ---
  ALL_ADMISSIONS: {
    key: "ALL_ADMISSIONS",
    category: "college-admissions",
    title: "Dual SAT & ACT Program",
    badge: "Comprehensive",
    popular: true,
    priceCents: 25000,
    entitlements: ["SAT", "ACT"],
    description: "Complete diagnostic access across both exams.",
    features: ["Digital SAT", "Full ACT", "One year access"],
  },
  SAT: {
    key: "SAT",
    category: "college-admissions",
    title: "Digital SAT Diagnostic Program",
    priceCents: 15000,
    entitlements: ["SAT"],
    description: "Official-fidelity practice matching Bluebook.",
    features: ["Adaptive stages", "One year access"],
  },
  ACT: {
    key: "ACT",
    category: "college-admissions",
    title: "ACT Diagnostic Program",
    priceCents: 15000,
    entitlements: ["ACT"],
    description: "Authentic full-length practice mirroring TestNav.",
    features: ["Standard 4-section", "One year access"],
  },
  GRE: {
    key: "GRE",
    category: "graduate",
    title: "GRE Diagnostic Program",
    badge: "Graduate",
    priceCents: 18000,
    entitlements: ["GRE"],
    description: "Section-adaptive testing calibrated for graduate admissions.",
    features: ["Quant and Verbal modules", "One year access"],
  },

  // --- AP Subjects (Sold Individually) ---
  AP_CALC: {
    key: "AP_CALC",
    category: "academic",
    title: "AP Calculus AB/BC Diagnostic",
    badge: "AP Exam",
    priceCents: 12000,
    entitlements: ["AP:CALC"],
    description: "Full modular diagnostic coverage across core AB and BC units.",
    features: ["FRQ and MC questions", "One year access"],
  },
  AP_PHYS_C: {
    key: "AP_PHYS_C",
    category: "academic",
    title: "AP Physics C: Mechanics",
    badge: "AP Exam",
    priceCents: 12000,
    entitlements: ["AP:PHYS_C"],
    description: "Calculus-based physics diagnostic sets.",
    features: ["Rotational dynamics, work/energy", "One year access"],
  },

  // --- Collegiate Academic Courses (Sold Individually) ---
  ACADEMIC_DIFF_EQ: {
    key: "ACADEMIC_DIFF_EQ",
    category: "academic",
    title: "Differential Equations: Chapter Mastery Drills",
    badge: "Collegiate",
    priceCents: 9500, // $95.00
    entitlements: ["ACADEMIC:DIFF_EQ"],
    description: "Chapter-by-chapter problem sets for ODEs, Laplace transforms, and systems.",
    features: [
      "Chapter 1-8 problem sets with step-by-step math evaluation",
      "Raw percentage scores and diagnostic breakdown",
      "Handwritten work capture and audit support",
      "One full academic year of access",
    ],
  },
  ACADEMIC_LIN_ALG: {
    key: "ACADEMIC_LIN_ALG",
    category: "academic",
    title: "Linear Algebra: Problem Sets & Drills",
    badge: "Collegiate",
    priceCents: 9500,
    entitlements: ["ACADEMIC:LIN_ALG"],
    description: "Vector spaces, eigenvalues, diagonalization, and inner products.",
    features: [
      "Comprehensive chapter diagnostics",
      "Raw percentage accuracy telemetry",
      "One full academic year of access",
    ],
  },
};