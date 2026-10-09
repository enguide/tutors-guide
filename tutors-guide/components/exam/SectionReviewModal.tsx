// components/exam/SectionReviewModal.tsx
"use client";

import React, { useMemo } from "react";
import { QuestionFrontmatter } from "@/types/content";
import { StudentAnswers } from "@/hooks/useTestProgress";
import { SupportedExamCategory } from "@/types/examConfig";
import { Bookmark, AlertTriangle, ArrowRight, X } from "lucide-react";

interface SectionReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  category: SupportedExamCategory;
  sectionTitle: string;
  questions: QuestionFrontmatter[];
  answers: StudentAnswers;
  onJumpToQuestion: (index: number) => void;
}

export const SectionReviewModal: React.FC<SectionReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  category,
  sectionTitle,
  questions,
  answers,
  onJumpToQuestion,
}) => {
  // 1. All hooks MUST be declared before any early return
  const { unansweredCount, flaggedCount } = useMemo(() => {
    let unanswered = 0;
    let flagged = 0;

    questions.forEach((q) => {
      const a = answers[q.id];
      const isAnswered =
        Boolean(a?.selectedOptionId?.trim()) || Boolean(a?.frqUserAnswer?.trim());
      if (!isAnswered) unanswered++;
      if (a?.flagged) flagged++;
    });

    return { unansweredCount: unanswered, flaggedCount: flagged };
  }, [questions, answers]);

  // 2. Early return guard placed strictly after hook declarations
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {category}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {sectionTitle} — Review & Submit
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review your answers before finalizing this section. Once submitted, your answers cannot be modified.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning Badge if unanswered or flagged */}
        {(unansweredCount > 0 || flaggedCount > 0) && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600 shrink-0" />
              <span>
                You have <strong>{unansweredCount} unanswered</strong> and{" "}
                <strong>{flaggedCount} bookmarked</strong> question{flaggedCount === 1 ? "" : "s"}.
              </span>
            </div>
          </div>
        )}

        {/* Question Grid Navigator */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
            Question Status (Click any question to return to it)
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {questions.map((q, idx) => {
              const a = answers[q.id];
              const isAnswered =
                Boolean(a?.selectedOptionId?.trim()) || Boolean(a?.frqUserAnswer?.trim());
              const isFlagged = Boolean(a?.flagged);

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    onJumpToQuestion(idx);
                    onClose();
                  }}
                  className={`relative h-11 rounded-md border flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                    isAnswered
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700"
                      : "bg-transparent text-slate-400 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400"
                  }`}
                >
                  {isFlagged && (
                    <Bookmark
                      size={10}
                      className="absolute top-1 right-1 fill-amber-500 text-amber-500"
                    />
                  )}
                  <span>{q.questionNumber}</span>
                  <span className="text-[9px] font-normal font-sans">
                    {isAnswered ? "Answered" : "Empty"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors"
          >
            Return to Questions
          </button>

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              "Finalizing Section..."
            ) : (
              <>
                <span>Submit & Complete Section</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};