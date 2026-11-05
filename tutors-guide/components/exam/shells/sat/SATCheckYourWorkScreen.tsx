// components/exam/shells/sat/SATCheckYourWorkScreen.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { QuestionFrontmatter } from "@/types/content";

interface SATCheckYourWorkScreenProps {
  sectionTitle: string;
  questions: QuestionFrontmatter[];
  answers: Record<string, any>;
  onSelectIndex: (index: number) => void;
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

export const SATCheckYourWorkScreen: React.FC<SATCheckYourWorkScreenProps> = ({
  sectionTitle,
  questions,
  answers,
  onSelectIndex,
}) => {
  // Title mapping matching official Bluebook style
  const isMath = sectionTitle.toLowerCase().includes("math");
  const sectionNumber = isMath ? 2 : 1;
  const cleanSubject = isMath ? "Mathematics Questions" : "Reading and Writing Questions";
  const displayTitle = `Section ${sectionNumber}: ${cleanSubject}`;

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col items-center justify-center p-6 sm:p-12 select-none animate-in fade-in duration-150">
      <div className="max-w-3xl w-full flex flex-col items-center">
        {/* Main Header */}
        <h1 className="text-3xl sm:text-4xl font-sans font-bold text-neutral-900 dark:text-neutral-100 tracking-tight text-center mb-3">
          Check Your Work
        </h1>

        {/* Instructions */}
        <div className="text-center text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-sans space-y-1 mb-8 max-w-xl">
          <p>On test day, you won&apos;t be able to move on to the next module until time expires.</p>
          <p>
            For these practice questions, you can click <span className="font-bold">Next</span> when you&apos;re ready to move on.
          </p>
        </div>

        {/* Centered Question Matrix Card */}
        <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm p-6 sm:p-8">
          {/* Card Title & Legend Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800 gap-4">
            <h2 className="text-[15px] font-sans font-bold text-neutral-900 dark:text-neutral-100">
              {displayTitle}
            </h2>

            {/* Official 2-item Legend (No Current pin on review stage) */}
            <div className="flex items-center gap-6 text-xs font-sans font-medium text-neutral-700 dark:text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border border-dashed border-neutral-700 dark:border-neutral-400 bg-transparent rounded-none" />
                <span>Unanswered</span>
              </div>

              <div className="flex items-center gap-1.5">
                <BookmarkRibbon className="w-2.5 h-3.5 shrink-0" />
                <span>For Review</span>
              </div>
            </div>
          </div>

          {/* Tile Grid */}
          <div className="pt-6">
            <div className="flex flex-wrap items-center justify-center gap-3 max-h-[50vh] overflow-y-auto px-1 pt-2 pb-2">
              {questions.map((q, idx) => {
                const answer = answers[q.id];
                const isAnswered =
                  Boolean(answer?.selectedOptionId) ||
                  (typeof answer?.frqUserAnswer === "string" &&
                    answer.frqUserAnswer.trim().length > 0);
                const isFlagged = Boolean(answer?.flagged);

                return (
                  <div key={q.id} className="relative flex flex-col items-center">
                    {/* Flagged Red Ribbon */}
                    {isFlagged && (
                      <div className="absolute -top-1 -right-1 z-20 pointer-events-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">
                        <BookmarkRibbon className="w-3 h-3.5" withBorder />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectIndex(idx)}
                      className={`relative flex items-center justify-center w-9 h-9 text-[15px] font-bold font-sans transition-all cursor-pointer ${
                        isAnswered
                          ? isFlagged
                            ? "bg-[#2050c8] text-white hover:bg-[#1a42a5] rounded-l-[3px] rounded-b-[3px] rounded-tr-[10px]"
                            : "bg-[#2050c8] text-white hover:bg-[#1a42a5] rounded-none"
                          : "bg-white dark:bg-neutral-900 text-[#2050c8] border border-dashed border-neutral-700 dark:border-neutral-400 hover:border-solid hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-none"
                      }`}
                    >
                      <span>{q.questionNumber}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};