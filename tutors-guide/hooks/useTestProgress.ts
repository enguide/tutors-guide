// hooks/useTestProgress.ts
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { QuestionFrontmatter } from "@/types/content";
import { autosaveResponse, AutosavePayload } from "@/actions/autosave";
import { QuestionType } from "@prisma/client";
import { examLogger } from "@/lib/telemetry/examLogger";

export type SyncStatus = "synced" | "saving" | "offline" | "retrying";

export interface StudentAnswers {
  [questionId: string]: {
    selectedOptionId?: string;
    frqUserAnswer?: string;
    usedCalculator?: boolean;
    flagged?: boolean;
    eliminatedOptions?: string[];
    changedAnswer?: boolean;
    timeSpent?: number;
  };
}

export interface NavigationHistoryEntry {
  time: number; // Elapsed test seconds
  qIdx: number; // Question index (0-based)
}

interface StoredCache {
  answers?: StudentAnswers;
  secondsRemaining?: number;
  currentIndex?: number;
  navigationHistory?: NavigationHistoryEntry[];
  offlineQueue?: AutosavePayload[];
}

interface UseTestProgressProps {
  testId: string;
  sectionId: string;
  sectionOrder: number;
  timeLimitSeconds: number;
  questions: QuestionFrontmatter[];
  timeExtensionMultiplier?: number;
  isTimerRunning?: boolean;
  onTimeExpired?: () => void;
}

