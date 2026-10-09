// components/exam/shells/sat/SATLayoutAdapter.tsx
"use client";

import React from "react";
import { TestShellLayoutProps } from "@/types/examLayout";
import { SATHeader } from "./SATHeader";
import { SATQuestionNavigatorPopover } from "./SATQuestionNavigatorPopover";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { QuestionOptions } from "../../QuestionOptions";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const SATLayoutAdapter: React.FC<TestShellLayoutProps> = ({
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
  const isFirstQuestion = state.currentIndex === 0;
  const isLastQuestion = state.currentIndex === questions.length - 1;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-neutral-950 select-none">
      {/* 1. Bluebook Styled Header */}
      <SATHeader
        sectionTitle={frontmatter.sectionTitle}
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

      {/* 2. Independent Split-Pane Work Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/50">
        {/* Left Pane: Stimulus / Reading Passage */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-neutral-300 dark:border-neutral-800 overflow-y-auto p-6 md:p-10 bg-white dark:bg-neutral-900">
          <div className="max-w-2xl mx-auto space-y-4">
            {passageContent && passageContent.trim().length > 0 ? (
              <MarkdownQuestionRenderer
  content={passageContent}
  category={category}
  testId={metadata.id}
  manifestBasePath={manifestBasePath}
  enableLightbox={state.accommodations.imageMagnification}
/>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-400 font-mono text-xs italic">
                No reference stimulus required for this module.
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Question & Interactive Options */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white dark:bg-neutral-900">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-[2px] bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                  {state.activeQuestion.questionNumber}
                </span>
                {state.activeAnswer?.flagged && (
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 font-mono">
                    Flagged for review
                  </span>
                )}
              </div>

              <div className="text-neutral-900 dark:text-neutral-100 text-base leading-relaxed">
                <MarkdownQuestionRenderer
  content={state.activeQuestion.prompt}
  category={category}
  testId={metadata.id}
  manifestBasePath={manifestBasePath}
  enableLightbox={state.accommodations.imageMagnification}
/>
              </div>
            </div>

            <hr className="border-neutral-200 dark:border-neutral-800" />

            <QuestionOptions
              question={state.activeQuestion}
              selectedOptionId={state.activeAnswer?.selectedOptionId}
              frqAnswer={state.activeAnswer?.frqUserAnswer}
              eliminatedOptions={state.activeAnswer?.eliminatedOptions}
              isCrossOutMode={state.isCrossOutMode}
              onSelectOption={actions.selectOption}
              onSetFrqAnswer={actions.setFrqAnswer}
              onToggleEliminate={actions.toggleEliminateOption}
            />
          </div>
        </div>
      </main>

      {/* 3. Bluebook Bottom Bar */}
      <footer className="h-16 border-t border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 flex items-center justify-between select-none z-30">
        <div>
          <button
            type="button"
            disabled={isFirstQuestion}
            onClick={() => actions.setCurrentIndex((idx) => Math.max(0, idx - 1))}
            className="flex items-center gap-1.5 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-[4px] text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        </div>

        {/* Center Question Navigator Popover */}
        <SATQuestionNavigatorPopover
          currentIndex={state.currentIndex}
          questions={questions}
          answers={state.answers}
          onSelectIndex={(idx) => actions.setCurrentIndex(idx)}
          onOpenReviewModal={actions.openReviewModal}
        />

        <div>
          {isLastQuestion ? (
            <button
              type="button"
              onClick={actions.openReviewModal}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[4px] text-xs font-semibold tracking-tight shadow-sm transition-colors"
            >
              Review Section
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => actions.setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1))}
              className="flex items-center gap-1.5 px-5 py-2 bg-neutral-900 hover:bg-black dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 rounded-[4px] text-xs font-semibold tracking-tight shadow-sm transition-colors"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};