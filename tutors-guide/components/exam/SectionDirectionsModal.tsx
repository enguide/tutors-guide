// components/exam/SectionDirectionsModal.tsx
"use client";

import React from "react";
import { SupportedExamCategory, SectionExamConfig } from "@/types/examConfig";
import {
  Play,
  Clock,
  HelpCircle,
  Calculator,
  FileText,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

interface SectionDirectionsModalProps {
  category: SupportedExamCategory;
  testTitle: string;
  sectionTitle: string;
  questionCount: number;
  timeLimitSeconds: number;
  config: SectionExamConfig;
  isResuming?: boolean;
  onBeginSection: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) {
    return `${mins} minute${mins === 1 ? "" : "s"}`;
  }
  return `${mins}m ${secs}s`;
}

function getCalculatorLabel(calculator: SectionExamConfig["calculator"]): string {
  switch (calculator) {
    case "desmos-graphing":
      return "Built-in Desmos graphing calculator is available.";
    case "gre-basic":
      return "Built-in basic on-screen calculator is available.";
    case "scientific":
      return "Built-in scientific calculator is available.";
    case "none":
    default:
      return "Calculator is NOT permitted on this module.";
  }
}

export const SectionDirectionsModal: React.FC<SectionDirectionsModalProps> = ({
  category,
  testTitle,
  sectionTitle,
  questionCount,
  timeLimitSeconds,
  config,
  isResuming = false,
  onBeginSection,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-sm shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isResuming ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-sm border border-amber-200 dark:border-amber-800">
                  <RotateCcw className="w-3 h-3" />
                  Section in Progress
                </span>
              ) : (
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-neutral-500">
                  {category} Section Directions
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {sectionTitle}
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              {testTitle}
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-sm">
            <Clock className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
              {formatDuration(timeLimitSeconds)}
            </span>
          </div>
        </div>

        {/* Section Parameters Overview */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
              Questions
            </span>
            <span className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100">
              {questionCount} Questions
            </span>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
              {isResuming ? "Time Remaining" : "Allotted Time"}
            </span>
            <span className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100">
              {formatDuration(timeLimitSeconds)}
            </span>
          </div>
        </div>

        {/* Available Tools */}
        <div className="space-y-2 mb-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
            Tools & Reference Materials
          </span>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
              <Calculator className="w-4 h-4 text-neutral-500 shrink-0" />
              <span>{getCalculatorLabel(config.calculator)}</span>
            </div>

            {config.formulaSheetId && (
              <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                <FileText className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>Reference formula sheet is available throughout this section.</span>
              </div>
            )}
          </div>
        </div>

        {/* Instructions & Timing Rules */}
        <div
          className={`p-3 rounded-sm flex items-start gap-2.5 mb-6 border ${
            isResuming
              ? "bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60"
              : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60"
          }`}
        >
          <AlertCircle
            className={`w-4 h-4 shrink-0 mt-0.5 ${
              isResuming
                ? "text-blue-600 dark:text-blue-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          />
          <div
            className={`text-xs space-y-1 ${
              isResuming
                ? "text-blue-800 dark:text-blue-300"
                : "text-amber-800 dark:text-amber-300"
            }`}
          >
            <p className="font-semibold">
              {isResuming
                ? "Resuming In-Progress Section."
                : "Timing starts when you click Begin Section."}
            </p>
            <p className="text-[11px] opacity-90 leading-relaxed">
              {isResuming
                ? "Your previous responses and bookmarking data have been restored. Clicking Resume Section will restart your countdown timer from where you left off."
                : "Once you begin, the section timer will count down continuously. You may review and change answers within this section at any time before submitting."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Clock remains paused</span>
          </div>

          <button
            type="button"
            onClick={onBeginSection}
            className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-bold rounded-sm shadow-sm transition-all"
          >
            {isResuming ? (
              <RotateCcw className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isResuming ? "Resume Section" : "Begin Section"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};