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
  sectionId?: string;
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
  sectionId,
  manifestBasePath,
  onSelectOption,
  onSetFrqAnswer,
  onToggleEliminate,
}) => {
  // -------------------------------------------------------------
  // 1. Handwritten Optical Free Response (Epic 16)
  // -------------------------------------------------------------
  if (question.questionType === "FRQ_HANDWRITTEN") {
    const packetPageStart = (question.questionNumber - 1) * 2 + 4;
    const packetPageEnd = packetPageStart + 1;

    return (
      <div className="pt-4 pb-2">
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="space-y-2 flex-1">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Physical Response Packet Directive
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Complete all handwritten work for Question {question.questionNumber} inside your physical response packet:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
                <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded flex items-center justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Sheet 1 (Parts A & B)</span>
                  <span className="text-[11px] text-neutral-400 font-sans">Page {packetPageStart}</span>
                </div>
                <div className="px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded flex items-center justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Sheet 2 (Parts C & D)</span>
                  <span className="text-[11px] text-neutral-400 font-sans">Page {packetPageEnd}</span>
                </div>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-1">
                Do not stop to upload now. You will be prompted to scan and upload all sheets continuously after completing this section.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. Standard Typed Free Response / Grid-In Handling
  // -------------------------------------------------------------
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

  const optionImageStyles = "[&_img]:max-h-64 [&_img]:w-auto [&_img]:object-contain [&_img]:my-1";

  // -------------------------------------------------------------
  // 3. ACT Presentation: TestNav Native Inline Radio Controls
  // -------------------------------------------------------------
  if (variant === "act") {
    return (
      <div className="space-y-5 pt-2 act-content-area select-none">
        {question.options?.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isEliminated = !isSelected && eliminatedOptions.includes(option.id);

          return (
            <div key={option.id} className="flex items-center gap-3 group">
              <div
                onClick={() => onSelectOption(option.id)}
                className={`flex items-center gap-3 flex-1 cursor-pointer select-none transition-opacity ${
                  isEliminated ? "opacity-35" : "hover:opacity-90"
                }`}
              >
                {/* Dynamic ACT Radio Disc */}
                <div className="shrink-0 flex items-center justify-center">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-[var(--act-radio-selected)] bg-[var(--act-radio-selected)]"
                        : "border-[var(--act-radio-border)] bg-[var(--act-card-bg)] group-hover:border-[var(--act-text-main)]"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--act-radio-dot)]" />
                    )}
                  </div>
                </div>

                {/* Option Identifier & Body */}
                <div
                  className={`flex-1 text-[14px] leading-normal text-[var(--act-text-main)] ${
                    isEliminated ? "line-through" : ""
                  }`}
                >
                  <span className="flex flex-row items-center">
                    <span className="font-normal mr-2.5 opacity-90">
                      {option.id}.
                    </span>
                    <span className="inline">
                      <MarkdownQuestionRenderer
                        content={option.text}
                        category={category}
                        testId={testId}
                        manifestBasePath={manifestBasePath}
                        className={`inline prose-p:inline prose-p:m-0 ${optionImageStyles}`}
                      />
                    </span>
                  </span>
                </div>
              </div>

              {isCrossOutMode && (
                <div className="shrink-0">
                  {isEliminated ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleEliminate(option.id);
                      }}
                      className="text-xs font-bold underline opacity-75 hover:opacity-100"
                    >
                      Undo
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleEliminate(option.id);
                      }}
                      title={`Eliminate option ${option.id}`}
                      className="text-xs opacity-50 hover:opacity-100 font-bold px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. SAT & AP Presentation: Card Enclosures with Letter Badges
  // -------------------------------------------------------------
  const isAcademicSerif = variant === "sat" || variant === "ap";
  const isApTheme = variant === "ap";

  return (
    <div className={`space-y-3 pt-2 ${isAcademicSerif ? "" : "font-sans"}`}>
      {question.options?.map((option) => {
        const isSelected = selectedOptionId === option.id;
        const isEliminated = !isSelected && eliminatedOptions.includes(option.id);

        return (
          <div key={option.id} className="flex items-center gap-3">
            {/* Primary Enclosed Option Card */}
            <button
              type="button"
              onClick={() => onSelectOption(option.id)}
              className={`relative flex-1 flex items-center px-4 py-3 border text-left cursor-pointer select-none transition-all ${
                isApTheme ? "rounded-md" : "rounded-xl"
              } ${
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

              <div className="flex items-center gap-3.5 flex-1 min-w-0 pointer-events-none">
                <div
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans font-bold transition-colors ${
                    isSelected
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                      : "border-2 border-neutral-500 dark:border-neutral-400 text-neutral-800 dark:text-neutral-200"
                  }`}
                >
                  {option.id}
                </div>

                <div
                  className={`flex-1 min-w-0 text-neutral-900 dark:text-neutral-100 [&:has(.large-op,.op-limits)]:pt-1 ${
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
            </button>

            {isCrossOutMode && (
              <div className="shrink-0 w-12 flex items-center justify-center">
                {isEliminated ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleEliminate(option.id);
                    }}
                    className="text-xs font-bold font-sans text-neutral-900 dark:text-neutral-100 underline underline-offset-2 hover:opacity-75"
                  >
                    Undo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleEliminate(option.id);
                    }}
                    className="group relative w-6 h-6 rounded-full border border-neutral-700 dark:border-neutral-300 flex items-center justify-center text-[12px] font-sans font-bold text-neutral-800 dark:text-neutral-200 transition-colors"
                    title={`Eliminate option ${option.id}`}
                  >
                    <span>{option.id}</span>
                    <span className="absolute -left-1 -right-1 top-1/2 -translate-y-1/2 h-[1.5px] bg-neutral-700 dark:border-neutral-300 pointer-events-none group-hover:bg-black dark:group-hover:bg-white" />
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