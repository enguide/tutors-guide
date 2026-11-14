// hooks/useTestProgress.ts
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { QuestionFrontmatter } from "@/types/content";
import type { AutosavePayload, CheckpointPayload } from "@/app/api/exam/sync/route";
import { QuestionType } from "@prisma/client";
import { examLogger } from "@/lib/telemetry/examLogger";
import { calculateTimeSpentFromNavHistory } from "@/lib/telemetry/timeTracking";

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

export interface ServerCheckpointData {
  timeRemainingSeconds: number;
  lastQuestionIndex: number;
  navigationHistory: NavigationHistoryEntry[] | null;
  clientUpdatedAt: Date | string;
}

export interface ServerResponseRecord {
  questionId: string;
  selectedOptionId: string | null;
  frqUserAnswer: string | null;
  timeSpentOnResponse: number | null;
  usedCalculator: boolean;
  changedAnswer: boolean;
}

interface StoredCache {
  answers?: StudentAnswers;
  secondsRemaining?: number;
  currentIndex?: number;
  navigationHistory?: NavigationHistoryEntry[];
  offlineQueue?: AutosavePayload[];
  lastSavedAt?: number;
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
  serverCheckpoint?: ServerCheckpointData | null;
  serverResponses?: ServerResponseRecord[];
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

// Pure helper function for initial state reconciliation
function resolveInitialProgressState({
  storageKey,
  totalAdjustedSeconds,
  serverCheckpoint,
  serverResponses,
  questionsLength,
}: {
  storageKey: string;
  totalAdjustedSeconds: number;
  serverCheckpoint?: ServerCheckpointData | null;
  serverResponses: ServerResponseRecord[];
  questionsLength: number;
}) {
  const local = readStoredSnapshot(storageKey);
  const localTimestamp = local?.lastSavedAt || 0;

  const serverTimestamp = serverCheckpoint?.clientUpdatedAt
    ? new Date(serverCheckpoint.clientUpdatedAt).getTime()
    : 0;

  const serverAnswersMap: StudentAnswers = {};
  for (const r of serverResponses) {
    serverAnswersMap[r.questionId] = {
      selectedOptionId: r.selectedOptionId || undefined,
      frqUserAnswer: r.frqUserAnswer || undefined,
      usedCalculator: r.usedCalculator,
      changedAnswer: r.changedAnswer,
      timeSpent: r.timeSpentOnResponse || 0,
    };
  }

  // CASE A: Server Checkpoint exists and is NEWER than local storage, OR local is empty
  if (serverCheckpoint && (!local || serverTimestamp > localTimestamp)) {
    const mergedAnswers = {
      ...serverAnswersMap,
      ...(local?.answers || {}),
    };

    const resolved = {
      answers: mergedAnswers,
      secondsRemaining:
        typeof serverCheckpoint.timeRemainingSeconds === "number"
          ? serverCheckpoint.timeRemainingSeconds
          : totalAdjustedSeconds,
      currentIndex:
        typeof serverCheckpoint.lastQuestionIndex === "number"
          ? Math.min(serverCheckpoint.lastQuestionIndex, Math.max(0, questionsLength - 1))
          : 0,
      navigationHistory:
        Array.isArray(serverCheckpoint.navigationHistory) &&
        serverCheckpoint.navigationHistory.length > 0
          ? serverCheckpoint.navigationHistory
          : [{ time: 0, qIdx: 0 }],
      offlineQueue: local?.offlineQueue || [],
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            ...resolved,
            lastSavedAt: serverTimestamp,
          })
        );
      } catch {}
    }

    return resolved;
  }

  // CASE B: Local storage is newer or only source
  if (local) {
    const mergedAnswers = {
      ...serverAnswersMap,
      ...(local.answers || {}),
    };

    return {
      answers: mergedAnswers,
      secondsRemaining:
        typeof local.secondsRemaining === "number"
          ? local.secondsRemaining
          : totalAdjustedSeconds,
      currentIndex:
        typeof local.currentIndex === "number"
          ? Math.min(local.currentIndex, Math.max(0, questionsLength - 1))
          : 0,
      navigationHistory:
        Array.isArray(local.navigationHistory) && local.navigationHistory.length > 0
          ? local.navigationHistory
          : [{ time: 0, qIdx: 0 }],
      offlineQueue: local.offlineQueue || [],
    };
  }

  // CASE C: Brand-new fresh start
  return {
    answers: serverAnswersMap,
    secondsRemaining: totalAdjustedSeconds,
    currentIndex: 0,
    navigationHistory: [{ time: 0, qIdx: 0 }],
    offlineQueue: [] as AutosavePayload[],
  };
}

