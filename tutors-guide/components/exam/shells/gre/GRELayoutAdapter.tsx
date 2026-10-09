// components/exam/shells/gre/GRELayoutAdapter.tsx
"use client";

import React, { useState } from "react";
import { TestShellLayoutProps } from "@/types/examLayout";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { QuestionOptions } from "../../QuestionOptions";
import {
  Clock,
  Eye,
  EyeOff,
  Calculator,
  Bookmark,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export const GRELayoutAdapter: React.FC<TestShellLayoutProps> = ({
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

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-100 dark:bg-neutral-950 select-none font-sans">
      {/* 1. Classic GRE Header Toolbar */}
      <header className="h-14 bg-neutral-200 dark:bg-neutral-900 border-b border-neutral-300 dark:border-neutral-800 px-4 sm:px-6 flex items-center justify-between z-30 shadow-xs">
        {/* Left: Test & Question Index */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            {frontmatter.sectionTitle}
          </span>
          <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 border-l border-neutral-300 dark:border-neutral-700 pl-3">
            Question {state.currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Center: Timer Toggle */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-[3px] px-2.5 py-1">
          <Clock className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
          <span className="font-mono text-xs font-bold tracking-tight min-w-10 text-center text-neutral-900 dark:text-neutral-100">
            {isTimerHidden ? "--:--" : formatClock(state.secondsRemaining)}
          </span>
          <button
            type="button"
            onClick={() => setIsTimerHidden((prev) => !prev)}
            className="p-0.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            title="Toggle timer visibility"
          >
            {isTimerHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>
        </div>

        {/* Right: GRE PowerPrep Action Cluster */}
        <div className="flex items-center gap-1.5">
          {effectiveConfig.calculator !== "none" && (
            <button
              type="button"
              onClick={actions.toggleCalculator}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 rounded-[3px] text-xs font-semibold text-neutral-800 dark:text-neutral-200"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calc</span>
            </button>
          )}

          <button
            type="button"
            onClick={actions.openReviewModal}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 rounded-[3px] text-xs font-semibold text-neutral-800 dark:text-neutral-200"
          >
            <List className="w-3.5 h-3.5" />
            <span>Review</span>
          </button>

          <button
            type="button"
            onClick={actions.toggleFlag}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[3px] border text-xs font-semibold ${
              state.activeAnswer?.flagged
                ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300"
                : "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${state.activeAnswer?.flagged ? "fill-amber-500 text-amber-500" : ""}`} />
            <span>Mark</span>
          </button>

          <button
            type="button"
            disabled={isFirstQuestion}
            onClick={() => actions.setCurrentIndex((idx) => Math.max(0, idx - 1))}
            className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 rounded-[3px] text-xs font-bold text-neutral-800 dark:text-neutral-200 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back</span>
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
            className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border border-neutral-900 dark:border-white rounded-[3px] text-xs font-bold hover:opacity-90 shadow-xs"
          >
            <span>{isLastQuestion ? "Review" : "Next"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Single-Column Work Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-neutral-100 dark:bg-neutral-950">
        <div className="max-w-3xl mx-auto space-y-6">
          {passageContent && passageContent.trim().length > 0 && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-sm p-6 shadow-xs">
              <MarkdownQuestionRenderer
                content={passageContent}
                category={category}
                testId={metadata.id}
                manifestBasePath={manifestBasePath}
              />
            </div>
          )}

          <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-sm p-6 md:p-8 shadow-xs space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Question {state.activeQuestion.questionNumber}
              </span>
              <div className="text-neutral-900 dark:text-neutral-100 text-base leading-relaxed">
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
      </main>

      {/* 3. Minimal Bottom Status Bar */}
      <footer className="h-10 bg-neutral-200 dark:bg-neutral-900 border-t border-neutral-300 dark:border-neutral-800 px-6 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 font-mono">
        <div>
          Section {frontmatter.sectionOrder}
        </div>
        <div>
          {state.activeAnswer?.flagged && (
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              Marked for Review
            </span>
          )}
        </div>
      </footer>
    </div>
  );
};