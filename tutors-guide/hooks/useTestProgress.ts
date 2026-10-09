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
      if (typeof window === "undefined") return;
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
    [storageKey]
  );

  // Flushes pending ticking seconds for a given question index into the answers state
  const flushQuestionTime = useCallback(
    (idx: number): StudentAnswers => {
      const q = questions[idx];
      if (!q) return answers;

      const uncommitted = timePerQuestionRef.current[q.id] || 0;
      if (uncommitted === 0) return answers;

      timePerQuestionRef.current[q.id] = 0;
      const prevAns = answers[q.id] || {};
      const updatedAns: StudentAnswers = {
        ...answers,
        [q.id]: {
          ...prevAns,
          timeSpent: (prevAns.timeSpent || 0) + uncommitted,
        },
      };

      setAnswers(updatedAns);
      return updatedAns;
    },
    [questions, answers]
  );

  // Step Dispatcher: Flushes leaving question time, logs navigation event
  const setCurrentIndex = useCallback(
    (updater: number | ((prev: number) => number)) => {
      setCurrentIndexState((prevIdx) => {
        const nextIdx = typeof updater === "function" ? updater(prevIdx) : updater;
        if (nextIdx !== prevIdx) {
          // 1. Commit time spent on previous question
          const leavingQ = questions[prevIdx];
          let updatedAnswers = answers;
          if (leavingQ) {
            const uncommitted = timePerQuestionRef.current[leavingQ.id] || 0;
            timePerQuestionRef.current[leavingQ.id] = 0;
            const prevAns = answers[leavingQ.id] || {};
            updatedAnswers = {
              ...answers,
              [leavingQ.id]: {
                ...prevAns,
                timeSpent: (prevAns.timeSpent || 0) + uncommitted,
              },
            };
            setAnswers(updatedAnswers);
          }

          // 2. Append navigation event
          const elapsed = totalAdjustedSeconds - secondsRemaining;
          const nextEntry: NavigationHistoryEntry = { time: elapsed, qIdx: nextIdx };

          setNavigationHistory((prevHistory) => {
            const updatedHistory = [...prevHistory, nextEntry];
            persistToLocalStorage(
              updatedAnswers,
              secondsRemaining,
              nextIdx,
              updatedHistory
            );
            return updatedHistory;
          });
        }
        return nextIdx;
      });
    },
    [questions, answers, totalAdjustedSeconds, secondsRemaining, persistToLocalStorage]
  );

  // 1-second interval timer
  useEffect(() => {
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
  }, [currentIndex, questions, onTimeExpired]);

  // Periodic backup of time counter
  useEffect(() => {
    if (secondsRemaining % 5 === 0) {
      persistToLocalStorage(
        answers,
        secondsRemaining,
        currentIndex,
        navigationHistory
      );
    }
  }, [secondsRemaining, answers, currentIndex, navigationHistory, persistToLocalStorage]);

  // Debounced Server Autosave with absolute time
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

  const selectOption = useCallback(
    (optionId: string) => {
      const activeQuestion = questions[currentIndex];
      if (!activeQuestion) return;

      const qId = activeQuestion.id;
      const currentAnswer = answers[qId] || {};

      if (currentAnswer.eliminatedOptions?.includes(optionId)) return;

      const isDivergent =
        Boolean(currentAnswer.selectedOptionId) &&
        currentAnswer.selectedOptionId !== optionId;

      // Accumulate ticking seconds
      const currentSpent =
        (currentAnswer.timeSpent || 0) + (timePerQuestionRef.current[qId] || 0);
      timePerQuestionRef.current[qId] = 0;

      const nextAnswers: StudentAnswers = {
        ...answers,
        [qId]: {
          ...currentAnswer,
          selectedOptionId:
            currentAnswer.selectedOptionId === optionId ? undefined : optionId,
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

  const toggleCalculator = useCallback(() => {
    setIsCalculatorOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        const activeQuestion = questions[currentIndex];
        if (activeQuestion) {
          const qId = activeQuestion.id;
          const currentAnswer = answers[qId] || {};
          const nextAnswers = {
            ...answers,
            [qId]: { ...currentAnswer, usedCalculator: true },
          };
          setAnswers(nextAnswers);
          scheduleAutosave(qId, nextAnswers[qId], currentIndex);
        }
      }
      return nextState;
    });
  }, [currentIndex, questions, answers, scheduleAutosave]);

  // Exposed helper so ExamClient can finalize all accumulated seconds before submit
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
    isFormulaSheetOpen,
    setIsFormulaSheetOpen,
    selectOption,
    setFrqAnswer,
    toggleEliminateOption,
    toggleFlag,
    getFinalizedAnswers,
    clearLocalBuffer: () => localStorage.removeItem(storageKey),
  };
}