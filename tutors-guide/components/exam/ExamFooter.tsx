// components/exam/ExamFooter.tsx
"use client";

import React, { useState } from "react";
import { QuestionFrontmatter } from "@/types/content";
import { StudentAnswers } from "@/hooks/useTestProgress";
import { ChevronLeft, ChevronRight, LayoutGrid, CheckSquare } from "lucide-react";

interface ExamFooterProps {
  currentIndex: number;
  totalQuestions: number;
  questions: QuestionFrontmatter[];
  answers: StudentAnswers;
  allowBacktracking?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelectIndex: (idx: number) => void;
  onOpenReview?: () => void;
}

export const ExamFooter: React.FC<ExamFooterProps> = ({
  currentIndex,
  totalQuestions,
  questions,
  answers,
  allowBacktracking = true,
  onPrev,
  onNext,
  onSelectIndex,
  onOpenReview,
}) => {
  const [isGridOpen, setIsGridOpen] = useState(false);
  const isAtOrPastLast = currentIndex >= totalQuestions - 1;

  const handleNextClick = () => {
    if (isAtOrPastLast) {
      if (onOpenReview) onOpenReview();
    } else {
      onNext();
    }
  };

  return (
    <footer className="h-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 flex items-center justify-between z-40 select-none">
      {/* Left: Quick Question Navigator & Permanent Review Trigger */}
      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsGridOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <LayoutGrid size={15} />
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </button>

        {/* Permanent review button - ALWAYS visible on all screen sizes */}
        {onOpenReview && (
          <button
            type="button"
            onClick={onOpenReview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
          >
            <CheckSquare size={14} />
            <span>Review Section</span>
          </button>
        )}

        {/* Floating Question Grid Popover */}
        {isGridOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsGridOpen(false)}
            />
            <div className="absolute bottom-12 left-0 z-50 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-72 sm:w-80 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Question Navigator
                </span>
                {onOpenReview && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsGridOpen(false);
                      onOpenReview();
                    }}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Review All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-0.5">
                {questions.map((q, idx) => {
                  const ans = answers[q.id];
                  const isAnswered =
                    Boolean(ans?.selectedOptionId?.trim()) ||
                    Boolean(ans?.frqUserAnswer?.trim());
                  const isFlagged = Boolean(ans?.flagged);
                  const isCurrent = idx === currentIndex;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      disabled={!allowBacktracking && idx < currentIndex}
                      onClick={() => {
                        onSelectIndex(idx);
                        setIsGridOpen(false);
                      }}
                      className={`relative h-9 rounded-md text-xs font-mono font-bold flex items-center justify-center border transition-all ${
                        isCurrent
                          ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                          : isAnswered
                          ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                          : "border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:border-slate-400"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {isFlagged && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                      {q.questionNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right: Step Navigation Controls */}
      <div className="flex items-center gap-3">
        {allowBacktracking && (
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={onPrev}
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleNextClick}
          className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg text-white shadow-xs transition-colors cursor-pointer ${
            isAtOrPastLast
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <span>{isAtOrPastLast ? "Review & Submit" : "Next"}</span>
          {isAtOrPastLast ? <CheckSquare size={14} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </footer>
  );
};