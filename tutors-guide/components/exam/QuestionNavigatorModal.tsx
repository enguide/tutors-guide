// components/exam/QuestionNavigatorModal.tsx
"use client";

import React, { useEffect } from "react";
import { X, Bookmark } from "lucide-react";
import { QuestionFrontmatter } from "@/types/content";
import { StudentAnswers } from "@/hooks/useTestProgress";

interface QuestionNavigatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionFrontmatter[];
  currentIndex: number;
  answers: StudentAnswers;
  onSelectIndex: (index: number) => void;
}

export const QuestionNavigatorModal: React.FC<QuestionNavigatorModalProps> = ({
  isOpen,
  onClose,
  questions,
  currentIndex,
  answers,
  onSelectIndex,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Section Review Navigator
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pb-2">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded border border-blue-600 bg-blue-600" /> Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800" /> Answered
          </span>
          <span className="flex items-center gap-1.5">
            <Bookmark size={12} className="text-amber-500 fill-amber-500" /> Flagged
          </span>
        </div>

        {/* Question Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2.5 max-h-[50vh] overflow-y-auto p-1">
          {questions.map((q, idx) => {
            const answerState = answers[q.id];
            const hasAnswer =
              Boolean(answerState?.selectedOptionId) ||
              Boolean(answerState?.frqUserAnswer?.trim());
            const isFlagged = Boolean(answerState?.flagged);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  onSelectIndex(idx);
                  onClose();
                }}
                className={`relative flex flex-col items-center justify-center h-11 rounded-lg border text-xs font-semibold transition ${
                  isCurrent
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30"
                    : hasAnswer
                    ? "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400"
                    : "border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <span>{q.questionNumber}</span>
                {isFlagged && (
                  <Bookmark
                    size={10}
                    className={`absolute top-1 right-1 ${
                      isCurrent ? "fill-white text-white" : "fill-amber-500 text-amber-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};