/* eslint-disable @typescript-eslint/no-explicit-any */
// components/exam/ExamClient.tsx
"use client";

import React, { useState, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ParsedSection, TestMetadata } from "@/types/content";
import { SectionExamConfig, SupportedExamCategory } from "@/types/examConfig";
import {
  AccommodationSettings,
  DEFAULT_ACCOMMODATIONS,
} from "@/types/accommodations";
import { useTestProgress } from "@/hooks/useTestProgress";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { CalculatorToolbar } from "../tools/CalculatorToolbar";
import { FormulaSheetModal } from "../tools/FormulaSheetModal";
import { SectionReviewModal } from "./SectionReviewModal";
import { TestPreFlightModal } from "./TestPreFlightModal";
import { SectionDirectionsModal } from "./SectionDirectionsModal";
import { completeTestSection } from "@/actions/completeTestSection";
import { Category } from "@prisma/client";
import { TestShellLayout } from "./shells/TestShellLayout";

interface ExamClientProps {
  metadata: TestMetadata;
  section: ParsedSection;
  effectiveConfig: SectionExamConfig;
  category?: string;
  testId?: string;
}

const emptySubscribe = () => () => {};

export const ExamClient: React.FC<ExamClientProps> = ({
  metadata,
  section,
  effectiveConfig,
  category = metadata.category,
  testId = metadata.id,
}) => {
  const router = useRouter();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { frontmatter } = section;
  const questions = frontmatter.questions;
  const manifestBasePath = (metadata as any).assetBasePath;
  const examCat = (category.toUpperCase() || metadata.category) as SupportedExamCategory;

  const accommodationsKey = `attempt_accommodations_${testId}`;

  // 1. Accommodations State: Only prompt once per full test attempt
  const [hasStoredAccommodations, setHasStoredAccommodations] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem(accommodationsKey));
  });

  const [accommodations, setAccommodations] = useState<AccommodationSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_ACCOMMODATIONS;
    try {
      const stored = localStorage.getItem(accommodationsKey);
      return stored ? JSON.parse(stored) : DEFAULT_ACCOMMODATIONS;
    } catch {
      return DEFAULT_ACCOMMODATIONS;
    }
  });

  // Only open Pre-Flight if not already configured for this attempt
  const [isPreFlightOpen, setIsPreFlightOpen] = useState<boolean>(!hasStoredAccommodations);

  // 2. Section Directions State: Keeps clock frozen until user clicks "Begin / Resume Section"
  const [isSectionStarted, setIsSectionStarted] = useState<boolean>(false);

  // Submission & Review modal states
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scaled time based on selected multiplier
  const effectiveTimeLimitSeconds = Math.round(
    frontmatter.timeLimit * accommodations.timeMultiplier
  );

  // Core Exam State Hook: isTimerRunning gated to isSectionStarted
  const {
    activeQuestion,
    currentIndex,
    setCurrentIndex,
    secondsRemaining,
    answers,
    navigationHistory,
    isCrossOutMode,
    setIsCrossOutMode,
    isCalculatorOpen,
    setIsCalculatorOpen,
    toggleCalculator,
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
    timeLimitSeconds: effectiveTimeLimitSeconds,
    questions,
    isTimerRunning: isSectionStarted,
    onTimeExpired: () => {
      handleSubmitSection();
    },
  });

  // Detect whether this is an in-progress session being resumed
  const isResuming =
    secondsRemaining < effectiveTimeLimitSeconds ||
    Object.keys(answers).length > 0 ||
    navigationHistory.length > 1;

  // Test-Level Accommodations Confirmed
  const handleAccommodationsConfirmed = (selected: AccommodationSettings) => {
    setAccommodations(selected);
    try {
      localStorage.setItem(accommodationsKey, JSON.stringify(selected));
    } catch {}

    // Resynchronize the timer countdown with the newly chosen multiplier
    const newEffectiveSeconds = Math.round(frontmatter.timeLimit * selected.timeMultiplier);
    resetTimeLimit(newEffectiveSeconds);

    setHasStoredAccommodations(true);
    setIsPreFlightOpen(false);
  };

  // User begins or resumes section from Directions screen
  const handleBeginSection = () => {
    setIsSectionStarted(true);
  };

  // Finalize Section Action Handler
  const handleSubmitSection = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    // 1. Immediately freeze timer so no background intervals write back during network latency
    setIsSectionStarted(false);

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
        setIsSectionStarted(true); // Re-enable timer if submission failed
        return;
      }

      // 2. Clear current section buffer from localStorage
      clearLocalBuffer();
      setIsReviewOpen(false);

      // 3. Entire Exam Concluded -> Purge all section and accommodations buffers
      if (result.isTestComplete || !result.nextSectionId) {
        try {
          clearAllTestBuffers(testId);
          localStorage.removeItem(accommodationsKey);
        } catch {}
        router.push(
          `/tests/${metadata.category.toLowerCase()}/${testId}/results`
        );
        return;
      }

      // Transition to Intermission Break Route
      if (result.isIntermission) {
        router.push(
          `/tests/${metadata.category.toLowerCase()}/${testId}/break`
        );
        return;
      }

      // Advance to Next Routed Section
      router.push(
        `/tests/${metadata.category.toLowerCase()}/${testId}/${result.nextSectionId}`
      );
    } catch (error) {
      console.error("Submission failed:", error);
      alert("An unexpected error occurred while finalizing the section.");
      setIsSubmitting(false);
      setIsSectionStarted(true);
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

  // TTS Accessibility
  const { speak, stop, isPlaying: isTTSPlaying, isSupported: isTTSSupported } =
    useTextToSpeech();

  const handleToggleTTS = () => {
    if (isTTSPlaying) {
      stop();
    } else if (activeQuestion) {
      speak(`${activeQuestion.prompt}`);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
        <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 flex items-center justify-between">
          <div className="h-4 w-48 bg-neutral-200 dark:border-neutral-800 rounded animate-pulse" />
          <div className="h-6 w-20 bg-neutral-100 dark:bg-neutral-800 rounded-full animate-pulse" />
        </header>
        <main className="flex-1 bg-neutral-50 dark:bg-neutral-950" />
        <footer className="h-16 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" />
      </div>
    );
  }

  // Phase 1: Test-Level Accommodations Modal (Prompts once at attempt start)
  if (isPreFlightOpen) {
    return (
      <TestPreFlightModal
        category={examCat}
        testTitle={metadata.title}
        sectionTitle={frontmatter.sectionTitle}
        baseTimeLimitSeconds={frontmatter.timeLimit}
        initialAccommodations={accommodations}
        onStartExam={handleAccommodationsConfirmed}
      />
    );
  }

  // Phase 2: Section Directions / Resumption Screen (Clock paused, shows remaining or allotted duration)
  if (!isSectionStarted) {
    return (
      <SectionDirectionsModal
        category={examCat}
        testTitle={metadata.title}
        sectionTitle={frontmatter.sectionTitle}
        questionCount={questions.length}
        timeLimitSeconds={isResuming ? secondsRemaining : effectiveTimeLimitSeconds}
        config={effectiveConfig}
        isResuming={isResuming}
        onBeginSection={handleBeginSection}
      />
    );
  }

  const activeAnswer = activeQuestion ? answers[activeQuestion.id] : undefined;

  // Phase 3: Active Section Runner
  return (
    <>
      <TestShellLayout
        category={examCat}
        metadata={metadata}
        section={section}
        effectiveConfig={effectiveConfig}
        manifestBasePath={manifestBasePath}
        state={{
          currentIndex,
          totalQuestions: questions.length,
          secondsRemaining,
          activeQuestion,
          activeAnswer,
          answers,
          isCrossOutMode,
          isTTSPlaying,
          isTTSSupported,
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
          openFormulaSheet: () => setIsFormulaSheetOpen(true),
          toggleTTS: handleToggleTTS,
          openReviewModal: () => setIsReviewOpen(true),
        }}
      />

      <CalculatorToolbar
        type={effectiveConfig.calculator}
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <FormulaSheetModal
        sheetId={effectiveConfig.formulaSheetId}
        isOpen={isFormulaSheetOpen}
        onClose={() => setIsFormulaSheetOpen(false)}
      />

      <SectionReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSubmit={handleSubmitSection}
        isSubmitting={isSubmitting}
        category={metadata.category}
        sectionTitle={frontmatter.sectionTitle}
        questions={questions}
        answers={answers}
        onJumpToQuestion={(idx) => setCurrentIndex(idx)}
      />
    </>
  );
};