/* eslint-disable @typescript-eslint/no-explicit-any */
// components/exam/shells/sat/SATQuestionNavigatorPopover.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, Bookmark, Check } from "lucide-react";
import { QuestionFrontmatter } from "@/types/content";

interface SATQuestionNavigatorPopoverProps {
  currentIndex: number;
  questions: QuestionFrontmatter[];
  answers: Record<string, any>;
  onSelectIndex: (index: number) => void;
  onOpenReviewModal: () => void;
}

export const SATQuestionNavigatorPopover: React.FC<SATQuestionNavigatorPopoverProps> = ({
  currentIndex,
  questions,
  answers,
  onSelectIndex,
  onOpenReviewModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Navigator Popover Sheet */}
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-85 sm:w-105 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-2xl rounded-sm p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Section Questions ({questions.length})
            </span>
            <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-neutral-900 dark:bg-neutral-100 rounded-xs" /> Answered
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500" /> Flagged
              </span>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-65 overflow-y-auto p-1">
            {questions.map((q, idx) => {
              const answer = answers[q.id];
              const isAnswered =
                Boolean(answer?.selectedOptionId) ||
                (typeof answer?.frqUserAnswer === "string" && answer.frqUserAnswer.trim().length > 0);
              const isFlagged = Boolean(answer?.flagged);
              const isCurrent = idx === currentIndex;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    onSelectIndex(idx);
                    setIsOpen(false);
                  }}
                  className={`relative flex flex-col items-center justify-center h-10 w-full text-xs font-semibold rounded-xs transition-all border ${
                    isCurrent
                      ? "border-blue-600 ring-2 ring-blue-500/30 font-bold"
                      : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
                  } ${
                    isAnswered
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                      : "bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                  }`}
                >
                  {isFlagged && (
                    <Bookmark className="w-2.5 h-2.5 text-amber-500 fill-amber-500 absolute top-0.5 right-0.5" />
                  )}
                  <span>{q.questionNumber}</span>
                  {isAnswered && (
                    <Check className="w-2.5 h-2.5 opacity-70 -mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Review Screen Launcher */}
          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenReviewModal();
              }}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white underline underline-offset-4"
            >
              Go to Review Page
            </button>
          </div>
        </div>
      )}

      {/* Popover Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-sm text-xs font-medium tracking-tight transition-colors"
      >
        <span>
          Question <strong className="font-bold">{currentIndex + 1}</strong> of {questions.length}
        </span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};