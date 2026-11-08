// components/exam/shells/sat/SATQuestionNavigatorPopover.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { QuestionFrontmatter } from "@/types/content";

interface SATQuestionNavigatorPopoverProps {
  currentIndex: number;
  sectionTitle: string;
  questions: QuestionFrontmatter[];
  answers: Record<string, any>;
  onSelectIndex: (index: number) => void;
  onOpenReviewModal: () => void;
}

function BookmarkRibbon({
  className = "w-3 h-4",
  withBorder = false,
}: {
  className?: string;
  withBorder?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 12 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 0H12V16L6 11.5L0 16V0Z"
        className="fill-[#C5221F]"
        stroke={withBorder ? "#ffffff" : undefined}
        strokeWidth={withBorder ? "1.5" : "0"}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CurrentLocationPin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8 0.5C4.41 0.5 1.5 3.41 1.5 7C1.5 11.5 8 17.5 8 17.5C8 17.5 14.5 11.5 14.5 7C14.5 3.41 11.59 0.5 8 0.5Z"
        fill="white"
        stroke="#1e1e1e"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="7" r="2" fill="#1e1e1e" />
    </svg>
  );
}

export const SATQuestionNavigatorPopover: React.FC<
  SATQuestionNavigatorPopoverProps
> = ({
  currentIndex,
  sectionTitle,
  questions,
  answers,
  onSelectIndex,
  onOpenReviewModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Formats title: determines section number (Math is Section 2, Reading & Writing is Section 1)
  const isMath = sectionTitle.toLowerCase().includes("math");
  const sectionNumber = isMath ? 2 : 1;
  const cleanSubject = isMath ? "Mathematics Questions" : "Reading and Writing Questions";
  const displayTitle = `Section ${sectionNumber}: ${cleanSubject}`;

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 w-95 sm:w-120 md:w-130 bg-white dark:bg-neutral-900 border border-neutral-300/20 dark:border-neutral-700/20 shadow-lg rounded-lg p-5 z-50 animate-in fade-in zoom-in-95 duration-100 select-none">
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-neutral-900 rotate-45 border-b border-r border-neutral-300 dark:border-neutral-700 pointer-events-none" />

          {/* Header with Centered Title & Pinned Close Button */}
          <div className="relative flex items-center justify-center pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-[15px] font-bold text-neutral-900 dark:text-neutral-100 tracking-tight text-center">
              {displayTitle}
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-0 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-0.5 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 py-2.5 border-b border-neutral-200 dark:border-neutral-800 text-[12px] font-medium text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-1.5">
              <CurrentLocationPin className="w-3.5 h-4 shrink-0" />
              <span>Current</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border border-dashed border-neutral-700 dark:border-neutral-400 bg-transparent rounded-none" />
              <span>Unanswered</span>
            </div>

            <div className="flex items-center gap-1.5">
              <BookmarkRibbon className="w-2.5 h-3.5 shrink-0" />
              <span>For Review</span>
            </div>
          </div>

          {/* Tile Grid with Top Clearance for the Map Pin */}
          <div className="pt-2 pb-3">
            <div className="flex flex-wrap items-center justify-center gap-3 max-h-[45vh] overflow-y-auto px-1 pt-5 pb-3">
              {questions.map((q, idx) => {
                const answer = answers[q.id];
                const isAnswered =
                  Boolean(answer?.selectedOptionId) ||
                  (typeof answer?.frqUserAnswer === "string" &&
                    answer.frqUserAnswer.trim().length > 0);
                const isFlagged = Boolean(answer?.flagged);
                const isCurrent = idx === currentIndex;

                return (
                  <div key={q.id} className="relative flex flex-col items-center">
                    {/* Current Question Location Pin (Offset safely inside top padding) */}
                    {isCurrent && (
                      <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                        <CurrentLocationPin className="w-4 h-4.5" />
                      </div>
                    )}

                    {/* Flagged Red Ribbon with White Outline */}
                    {isFlagged && (
                      <div className="absolute -top-1 -right-1 z-20 pointer-events-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">
                        <BookmarkRibbon className="w-3 h-3.5" withBorder />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onSelectIndex(idx);
                        setIsOpen(false);
                      }}
                      className={`relative flex items-center justify-center w-9 h-9 text-[15px] font-bold font-sans transition-all cursor-pointer ${
                        isAnswered
                          ? isFlagged
                            ? "bg-[#2050c8] text-white hover:bg-[#1a42a5] rounded-l-[3px] rounded-b-[3px] rounded-tr-[10px]"
                            : "bg-[#2050c8] text-white hover:bg-[#1a42a5] rounded-none"
                          : "bg-white dark:bg-neutral-900 text-[#2050c8] border border-dashed border-neutral-700 dark:border-neutral-400 hover:border-solid hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-none"
                      }`}
                    >
                      <span className={isCurrent ? "underline underline-offset-[3px] decoration-2" : ""}>
                        {q.questionNumber}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Page Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenReviewModal();
              }}
              className="px-6 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold rounded-full transition-colors cursor-pointer"
            >
              Go to Review Page
            </button>
          </div>
        </div>
      )}

      {/* Center Footer Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 bg-[#222222] hover:bg-[#111111] text-white rounded-md text-xs font-bold tracking-tight transition-colors shadow-xs cursor-pointer select-none"
      >
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
        )}
      </button>
    </div>
  );
};