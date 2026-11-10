// components/exam/shells/sat/SATLayoutAdapter.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { TestShellLayoutProps } from "@/types/examLayout";
import { SATHeader } from "./SATHeader";
import { SATFooter } from "./SATFooter";
import { SATCheckYourWorkScreen } from "./SATCheckYourWorkScreen";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { QuestionOptions } from "../../QuestionOptions";
import { SATCrossOutIcon } from "./SATCrossOutIcon";

function ItemBookmarkRibbon({
  isFlagged,
  className = "w-3.5 h-4",
}: {
  isFlagged: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 12 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.75 0.75H11.25V14.5L6 10.5L0.75 14.5V0.75Z"
        fill={isFlagged ? "#C5221F" : "none"}
        stroke={isFlagged ? "#C5221F" : "currentColor"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const SATLayoutAdapter: React.FC<TestShellLayoutProps> = ({
  category,
  metadata,
  section,
  effectiveConfig,
  manifestBasePath,
  studentName,
  state,
  actions,
}) => {
  const { frontmatter, content: sectionPassageContent } = section;
  const questions = frontmatter.questions;
  const isFlagged = Boolean(state.activeAnswer?.flagged);

  // In-canvas review screen state
  const [isReviewActive, setIsReviewActive] = useState(false);

  // Split-pane ratio for desktop (width percentage, default 50%)
  const [splitRatioX, setSplitRatioX] = useState<number>(50);
  const isDraggingSplitX = useRef(false);

  // Split-pane ratio for mobile (height percentage, default 45% stimulus, 55% questions)
  const [splitRatioY, setSplitRatioY] = useState<number>(45);
  const isDraggingSplitY = useRef(false);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Automatically dismiss tools when entering review screen
  useEffect(() => {
    if (isReviewActive) {
      if (state.isCalculatorOpen) actions.toggleCalculator();
      if (state.isFormulaSheetOpen) actions.openFormulaSheet();
    }
  }, [isReviewActive, state.isCalculatorOpen, state.isFormulaSheetOpen, actions]);

  // --- 1. Desktop Horizontal Split Drag (Left / Right) ---
  const handleMouseDownSplitX = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingSplitX.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  // --- 2. Mobile Vertical Split Drag (Top / Bottom) ---
  const handleStartSplitY = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isDraggingSplitY.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!mainContainerRef.current) return;
      const rect = mainContainerRef.current.getBoundingClientRect();

      // Handle Desktop Horizontal Drag
      if (isDraggingSplitX.current && "clientX" in e) {
        const relativeX = e.clientX - rect.left;
        const rawPercentage = (relativeX / rect.width) * 100;
        setSplitRatioX(Math.max(25, Math.min(75, rawPercentage)));
      }

      // Handle Mobile Vertical Drag (Mouse or Touch)
      if (isDraggingSplitY.current) {
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        const relativeY = clientY - rect.top;
        const rawPercentage = (relativeY / rect.height) * 100;
        // Clamp height between 20% and 75%
        setSplitRatioY(Math.max(20, Math.min(75, rawPercentage)));
      }
    };

    const handleEnd = () => {
      if (isDraggingSplitX.current || isDraggingSplitY.current) {
        isDraggingSplitX.current = false;
        isDraggingSplitY.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("touchcancel", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, []);

  const activeStimulus =
    state.activeQuestion?.stimulus ||
    state.activeQuestion?.passage ||
    (sectionPassageContent && sectionPassageContent.trim().length > 0
      ? sectionPassageContent
      : null);

  const isSplitView =
    state.activeQuestion?.layout === "split"
      ? true
      : state.activeQuestion?.layout === "single"
      ? false
      : effectiveConfig.layout === "split-passage" || Boolean(activeStimulus);

  const renderItemActionBar = () => (
    <div className="flex items-stretch justify-between bg-neutral-100 dark:bg-neutral-800 h-9 select-none overflow-hidden shrink-0">
      <div className="flex items-center">
        <div className="w-9 h-full flex items-center justify-center bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-lg font-sans font-bold">
          {state.activeQuestion.questionNumber}
        </div>

        <button
          type="button"
          onClick={actions.toggleFlag}
          className="h-full flex items-center gap-2 px-3 text-xs font-sans text-neutral-900 dark:text-neutral-100 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ItemBookmarkRibbon 
            isFlagged={isFlagged} 
            className="w-3.5 h-4 shrink-0 text-neutral-600 dark:text-neutral-400" 
          />
          <span className={`text-sm ${isFlagged ? "font-bold" : "font-normal"}`}>
            Mark for Review
          </span>
        </button>
      </div>

      <div className="flex items-center pr-2">
        <button
          type="button"
          onClick={actions.toggleCrossOut}
          title="Eliminate Answer Choices"
          className={`px-1 py-0.75 rounded-sm transition-colors border cursor-pointer flex items-center justify-center ${
            state.isCrossOutMode
              ? "bg-[#2050c8] text-white border-[#292b31]"
              : "bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          }`}
        >
          <SATCrossOutIcon
            className="w-6 h-5"
            isActive={state.isCrossOutMode}
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-white dark:bg-neutral-950 select-none">
      {/* 1. Header (fixed at top) */}
      <div className="shrink-0">
        <SATHeader
          sectionTitle={frontmatter.sectionTitle}
          config={effectiveConfig}
          secondsRemaining={state.secondsRemaining}
          isCalculatorOpen={state.isCalculatorOpen}
          isFormulaSheetOpen={state.isFormulaSheetOpen}
          isToolsDisabled={isReviewActive}
          onToggleCalculator={actions.toggleCalculator}
          onToggleFormulaSheet={actions.openFormulaSheet}
        />
      </div>

      {/* Official Practice Banner */}
      <div className="w-full px-3 sm:px-8 flex shrink-0 select-none z-20 bg-white dark:bg-neutral-900">
        <div className="w-full bg-[#1D235F] py-1 sm:py-1.5 rounded-b-xl sm:rounded-b-2xl flex items-center justify-center border-b border-x border-[#151a4a]">
          <span className="text-white text-[10px] sm:text-[12px] font-sans font-bold tracking-[0.08em] uppercase">
            This is a practice test
          </span>
        </div>
      </div>

      {/* 2. Main Work Area */}
      {isReviewActive ? (
        <SATCheckYourWorkScreen
          sectionTitle={frontmatter.sectionTitle}
          questions={questions}
          answers={state.answers}
          onSelectIndex={(idx) => {
            actions.setCurrentIndex(idx);
            setIsReviewActive(false);
          }}
        />
      ) : (
        <main
          ref={mainContainerRef}
          className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/50 relative"
        >
          {isSplitView ? (
            <>
              {/* Left Pane (Desktop Stimulus) */}
              <div
                style={{ width: `${splitRatioX}%` }}
                className="hidden md:block h-full overflow-y-auto p-6 md:p-10 bg-white dark:bg-neutral-900 shrink-0"
              >
                <div className="max-w-2xl mx-auto font-serif text-[15.5px] leading-[1.65] font-normal text-neutral-900 dark:text-neutral-100">
                  {activeStimulus ? (
                    <MarkdownQuestionRenderer
                      content={activeStimulus}
                      category={category}
                      testId={metadata.id}
                      manifestBasePath={manifestBasePath}
                      enableLightbox={state.accommodations.imageMagnification}
                      className="prose-p:leading-[1.65] prose-p:my-2"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-neutral-400 font-mono text-xs italic">
                      No reference stimulus required for this item.
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Vertical Drag Divider (Col-Resize) */}
              <div
                onMouseDown={handleMouseDownSplitX}
                className="hidden md:flex relative w-[4px] bg-[#969595] dark:bg-neutral-600 hover:bg-[#555555] active:bg-[#333333] cursor-col-resize shrink-0 items-center justify-center transition-colors z-20 group"
              >
                <div className="absolute inset-y-0 -left-2 -right-2 cursor-col-resize" />
                <div className="w-3.5 h-6 bg-[#1c1c1c] rounded-xs border border-background/30 flex flex-col items-center justify-center gap-0.5 pointer-events-none select-none">
                  <div className="flex items-center justify-center gap-[1.5px]">
                    <span className="w-0 h-0 border-y-[4.5px] border-y-transparent border-r-[3.5px] border-r-white" />
                    <span className="w-0 h-0 border-y-[4.5px] border-y-transparent border-l-[3.5px] border-l-white" />
                  </div>
                </div>
              </div>

              {/* Mobile Top Stimulus Pane (Dynamically resizable height) */}
              <div
                style={{ height: `${splitRatioY}%` }}
                className="md:hidden w-full shrink-0 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-neutral-900"
              >
                <div className="font-serif text-[14.5px] sm:text-[15px] leading-[1.65] text-neutral-900 dark:text-neutral-100">
                  {activeStimulus ? (
                    <MarkdownQuestionRenderer
                      content={activeStimulus}
                      category={category}
                      testId={metadata.id}
                      manifestBasePath={manifestBasePath}
                      enableLightbox={state.accommodations.imageMagnification}
                      className="prose-p:leading-[1.65] prose-p:my-2"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-neutral-400 font-mono text-xs italic">
                      No reference stimulus required.
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Horizontal Drag Divider (Row-Resize) */}
              <div
                onMouseDown={handleStartSplitY}
                onTouchStart={handleStartSplitY}
                className="md:hidden relative h-[8px] w-full bg-neutral-200 dark:bg-neutral-800 border-y border-neutral-300 dark:border-neutral-700 cursor-row-resize shrink-0 flex items-center justify-center z-20 active:bg-neutral-300 dark:active:bg-neutral-700"
              >
                <div className="w-12 h-1 bg-neutral-400 dark:bg-neutral-500 rounded-full pointer-events-none" />
              </div>

              {/* Right / Bottom Pane: Question Stem & Choices */}
              <div
                key={state.activeQuestion.id}
                style={{
                  width: typeof window !== "undefined" && window.innerWidth >= 768
                    ? `calc(${100 - splitRatioX}% - 4px)`
                    : undefined,
                  height: typeof window !== "undefined" && window.innerWidth < 768
                    ? `calc(${100 - splitRatioY}% - 8px)`
                    : undefined,
                }}
                className="w-full flex-1 md:flex-initial min-h-0 overflow-y-auto p-4 sm:p-6 md:p-10 bg-white dark:bg-neutral-900"
              >
                <div className="w-full max-w-xl mx-auto space-y-4">
                  {renderItemActionBar()}

                  <div className="text-neutral-900 dark:text-neutral-100 font-serif text-[15px] sm:text-[15.5px] leading-[1.65] font-normal">
                    <MarkdownQuestionRenderer
                      content={state.activeQuestion.prompt}
                      category={category}
                      testId={metadata.id}
                      manifestBasePath={manifestBasePath}
                      enableLightbox={state.accommodations.imageMagnification}
                      className="prose-p:mb-0"
                    />
                  </div>

                  <QuestionOptions
                    variant="sat"
                    question={state.activeQuestion}
                    category={category}
                    testId={metadata.id}
                    manifestBasePath={manifestBasePath}
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
            /* Single Column (Math) */
            <div
              key={state.activeQuestion.id}
              className="w-full flex-1 min-h-0 h-full overflow-y-auto p-4 sm:p-6 md:p-10 bg-white dark:bg-neutral-900"
            >
              <div className="w-full max-w-2xl mx-auto space-y-6">
                {renderItemActionBar()}

                <div className="text-neutral-900 dark:text-neutral-100 font-serif text-[15px] sm:text-[15.5px] leading-[1.65] font-normal">
                  <MarkdownQuestionRenderer
                    content={state.activeQuestion.prompt}
                    category={category}
                    testId={metadata.id}
                    manifestBasePath={manifestBasePath}
                    enableLightbox={state.accommodations.imageMagnification}
                    className="prose-p:leading-[1.65] prose-p:my-2"
                  />
                </div>

                <QuestionOptions
                  variant="sat"
                  question={state.activeQuestion}
                  category={category}
                  testId={metadata.id}
                  manifestBasePath={manifestBasePath}
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
      )}

      {/* 3. Footer (shrink-0 + safe-area padding prevents Android navigation bar clipping) */}
      <div className="shrink-0 pb-[env(safe-area-inset-bottom)] bg-[#EBF3FA] dark:bg-neutral-950">
        <SATFooter
          currentIndex={state.currentIndex}
          totalQuestions={questions.length}
          studentName={studentName}
          syncStatus={state.syncStatus}
          sectionTitle={frontmatter.sectionTitle}
          questions={questions}
          answers={state.answers}
          isReviewScreen={isReviewActive}
          onSelectIndex={(idx) => {
            actions.setCurrentIndex(idx);
            setIsReviewActive(false);
          }}
          onOpenReviewModal={() => setIsReviewActive(true)}
          onPrev={() => {
            if (isReviewActive) {
              setIsReviewActive(false);
            } else {
              actions.setCurrentIndex((idx) => Math.max(0, idx - 1));
            }
          }}
          onNext={() => {
            if (isReviewActive) {
              actions.submitSection();
            } else if (state.currentIndex >= questions.length - 1) {
              setIsReviewActive(true);
            } else {
              actions.setCurrentIndex((idx) =>
                Math.min(questions.length - 1, idx + 1)
              );
            }
          }}
        />
      </div>
    </div>
  );
};