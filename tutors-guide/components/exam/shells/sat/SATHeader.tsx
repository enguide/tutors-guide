// components/exam/shells/sat/SATHeader.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, MoreVertical} from "lucide-react";
import { SectionExamConfig } from "@/types/examConfig";
import { NetworkStatusPill } from "@/components/exam/NetworkStatusPill";
import { SATDirectionsModal } from "./SATDirectionsModal";
import { SATDashedDivider } from "./SATDashedDivider";
import type { SyncStatus } from "@/hooks/useTestProgress";

export interface SATHeaderProps {
  sectionTitle: string;
  config: SectionExamConfig;
  secondsRemaining: number;
  syncStatus?: SyncStatus;
  isCalculatorOpen?: boolean;
  isFormulaSheetOpen?: boolean;
  onToggleCalculator: () => void;
  onToggleFormulaSheet: () => void;
}

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

/**
 * Official Bluebook Pocket Calculator SVG
 */
function BluebookCalculatorIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <rect x="7.5" y="5" width="9" height="4" rx="0.5" />
      <circle cx="8" cy="12" r="0.8" fill="currentColor" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
      <circle cx="16" cy="12" r="0.8" fill="currentColor" />
      <circle cx="8" cy="15" r="0.8" fill="currentColor" />
      <circle cx="12" cy="15" r="0.8" fill="currentColor" />
      <circle cx="16" cy="15" r="0.8" fill="currentColor" />
      <circle cx="8" cy="18" r="0.8" fill="currentColor" />
      <circle cx="12" cy="18" r="0.8" fill="currentColor" />
      <circle cx="16" cy="18" r="0.8" fill="currentColor" />
    </svg>
  );
}

function BluebookTimerHiddenIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Top stem and pusher button */}
      <line x1="10" y1="2" x2="14" y2="2" />
      <line x1="12" y1="2" x2="12" y2="5" />
      {/* Top-right angled lap button */}
      <line x1="18.5" y1="5.5" x2="19.5" y2="6.5" />
      {/* Clock dial body */}
      <circle cx="12" cy="14" r="8" />
      {/* Hands at center */}
      <polyline points="12 10 12 14 14.5 14" />
    </svg>
  );
}

export const SATHeader: React.FC<SATHeaderProps> = ({
  sectionTitle,
  config,
  secondsRemaining,
  syncStatus,
  isCalculatorOpen = false,
  isFormulaSheetOpen = false,
  onToggleCalculator,
  onToggleFormulaSheet,
}) => {
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const isTimeCritical = secondsRemaining <= 300;

  return (
    <>
      <header className="relative h-18 bg-[#EBF3FA] dark:bg-neutral-950 px-6 sm:px-8 grid grid-cols-3 items-center select-none z-30">
        {/* Left: Section Title & Directions Dropdown Trigger */}
        <div className="flex flex-col justify-self-start relative">
          <span className="text-[15px] font-bold text-neutral-900 dark:text-neutral-100">
            {sectionTitle}
          </span>
          <button
            type="button"
            onClick={() => setIsDirectionsOpen((prev) => !prev)}
            className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium cursor-pointer transition-colors w-fit pt-0.5"
          >
            <span>Directions</span>
            {isDirectionsOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Center: Bluebook Stacked Timer & Hide Button */}
<div className="flex flex-col items-center justify-self-center gap-0.5">
  <div className="flex items-center gap-2 h-7">
    {isTimerHidden ? (
      <BluebookTimerHiddenIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
    ) : (
      <span
        className={`font-sans text-xl font-bold tracking-tight ${
          isTimeCritical
            ? "text-rose-600 animate-pulse"
            : "text-neutral-900 dark:text-neutral-100"
        }`}
      >
        {formatClock(secondsRemaining)}
      </span>
    )}
    {syncStatus && <NetworkStatusPill status={syncStatus} />}
  </div>

  <button
    type="button"
    onClick={() => setIsTimerHidden((prev) => !prev)}
    className="px-3 py-0.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/70 rounded-full hover:bg-white dark:hover:bg-neutral-800 transition-colors cursor-pointer"
  >
    {isTimerHidden ? "Show" : "Hide"}
  </button>
</div>

        {/* Right: Bluebook Native Header Tools */}
        <div className="flex items-center justify-end gap-6 sm:gap-7 justify-self-end h-full">
          {/* Calculator Button */}
          {config.calculator === "desmos-graphing" && (
            <button
              type="button"
              onClick={onToggleCalculator}
              className="group relative flex flex-col items-center justify-center text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white cursor-pointer transition-colors pt-1"
            >
              <BluebookCalculatorIcon className="w-5 h-5 mb-0.5" />
              <span className="text-[12px] font-medium tracking-tight">
                Calculator
              </span>
              {/* Active Indicator Underline */}
              {isCalculatorOpen && (
                <span className="absolute -bottom-1 inset-x-0 h-[2.5px] bg-[#1e1e1e] dark:bg-neutral-100 rounded-full" />
              )}
            </button>
          )}

          {/* Reference Formula Sheet Button */}
          {config.hasFormulaSheet && (
            <button
              type="button"
              onClick={onToggleFormulaSheet}
              className="group relative flex flex-col items-center justify-center text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white cursor-pointer transition-colors pt-1"
            >
              <span className="h-5 flex items-center justify-center font-serif italic font-bold text-base leading-none text-neutral-900 dark:text-neutral-100 mb-0.5">
                x<sup className="text-[10px] font-sans not-italic font-bold -top-1 ml-0.5">2</sup>
              </span>
              <span className="text-[12px] font-medium tracking-tight">
                Reference
              </span>
              {/* Active Indicator Underline */}
              {isFormulaSheetOpen && (
                <span className="absolute -bottom-1 inset-x-0 h-[2.5px] bg-[#1e1e1e] dark:bg-neutral-100 rounded-full" />
              )}
            </button>
          )}

          {/* More Menu */}
          <button
            type="button"
            onClick={() => setIsMoreOpen((prev) => !prev)}
            className="group relative flex flex-col items-center justify-center text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white cursor-pointer transition-colors pt-1"
          >
            <MoreVertical className="w-5 h-5 mb-0.5 stroke-[2.2]" />
            <span className="text-[12px] font-medium tracking-tight">
              More
            </span>
            {isMoreOpen && (
              <span className="absolute -bottom-1 inset-x-0 h-[2.5px] bg-[#1e1e1e] dark:bg-neutral-100 rounded-full" />
            )}
          </button>
        </div>
        <SATDashedDivider position="bottom" />
      </header>

      {/* Render Bluebook Directions Dropdown */}
      <SATDirectionsModal
        isOpen={isDirectionsOpen}
        sectionTitle={sectionTitle}
        onClose={() => setIsDirectionsOpen(false)}
      />
    </>
  );
};