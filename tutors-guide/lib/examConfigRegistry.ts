// lib/examConfigRegistry.ts
import { SectionExamConfig, SupportedExamCategory } from "@/types/examConfig";

export const DEFAULT_EXAM_CONFIGS: Record<SupportedExamCategory, SectionExamConfig> = {
  SAT: {
    layout: "split-passage",
    calculator: "desmos-graphing",
    hasFormulaSheet: true,
    formulaSheetId: "sat-standard",
    hasCrossOutMode: true,
    allowBacktracking: true,
    allowSectionReview: true,
  },
  ACT: {
    layout: "split-passage",
    calculator: "none", // Standard ACT uses handhelds; disabled by default unless specified
    hasFormulaSheet: false,
    hasCrossOutMode: true,
    allowBacktracking: true,
    allowSectionReview: true,
  },
  AP_CALC: {
    layout: "single-column",
    calculator: "none", // Part A: None; Part B: Graphing (overridden per section)
    hasFormulaSheet: false,
    hasCrossOutMode: true,
    allowBacktracking: true,
    allowSectionReview: true,
  },
  GRE: {
    layout: "single-column",
    calculator: "gre-basic",
    hasFormulaSheet: false,
    hasCrossOutMode: false,
    allowBacktracking: true,
    allowSectionReview: true,
  },
};

/**
 * Resolves configuration for an active section with cascading precedence:
 * Default Category Preset -> Exam-level overrides -> Section-level overrides
 */
export function resolveSectionConfig(
  category: SupportedExamCategory,
  examOverrides?: Partial<SectionExamConfig>,
  sectionOverrides?: Partial<SectionExamConfig>
): SectionExamConfig {
  const baseDefaults = DEFAULT_EXAM_CONFIGS[category] || DEFAULT_EXAM_CONFIGS.SAT;
  return {
    ...baseDefaults,
    ...(examOverrides || {}),
    ...(sectionOverrides || {}),
  };
}