// components/exam/QuestionOptions.tsx
"use client";

import React from "react";
import { QuestionFrontmatter } from "@/types/content";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";

export type QuestionOptionVariant = "sat" | "ap" | "act" | "gre";

interface QuestionOptionsProps {
  question: QuestionFrontmatter;
  selectedOptionId?: string;
  frqAnswer?: string;
  eliminatedOptions?: string[];
  isCrossOutMode: boolean;
  variant?: QuestionOptionVariant;
  category?: string;
  testId?: string;
  manifestBasePath?: string;
  onSelectOption: (optionId: string) => void;
  onSetFrqAnswer: (value: string) => void;
  onToggleEliminate: (optionId: string) => void;
}

export const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  question,
  selectedOptionId,
  frqAnswer = "",
  eliminatedOptions = [],
  isCrossOutMode,
  variant = "sat",
  category,
  testId,
  manifestBasePath,
  onSelectOption,
  onSetFrqAnswer,
  onToggleEliminate,
}) => {
  // Free Response / Grid-In Handling
  if (question.questionType === "FR") {
    return (
      <div className="pt-4 space-y-3 font-sans">
        <label
          htmlFor="frq-input"
          className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
        >
          Answer
        </label>
        <div className="max-w-xs">
          <input
            id="frq-input"
            type="text"
            value={frqAnswer}
            onChange={(e) => onSetFrqAnswer(e.target.value)}
            placeholder="Enter answer"
            className="w-full px-4 py-2.5 rounded-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-base focus:outline-hidden focus:border-neutral-900 dark:focus:border-neutral-100"
          />
        </div>
      </div>
    );
  }

  // Handle Option Card Selection
  const handleCardClick = (optionId: string) => {
    // Unconditionally select - useTestProgress now handles clearing elimination atomically
    onSelectOption(optionId);
  };

  // Handle Dedicated Elimination Button Trigger (on the right)
  const handleEliminateTrigger = (e: React.MouseEvent, optionId: string) => {
    e.stopPropagation();

    // If student strikes out the currently selected option, deselect it
    if (selectedOptionId === optionId) {
      onSelectOption("");
    }

    onToggleEliminate(optionId);
  };

  const isAcademicSerif = variant === "sat" || variant === "ap";

  // Common styling to constrain image dimensions inside option buttons
  const optionImageStyles = "[&_img]:max-h-64 [&_img]:w-auto [&_img]:object-contain [&_img]:my-1";

  return (
    <div className={`space-y-3 pt-2 ${isAcademicSerif ? "" : "font-sans"}`}>
      {question.options?.map((option) => {
        const isSelected = selectedOptionId === option.id;
        const isEliminated = !isSelected && eliminatedOptions.includes(option.id);

        return (
          <div key={option.id} className="flex items-center gap-3">
            {/* Main Option Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(option.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(option.id);
                }
              }}
              className={`relative flex-1 flex items-center px-4 py-3 rounded-xl border text-left cursor-pointer select-none transition-all ${
                isSelected
                  ? "border-neutral-900 dark:border-neutral-100 ring-2 ring-neutral-900 dark:ring-neutral-100 bg-white dark:bg-neutral-900 opacity-100"
                  : isEliminated
                  ? "opacity-40 bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800"
                  : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600"
              }`}
            >
              {isEliminated && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b-2 border-neutral-900 dark:border-neutral-100 z-10 pointer-events-none" />
              )}

              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Option Letter Disc: Stays clean sans-serif */}
                <div
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans font-bold transition-colors ${
                    isSelected
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                      : "border-2 border-neutral-500 dark:border-neutral-400 text-neutral-800 dark:text-neutral-200"
                  }`}
                >
                  {option.id}
                </div>

                {/* Option Content: Render with category/testId context */}
                <div
                  className={`flex-1 min-w-0 text-neutral-900 dark:text-neutral-100 ${
                    isAcademicSerif
                      ? "font-serif text-[15.5px] leading-[1.6] font-normal"
                      : "font-sans text-[15px] leading-normal"
                  }`}
                >
                  <MarkdownQuestionRenderer
                    content={option.text}
                    category={category}
                    testId={testId}
                    manifestBasePath={manifestBasePath}
                    className={
                      isAcademicSerif
                        ? `font-serif prose-p:font-serif text-[15.5px] leading-[1.6] prose-p:mb-0 ${optionImageStyles}`
                        : `prose-p:mb-0 ${optionImageStyles}`
                    }
                  />
                </div>
              </div>
            </div>

            {/* Right Action: Cross-out trigger */}
            {isCrossOutMode && (
              <div className="shrink-0 w-12 flex items-center justify-center">
                {isEliminated ? (
                  <button
                    type="button"
                    onClick={(e) => handleEliminateTrigger(e, option.id)}
                    className="text-xs font-bold font-sans text-neutral-900 dark:text-neutral-100 underline underline-offset-2 hover:opacity-75"
                  >
                    Undo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleEliminateTrigger(e, option.id)}
                    className="group relative w-6 h-6 rounded-full border border-neutral-700 dark:border-neutral-300 flex items-center justify-center text-[12px] font-sans font-bold text-neutral-800 dark:text-neutral-200 transition-colors"
                    title={`Eliminate option ${option.id}`}
                  >
                    <span>{option.id}</span>
                    <span className="absolute -left-1 -right-1 top-1/2 -translate-y-1/2 h-[1.5px] dark:border-neutral-300 bg-neutral-700 dark:bg-neutral-300 pointer-events-none group-hover:bg-black dark:group-hover:bg-white" />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};