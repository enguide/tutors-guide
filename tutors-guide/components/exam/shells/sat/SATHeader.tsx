// components/exam/shells/sat/SATHeader.tsx
"use client";

import React, { useState } from "react";
import { Clock, Eye, EyeOff, Calculator, FileText, Bookmark, Delete, Volume2 } from "lucide-react";
import { SectionExamConfig } from "@/types/examConfig";

interface SATHeaderProps {
  sectionTitle: string;
  config: SectionExamConfig;
  secondsRemaining: number;
  isFlagged: boolean;
  isCrossOutMode: boolean;
  isTTSPlaying: boolean;
  isTTSSupported: boolean;
  onToggleFlag: () => void;
  onToggleCrossOut: () => void;
  onToggleCalculator: () => void;
  onToggleFormulaSheet: () => void;
  onToggleTTS: () => void;
}

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export const SATHeader: React.FC<SATHeaderProps> = ({
  sectionTitle,
  config,
  secondsRemaining,
  isFlagged,
  isCrossOutMode,
  isTTSPlaying,
  isTTSSupported,
  onToggleFlag,
  onToggleCrossOut,
  onToggleCalculator,
  onToggleFormulaSheet,
  onToggleTTS,
}) => {
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const isTimeCritical = secondsRemaining <= 300; // Under 5 mins

  return (
    <header className="h-14 border-b border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 sm:px-6 flex items-center justify-between select-none z-30">
      {/* Left: Section / Module info */}
      <div className="flex flex-col">
        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
          {sectionTitle}
        </span>
        <span className="text-[11px] text-neutral-500 font-mono">
          Standard Exam Mode
        </span>
      </div>

      {/* Center: Minimalist "Hide" / "Show" Timer */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-[4px]">
          <Clock className={`w-3.5 h-3.5 ${isTimeCritical ? "text-rose-600 animate-pulse" : "text-neutral-500"}`} />
          <span
            className={`font-mono text-sm font-semibold tracking-tight min-w-[42px] text-center ${
              isTimeCritical ? "text-rose-600" : "text-neutral-800 dark:text-neutral-200"
            }`}
          >
            {isTimerHidden ? "--:--" : formatClock(secondsRemaining)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsTimerHidden((prev) => !prev)}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-[4px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {isTimerHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {isTimerHidden ? "Show" : "Hide"}
        </button>
      </div>

      {/* Right: Bluebook Toolbar */}
      <div className="flex items-center gap-1.5">
        {/* Desmos Graphing Calculator */}
        {config.calculator === "desmos-graphing" && (
          <button
            type="button"
            onClick={onToggleCalculator}
            title="Calculator"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-[4px] transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">Calculator</span>
          </button>
        )}

        {/* Reference Sheet Drawer */}
        {config.hasFormulaSheet && (
          <button
            type="button"
            onClick={onToggleFormulaSheet}
            title="Reference Formulas"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-[4px] transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden md:inline">Reference</span>
          </button>
        )}

        {/* Answer Elimination Mode */}
        <button
          type="button"
          onClick={onToggleCrossOut}
          title="Elimination Mode"
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border rounded-[4px] transition-colors ${
            isCrossOutMode
              ? "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900"
              : "text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <Delete className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Cross-Out</span>
        </button>

        {/* Text-to-Speech Accessibility */}
        {isTTSSupported && (
          <button
            type="button"
            onClick={onToggleTTS}
            title="Read Question"
            className={`p-1.5 rounded-[4px] border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
              isTTSPlaying ? "text-blue-600 dark:text-blue-400 border-blue-400" : ""
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}

        {/* Bookmark / Flag */}
        <button
          type="button"
          onClick={onToggleFlag}
          title="Mark for Review"
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border rounded-[4px] transition-colors ${
            isFlagged
              ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900"
              : "text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? "fill-amber-500 text-amber-500" : ""}`} />
          <span className="hidden md:inline">{isFlagged ? "Flagged" : "Mark for Review"}</span>
        </button>
      </div>
    </header>
  );
};