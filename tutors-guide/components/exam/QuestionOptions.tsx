// components/exam/QuestionOptions.tsx
"use client";

import React from "react";
import { QuestionFrontmatter } from "@/types/content";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { Strikethrough } from "lucide-react";

interface QuestionOptionsProps {
  question: QuestionFrontmatter;
  selectedOptionId?: string;
  frqAnswer?: string;
  eliminatedOptions?: string[];
  isCrossOutMode: boolean;
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
  onSelectOption,
  onSetFrqAnswer,
  onToggleEliminate,
}) => {
  // Free Response / Grid-In Handling
  if (question.questionType === "FR") {
    return (
      <div className="pt-4 space-y-3">
        <label
          htmlFor="frq-input"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          Enter Your Answer
        </label>
        <div className="max-w-xs">
          <input
            id="frq-input"
            type="text"
            value={frqAnswer}
            onChange={(e) => onSetFrqAnswer(e.target.value)}
            placeholder="Type answer or fraction..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-base focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-xs text-slate-400">
          Accepts decimals (e.g. <code>3.5</code>) or fractions (e.g. <code>7/2</code>).
        </p>
      </div>
    );
  }

  // Multiple Choice Handling
  return (
    <div className="space-y-3 pt-2">
      {question.options?.map((option) => {
        const isSelected = selectedOptionId === option.id;
        const isEliminated = eliminatedOptions.includes(option.id);

        return (
          <div
            key={option.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (isCrossOutMode) {
                onToggleEliminate(option.id);
              } else if (!isEliminated) {
                onSelectOption(option.id);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (isCrossOutMode) onToggleEliminate(option.id);
                else if (!isEliminated) onSelectOption(option.id);
              }
            }}
            className={`group relative flex items-start justify-between gap-3.5 p-4 rounded-xl border cursor-pointer select-none transition-all duration-150 ${
              isEliminated
                ? "opacity-45 bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 cursor-not-allowed"
                : isSelected
                ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-600 text-slate-900 dark:text-slate-100"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600"
            }`}
          >
            {/* Left: Letter bubble + text */}
            <div className="flex items-start gap-3.5 flex-1 pointer-events-none">
              <div
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isSelected && !isEliminated
                    ? "bg-blue-600 text-white"
                    : "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 group-hover:border-slate-500"
                }`}
              >
                {option.id}
              </div>

              <div
                className={`flex-1 text-sm pt-0.5 leading-relaxed text-slate-800 dark:text-slate-200 ${
                  isEliminated ? "line-through text-slate-400 dark:text-slate-500" : ""
                }`}
              >
                <MarkdownQuestionRenderer content={option.text} />
              </div>
            </div>

            {/* Right: In-Line Elimination Trigger */}
            {isCrossOutMode && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleEliminate(option.id);
                }}
                className={`p-1.5 rounded-md border text-xs shrink-0 transition-colors ${
                  isEliminated
                    ? "border-red-300 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                    : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
                title="Toggle strikeout"
              >
                <Strikethrough size={14} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};