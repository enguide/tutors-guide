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
  };
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

  // Helper to read initial cache without triggering cascading setState in effects
  const getInitialCache = () => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem(storageKey);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  // 1. Initialize state lazily from localStorage
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const cached = getInitialCache();
    return typeof cached?.currentIndex === "number" ? cached.currentIndex : 0;
  });

  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const cached = getInitialCache();
    return typeof cached?.secondsRemaining === "number"
      ? cached.secondsRemaining
      : totalAdjustedSeconds;
  });

  const [answers, setAnswers] = useState<StudentAnswers>(() => {
    const cached = getInitialCache();
    return cached?.answers || {};
  });

  const [isCrossOutMode, setIsCrossOutMode] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState<boolean>(false);

  // Time spent per question tracker
  const timePerQuestionRef = useRef<{ [questionId: string]: number }>({});
  const autosaveTimeoutRef = useRef<{ [questionId: string]: NodeJS.Timeout }>({});

  // 2. LocalStorage synchronous snapshot buffer
  const persistToLocalStorage = useCallback(
    (updatedAnswers: StudentAnswers, remainingTime: number, activeIdx: number) => {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            answers: updatedAnswers,
            secondsRemaining: remainingTime,
            currentIndex: activeIdx,
            lastSavedAt: Date.now(),
          })
        );
      } catch (e) {
        console.error("Failed writing progress to localStorage:", e);
      }
    },
    [storageKey]
  );

  // 3. Countdown timer interval
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

  // Periodically buffer remaining time to storage every 5 seconds
  useEffect(() => {
    if (secondsRemaining % 5 === 0) {
      persistToLocalStorage(answers, secondsRemaining, currentIndex);
    }
  }, [secondsRemaining, answers, currentIndex, persistToLocalStorage]);

  // 4. Debounced Server Autosave Dispatch
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
          timeSpentOnResponse: timePerQuestionRef.current[questionId] || 0,
          usedCalculator: updatedAnswer.usedCalculator || false,
        });
        timePerQuestionRef.current[questionId] = 0;
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

      if (currentAnswer.eliminatedOptions?.includes(optionId)) {
        return;
      }

      const nextAnswers: StudentAnswers = {
        ...answers,
        [qId]: {
          ...currentAnswer,
          selectedOptionId:
            currentAnswer.selectedOptionId === optionId ? undefined : optionId,
        },
      };

      setAnswers(nextAnswers);
      persistToLocalStorage(nextAnswers, secondsRemaining, currentIndex);
      scheduleAutosave(qId, nextAnswers[qId], currentIndex);
    },
    [currentIndex, questions, answers, secondsRemaining, persistToLocalStorage, scheduleAutosave]
  );

  const setFrqAnswer = useCallback(
    (val: string) => {
      const activeQuestion = questions[currentIndex];
      if (!activeQuestion) return;

      const qId = activeQuestion.id;
      const nextAnswers: StudentAnswers = {
        ...answers,
        [qId]: {
          ...(answers[qId] || {}),
          frqUserAnswer: val,
        },
      };

      setAnswers(nextAnswers);
      persistToLocalStorage(nextAnswers, secondsRemaining, currentIndex);
      scheduleAutosave(qId, nextAnswers[qId], currentIndex);
    },
    [currentIndex, questions, answers, secondsRemaining, persistToLocalStorage, scheduleAutosave]
  );

  const toggleEliminateOption = useCallback(
    (optionId: string) => {
      const activeQuestion = questions[currentIndex];
      if (!activeQuestion) return;

      const qId = activeQuestion.id;
      const current = answers[qId] || {};
      const list = new Set(current.eliminatedOptions || []);

      let nextSelectedOptionId = current.selectedOptionId;

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
          ...current,
          selectedOptionId: nextSelectedOptionId,
          eliminatedOptions: Array.from(list),
        },
      };

      setAnswers(nextAnswers);
      persistToLocalStorage(nextAnswers, secondsRemaining, currentIndex);
    },
    [currentIndex, questions, answers, secondsRemaining, persistToLocalStorage]
  );

  const toggleFlag = useCallback(() => {
    const activeQuestion = questions[currentIndex];
    if (!activeQuestion) return;

    const qId = activeQuestion.id;
    const current = answers[qId] || {};

    const nextAnswers: StudentAnswers = {
      ...answers,
      [qId]: {
        ...current,
        flagged: !current.flagged,
      },
    };

    setAnswers(nextAnswers);
    persistToLocalStorage(nextAnswers, secondsRemaining, currentIndex);
  }, [currentIndex, questions, answers, secondsRemaining, persistToLocalStorage]);

  const toggleCalculator = useCallback(() => {
    setIsCalculatorOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        const activeQuestion = questions[currentIndex];
        if (activeQuestion) {
          const qId = activeQuestion.id;
          const current = answers[qId] || {};
          const nextAnswers = {
            ...answers,
            [qId]: { ...current, usedCalculator: true },
          };
          setAnswers(nextAnswers);
          scheduleAutosave(qId, nextAnswers[qId], currentIndex);
        }
      }
      return nextState;
    });
  }, [currentIndex, questions, answers, scheduleAutosave]);

  return {
    activeQuestion: questions[currentIndex],
    currentIndex,
    setCurrentIndex,
    secondsRemaining,
    answers,
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
    clearLocalBuffer: () => localStorage.removeItem(storageKey),
  };
}