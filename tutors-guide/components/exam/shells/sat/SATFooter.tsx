// components/exam/shells/sat/SATFooter.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuestionFrontmatter } from "@/types/content";
import { SATQuestionNavigatorPopover } from "./SATQuestionNavigatorPopover";
import { SATDashedDivider } from "./SATDashedDivider";

interface SATFooterProps {
  currentIndex: number;
  totalQuestions: number;
  studentName?: string;
  sectionTitle: string;
  questions: QuestionFrontmatter[];
  answers: Record<string, any>;
  isReviewScreen?: boolean; // <-- Added
  onSelectIndex: (idx: number) => void;
  onOpenReviewModal: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const SATFooter: React.FC<SATFooterProps> = ({
  currentIndex,
  totalQuestions,
  studentName,
  sectionTitle,
  questions,
  answers,
  isReviewScreen = false,
  onSelectIndex,
  onOpenReviewModal,
  onPrev,
  onNext,
}) => {
  // Back is only disabled on the very first question when NOT on the review screen
  const isBackDisabled = !isReviewScreen && currentIndex === 0;

  return (
    <footer className="relative h-18 bg-[#EBF3FA] dark:bg-neutral-950 px-4 sm:px-8 grid grid-cols-3 items-center select-none z-30">
      {/* Left Column: Student Profile Name */}
      <div className="justify-self-start text-xs sm:text-[14px] md:text-lg md:font-semibold text-neutral-800 dark:text-neutral-200 font-normal truncate max-w-30 sm:max-w-xs font-sans">
        {studentName || "Student Preview"}
      </div>

      {/* Center Column: Render navigator only when not on Check Your Work review */}
      <div className="justify-self-center">
        {!isReviewScreen && (
          <SATQuestionNavigatorPopover
            currentIndex={currentIndex}
            sectionTitle={sectionTitle}
            questions={questions}
            answers={answers}
            onSelectIndex={onSelectIndex}
            onOpenReviewModal={onOpenReviewModal}
          />
        )}
      </div>

      {/* Right Column: Responsive Bluebook Oval Navigation Buttons */}
      <div className="justify-self-end flex items-center gap-1.5 sm:gap-2.5">
        <button
          type="button"
          disabled={isBackDisabled}
          onClick={onPrev}
          aria-label="Previous Question"
          className="p-2 sm:px-6 sm:py-2 bg-[#2050c8] hover:bg-[#1a42a5] disabled:opacity-25 disabled:pointer-events-none text-white rounded-full text-xs font-bold tracking-tight shadow-xs transition-colors cursor-pointer flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4 sm:hidden stroke-[2.5]" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Next Question"
          className="p-2 sm:px-6 sm:py-2 bg-[#2050c8] hover:bg-[#1a42a5] text-white rounded-full text-xs font-bold tracking-tight shadow-xs transition-colors cursor-pointer flex items-center justify-center"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 sm:hidden stroke-[2.5]" />
        </button>
      </div>
      <SATDashedDivider position="top" />
    </footer>
  );
};