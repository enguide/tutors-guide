// components/analytics/TestAnalyticsClient.tsx
"use client";

import React, { useState, useMemo, useRef } from "react";
import { TestMetadata } from "@/types/content";
import {
  EnrichedResponseItem,
  SectionResultData,
  TestSummaryData,
} from "@/types/analytics";
import UnifiedAnalyticsDashboard from "@/components/analytics/UnifiedAnalyticsDashboard";
import { QuestionResultCard } from "@/components/analytics/QuestionResultCard";
import {
  BarChart3,
  Search,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
} from "lucide-react";

interface TestAnalyticsClientProps {
  metadata: TestMetadata;
  testSummary: TestSummaryData | null;
  sectionResults: SectionResultData[];
  responses: EnrichedResponseItem[];
}

export const TestAnalyticsClient: React.FC<TestAnalyticsClientProps> = ({
  metadata,
  testSummary,
  sectionResults,
  responses,
}) => {
  const [activeTab, setActiveTab] = useState<"analytics" | "review">("analytics");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("all");

  // Filters for the triage review tab
  const [statusFilter, setStatusFilter] = useState<"All" | "Correct" | "Incorrect">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [onlyChanged, setOnlyChanged] = useState<boolean>(false);
  const [onlyCalculator, setOnlyCalculator] = useState<boolean>(false);

  const [reviewIndex, setReviewIndex] = useState<number>(0);
  const reviewContainerRef = useRef<HTMLDivElement>(null);

  const currentSectionResponses = useMemo(() => {
    if (selectedSectionId === "all") return responses;
    return responses.filter((r) => r.sectionId === selectedSectionId);
  }, [responses, selectedSectionId]);

  const domainOptions = useMemo(() => {
    const set = new Set<string>();
    currentSectionResponses.forEach((r) => {
      if (r.domain) set.add(r.domain);
    });
    return ["All", ...Array.from(set).sort()];
  }, [currentSectionResponses]);

  const filteredReviewItems = useMemo(() => {
    return currentSectionResponses.filter((item) => {
      if (statusFilter === "Correct" && !item.isCorrect) return false;
      if (statusFilter === "Incorrect" && item.isCorrect) return false;
      if (selectedDifficulty !== "All" && item.difficulty !== selectedDifficulty) return false;
      if (selectedDomain !== "All" && item.domain !== selectedDomain) return false;
      if (onlyChanged && !item.changedAnswer) return false;
      if (onlyCalculator && !item.usedCalculator) return false;
      return true;
    });
  }, [
    currentSectionResponses,
    statusFilter,
    selectedDifficulty,
    selectedDomain,
    onlyChanged,
    onlyCalculator,
  ]);

  const currentReviewQuestion =
    filteredReviewItems[reviewIndex] || filteredReviewItems[0];

  const handleResetFilters = () => {
    setStatusFilter("All");
    setSelectedDifficulty("All");
    setSelectedDomain("All");
    setOnlyChanged(false);
    setOnlyCalculator(false);
    setReviewIndex(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground pb-20">
      {/* Top Controller Bar */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30 mb-6">
        <div className="max-w-337.5 mx-auto px-4 sm:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all border-b-2 ${
                activeTab === "analytics"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 size={15} /> Diagnostic Telemetry
            </button>

            <button
              onClick={() => setActiveTab("review")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all border-b-2 ${
                activeTab === "review"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Search size={15} /> Question Triage Review
            </button>
          </div>

          <span className="text-xs font-medium text-muted-foreground hidden sm:inline-block">
            {metadata.title}
          </span>
        </div>
      </div>

      {/* TAB 1: Unified Analytics Dashboard */}
      {activeTab === "analytics" && (
        <div className="animate-in fade-in duration-200">
          <UnifiedAnalyticsDashboard
            metadata={metadata}
            testSummary={testSummary}
            sectionResults={sectionResults}
            responses={responses}
          />
        </div>
      )}

      {/* TAB 2: Question Triage Review */}
      {activeTab === "review" && (
        <div
          ref={reviewContainerRef}
          className="max-w-337.5 mx-auto px-1 sm:px-8 space-y-6 animate-in fade-in duration-200"
        >
          {/* Module Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1">
              Modules:
            </span>
            <button
              onClick={() => {
                setSelectedSectionId("all");
                setReviewIndex(0);
              }}
              className={`px-3 py-1.5 rounded-none text-xs font-bold transition-all whitespace-nowrap border ${
                selectedSectionId === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              All Sections ({responses.length})
            </button>
            {sectionResults.map((sr) => {
              const incorrectCount = sr.totalQuestions - sr.numCorrect;
              const isActive = selectedSectionId === sr.sectionId;
              return (
                <button
                  key={sr.sectionId}
                  onClick={() => {
                    setSelectedSectionId(sr.sectionId);
                    setReviewIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-none text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  <span>{sr.section.title}</span>
                  {incorrectCount > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      {incorrectCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Triage Filter Drawer */}
          <div className="bg-card border border-border rounded-none p-4 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as "All" | "Correct" | "Incorrect");
                    setReviewIndex(0);
                  }}
                  className="text-xs font-semibold p-2 rounded-none border border-input bg-background"
                >
                  <option value="All">All Questions</option>
                  <option value="Incorrect">Incorrect Only</option>
                  <option value="Correct">Correct Only</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Difficulty
                </span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => {
                    setSelectedDifficulty(e.target.value);
                    setReviewIndex(0);
                  }}
                  className="text-xs font-semibold p-2 rounded-none border border-input bg-background"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Domain
                </span>
                <select
                  value={selectedDomain}
                  onChange={(e) => {
                    setSelectedDomain(e.target.value);
                    setReviewIndex(0);
                  }}
                  className="text-xs font-semibold p-2 rounded-none border border-input bg-background max-w-45 truncate"
                >
                  {domainOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4 pt-4 sm:pt-3">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyChanged}
                    onChange={(e) => {
                      setOnlyChanged(e.target.checked);
                      setReviewIndex(0);
                    }}
                    className="rounded-none"
                  />
                  Changed Answer
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyCalculator}
                    onChange={(e) => {
                      setOnlyCalculator(e.target.checked);
                      setReviewIndex(0);
                    }}
                    className="rounded-none"
                  />
                  Used Calculator
                </label>
              </div>

              <div className="ml-auto flex items-center gap-3 pt-3">
                <span className="text-xs font-bold text-muted-foreground">
                  {filteredReviewItems.length} Matching Question
                  {filteredReviewItems.length === 1 ? "" : "s"}
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Question Inspector Card Display */}
          {currentReviewQuestion ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">
                  Viewing {reviewIndex + 1} of {filteredReviewItems.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={reviewIndex === 0}
                    onClick={() => setReviewIndex((i) => Math.max(0, i - 1))}
                    className="p-1.5 rounded-none border border-border bg-card hover:bg-accent disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={reviewIndex >= filteredReviewItems.length - 1}
                    onClick={() =>
                      setReviewIndex((i) =>
                        Math.min(filteredReviewItems.length - 1, i + 1)
                      )
                    }
                    className="p-1.5 rounded-none border border-border bg-card hover:bg-accent disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <QuestionResultCard item={currentReviewQuestion} />
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed rounded-none bg-card text-muted-foreground">
              No questions match the selected filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};