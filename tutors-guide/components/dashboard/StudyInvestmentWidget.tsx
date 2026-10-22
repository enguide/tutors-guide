// components/dashboard/StudyInvestmentWidget.tsx
"use client";

import React, { useState, useSyncExternalStore } from "react";
import {
  Hourglass,
  Plus,
  SlidersHorizontal,
  Check,
  X,
  Sparkles,
} from "lucide-react";

interface StudyInvestmentWidgetProps {
  categories?: string[];
  activeProgram?: string;
  examTimeSpentSeconds: number;
}

const SCORE_GAIN_PRESETS: Record<
  string,
  { label: string; hours: number; gainLabel: string }[]
> = {
  SAT: [
    { label: "+50–100 pts", hours: 40, gainLabel: "Target: +50–100" },
    { label: "+100–150 pts", hours: 80, gainLabel: "Target: +100–150" },
    { label: "+200+ pts", hours: 130, gainLabel: "Target: +200+" },
  ],
  ACT: [
    { label: "+1–2 pts", hours: 30, gainLabel: "Target: +1–2" },
    { label: "+3–4 pts", hours: 70, gainLabel: "Target: +3–4" },
    { label: "+5+ pts", hours: 120, gainLabel: "Target: +5+" },
  ],
  GRE: [
    { label: "+5–8 pts", hours: 40, gainLabel: "Target: +5–8" },
    { label: "+10–15 pts", hours: 80, gainLabel: "Target: +10–15" },
    { label: "+20+ pts", hours: 120, gainLabel: "Target: +20+" },
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

export function StudyInvestmentWidget({
  categories,
  activeProgram: propActiveProgram,
  examTimeSpentSeconds,
}: StudyInvestmentWidgetProps) {
  const activeProgram = propActiveProgram || categories?.[0] || "SAT";

  const isHydrated = useSyncExternalStore(
    subscribeToStorage,
    () => true,
    () => false
  );

  const storedTargetHours = useSyncExternalStore(
    subscribeToStorage,
    () => getStoredValue(`study_target_hours_${activeProgram}`, "80"),
    () => "80"
  );

  const storedManualHours = useSyncExternalStore(
    subscribeToStorage,
    () => getStoredValue(`study_manual_hours_${activeProgram}`, "0"),
    () => "0"
  );

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isLoggingHours, setIsLoggingHours] = useState(false);

  const [formTargetHours, setFormTargetHours] = useState(storedTargetHours);
  const [sessionHoursInput, setSessionHoursInput] = useState("");

  const examHours = parseFloat((examTimeSpentSeconds / 3600).toFixed(1));
  const manualHours = parseFloat(parseFloat(storedManualHours || "0").toFixed(1));
  const targetHours = parseFloat(storedTargetHours) || 80;

  const totalInvestedHours = parseFloat((examHours + manualHours).toFixed(1));
  const progressPercent = Math.min(
    100,
    Math.round((totalInvestedHours / targetHours) * 100)
  );
  const hoursRemaining = Math.max(0, parseFloat((targetHours - totalInvestedHours).toFixed(1)));

  const examPercent = Math.min(100, (examHours / targetHours) * 100);
  const manualPercent = Math.min(100 - examPercent, (manualHours / targetHours) * 100);

  const handleOpenGoalEdit = () => {
    setFormTargetHours(storedTargetHours);
    setIsLoggingHours(false);
    setIsEditingGoal(true);
  };

  const handleSaveGoal = () => {
    localStorage.setItem(`study_target_hours_${activeProgram}`, formTargetHours);
    window.dispatchEvent(new Event("storage"));
    setIsEditingGoal(false);
  };

  const handleLogSession = (e: React.FormEvent) => {
    e.preventDefault();
    const added = parseFloat(sessionHoursInput);
    if (!isNaN(added) && added > 0) {
      const updated = (manualHours + added).toFixed(1);
      localStorage.setItem(`study_manual_hours_${activeProgram}`, updated);
      window.dispatchEvent(new Event("storage"));
      setSessionHoursInput("");
      setIsLoggingHours(false);
    }
  };

  const presets = SCORE_GAIN_PRESETS[activeProgram] || SCORE_GAIN_PRESETS.SAT;

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border p-6 rounded-none h-56 animate-pulse" />
    );
  }

  return (
    <div className="bg-card border border-border rounded-none p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 text-primary border border-primary/20">
            <Hourglass size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              Preparation Time Bank
              <span className="text-[10px] font-mono px-2 py-0.5 bg-muted/60 border border-border font-semibold">
                {activeProgram}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Total effort invested across timed diagnostic tests and independent study.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => {
              setIsLoggingHours(!isLoggingHours);
              setIsEditingGoal(false);
            }}
            className="text-xs font-semibold px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-none transition-colors"
          >
            <Plus size={13} />
            <span>Log Study Time</span>
          </button>

          <button
            onClick={isEditingGoal ? () => setIsEditingGoal(false) : handleOpenGoalEdit}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 border border-border px-2.5 py-1.5 hover:bg-muted transition-colors rounded-none"
          >
            {isEditingGoal ? <X size={13} /> : <SlidersHorizontal size={13} />}
            <span>{isEditingGoal ? "Close" : "Goal"}</span>
          </button>
        </div>
      </div>

      {/* Drawer 1: Log Study Hours */}
      {isLoggingHours && (
        <form
          onSubmit={handleLogSession}
          className="bg-muted/40 border border-input p-4 rounded-none space-y-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Log Independent Study Session ({activeProgram})
            </span>
            <button
              type="button"
              onClick={() => setIsLoggingHours(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="24"
                required
                placeholder="Hours studied (e.g. 1.5, 2.0)"
                value={sessionHoursInput}
                onChange={(e) => setSessionHoursInput(e.target.value)}
                className="w-full text-xs font-semibold p-2 border border-input bg-background rounded-none"
              />
            </div>

            <div className="flex gap-1.5">
              {[1, 1.5, 2, 3].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setSessionHoursInput(String(hrs))}
                  className="px-2.5 py-1.5 text-xs font-mono font-semibold border border-border bg-card hover:bg-muted"
                >
                  +{hrs}h
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center justify-center gap-1.5 rounded-none transition-colors"
            >
              <Check size={13} />
              <span>Record Hours</span>
            </button>
          </div>
        </form>
      )}

      {/* Drawer 2: Adjust Target Goal */}
      {isEditingGoal && (
        <div className="bg-muted/40 border border-input p-4 rounded-none space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Configure Preparation Goal ({activeProgram})
            </span>
            <button
              type="button"
              onClick={() => setIsEditingGoal(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Total Prep Goal (Hours)
            </label>
            <input
              type="number"
              min="10"
              max="500"
              value={formTargetHours}
              onChange={(e) => setFormTargetHours(e.target.value)}
              className="w-full text-xs font-semibold p-2 border border-input bg-background rounded-none"
            />
          </div>

          <div className="space-y-1.5 pt-1 border-t border-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Suggested Hours by Target Score Gain:
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setFormTargetHours(String(preset.hours))}
                  className="text-xs px-2.5 py-1 border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground font-mono transition-colors"
                >
                  {preset.gainLabel} (~{preset.hours}h)
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSaveGoal}
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 rounded-none transition-colors"
            >
              <Check size={13} />
              <span>Save Goal</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Metric & Dual-Tone Progress Track */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Invested vs. Goal
            </span>
            <div className="text-3xl font-black text-foreground font-mono">
              {totalInvestedHours}h{" "}
              <span className="text-xs font-normal text-muted-foreground">
                / {targetHours}h Goal
              </span>
            </div>
          </div>

          <div className="text-right space-y-0.5">
            <div className="text-xl font-black text-primary font-mono">
              {progressPercent}%
            </div>
            <span className="text-[10px] font-mono text-muted-foreground block">
              {hoursRemaining > 0 ? `${hoursRemaining}h remaining` : "Goal Achieved!"}
            </span>
          </div>
        </div>

        {/* Dual-Tone Architectural Progress Track */}
        <div className="w-full bg-muted/60 h-3 border border-border flex overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${examPercent}%` }}
            title={`Testing: ${examHours}h`}
          />
          <div
            className="bg-primary/50 h-full transition-all duration-300"
            style={{ width: `${manualPercent}%` }}
            title={`Independent Study: ${manualHours}h`}
          />
        </div>

        {/* Breakdown Legend */}
        <div className="flex items-center justify-between text-[11px] pt-1 text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-primary inline-block" />
              <span>
                Diagnostic Testing: <strong className="text-foreground font-mono">{examHours}h</strong>
              </span>
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-primary/50 inline-block" />
              <span>
                Independent Study: <strong className="text-foreground font-mono">{manualHours}h</strong>
              </span>
            </span>
          </div>

          <span className="hidden sm:inline font-mono text-[10px]">
            {activeProgram} Track
          </span>
        </div>
      </div>

      {/* Footer Guidance */}
      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary" />
          <span>
            {progressPercent >= 100
              ? "Target investment fulfilled! Keep skills conditioned."
              : progressPercent >= 60
              ? "Over halfway to target. Prioritize timed module drills."
              : "Building momentum. Maintain a weekly study cadence."}
          </span>
        </span>

        <span className="text-[10px] font-mono text-muted-foreground">
          Updated on Session Log
        </span>
      </div>
    </div>
  );
}