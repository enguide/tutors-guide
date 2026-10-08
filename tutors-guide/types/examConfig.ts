// types/examConfig.ts

export type CalculatorType =
  | "none"
  | "desmos-graphing"
  | "gre-basic"
  | "scientific";

export type LayoutVariant =
  | "split-passage"     // SAT RW, ACT Reading/English/Science (Passage left, Question right)
  | "single-column"     // Math modules, AP Calculus
  | "quant-comparison"; // GRE Quantitative sections

export interface SectionExamConfig {
  layout: LayoutVariant;
  calculator: CalculatorType;
  hasFormulaSheet: boolean;
  formulaSheetId?: "sat-standard" | "ap-calc" | "none";
  hasCrossOutMode: boolean;
  allowBacktracking: boolean;
  allowSectionReview: boolean;
}

export type SupportedExamCategory = "SAT" | "ACT" | "AP_CALC" | "GRE";