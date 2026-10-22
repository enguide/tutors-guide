// components/dashboard/ScoreTargetGauge.tsx
"use client";

import React, { useState, useSyncExternalStore } from "react";
import { Target, TrendingUp, SlidersHorizontal, Check, X, Award } from "lucide-react";

interface ScoreTargetGaugeProps {
  categories?: string[];
  activeProgram?: string;
  latestScore: number | null;
  latestCategory?: string | null;
  latestTestTitle: string | null;
}

const SCORE_BENCHMARKS: Record<string, { label: string; score: number }[]> = {
  SAT: [
    { label: "Highly Selective (Ivy+ / T20)", score: 1500 },
    { label: "Competitive Honors / T50", score: 1380 },
    { label: "State Flagship Baseline", score: 1250 },
  ],
  ACT: [
    { label: "Highly Selective (Ivy+ / T20)", score: 34 },
    { label: "Competitive Honors / T50", score: 30 },
    { label: "State Flagship Baseline", score: 26 },
  ],
  GRE: [
    { label: "Top Graduate Tier", score: 325 },
    { label: "Competitive Baseline", score: 310 },
  ],
};

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredValue(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export function ScoreTargetGauge({
  categories,
  activeProgram: propActiveProgram,
  latestScore,
  latestCategory,
  latestTestTitle,
}: ScoreTargetGaugeProps) {
  const activeProgram = propActiveProgram || latestCategory || categories?.[0] || "SAT";

  const isHydrated = useSyncExternalStore(
    subscribeToStorage,
    () => true,
    () => false
  );

  const storedScore = useSyncExternalStore(
    subscribeToStorage,
    () => getStoredValue(`target_exam_score_${activeProgram}`, ""),
    () => ""
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formScore, setFormScore] = useState(storedScore);

  const targetScoreNum = parseInt(storedScore, 10);
  const hasTarget = !isNaN(targetScoreNum) && targetScoreNum > 0;
  const hasBaseline = latestScore !== null && latestScore > 0;

  const { delta, progressPercent, isGoalReached } = React.useMemo(() => {
    if (!hasTarget || !hasBaseline) {
      return { delta: null, progressPercent: 0, isGoalReached: false };
    }

    const diff = targetScoreNum - latestScore;
    const isReached = diff <= 0;

    const minScale = activeProgram === "ACT" ? 1 : activeProgram === "GRE" ? 260 : 400;
    const maxScale = targetScoreNum;
    const percent = Math.min(
      100,
      Math.max(0, Math.round(((latestScore - minScale) / (maxScale - minScale)) * 100))
    );

    return {
      delta: diff,
      progressPercent: percent,
      isGoalReached: isReached,
    };
  }, [hasTarget, hasBaseline, targetScoreNum, latestScore, activeProgram]);

  const handleOpenEdit = () => {
    setFormScore(storedScore);
    setIsEditing(true);
  };

  const handleSave = () => {
    localStorage.setItem(`target_exam_score_${activeProgram}`, formScore);
    window.dispatchEvent(new Event("storage"));
    setIsEditing(false);
  };

  const handleBenchmarkSelect = (score: number) => {
    setFormScore(String(score));
  };

  const benchmarks = SCORE_BENCHMARKS[activeProgram] || [];

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-none animate-pulse" />
    );
  }

  return (
    <div className="bg-card border border-border rounded-none p-6 flex flex-col justify-between">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4 border-b border-border pb-3">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 font-mono">
            <Target size={12} /> Target Score Delta
          </span>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-foreground">
              {hasTarget ? `${targetScoreNum} Target` : "Target Score"}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-muted/60 border border-border font-semibold">
              {activeProgram}
            </span>
          </div>
        </div>

        <button
          onClick={isEditing ? () => setIsEditing(false) : handleOpenEdit}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 border border-border px-2.5 py-1.5 hover:bg-muted transition-colors rounded-none"
        >
          {isEditing ? <X size={13} /> : <SlidersHorizontal size={13} />}
          <span>{isEditing ? "Close" : "Set Target"}</span>
        </button>
      </div>

      {/* Main Center Area */}
      {isEditing ? (
        <div className="bg-muted/40 border border-input p-3 rounded-none space-y-2.5 animate-in fade-in duration-150 flex-1 overflow-y-auto my-1.5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Score Goal ({activeProgram})
            </label>
            <input
              type="number"
              placeholder={activeProgram === "ACT" ? "e.g. 34" : "e.g. 1500"}
              value={formScore}
              onChange={(e) => setFormScore(e.target.value)}
              className="w-full text-xs font-semibold p-1.5 border border-input bg-background rounded-none"
            />
          </div>

          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Benchmark Targets:
            </span>
            <div className="flex flex-wrap gap-1">
              {benchmarks.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => handleBenchmarkSelect(b.score)}
                  className="text-[10px] font-mono px-1.5 py-0.5 border border-border bg-card text-muted-foreground hover:text-foreground"
                >
                  {b.score} ({b.label.split(" ")[0]})
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-1 border-t border-border">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center gap-1 rounded-none transition-colors"
            >
              <Check size={12} />
              <span>Save</span>
            </button>
          </div>
        </div>
      ) : !hasTarget ? (
        <div className="py-4 border border-dashed border-border text-center space-y-1 my-auto">
          <h3 className="text-sm font-bold text-foreground">No Target Score Configured</h3>
          <p className="text-xs text-muted-foreground">
            Set your target score to calculate the remaining point gap from your baseline.
          </p>
        </div>
      ) : !hasBaseline ? (
        <div className="py-4 border border-dashed border-border text-center space-y-1 my-auto">
          <h3 className="text-sm font-bold text-foreground">Baseline Required</h3>
          <p className="text-xs text-muted-foreground">
            Complete your first diagnostic test to benchmark your distance to {targetScoreNum}.
          </p>
        </div>
      ) : isGoalReached ? (
        <div className="flex items-center justify-between gap-6 py-2">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
              Target Achieved
            </span>
            <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
              {latestScore}
            </div>
          </div>
          <div className="text-right space-y-1 max-w-[210px]">
            <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Goal Exceeded (+{Math.abs(delta!)} pts)
            </div>
            <div className="text-sm font-bold text-foreground">Target Surpassed</div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              Your latest evaluation exceeds your target score. Consider raising your benchmark.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 py-1">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Point Gap
              </span>
              <div className="text-4xl sm:text-5xl font-black text-primary leading-none pt-1">
                +{delta}
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                Latest Baseline: <strong className="text-foreground">{latestScore}</strong>
              </span>
              <span className="text-xs font-bold text-foreground">
                {progressPercent}% of target range
              </span>
            </div>
          </div>

          <div className="w-full bg-muted/60 h-2 border border-border relative">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Row */}
      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <TrendingUp size={13} className="text-primary" />
          <span className="text-xs font-semibold">
            {latestTestTitle ? (
              <span className="truncate max-w-[230px] inline-block align-bottom font-mono text-[11px]">
                {latestTestTitle}
              </span>
            ) : (
              <span>No Prior Exam</span>
            )}
          </span>
        </div>

        {hasTarget && (
          <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
            <Award size={11} className="text-primary" />
            <span>Scale: {activeProgram}</span>
          </span>
        )}
      </div>
    </div>
  );
}