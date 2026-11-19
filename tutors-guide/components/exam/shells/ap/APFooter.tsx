// components/exam/shells/ap/APFooter.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuestionFrontmatter } from "@/types/content";
import { APQuestionNavigatorPopover } from "./APQuestionNavigatorPopover";
import { SATDashedDivider } from "../sat/SATDashedDivider";
import { NetworkStatusPill } from "@/components/exam/NetworkStatusPill";
import type { SyncStatus } from "@/hooks/useTestProgress";

interface APFooterProps {
  currentIndex: number;
  totalQuestions: number;
  studentName?: string;
  syncStatus?: SyncStatus;
  sectionTitle: string;
  questions: QuestionFrontmatter[];
  answers: Record<string, any>;
  isReviewScreen?: boolean;
  onSelectIndex: (idx: number) => void;
  onOpenReviewModal: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const APFooter: React.FC<APFooterProps> = ({
  currentIndex,
  studentName,
  syncStatus,
  sectionTitle,
  questions,
  answers,
  isReviewScreen = false,
  onSelectIndex,
  onOpenReviewModal,
  onPrev,
  onNext,
}) => {
  const isBackDisabled = !isReviewScreen && currentIndex === 0;

  return (
    <footer className="relative h-18 bg-[#EBF3FA] dark:bg-neutral-950 px-3 sm:px-8 grid grid-cols-3 items-center select-none z-30 shrink-0">
      {/* Left Column: Student Profile Name & Network Status Indicator */}
      <div className="justify-self-start flex items-center gap-2 min-w-0">
        <span className="text-xs sm:text-[14px] md:text-lg md:font-semibold text-neutral-800 dark:text-neutral-200 font-normal truncate max-w-24 sm:max-w-xs font-sans">
          {studentName || "Student Preview"}
        </span>
        {syncStatus && (
          <NetworkStatusPill status={syncStatus} className="shrink-0" />
        )}
      </div>

      {/* Center Column: Navigator */}
      <div className="justify-self-center">
        {!isReviewScreen && (
          <APQuestionNavigatorPopover
            currentIndex={currentIndex}
            sectionTitle={sectionTitle}
            questions={questions}
            answers={answers}
            onSelectIndex={onSelectIndex}
            onOpenReviewModal={onOpenReviewModal}
          />
        )}
      </div>

      {/* Right Column: Bluebook Navigation Buttons */}
      <div className="justify-self-end flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          disabled={isBackDisabled}
          onClick={onPrev}
          aria-label="Previous Question"
          className="w-11 h-11 sm:w-auto sm:h-auto sm:px-6 sm:py-2 bg-[#2050c8] hover:bg-[#1a42a5] disabled:opacity-25 disabled:pointer-events-none text-white rounded-full text-xs font-bold tracking-tight shadow-xs transition-colors cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:hidden stroke-[2.5]" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Next Question"
          className="w-11 h-11 sm:w-auto sm:h-auto sm:px-6 sm:py-2 bg-[#2050c8] hover:bg-[#1a42a5] text-white rounded-full text-xs font-bold tracking-tight shadow-xs transition-colors cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5 sm:hidden stroke-[2.5]" />
        </button>
      </div>
      <SATDashedDivider position="top" />
    </footer>
  );
};