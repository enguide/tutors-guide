// components/exam/shells/ap/APHeader.tsx
"use client";

import React, { useState } from "react";
import { Calculator, FileText, Volume2, ChevronDown } from "lucide-react";
import { SectionExamConfig } from "@/types/examConfig";

interface APHeaderProps {
  sectionTitle: string;
  config: SectionExamConfig;
  secondsRemaining: number;
  isTTSPlaying?: boolean;
  isTTSSupported?: boolean;
  onToggleCalculator: () => void;
  onToggleFormulaSheet: () => void;
  onToggleTTS?: () => void;
}

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export const APHeader: React.FC<APHeaderProps> = ({
  sectionTitle,
  config,
  secondsRemaining,
  isTTSPlaying = false,
  isTTSSupported = false,
  onToggleCalculator,
  onToggleFormulaSheet,
  onToggleTTS,
}) => {
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const isTimeCritical = secondsRemaining <= 300; // Under 5 minutes

  return (
    <header className="relative h-16 border-b border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 grid grid-cols-3 items-center select-none z-30">
      {/* Left: Section Title & Directions Dropdown */}
      <div className="flex flex-col justify-self-start">
        <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">
          {sectionTitle}
        </span>
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
        >
          <span>Directions</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Center: Stacked Timer & Hide Button */}
      <div className="flex flex-col items-center justify-self-center">
        <span
          className={`font-sans text-xl font-bold tracking-tight ${
            isTimeCritical ? "text-rose-600 animate-pulse" : "text-neutral-900 dark:text-neutral-100"
          }`}
        >
          {isTimerHidden ? "--:--" : formatClock(secondsRemaining)}
        </span>
        <button
          type="button"
          onClick={() => setIsTimerHidden((prev) => !prev)}
          className="px-3 py-0.5 mt-0.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {isTimerHidden ? "Show" : "Hide"}
        </button>
      </div>

      {/* Right: Calculator, Reference Sheet, and Audio Accessibility */}
      <div className="flex items-center gap-2 justify-self-end">
        {/* Calculator: Shown if config enables graphing or scientific */}
        {config.calculator !== "none" && (
          <button
            type="button"
            onClick={onToggleCalculator}
            title="Calculator"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-sm transition-colors"
          >
            <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">Calculator</span>
          </button>
        )}

        {/* Formula / Reference Sheet */}
        {config.hasFormulaSheet && (
          <button
            type="button"
            onClick={onToggleFormulaSheet}
            title="Reference Formulas"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-sm transition-colors"
          >
            <FileText className="w-4 h-4 text-neutral-500" />
            <span className="hidden md:inline">Reference</span>
          </button>
        )}

        {/* Text-to-Speech Accessibility */}
        {isTTSSupported && onToggleTTS && (
          <button
            type="button"
            onClick={onToggleTTS}
            title="Read Question"
            className={`p-1.5 rounded-sm border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
              isTTSPlaying ? "text-blue-600 dark:text-blue-400 border-blue-400" : ""
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};