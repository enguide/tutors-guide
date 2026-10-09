// components/exam/shells/BaseLayoutAdapter.tsx
"use client";

import React from "react";
import { TestShellLayoutProps } from "@/types/examLayout";
import { ExamHeader } from "../ExamHeader";
import { ExamFooter } from "../ExamFooter";
import { SplitPassageLayout } from "../layouts/SplitPassageLayout";
import { SingleColumnLayout } from "../layouts/SingleColumnLayout";

export const BaseLayoutAdapter: React.FC<TestShellLayoutProps> = ({
  category,
  metadata,
  section,
  effectiveConfig,
  manifestBasePath,
  state,
  actions,
}) => {
  const { frontmatter, content: passageContent } = section;
  const questions = frontmatter.questions;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background select-none">
      {/* Top Header */}
      <ExamHeader
        sectionTitle={frontmatter.sectionTitle}
        category={metadata.category}
        config={effectiveConfig}
        secondsRemaining={state.secondsRemaining}
        isFlagged={Boolean(state.activeAnswer?.flagged)}
        isCrossOutMode={state.isCrossOutMode}
        isTTSPlaying={state.isTTSPlaying}
        isTTSSupported={state.isTTSSupported}
        onToggleFlag={actions.toggleFlag}
        onToggleCrossOut={actions.toggleCrossOut}
        onToggleCalculator={actions.toggleCalculator}
        onToggleFormulaSheet={actions.openFormulaSheet}
        onToggleTTS={actions.toggleTTS}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {effectiveConfig.layout === "split-passage" ? (
          <SplitPassageLayout
            passageContent={passageContent}
            activeQuestion={state.activeQuestion}
            selectedOptionId={state.activeAnswer?.selectedOptionId}
            frqAnswer={state.activeAnswer?.frqUserAnswer}
            eliminatedOptions={state.activeAnswer?.eliminatedOptions}
            isCrossOutMode={state.isCrossOutMode}
            category={category}
            testId={metadata.id}
            manifestBasePath={manifestBasePath}
            onSelectOption={actions.selectOption}
            onSetFrqAnswer={actions.setFrqAnswer}
            onToggleEliminate={actions.toggleEliminateOption}
          />
        ) : (
          <SingleColumnLayout
            passageContent={passageContent}
            activeQuestion={state.activeQuestion}
            selectedOptionId={state.activeAnswer?.selectedOptionId}
            frqAnswer={state.activeAnswer?.frqUserAnswer}
            eliminatedOptions={state.activeAnswer?.eliminatedOptions}
            isCrossOutMode={state.isCrossOutMode}
            category={category}
            testId={metadata.id}
            manifestBasePath={manifestBasePath}
            onSelectOption={actions.selectOption}
            onSetFrqAnswer={actions.setFrqAnswer}
            onToggleEliminate={actions.toggleEliminateOption}
          />
        )}
      </main>

      {/* Bottom Footer Navigator */}
      <ExamFooter
        currentIndex={state.currentIndex}
        totalQuestions={questions.length}
        questions={questions}
        answers={state.answers}
        allowBacktracking={effectiveConfig.allowBacktracking}
        onPrev={() => actions.setCurrentIndex((idx) => Math.max(0, idx - 1))}
        onNext={() => {
          if (state.currentIndex >= questions.length - 1) {
            actions.openReviewModal();
          } else {
            actions.setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1));
          }
        }}
        onSelectIndex={(idx) => actions.setCurrentIndex(idx)}
        onOpenReview={actions.openReviewModal}
      />
    </div>
  );
};