function readStoredSnapshot(key: string): StoredCache | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function useTestProgress({
  testId,
  sectionId,
  sectionOrder,
  timeLimitSeconds,
  questions,
  timeExtensionMultiplier = 1.0,
  isTimerRunning = true,
  onTimeExpired,
}: UseTestProgressProps) {
  const storageKey = `test_progress_${testId}_${sectionId}`;
  const totalAdjustedSeconds = Math.round(timeLimitSeconds * timeExtensionMultiplier);

  const [currentIndex, setCurrentIndexState] = useState<number>(() => {
    const cached = readStoredSnapshot(storageKey);
    return typeof cached?.currentIndex === "number" ? cached.currentIndex : 0;
  });

  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const cached = readStoredSnapshot(storageKey);
    return typeof cached?.secondsRemaining === "number"
      ? cached.secondsRemaining
      : totalAdjustedSeconds;
  });

  const [answers, setAnswers] = useState<StudentAnswers>(() => {
    const cached = readStoredSnapshot(storageKey);
    return cached?.answers ?? {};
  });

  const [navigationHistory, setNavigationHistory] = useState<NavigationHistoryEntry[]>(() => {
    const cached = readStoredSnapshot(storageKey);
    if (cached?.navigationHistory && Array.isArray(cached.navigationHistory)) {
      return cached.navigationHistory;
    }
    return [{ time: 0, qIdx: 0 }];
  });

  // Network Resilience State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => {
    if (typeof window !== "undefined" && !navigator.onLine) return "offline";
    return "synced";
  });

  const offlineQueueRef = useRef<AutosavePayload[]>(
    readStoredSnapshot(storageKey)?.offlineQueue || []
  );

  const [isCrossOutMode, setIsCrossOutMode] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState<boolean>(false);

  const timePerQuestionRef = useRef<{ [questionId: string]: number }>({});
  const autosaveTimeoutRef = useRef<{ [questionId: string]: NodeJS.Timeout }>({});
  const isFlushingRef = useRef<boolean>(false);

  const persistToLocalStorage = useCallback(
    (
      updatedAnswers: StudentAnswers,
      remainingTime: number,
      activeIdx: number,
      navHistory: NavigationHistoryEntry[]
    ) => {
      if (typeof window === "undefined" || !isTimerRunning) return;
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            answers: updatedAnswers,
            secondsRemaining: remainingTime,
            currentIndex: activeIdx,
            navigationHistory: navHistory,
            offlineQueue: offlineQueueRef.current,
            lastSavedAt: Date.now(),
          })
        );
      } catch (e) {
        console.error("Failed writing progress to localStorage:", e);
      }
    },
    [storageKey, isTimerRunning]
  );

  // Flush queued autosaves to Postgres with exponential retry
  const flushOfflineQueue = useCallback(async () => {
    if (isFlushingRef.current || offlineQueueRef.current.length === 0) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) return;

    isFlushingRef.current = true;
    setSyncStatus("retrying");
    examLogger.log("network", "Flushing offline autosave queue to server", {
      pendingCount: offlineQueueRef.current.length,
    });

    let retryDelay = 1000;
    while (offlineQueueRef.current.length > 0) {
      const payload = offlineQueueRef.current[0];
      try {
        const res = await autosaveResponse(payload);
        if (res.success) {
          offlineQueueRef.current.shift();
          retryDelay = 1000;
        } else {
          throw new Error("Server failed upsert");
        }
      } catch (err) {
        console.warn(`[Autosave Queue] Retry failed. Waiting ${retryDelay}ms...`, err);
        examLogger.log("network", `Retry queue flush failed. Delay: ${retryDelay}ms`, {
          queueSize: offlineQueueRef.current.length,
          error: String(err),
        });
        setSyncStatus("offline");
        await new Promise((res) => setTimeout(res, retryDelay));
        retryDelay = Math.min(retryDelay * 2, 10000);
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          break;
        }
      }
    }

    isFlushingRef.current = false;
    const isCleared = offlineQueueRef.current.length === 0;
    if (isCleared) {
      examLogger.log("autosave", "Flushed offline response queue successfully to server");
    }
    setSyncStatus(isCleared ? "synced" : "offline");
  }, []);

  // Listen to browser network connectivity events
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      examLogger.log("network", "Browser connection restored (online event)");
      setSyncStatus("retrying");
      flushOfflineQueue();
    };

    const handleOffline = () => {
      examLogger.log("network", "Browser connection dropped (offline event)");
      setSyncStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [flushOfflineQueue]);

  const clearLocalBuffer = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`timer_${testId}_${sectionId}`);
      localStorage.removeItem(`answers_${testId}_${sectionId}`);
      localStorage.removeItem(`seconds_remaining_${testId}_${sectionId}`);
    } catch (e) {
      console.error("Failed clearing local storage buffer:", e);
    }
  }, [storageKey, testId, sectionId]);

  const clearAllTestBuffers = useCallback((targetTestId: string) => {
    if (typeof window === "undefined") return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith(`test_progress_${targetTestId}`) ||
            key.startsWith(`timer_${targetTestId}`) ||
            key.startsWith(`answers_${targetTestId}`) ||
            key.startsWith(`seconds_remaining_${targetTestId}`))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.error("Failed clearing all test buffers:", e);
    }
  }, []);

  const resetTimeLimit = useCallback((newTotalSeconds: number) => {
    setSecondsRemaining(newTotalSeconds);
  }, []);

  const setCurrentIndex = useCallback(
    (updater: number | ((prev: number) => number)) => {
      setCurrentIndexState((prevIdx) => {
        const nextIdx = typeof updater === "function" ? updater(prevIdx) : updater;
        if (nextIdx !== prevIdx) {
          const leavingQ = questions[prevIdx];
          if (leavingQ) {
            const uncommitted = timePerQuestionRef.current[leavingQ.id] || 0;
            timePerQuestionRef.current[leavingQ.id] = 0;

            setAnswers((prevAnswers) => {
              const prevAns = prevAnswers[leavingQ.id] || {};
              const updated = {
                ...prevAnswers,
                [leavingQ.id]: {
                  ...prevAns,
                  timeSpent: (prevAns.timeSpent || 0) + uncommitted,
                },
              };
              return updated;
            });
          }

          const elapsed = totalAdjustedSeconds - secondsRemaining;
          const nextEntry: NavigationHistoryEntry = { time: elapsed, qIdx: nextIdx };

          setNavigationHistory((prevHistory) => {
            const lastEntry = prevHistory[prevHistory.length - 1];
            if (lastEntry && lastEntry.qIdx === nextIdx) return prevHistory;
            return [...prevHistory, nextEntry];
          });

          examLogger.log("navigation", `Navigated to question index ${nextIdx}`, {
            from: prevIdx,
            to: nextIdx,
            questionNumber: questions[nextIdx]?.questionNumber,
          });
        }
        return nextIdx;
      });
    },
    [questions, totalAdjustedSeconds, secondsRemaining]
  );

  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          examLogger.log("navigation", "Section timer expired");
          onTimeExpired?.();
          return 0;
        }
        const updated = prev - 1;
        const currentQ = questions[currentIndex];
        if (currentQ) {
          timePerQuestionRef.current[currentQ.id] =
            (timePerQuestionRef.current[currentQ.id] || 0) + 1;
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, currentIndex, questions, onTimeExpired]);

  useEffect(() => {
    if (isTimerRunning && secondsRemaining % 5 === 0) {
      persistToLocalStorage(answers, secondsRemaining, currentIndex, navigationHistory);
    }
  }, [isTimerRunning, secondsRemaining, answers, currentIndex, navigationHistory, persistToLocalStorage]);

  const scheduleAutosave = useCallback(
    (questionId: string, updatedAnswer: StudentAnswers[string], index: number) => {
      if (autosaveTimeoutRef.current[questionId]) {
        clearTimeout(autosaveTimeoutRef.current[questionId]);
      }

      const targetQuestion = questions[index];
      if (!targetQuestion) return;

      const payload: AutosavePayload = {
        testId,
        sectionId,
        questionId,
        sectionOrder,
        responseOrder: targetQuestion.questionNumber,
        responseType: targetQuestion.questionType as QuestionType,
        selectedOptionId: updatedAnswer.selectedOptionId,
        frqUserAnswer: updatedAnswer.frqUserAnswer,
        correctAnswerKey: targetQuestion.correctAnswer,
        timeSpentOnResponse: updatedAnswer.timeSpent || 0,
        usedCalculator: updatedAnswer.usedCalculator || false,
      };

      autosaveTimeoutRef.current[questionId] = setTimeout(async () => {
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          offlineQueueRef.current.push(payload);
          setSyncStatus("offline");
          examLogger.log("autosave", `Enqueued response while offline for question ${questionId}`);
          return;
        }

        setSyncStatus("saving");
        try {
          const res = await autosaveResponse(payload);
          if (!res.success) {
            offlineQueueRef.current.push(payload);
            setSyncStatus("retrying");
            examLogger.log("autosave", `Autosave rejected by server for ${questionId}. Enqueued retry.`);
            flushOfflineQueue();
          } else {
            setSyncStatus(offlineQueueRef.current.length > 0 ? "retrying" : "synced");
          }
        } catch (err) {
          offlineQueueRef.current.push(payload);
          setSyncStatus("offline");
          examLogger.log("autosave", `Autosave network error for ${questionId}. Enqueued retry.`, {
            error: String(err),
          });
        }
      }, 750);
    },
    [testId, sectionId, sectionOrder, questions, flushOfflineQueue]
  );

  const selectOption = useCallback(
    (optionId: string) => {
      const activeQuestion = questions[currentIndex];
      if (!activeQuestion) return;

      const qId = activeQuestion.id;

      setAnswers((prevAnswers) => {
        const currentAnswer = prevAnswers[qId] || {};

        let nextEliminated = currentAnswer.eliminatedOptions || [];
        if (nextEliminated.includes(optionId)) {
          nextEliminated = nextEliminated.filter((id) => id !== optionId);
        }

        const isDivergent =
          Boolean(currentAnswer.selectedOptionId) &&
          currentAnswer.selectedOptionId !== optionId;

        const currentSpent =
          (currentAnswer.timeSpent || 0) + (timePerQuestionRef.current[qId] || 0);
        timePerQuestionRef.current[qId] = 0;

        const nextAnswers: StudentAnswers = {
          ...prevAnswers,
          [qId]: {
            ...currentAnswer,
            selectedOptionId:
              currentAnswer.selectedOptionId === optionId ? undefined : optionId,
            eliminatedOptions: nextEliminated,
            changedAnswer: currentAnswer.changedAnswer || isDivergent,
            timeSpent: currentSpent,
          },
        };

        examLogger.log("interaction", `Selected option on question ${qId}`, {
          questionId: qId,
          optionId,
          changedAnswer: currentAnswer.changedAnswer || isDivergent,
        });

        persistToLocalStorage(nextAnswers, secondsRemaining, currentIndex, navigationHistory);
        scheduleAutosave(qId, nextAnswers[qId], currentIndex);

        return nextAnswers;
      });
    },
    [currentIndex, questions, secondsRemaining, navigationHistory, persistToLocalStorage, scheduleAutosave]
  );

  const setFrqAnswer = useCallback(
    (val: string) => {
      const activeQuestion = questions[currentIndex];
      if (!activeQuestion) return;

      const qId = activeQuestion.id;
      const currentAnswer = answers[qId] || {};
      const isDivergent =
        Boolean(currentAnswer.frqUserAnswer) && currentAnswer.frqUserAnswer !== val;

      const currentSpent =
        (currentAnswer.timeSpent || 0) + (timePerQuestionRef.current[qId] || 0);
      timePerQuestionRef.current[qId] = 0;

      const nextAnswers: StudentAnswers = {
        ...answers,
        [qId]: {
          ...currentAnswer,
          frqUserAnswer: val,
          changedAnswer: currentAnswer.changedAnswer || isDivergent,
          timeSpent: currentSpent,
        },
      };

      examLogger.log("interaction", `Set FRQ answer on question ${qId}`, {
        questionId: qId,
        length: val.length,
      });

      setAnswers(nextAnswers);
      persistToLocalStorage(nextAnswers, secondsRemaining, currentIndex, navigationHistory);
      scheduleAutosave(qId, nextAnswers[qId], currentIndex);
    },
    [currentIndex, questions, answers, secondsRemaining, navigationHistory, persistToLocalStorage, scheduleAutosave]
  );

  const toggleEliminateOption = useCallback(
    (optionId: string) => {
      const activeQuestion = questions[currentIndex];
      if (!activeQuestion) return;

      const qId = activeQuestion.id;
      const currentAnswer = answers[qId] || {};
      const list = new Set(currentAnswer.eliminatedOptions || []);

      let nextSelectedOptionId = currentAnswer.selectedOptionId;

      if (list.has(optionId)) {
        list.delete(optionId);
      } else {
        list.add(optionId);
        if (nextSelectedOptionId === optionId) {
          nextSelectedOptionId = undefined;
        }
      }

      const nextAnswers: StudentAnswers = {
        ...answers,
        [qId]: {
          ...currentAnswer,
          selectedOptionId: nextSelectedOptionId,
          eliminatedOptions: Array.from(list),
        },
      };

      examLogger.log("tool", `Toggled option strikeout for option ${optionId}`, {
        questionId: qId,
        optionId,
      });

      setAnswers(nextAnswers);
      persistToLocalStorage(nextAnswers, secondsRemaining, currentIndex, navigationHistory);
    },
    [currentIndex, questions, answers, secondsRemaining, navigationHistory, persistToLocalStorage]
  );

  const toggleFlag = useCallback(() => {
    const activeQuestion = questions[currentIndex];
    if (!activeQuestion) return;

    const qId = activeQuestion.id;
    const currentAnswer = answers[qId] || {};
    const nextFlagged = !currentAnswer.flagged;

    const nextAnswers: StudentAnswers = {
      ...answers,
      [qId]: {
        ...currentAnswer,
        flagged: nextFlagged,
      },
    };

    examLogger.log("interaction", `Toggled review flag for question ${qId}`, {
      questionId: qId,
      flagged: nextFlagged,
    });

    setAnswers(nextAnswers);
    persistToLocalStorage(nextAnswers, secondsRemaining, currentIndex, navigationHistory);
  }, [currentIndex, questions, answers, secondsRemaining, navigationHistory, persistToLocalStorage]);

  const toggleCalculator = useCallback(() => {
    setIsCalculatorOpen((prev) => {
      const next = !prev;
      examLogger.log("tool", `Toggled calculator visibility: ${next ? "opened" : "closed"}`);
      return next;
    });
  }, []);

  const markCalculatorUsed = useCallback(() => {
    const activeQuestion = questions[currentIndex];
    if (!activeQuestion) return;

    const qId = activeQuestion.id;
    setAnswers((prevAnswers) => {
      const currentAnswer = prevAnswers[qId] || {};
      if (currentAnswer.usedCalculator) return prevAnswers;

      const nextAnswers: StudentAnswers = {
        ...prevAnswers,
        [qId]: {
          ...currentAnswer,
          usedCalculator: true,
        },
      };

      examLogger.log("tool", `Calculator used on question ${qId}`, { questionId: qId });

      persistToLocalStorage(nextAnswers, secondsRemaining, currentIndex, navigationHistory);
      scheduleAutosave(qId, nextAnswers[qId], currentIndex);
      return nextAnswers;
    });
  }, [currentIndex, questions, secondsRemaining, navigationHistory, persistToLocalStorage, scheduleAutosave]);

  const getFinalizedAnswers = useCallback((): StudentAnswers => {
    const activeQ = questions[currentIndex];
    if (!activeQ) return answers;

    const uncommitted = timePerQuestionRef.current[activeQ.id] || 0;
    const prevAns = answers[activeQ.id] || {};
    return {
      ...answers,
      [activeQ.id]: {
        ...prevAns,
        timeSpent: (prevAns.timeSpent || 0) + uncommitted,
      },
    };
  }, [currentIndex, questions, answers]);

  const getFinalizedNavigationHistory = useCallback((): NavigationHistoryEntry[] => {
    const finalElapsed = Math.max(0, totalAdjustedSeconds - secondsRemaining);
    const lastEntry = navigationHistory[navigationHistory.length - 1];

    if (!lastEntry) {
      return [{ time: 0, qIdx: 0 }, { time: finalElapsed, qIdx: currentIndex }];
    }

    if (lastEntry.time === finalElapsed && lastEntry.qIdx === currentIndex) {
      return navigationHistory;
    }

    return [...navigationHistory, { time: finalElapsed, qIdx: currentIndex }];
  }, [totalAdjustedSeconds, secondsRemaining, navigationHistory, currentIndex]);

  return {
    activeQuestion: questions[currentIndex],
    currentIndex,
    setCurrentIndex,
    secondsRemaining,
    answers,
    navigationHistory,
    syncStatus,
    isCrossOutMode,
    setIsCrossOutMode,
    isCalculatorOpen,
    setIsCalculatorOpen,
    toggleCalculator,
    markCalculatorUsed,
    isFormulaSheetOpen,
    setIsFormulaSheetOpen,
    selectOption,
    setFrqAnswer,
    toggleEliminateOption,
    toggleFlag,
    getFinalizedAnswers,
    getFinalizedNavigationHistory,
    clearLocalBuffer,
    clearAllTestBuffers,
    resetTimeLimit,
  };
}