async function postExamSync(body: {
  response?: AutosavePayload;
  checkpoint?: CheckpointPayload;
}): Promise<boolean> {
  const res = await fetch("/api/exam/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  });
  if (!res.ok) {
    // 409 means section was already finalized; treat as terminal so queue doesn't spin
    if (res.status === 409) return true;
    return false;
  }
  const data = await res.json();
  return Boolean(data?.success);
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
  serverCheckpoint,
  serverResponses = [],
}: UseTestProgressProps) {
  const storageKey = `test_progress_${testId}_${sectionId}`;
  const totalAdjustedSeconds = Math.round(timeLimitSeconds * timeExtensionMultiplier);

  // Lazy state initializers execute once on mount without touching refs during render
  const [initialState] = useState(() =>
    resolveInitialProgressState({
      storageKey,
      totalAdjustedSeconds,
      serverCheckpoint,
      serverResponses,
      questionsLength: questions.length,
    })
  );

  const [currentIndex, setCurrentIndexState] = useState<number>(initialState.currentIndex);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialState.secondsRemaining);
  const [answers, setAnswers] = useState<StudentAnswers>(initialState.answers);
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistoryEntry[]>(
    initialState.navigationHistory
  );

  // Network Resilience State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => {
    if (typeof window !== "undefined" && !navigator.onLine) return "offline";
    return "synced";
  });

  const offlineQueueRef = useRef<AutosavePayload[]>(initialState.offlineQueue);
  const pendingCheckpointRef = useRef<CheckpointPayload | null>(null);

  const [isCrossOutMode, setIsCrossOutMode] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState<boolean>(false);

  const autosaveTimeoutRef = useRef<{ [questionId: string]: ReturnType<typeof setTimeout> }>({});
  const checkpointTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFlushingRef = useRef<boolean>(false);

  // Wall-clock deadline anchor so main-thread spikes never stall or drift the clock
  const endTimeRef = useRef<number | null>(null);
  const hasExpiredRef = useRef<boolean>(false);

  // Keep latest volatile values in a ref so callbacks stay referentially stable across ticks
  const latestRef = useRef({
    answers,
    secondsRemaining,
    currentIndex,
    navigationHistory,
    questions,
    totalAdjustedSeconds,
    isTimerRunning,
    onTimeExpired,
  });

  useEffect(() => {
    latestRef.current = {
      answers,
      secondsRemaining,
      currentIndex,
      navigationHistory,
      questions,
      totalAdjustedSeconds,
      isTimerRunning,
      onTimeExpired,
    };
  });

  // Persist to localStorage outside of state updaters whenever answers, index, or history change
  useEffect(() => {
    if (typeof window === "undefined" || !isTimerRunning) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          answers,
          secondsRemaining: latestRef.current.secondsRemaining,
          currentIndex,
          navigationHistory,
          offlineQueue: offlineQueueRef.current,
          lastSavedAt: Date.now(),
        })
      );
    } catch (e) {
      console.error("Failed writing progress to localStorage:", e);
    }
  }, [storageKey, isTimerRunning, answers, currentIndex, navigationHistory]);

  // Periodic LocalStorage snapshot every 10 seconds
  useEffect(() => {
    if (!isTimerRunning || secondsRemaining % 10 !== 0) return;
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          answers: latestRef.current.answers,
          secondsRemaining,
          currentIndex: latestRef.current.currentIndex,
          navigationHistory: latestRef.current.navigationHistory,
          offlineQueue: offlineQueueRef.current,
          lastSavedAt: Date.now(),
        })
      );
    } catch {}
  }, [storageKey, isTimerRunning, secondsRemaining]);

  // Dispatch background section checkpoint upsert via non-blocking route handler
  const triggerCheckpointSync = useCallback(
    (remainingTime: number, activeIdx: number, navHistory: NavigationHistoryEntry[]) => {
      pendingCheckpointRef.current = {
        testId,
        sectionId,
        timeRemainingSeconds: remainingTime,
        lastQuestionIndex: activeIdx,
        navigationHistory: navHistory,
        clientUpdatedAt: Date.now(),
      };

      if (checkpointTimeoutRef.current) {
        clearTimeout(checkpointTimeoutRef.current);
      }

      checkpointTimeoutRef.current = setTimeout(async () => {
        if (typeof navigator !== "undefined" && !navigator.onLine) return;
        const checkpoint = pendingCheckpointRef.current;
        if (!checkpoint) return;
        pendingCheckpointRef.current = null;

        try {
          await postExamSync({ checkpoint });
        } catch (err) {
          console.warn("[Checkpoint] Background sync deferred:", err);
        }
      }, 1500);
    },
    [testId, sectionId]
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
        const ok = await postExamSync({ response: payload });
        if (ok) {
          offlineQueueRef.current.shift();
          retryDelay = 1000;
        } else {
          throw new Error("Server failed upsert");
        }
      } catch (err) {
        console.warn(`[Autosave Queue] Retry failed. Waiting ${retryDelay}ms...`, err);
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
    setSyncStatus(isCleared ? "synced" : "offline");
  }, []);

  // Listen to browser network connectivity events (stable listener—never torn down on ticks)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      examLogger.log("network", "Browser connection restored (online event)");
      setSyncStatus("retrying");
      flushOfflineQueue();
      const { secondsRemaining: rem, currentIndex: idx, navigationHistory: hist } =
        latestRef.current;
      triggerCheckpointSync(rem, idx, hist);
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
  }, [flushOfflineQueue, triggerCheckpointSync]);

  // Clean up pending debounce timers on unmount
  useEffect(() => {
    const autosaveTimers = autosaveTimeoutRef.current;
    return () => {
      Object.values(autosaveTimers).forEach((t) => clearTimeout(t));
      if (checkpointTimeoutRef.current) {
        clearTimeout(checkpointTimeoutRef.current);
      }
    };
  }, []);

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
    hasExpiredRef.current = false;
    endTimeRef.current = Date.now() + newTotalSeconds * 1000;
    setSecondsRemaining(newTotalSeconds);
  }, []);

  const setCurrentIndex = useCallback(
    (updater: number | ((prev: number) => number)) => {
      setCurrentIndexState((prevIdx) => {
        const nextIdx = typeof updater === "function" ? updater(prevIdx) : updater;
        if (nextIdx !== prevIdx) {
          const {
            totalAdjustedSeconds: totalSec,
            secondsRemaining: remSec,
          } = latestRef.current;
          const elapsed = Math.max(0, totalSec - remSec);
          const nextEntry: NavigationHistoryEntry = { time: elapsed, qIdx: nextIdx };

          setNavigationHistory((prevHistory) => {
            const lastEntry = prevHistory[prevHistory.length - 1];
            const updatedHistory =
              lastEntry && lastEntry.qIdx === nextIdx
                ? prevHistory
                : [...prevHistory, nextEntry];

            triggerCheckpointSync(remSec, nextIdx, updatedHistory);
            return updatedHistory;
          });
        }
        return nextIdx;
      });
    },
    [triggerCheckpointSync]
  );

  // Wall-clock anchored countdown timer (250ms poll prevents drift or visual freezing)
  useEffect(() => {
    if (!isTimerRunning) {
      endTimeRef.current = null;
      return;
    }

    if (endTimeRef.current === null) {
      endTimeRef.current = Date.now() + latestRef.current.secondsRemaining * 1000;
    }

    const tick = () => {
      if (endTimeRef.current === null) return;
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));

      setSecondsRemaining((prev) => {
        if (prev === remaining) return prev;
        return remaining;
      });

      if (remaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        examLogger.log("navigation", "Section timer expired");
        latestRef.current.onTimeExpired?.();
      }
    };

    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Periodic server checkpoint heartbeat every 10 seconds
  useEffect(() => {
    if (!isTimerRunning || secondsRemaining <= 0 || secondsRemaining % 10 !== 0) return;
    const { currentIndex: idx, navigationHistory: hist } = latestRef.current;
    triggerCheckpointSync(secondsRemaining, idx, hist);
  }, [isTimerRunning, secondsRemaining, triggerCheckpointSync]);

  const scheduleAutosave = useCallback(
    (
      questionId: string,
      updatedAnswer: StudentAnswers[string],
      index: number,
      currentNavHistory: NavigationHistoryEntry[],
      currentSecondsRemaining: number
    ) => {
      if (autosaveTimeoutRef.current[questionId]) {
        clearTimeout(autosaveTimeoutRef.current[questionId]);
      }

      const currentQuestions = latestRef.current.questions;
      const currentTotalSec = latestRef.current.totalAdjustedSeconds;
      const targetQuestion = currentQuestions[index];
      if (!targetQuestion) return;

      const elapsed = Math.max(0, currentTotalSec - currentSecondsRemaining);
      const dwellTimes = calculateTimeSpentFromNavHistory(
        currentNavHistory,
        elapsed,
        currentQuestions.length
      );
      const calculatedTimeSpent = dwellTimes[index] ?? 0;

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
        timeSpentOnResponse: calculatedTimeSpent,
        usedCalculator: updatedAnswer.usedCalculator || false,
      };

      autosaveTimeoutRef.current[questionId] = setTimeout(async () => {
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          offlineQueueRef.current.push(payload);
          setSyncStatus("offline");
          return;
        }

        // Coalesce any pending checkpoint sync into the same single network request
        if (checkpointTimeoutRef.current) {
          clearTimeout(checkpointTimeoutRef.current);
          checkpointTimeoutRef.current = null;
        }
        const coalescedCheckpoint: CheckpointPayload = {
          testId,
          sectionId,
          timeRemainingSeconds: latestRef.current.secondsRemaining,
          lastQuestionIndex: latestRef.current.currentIndex,
          navigationHistory: latestRef.current.navigationHistory,
          clientUpdatedAt: Date.now(),
        };
        pendingCheckpointRef.current = null;

        setSyncStatus("saving");
        try {
          const ok = await postExamSync({
            response: payload,
            checkpoint: coalescedCheckpoint,
          });
          if (!ok) {
            offlineQueueRef.current.push(payload);
            setSyncStatus("retrying");
            flushOfflineQueue();
          } else {
            setSyncStatus(offlineQueueRef.current.length > 0 ? "retrying" : "synced");
          }
        } catch {
          offlineQueueRef.current.push(payload);
          setSyncStatus("offline");
        }
      }, 600);
    },
    [testId, sectionId, sectionOrder, flushOfflineQueue]
  );

  // Referentially stable option selection handler (does NOT recreate on timer ticks)
  const selectOption = useCallback(
    (optionId: string) => {
      const {
        currentIndex: idx,
        questions: qs,
        secondsRemaining: remSec,
        navigationHistory: navHist,
      } = latestRef.current;

      const activeQuestion = qs[idx];
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

        const updatedQuestionAnswer: StudentAnswers[string] = {
          ...currentAnswer,
          selectedOptionId:
            currentAnswer.selectedOptionId === optionId ? undefined : optionId,
          eliminatedOptions: nextEliminated,
          changedAnswer: currentAnswer.changedAnswer || isDivergent,
        };

        scheduleAutosave(qId, updatedQuestionAnswer, idx, navHist, remSec);

        return {
          ...prevAnswers,
          [qId]: updatedQuestionAnswer,
        };
      });
    },
    [scheduleAutosave]
  );

  const setFrqAnswer = useCallback(
    (val: string) => {
      const {
        currentIndex: idx,
        questions: qs,
        secondsRemaining: remSec,
        navigationHistory: navHist,
      } = latestRef.current;

      const activeQuestion = qs[idx];
      if (!activeQuestion) return;

      const qId = activeQuestion.id;

      setAnswers((prevAnswers) => {
        const currentAnswer = prevAnswers[qId] || {};
        const isDivergent =
          Boolean(currentAnswer.frqUserAnswer) && currentAnswer.frqUserAnswer !== val;

        const updatedQuestionAnswer: StudentAnswers[string] = {
          ...currentAnswer,
          frqUserAnswer: val,
          changedAnswer: currentAnswer.changedAnswer || isDivergent,
        };

        scheduleAutosave(qId, updatedQuestionAnswer, idx, navHist, remSec);

        return {
          ...prevAnswers,
          [qId]: updatedQuestionAnswer,
        };
      });
    },
    [scheduleAutosave]
  );

  const toggleEliminateOption = useCallback((optionId: string) => {
    const { currentIndex: idx, questions: qs } = latestRef.current;
    const activeQuestion = qs[idx];
    if (!activeQuestion) return;

    const qId = activeQuestion.id;

    setAnswers((prevAnswers) => {
      const currentAnswer = prevAnswers[qId] || {};
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

      return {
        ...prevAnswers,
        [qId]: {
          ...currentAnswer,
          selectedOptionId: nextSelectedOptionId,
          eliminatedOptions: Array.from(list),
        },
      };
    });
  }, []);

  const toggleFlag = useCallback(() => {
    const { currentIndex: idx, questions: qs } = latestRef.current;
    const activeQuestion = qs[idx];
    if (!activeQuestion) return;

    const qId = activeQuestion.id;

    setAnswers((prevAnswers) => {
      const currentAnswer = prevAnswers[qId] || {};
      return {
        ...prevAnswers,
        [qId]: {
          ...currentAnswer,
          flagged: !currentAnswer.flagged,
        },
      };
    });
  }, []);

  const toggleCalculator = useCallback(() => {
    setIsCalculatorOpen((prev) => !prev);
  }, []);

  const markCalculatorUsed = useCallback(() => {
    const {
      currentIndex: idx,
      questions: qs,
      secondsRemaining: remSec,
      navigationHistory: navHist,
    } = latestRef.current;

    const activeQuestion = qs[idx];
    if (!activeQuestion) return;

    const qId = activeQuestion.id;

    setAnswers((prevAnswers) => {
      const currentAnswer = prevAnswers[qId] || {};
      if (currentAnswer.usedCalculator) return prevAnswers;

      const updatedQuestionAnswer: StudentAnswers[string] = {
        ...currentAnswer,
        usedCalculator: true,
      };

      scheduleAutosave(qId, updatedQuestionAnswer, idx, navHist, remSec);

      return {
        ...prevAnswers,
        [qId]: updatedQuestionAnswer,
      };
    });
  }, [scheduleAutosave]);

  const getFinalizedNavigationHistory = useCallback((): NavigationHistoryEntry[] => {
    const {
      totalAdjustedSeconds: totalSec,
      secondsRemaining: remSec,
      navigationHistory: navHist,
      currentIndex: idx,
    } = latestRef.current;

    const finalElapsed = Math.max(0, totalSec - remSec);
    const lastEntry = navHist[navHist.length - 1];

    if (!lastEntry) {
      return [{ time: 0, qIdx: 0 }, { time: finalElapsed, qIdx: idx }];
    }

    if (lastEntry.time === finalElapsed && lastEntry.qIdx === idx) {
      return navHist;
    }

    return [...navHist, { time: finalElapsed, qIdx: idx }];
  }, []);

  const getFinalizedAnswers = useCallback((): StudentAnswers => {
    const {
      totalAdjustedSeconds: totalSec,
      secondsRemaining: remSec,
      questions: qs,
      answers: currentAnswers,
    } = latestRef.current;

    const finalElapsed = Math.max(0, totalSec - remSec);
    const finalNavHistory = getFinalizedNavigationHistory();
    const calculatedDwellTimes = calculateTimeSpentFromNavHistory(
      finalNavHistory,
      finalElapsed,
      qs.length
    );

    const finalizedAnswers: StudentAnswers = { ...currentAnswers };
    qs.forEach((q, idx) => {
      const existing = finalizedAnswers[q.id] || {};
      finalizedAnswers[q.id] = {
        ...existing,
        timeSpent: calculatedDwellTimes[idx] ?? 0,
      };
    });

    return finalizedAnswers;
  }, [getFinalizedNavigationHistory]);

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