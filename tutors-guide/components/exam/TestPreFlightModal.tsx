// components/exam/TestPreFlightModal.tsx
"use client";

import React, { useState, useMemo } from "react";
import { SupportedExamCategory } from "@/types/examConfig";
import {
  AccommodationSettings,
  DEFAULT_ACCOMMODATIONS,
} from "@/types/accommodations";
import {
  Clock,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Check,
  Loader2,
  Layers,
  HelpCircle,
} from "lucide-react";

interface TestPreFlightModalProps {
  category: SupportedExamCategory;
  testTitle: string;
  totalBaseDurationSeconds: number;
  totalModulesCount: number;
  totalQuestionsCount?: number;
  firstSectionTitle?: string;
  initialAccommodations?: Partial<AccommodationSettings>;
  onStartExam: (accommodations: AccommodationSettings) => void;
}

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "--";
  const hours = Math.floor(seconds / 3600);
  const remainingSecs = seconds % 3600;
  const mins = Math.floor(remainingSecs / 60);

  if (hours > 0) {
    return mins > 0 ? `${hours}H ${mins}M` : `${hours}H`;
  }
  return `${mins} MIN${mins === 1 ? "" : "S"}`;
}

const TIME_OPTIONS: { label: string; multiplier: 1.0 | 1.5 | 2.0; tag: string; delta: string }[] = [
  { label: "Standard", multiplier: 1.0, tag: "1.0X", delta: "+0%" },
  { label: "Extended", multiplier: 1.5, tag: "1.5X", delta: "+50%" },
  { label: "Double", multiplier: 2.0, tag: "2.0X", delta: "+100%" },
];

export const TestPreFlightModal: React.FC<TestPreFlightModalProps> = ({
  category,
  testTitle,
  totalBaseDurationSeconds,
  totalModulesCount,
  totalQuestionsCount,
  firstSectionTitle,
  initialAccommodations,
  onStartExam,
}) => {
  const [settings, setSettings] = useState<AccommodationSettings>({
    ...DEFAULT_ACCOMMODATIONS,
    ...(initialAccommodations || {}),
  });
  const [isInitializing, setIsInitializing] = useState(false);

  const baseSeconds = Number(totalBaseDurationSeconds) || 0;

  const effectiveTotalSeconds = useMemo(() => {
    return Math.round(baseSeconds * settings.timeMultiplier);
  }, [baseSeconds, settings.timeMultiplier]);

  const addedSeconds = effectiveTotalSeconds - baseSeconds;

  const handleMultiplierChange = (multiplier: 1.0 | 1.5 | 2.0) => {
    if (isInitializing) return;
    setSettings((prev) => ({
      ...prev,
      timeMultiplier: multiplier,
    }));
  };

  const handleConfirm = () => {
    if (isInitializing) return;
    setIsInitializing(true);
    onStartExam(settings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-card border border-border p-7 sm:p-8 shadow-sm rounded-none text-foreground animate-in fade-in zoom-in-95 duration-150">
        
        {/* Brand & Category Status */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary text-primary-foreground">
              <GraduationCap size={15} />
            </div>
            <span className="text-xs font-black tracking-tight uppercase">
              Tutors Guide
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 px-2 py-0.5">
            {category} Test Environment
          </span>
        </div>

        {/* Exam Title & Scope Context */}
        <div className="mb-5">
          <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            Diagnostic Configuration
          </span>
          <h1 className="text-lg font-bold tracking-tight text-foreground uppercase mt-0.5 leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
            {testTitle}
          </h1>
          {firstSectionTitle && (
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
              <span className="text-primary font-semibold uppercase">Init:</span>
              <span className="text-foreground truncate uppercase">{firstSectionTitle}</span>
            </div>
          )}
        </div>

        {/* Structure / Scope Badges */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="p-2.5 bg-muted/20 border border-border flex items-center gap-2.5">
            <Layers size={14} className="text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <span className="block text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                Structure
              </span>
              <span className="text-xs font-bold font-mono text-foreground uppercase truncate block">
                {totalModulesCount} {totalModulesCount === 1 ? "Module" : "Modules"}
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-muted/20 border border-border flex items-center gap-2.5">
            <HelpCircle size={14} className="text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <span className="block text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                Total Questions
              </span>
              <span className="text-xs font-bold font-mono text-foreground uppercase truncate block">
                {totalQuestionsCount ? `${totalQuestionsCount} Items` : "Adaptive"}
              </span>
            </div>
          </div>
        </div>

        {/* Accommodation Selector */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Extended Time Accommodation
              </label>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Multiplier: {settings.timeMultiplier.toFixed(1)}x
              </span>
            </div>

            <div 
              role="radiogroup" 
              aria-label="Extended time accommodation options"
              className="grid grid-cols-3 gap-2"
            >
              {TIME_OPTIONS.map((opt) => {
                const isSelected = settings.timeMultiplier === opt.multiplier;
                return (
                  <button
                    key={opt.multiplier}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={isInitializing}
                    onClick={() => handleMultiplierChange(opt.multiplier)}
                    className={`p-2.5 border text-left transition-colors cursor-pointer rounded-none flex flex-col justify-between focus:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSelected
                        ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                        : "border-input bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <span className="text-[10px] font-mono font-bold tracking-wider">
                        {opt.tag}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                      ) : (
                        <span className="text-[9px] font-mono text-muted-foreground">
                          {opt.delta}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold leading-tight uppercase truncate">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Computed Exam Duration Bar */}
          <div className="p-3 bg-muted/40 border border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={14} className="shrink-0" />
              <span className="text-[11px] font-mono uppercase tracking-wider">
                Total Allowed Time
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {addedSeconds > 0 && (
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5">
                  +{formatDuration(addedSeconds)}
                </span>
              )}
              <span className="font-mono text-xs font-bold text-foreground tabular-nums">
                {formatDuration(effectiveTotalSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Launch Actions */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            disabled={isInitializing}
            onClick={handleConfirm}
            className="group relative w-full flex items-center justify-between bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2.5 px-3.5 transition-colors cursor-pointer rounded-none uppercase tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInitializing ? (
              <span className="flex items-center gap-2 mx-auto">
                <Loader2 size={14} className="animate-spin" /> Initializing Environment...
              </span>
            ) : (
              <>
                <span className="tracking-wider uppercase">Begin Examination</span>
                {/* Morphing Arrow-to-Checkmark */}
                <span className="flex items-center justify-center transition-transform duration-300 ease-out transform group-hover:translate-x-1">
                  <span className="relative w-4 h-4 flex items-center justify-center shrink-0">
                    <ArrowRight
                      size={14}
                      strokeWidth={2.25}
                      className="absolute inset-0 m-auto transition-all duration-300 ease-out transform group-hover:rotate-180 group-hover:scale-50 group-hover:opacity-0"
                    />
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      className="absolute inset-0 m-auto transition-all duration-300 ease-out transform -rotate-180 scale-50 opacity-0 group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100"
                    />
                  </span>
                </span>
              </>
            )}
          </button>
          
          <p className="text-[10px] font-mono text-center text-muted-foreground uppercase tracking-widest">
            {settings.timeMultiplier > 1.0
              ? `${settings.timeMultiplier}x extended pacing applied across all modules`
              : "Standard timing profile applied"}
          </p>
        </div>

      </div>
    </div>
  );
};