// types/examLayout.ts
import { QuestionFrontmatter, ParsedSection, TestMetadata } from "@/types/content";
import { SectionExamConfig, SupportedExamCategory } from "@/types/examConfig";
import { AccommodationSettings } from "@/types/accommodations";
import { SyncStatus } from "@/hooks/useTestProgress";

export interface TestShellState {
  currentIndex: number;
  totalQuestions: number;
  secondsRemaining: number;
  syncStatus?: SyncStatus;
  activeQuestion: QuestionFrontmatter;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeAnswer?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answers: Record<string, any>;
  isCrossOutMode: boolean;
  isTTSPlaying: boolean;
  isTTSSupported: boolean;
  isCalculatorOpen?: boolean;
  isFormulaSheetOpen?: boolean;
  accommodations: AccommodationSettings;
}

export interface TestShellActions {
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
  submitSection: () => void;
}

export interface TestShellLayoutProps {
  category: SupportedExamCategory;
  metadata: TestMetadata;
  section: ParsedSection;
  effectiveConfig: SectionExamConfig;
  manifestBasePath?: string;
  studentName?: string;
  state: TestShellState;
  actions: TestShellActions;
}