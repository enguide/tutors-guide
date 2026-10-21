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
import { ExamErrorBoundary } from "./ExamErrorBoundary";

interface ExamClientProps {
  metadata: TestMetadata;
  section: ParsedSection;
  effectiveConfig: SectionExamConfig;
  category?: string;
  testId?: string;
  studentName?: string;
}

const emptySubscribe = () => () => {};

export const ExamClient: React.FC<ExamClientProps> = ({
  metadata,
  section,
  effectiveConfig,
  category = metadata.category,
  testId = metadata.id,
  studentName,
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

  const accommodationsKey = `attempt_accommodations_${testId}`;

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

  const [isPreFlightOpen, setIsPreFlightOpen] = useState<boolean>(!hasStoredAccommodations);
  const [isSectionStarted, setIsSectionStarted] = useState<boolean>(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveTimeLimitSeconds = Math.round(
    frontmatter.timeLimit * accommodations.timeMultiplier
  );

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
    timeLimitSeconds: effectiveTimeLimitSeconds,
    questions,
    // Stop the background timer decrement while submitting or waiting for route push
    isTimerRunning: isSectionStarted && !isSubmitting,
    onTimeExpired: () => {
      handleSubmitSection();
    },
  });

  const isResuming =
    secondsRemaining < effectiveTimeLimitSeconds ||
    Object.keys(answers).length > 0 ||
    navigationHistory.length > 1;

  const handleAccommodationsConfirmed = (selected: AccommodationSettings) => {
    setAccommodations(selected);
    try {
      localStorage.setItem(accommodationsKey, JSON.stringify(selected));
    } catch {}

    const newEffectiveSeconds = Math.round(frontmatter.timeLimit * selected.timeMultiplier);
    resetTimeLimit(newEffectiveSeconds);

    setHasStoredAccommodations(true);
    setIsPreFlightOpen(false);
  };

  const handleBeginSection = () => {
    setIsSectionStarted(true);
  };

  const handleSubmitSection = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Keep isSectionStarted untouched to avoid falling back to SectionDirectionsModal

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
        router.push(
          `/tests/${metadata.category.toLowerCase()}/${testId}/results`
        );
        return;
      }

      if (result.isIntermission) {
        router.push(
          `/tests/${metadata.category.toLowerCase()}/${testId}/break`
        );
        return;
      }

      router.push(
        `/tests/${metadata.category.toLowerCase()}/${testId}/${result.nextSectionId}`
      );
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

  // Intercept any transitional state during submission to prevent the directions modal flash
  if (isSubmitting) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white mb-4" />
        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 font-mono tracking-tight">
          Finalizing section and loading next module...
        </p>
      </div>
    );
  }

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

  return (
    <ExamErrorBoundary testId={testId} sectionId={frontmatter.sectionId}>
      <TestShellLayout
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
        onInteract={markCalculatorUsed}
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
    </ExamErrorBoundary>
  );
};