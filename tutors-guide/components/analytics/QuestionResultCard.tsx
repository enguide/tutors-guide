// components/analytics/QuestionResultCard.tsx
"use client";

import React, { useState } from "react";
import { EnrichedResponseItem } from "@/types/analytics";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calculator,
  RefreshCw,
  BookOpen,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";

interface QuestionResultCardProps {
  item: EnrichedResponseItem;
  category?: string;
  testId?: string;
  targetSeconds?: number;
}

export const QuestionResultCard: React.FC<QuestionResultCardProps> = ({
  item,
  category = "SAT",
  testId,
  targetSeconds = 80,
}) => {
  const [showSolution, setShowSolution] = useState(false);

  const timeSpent = item.timeSpentOnResponse ?? 0;
  const isPacingRisk = timeSpent > targetSeconds * 1.5;
  const hasStimulus = Boolean(item.passageText && item.passageText.trim().length > 0);

  // Minimal, authentic Bluebook / AP Item Action Bar (Question Number only)[cite: 17, 18]
  const renderExamActionBar = () => (
    <div className="flex items-stretch bg-neutral-100 dark:bg-neutral-800 h-9 select-none overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-700 w-fit">
      <div className="w-9 h-full flex items-center justify-center bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-base font-sans font-bold">
        {item.responseOrder}
      </div>
    </div>
  );

  return (
    <div className="rounded-none border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
      {/* Top Review Header: Topic, Difficulty, Skill + Telemetry Badges + Reveal Button */}
      <div className="px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/60 flex items-center justify-between flex-wrap gap-3">
        {/* Left Side: Outcome Status + Metadata Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {showSolution && (
            item.isCorrect ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-sm bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border border-neutral-900 dark:border-neutral-100">
                <CheckCircle2 size={13} /> Correct
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-sm bg-[#ff9999]/20 text-[#ff9999] border border-[#ff9999]">
                <XCircle size={13} /> Incorrect
              </span>
            )
          )}

          {/* Topic / Domain Chip */}
          <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
            {item.domain}
          </span>

          {/* Difficulty Chip */}
          <span className="text-xs px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            {item.difficulty}
          </span>

          {/* Skill Tag */}
          <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            <span className="text-neutral-400 dark:text-neutral-500 mr-1.5">•</span>
            {item.skill}
          </span>
        </div>

        {/* Right Side: Telemetry Badges (Calculator, Revised, Time) + Solution Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {item.usedCalculator && (
            <span
              title="Calculator opened on this question"
              className="flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-sm bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-900"
            >
              <Calculator size={11} />
              Calc
            </span>
          )}

          {item.changedAnswer && (
            <span
              title="Answer was revised during exam"
              className="flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-sm bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium border border-amber-200 dark:border-amber-900"
            >
              <RefreshCw size={11} />
              Revised
            </span>
          )}

          <span
            className={`flex items-center gap-1 text-xs font-mono font-medium px-2 py-0.5 rounded-sm border ${
              isPacingRisk
                ? "bg-[#ff9999]/20 text-[#ff9999] font-bold border-[#ff9999]"
                : "bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700"
            }`}
          >
            <Clock size={11} />
            {timeSpent}s
          </span>

          <button
            type="button"
            onClick={() => setShowSolution((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm border transition-colors select-none ${
              showSolution
                ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300/70"
                : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
            }`}
          >
            {showSolution ? (
              <>
                <EyeOff size={14} /> Hide Solution
              </>
            ) : (
              <>
                <Eye size={14} /> Reveal Solution
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Question Body Rendered in AP/SAT Test Shell Layout[cite: 17, 18] */}
      <div className="p-6 md:p-8">
        {hasStimulus ? (
          /* Split-Screen Layout (Reading / Writing / Stimulus-based)[cite: 17, 18] */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:divide-x lg:divide-neutral-200 dark:lg:divide-neutral-800">
            {/* Left Column: Stimulus / Reading Passage[cite: 17, 18] */}
            <div className="pr-0 lg:pr-6 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 uppercase tracking-wider pb-1 border-b border-neutral-200 dark:border-neutral-800">
                <BookOpen size={13} /> Stimulus / Reading Passage
              </div>
              <div className="font-serif text-[15.5px] leading-[1.65] text-neutral-900 dark:text-neutral-100 max-h-[600px] overflow-y-auto pr-2">
                <MarkdownQuestionRenderer
                  content={item.passageText!}
                  category={category}
                  testId={testId}
                />
              </div>
            </div>

            {/* Right Column: Question Stem & Choices[cite: 17, 18] */}
            <div className="pl-0 lg:pl-6 space-y-4">
              {renderExamActionBar()}

              {/* Prompt[cite: 17, 18] */}
              <div className="font-serif text-[15.5px] leading-[1.65] text-neutral-900 dark:text-neutral-100">
                <MarkdownQuestionRenderer
                  content={item.prompt}
                  category={category}
                  testId={testId}
                />
              </div>

              {/* Options[cite: 17, 18] */}
              {renderExamOptions(item, showSolution, category, testId)}
            </div>
          </div>
        ) : (
          /* Single-Column Centered Layout (Math / Discrete items)[cite: 17, 18] */
          <div className="max-w-2xl mx-auto space-y-6">
            {renderExamActionBar()}

            {/* Prompt[cite: 17, 18] */}
            <div className="font-serif text-[15.5px] leading-[1.65] text-neutral-900 dark:text-neutral-100">
              <MarkdownQuestionRenderer
                content={item.prompt}
                category={category}
                testId={testId}
              />
            </div>

            {/* Options[cite: 17, 18] */}
            {renderExamOptions(item, showSolution, category, testId)}
          </div>
        )}

        {/* Explanation Box: Displayed only when the solution is revealed */}
        {showSolution && item.explanation && (
          <div className="mt-8 p-4 rounded-sm bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 text-xs text-neutral-800 dark:text-neutral-200 animate-in fade-in duration-150">
            <span className="font-bold text-blue-700 dark:text-blue-300 block mb-1.5 text-xs uppercase tracking-wide">
              Explanation & Key Strategy:
            </span>
            <div className="font-serif text-[14px] leading-relaxed">
              <MarkdownQuestionRenderer
                content={item.explanation}
                category={category}
                testId={testId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-renderer for Option Cards[cite: 19]
function renderExamOptions(
  item: EnrichedResponseItem,
  showSolution: boolean,
  category?: string,
  testId?: string
) {
  // Free Response / Student-Produced Response
  if (item.responseType === "FR") {
    return (
      <div className="pt-2 space-y-3 font-sans">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Student Answer vs. Correct Key
        </label>

        {showSolution ? (
          <div className="flex items-center gap-4 animate-in fade-in">
            <div
              className={`p-3 border rounded-sm bg-neutral-50 dark:bg-neutral-900 min-w-36 ${
                !item.isCorrect
                  ? "border-[#ff9999] ring-2 ring-[#ff9999]"
                  : "border-neutral-300 dark:border-neutral-700"
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                Your Answer
              </span>
              <span
                className={`font-mono text-sm font-bold ${
                  item.isCorrect
                    ? "text-neutral-900 dark:text-neutral-100"
                    : "text-[#ff9999]"
                }`}
              >
                {item.frqUserAnswer || "(Blank / Omitted)"}
              </span>
            </div>

            <div className="p-3 border-2 border-neutral-900 dark:border-neutral-100 ring-2 ring-neutral-900 dark:ring-neutral-100 rounded-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 min-w-36">
              <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">
                Correct Key
              </span>
              <span className="font-mono text-sm font-bold">{item.correctAnswerKey}</span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-sm border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs text-muted-foreground font-mono">
            Free response answer hidden. Click &ldquo;Reveal Solution&rdquo; to compare your answer and the key.
          </div>
        )}
      </div>
    );
  }

  // Multiple Choice Options[cite: 19]
  return (
    <div className="space-y-3 pt-2">
      {item.options?.map((option) => {
        // Selection evaluation is strictly gated by showSolution
        const isSelected = showSolution && item.selectedOptionId === option.id;
        const isAnswerKey = item.correctAnswerKey === option.id;

        // Default: Exactly matches neutral, unselected exam styling[cite: 19]
        let cardStyle =
          "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100";
        let discStyle =
          "border-2 border-neutral-500 dark:border-neutral-400 text-neutral-800 dark:text-neutral-200";

        if (showSolution) {
          if (isAnswerKey) {
            // Correct Answer Key: Matches the active in-test selection border & ring[cite: 19]
            cardStyle =
              "border-neutral-900 dark:border-neutral-100 ring-2 ring-neutral-900 dark:ring-neutral-100 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100";
            discStyle =
              "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold border-transparent";
          } else if (isSelected && !item.isCorrect) {
            // Student's Incorrect Pick: Uses graph accent color (#ff9999)[cite: 5, 11]
            cardStyle =
              "border-[#ff9999] ring-2 ring-[#ff9999] bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100";
            discStyle =
              "bg-[#ff9999] text-white border-transparent font-bold";
          }
          // Other choices fall through unaltered with standard borders and zero opacity reduction[cite: 19]
        }

        return (
          <div
            key={option.id}
            className={`relative flex items-center px-4 py-3 rounded-xl border text-left select-none transition-all ${cardStyle}`}
          >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              {/* Option Letter Disc[cite: 19] */}
              <div
                className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans transition-colors ${discStyle}`}
              >
                {option.id}
              </div>

              {/* Option Text in Academic Serif[cite: 17, 18, 19] */}
              <div className="flex-1 min-w-0 font-serif text-[15.5px] leading-[1.6]">
                <MarkdownQuestionRenderer
                  content={option.text}
                  category={category}
                  testId={testId}
                  className="prose-p:mb-0"
                />
              </div>

              {/* Status Badges[cite: 5, 11] */}
              {showSolution && isAnswerKey && (
                <span className="inline-flex items-center gap-1 text-[11px] font-sans font-bold px-2 py-0.5 rounded-sm bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shrink-0 ml-auto">
                  <Check size={12} strokeWidth={3} /> Correct Key
                </span>
              )}
              {showSolution && isSelected && !isAnswerKey && (
                <span className="inline-flex items-center gap-1 text-[11px] font-sans font-bold px-2 py-0.5 rounded-sm bg-[#ff9999] text-white shrink-0 ml-auto">
                  <X size={12} strokeWidth={3} /> Your Answer
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}