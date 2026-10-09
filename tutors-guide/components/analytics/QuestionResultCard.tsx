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
  ChevronDown, 
  ChevronUp,
  BookOpen
} from "lucide-react";

interface QuestionResultCardProps {
  item: EnrichedResponseItem;
  targetSeconds?: number;
}

export const QuestionResultCard: React.FC<QuestionResultCardProps> = ({
  item,
  targetSeconds = 80,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeSpent = item.timeSpentOnResponse ?? 0;
  const isPacingRisk = timeSpent > targetSeconds * 1.5;

  return (
    <div
      className={`rounded-none border transition-all ${
        item.isCorrect
          ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          : "border-rose-200 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10"
      }`}
    >
      {/* Summary Header Bar */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="p-4 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          {item.isCorrect ? (
            <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
          ) : (
            <XCircle className="text-rose-500 shrink-0" size={20} />
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Question {item.responseOrder}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                {item.domain}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-none bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {item.difficulty}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Skill: {item.skill}
            </div>
          </div>
        </div>

        {/* Telemetry Indicator Tags */}
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 text-xs font-mono font-medium px-2 py-1 rounded-none ${
              isPacingRisk
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Clock size={12} />
            {timeSpent}s
          </span>

          {item.changedAnswer && (
            <span
              title="Answer changed during exam"
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-none bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            >
              <RefreshCw size={11} />
              Revised
            </span>
          )}

          {item.usedCalculator && (
            <span
              title="Calculator opened on this question"
              className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-none bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            >
              <Calculator size={11} />
              Calc
            </span>
          )}

          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded Question Body & Explanation */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-5">
          {/* Main Layout: Split if passage exists, otherwise single column */}
          <div className={item.passageText ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-4"}>
            
            {/* Passage Column (if present) */}
            {item.passageText && (
              <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-none bg-slate-50/50 dark:bg-slate-950/40 space-y-2 max-h-[500px] overflow-y-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border">
                  <BookOpen size={13} /> Stimulus / Reading Passage
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-200 font-serif leading-relaxed">
                  <MarkdownQuestionRenderer content={item.passageText} />
                </div>
              </div>
            )}

            {/* Prompt & Options Column */}
            <div className="space-y-4">
              {/* Question Prompt */}
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                <MarkdownQuestionRenderer content={item.prompt} />
              </div>

              {/* Multiple Choice Options */}
              {item.responseType === "MC" ? (
                <div className="space-y-2">
                  {item.options.map((opt) => {
                    const isSelected = item.selectedOptionId === opt.id;
                    const isAnswerKey = item.correctAnswerKey === opt.id;

                    let optStyle =
                      "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300";
                    if (isAnswerKey) {
                      optStyle =
                        "border-[#444444] bg-[#444444] text-white dark:bg-[#444444] dark:text-white";
                    } else if (isSelected && !item.isCorrect) {
                      optStyle =
                        "border-[#ff9999] bg-[#ff9999] text-white dark:bg-[#ff9999] dark:text-white";
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-none border text-xs flex items-start gap-2.5 ${optStyle}`}
                      >
                        <span className="font-bold shrink-0">{opt.id}.</span>
                        <div className="flex-1 font-serif text-sm">
                          <MarkdownQuestionRenderer content={opt.text} />
                        </div>
                        {isSelected && !isAnswerKey && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-none bg-black/20 text-white ml-auto shrink-0">
                            Your Pick
                          </span>
                        )}
                        {isSelected && isAnswerKey && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-none bg-black/20 text-white ml-auto shrink-0">
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Free Response / Student-Produced Answers */
                <div className="flex items-center gap-6 p-3 rounded-none bg-slate-100/70 dark:bg-slate-800/70 text-xs">
                  <div>
                    <span className="text-slate-500 block">Student Answer:</span>
                    <span className={`font-mono font-bold ${item.isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                      {item.frqUserAnswer || "(Blank / Omitted)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Correct Key:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {item.correctAnswerKey}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Explanation Box */}
          {item.explanation && (
            <div className="p-3.5 rounded-none bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold text-blue-700 dark:text-blue-300 block mb-1">
                Explanation:
              </span>
              <MarkdownQuestionRenderer content={item.explanation} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};