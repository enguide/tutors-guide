// components/exam/shells/sat/SATLayoutAdapter.tsx
"use client";

import React from "react";
import { TestShellLayoutProps } from "@/types/examLayout";
import { SATHeader } from "./SATHeader";
import { SATQuestionNavigatorPopover } from "./SATQuestionNavigatorPopover";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { QuestionOptions } from "../../QuestionOptions";
import { ArrowLeft, ArrowRight, Bookmark } from "lucide-react";

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
  const isFirstQuestion = state.currentIndex === 0;
  const isLastQuestion = state.currentIndex === questions.length - 1;
  const isFlagged = Boolean(state.activeAnswer?.flagged);

  // Discrete question stimulus takes priority over section-level markdown
  const activeStimulus =
    state.activeQuestion.stimulus ||
    state.activeQuestion.passage ||
    (sectionPassageContent && sectionPassageContent.trim().length > 0 ? sectionPassageContent : null);

  const isSplitView =
  state.activeQuestion.layout === "split"
    ? true
    : state.activeQuestion.layout === "single"
    ? false
    : effectiveConfig.layout === "split-passage" || Boolean(activeStimulus);

  // Reusable Bluebook Question Top Bar (Question #, Mark for Review, Cross-out trigger)
  // Inside components/exam/shells/sat/SATLayoutAdapter.tsx

  const renderItemActionBar = () => (
    <div className="flex items-stretch justify-between bg-neutral-100 dark:bg-neutral-800 h-9 select-none overflow-hidden">
      {/* Left: Question Badge & Mark for Review */}
      <div className="flex items-center">
        {/* Stout, bold sans-serif question number */}
        <div className="w-9 h-full flex items-center justify-center bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-lg font-sans font-bold">
          {state.activeQuestion.questionNumber}
        </div>

        {/* Mark for Review Button */}
        <button
          type="button"
          onClick={actions.toggleFlag}
          className={`h-full flex items-center gap-2 px-3 text-xs font-sans font-medium transition-colors ${
            isFlagged
              ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-semibold"
              : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white"
          }`}
        >
          {/* Flag Icon: Scaled 150% (w-5 h-6) */}
          <Bookmark
            className={`w-6 h-6 shrink-0 ${
              isFlagged
                ? "fill-neutral-900 dark:fill-neutral-100 text-neutral-900 dark:text-neutral-100"
                : "text-neutral-700 dark:text-neutral-300"
            }`}
          />
          <span className="text-sm">Mark for Review</span>
        </button>
      </div>

      {/* Right: Master ABC Cross-Out Mode Toggle */}
      <div className="flex items-center pr-2">
        <button
          type="button"
          onClick={actions.toggleCrossOut}
          title="Eliminate Answer Choices"
          className={`px-2 py-0.5 rounded-sm text-xs font-sans font-bold tracking-tight transition-colors border ${
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
        isTTSPlaying={state.isTTSPlaying}
        isTTSSupported={state.isTTSSupported}
        onToggleCalculator={actions.toggleCalculator}
        onToggleFormulaSheet={actions.openFormulaSheet}
        onToggleTTS={actions.toggleTTS}
      />

      {/* 2. Main Work Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/50">
        {isSplitView ? (
          <>
            {/* Left Pane: Stimulus / Reading Passage (Serif) */}
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
            <div key={state.activeQuestion.id}className="flex-1 overflow-y-auto p-6 md:p-10 bg-white dark:bg-neutral-900">
  <div className="max-w-xl mx-auto space-y-4">
    {renderItemActionBar()}

    {/* Prompt */}
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

    {/* Options */}
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
          <div key={state.activeQuestion.id}className="flex-1 overflow-y-auto p-6 md:p-10 bg-white dark:bg-neutral-900">
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

      {/* 3. Bottom Bar: 3-Column Grid for True Horizontal Centering */}
      <footer className="h-16 border-t border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 grid grid-cols-3 items-center select-none z-30">
        {/* Left Column: Student Profile Name */}
        <div className="justify-self-start text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-xs">
          {studentName || "Student Preview"}
        </div>

        {/* Center Column: Exactly Centered Question Navigator */}
        <div className="justify-self-center">
          <SATQuestionNavigatorPopover
            currentIndex={state.currentIndex}
            questions={questions}
            answers={state.answers}
            onSelectIndex={(idx) => actions.setCurrentIndex(idx)}
            onOpenReviewModal={actions.openReviewModal}
          />
        </div>

        {/* Right Column: Navigation Controls */}
        <div className="justify-self-end flex items-center gap-2">
          <button
            type="button"
            disabled={isFirstQuestion}
            onClick={() => actions.setCurrentIndex((idx) => Math.max(0, idx - 1))}
            className="flex items-center gap-1.5 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-sm text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={actions.openReviewModal}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs font-semibold tracking-tight shadow-sm transition-colors"
            >
              Review Section
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => actions.setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1))}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs font-semibold tracking-tight shadow-sm transition-colors"
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