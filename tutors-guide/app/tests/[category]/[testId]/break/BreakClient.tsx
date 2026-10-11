// app/tests/[category]/[testId]/break/BreakClient.tsx
"use client";

import React, { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Play, Clock } from "lucide-react";
import { clearBreakCookieAction } from "@/actions/breakActions";

export interface BreakClientProps {
  testId: string;
  category: string;
  targetEndTime: number;
}

const emptySubscribe = () => () => {};

export const BreakClient: React.FC<BreakClientProps> = ({
  testId,
  category,
  targetEndTime,
}) => {
  const router = useRouter();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [remaining, setRemaining] = useState<number>(() => {
    return Math.max(0, Math.floor((targetEndTime - Date.now()) / 1000));
  });

  const handleResume = useCallback(async () => {
    await clearBreakCookieAction(testId);
    router.replace(`/tests/${category}/${testId}`);
  }, [category, testId, router]);

  useEffect(() => {
    if (Date.now() >= targetEndTime) {
      handleResume();
      return;
    }

    const timer = setInterval(() => {
      const diff = Math.max(0, Math.floor((targetEndTime - Date.now()) / 1000));
      setRemaining(diff);

      if (diff <= 0) {
        clearInterval(timer);
        handleResume();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetEndTime, handleResume]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl p-8 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6">
          <Coffee className="h-8 w-8 text-neutral-800 dark:text-neutral-200" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">
          Scheduled Intermission
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-sm">
          Take a moment to step away. Your test timer is paused. You may resume whenever you are ready.
        </p>

        <div className="flex items-center gap-3 px-6 py-3 rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 mb-8">
          <Clock className="h-5 w-5 text-neutral-500" />
          <span
            suppressHydrationWarning
            className="font-mono text-3xl font-semibold tracking-wider text-neutral-900 dark:text-neutral-100"
          >
            {isMounted ? formatted : "--:--"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleResume}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-[4px] bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 font-medium transition-colors"
        >
          <Play className="h-4 w-4 fill-current" />
          Resume Exam Early
        </button>
      </div>
    </div>
  );
};