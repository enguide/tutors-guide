// components/analytics/AdaptiveTrajectoryCard.tsx
import React from "react";
import { GitBranch, ShieldCheck, Zap } from "lucide-react";
import { StageScoreSummary } from "@/lib/scoring/adaptiveScorer";

interface AdaptiveTrajectoryCardProps {
  stageSummaries: StageScoreSummary[];
  category: string;
}

export const AdaptiveTrajectoryCard: React.FC<AdaptiveTrajectoryCardProps> = ({
  stageSummaries,
  category,
}) => {
  if (!stageSummaries || stageSummaries.length === 0) return null;

  return (
    <div className="w-full rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <GitBranch className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Computer-Adaptive Testing (CAT) Routing Telemetry
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stageSummaries.map((summary) => {
          const isHard = summary.routedTier === "hard";
          const stageTitle =
            category === "SAT"
              ? summary.stageIndex === 1
                ? "Reading & Writing Section"
                : "Math Section"
              : `Stage ${summary.stageIndex}`;

          return (
            <div
              key={summary.stageIndex}
              className="rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    {stageTitle}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-[4px] font-medium ${
                      isHard
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    {isHard ? <Zap className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                    {isHard ? "Advanced (Hard Tier)" : "Foundational (Standard Tier)"}
                  </span>
                </div>

                <div className="space-y-1 my-3 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>Module 1 Baseline:</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-200">
                      {summary.baselineRaw} / {summary.baselineTotal} correct
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Module 2 ({isHard ? "Hard" : "Standard"}):</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-200">
                      {summary.routedRaw} / {summary.routedTotal} correct
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-sm">
                <span className="text-neutral-600 dark:text-neutral-400 text-xs">
                  Domain Score:
                </span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {summary.domainScore} / 800
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};