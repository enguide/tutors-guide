// hooks/useTestProgress.ts
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { QuestionFrontmatter } from "@/types/content";
import { autosaveResponse } from "@/actions/autosave";
import { QuestionType } from "@prisma/client";

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

  const [isCrossOutMode, setIsCrossOutMode] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState<boolean>(false);

  // Transient Telemetry Refs
  const timePerQuestionRef = useRef<{ [questionId: string]: number }>({});
  const autosaveTimeoutRef = useRef<{ [questionId: string]: NodeJS.Timeout }>({});

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
            lastSavedAt: Date.now(),
          })
        );
      } catch (e) {
        console.error("Failed writing progress to localStorage:", e);
      }
    },
    [storageKey, isTimerRunning]
  );

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
      persistToLocalStorage(
        answers,
        secondsRemaining,
        currentIndex,
        navigationHistory
      );
    }
  }, [isTimerRunning, secondsRemaining, answers, currentIndex, navigationHistory, persistToLocalStorage]);

  const scheduleAutosave = useCallback(
    (questionId: string, updatedAnswer: StudentAnswers[string], index: number) => {
      if (autosaveTimeoutRef.current[questionId]) {
        clearTimeout(autosaveTimeoutRef.current[questionId]);
      }

      const targetQuestion = questions[index];
      if (!targetQuestion) return;

      autosaveTimeoutRef.current[questionId] = setTimeout(async () => {
        await autosaveResponse({
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
        });
      }, 750);
    },
    [testId, sectionId, sectionOrder, questions]
  );

  // Replace selectOption in hooks/useTestProgress.ts
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

      persistToLocalStorage(
        nextAnswers,
        secondsRemaining,
        currentIndex,
        navigationHistory
      );
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
        Boolean(currentAnswer.frqUserAnswer) &&
        currentAnswer.frqUserAnswer !== val;

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

      setAnswers(nextAnswers);
      persistToLocalStorage(
        nextAnswers,
        secondsRemaining,
        currentIndex,
        navigationHistory
      );
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

      setAnswers(nextAnswers);
      persistToLocalStorage(
        nextAnswers,
        secondsRemaining,
        currentIndex,
        navigationHistory
      );
    },
    [currentIndex, questions, answers, secondsRemaining, navigationHistory, persistToLocalStorage]
  );

  const toggleFlag = useCallback(() => {
    const activeQuestion = questions[currentIndex];
    if (!activeQuestion) return;

    const qId = activeQuestion.id;
    const currentAnswer = answers[qId] || {};

    const nextAnswers: StudentAnswers = {
      ...answers,
      [qId]: {
        ...currentAnswer,
        flagged: !currentAnswer.flagged,
      },
    };

    setAnswers(nextAnswers);
    persistToLocalStorage(
      nextAnswers,
      secondsRemaining,
      currentIndex,
      navigationHistory
    );
  }, [currentIndex, questions, answers, secondsRemaining, navigationHistory, persistToLocalStorage]);

  // Open/Close toggle: Only toggles visibility, does not mark telemetry
  const toggleCalculator = useCallback(() => {
    setIsCalculatorOpen((prev) => !prev);
  }, []);

  // Meaningful Calculator Interaction Event Handler
  const markCalculatorUsed = useCallback(() => {
    const activeQuestion = questions[currentIndex];
    if (!activeQuestion) return;

    const qId = activeQuestion.id;
    setAnswers((prevAnswers) => {
      const currentAnswer = prevAnswers[qId] || {};
      // If already recorded for this question, prevent redundant state updates
      if (currentAnswer.usedCalculator) return prevAnswers;

      const nextAnswers: StudentAnswers = {
        ...prevAnswers,
        [qId]: {
          ...currentAnswer,
          usedCalculator: true,
        },
      };

      persistToLocalStorage(
        nextAnswers,
        secondsRemaining,
        currentIndex,
        navigationHistory
      );
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

    return [
      ...navigationHistory,
      { time: finalElapsed, qIdx: currentIndex },
    ];
  }, [totalAdjustedSeconds, secondsRemaining, navigationHistory, currentIndex]);

  return {
    activeQuestion: questions[currentIndex],
    currentIndex,
    setCurrentIndex,
    secondsRemaining,
    answers,
    navigationHistory,
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