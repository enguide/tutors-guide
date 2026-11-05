// components/exam/themes/act/ACTReviewModalAdapter.tsx
"use client";

import React from "react";
import { ReviewProps } from "@/types/examPresentation";
import { ACTEndTestModal } from "../../shells/act/ACTEndTestModal";

export const ACTReviewModalAdapter: React.FC<ReviewProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  questions,
  answers,
  onJumpToQuestion,
}) => {
  const handleReviewUnanswered = () => {
    const firstUnansweredIndex = questions.findIndex((q) => {
      const ans = answers[q.id];
      return (
        !ans?.selectedOptionId &&
        !(typeof ans?.frqUserAnswer === "string" && ans.frqUserAnswer.trim().length > 0)
      );
    });

    if (firstUnansweredIndex !== -1) {
      onJumpToQuestion(firstUnansweredIndex);
    }
    onClose();
  };

  const handleReviewFlagged = () => {
    const firstFlaggedIndex = questions.findIndex(
      (q) => Boolean(answers[q.id]?.flagged)
    );

    if (firstFlaggedIndex !== -1) {
      onJumpToQuestion(firstFlaggedIndex);
    }
    onClose();
  };

  return (
    <ACTEndTestModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      questions={questions}
      answers={answers}
      onReviewUnanswered={handleReviewUnanswered}
      onReviewFlagged={handleReviewFlagged}
    />
  );
};