/* eslint-disable @typescript-eslint/no-explicit-any */
// components/exam/TestPreFlightModal.tsx
"use client";

import React, { useState, useMemo } from "react";
import { SupportedExamCategory } from "@/types/examConfig";
import {
  AccommodationSettings,
  DEFAULT_ACCOMMODATIONS,
} from "@/types/accommodations";
import {
  getAvailableAccommodationsForCategory,
  AccommodationDescriptor,
} from "@/lib/accommodations/registry";
import {
  Play,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Info,
} from "lucide-react";

interface TestPreFlightModalProps {
  category: SupportedExamCategory;
  testTitle: string;
  sectionTitle: string;
  baseTimeLimitSeconds: number;
  initialAccommodations?: Partial<AccommodationSettings>;
  onStartExam: (accommodations: AccommodationSettings) => void;
}

function formatMinutes(seconds: number): string {
  const mins = Math.round(seconds / 60);
  return `${mins} min${mins === 1 ? "" : "s"}`;
}

export const TestPreFlightModal: React.FC<TestPreFlightModalProps> = ({
  category,
  testTitle,
  sectionTitle,
  baseTimeLimitSeconds,
  initialAccommodations,
  onStartExam,
}) => {
  const [settings, setSettings] = useState<AccommodationSettings>({
    ...DEFAULT_ACCOMMODATIONS,
    ...(initialAccommodations || {}),
  });

  const availableAccommodations = useMemo(
    () => getAvailableAccommodationsForCategory(category),
    [category]
  );

  // Calculate adjusted time based on selected multiplier
  const effectiveSeconds = Math.round(
    baseTimeLimitSeconds * settings.timeMultiplier
  );

  const isAccommodated =
    settings.timeMultiplier !== 1.0 ||
    settings.imageMagnification ||
    settings.textToSpeech ||
    settings.colorInversion ||
    settings.reducedMotion;

  const handleToggle = (key: keyof AccommodationSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-sm shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-blue-600 dark:text-blue-400">
                {category} Pre-Flight Check
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {sectionTitle}
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              {testTitle}
            </p>
          </div>

          {/* Time Badge */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-sm">
              <Clock className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
              <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                {formatMinutes(effectiveSeconds)}
              </span>
            </div>
            {settings.timeMultiplier !== 1.0 && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-1 font-semibold">
                {settings.timeMultiplier}x Extended Time
              </span>
            )}
          </div>
        </div>

        {/* Info Callout */}
        <div className="my-4 p-3 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-sm flex items-start gap-2.5">
          <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
            Configure testing accommodations for this session. Practice attempts can simulate approved testing accommodations or standard testing conditions.
          </p>
        </div>

        {/* Accommodations Options List */}
        <div className="space-y-3 my-5 max-h-85 overflow-y-auto pr-1">
          {availableAccommodations.map((descriptor: AccommodationDescriptor) => (
            <div
              key={descriptor.key}
              className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-sm bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="pr-4">
                <label
                  htmlFor={descriptor.key}
                  className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block cursor-pointer"
                >
                  {descriptor.label}
                </label>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-normal">
                  {descriptor.description}
                </p>
              </div>

              <div className="shrink-0">
                {descriptor.type === "boolean" ? (
                  <input
                    id={descriptor.key}
                    type="checkbox"
                    checked={Boolean(settings[descriptor.key])}
                    onChange={(e) => handleToggle(descriptor.key, e.target.checked)}
                    className="h-4 w-4 rounded-xs border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-0 cursor-pointer"
                  />
                ) : (
                  <select
                    id={descriptor.key}
                    value={settings.timeMultiplier}
                    onChange={(e) =>
                      handleToggle(
                        descriptor.key,
                        parseFloat(e.target.value) as 1.0 | 1.5 | 2.0
                      )
                    }
                    className="text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-sm px-2.5 py-1 text-neutral-900 dark:text-neutral-100 cursor-pointer focus:outline-none"
                  >
                    {descriptor.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mode Status Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                isAccommodated ? "text-amber-500" : "text-emerald-500"
              }`}
            />
            <span>
              {isAccommodated
                ? "Accommodated Simulation Active"
                : "Standard Exam Conditions"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onStartExam(settings)}
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-bold rounded-sm shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Begin Section</span>
          </button>
        </div>
      </div>
    </div>
  );
};