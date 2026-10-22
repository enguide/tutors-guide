// components/dashboard/StaminaAlertWidget.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";

export interface SectionPerformanceItem {
  sectionId: string;
  sectionTitle: string;
  sectionOrder: number;
  numCorrect: number;
  totalQuestions: number;
  timeRemainingSeconds: number;
}

interface StaminaAlertWidgetProps {
  sectionResults: SectionPerformanceItem[];
  latestTestId: string | null;
  latestCategory: string | null;
}

export function StaminaAlertWidget({
  sectionResults,
  latestTestId,
  latestCategory,
}: StaminaAlertWidgetProps) {
  const telemetry = React.useMemo(() => {
    if (!sectionResults || sectionResults.length < 2) {
      return null;
    }

    const sorted = [...sectionResults].sort((a, b) => a.sectionOrder - b.sectionOrder);

    // Split evenly into First Half vs Second Half
    const midpoint = Math.ceil(sorted.length / 2);
    const firstHalfSections = sorted.slice(0, midpoint);
    const secondHalfSections = sorted.slice(midpoint);

    const calcAccuracy = (sections: SectionPerformanceItem[]) => {
      const totalQ = sections.reduce((sum, s) => sum + s.totalQuestions, 0);
      const totalC = sections.reduce((sum, s) => sum + s.numCorrect, 0);
      return totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;
    };

    const firstHalfAcc = calcAccuracy(firstHalfSections);
    const secondHalfAcc = calcAccuracy(secondHalfSections);
    // Differential: Second Half minus First Half
    // Positive = improved as test went on; Negative = dropped
    const differential = secondHalfAcc - firstHalfAcc;

    let statusType: "FATIGUE" | "CONSISTENT" | "SURGE" = "CONSISTENT";
    let badgeText = "Steady Pace";
    let summaryText =
      "Your accuracy remained steady from the first half of the exam to the second. Your pacing endurance is well balanced.";

    if (differential <= -12) {
      statusType = "FATIGUE";
      badgeText = "Fatigue Detected";
      summaryText =
        "Accuracy declined notably during the second half of the exam. Focus on mental resets and pacing conservation early on.";
    } else if (differential >= 12) {
      statusType = "SURGE";
      badgeText = "Late Surge";
      summaryText =
        "Your accuracy increased in the second half of the exam. Great stamina; consider a sharper cognitive warmup before starting.";
    }

    return {
      firstHalfAcc,
      secondHalfAcc,
      differential,
      statusType,
      badgeText,
      summaryText,
    };
  }, [sectionResults]);

  if (!telemetry) {
    return (
      <div className="bg-card border border-border rounded-none p-6 flex flex-col justify-between">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <div className="p-1.5 bg-primary/10 text-primary border border-primary/20">
            <Activity size={14} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">
            Endurance Radar
          </span>
        </div>
        <div className="py-4 space-y-1">
          <h4 className="text-sm font-bold text-foreground">Multi-Section Data Needed</h4>
          <p className="text-xs text-muted-foreground">
            Complete a multi-module diagnostic exam to assess your test-taking stamina across sections.
          </p>
        </div>
        <div className="pt-3 border-t border-border text-[10px] font-mono text-muted-foreground">
          Requires $\ge$ 2 completed sections
        </div>
      </div>
    );
  }

  const badgeColor =
    telemetry.statusType === "FATIGUE"
      ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
      : telemetry.statusType === "SURGE"
      ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400";

  return (
    <div className="bg-card border border-border rounded-none p-6 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 text-primary border border-primary/20">
            <Activity size={14} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">
            Test Endurance
          </span>
        </div>

        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${badgeColor}`}>
          {telemetry.badgeText}
        </span>
      </div>

      {/* Main Metric & Comparison */}
      <div className="py-4 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Second-Half Split
            </span>
            <div className="text-3xl font-black text-foreground pt-0.5 font-mono">
              {telemetry.differential > 0
                ? `+${telemetry.differential}%`
                : `${telemetry.differential}%`}
            </div>
          </div>

          <div className="text-right space-y-0.5 text-xs font-mono">
            <div className="text-muted-foreground">
              First Half: <strong className="text-foreground">{telemetry.firstHalfAcc}%</strong>
            </div>
            <div className="text-muted-foreground">
              Second Half: <strong className="text-foreground">{telemetry.secondHalfAcc}%</strong>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {telemetry.summaryText}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground">
          {telemetry.statusType === "FATIGUE"
            ? "Pacing Taper Warning"
            : telemetry.statusType === "SURGE"
            ? "Strong Late Conditioning"
            : "Even Distribution"}
        </span>

        {latestTestId && latestCategory && (
          <Link
            href={`/tests/${latestCategory.toLowerCase()}/${latestTestId}/results`}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Review Pacing</span>
            <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}