/* eslint-disable @typescript-eslint/no-explicit-any */
// components/exam/shells/act/ACTIndexDrawer.tsx
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { QuestionFrontmatter } from "@/types/content";
import { Filter, ChevronDown, Bookmark, Flag } from "lucide-react";

interface ACTIndexDrawerProps {
  isOpen: boolean;
  currentIndex: number;
  questions: QuestionFrontmatter[];
  answers: Record<string, any>;
  onSelectIndex: (index: number) => void;
}

type FilterOption = "ALL" | "ANSWERED" | "UNANSWERED" | "BOOKMARKED";

export const ACTIndexDrawer: React.FC<ACTIndexDrawerProps> = ({
  isOpen,
  currentIndex,
  questions,
  answers,
  onSelectIndex,
}) => {
  const [filter, setFilter] = useState<FilterOption>("ALL");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Reference map for card elements
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const filteredQuestions = useMemo(() => {
    return questions
      .map((q, originalIndex) => {
        const answer = answers[q.id];
        const isAnswered =
          Boolean(answer?.selectedOptionId) ||
          (typeof answer?.frqUserAnswer === "string" && answer.frqUserAnswer.trim().length > 0);
        const isFlagged = Boolean(answer?.flagged);

        return {
          ...q,
          originalIndex,
          isAnswered,
          isFlagged,
        };
      })
      .filter((item) => {
        if (filter === "ANSWERED") return item.isAnswered;
        if (filter === "UNANSWERED") return !item.isAnswered;
        if (filter === "BOOKMARKED") return item.isFlagged;
        return true;
      });
  }, [questions, answers, filter]);

  // Smooth scroll target card to the top of the container
  const scrollToItem = (index: number) => {
    const el = itemRefs.current.get(index);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Scroll active item to top when the drawer opens or currentIndex changes
  useEffect(() => {
    if (isOpen) {
      // Small timeout ensures the DOM layout is painted before calculating scroll position
      const timer = setTimeout(() => {
        scrollToItem(currentIndex);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentIndex]);

  const handleItemClick = (index: number) => {
    onSelectIndex(index);
    scrollToItem(index);
  };

  if (!isOpen) return null;

  return (
    <div className="w-[calc(50vw-66px)] bg-[var(--act-drawer-bg)] border-l border-[var(--act-card-border)] flex flex-col h-full z-20 shrink-0 select-none text-[var(--act-text-main)] transition-colors duration-150">
      {/* 1. Filter Sub-Header Bar (Directly aligned with Item/Flag bar) */}
      <div className="h-14 px-4 bg-[var(--act-drawer-bg)] border-b border-[var(--act-card-border)] flex items-center justify-start gap-3 shrink-0">
        <div className="flex items-center gap-1.5 text-[14px] text-[var(--act-text-main)]">
          <Filter className="w-3.5 h-3.5 fill-current text-current" />
          <span>Filter By</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--act-header-bg)] text-[var(--act-header-fg)] text-[12px] font-bold tracking-wider rounded-[5px] shadow-sm uppercase hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span>
              {filter === "ALL" && "ALL QUESTIONS"}
              {filter === "ANSWERED" && "ANSWERED"}
              {filter === "UNANSWERED" && "UNANSWERED"}
              {filter === "BOOKMARKED" && "BOOKMARKED"}
            </span>
            <ChevronDown className="w-3 h-3 text-current opacity-80" />
          </button>

          {filterMenuOpen && (
            <div className="absolute left-0 mt-1 w-44 bg-[var(--act-card-bg)] border border-[var(--act-card-border)] rounded shadow-lg py-1 z-50 text-[12px] font-sans">
              {(["ALL", "ANSWERED", "UNANSWERED", "BOOKMARKED"] as FilterOption[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setFilter(f);
                    setFilterMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[var(--act-btn-active-bg)] hover:text-[var(--act-btn-active-fg)] text-[var(--act-text-main)] font-semibold cursor-pointer"
                >
                  {f === "ALL" ? "All Questions" : f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Scrollable Cards Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scroll-smooth">
        {filteredQuestions.map((item) => {
          const isCurrent = item.originalIndex === currentIndex;
          const isAnswered = item.isAnswered;

          const previewText = item.prompt
            .replace(/[#*_`$]/g, "")
            .replace(/\s+/g, " ")
            .trim();

          const headerBg = isCurrent
            ? "bg-[var(--act-drawer-active-item)] text-[var(--act-text-main)]"
            : "bg-[var(--act-shell-bg)] text-[var(--act-text-main)]";

          const bodyBg = isCurrent
            ? "bg-[var(--act-card-bg)]"
            : isAnswered
            ? "bg-[var(--act-btn-active-bg)]"
            : "bg-[var(--act-card-bg)]";

          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) {
                  itemRefs.current.set(item.originalIndex, el);
                } else {
                  itemRefs.current.delete(item.originalIndex);
                }
              }}
              type="button"
              onClick={() => handleItemClick(item.originalIndex)}
              className="w-full text-left rounded-[3px]  border-[var(--act-card-border)] overflow-hidden transition-all text-xs shadow-sm hover:brightness-95 cursor-pointer scroll-mt-3"
            >
              {/* Item Header */}
              <div
                className={`px-3 py-1.5 min-h-[44px] flex items-center justify-start gap-1.5 border-[var(--act-card-border)] ${headerBg}`}
              >
                {item.isFlagged && (
                  <Flag className="w-3.5 h-3.5 fill-red-800 stroke-red-800 shrink-0" />
                )}
                <span className="font-bold text-[12px]">
                  Item {item.questionNumber}
                </span>

                
              </div>

              {/* Item Body */}
              <div
                className={`px-3 py-2.5 min-h-[48px] flex items-center justify-between gap-3 text-[var(--act-text-main)] ${bodyBg}`}
              >
                <p className="text-[12px] leading-snug line-clamp-2 flex-1">
                  {previewText || "Select to view item stimulus and question."}
                </p>

                {isAnswered && (
                  <span className="bg-[var(--act-header-bg)] text-[var(--act-header-fg)] text-[9px] font-bold px-2 py-1.5 rounded-full tracking-tight shrink-0">
                    Answered
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};