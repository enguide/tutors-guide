// components/exam/ExamHeader.tsx
"use client";

import React, { useState } from "react";
import { 
  Calculator, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Strikethrough, 
  Bookmark, 
  Eye, 
  EyeOff, 
  Clock 
} from "lucide-react";
import { SectionExamConfig } from "@/types/examConfig";

interface ExamHeaderProps {
  sectionTitle: string;
  category: string;
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

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  sectionTitle,
  category,
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
  const [isTimerVisible, setIsTimerVisible] = useState(true);

  // Format MM:SS
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isUrgent = secondsRemaining < 300 && secondsRemaining > 0; // Under 5 mins

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 flex items-center justify-between select-none">
      {/* Left: Section Identity */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
          {category}
        </span>
        <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
          {sectionTitle}
        </h1>
      </div>

      {/* Center: Digital SAT Style Countdown Clock */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-medium transition ${
            isUrgent
              ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-bold"
              : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Clock size={13} className={isUrgent ? "animate-pulse" : ""} />
          <span suppressHydrationWarning>
  {isTimerVisible ? formattedTime : "--:--"}
</span>
        </div>
        <button
          type="button"
          onClick={() => setIsTimerVisible((v) => !v)}
          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-1 rounded"
          title={isTimerVisible ? "Hide timer" : "Show timer"}
        >
          {isTimerVisible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>

      {/* Right: Specialized Action Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Answer Elimination Tool */}
        {config.hasCrossOutMode && (
          <button
            type="button"
            onClick={onToggleCrossOut}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition ${
              isCrossOutMode
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            title="Toggle answer elimination mode"
          >
            <Strikethrough size={14} />
            <span className="hidden md:inline">Cross Out</span>
          </button>
        )}

        {/* Dynamic Calculator Tool */}
        {config.calculator !== "none" && (
          <button
            type="button"
            onClick={onToggleCalculator}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Open calculator"
          >
            <Calculator size={14} />
            <span className="hidden md:inline">Calculator</span>
          </button>
        )}

        {/* Dynamic Reference Sheet Modal */}
        {config.hasFormulaSheet && config.formulaSheetId && (
          <button
            type="button"
            onClick={onToggleFormulaSheet}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Open reference formulas"
          >
            <BookOpen size={14} />
            <span className="hidden md:inline">Reference</span>
          </button>
        )}

        {/* Text-to-Speech Accessibility */}
        {isTTSSupported && (
          <button
            type="button"
            onClick={onToggleTTS}
            className={`p-1.5 rounded-md border text-xs font-medium transition ${
              isTTSPlaying
                ? "bg-blue-600 text-white border-blue-600 animate-pulse"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            title={isTTSPlaying ? "Stop read aloud" : "Read aloud"}
          >
            {isTTSPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        )}

        <div className="h-5 w-px bg-slate-200 dark:border-slate-800 mx-1 hidden sm:block" />

        {/* Mark for Review Toggle */}
        <button
          type="button"
          onClick={onToggleFlag}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition ${
            isFlagged
              ? "bg-amber-500 border-amber-500 text-white font-semibold"
              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          title="Mark this question for later review"
        >
          <Bookmark size={14} className={isFlagged ? "fill-white" : ""} />
          <span className="hidden sm:inline">Review</span>
        </button>
      </div>
    </header>
  );
};