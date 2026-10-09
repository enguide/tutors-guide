/* eslint-disable @typescript-eslint/no-explicit-any */
// types/examLayout.ts
import React from "react";
import { SupportedExamCategory, SectionExamConfig } from "@/types/examConfig";
import { QuestionFrontmatter, ParsedSection, TestMetadata } from "@/types/content";
import { AccommodationSettings } from "@/types/accommodations";

export interface TestShellExamState {
  currentIndex: number;
  totalQuestions: number;
  secondsRemaining: number;
  activeQuestion: QuestionFrontmatter;
  activeAnswer?: {
    selectedOptionId?: string;
    frqUserAnswer?: string;
    eliminatedOptions?: string[];
    flagged?: boolean;
  };
  answers: Record<string, any>;
  isCrossOutMode: boolean;
  isTTSPlaying: boolean;
  isTTSSupported: boolean;
  accommodations: AccommodationSettings;
}

export interface TestShellExamActions {
  setCurrentIndex: (index: number | ((prev: number) => number)) => void;
  selectOption: (optionId: string) => void;
  setFrqAnswer: (value: string) => void;
  toggleEliminateOption: (optionId: string) => void;
  toggleFlag: () => void;
  toggleCrossOut: () => void;
  toggleCalculator: () => void;
  openFormulaSheet: () => void;
  toggleTTS: () => void;
  openReviewModal: () => void;
}

export interface TestShellLayoutProps {
  category: SupportedExamCategory;
  metadata: TestMetadata;
  section: ParsedSection;
  effectiveConfig: SectionExamConfig;
  manifestBasePath?: string;
  state: TestShellExamState;
  actions: TestShellExamActions;
  children?: React.ReactNode;
}