// components/exam/layouts/SingleColumnLayout.tsx
"use client";

import React from "react";
import { QuestionFrontmatter } from "@/types/content";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { QuestionOptions } from "../QuestionOptions";

interface SingleColumnLayoutProps {
  passageContent?: string;
  activeQuestion: QuestionFrontmatter;
  selectedOptionId?: string;
  frqAnswer?: string;
  eliminatedOptions?: string[];
  isCrossOutMode: boolean;
  category?: string;
  testId?: string;
  manifestBasePath?: string;
  onSelectOption: (optionId: string) => void;
  onSetFrqAnswer: (value: string) => void;
  onToggleEliminate: (optionId: string) => void;
}

export const SingleColumnLayout: React.FC<SingleColumnLayoutProps> = ({
  passageContent,
  activeQuestion,
  selectedOptionId,
  frqAnswer,
  eliminatedOptions,
  isCrossOutMode,
  category,
  testId,
  manifestBasePath,
  onSelectOption,
  onSetFrqAnswer,
  onToggleEliminate,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Optional Context/Intro (if provided in markdown) */}
        {passageContent && passageContent.trim().length > 0 && (
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Directions / Context
            </span>
            <MarkdownQuestionRenderer
              content={passageContent}
              category={category}
              testId={testId}
              manifestBasePath={manifestBasePath}
            />
          </div>
        )}

        {/* Question Prompt */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Question {activeQuestion.questionNumber}
            </span>
            <div className="text-slate-900 dark:text-slate-100 text-base md:text-lg">
              <MarkdownQuestionRenderer
                content={activeQuestion.prompt}
                category={category}
                testId={testId}
                manifestBasePath={manifestBasePath}
              />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Answer Options */}
          <QuestionOptions
            question={activeQuestion}
            selectedOptionId={selectedOptionId}
            frqAnswer={frqAnswer}
            eliminatedOptions={eliminatedOptions}
            isCrossOutMode={isCrossOutMode}
            onSelectOption={onSelectOption}
            onSetFrqAnswer={onSetFrqAnswer}
            onToggleEliminate={onToggleEliminate}
          />
        </div>
      </div>
    </div>
  );
};