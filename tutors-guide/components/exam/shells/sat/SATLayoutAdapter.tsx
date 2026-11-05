// components/exam/shells/sat/SATLayoutAdapter.tsx
"use client";

import React, { useState } from "react";
import { TestShellLayoutProps } from "@/types/examLayout";
import { SATHeader } from "./SATHeader";
import { SATFooter } from "./SATFooter";
import { SATCheckYourWorkScreen } from "./SATCheckYourWorkScreen";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { QuestionOptions } from "../../QuestionOptions";

function ItemBookmarkRibbon({
  isFlagged,
  className = "w-3.5 h-4",
}: {
  isFlagged: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 12 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.75 0.75H11.25V14.5L6 10.5L0.75 14.5V0.75Z"
        fill={isFlagged ? "#C5221F" : "none"}
        stroke={isFlagged ? "#C5221F" : "currentColor"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const SATLayoutAdapter: React.FC<TestShellLayoutProps> = ({
  category,
  metadata,
  section,
  effectiveConfig,
  manifestBasePath,
  studentName,
  state,
  actions,
}) => {
  const { frontmatter, content: sectionPassageContent } = section;
  const questions = frontmatter.questions;
  const isFlagged = Boolean(state.activeAnswer?.flagged);

  // In-canvas review screen state
  const [isReviewActive, setIsReviewActive] = useState(false);

  const activeStimulus =
    state.activeQuestion?.stimulus ||
    state.activeQuestion?.passage ||
    (sectionPassageContent && sectionPassageContent.trim().length > 0
      ? sectionPassageContent
      : null);

  const isSplitView =
    state.activeQuestion?.layout === "split"
      ? true
      : state.activeQuestion?.layout === "single"
      ? false
      : effectiveConfig.layout === "split-passage" || Boolean(activeStimulus);

  const renderItemActionBar = () => (
    <div className="flex items-stretch justify-between bg-neutral-100 dark:bg-neutral-800 h-9 select-none overflow-hidden">
      <div className="flex items-center">
        <div className="w-9 h-full flex items-center justify-center bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-lg font-sans font-bold">
          {state.activeQuestion.questionNumber}
        </div>

        <button
          type="button"
          onClick={actions.toggleFlag}
          className="h-full flex items-center gap-2 px-3 text-xs font-sans text-neutral-900 dark:text-neutral-100 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ItemBookmarkRibbon 
  isFlagged={isFlagged} 
  className="w-3.5 h-4 shrink-0 text-neutral-600 dark:text-neutral-400" 
/>
          <span className={`text-sm ${isFlagged ? "font-bold" : "font-normal"}`}>
            Mark for Review
          </span>
        </button>
      </div>

      <div className="flex items-center pr-2">
        <button
          type="button"
          onClick={actions.toggleCrossOut}
          title="Eliminate Answer Choices"
          className={`px-2 py-0.5 rounded-sm text-xs font-sans font-bold tracking-tight transition-colors border cursor-pointer ${
            state.isCrossOutMode
              ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100"
              : "bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          }`}
        >
          <span className="line-through tracking-tighter text-[13px]">ABC</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-neutral-950 select-none">
      {/* 1. Header */}
      <SATHeader
        sectionTitle={frontmatter.sectionTitle}
        config={effectiveConfig}
        secondsRemaining={state.secondsRemaining}
        syncStatus={state.syncStatus}
        isCalculatorOpen={state.isCalculatorOpen}
        isFormulaSheetOpen={state.isFormulaSheetOpen}
        onToggleCalculator={actions.toggleCalculator}
        onToggleFormulaSheet={actions.openFormulaSheet}
      />

      {/* 2. Main Work Area: Switches dynamically between Question and Check Your Work */}
      {isReviewActive ? (
        <SATCheckYourWorkScreen
          sectionTitle={frontmatter.sectionTitle}
          questions={questions}
          answers={state.answers}
          onSelectIndex={(idx) => {
            actions.setCurrentIndex(idx);
            setIsReviewActive(false);
          }}
        />
      ) : (
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/50">
          {isSplitView ? (
            <>
              {/* Left Pane: Stimulus / Reading Passage */}
              <div className="flex-1 border-b md:border-b-0 md:border-r border-neutral-300 dark:border-neutral-800 overflow-y-auto p-6 md:p-10 bg-white dark:bg-neutral-900">
                <div className="max-w-2xl mx-auto font-serif text-[15.5px] leading-[1.65] font-normal text-neutral-900 dark:text-neutral-100">
                  {activeStimulus ? (
                    <MarkdownQuestionRenderer
                      content={activeStimulus}
                      category={category}
                      testId={metadata.id}
                      manifestBasePath={manifestBasePath}
                      enableLightbox={state.accommodations.imageMagnification}
                      className="prose-p:leading-[1.65] prose-p:my-2"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-neutral-400 font-mono text-xs italic">
                      No reference stimulus required for this item.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Pane: Question Stem & Choices */}
              <div
                key={state.activeQuestion.id}
                className="flex-1 overflow-y-auto p-6 md:p-10 bg-white dark:bg-neutral-900"
              >
                <div className="max-w-xl mx-auto space-y-4">
                  {renderItemActionBar()}

                  <div className="text-neutral-900 dark:text-neutral-100 font-serif text-[15.5px] leading-[1.65] font-normal">
                    <MarkdownQuestionRenderer
                      content={state.activeQuestion.prompt}
                      category={category}
                      testId={metadata.id}
                      manifestBasePath={manifestBasePath}
                      enableLightbox={state.accommodations.imageMagnification}
                      className="prose-p:mb-0"
                    />
                  </div>

                  <QuestionOptions
                    variant="sat"
                    question={state.activeQuestion}
                    category={category}
                    testId={metadata.id}
                    manifestBasePath={manifestBasePath}
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
            /* Single Column (Math) */
            <div
              key={state.activeQuestion.id}
              className="flex-1 overflow-y-auto p-6 md:p-10 bg-white dark:bg-neutral-900"
            >
              <div className="max-w-2xl mx-auto space-y-6">
                {renderItemActionBar()}

                <div className="text-neutral-900 dark:text-neutral-100 font-serif text-[15.5px] leading-[1.65] font-normal">
                  <MarkdownQuestionRenderer
                    content={state.activeQuestion.prompt}
                    category={category}
                    testId={metadata.id}
                    manifestBasePath={manifestBasePath}
                    enableLightbox={state.accommodations.imageMagnification}
                    className="prose-p:leading-[1.65] prose-p:my-2"
                  />
                </div>

                <QuestionOptions
                  variant="sat"
                  question={state.activeQuestion}
                  category={category}
                  testId={metadata.id}
                  manifestBasePath={manifestBasePath}
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
          )}
        </main>
      )}

      {/* 3. Footer */}
      <SATFooter
        currentIndex={state.currentIndex}
        totalQuestions={questions.length}
        studentName={studentName}
        sectionTitle={frontmatter.sectionTitle}
        questions={questions}
        answers={state.answers}
        isReviewScreen={isReviewActive}
        onSelectIndex={(idx) => {
          actions.setCurrentIndex(idx);
          setIsReviewActive(false);
        }}
        onOpenReviewModal={() => setIsReviewActive(true)}
        onPrev={() => {
          if (isReviewActive) {
            // "Back" on review screen returns to the active question
            setIsReviewActive(false);
          } else {
            actions.setCurrentIndex((idx) => Math.max(0, idx - 1));
          }
        }}
        onNext={() => {
          if (isReviewActive) {
            // "Next" on review screen triggers section completion & next module
            actions.submitSection();
          } else if (state.currentIndex >= questions.length - 1) {
            // Clicking "Next" on the final question enters Check Your Work
            setIsReviewActive(true);
          } else {
            actions.setCurrentIndex((idx) =>
              Math.min(questions.length - 1, idx + 1)
            );
          }
        }}
      />
    </div>
  );
};