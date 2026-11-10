// components/exam/ExamClient.tsx
"use client";

import React, { useState, useCallback, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ParsedSection, TestMetadata } from "@/types/content";
import { SectionExamConfig, SupportedExamCategory } from "@/types/examConfig";
import {
  AccommodationSettings,
  DEFAULT_ACCOMMODATIONS,
} from "@/types/accommodations";
import {
  useTestProgress,
  ServerCheckpointData,
  ServerResponseRecord,
} from "@/hooks/useTestProgress";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

import { CalculatorToolbar } from "../tools/CalculatorToolbar";
import { FormulaSheetModal } from "../tools/FormulaSheetModal";
import { TestPreFlightModal } from "./TestPreFlightModal";
import { completeTestSection } from "@/actions/completeTestSection";
import { Category } from "@prisma/client";
import { ExamErrorBoundary } from "./ExamErrorBoundary";
import { resolveExamTheme } from "./presentationRegistry";
import { BaseModuleTransition } from "./themes/base/BaseModuleTransition";
import { useExamNavigationLock } from "@/hooks/useExamNavigationLock";

export interface ExtendedServerCheckpointData extends ServerCheckpointData {
  accommodations?: AccommodationSettings | null;
}

interface ExamClientProps {
  metadata: TestMetadata;
  section: ParsedSection;
  effectiveConfig: SectionExamConfig;
  category?: string;
  testId?: string;
  studentName?: string;
  serverCheckpoint?: ExtendedServerCheckpointData | null;
  serverResponses?: ServerResponseRecord[];
  isExamAttemptStarted?: boolean;
  serverAccommodations?: AccommodationSettings | null;
}

const emptySubscribe = () => () => {};

