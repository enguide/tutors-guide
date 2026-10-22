// components/dashboard/PrioritySkillFocusCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Target, ArrowRight, CheckCircle2 } from "lucide-react";

export interface SkillAccuracyMetric {
  domain: string;
  skill: string;
  totalQuestions: number;
  numCorrect: number;
  accuracyPercent: number;
}

interface PrioritySkillFocusCardProps {
  skillMetrics: SkillAccuracyMetric[];
  latestTestId: string | null;
  latestCategory: string | null;
}

export function PrioritySkillFocusCard({
  skillMetrics,
  latestTestId,
  latestCategory,
}: PrioritySkillFocusCardProps) {
  // Sort by lowest accuracy first, prioritizing skills with at least 2 questions
  const prioritySkills = React.useMemo(() => {
    if (!skillMetrics || skillMetrics.length === 0) return [];

    return [...skillMetrics]
      .filter((s) => s.accuracyPercent < 100)
      .sort((a, b) => {
        // Primary: Lowest accuracy
        if (a.accuracyPercent !== b.accuracyPercent) {
          return a.accuracyPercent - b.accuracyPercent;
        }
        // Secondary: Highest question count (higher exam yield)
        return b.totalQuestions - a.totalQuestions;
      })
      .slice(0, 3);
  }, [skillMetrics]);

  return (
    <div className="bg-card border border-border rounded-none p-6 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 text-primary border border-primary/20">
            <Target size={14} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">
            Priority Growth Domains
          </span>
        </div>

        <span className="text-[10px] font-mono text-muted-foreground">
          Top Yield Targets
        </span>
      </div>

      {/* Main List */}
      <div className="py-3 space-y-3">
        {prioritySkills.length === 0 ? (
          <div className="py-4 text-center space-y-1">
            <div className="flex justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-xs font-bold text-foreground">Strong Accuracy Profile</p>
            <p className="text-[11px] text-muted-foreground">
              No low-accuracy clusters detected in recent tests.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {prioritySkills.map((item, idx) => (
              <div
                key={`${item.domain}-${item.skill}-${idx}`}
                className="p-2.5 bg-muted/40 border border-input/60 rounded-none flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground block truncate">
                    {item.domain}
                  </span>
                  <div className="text-xs font-bold text-foreground truncate">
                    {item.skill}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold font-mono text-primary">
                    {item.accuracyPercent}%
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {item.numCorrect}/{item.totalQuestions} correct
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground">
          Based on recent diagnostics
        </span>

        {latestTestId && latestCategory && (
          <Link
            href={`/tests/${latestCategory.toLowerCase()}/${latestTestId}/results`}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Triage Mistakes</span>
            <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}