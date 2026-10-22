// components/dashboard/RevisionAuditWidget.tsx
"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, ArrowRight, HelpCircle } from "lucide-react";

interface RevisionAuditWidgetProps {
  totalRevised: number;
  revisedCorrect: number;
  revisedIncorrect: number;
  latestTestId: string | null;
  latestCategory: string | null;
}

export function RevisionAuditWidget({
  totalRevised,
  revisedCorrect,
  revisedIncorrect,
  latestTestId,
  latestCategory,
}: RevisionAuditWidgetProps) {
  const telemetry = React.useMemo(() => {
    if (totalRevised === 0) {
      return {
        hasData: false,
        successRate: 0,
        verdict: "No Revised Answers",
        advice: "You didn't switch any answers on your recent diagnostic.",
        badgeColor: "bg-muted text-muted-foreground border-border",
      };
    }

    const rate = Math.round((revisedCorrect / totalRevised) * 100);

    if (rate >= 60) {
      return {
        hasData: true,
        successRate: rate,
        verdict: "Second-Guessing Beneficial",
        advice: `When you revise an answer, you are correct ${rate}% of the time. Your second instincts are reliable.`,
        badgeColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      };
    }

    if (rate <= 40) {
      return {
        hasData: true,
        successRate: rate,
        verdict: "Trust Your First Instinct",
        advice: `Only ${rate}% of your revised answers were correct. You are frequently talking yourself out of the right choice.`,
        badgeColor: "bg-amber-500/10 border-amber-500/30 text-amber-500",
      };
    }

    return {
      hasData: true,
      successRate: rate,
      verdict: "Balanced Revisions",
      advice: `Your revisions are balanced (${rate}% correct). Only change an answer if you find concrete textual or mathematical proof.`,
      badgeColor: "bg-blue-500/10 border-blue-500/30 text-blue-500",
    };
  }, [totalRevised, revisedCorrect]);

  return (
    <div className="bg-card border border-border rounded-none p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 text-primary border border-primary/20">
            <RotateCcw size={14} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">
            Answer Revision Audit
          </span>
        </div>

        {telemetry.hasData && (
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${telemetry.badgeColor}`}>
            {telemetry.verdict}
          </span>
        )}
      </div>

      {/* Main Metric */}
      <div className="py-4 space-y-3">
        {!telemetry.hasData ? (
          <div className="py-2 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <HelpCircle size={14} className="text-muted-foreground" />
              <span>Steady Selections</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Answer revisions will be tracked here when you change selections before submitting a section.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Revision Success Rate
                </span>
                <div className="text-3xl font-black text-foreground pt-0.5 font-mono">
                  {telemetry.successRate}%
                </div>
              </div>

              <div className="text-right space-y-0.5 text-xs font-mono">
                <div className="text-muted-foreground">
                  Corrected: <strong className="text-emerald-600 dark:text-emerald-400">{revisedCorrect}</strong>
                </div>
                <div className="text-muted-foreground">
                  Made Incorrect: <strong className="text-destructive">{revisedIncorrect}</strong>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {telemetry.advice}
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground">
          {totalRevised} total revision{totalRevised === 1 ? "" : "s"} evaluated
        </span>

        {latestTestId && latestCategory && (
          <Link
            href={`/tests/${latestCategory.toLowerCase()}/${latestTestId}/results`}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Review Changed</span>
            <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}