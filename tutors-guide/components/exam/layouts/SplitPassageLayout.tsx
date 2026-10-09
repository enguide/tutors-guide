// components/exam/layouts/SplitPassageLayout.tsx
"use client";

import React from "react";
import { QuestionFrontmatter } from "@/types/content";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { QuestionOptions } from "../QuestionOptions";

interface SplitPassageLayoutProps {
  passageContent: string;
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

export const SplitPassageLayout: React.FC<SplitPassageLayoutProps> = ({
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
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
      {/* Left Pane: Stimulus / Reading Passage */}
      <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-6 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Reference Passage
          </span>
          <MarkdownQuestionRenderer
            content={passageContent}
            category={category}
            testId={testId}
            manifestBasePath={manifestBasePath}
          />
        </div>
      </div>

      {/* Right Pane: Question Prompt & Response Selection */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Prompt Header */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Question {activeQuestion.questionNumber}
            </span>
            <div className="text-slate-900 dark:text-slate-100 text-base">
              <MarkdownQuestionRenderer
                content={activeQuestion.prompt}
                category={category}
                testId={testId}
                manifestBasePath={manifestBasePath}
              />
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Interactive Choices */}
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