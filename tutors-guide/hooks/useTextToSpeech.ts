// hooks/useTextToSpeech.ts
"use client";

import { useState, useRef, useCallback, useSyncExternalStore } from "react";

// Safe subscription for external client-only browser feature detection
const emptySubscribe = () => () => {};
const checkSpeechSupport = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Subscribes cleanly to client-side window capability without useEffect setState
  const isSupported = useSyncExternalStore(
    emptySubscribe,
    checkSpeechSupport,
    () => false // SSR snapshot
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  const speak = useCallback(
    (rawMarkdownText: string) => {
      if (!isSupported) return;

      stop();

      const plainText = rawMarkdownText
        .replace(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g, " mathematical expression ")
        .replace(/[#*_`~>-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (!plainText) return;

      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, stop]
  );

  return {
    speak,
    stop,
    isPlaying,
    isSupported,
  };
}