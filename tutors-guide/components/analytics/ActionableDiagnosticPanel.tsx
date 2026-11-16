// components/analytics/ActionableDiagnosticsPanel.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  EnrichedResponseItem,
  SectionResultData,
} from "@/types/analytics";
import { TestMetadata } from "@/types/content";
import {
  buildActionableDiagnostics,
  ActionableDirective,
} from "@/lib/analytics/actionableDiagnostics";
import {
  Target,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  BookOpen,
  ChevronDown,
} from "lucide-react";

interface ActionableDiagnosticsPanelProps {
  metadata: TestMetadata;
  sectionResults: SectionResultData[];
  responses: EnrichedResponseItem[];
  onInspectQuestions: (questionIds: string[], label: string) => void;
}

export const ActionableDiagnosticsPanel: React.FC<ActionableDiagnosticsPanelProps> = ({
  metadata,
  sectionResults,
  responses,
  onInspectQuestions,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>("all");
  // All cards start collapsed by default for clean top-down scanning
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const report = useMemo(
    () =>
      buildActionableDiagnostics({
        responses,
        sectionResults,
        metadata,
        selectedSectionId,
      }),
    [responses, sectionResults, metadata, selectedSectionId]
  );

  const toggleCard = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Scope Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border p-4 rounded-none">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1 shrink-0">
            Reviewing:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSectionId("all")}
            className={`min-h-9 px-3 py-1.5 rounded-none text-xs font-bold transition-all whitespace-nowrap border ${
              selectedSectionId === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            Full Exam ({responses.length})
          </button>
          {sectionResults.map((sr) => {
            const isActive = selectedSectionId === String(sr.sectionId);
            return (
              <button
                key={sr.sectionId}
                type="button"
                onClick={() => setSelectedSectionId(String(sr.sectionId))}
                className={`min-h-9 px-3 py-1.5 rounded-none text-xs font-bold transition-all whitespace-nowrap border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {sr.section.title}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-muted-foreground shrink-0">
          {report.hasExtendedTime && (
            <span className="px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-400 font-semibold">
              {report.maxTimeMultiplier}× Extended Time Applied
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Pattern guard active
              {report.suppressedLowSampleCount > 0
                ? ` (${report.suppressedLowSampleCount} isolated miss${
                    report.suppressedLowSampleCount === 1 ? "" : "es"
                  } excluded)`
                : ""}
            </span>
          </span>
        </div>
      </div>

      {/* Top Asymmetric Workspace: Study Priorities (Left 8 cols) + Performance Snapshot (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Prioritized Study & Test-Taking Recommendations */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <BookOpen size={15} className="text-blue-600 dark:text-blue-400" />
              <span>Recommended Study & Test-Taking Focus</span>
            </h2>
            <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
              Select a focus area for practice steps
            </span>
          </div>

          {report.directives.length === 0 ? (
            <div className="bg-card border border-border border-l-[3px] border-l-emerald-600 dark:border-l-emerald-500 p-6 rounded-none space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 size={16} />
                <span>Consistent Performance — No Systemic Weaknesses Found</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The questions you missed in this section are isolated rather than part of a
                recurring topic gap or pacing habit. Open the{" "}
                <strong className="text-foreground">Question Review</strong> tab to walk
                through those individual problems one by one.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {report.directives.map((directive: ActionableDirective, idx: number) => {
                const isExpanded = Boolean(expandedIds[directive.id]);
                const isTopPriority = idx === 0;

                return (
                  <div
                    key={directive.id}
                    className={`rounded-none border border-l-[3px] transition-all shadow-xs ${
                      isExpanded
                        ? "bg-card border-blue-600/45 border-l-blue-600 shadow-sm"
                        : isTopPriority
                        ? "bg-card border-border/90 border-l-blue-600 hover:border-blue-600/45"
                        : "bg-card border-border/90 border-l-slate-400 dark:border-l-slate-600 hover:border-blue-600/40 hover:border-l-blue-600"
                    }`}
                  >
                    {/* Above-the-Fold Interactive Header */}
                    <div
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      onClick={() => toggleCard(directive.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleCard(directive.id);
                        }
                      }}
                      className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors select-none ${
                        isTopPriority && !isExpanded
                          ? "bg-blue-600/[0.025] hover:bg-muted/40"
                          : "hover:bg-muted/40"
                      }`}
                    >
                      {/* Left: Blue Circular Step Badge + Category + Headline */}
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-colors ${
                            isTopPriority || isExpanded
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-blue-600/15 text-blue-700 dark:text-blue-400 border border-blue-600/30"
                          }`}
                        >
                          {directive.rank}
                        </span>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-600/10 border border-blue-600/20 text-blue-700 dark:text-blue-400">
                              {directive.badge}
                            </span>
                            <span className="text-[11px] font-mono text-muted-foreground">
                              {directive.sampleLabel} • {directive.confidenceLabel}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-foreground leading-snug">
                            {directive.title}
                          </h3>
                        </div>
                      </div>

                      {/* Right: Direct Review Action + Expand Toggle */}
                      <div className="flex items-center justify-between sm:justify-end gap-2 pl-9 sm:pl-0 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectQuestions(directive.matchingQuestionIds, directive.title);
                          }}
                          className="min-h-8 px-2.5 py-1 bg-background border border-border hover:border-blue-600/50 hover:bg-blue-600/5 text-foreground hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Review Questions ({directive.matchingQuestionIds.length})</span>
                          <ArrowRight size={12} />
                        </button>

                        <span
                          aria-hidden="true"
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground"
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-150 ${
                              isExpanded ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                            }`}
                          />
                        </span>
                      </div>
                    </div>

                    {/* Expandable Detail Drawer: Observation & Study Strategy */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-3 border-t border-border bg-muted/20 space-y-3 animate-in fade-in duration-150">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          <strong className="text-foreground font-semibold">
                            What the Data Shows:{" "}
                          </strong>
                          {directive.evidenceSummary}
                        </p>

                        <div className="bg-background border border-border/80 border-l-2 border-l-blue-600 p-3 text-xs text-foreground leading-relaxed">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-blue-600 dark:text-blue-400 block mb-0.5">
                            Recommended Practice
                          </span>
                          {directive.actionStep}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Compact Performance Snapshot */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
              Performance Snapshot
            </h2>
            <span className="text-[11px] font-mono text-muted-foreground">
              {report.totalAnalyzed} questions
            </span>
          </div>

          <div className="bg-card border border-border divide-y divide-border rounded-none shadow-xs">
            {/* Metric 1: Key Focus Areas */}
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Target size={13} className="text-blue-600 dark:text-blue-400" /> Key Focus Areas
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-black text-foreground">
                  {report.directives.length}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {report.directives.length > 0 ? "Clear patterns found" : "None flagged"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {report.directives.length > 0
                  ? "Recurring habits or topics worth targeted review"
                  : "No recurring trouble spots detected"}
              </p>
            </div>

            {/* Metric 2: Pacing-Related Misses */}
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock size={13} className="text-amber-600 dark:text-amber-400" /> Pacing-Related Misses
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-black text-foreground">
                  {report.quadrantCounts.timeSinkIncorrect + report.quadrantCounts.rushedMiss}
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    / {report.totalIncorrect} missed
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {report.quadrantCounts.timeSinkIncorrect} over-time (&gt;1.5×) •{" "}
                {report.quadrantCounts.rushedMiss} hurried (&lt;0.65×)
              </p>
            </div>

            {/* Metric 3: Answer Changes */}
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <SlidersHorizontal size={13} className="text-sky-600 dark:text-sky-400" /> Answer Changes
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-black text-foreground">
                  {report.revisionTelemetry.totalSwitches === 0
                    ? "No Changes"
                    : `${report.revisionTelemetry.netGain > 0 ? "+" : ""}${
                        report.revisionTelemetry.netGain
                      } Net`}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {report.revisionTelemetry.totalSwitches > 0
                  ? `${report.revisionTelemetry.wrongToRight} improved vs. ${report.revisionTelemetry.rightToWrong} changed away from right across ${report.revisionTelemetry.totalSwitches} edits`
                  : "Stuck with all initial choices"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};