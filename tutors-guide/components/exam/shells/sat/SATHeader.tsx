// components/exam/shells/sat/SATHeader.tsx
"use client";

import React, { useState } from "react";
import { Calculator, FileText, Volume2, ChevronDown } from "lucide-react";
import { SectionExamConfig } from "@/types/examConfig";
import { NetworkStatusPill } from "@/components/exam/NetworkStatusPill";
import type { SyncStatus } from "@/hooks/useTestProgress";

interface SATHeaderProps {
  sectionTitle: string;
  config: SectionExamConfig;
  secondsRemaining: number;
  syncStatus?: SyncStatus;
  isTTSPlaying: boolean;
  isTTSSupported: boolean;
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
  syncStatus,
  isTTSPlaying,
  isTTSSupported,
  onToggleCalculator,
  onToggleFormulaSheet,
  onToggleTTS,
}) => {
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const isTimeCritical = secondsRemaining <= 300; // Under 5 mins[cite: 15]

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

      {/* Center: Bluebook Stacked Timer & Hide Button + Resilience Pill */}
      <div className="flex flex-col items-center justify-self-center gap-1">
        <div className="flex items-center gap-2">
          <span
            className={`font-sans text-xl font-bold tracking-tight ${
              isTimeCritical ? "text-rose-600 animate-pulse" : "text-neutral-900 dark:text-neutral-100"
            }`}
          >
            {isTimerHidden ? "--:--" : formatClock(secondsRemaining)}
          </span>
          {syncStatus && <NetworkStatusPill status={syncStatus} />}
        </div>
        <button
          type="button"
          onClick={() => setIsTimerHidden((prev) => !prev)}
          className="px-3 py-0.5 mt-0.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {isTimerHidden ? "Show" : "Hide"}
        </button>
      </div>

      {/* Right: Subject-Specific & Accessibility Tools */}
      <div className="flex items-center gap-2 justify-self-end">
        {/* Desmos Graphing Calculator */}
        {config.calculator === "desmos-graphing" && (
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

        {/* Reference Sheet Drawer */}
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
        {isTTSSupported && (
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