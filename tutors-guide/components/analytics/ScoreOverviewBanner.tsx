// components/analytics/ScoreOverviewBanner.tsx
"use client";

import React from "react";
import { SectionResultData, TestSummaryData } from "@/types/analytics";
import { SupportedExamCategory } from "@/types/examConfig";

interface ScoreOverviewBannerProps {
  category: SupportedExamCategory;
  testSummary: TestSummaryData | null;
  sectionResults: SectionResultData[];
}

export const ScoreOverviewBanner: React.FC<ScoreOverviewBannerProps> = ({
  category,
  testSummary,
  sectionResults,
}) => {
  return (
    <div className="w-full border border-border/80 rounded-xl shadow-xs mx-auto bg-card dark:bg-linear-to-br dark:from-white/10 dark:to-white/5 backdrop-blur-md overflow-hidden">
      <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between bg-muted/20">
        <h2 className="text-sm font-bold text-foreground">
          {category} Score Breakdown
        </h2>
        {testSummary?.percentile && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
            {testSummary.percentile} Percentile
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-border/60 text-xs sm:text-sm">
        {/* Module / Section Scaled Scores */}
        {sectionResults.map((sr) => (
          <div
            key={sr.sectionId}
            className="flex flex-col justify-between items-center bg-muted/30 py-4 px-2"
          >
            <span className="font-semibold text-muted-foreground text-center truncate max-w-full px-1">
              {sr.section.title}
            </span>
            <div className="my-1.5 flex items-baseline gap-1">
              <span className="text-2xl md:text-3xl font-extrabold text-foreground">
                {sr.scaledScore ?? sr.rawScore}
              </span>
              <span className="text-[10px] text-muted-foreground">
                /{sr.totalQuestions}
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              {Math.round((sr.numCorrect / sr.totalQuestions) * 100)}% Acc
            </span>
          </div>
        ))}

        {/* TOTAL Composite Score Box */}
        <div className="col-span-2 sm:col-span-1 flex flex-col justify-between items-center bg-blue-500/5 dark:bg-blue-950/20 py-4 px-2">
          <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[11px]">
            Composite Score
          </span>
          <div className="my-1.5">
            <span className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              {testSummary?.compositeScore ?? "—"}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Official Scaled Total
          </span>
        </div>
      </div>
    </div>
  );
};