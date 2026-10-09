// components/exam/shells/ap/APLayoutAdapter.tsx
"use client";

import React, { useState } from "react";
import { TestShellLayoutProps } from "@/types/examLayout";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { QuestionOptions } from "../../QuestionOptions";
import {
  Clock,
  Eye,
  EyeOff,
  FileText,
  Calculator,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export const APLayoutAdapter: React.FC<TestShellLayoutProps> = ({
  category,
  metadata,
  section,
  effectiveConfig,
  manifestBasePath,
  state,
  actions,
}) => {
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const { frontmatter, content: passageContent } = section;
  const questions = frontmatter.questions;
  const isFirstQuestion = state.currentIndex === 0;
  const isLastQuestion = state.currentIndex === questions.length - 1;

  const hasStimulus = Boolean(passageContent && passageContent.trim().length > 0);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-stone-50 dark:bg-neutral-950 select-none font-sans">
      {/* 1. Academic Header */}
      <header className="h-14 bg-white dark:bg-neutral-900 border-b border-stone-200 dark:border-neutral-800 px-4 sm:px-6 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-stone-700 dark:text-stone-300" />
          <span className="text-xs font-bold font-serif tracking-tight text-stone-900 dark:text-stone-100">
            {frontmatter.sectionTitle}
          </span>
          <span className="text-xs font-mono text-stone-500 border-l border-stone-200 dark:border-neutral-800 pl-3">
            Item {state.currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Center: Timer */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 dark:bg-neutral-800 rounded-[3px] border border-stone-200 dark:border-neutral-700">
            <Clock className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
            <span className="font-mono text-xs font-semibold text-stone-800 dark:text-stone-200 min-w-[42px] text-center">
              {isTimerHidden ? "--:--" : formatClock(state.secondsRemaining)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsTimerHidden((prev) => !prev)}
            className="p-1 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            title="Toggle timer visibility"
          >
            {isTimerHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right: Tools & Overlays */}
        <div className="flex items-center gap-2">
          {effectiveConfig.hasFormulaSheet && (
            <button
              type="button"
              onClick={actions.openFormulaSheet}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 border border-stone-200 dark:border-neutral-700 rounded-[3px] text-xs font-medium text-stone-800 dark:text-stone-200"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Formula Sheet</span>
            </button>
          )}

          {effectiveConfig.calculator !== "none" && (
            <button
              type="button"
              onClick={actions.toggleCalculator}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 border border-stone-200 dark:border-neutral-700 rounded-[3px] text-xs font-medium text-stone-800 dark:text-stone-200"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calculator</span>
            </button>
          )}

          <button
            type="button"
            onClick={actions.openReviewModal}
            className="px-3 py-1.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-[3px] text-xs font-medium hover:opacity-90"
          >
            Review Items
          </button>
        </div>
      </header>

      {/* 2. Main Work Area (Split or Academic Single-Column) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {hasStimulus ? (
          <>
            <div className="flex-1 border-b md:border-b-0 md:border-r border-stone-200 dark:border-neutral-800 overflow-y-auto p-6 md:p-10 bg-white dark:bg-neutral-900 font-serif">
              <div className="max-w-2xl mx-auto space-y-4">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-sans font-bold block">
                  Reference Context & Data
                </span>
                <MarkdownQuestionRenderer
                  content={passageContent}
                  category={category}
                  testId={metadata.id}
                  manifestBasePath={manifestBasePath}
                  enableLightbox={true}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white dark:bg-neutral-900">
              <div className="max-w-xl mx-auto space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-[2px] bg-stone-100 dark:bg-neutral-800 text-stone-800 dark:text-stone-200">
                    Question {state.activeQuestion.questionNumber}
                  </span>
                  <div className="text-stone-900 dark:text-stone-100 text-base leading-relaxed">
                    <MarkdownQuestionRenderer
                      content={state.activeQuestion.prompt}
                      category={category}
                      testId={metadata.id}
                      manifestBasePath={manifestBasePath}
                      enableLightbox={true}
                    />
                  </div>
                </div>

                <hr className="border-stone-200 dark:border-neutral-800" />

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
          <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-stone-50 dark:bg-neutral-950">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-[4px] p-6 md:p-8 shadow-xs space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-[2px] bg-stone-100 dark:bg-neutral-800 text-stone-800 dark:text-stone-200">
                    Question {state.activeQuestion.questionNumber}
                  </span>
                  <div className="text-stone-900 dark:text-stone-100 text-base md:text-lg">
                    <MarkdownQuestionRenderer
                      content={state.activeQuestion.prompt}
                      category={category}
                      testId={metadata.id}
                      manifestBasePath={manifestBasePath}
                      enableLightbox={true}
                    />
                  </div>
                </div>

                <hr className="border-stone-200 dark:border-neutral-800" />

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

      {/* 3. Academic Footer */}
      <footer className="h-14 border-t border-stone-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 flex items-center justify-between z-30">
        <div className="text-xs font-mono text-stone-500">
          Question {state.currentIndex + 1} of {questions.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isFirstQuestion}
            onClick={() => actions.setCurrentIndex((idx) => Math.max(0, idx - 1))}
            className="flex items-center gap-1 px-4 py-1.5 border border-stone-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-[3px] hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            type="button"
            onClick={() => {
              if (isLastQuestion) {
                actions.openReviewModal();
              } else {
                actions.setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1));
              }
            }}
            className="flex items-center gap-1 px-4 py-1.5 bg-stone-900 hover:bg-black dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold rounded-[3px]"
          >
            <span>{isLastQuestion ? "Review Section" : "Next"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};