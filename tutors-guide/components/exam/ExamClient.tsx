// components/exam/ExamClient.tsx
"use client";

import React, { useState, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ParsedSection, TestMetadata } from "@/types/content";
import { SectionExamConfig } from "@/types/examConfig";
import { useTestProgress } from "@/hooks/useTestProgress";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { ExamHeader } from "./ExamHeader";
import { ExamFooter } from "./ExamFooter";
import { SplitPassageLayout } from "./layouts/SplitPassageLayout";
import { SingleColumnLayout } from "./layouts/SingleColumnLayout";
import { CalculatorToolbar } from "../tools/CalculatorToolbar";
import { FormulaSheetModal } from "../tools/FormulaSheetModal";
import { SectionReviewModal } from "./SectionReviewModal";
import { completeTestSection } from "@/actions/completeTestSection";
import { Category } from "@prisma/client";

interface ExamClientProps {
  metadata: TestMetadata;
  section: ParsedSection;
  effectiveConfig: SectionExamConfig;
}

const emptySubscribe = () => () => {};

export const ExamClient: React.FC<ExamClientProps> = ({
  metadata,
  section,
  effectiveConfig,
}) => {
  const router = useRouter();

  // Mount detection: server returns false, client immediately returns true
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { frontmatter, content: passageContent } = section;
  const questions = frontmatter.questions;

  // Submission & Review modal states
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Core Exam State Management
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
    testId: metadata.id,
    sectionId: frontmatter.sectionId,
    sectionOrder: frontmatter.sectionOrder,
    timeLimitSeconds: frontmatter.timeLimit,
    questions,
    onTimeExpired: () => {
      // Auto-submit immediately if time expires
      handleSubmitSection();
    },
  });

  // 2. Finalize Section Action Handler
  const handleSubmitSection = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Flush in-flight active question deliberation time before sending
      const finalAnswers = getFinalizedAnswers();

      const result = await completeTestSection({
        testId: metadata.id,
        testTitle: metadata.title,
        category: metadata.category as Category,
        sectionId: frontmatter.sectionId,
        sectionOrder: frontmatter.sectionOrder,
        timeRemainingSeconds: secondsRemaining,
        navigationHistory,
        questions,
        clientAnswers: finalAnswers,
      });

      if (!result.success) {
        alert(result.error || "Failed to submit section.");
        setIsSubmitting(false);
        return;
      }

      // Clear the local cache for this completed section
      clearLocalBuffer();
      setIsReviewOpen(false);

      // Determine routing: next section vs test results
      const currentSectionIndex = metadata.sections.findIndex(
        (s) => s.id === frontmatter.sectionId
      );
      const nextSection = metadata.sections[currentSectionIndex + 1];

      if (result.isTestComplete || !nextSection) {
        // All sections finished -> go to analytics results dashboard
        router.push(
          `/tests/${metadata.category.toLowerCase()}/${metadata.id}/results`
        );
      } else {
        // Move to subsequent section
        router.push(
          `/tests/${metadata.category.toLowerCase()}/${metadata.id}/${nextSection.id}`
        );
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("An unexpected error occurred while finalizing the section.");
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    metadata,
    frontmatter,
    secondsRemaining,
    navigationHistory,
    questions,
    getFinalizedAnswers,
    clearLocalBuffer,
    router,
  ]);

  // 3. TTS Accessibility
  const { speak, stop, isPlaying: isTTSPlaying, isSupported: isTTSSupported } =
    useTextToSpeech();

  const handleToggleTTS = () => {
    if (isTTSPlaying) {
      stop();
    } else if (activeQuestion) {
      speak(`${activeQuestion.prompt}`);
    }
  };

  // If not yet mounted on client, render a clean shell that matches SSR perfectly
  if (!isMounted) {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between">
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
        </header>
        <main className="flex-1 bg-slate-50/50 dark:bg-slate-950/50" />
        <footer className="h-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
      </div>
    );
  }

  const activeAnswer = activeQuestion ? answers[activeQuestion.id] : undefined;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background select-none">
      {/* Top Header */}
      <ExamHeader
        sectionTitle={frontmatter.sectionTitle}
        category={metadata.category}
        config={effectiveConfig}
        secondsRemaining={secondsRemaining}
        isFlagged={Boolean(activeAnswer?.flagged)}
        isCrossOutMode={isCrossOutMode}
        isTTSPlaying={isTTSPlaying}
        isTTSSupported={isTTSSupported}
        onToggleFlag={toggleFlag}
        onToggleCrossOut={() => setIsCrossOutMode((prev) => !prev)}
        onToggleCalculator={toggleCalculator}
        onToggleFormulaSheet={() => setIsFormulaSheetOpen(true)}
        onToggleTTS={handleToggleTTS}
      />

      {/* Main Presentation View via Strategy Dispatcher */}
      <main className="flex-1 flex overflow-hidden">
        {effectiveConfig.layout === "split-passage" ? (
          <SplitPassageLayout
            passageContent={passageContent}
            activeQuestion={activeQuestion}
            selectedOptionId={activeAnswer?.selectedOptionId}
            frqAnswer={activeAnswer?.frqUserAnswer}
            eliminatedOptions={activeAnswer?.eliminatedOptions}
            isCrossOutMode={isCrossOutMode}
            onSelectOption={selectOption}
            onSetFrqAnswer={setFrqAnswer}
            onToggleEliminate={toggleEliminateOption}
          />
        ) : (
          <SingleColumnLayout
            passageContent={passageContent}
            activeQuestion={activeQuestion}
            selectedOptionId={activeAnswer?.selectedOptionId}
            frqAnswer={activeAnswer?.frqUserAnswer}
            eliminatedOptions={activeAnswer?.eliminatedOptions}
            isCrossOutMode={isCrossOutMode}
            onSelectOption={selectOption}
            onSetFrqAnswer={setFrqAnswer}
            onToggleEliminate={toggleEliminateOption}
          />
        )}
      </main>

      {/* Bottom Footer Navigator */}
      <ExamFooter
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        questions={questions}
        answers={answers}
        allowBacktracking={effectiveConfig.allowBacktracking}
        onPrev={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
        onNext={() => {
          if (currentIndex >= questions.length - 1) {
            setIsReviewOpen(true);
          } else {
            setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1));
          }
        }}
        onSelectIndex={(idx) => setCurrentIndex(idx)}
        onOpenReview={() => setIsReviewOpen(true)}
      />

      {/* Config-driven Calculator Toolbar Overlay */}
      <CalculatorToolbar
        type={effectiveConfig.calculator}
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Config-driven Formula Sheet Overlay */}
      <FormulaSheetModal
        sheetId={effectiveConfig.formulaSheetId}
        isOpen={isFormulaSheetOpen}
        onClose={() => setIsFormulaSheetOpen(false)}
      />

      {/* Category-Adaptive Section Review & Submit Modal */}
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
    </div>
  );
};