/* eslint-disable @typescript-eslint/no-explicit-any */
// components/exam/shells/act/ACTEndTestModal.tsx
"use client";

import React, { useMemo } from "react";
import { X } from "lucide-react";
import { QuestionFrontmatter } from "@/types/content";

interface ACTEndTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  questions: QuestionFrontmatter[];
  answers: Record<string, any>;
  onReviewUnanswered?: () => void;
  onReviewFlagged?: () => void;
}

export const ACTEndTestModal: React.FC<ACTEndTestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  questions,
  answers,
  onReviewUnanswered,
  onReviewFlagged,
}) => {
  const { unansweredCount, flaggedCount } = useMemo(() => {
    let unanswered = 0;
    let flagged = 0;

    questions.forEach((q) => {
      const ans = answers[q.id];
      const hasAnswer =
        Boolean(ans?.selectedOptionId) ||
        (typeof ans?.frqUserAnswer === "string" && ans.frqUserAnswer.trim().length > 0);

      if (!hasAnswer) unanswered += 1;
      if (ans?.flagged) flagged += 1;
    });

    return { unansweredCount: unanswered, flaggedCount: flagged };
  }, [questions, answers]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
    >
      {/* 1. Dedicated backdrop click catcher */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={onClose} 
      />

      {/* 2. Elevated Modal Card */}
      <div className="relative z-10 w-full max-w-xl bg-[var(--act-card-bg,#ffffff)] rounded-none shadow-2xl border border-[var(--act-card-border,#d1d5db)] p-6 font-sans text-[var(--act-text-main,#222222)] animate-in zoom-in-95 duration-150">
        {/* Close "X" Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-[var(--act-text-muted,#6b7280)] hover:text-[var(--act-text-main,#000000)] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-normal text-[var(--act-text-main,#222222)] tracking-tight mb-5">
          End Test Confirmation
        </h2>

        {/* Unanswered Status Row */}
        <div className="flex items-center gap-3 mb-3 text-[14px]">
          <span>
            There {unansweredCount === 1 ? "is" : "are"}{" "}
            <strong>{unansweredCount}</strong> unanswered question
            {unansweredCount === 1 ? "" : "s"}.
          </span>
          {unansweredCount > 0 && onReviewUnanswered && (
            <button
              type="button"
              onClick={onReviewUnanswered}
              className="bg-[var(--act-header-bg,#152B3C)] hover:opacity-90 text-[var(--act-header-fg,#ffffff)] text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-[4px] shadow-xs cursor-pointer transition-opacity"
            >
              UNANSWERED REVIEW
            </button>
          )}
        </div>

        {/* Flagged Status Row */}
        <div className="flex items-center gap-3 mb-6 text-[14px]">
          <span>
            There {flaggedCount === 1 ? "is" : "are"}{" "}
            <strong>{flaggedCount}</strong> question{flaggedCount === 1 ? "" : "s"}{" "}
            flagged for review.
          </span>
          {flaggedCount > 0 && onReviewFlagged && (
            <button
              type="button"
              onClick={onReviewFlagged}
              className="bg-[var(--act-header-bg,#152B3C)] hover:opacity-90 text-[var(--act-header-fg,#ffffff)] text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-[4px] shadow-xs cursor-pointer transition-opacity"
            >
              FLAGGED REVIEW
            </button>
          )}
        </div>

        {/* Confirmation Question */}
        <p className="text-[14px] text-[var(--act-text-muted,#4b5563)] mb-6">
          Are you sure you want to end the test? You will not be able to resume it.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-[#8E281F] hover:bg-[#721F17] disabled:opacity-50 text-white text-[12px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-[4px] transition-colors cursor-pointer shadow-xs"
          >
            {isSubmitting ? "Ending Test..." : "YES, END THE TEST"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[var(--act-text-muted,#4b5563)] hover:text-[var(--act-text-main,#000000)] text-[12px] font-bold tracking-wider uppercase cursor-pointer transition-colors"
          >
            NO, DON&apos;T END THE TEST
          </button>
        </div>
      </div>
    </div>
  );
};