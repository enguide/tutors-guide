// hooks/useExamNavigationLock.ts
"use client";

import { useEffect, useRef } from "react";

interface UseExamNavigationLockOptions {
  enabled: boolean;
  onAttemptBack?: () => void;
}

export function useExamNavigationLock({
  enabled,
  onAttemptBack,
}: UseExamNavigationLockOptions) {
  const onAttemptBackRef = useRef(onAttemptBack);

  // Safely synchronize callback ref inside an effect, outside the render phase
  useEffect(() => {
    onAttemptBackRef.current = onAttemptBack;
  }, [onAttemptBack]);

  // 1. Trap Tab Close, Refresh, and External URL navigation
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Required for modern Chrome/Edge/Firefox/Safari
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]);

  // 2. Trap Browser Back / Forward Button (popstate)
  useEffect(() => {
    if (!enabled) return;

    // Push an anchor state so the first back click pops our anchor rather than leaving
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Re-push the current URL to prevent leaving the active section
      window.history.pushState(null, "", window.location.href);

      if (onAttemptBackRef.current) {
        onAttemptBackRef.current();
      } else {
        alert(
          "Browser navigation is disabled during testing. Use the in-exam navigation controls."
        );
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled]);
}