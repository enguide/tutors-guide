/* eslint-disable @typescript-eslint/no-explicit-any */
// components/exam/shells/act/ACTLayoutAdapter.tsx
"use client";

import React, { useState } from "react";
import { TestShellLayoutProps } from "@/types/examLayout";
import { ACTHeader, ACTContrastTheme } from "./ACTHeader";
import { ACTIndexDrawer } from "./ACTIndexDrawer";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { QuestionOptions } from "../../QuestionOptions";
import { Flag, ChevronLeft, ChevronRight } from "lucide-react";

export const ACTLayoutAdapter: React.FC<TestShellLayoutProps> = ({
  category,
  metadata,
  section,
  effectiveConfig,
  manifestBasePath,
  state,
  actions,
}) => {
  const [contrastTheme, setContrastTheme] = useState<ACTContrastTheme>("default");
  const [isIndexOpen, setIsIndexOpen] = useState(false);

  const { frontmatter, content: passageContent } = section;
  const questions = frontmatter.questions;
  const isFirstQuestion = state.currentIndex === 0;
  const isLastQuestion = state.currentIndex === questions.length - 1;
  const isFlagged = Boolean(state.activeAnswer?.flagged);

  const answeredCount = Object.values(state.answers).filter(
    (ans: any) =>
      Boolean(ans?.selectedOptionId) ||
      (typeof ans?.frqUserAnswer === "string" && ans.frqUserAnswer.trim().length > 0)
  ).length;

  const activeStimulus =
    state.activeQuestion.stimulus ||
    state.activeQuestion.passage ||
    (passageContent && passageContent.trim().length > 0 ? passageContent : null);

  const isSplitView =
    state.activeQuestion.layout === "split"
      ? true
      : state.activeQuestion.layout === "single"
      ? false
      : effectiveConfig.layout === "split-passage" || Boolean(activeStimulus);

  return (
    <div
      data-act-theme={contrastTheme}
      className="flex flex-col h-screen w-full overflow-hidden bg-[var(--act-shell-bg)] text-[var(--act-text-main)] select-none font-sans transition-colors duration-150"
    >
      {/* 1. Header with dynamic contrast selection */}
      <ACTHeader
        config={effectiveConfig}
        secondsRemaining={state.secondsRemaining}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        contrastTheme={contrastTheme}
        onChangeContrastTheme={setContrastTheme}
        onToggleCalculator={actions.toggleCalculator}
        onOpenReviewModal={actions.openReviewModal}
      />

      {/* 2. Main Work Stage */}
      <div className="flex-1 flex overflow-hidden bg-[var(--act-shell-bg)] relative">
        {/* Elevated Workspace Container */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[var(--act-card-bg)] my-3 ml-4 mr-3 rounded-[2px] border border-[var(--act-card-border)] shadow-[0_4px_16px_rgba(0,0,0,0.08)] min-w-0">
          
          {/* Item Header / Flag Bar */}
          <div className="h-14 border-b border-[var(--act-card-border)] pl-4 pr-2 flex items-center justify-between shrink-0 bg-[var(--act-card-bg)]">
            <span className="text-[12.5px] font-normal text-[var(--act-text-muted)]">
              Item {state.activeQuestion.questionNumber}
            </span>
            <button
              type="button"
              onClick={actions.toggleFlag}
              className={`group flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase px-2.5 py-2.5 rounded transition-colors cursor-pointer select-none ${
                isFlagged
                  ? "bg-[var(--act-btn-active-bg)] text-[var(--act-btn-active-fg)]"
                  : "text-[var(--act-text-main)] hover:bg-[var(--act-btn-active-bg)]"
              }`}
            >
              <Flag className="w-3.5 h-3.5 fill-current stroke-current shrink-0" />
              <span>FLAG</span>
            </button>
          </div>

          {/* Stimulus & Work Area */}
          <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[var(--act-card-bg)] act-content-area">
            {isSplitView ? (
              <>
                <div className="flex-1 border-r border-[var(--act-card-border)] overflow-y-auto p-4 md:p-6 text-[14px] leading-[22px] bg-[var(--act-card-bg)] text-[var(--act-text-main)]">
                  <div className="justify-start space-y-6">
                    {activeStimulus ? (
                      <MarkdownQuestionRenderer
                        content={activeStimulus}
                        category={category}
                        testId={metadata.id}
                        manifestBasePath={manifestBasePath}
                        enableLightbox={state.accommodations.imageMagnification}
                        activeQuestionNumber={state.activeQuestion.questionNumber}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-[var(--act-text-muted)] text-xs italic">
                        No reference stimulus required for this item.
                      </div>
                    )}
                  </div>
                </div>

                <div key={state.activeQuestion.id} className="flex-1 overflow-y-auto p-4 md:p-6 bg-[var(--act-card-bg)] act-content-area">
                  <div className="justify-start space-y-6">
                    <div className="text-[var(--act-text-main)] text-[14px] leading-normal font-normal">
                      <MarkdownQuestionRenderer
                        content={state.activeQuestion.prompt}
                        category={category}
                        testId={metadata.id}
                        manifestBasePath={manifestBasePath}
                        enableLightbox={state.accommodations.imageMagnification}
                      />
                    </div>

                    <QuestionOptions
                      variant="act"
                      question={state.activeQuestion}
                      selectedOptionId={state.activeAnswer?.selectedOptionId}
                      frqAnswer={state.activeAnswer?.frqUserAnswer}
                      eliminatedOptions={state.activeAnswer?.eliminatedOptions}
                      isCrossOutMode={state.isCrossOutMode}
                      onSelectOption={actions.selectOption}
                      onSetFrqAnswer={actions.setFrqAnswer}
                      onToggleEliminate={actions.toggleEliminateOption}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div key={state.activeQuestion.id} className="flex-1 overflow-y-auto p-4 md:p-6 bg-[var(--act-card-bg)] act-content-area">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="text-[var(--act-text-main)] text-[14px] leading-normal">
                    <MarkdownQuestionRenderer
                      content={state.activeQuestion.prompt}
                      category={category}
                      testId={metadata.id}
                      manifestBasePath={manifestBasePath}
                    />
                  </div>

                  <QuestionOptions
                    variant="act"
                    question={state.activeQuestion}
                    selectedOptionId={state.activeAnswer?.selectedOptionId}
                    frqAnswer={state.activeAnswer?.frqUserAnswer}
                    eliminatedOptions={state.activeAnswer?.eliminatedOptions}
                    isCrossOutMode={state.isCrossOutMode}
                    onSelectOption={actions.selectOption}
                    onSetFrqAnswer={actions.setFrqAnswer}
                    onToggleEliminate={actions.toggleEliminateOption}
                  />
                </div>
              </div>
            )}
          </main>

          {/* Footer Controls */}
          <footer className="h-12 border-t border-[var(--act-card-border)] px-6 flex items-center justify-end gap-6 bg-[var(--act-card-bg)] shrink-0">
            <button
              type="button"
              disabled={isFirstQuestion}
              onClick={() => actions.setCurrentIndex((idx) => Math.max(0, idx - 1))}
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--act-text-main)] hover:opacity-75 disabled:opacity-25 disabled:pointer-events-none transition-opacity cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isLastQuestion) {
                  actions.openReviewModal();
                } else {
                  actions.setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1));
                }
              }}
              className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--act-text-main)] hover:opacity-75 transition-colors cursor-pointer"
            >
              <span>{isLastQuestion ? "FINISH" : "NEXT"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </footer>
        </div>

        {/* 3. Slide-Out Index Panel */}
        <ACTIndexDrawer
          isOpen={isIndexOpen}
          currentIndex={state.currentIndex}
          questions={questions}
          answers={state.answers}
          onSelectIndex={(idx) => actions.setCurrentIndex(idx)}
        />

        {/* 4. Dedicated Right Column */}
        <aside className="w-28 flex flex-col justify-between items-center py-2 shrink-0 select-none bg-[var(--act-shell-bg)] mr-3 my-1">
          <button
            type="button"
            onClick={() => setIsIndexOpen((prev) => !prev)}
            className={`group w-full py-5 px-12 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:shadow-sm ${
              isIndexOpen
                ? "bg-[var(--act-header-bg)] text-white shadow-sm"
                : "bg-transparent text-[var(--act-text-main)] hover:bg-[var(--act-header-bg)] hover:text-white transition-colors"
            }`}
            title={isIndexOpen ? "Close Index" : "Open Index"}
          >
            <div className="flex flex-col justify-between w-[18px] h-[13px]">
              <span className="block h-[2px] w-full rounded-sm bg-current" />
              <span className="block h-[2px] w-full rounded-sm bg-current" />
              <span className="block h-[2px] w-full rounded-sm bg-current" />
            </div>
            <span className="text-[9.5px] font-bold tracking-widest uppercase font-sans mt-1.5 text-current">
              INDEX
            </span>
          </button>

          <div className="flex flex-col items-center gap-0.5 pb-2">
            <div className="flex items-end gap-[1.5px] h-3">
              <span className="w-[2px] h-[3px] bg-emerald-500 rounded-2xs" />
              <span className="w-[2px] h-[6px] bg-emerald-500 rounded-2xs" />
              <span className="w-[2px] h-[9px] bg-emerald-500 rounded-2xs" />
              <span className="w-[2px] h-[12px] bg-emerald-500 rounded-2xs" />
            </div>
            <span className="text-[7.5px] font-bold tracking-tight text-[var(--act-text-muted)] uppercase">
              CONNECTED
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};