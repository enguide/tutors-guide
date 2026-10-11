// components/analytics/AdaptiveTrajectoryBadge.tsx
import React from "react";
import { GitBranch, ShieldAlert, Award } from "lucide-react";

interface AdaptiveTrajectoryBadgeProps {
  stageName: string;
  tier: "easy" | "hard";
  rawScore: number;
  totalQuestions: number;
}

export const AdaptiveTrajectoryBadge: React.FC<AdaptiveTrajectoryBadgeProps> = ({
  stageName,
  tier,
  rawScore,
  totalQuestions,
}) => {
  const isHard = tier === "hard";

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
      <div
        className={`h-7 w-7 rounded-[4px] flex items-center justify-center ${
          isHard
            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
        }`}
      >
        {isHard ? <Award className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
      </div>
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            {stageName}
          </span>
          <GitBranch className="h-3 w-3 text-neutral-400" />
          <span
            className={`text-[11px] font-mono font-medium px-1.5 py-0.2 rounded ${
              isHard
                ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
            }`}
          >
            {isHard ? "Higher Tier (Hard)" : "Standard Tier (Easy)"}
          </span>
        </div>
        <span className="text-[11px] text-neutral-500">
          Module 1 Raw: {rawScore}/{totalQuestions}
        </span>
      </div>
    </div>
  );
};