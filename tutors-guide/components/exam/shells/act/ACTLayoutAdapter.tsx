// components/exam/shells/act/ACTLayoutAdapter.tsx
"use client";

import React from "react";
import { TestShellLayoutProps } from "@/types/examLayout";
import { ACTHeader } from "./ACTHeader";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { QuestionOptions } from "../../QuestionOptions";
import { ChevronLeft, ChevronRight, CheckSquare } from "lucide-react";

export const ACTLayoutAdapter: React.FC<TestShellLayoutProps> = ({
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

  // Determine layout: split-passage for reading/English stimuli vs single-column for math
  const isSplitLayout =
    effectiveConfig.layout === "split-passage" &&
    Boolean(passageContent && passageContent.trim().length > 0);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F3F4F6] dark:bg-neutral-950 select-none">
      {/* 1. TestNav Blue Header */}
      <ACTHeader
        sectionTitle={frontmatter.sectionTitle}
        config={effectiveConfig}
        secondsRemaining={state.secondsRemaining}
        currentIndex={state.currentIndex}
        totalQuestions={questions.length}
        isFlagged={Boolean(state.activeAnswer?.flagged)}
        isCrossOutMode={state.isCrossOutMode}
        isTTSPlaying={state.isTTSPlaying}
        isTTSSupported={state.isTTSSupported}
        onToggleFlag={actions.toggleFlag}
        onToggleCrossOut={actions.toggleCrossOut}
        onToggleCalculator={actions.toggleCalculator}
        onToggleTTS={actions.toggleTTS}
        onOpenReviewModal={actions.openReviewModal}
      />

      {/* 2. Main Work Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {isSplitLayout ? (
          <>
            {/* Left Stimulus Pane */}
            <div className="flex-1 border-b md:border-b-0 md:border-r border-neutral-300 dark:border-neutral-800 overflow-y-auto p-6 md:p-8 bg-white dark:bg-neutral-900">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="text-xs uppercase tracking-wider font-bold text-neutral-500 pb-1 border-b border-neutral-200 dark:border-neutral-800">
                  Passage
                </div>
                <MarkdownQuestionRenderer
  content={passageContent}
  category={category}
  testId={metadata.id}
  manifestBasePath={manifestBasePath}
  enableLightbox={state.accommodations.imageMagnification}
/>
              </div>
            </div>

            {/* Right Question Prompt & Choices */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white dark:bg-neutral-900">
              <div className="max-w-xl mx-auto space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0A2540] dark:text-sky-400 font-mono">
                      Question {state.activeQuestion.questionNumber}
                    </span>
                    {state.activeAnswer?.flagged && (
                      <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-[2px] font-mono">
                        Bookmarked
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
          </>
        ) : (
          /* Single Column Layout (ACT Math Problem Solving) */
          <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#F9FAFB] dark:bg-neutral-950">
            <div className="max-w-3xl mx-auto space-y-6">
              {passageContent && passageContent.trim().length > 0 && (
                <div className="p-5 rounded-[4px] border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                  <MarkdownQuestionRenderer
                    content={passageContent}
                    category={category}
                    testId={metadata.id}
                    manifestBasePath={manifestBasePath}
                  />
                </div>
              )}

              <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[4px] p-6 md:p-8 shadow-sm space-y-6">
                <div className="space-y-3">
                  <span className="text-sm font-bold text-[#0A2540] dark:text-sky-400 font-mono">
                    Question {state.activeQuestion.questionNumber}
                  </span>
                  <div className="text-neutral-900 dark:text-neutral-100 text-base md:text-lg">
                    <MarkdownQuestionRenderer
                      content={state.activeQuestion.prompt}
                      category={category}
                      testId={metadata.id}
                      manifestBasePath={manifestBasePath}
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
          </div>
        )}
      </main>

      {/* 3. TestNav Bottom Action Bar */}
      <footer className="h-14 border-t border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 flex items-center justify-between select-none z-30">
        <div className="text-xs text-neutral-600 dark:text-neutral-400 font-mono font-medium">
          Question <strong className="text-foreground">{state.currentIndex + 1}</strong> of {questions.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isFirstQuestion}
            onClick={() => actions.setCurrentIndex((idx) => Math.max(0, idx - 1))}
            className="flex items-center gap-1 px-4 py-1.5 border border-neutral-400 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-[3px] hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={actions.openReviewModal}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0A2540] hover:bg-[#123960] text-white text-xs font-bold rounded-[3px] transition-colors shadow-sm"
            >
              <CheckSquare className="w-4 h-4" />
              Review / End Section
            </button>
          ) : (
            <button
              type="button"
              onClick={() => actions.setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1))}
              className="flex items-center gap-1 px-4 py-1.5 bg-[#0A2540] hover:bg-[#123960] text-white text-xs font-bold rounded-[3px] transition-colors shadow-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};