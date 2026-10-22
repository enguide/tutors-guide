// components/dashboard/PrepMomentumTracker.tsx
"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Milestone,
  Clock,
  CheckCircle2,
  Timer,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export interface CompletedAttemptNode {
  testId: string;
  testTitle: string;
  category: string;
  compositeScore: number | null;
  completedAt: Date | string;
}

interface PrepMomentumTrackerProps {
  completedAttempts: CompletedAttemptNode[];
  totalQuestionsAnswered: number;
  totalTimeSpentSeconds: number;
  activeCategories: string[];
}

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

export function PrepMomentumTracker({
  completedAttempts,
  totalQuestionsAnswered,
  totalTimeSpentSeconds,
  activeCategories,
}: PrepMomentumTrackerProps) {
  const primaryCategory = activeCategories[0] || "SAT";

  const isHydrated = useSyncExternalStore(
    subscribeToStorage,
    () => true,
    () => false
  );

  const storedCategory = useSyncExternalStore(
    subscribeToStorage,
    () => getStoredValue("target_exam_category", primaryCategory),
    () => primaryCategory
  );

  const storedDate = useSyncExternalStore(
    subscribeToStorage,
    () => getStoredValue(`target_exam_date_${storedCategory}`, ""),
    () => ""
  );

  // Compute total test hours & pacing metrics
  const totalHours = (totalTimeSpentSeconds / 3600).toFixed(1);
  const avgSecondsPerItem =
    totalQuestionsAnswered > 0
      ? Math.round(totalTimeSpentSeconds / totalQuestionsAnswered)
      : 0;

  // Standard official time benchmarks per question
  const pacingBenchmark = storedCategory === "ACT" ? 50 : 71;
  const isPacingOptimal =
    avgSecondsPerItem > 0 && avgSecondsPerItem <= pacingBenchmark + 5;

  // Format Chronological Milestone Track (Oldest to Newest)
  const sortedAttempts = React.useMemo(() => {
    return [...completedAttempts].sort(
      (a, b) =>
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );
  }, [completedAttempts]);

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-none p-6 h-56 animate-pulse" />
    );
  }

  return (
    <div className="bg-card border border-border rounded-none p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 text-primary border border-primary/20">
            <Milestone size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              Preparation Runway & Volume
              <span className="text-[10px] font-mono px-2 py-0.5 bg-muted/60 border border-border font-semibold">
                {storedCategory}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Cumulative conditioning metrics and milestones toward your official sitting.
            </p>
          </div>
        </div>

        <Link
          href="/settings/mentors"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors self-start sm:self-center"
        >
          <ShieldCheck size={13} className="text-primary" />
          <span>Mentor Data Sharing</span>
        </Link>
      </div>

      {/* Cumulative Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-muted/30 border border-border rounded-none space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Diagnostic Volume
            </span>
            <CheckCircle2 size={13} />
          </div>
          <div className="text-2xl font-black text-foreground font-mono">
            {totalQuestionsAnswered}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Questions evaluated under timed conditions
          </div>
        </div>

        <div className="p-4 bg-muted/30 border border-border rounded-none space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Time Under Exam Pressure
            </span>
            <Clock size={13} />
          </div>
          <div className="text-2xl font-black text-foreground font-mono">
            {totalHours}h
          </div>
          <div className="text-[11px] text-muted-foreground">
            Cumulative timed section hours
          </div>
        </div>

        <div className="p-4 bg-muted/30 border border-border rounded-none space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Average Item Pacing
            </span>
            <Timer size={13} />
          </div>
          <div className="text-2xl font-black text-primary font-mono">
            {avgSecondsPerItem > 0 ? `${avgSecondsPerItem}s` : "—"}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Standard Benchmark: ~{pacingBenchmark}s per question
          </div>
        </div>
      </div>

      {/* Architectural Milestone Track */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
            Milestone Progress Track
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            Target: {storedDate ? new Date(`${storedDate}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Unset"}
          </span>
        </div>

        {sortedAttempts.length === 0 ? (
          <div className="p-6 border border-dashed border-border bg-muted/10 text-center space-y-1">
            <p className="text-xs font-bold text-foreground">Runway Track Uninitialized</p>
            <p className="text-[11px] text-muted-foreground">
              Complete your first diagnostic test to establish milestone nodes along your runway.
            </p>
          </div>
        ) : (
          <div className="relative border border-border bg-muted/20 p-4 rounded-none overflow-x-auto no-scrollbar">
            <div className="flex items-center min-w-max gap-8 sm:gap-12 py-2">
              {sortedAttempts.map((attempt, index) => {
                const dateStr = new Date(attempt.completedAt).toLocaleDateString(
                  undefined,
                  { month: "numeric", day: "numeric" }
                );

                return (
                  <div key={attempt.testId} className="flex items-center gap-8 sm:gap-12">
                    {/* Node */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div className="w-8 h-8 bg-card border-2 border-primary text-foreground font-black text-xs flex items-center justify-center font-mono">
                        {index + 1}
                      </div>
                      <div className="text-center space-y-0.5">
                        <span className="text-[11px] font-bold text-foreground block truncate max-w-[100px]">
                          {attempt.testTitle.replace("Practice Test", "P").replace("Diagnostic", "Diag")}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-primary block">
                          Score: {attempt.compositeScore ?? "—"}
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground block">
                          {dateStr}
                        </span>
                      </div>
                    </div>

                    {/* Connecting Stroke */}
                    <div className="w-8 sm:w-12 h-0.5 bg-border shrink-0" />
                  </div>
                );
              })}

              {/* Final Node: Official Sitting */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 opacity-80">
                <div className="w-8 h-8 bg-primary/10 border-2 border-dashed border-primary text-primary font-bold text-xs flex items-center justify-center">
                  <TrendingUp size={14} />
                </div>
                <div className="text-center space-y-0.5">
                  <span className="text-[11px] font-bold text-foreground block">
                    Official Sitting
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    {storedDate ? new Date(`${storedDate}T00:00:00`).toLocaleDateString(undefined, { month: "numeric", day: "numeric" }) : "Goal Date"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
          <Clock size={12} className="text-primary" />
          <span>
            Pacing Health:{" "}
            <strong className={isPacingOptimal ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"}>
              {isPacingOptimal ? "Optimal Endurance" : "Pacing Review Advised"}
            </strong>
          </span>
        </span>

        <Link
          href="/dashboard/results"
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>Complete Archive</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}