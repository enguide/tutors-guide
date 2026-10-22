// components/dashboard/ExamCountdownWidget.tsx
"use client";

import React, { useState, useSyncExternalStore } from "react";
import {
  Calendar,
  SlidersHorizontal,
  Check,
  X,
  Target,
  Sparkles,
} from "lucide-react";

interface ExamCountdownWidgetProps {
  categories?: string[];
  activeProgram?: string;
}

const PRESET_DATES: Record<string, { label: string; date: string }[]> = {
  SAT: [
    { label: "SAT — Nov 2026", date: "2026-11-07" },
    { label: "SAT — Dec 2026", date: "2026-12-05" },
    { label: "SAT — Mar 2027", date: "2027-03-14" },
  ],
  ACT: [
    { label: "ACT — Dec 2026", date: "2026-12-12" },
    { label: "ACT — Feb 2027", date: "2027-02-07" },
    { label: "ACT — Apr 2027", date: "2027-04-10" },
  ],
  GRE: [
    { label: "GRE — Dec 2026", date: "2026-12-15" },
    { label: "GRE — Mar 2027", date: "2027-03-01" },
  ],
};

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredValue(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export function ExamCountdownWidget({ categories, activeProgram: propActiveProgram }: ExamCountdownWidgetProps) {
  const activeProgram = propActiveProgram || categories?.[0] || "SAT";

  const defaultDate = React.useMemo(() => {
    const presets = PRESET_DATES[activeProgram] || [];
    if (presets.length > 0) return presets[0].date;
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().slice(0, 10);
  }, [activeProgram]);

  const isHydrated = useSyncExternalStore(
    subscribeToStorage,
    () => true,
    () => false
  );

  const storedDate = useSyncExternalStore(
    subscribeToStorage,
    () => getStoredValue(`target_exam_date_${activeProgram}`, defaultDate),
    () => defaultDate
  );

  const storedScore = useSyncExternalStore(
    subscribeToStorage,
    () => getStoredValue(`target_exam_score_${activeProgram}`, ""),
    () => ""
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formDate, setFormDate] = useState(storedDate);
  const [formScore, setFormScore] = useState(storedScore);

  const { daysRemaining, weeksRemaining, isPast, formattedTargetDate } = React.useMemo(() => {
    if (!storedDate) {
      return { daysRemaining: 0, weeksRemaining: 0, isPast: false, formattedTargetDate: "" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = storedDate.split("-").map(Number);
    const target = new Date(year, month - 1, day);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const dateDisplay = target.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      daysRemaining: Math.max(0, diffDays),
      weeksRemaining: Math.max(0, Math.ceil(diffDays / 7)),
      isPast: diffDays <= 0,
      formattedTargetDate: dateDisplay,
    };
  }, [storedDate]);

  const getPhaseNarrative = (weeks: number) => {
    if (weeks <= 1) return { phase: "Final Taper", desc: "Consolidate stamina and test-day mechanics." };
    if (weeks <= 3) return { phase: "Peak Simulation", desc: "Weekly full diagnostics under strict time conditions." };
    if (weeks <= 6) return { phase: "Skill Mastery", desc: "Target lowest-accuracy subdomains from triage logs." };
    return { phase: "Foundations", desc: "Establish pacing rhythms and question recognition." };
  };

  const phase = getPhaseNarrative(weeksRemaining);

  const handleOpenEdit = () => {
    setFormDate(storedDate);
    setFormScore(storedScore);
    setIsEditing(true);
  };

  const handleSave = () => {
    localStorage.setItem(`target_exam_date_${activeProgram}`, formDate);
    localStorage.setItem(`target_exam_score_${activeProgram}`, formScore);
    window.dispatchEvent(new Event("storage"));
    setIsEditing(false);
  };

  const presets = PRESET_DATES[activeProgram] || [];

  if (!isHydrated) {
    return (
      <div className="w-full bg-card border border-border rounded-none animate-pulse" />
    );
  }

  return (
    <div className="w-full bg-card border border-border rounded-none p-6 flex flex-col justify-between">
      {/* Top Header Row matching your exact updated layout */}
      <div className="flex flex-col items-start border-b border-border pb-3">
        <div className="flex flex-row items-center justify-between w-full">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 font-mono">
            <Sparkles size={12} /> Target Exam Runway
          </span>
          <button
            onClick={isEditing ? () => setIsEditing(false) : handleOpenEdit}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 border border-border px-2.5 py-1.5 hover:bg-muted transition-colors rounded-none"
          >
            {isEditing ? <X size={13} /> : <SlidersHorizontal size={13} />}
            <span>{isEditing ? "Close" : "Configure"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 space-y-6 justify-between w-full">
          <h2 className="text-xl font-black text-foreground">{activeProgram} Test Date</h2>
          <span className="text-[14px] px-2 py-0.5 bg-muted/60 border border-border font-semibold">
            {formattedTargetDate || "Date Unset"}
          </span>
        </div>
      </div>

      {/* Main Center Area */}
      {isEditing ? (
        <div className="bg-muted/40 border border-input p-3 rounded-none space-y-2.5 animate-in fade-in duration-150 flex-1 overflow-y-auto my-1.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Official Exam Date
              </label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full text-xs font-semibold p-1.5 border border-input bg-background rounded-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Score Goal
              </label>
              <input
                type="text"
                placeholder={activeProgram === "ACT" ? "e.g. 34" : "e.g. 1500"}
                value={formScore}
                onChange={(e) => setFormScore(e.target.value)}
                className="w-full text-xs font-semibold p-1.5 border border-input bg-background rounded-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-border">
            <div className="flex gap-1 flex-wrap">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setFormDate(preset.date)}
                  className="text-[10px] font-mono px-1.5 py-0.5 border border-border bg-card text-muted-foreground hover:text-foreground"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center gap-1 rounded-none transition-colors"
            >
              <Check size={12} />
              <span>Save</span>
            </button>
          </div>
        </div>
      ) : isPast ? (
        <div className="py-6 border border-dashed border-border text-center space-y-1 my-auto">
          <h3 className="text-base font-bold text-foreground">Target Exam Date Reached</h3>
          <p className="text-xs text-muted-foreground">
            Configure your next official sitting above to recalibrate your prep horizon.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-6 py-2">
          {/* Phase Narrative matching your updated typography */}
          <div className="text-left space-y-1 max-w-[210px]">
            <div className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
              T-{weeksRemaining} Week{weeksRemaining === 1 ? "" : "s"} to go
            </div>
            <div className="text-sm font-bold text-foreground">
              {phase.phase}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {phase.desc}
            </p>
          </div>

          {/* Days Callout matching your metric layout */}
          <div className="flex items-baseline gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Days Remaining
              </span>
              <div className="text-4xl sm:text-5xl font-black text-primary leading-none pt-1">
                {daysRemaining}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={13} className="text-primary" />
          <span className="text-xs font-semibold text-muted-foreground">
            Target Cadence: <strong className="text-foreground">1 exam / 2 wks</strong>
          </span>
        </div>

        {storedScore ? (
          <div className="flex items-center gap-1 text-xs font-semibold text-primary font-mono">
            <Target size={13} />
            <span>Goal: {storedScore}</span>
          </div>
        ) : (
          <span className="text-[10px] font-mono text-muted-foreground">
            No Goal Set
          </span>
        )}
      </div>
    </div>
  );
}