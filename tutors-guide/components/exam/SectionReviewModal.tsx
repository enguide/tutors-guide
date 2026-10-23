/* eslint-disable @typescript-eslint/no-explicit-any */
// components/exam/SectionReviewModal.tsx
"use client";

import React, { useState } from "react";
import { QuestionFrontmatter } from "@/types/content";
import { X, Bookmark, CheckCircle2, Circle } from "lucide-react";
import { ACTEndTestModal } from "./shells/act/ACTEndTestModal";
import { SectionCaptureModal } from "./SectionCaptureModal";

export interface SectionReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  category?: string;
  sectionTitle?: string;
  testId?: string;
  sectionId?: string;
  questions: QuestionFrontmatter[];
  answers: Record<string, any>;
  onJumpToQuestion: (index: number) => void;
}

export const SectionReviewModal: React.FC<SectionReviewModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    category,
    sectionTitle,
    testId = "",
    sectionId = "",
    questions,
    answers,
    onJumpToQuestion,
  } = props;

  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);

  const hasHandwrittenFrq = questions.some((q) => q.questionType === "FRQ_HANDWRITTEN");

  const handleFinishSectionClick = () => {
    if (hasHandwrittenFrq) {
      setIsCaptureModalOpen(true);
    } else {
      onSubmit();
    }
  };

  if (category?.toUpperCase() === "ACT") {
    return (
      <ACTEndTestModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        questions={questions}
        answers={answers}
        onReviewUnanswered={() => {
          const firstUnansweredIndex = questions.findIndex((q) => {
            const ans = answers[q.id];
            return (
              !ans?.selectedOptionId &&
              !(typeof ans?.frqUserAnswer === "string" && ans.frqUserAnswer.trim().length > 0)
            );
          });

          if (firstUnansweredIndex !== -1) {
            onJumpToQuestion(firstUnansweredIndex);
          }
          onClose();
        }}
        onReviewFlagged={() => {
          const firstFlaggedIndex = questions.findIndex(
            (q) => Boolean(answers[q.id]?.flagged)
          );

          if (firstFlaggedIndex !== -1) {
            onJumpToQuestion(firstFlaggedIndex);
          }
          onClose();
        }}
      />
    );
  }

  if (!isOpen) return null;

  const answeredCount = questions.filter((q) => {
    const ans = answers[q.id];
    return (
      Boolean(ans?.selectedOptionId) ||
      (typeof ans?.frqUserAnswer === "string" && ans.frqUserAnswer.trim().length > 0)
    );
  }).length;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150 font-sans"
      >
        <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-sm shadow-2xl p-6 sm:p-8">
          <div className="flex items-start justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Section Review
              </h2>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                {sectionTitle} • {answeredCount} of {questions.length} Answered
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-6 my-4 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Circle className="w-4 h-4 text-neutral-300 dark:text-neutral-700" />
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span>For Review</span>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-[45vh] overflow-y-auto p-1 mb-6">
            {questions.map((q, idx) => {
              const ans = answers[q.id];
              const isAnswered =
                Boolean(ans?.selectedOptionId) ||
                (typeof ans?.frqUserAnswer === "string" && ans.frqUserAnswer.trim().length > 0);
              const isFlagged = Boolean(ans?.flagged);

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    onJumpToQuestion(idx);
                    onClose();
                  }}
                  className={`relative flex flex-col items-center justify-center h-12 rounded border text-xs font-bold font-mono transition-all cursor-pointer ${
                    isAnswered
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                      : "border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
                  }`}
                >
                  {isFlagged && (
                    <Bookmark className="absolute top-1 right-1 w-3 h-3 text-amber-500 fill-amber-500" />
                  )}
                  <span>{q.questionNumber}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white uppercase transition-colors cursor-pointer"
            >
              Return to Questions
            </button>

            <button
              type="button"
              onClick={handleFinishSectionClick}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {hasHandwrittenFrq ? "Proceed to Sheet Upload" : "Finish Section"}
            </button>
          </div>
        </div>
      </div>

      {/* Post-section Batch Upload Handoff Modal */}
      <SectionCaptureModal
        isOpen={isCaptureModalOpen}
        testId={testId}
        sectionId={sectionId}
        questions={questions}
        isSubmitting={isSubmitting}
        onFinalizeSection={() => {
          setIsCaptureModalOpen(false);
          onSubmit();
        }}
      />
    </>
  );
};