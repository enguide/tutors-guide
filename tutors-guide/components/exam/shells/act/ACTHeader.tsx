// components/exam/shells/act/ACTHeader.tsx
"use client";

import React, { useState } from "react";
import {
  Bookmark,
  List,
  Clock,
  Eye,
  EyeOff,
  Calculator,
  XCircle,
  Volume2,
} from "lucide-react";
import { SectionExamConfig } from "@/types/examConfig";

interface ACTHeaderProps {
  sectionTitle: string;
  config: SectionExamConfig;
  secondsRemaining: number;
  currentIndex: number;
  totalQuestions: number;
  isFlagged: boolean;
  isCrossOutMode: boolean;
  isTTSPlaying: boolean;
  isTTSSupported: boolean;
  onToggleFlag: () => void;
  onToggleCrossOut: () => void;
  onToggleCalculator: () => void;
  onToggleTTS: () => void;
  onOpenReviewModal: () => void;
}

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export const ACTHeader: React.FC<ACTHeaderProps> = ({
  sectionTitle,
  config,
  secondsRemaining,
  currentIndex,
  totalQuestions,
  isFlagged,
  isCrossOutMode,
  isTTSPlaying,
  isTTSSupported,
  onToggleFlag,
  onToggleCrossOut,
  onToggleCalculator,
  onToggleTTS,
  onOpenReviewModal,
}) => {
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const isTimeCritical = secondsRemaining <= 300;

  return (
    <header className="h-14 bg-[#0A2540] text-white px-4 sm:px-6 flex items-center justify-between select-none z-30 shadow-md">
      {/* Left: TestNav Action Cluster (Review Drawer & Bookmark) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenReviewModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#17375E] hover:bg-[#20497B] text-white text-xs font-semibold rounded-[3px] border border-[#2D5A92] transition-colors"
          title="Review all questions"
        >
          <List className="w-3.5 h-3.5" />
          <span>Review</span>
        </button>

        <button
          type="button"
          onClick={onToggleFlag}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[3px] border transition-colors ${
            isFlagged
              ? "bg-amber-500 text-neutral-950 border-amber-400 font-bold"
              : "bg-[#17375E] hover:bg-[#20497B] text-white border-[#2D5A92]"
          }`}
          title="Flag question for review"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? "fill-neutral-950" : ""}`} />
          <span>{isFlagged ? "Bookmarked" : "Bookmark"}</span>
        </button>

        <div className="hidden md:flex flex-col ml-3 border-l border-white/20 pl-3">
          <span className="text-xs font-bold tracking-tight text-white/95">
            {sectionTitle}
          </span>
          <span className="text-[10px] text-white/70 font-mono">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
      </div>

      {/* Center: TestNav Timer */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#06182B] border border-[#17375E] rounded-[3px]">
          <Clock className={`w-3.5 h-3.5 ${isTimeCritical ? "text-rose-400 animate-pulse" : "text-white/70"}`} />
          <span
            className={`font-mono text-xs sm:text-sm font-semibold tracking-tight min-w-[42px] text-center ${
              isTimeCritical ? "text-rose-400" : "text-white"
            }`}
          >
            {isTimerHidden ? "--:--" : formatClock(secondsRemaining)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsTimerHidden((prev) => !prev)}
          className="p-1.5 text-white/70 hover:text-white hover:bg-[#17375E] rounded-[3px] transition-colors"
          title={isTimerHidden ? "Show time remaining" : "Hide time remaining"}
        >
          {isTimerHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Right: Tools & Utilities */}
      <div className="flex items-center gap-2">
        {/* Calculator: strict tool gating for ACT Math sections */}
        {(config.calculator === "desmos-graphing" || config.calculator === "scientific") && (
          <button
            type="button"
            onClick={onToggleCalculator}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#17375E] hover:bg-[#20497B] text-white border border-[#2D5A92] rounded-[3px] text-xs font-semibold transition-colors"
            title="Calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden sm:inline">Calculator</span>
          </button>
        )}

        {/* Answer Eliminator Tool */}
        <button
          type="button"
          onClick={onToggleCrossOut}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-[3px] border transition-colors ${
            isCrossOutMode
              ? "bg-rose-500 text-white border-rose-400 font-bold"
              : "bg-[#17375E] hover:bg-[#20497B] text-white border-[#2D5A92]"
          }`}
          title="Answer Eliminator"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Eliminator</span>
        </button>

        {/* TTS Read-Aloud */}
        {isTTSSupported && (
          <button
            type="button"
            onClick={onToggleTTS}
            className={`p-1.5 rounded-[3px] border transition-colors ${
              isTTSPlaying
                ? "bg-sky-500 text-white border-sky-400"
                : "bg-[#17375E] hover:bg-[#20497B] text-white border-[#2D5A92]"
            }`}
            title="Read Question"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};