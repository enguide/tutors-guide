// components/exam/presentationRegistry.ts
import { ExamPresentationTheme } from "@/types/examPresentation";

// Shell Adapters
import { SATLayoutAdapter } from "./shells/sat/SATLayoutAdapter";
import { ACTLayoutAdapter } from "./shells/act/ACTLayoutAdapter";
import { APLayoutAdapter } from "./shells/ap/APLayoutAdapter";
import { GRELayoutAdapter } from "./shells/gre/GRELayoutAdapter";
import { BaseLayoutAdapter } from "./shells/BaseLayoutAdapter";

// Review Modals
import { SectionReviewModal } from "./SectionReviewModal";
import { ACTReviewModalAdapter } from "./themes/act/ACTReviewModalAdapter";

// Directions Modals
import { SectionDirectionsModal } from "./SectionDirectionsModal";

// Authentic Intermission Screens
import { SATIntermissionScreen } from "./themes/sat/SATIntermissionScreen";
import { ACTIntermissionScreen } from "./themes/act/ACTIntermissionScreen";
import { BaseIntermissionScreen } from "./themes/base/BaseIntermissionScreen";

// Module Transition Screens
import { SATModuleTransition } from "./themes/sat/SATModuleTransition";
import { BaseModuleTransition } from "./themes/base/BaseModuleTransition";

export const PRESENTATION_REGISTRY: Record<string, ExamPresentationTheme> = {
  // Digital SAT (Bluebook Layout, In-canvas Check Your Work, Direct Start)
  SAT: {
    Directions: null, // Bluebook has no interstitial directions; accessible via header dropdown
    autoStartSection: true,
    Shell: SATLayoutAdapter,
    Review: () => null,
    Intermission: SATIntermissionScreen,
    Transition: SATModuleTransition,
  },

  // ACT (TestNav Shell, End Test Review, & TestNav Break)
  ACT: {
    Directions: SectionDirectionsModal,
    autoStartSection: false,
    Shell: ACTLayoutAdapter,
    Review: ACTReviewModalAdapter,
    Intermission: ACTIntermissionScreen,
    Transition: BaseModuleTransition,
  },

  // AP Examinations
  AP_CALC: {
    Directions: SectionDirectionsModal,
    autoStartSection: false,
    Shell: APLayoutAdapter,
    Review: SectionReviewModal,
    Intermission: BaseIntermissionScreen,
    Transition: BaseModuleTransition,
  },

  // GRE (ETS PowerPrep)
  GRE: {
    Directions: SectionDirectionsModal,
    autoStartSection: false,
    Shell: GRELayoutAdapter,
    Review: SectionReviewModal,
    Intermission: BaseIntermissionScreen,
    Transition: BaseModuleTransition,
  },

  // Fallback for Collegiate Academic Courses & Chapter Quizzes
  DEFAULT: {
    Directions: SectionDirectionsModal,
    autoStartSection: false,
    Shell: BaseLayoutAdapter,
    Review: SectionReviewModal,
    Intermission: BaseIntermissionScreen,
    Transition: BaseModuleTransition,
  },
};

export function resolveExamTheme(category?: string): ExamPresentationTheme {
  if (!category) return PRESENTATION_REGISTRY.DEFAULT;
  const normalized = category.trim().toUpperCase();
  return PRESENTATION_REGISTRY[normalized] || PRESENTATION_REGISTRY.DEFAULT;
}