export const ExamClient: React.FC<ExamClientProps> = ({
  metadata,
  section,
  effectiveConfig,
  category = metadata.category,
  testId = metadata.id,
  studentName,
  serverCheckpoint,
  serverResponses = [],
  isExamAttemptStarted = false,
  serverAccommodations = null,
}) => {
  const router = useRouter();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { frontmatter } = section;
  const questions = frontmatter.questions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const manifestBasePath = (metadata as any).assetBasePath;
  const examCat = (category.toUpperCase() || metadata.category) as SupportedExamCategory;

  const theme = resolveExamTheme(category);
  const accommodationsKey = `attempt_accommodations_${testId}`;

  // Accommodations hierarchy: Database record -> LocalStorage -> Default Fallback
  const [accommodations, setAccommodations] = useState<AccommodationSettings>(() => {
    if (serverAccommodations) return serverAccommodations;
    if (serverCheckpoint?.accommodations) return serverCheckpoint.accommodations;
    if (typeof window === "undefined") return DEFAULT_ACCOMMODATIONS;
    try {
      const stored = localStorage.getItem(accommodationsKey);
      return stored ? JSON.parse(stored) : DEFAULT_ACCOMMODATIONS;
    } catch {
      return DEFAULT_ACCOMMODATIONS;
    }
  });

  // SINGLE SOURCE OF TRUTH:
  // If the server confirmed the exam attempt is already started, preflight NEVER opens.
  // Otherwise, it checks if local storage has it, falling back to opening on section 1.
  const [isPreFlightOpen, setIsPreFlightOpen] = useState<boolean>(() => {
    if (isExamAttemptStarted) return false;
    if (typeof window === "undefined") return true;
    return !Boolean(localStorage.getItem(accommodationsKey));
  });

  // Section timing remains completely dormant if the preflight modal is displayed
  const [isSectionStarted, setIsSectionStarted] = useState<boolean>(() => {
    if (isExamAttemptStarted) {
      return Boolean(theme.autoStartSection);
    }
    return false;
  });

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveTimeLimitSeconds = Math.round(
    frontmatter.timeLimit * accommodations.timeMultiplier
  );

  // STRICT TIMER AND AUTOSAVE GATE:
  // Timer and background checkpoint syncs NEVER run while the pre-flight modal is displayed
  const isTimerActuallyRunning = !isPreFlightOpen && isSectionStarted && !isSubmitting;

  const {
    activeQuestion,
    currentIndex,
    setCurrentIndex,
    secondsRemaining,
    answers,
    navigationHistory,
    syncStatus,
    isCrossOutMode,
    setIsCrossOutMode,
    isCalculatorOpen,
    setIsCalculatorOpen,
    toggleCalculator,
    markCalculatorUsed,
    isFormulaSheetOpen,
    setIsFormulaSheetOpen,
    selectOption,
    setFrqAnswer,
    toggleEliminateOption,
    toggleFlag,
    getFinalizedAnswers,
    getFinalizedNavigationHistory,
    clearLocalBuffer,
    clearAllTestBuffers,
    resetTimeLimit,
  } = useTestProgress({
    testId,
    sectionId: frontmatter.sectionId,
    sectionOrder: frontmatter.sectionOrder,
    timeLimitSeconds: frontmatter.timeLimit,
    timeExtensionMultiplier: accommodations.timeMultiplier,
    questions,
    isTimerRunning: isTimerActuallyRunning,
    onTimeExpired: () => {
      handleSubmitSection();
    },
    serverCheckpoint,
    serverResponses,
  });

  // Direct check if THIS SPECIFIC SECTION is being resumed mid-way
  const isResumingThisSection = useMemo(() => {
    if (serverCheckpoint && serverCheckpoint.timeRemainingSeconds < effectiveTimeLimitSeconds) {
      return true;
    }
    if (serverResponses.length > 0) {
      return true;
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`test_progress_${testId}_${frontmatter.sectionId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.secondsRemaining && parsed.secondsRemaining < effectiveTimeLimitSeconds) {
            return true;
          }
        }
      } catch {}
    }
    return false;
  }, [serverCheckpoint, serverResponses, testId, frontmatter.sectionId, effectiveTimeLimitSeconds]);

  // Trap accidental browser back buttons, tab close, and page reloads during active exam testing
  useExamNavigationLock({
    enabled: isTimerActuallyRunning,
    onAttemptBack: () => {
      alert("Browser back navigation is locked during active exam sections. Please use the question navigator or footer controls.");
    },
  });

  const handleAccommodationsConfirmed = (selected: AccommodationSettings) => {
    setAccommodations(selected);
    try {
      localStorage.setItem(accommodationsKey, JSON.stringify(selected));
    } catch {}

    const newEffectiveSeconds = Math.round(frontmatter.timeLimit * selected.timeMultiplier);

    // Only reset time limit if starting fresh in section 1
    if (!isResumingThisSection) {
      resetTimeLimit(newEffectiveSeconds);
    }

    setIsPreFlightOpen(false);

    if (theme.autoStartSection) {
      setIsSectionStarted(true);
    }
  };

  const handleBeginSection = () => {
    setIsSectionStarted(true);
  };

  const handleSubmitSection = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const finalAnswers = getFinalizedAnswers();
      const finalNavHistory = getFinalizedNavigationHistory();

      const result = await completeTestSection({
        testId,
        testTitle: metadata.title,
        category: metadata.category as Category,
        sectionId: frontmatter.sectionId,
        sectionOrder: frontmatter.sectionOrder,
        timeRemainingSeconds: secondsRemaining,
        navigationHistory: finalNavHistory,
        questions,
        clientAnswers: finalAnswers,
        accommodations,
      });

      if (!result.success) {
        alert(result.error || "Failed to submit section.");
        setIsSubmitting(false);
        return;
      }

      clearLocalBuffer();
      setIsReviewOpen(false);

      if (result.isTestComplete || !result.nextSectionId) {
        try {
          clearAllTestBuffers(testId);
          localStorage.removeItem(accommodationsKey);
        } catch {}
        router.push(`/tests/${metadata.category.toLowerCase()}/${testId}/results`);
        return;
      }

      if (result.isIntermission) {
        router.push(`/tests/${metadata.category.toLowerCase()}/${testId}/break`);
        return;
      }

      router.push(`/tests/${metadata.category.toLowerCase()}/${testId}/${result.nextSectionId}`);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("An unexpected error occurred while finalizing the section.");
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    testId,
    metadata,
    frontmatter,
    secondsRemaining,
    questions,
    accommodations,
    accommodationsKey,
    getFinalizedAnswers,
    getFinalizedNavigationHistory,
    clearLocalBuffer,
    clearAllTestBuffers,
    router,
  ]);

  const { speak, stop, isPlaying: isTTSPlaying, isSupported: isTTSSupported } =
    useTextToSpeech();

  const handleToggleTTS = () => {
    if (isTTSPlaying) {
      stop();
    } else if (activeQuestion) {
      speak(`${activeQuestion.prompt}`);
    }
  };

  // Derive exam-level scope and metrics (accounting for multi-stage adaptive branches)
  const { totalDuration, totalModules, totalQuestions } = useMemo(() => {
    const sections = metadata.sections || [];

    if (metadata.isAdaptive || metadata.stages?.length) {
      const uniqueOrders = new Map<number, number>();
      for (const s of sections) {
        if (!uniqueOrders.has(s.order)) {
          uniqueOrders.set(s.order, s.timeLimit || 0);
        }
      }

      const calculatedTime = Array.from(uniqueOrders.values()).reduce((sum, val) => sum + val, 0);

      return {
        totalDuration: calculatedTime > 0 ? calculatedTime : 8040,
        totalModules: uniqueOrders.size || 4,
        totalQuestions: examCat === "SAT" ? 98 : undefined,
      };
    }

    const calculatedTime = sections.reduce((sum, s) => sum + (s.timeLimit || 0), 0);
    return {
      totalDuration: calculatedTime > 0 ? calculatedTime : frontmatter.timeLimit,
      totalModules: sections.length || 1,
      totalQuestions: undefined,
    };
  }, [metadata, frontmatter.timeLimit, examCat]);

  if (!isMounted) {
    return (
      <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-background">
        <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 flex items-center justify-between shrink-0">
          <div className="h-4 w-48 bg-neutral-200 dark:border-neutral-800 rounded animate-pulse" />
          <div className="h-6 w-20 bg-neutral-100 dark:bg-neutral-800 rounded-full animate-pulse" />
        </header>
        <main className="flex-1 bg-neutral-50 dark:bg-neutral-950" />
        <footer className="h-16 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0" />
      </div>
    );
  }

  // Active theme-based submission transition screen
  if (isSubmitting) {
    const TransitionComponent = theme.Transition || BaseModuleTransition;
    return (
      <TransitionComponent
        category={examCat}
        testTitle={metadata.title}
        sectionTitle={frontmatter.sectionTitle}
      />
    );
  }

  // 1. Preflight modal ONLY displayed at the very start of the entire test attempt
  if (isPreFlightOpen) {
    return (
      <TestPreFlightModal
        category={examCat}
        testTitle={metadata.title}
        totalBaseDurationSeconds={totalDuration}
        totalModulesCount={totalModules}
        totalQuestionsCount={totalQuestions}
        firstSectionTitle={frontmatter.sectionTitle}
        initialAccommodations={accommodations}
        onStartExam={handleAccommodationsConfirmed}
      />
    );
  }

  // 2. Interstitial directions modal for non-autostart categories (ACT, AP, GRE)
  if (!isSectionStarted && theme.Directions) {
    const DirectionsComponent = theme.Directions;
    return (
      <DirectionsComponent
        category={examCat}
        testTitle={metadata.title}
        sectionTitle={frontmatter.sectionTitle}
        questionCount={questions.length}
        timeLimitSeconds={isResumingThisSection ? secondsRemaining : effectiveTimeLimitSeconds}
        config={effectiveConfig}
        isResuming={isResumingThisSection}
        onBeginSection={handleBeginSection}
      />
    );
  }

  const activeAnswer = activeQuestion ? answers[activeQuestion.id] : undefined;
  const ShellComponent = theme.Shell;
  const ReviewComponent = theme.Review;

  return (
    <ExamErrorBoundary testId={testId} sectionId={frontmatter.sectionId}>
      <ShellComponent
        category={examCat}
        metadata={metadata}
        section={section}
        effectiveConfig={effectiveConfig}
        manifestBasePath={manifestBasePath}
        studentName={studentName}
        state={{
          currentIndex,
          totalQuestions: questions.length,
          secondsRemaining,
          syncStatus,
          activeQuestion,
          activeAnswer,
          answers,
          isCrossOutMode,
          isTTSPlaying,
          isTTSSupported,
          isCalculatorOpen,
          isFormulaSheetOpen,
          accommodations,
        }}
        actions={{
          setCurrentIndex,
          selectOption,
          setFrqAnswer,
          toggleEliminateOption,
          toggleFlag,
          toggleCrossOut: () => setIsCrossOutMode((prev) => !prev),
          toggleCalculator,
          openFormulaSheet: () => setIsFormulaSheetOpen((prev) => !prev),
          toggleTTS: handleToggleTTS,
          openReviewModal: () => setIsReviewOpen(true),
          submitSection: handleSubmitSection,
        }}
      />

      <CalculatorToolbar
        type={effectiveConfig.calculator}
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onInteract={markCalculatorUsed}
      />

      <FormulaSheetModal
        sheetId={effectiveConfig.formulaSheetId}
        isOpen={isFormulaSheetOpen}
        onClose={() => setIsFormulaSheetOpen(false)}
      />

      <ReviewComponent
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSubmit={handleSubmitSection}
        isSubmitting={isSubmitting}
        testId={testId}
        sectionId={frontmatter.sectionId}
        sectionTitle={frontmatter.sectionTitle}
        questions={questions}
        answers={answers}
        onJumpToQuestion={(idx) => setCurrentIndex(idx)}
      />
    </ExamErrorBoundary>
  );
};