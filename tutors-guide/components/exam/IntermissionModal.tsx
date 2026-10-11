// components/exam/IntermissionModal.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { Coffee, Play, Clock } from "lucide-react";

interface IntermissionModalProps {
  testId: string;
  durationSeconds: number;
  onContinue: () => void;
}

export const IntermissionModal: React.FC<IntermissionModalProps> = ({
  testId,
  durationSeconds,
  onContinue,
}) => {
  const storageKey = `intermission_end_${testId}`;
  const [remaining, setRemaining] = useState<number>(() => {
    if (typeof window === "undefined") return durationSeconds;
    const storedEnd = localStorage.getItem(storageKey);
    if (storedEnd) {
      const diff = Math.max(0, Math.floor((parseInt(storedEnd, 10) - Date.now()) / 1000));
      return diff;
    }
    const end = Date.now() + durationSeconds * 1000;
    localStorage.setItem(storageKey, end.toString());
    return durationSeconds;
  });

  const onContinueRef = useRef(onContinue);

  useEffect(() => {
    onContinueRef.current = onContinue;
  }, [onContinue]);

  useEffect(() => {
    const timer = setInterval(() => {
      const storedEnd = localStorage.getItem(storageKey);
      if (storedEnd) {
        const diff = Math.max(0, Math.floor((parseInt(storedEnd, 10) - Date.now()) / 1000));
        setRemaining(diff);
        if (diff <= 0) {
          clearInterval(timer);
          localStorage.removeItem(storageKey);
          onContinueRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [storageKey]);

  const handleResumeEarly = () => {
    localStorage.removeItem(storageKey);
    onContinue();
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl p-8 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6">
          <Coffee className="h-8 w-8 text-neutral-800 dark:text-neutral-200" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">
          Scheduled Intermission
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-sm">
          Take a moment to step away. Your remaining test time is paused. You may resume when you are ready.
        </p>

        <div className="flex items-center gap-3 px-6 py-3 rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 mb-8">
          <Clock className="h-5 w-5 text-neutral-500" />
          <span className="font-mono text-3xl font-semibold tracking-wider text-neutral-900 dark:text-neutral-100">
            {formatted}
          </span>
        </div>

        <button
          type="button"
          onClick={handleResumeEarly}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-[4px] bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 font-medium transition-colors"
        >
          <Play className="h-4 w-4 fill-current" />
          Resume Exam Early
        </button>
      </div>
    </div>
  );
};