// app/tests/[category]/[testId]/break/BreakClient.tsx
"use client";

import React, { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { clearBreakCookieAction } from "@/actions/breakActions";
import { resolveExamTheme } from "@/components/exam/presentationRegistry";
import { BaseIntermissionScreen } from "@/components/exam/themes/base/BaseIntermissionScreen";

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
    router.replace(`/tests/${category.toLowerCase()}/${testId}`);
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

  // Resolve authentic break presentation based on exam category
  const theme = resolveExamTheme(category);
  const IntermissionComponent = theme.Intermission || BaseIntermissionScreen;

  return (
    <IntermissionComponent
      testId={testId}
      category={category}
      remainingSeconds={remaining}
      formattedTime={formatted}
      isMounted={isMounted}
      onResumeEarly={handleResume}
    />
  );
};