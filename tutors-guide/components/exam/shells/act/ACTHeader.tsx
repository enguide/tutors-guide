// components/exam/shells/act/ACTHeader.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Wrench, ChevronDown, Monitor, Eye, EyeOff, Square, Check } from "lucide-react";
import { SectionExamConfig } from "@/types/examConfig";

export type ACTContrastTheme =
  | "default"
  | "black-on-cream"
  | "white-on-black"
  | "yellow-on-blue";

export interface ACTHeaderProps {
  sectionTitle?: string;
  config: SectionExamConfig;
  secondsRemaining: number;
  currentIndex?: number;
  totalQuestions: number;
  answeredCount: number;
  contrastTheme?: ACTContrastTheme;
  onChangeContrastTheme?: (theme: ACTContrastTheme) => void;
  onToggleCalculator: () => void;
  onOpenReviewModal: () => void;
}

function formatClock(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? `${h}:` : ""}${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

export const ACTHeader: React.FC<ACTHeaderProps> = ({
  config,
  secondsRemaining,
  totalQuestions,
  answeredCount,
  contrastTheme = "default",
  onChangeContrastTheme,
  onToggleCalculator,
  onOpenReviewModal,
}) => {
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [contrastOpen, setContrastOpen] = useState(false);

  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const contrastMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
      if (contrastMenuRef.current && !contrastMenuRef.current.contains(e.target as Node)) {
        setContrastOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const hasCalculator =
    config.calculator === "desmos-graphing" || config.calculator === "scientific";

  // Dynamic button styles driven by theme CSS variables
  const getHeaderBtnClass = (isActive: boolean) =>
    `flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase px-2.5 py-2.5 rounded transition-colors cursor-pointer select-none ${
      isActive
        ? "bg-[var(--act-btn-active-bg)] text-[var(--act-btn-active-fg)]"
        : "text-[var(--act-header-fg)] opacity-90 hover:opacity-100 hover:bg-[var(--act-header-btn-hover-bg)] hover:text-[var(--act-header-btn-hover-fg)]"
    }`;

  return (
    <header className="h-14 bg-[var(--act-header-bg)] text-[var(--act-header-fg)] px-4 grid grid-cols-3 items-center w-full select-none z-40 shrink-0 border-b border-black/20">
      {/* Left: ACT Logo */}
      <div className="flex items-center justify-start shrink-0">
        <span className="text-[22px] font-black italic tracking-tighter text-white font-sans flex items-center select-none">
          <span className="text-[#E31B23] mr-0.5 not-italic text-lg leading-none">▲</span>
          ACT
          <sup className="text-[8px] not-italic ml-1.5 font-normal -top-2">®</sup>
        </span>
      </div>

      {/* Middle: Screen-Centered tools and contrast */}
      <div className="flex items-center justify-center md:gap-2 gap-1 -translate-x-12">
        {/* Tools Dropdown */}
        <div ref={toolsMenuRef} className="relative">
          <button
            type="button"
            aria-label="Tools"
            onClick={() => setToolsOpen((prev) => !prev)}
            className={getHeaderBtnClass(toolsOpen)}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">TOOLS</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {toolsOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--act-card-bg)] text-[var(--act-text-main)] rounded shadow-xl border border-[var(--act-card-border)] py-1 text-xs font-sans z-50">
              {hasCalculator ? (
                <button
                  type="button"
                  onClick={() => {
                    onToggleCalculator();
                    setToolsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between font-medium cursor-pointer"
                >
                  <span>Calculator</span>
                </button>
              ) : (
                <div className="px-3 py-2 opacity-50 text-xs italic">
                  No tools for this section
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contrast Dropdown */}
        <div ref={contrastMenuRef} className="relative">
          <button
            type="button"
            aria-label="Contrast"
            onClick={() => setContrastOpen((prev) => !prev)}
            className={getHeaderBtnClass(contrastOpen)}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">CONTRAST</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {contrastOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white text-neutral-900 rounded shadow-2xl border border-neutral-300 py-2 text-xs font-sans z-50">
              <div className="px-3 py-1 font-bold text-[11px] text-neutral-500 uppercase tracking-wider">
                Color Contrasts
              </div>
              <button
                type="button"
                onClick={() => {
                  onChangeContrastTheme?.("default");
                  setContrastOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-neutral-100"
              >
                <span>Default Contrast</span>
                {contrastTheme === "default" && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeContrastTheme?.("black-on-cream");
                  setContrastOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center justify-between bg-[#FFFDF0] text-black hover:bg-[#F4EED9]"
              >
                <span>Black on Cream</span>
                {contrastTheme === "black-on-cream" && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeContrastTheme?.("white-on-black");
                  setContrastOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center justify-between bg-black text-white hover:bg-neutral-900"
              >
                <span>White on Black (Inverted)</span>
                {contrastTheme === "white-on-black" && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeContrastTheme?.("yellow-on-blue");
                  setContrastOpen(false);
                }}
                className="w-full text-left px-3 py-2 flex items-center justify-between bg-[#0019A8] text-[#FFFF66] hover:bg-[#00127A]"
              >
                <span>Light Yellow on Royal Blue</span>
                {contrastTheme === "yellow-on-blue" && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Telemetry & End Test */}
      <div className="flex items-center justify-end gap-3 sm:gap-6 text-xs shrink-0 whitespace-nowrap">
        <div className="font-sans flex items-center gap-1.5 text-[11.5px] tracking-wide shrink-0 whitespace-nowrap opacity-90">
          <span className="font-semibold opacity-75">ANSWERED</span>
          <strong className="font-bold">
            {answeredCount} of {totalQuestions}
          </strong>
        </div>

        <div className="flex items-center gap-2 text-[11.5px] tracking-wide shrink-0 whitespace-nowrap">
          <span className="font-semibold opacity-75 hidden lg:inline whitespace-nowrap">
            TOTAL TIME LEFT
          </span>
          <span className="font-mono text-xs font-bold min-w-10 whitespace-nowrap">
            {isTimerHidden ? "--:--:--" : formatClock(secondsRemaining)}
          </span>
          <button
            type="button"
            onClick={() => setIsTimerHidden((prev) => !prev)}
            title={isTimerHidden ? "Show time remaining" : "Hide time remaining"}
            className="p-0.5 ml-0.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
          >
            {isTimerHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        <button
          type="button"
          aria-label="End Test"
          onClick={onOpenReviewModal}
          className="group flex items-center gap-1.5 text-xs font-bold tracking-wider px-2.5 py-2.5 rounded-sm hover:bg-white hover:text-red-800 transition-colors uppercase pl-2 cursor-pointer shrink-0 whitespace-nowrap"
        >
          <Square className="w-3 h-3 fill-current text-current transition-colors shrink-0" />
          <span className="hidden lg:inline whitespace-nowrap">END TEST</span>
        </button>
      </div>
    </header>
  );
};