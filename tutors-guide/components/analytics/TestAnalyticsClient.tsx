// components/analytics/TestAnalyticsClient.tsx
"use client";

import React, { useState, useMemo, useRef } from "react";
import { TestMetadata } from "@/types/content";
import {
  EnrichedResponseItem,
  SectionResultData,
  TestSummaryData,
  AdaptiveTrajectoryData,
} from "@/types/analytics";
import UnifiedAnalyticsDashboard from "@/components/analytics/UnifiedAnalyticsDashboard";
import { QuestionResultCard } from "@/components/analytics/QuestionResultCard";
import {
  BarChart3,
  Search,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Lightbulb,
  X,
  Filter,
} from "lucide-react";
import { ActionableDiagnosticsPanel } from "./ActionableDiagnosticPanel";

interface TestAnalyticsClientProps {
  metadata: TestMetadata;
  testSummary: TestSummaryData | null;
  sectionResults: SectionResultData[];
  responses: EnrichedResponseItem[];
  adaptiveTrajectory?: AdaptiveTrajectoryData | null;
  pendingAuditSectionIds?: string[];
  stickyTopClass?: string;
}

export const TestAnalyticsClient: React.FC<TestAnalyticsClientProps> = ({
  metadata,
  testSummary,
  sectionResults,
  responses,
  adaptiveTrajectory,
  pendingAuditSectionIds = [],
  stickyTopClass = "top-16",
}) => {
  const [activeTab, setActiveTab] = useState<"analytics" | "action-plan" | "review">(
    "analytics"
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string>("all");

  const pendingAuditSet = useMemo(
    () => new Set(pendingAuditSectionIds),
    [pendingAuditSectionIds]
  );

  // Filter injected when jumping from Study Action Plan -> Question Review
  const [flaggedCohort, setFlaggedCohort] = useState<{
    ids: Set<string>;
    label: string;
  } | null>(null);

  // Filters for the question review tab
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
      const isPendingAudit = pendingAuditSet.has(String(item.sectionId));
      if (flaggedCohort && !flaggedCohort.ids.has(item.questionId)) return false;
      if (statusFilter === "Correct" && (isPendingAudit || !item.isCorrect)) return false;
      if (statusFilter === "Incorrect" && (isPendingAudit || item.isCorrect)) return false;
      if (selectedDifficulty !== "All" && item.difficulty !== selectedDifficulty) return false;
      if (selectedDomain !== "All" && item.domain !== selectedDomain) return false;
      if (onlyChanged && !item.changedAnswer) return false;
      if (onlyCalculator && !item.usedCalculator) return false;
      return true;
    });
  }, [
    currentSectionResponses,
    pendingAuditSet,
    flaggedCohort,
    statusFilter,
    selectedDifficulty,
    selectedDomain,
    onlyChanged,
    onlyCalculator,
  ]);

  const currentReviewQuestion =
    filteredReviewItems[reviewIndex] || filteredReviewItems[0];

  const handleResetFilters = () => {
    setFlaggedCohort(null);
    setStatusFilter("All");
    setSelectedDifficulty("All");
    setSelectedDomain("All");
    setOnlyChanged(false);
    setOnlyCalculator(false);
    setReviewIndex(0);
  };

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-foreground pb-20">
      {/* Top Controller Bar (Docks directly below StudentNavbar or StaffInspectionBar) */}
      <div
        className={`w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md sticky ${stickyTopClass} z-30 mb-6`}
      >
        <div className="max-w-337.5 mx-auto px-3 sm:px-8 flex items-center justify-between gap-2 h-14">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`min-h-11 flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === "analytics"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 size={15} className="shrink-0" />
              <span>Score & Pacing Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("action-plan")}
              className={`min-h-11 flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === "action-plan"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lightbulb size={15} className="shrink-0" />
              <span>Study Action Plan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("review")}
              className={`min-h-11 flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === "review"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Search size={15} className="shrink-0" />
              <span>Question Review</span>
            </button>
          </div>

          <span className="text-xs font-medium text-muted-foreground hidden md:inline-block truncate max-w-xs lg:max-w-md">
            {metadata.title}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-337.5 mx-auto px-4 sm:px-8">
        {/* TAB 1: Score & Pacing Overview */}
        {activeTab === "analytics" && (
          <div className="animate-in fade-in duration-200">
            <UnifiedAnalyticsDashboard
              metadata={metadata}
              testSummary={testSummary}
              sectionResults={sectionResults}
              responses={responses}
              adaptiveTrajectory={adaptiveTrajectory}
              pendingAuditSectionIds={pendingAuditSectionIds}
            />
          </div>
        )}

        {/* TAB 2: Study Action Plan */}
        {activeTab === "action-plan" && (
          <div className="animate-in fade-in duration-200">
            <ActionableDiagnosticsPanel
              metadata={metadata}
              sectionResults={sectionResults}
              responses={responses}
              onInspectQuestions={(questionIds: string[], label: string) => {
                setSelectedSectionId("all");
                handleResetFilters();
                setFlaggedCohort({ ids: new Set(questionIds), label });
                setReviewIndex(0);
                setActiveTab("review");
              }}
            />
          </div>
        )}

        {/* TAB 3: Question Review */}
        {activeTab === "review" && (
          <div
            ref={reviewContainerRef}
            className="space-y-6 animate-in fade-in duration-200"
          >
            {/* Active Action-Plan Focus Banner (shown when deep-linked from Study Action Plan) */}
            {flaggedCohort && (
              <div className="bg-primary/10 border border-primary/30 px-4 py-3 rounded-none flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <Filter size={14} className="text-primary shrink-0" />
                  <span>
                    <strong className="font-bold text-primary">Focus Area:</strong>{" "}
                    <span className="text-foreground font-medium">{flaggedCohort.label}</span>{" "}
                    <span className="text-muted-foreground font-mono">
                      ({filteredReviewItems.length} question
                      {filteredReviewItems.length === 1 ? "" : "s"})
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFlaggedCohort(null);
                    setReviewIndex(0);
                  }}
                  className="min-h-8 px-2.5 py-1 bg-card border border-border hover:bg-muted text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <X size={13} />
                  <span>Show All Questions</span>
                </button>
              </div>
            )}

            {/* Section Selector Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1 shrink-0">
                Sections:
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedSectionId("all");
                  setReviewIndex(0);
                }}
                className={`min-h-9 px-3 py-1.5 rounded-none text-xs font-bold transition-all whitespace-nowrap border ${
                  selectedSectionId === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                All Sections ({responses.length})
              </button>
              {sectionResults.map((sr) => {
                const isSectionPendingAudit = pendingAuditSet.has(sr.sectionId);
                const incorrectCount = sr.totalQuestions - sr.numCorrect;
                const isActive = selectedSectionId === sr.sectionId;
                return (
                  <button
                    key={sr.sectionId}
                    type="button"
                    onClick={() => {
                      setSelectedSectionId(sr.sectionId);
                      setReviewIndex(0);
                    }}
                    className={`min-h-9 px-3 py-1.5 rounded-none text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap border ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    <span>{sr.section.title}</span>
                    {isSectionPendingAudit ? (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        Under Review
                      </span>
                    ) : (
                      incorrectCount > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-[#ff9999]/20 text-[#ff9999] border border-[#ff9999]/40"
                          }`}
                        >
                          {incorrectCount}
                        </span>
                      )
                    )}
                  </button>
                );
              })}
            </div>

            {/* Filter Drawer */}
            <div className="bg-card border border-border rounded-none p-4 shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end gap-3 sm:gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Outcome
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as "All" | "Correct" | "Incorrect");
                      setReviewIndex(0);
                    }}
                    className="w-full min-h-9 text-xs font-semibold p-2 rounded-none border border-input bg-background"
                  >
                    <option value="All">All Questions</option>
                    <option value="Incorrect">Missed Only</option>
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
                    className="w-full min-h-9 text-xs font-semibold p-2 rounded-none border border-input bg-background"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Domain
                  </span>
                  <select
                    value={selectedDomain}
                    onChange={(e) => {
                      setSelectedDomain(e.target.value);
                      setReviewIndex(0);
                    }}
                    className="w-full lg:max-w-52 min-h-9 text-xs font-semibold p-2 rounded-none border border-input bg-background truncate"
                  >
                    {domainOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-4 min-h-9 sm:col-span-2 lg:col-span-1">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer min-h-8">
                    <input
                      type="checkbox"
                      checked={onlyChanged}
                      onChange={(e) => {
                        setOnlyChanged(e.target.checked);
                        setReviewIndex(0);
                      }}
                      className="rounded-none w-4 h-4"
                    />
                    <span>Changed Answer</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer min-h-8">
                    <input
                      type="checkbox"
                      checked={onlyCalculator}
                      onChange={(e) => {
                        setOnlyCalculator(e.target.checked);
                        setReviewIndex(0);
                      }}
                      className="rounded-none w-4 h-4"
                    />
                    <span>Used Calculator</span>
                  </label>
                </div>

                <div className="sm:col-span-2 lg:ml-auto flex items-center justify-between lg:justify-end gap-3 min-h-9 border-t lg:border-t-0 border-border/60 pt-3 lg:pt-0">
                  <span className="text-xs font-bold text-muted-foreground">
                    {filteredReviewItems.length} Matching Question
                    {filteredReviewItems.length === 1 ? "" : "s"}
                  </span>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="min-h-8 px-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                </div>
              </div>
            </div>

            {/* =========================================================================
                QUESTION INDEX NAVIGATOR
               ========================================================================= */}
            {filteredReviewItems.length > 0 && (
              <div className="bg-card border border-border rounded-none p-4 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Question Navigator ({filteredReviewItems.length} shown)
                  </span>

                  {/* Micro Legend */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground select-none">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 border-2 border-slate-700 dark:border-slate-300 inline-block" />
                      Correct
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 border-2 border-[#ff9999] inline-block" />
                      Missed
                    </span>
                    {pendingAuditSectionIds.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 border-2 border-amber-500 inline-block" />
                        Under Review
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-slate-800 text-white ring-1 ring-blue-500 inline-block" />
                      Active
                    </span>
                  </div>
                </div>

                {/* Question Boxes Grouped by Section */}
                <div className="space-y-3 pt-1">
                  {Array.from(
                    new Set(filteredReviewItems.map((item) => item.sectionId))
                  ).map((sectionId) => {
                    const sectionMeta = sectionResults.find(
                      (s) => s.sectionId === sectionId
                    );
                    const sectionTitle = sectionMeta?.section.title || "Section";
                    const isSectionPendingAudit = pendingAuditSet.has(String(sectionId));

                    const sectionQuestions = filteredReviewItems
                      .map((item, originalIndex) => ({
                        item,
                        indexInFiltered: originalIndex,
                      }))
                      .filter((entry) => entry.item.sectionId === sectionId);

                    return (
                      <div
                        key={sectionId}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
                      >
                        <span className="text-xs font-semibold text-muted-foreground sm:min-w-28 shrink-0">
                          {sectionTitle}:
                        </span>

                        <div className="flex items-center gap-2 sm:gap-1.5 flex-wrap">
                          {sectionQuestions.map(({ item, indexInFiltered }) => {
                            const isCurrent = reviewIndex === indexInFiltered;
                            const isCorrect = item.isCorrect;

                            let buttonStyle = "";
                            if (isSectionPendingAudit) {
                              buttonStyle = isCurrent
                                ? "bg-amber-500 text-white border-2 border-amber-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-background font-extrabold scale-105"
                                : "border-2 border-amber-500/70 text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 font-bold";
                            } else if (isCorrect) {
                              buttonStyle = isCurrent
                                ? "bg-[#444444] text-white border-2 border-[#444444] ring-2 ring-blue-500 ring-offset-2 ring-offset-background font-extrabold scale-105"
                                : "border-2 border-slate-700 dark:border-slate-300 text-foreground hover:bg-muted font-bold";
                            } else {
                              buttonStyle = isCurrent
                                ? "bg-[#ff9999] text-white border-2 border-[#ff9999] ring-2 ring-blue-500 ring-offset-2 ring-offset-background font-extrabold scale-105"
                                : "border-2 border-[#ff9999] text-[#ff9999] bg-[#ff9999]/10 hover:bg-[#ff9999]/20 font-bold";
                            }

                            const statusLabel = isSectionPendingAudit
                              ? "Under Review"
                              : isCorrect
                              ? "Correct"
                              : "Missed";

                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setReviewIndex(indexInFiltered)}
                                title={`Q${item.responseOrder} - ${statusLabel} (${item.skill})`}
                                className={`w-9 h-9 sm:w-8 sm:h-8 text-xs flex items-center justify-center transition-all rounded-none select-none ${buttonStyle}`}
                              >
                                {item.responseOrder}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question Inspector Card Display */}
            {currentReviewQuestion ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">
                    Question {reviewIndex + 1} of {filteredReviewItems.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous matching question"
                      disabled={reviewIndex === 0}
                      onClick={() => setReviewIndex((i) => Math.max(0, i - 1))}
                      className="min-h-10 min-w-10 flex items-center justify-center p-2 rounded-none border border-border bg-card hover:bg-accent disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next matching question"
                      disabled={reviewIndex >= filteredReviewItems.length - 1}
                      onClick={() =>
                        setReviewIndex((i) =>
                          Math.min(filteredReviewItems.length - 1, i + 1)
                        )
                      }
                      className="min-h-10 min-w-10 flex items-center justify-center p-2 rounded-none border border-border bg-card hover:bg-accent disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <QuestionResultCard
                  key={currentReviewQuestion.id}
                  item={currentReviewQuestion}
                  category={metadata.category}
                  testId={metadata.id}
                  isPendingAudit={pendingAuditSet.has(String(currentReviewQuestion.sectionId))}
                />
              </div>
            ) : (
              <div className="p-12 text-center border border-dashed rounded-none bg-card text-muted-foreground">
                No questions match your current filters.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};