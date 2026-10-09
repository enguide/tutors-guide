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

  const storageKey = `attempt_accommodations_${testId}`;

  // Pre-flight & accommodations state with lazy localStorage hydration
  const [isPreFlightOpen, setIsPreFlightOpen] = useState(true);
  const [accommodations, setAccommodations] = useState<AccommodationSettings>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_ACCOMMODATIONS;
    }
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : DEFAULT_ACCOMMODATIONS;
    } catch {
      return DEFAULT_ACCOMMODATIONS;
    }
  });

  // Submission & Review modal states
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scaled time based on selected multiplier
  const effectiveTimeLimitSeconds = Math.round(
    frontmatter.timeLimit * accommodations.timeMultiplier
  );

  // Core Exam State Hook
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
    clearLocalBuffer,
  } = useTestProgress({
    testId,
    sectionId: frontmatter.sectionId,
    sectionOrder: frontmatter.sectionOrder,
    timeLimitSeconds: effectiveTimeLimitSeconds,
    questions,
    onTimeExpired: () => {
      handleSubmitSection();
    },
  });

  // Start Section from Pre-Flight
  const handleStartExam = (selected: AccommodationSettings) => {
    setAccommodations(selected);
    try {
      localStorage.setItem(storageKey, JSON.stringify(selected));
    } catch {
      // Local storage full or private browsing
    }
    setIsPreFlightOpen(false);
  };

  // Finalize Section Action Handler
  const handleSubmitSection = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const finalAnswers = getFinalizedAnswers();

      const result = await completeTestSection({
        testId,
        testTitle: metadata.title,
        category: metadata.category as Category,
        sectionId: frontmatter.sectionId,
        sectionOrder: frontmatter.sectionOrder,
        timeRemainingSeconds: secondsRemaining, // <-- map secondsRemaining to the payload property
        navigationHistory,
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

      const currentSectionIndex = metadata.sections.findIndex(
        (s) => s.id === frontmatter.sectionId
      );
      const nextSection = metadata.sections[currentSectionIndex + 1];

      if (result.isTestComplete || !nextSection) {
        // Clear accommodations cache at the conclusion of the entire exam
        try {
          localStorage.removeItem(storageKey);
        } catch {}
        router.push(
          `/tests/${metadata.category.toLowerCase()}/${testId}/results`
        );
      } else {
        router.push(
          `/tests/${metadata.category.toLowerCase()}/${testId}/${nextSection.id}`
        );
      }
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
    navigationHistory,
    questions,
    accommodations,
    storageKey,
    getFinalizedAnswers,
    clearLocalBuffer,
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

  // Pre-Flight Check-in Overlay
  if (isPreFlightOpen) {
    return (
      <TestPreFlightModal
        category={examCat}
        testTitle={metadata.title}
        sectionTitle={frontmatter.sectionTitle}
        baseTimeLimitSeconds={frontmatter.timeLimit}
        initialAccommodations={accommodations}
        onStartExam={handleStartExam}
      />
    );
  }

  const activeAnswer = activeQuestion ? answers[activeQuestion.id] : undefined;

  return (
    <>
      {/* Category Layout Adapter */}
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

      {/* Global Modals & Overlays */}
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