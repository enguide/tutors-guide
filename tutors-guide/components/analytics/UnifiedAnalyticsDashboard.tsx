// components/analytics/UnifiedAnalyticsDashboard.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Clock } from "lucide-react";

import {
  EnrichedResponseItem,
  SectionResultData,
  TestSummaryData,
  AdaptiveTrajectoryData,
} from "@/types/analytics";
import { TestMetadata } from "@/types/content";
import { SectionPacingTimeline } from "@/components/analytics/SectionPacingTimeline";
import { TopicSkillAccuracyAccordion } from "@/components/analytics/TopicSkillAccuracyAccordion";

type PacingChartMode = "bars" | "timeline";

const OUTCOME_COLORS = {
  correct: "#444444",
  incorrect: "#ff9999",
  target: "#2563eb",
};

function formatOrdinalPercentile(percentile?: number | string | null): string | null {
  if (percentile === null || percentile === undefined) {
    return null;
  }

  const raw = String(percentile).trim();
  if (!raw) return null;

  if (raw.endsWith("+")) {
    return `${raw} Percentile`;
  }

  const numeric = Number(raw);
  if (Number.isNaN(numeric)) {
    return raw.toLowerCase().includes("percentile") ? raw : `${raw} Percentile`;
  }

  const rounded = Math.round(numeric);
  const mod100 = rounded % 100;
  let suffix = "th";
  if (mod100 < 11 || mod100 > 13) {
    switch (rounded % 10) {
      case 1:
        suffix = "st";
        break;
      case 2:
        suffix = "nd";
        break;
      case 3:
        suffix = "rd";
        break;
    }
  }
  return `${rounded}${suffix} Percentile`;
}

const useWindowDimensions = () => {
  const [state, setState] = React.useState({
    isLg: false,
    mounted: false,
  });

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setState({
        isLg: width >= 1024,
        mounted: true,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return state;
};

const topBarConfig = {
  plottedTime: {
    label: "Time (s)",
    color: OUTCOME_COLORS.correct,
  },
} satisfies ChartConfig;

const navChartConfig = {
  qIdx: {
    label: "Question Number",
    color: "hsl(220 70% 50%)",
  },
} satisfies ChartConfig;

interface UnifiedAnalyticsDashboardProps {
  metadata: TestMetadata;
  testSummary: TestSummaryData | null;
  sectionResults: SectionResultData[];
  responses: EnrichedResponseItem[];
  adaptiveTrajectory?: AdaptiveTrajectoryData | null;
}

export default function UnifiedAnalyticsDashboard({
  metadata,
  testSummary,
  sectionResults,
  responses,
  adaptiveTrajectory,
}: UnifiedAnalyticsDashboardProps) {
  const { isLg, mounted } = useWindowDimensions();
  const [chartMode, setChartMode] = React.useState<PacingChartMode>("bars");

  const availableSections = React.useMemo(() => {
    return sectionResults.map((sr) => sr.sectionId);
  }, [sectionResults]);

  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null);

  const activeSectionId =
    selectedSectionId && availableSections.includes(selectedSectionId)
      ? selectedSectionId
      : availableSections[0] || "";

  const activeSectionResult = React.useMemo(() => {
    return sectionResults.find((s) => s.sectionId === activeSectionId);
  }, [sectionResults, activeSectionId]);

  const activeResponses = React.useMemo(() => {
    return responses
      .filter((r) => r.sectionId === activeSectionId)
      .sort((a, b) => a.responseOrder - b.responseOrder);
  }, [responses, activeSectionId]);

  // Dynamically compute target pacing per question (with accommodation multiplier)
  const targetPacingSeconds = React.useMemo(() => {
    if (!activeSectionResult) return null;

    const questionCount =
      activeResponses.length || activeSectionResult.totalQuestions || 0;
    if (questionCount === 0) return null;

    const manifestSection = metadata.sections?.find(
      (s) => s.id === activeSectionId
    );
    const baseTimeLimit =
      manifestSection?.timeLimit ||
      (activeSectionResult.section as any)?.timeLimit ||
      0;

    if (baseTimeLimit <= 0) return null;

    const multiplier =
      (activeSectionResult as any)?.accommodations?.timeMultiplier ?? 1.0;

    const totalAllotted = Math.round(baseTimeLimit * multiplier);
    return Math.round(totalAllotted / questionCount);
  }, [activeSectionResult, activeResponses.length, metadata.sections, activeSectionId]);

  // Dynamic 0.65x–1.5x pacing corridor and 2.5x Y/X-axis ceiling rounded to nearest 10s
  const { rushedFloorSec, timeSinkCeilingSec, timeAxisCap } = React.useMemo(() => {
    const baseTarget = targetPacingSeconds ?? 80;
    return {
      rushedFloorSec: Math.round(baseTarget * 0.65),
      timeSinkCeilingSec: Math.round(baseTarget * 1.5),
      timeAxisCap: Math.max(60, Math.round((baseTarget * 2.5) / 10) * 10),
    };
  }, [targetPacingSeconds]);

  const topChartData = React.useMemo(() => {
    return activeResponses.map((r, index) => {
      const trueTime = r.timeSpentOnResponse || 0;
      const isClamped = trueTime > timeAxisCap;
      return {
        question: `${index + 1}`,
        trueTime,
        plottedTime: isClamped ? timeAxisCap : trueTime,
        isClamped,
        fill: r.isCorrect ? OUTCOME_COLORS.correct : OUTCOME_COLORS.incorrect,
        isCorrect: r.isCorrect,
      };
    });
  }, [activeResponses, timeAxisCap]);

  const clampedBarCount = React.useMemo(
    () => topChartData.filter((d) => d.isClamped).length,
    [topChartData]
  );

  const sectionStats = React.useMemo(() => {
    const stats: Record<
      string,
      { title: string; percentage: number; formattedTime: string | null }
    > = {};

    sectionResults.forEach((sr) => {
      const secResps = responses.filter((r) => r.sectionId === sr.sectionId);
      const totalSeconds = secResps.reduce(
        (sum, r) => sum + (r.timeSpentOnResponse || 0),
        0
      );
      const percentage =
        sr.totalQuestions > 0 ? (sr.numCorrect / sr.totalQuestions) * 100 : 0;

      let formattedTime: string | null = null;
      if (totalSeconds > 0) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.round(totalSeconds % 60);
        formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      }

      stats[sr.sectionId] = {
        title: sr.section.title,
        percentage,
        formattedTime,
      };
    });

    return stats;
  }, [sectionResults, responses]);

  const scoreCard = React.useMemo(() => {
    const category = metadata.category.toUpperCase();
    const percentileLabel = formatOrdinalPercentile(testSummary?.percentile);

    if (category === "ACADEMIC" || (metadata.scoring as any)?.scaleType === "ACADEMIC_PERCENTAGE") {
      const totalEarned = sectionResults.reduce((acc, sr) => acc + (sr.rawScore || 0), 0);
      const totalPossible = sectionResults.reduce((acc, sr) => acc + (sr.totalQuestions || 0), 0);
      const calcPct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
      const displayScore = testSummary?.compositeScore ?? calcPct;
      const ptsText = `${totalEarned}/${totalPossible} pts earned`;

      return {
        label: "Overall Score",
        score: `${displayScore}%`,
        maxScore: null,
        subtext: percentileLabel ? `${ptsText} • ${percentileLabel}` : ptsText,
      };
    }

    if (category === "SAT") {
      if (adaptiveTrajectory?.compositeScore) {
        return {
          label: "Total Score",
          score: adaptiveTrajectory.compositeScore,
          maxScore: 1600,
          subtext: percentileLabel,
        };
      }

      const erSections = sectionResults.filter((sr) =>
        sr.section.title.toLowerCase().includes("reading") ||
        sr.section.title.toLowerCase().includes("writing") ||
        sr.sectionId.includes("rw") ||
        sr.sectionId.includes("s1") ||
        sr.sectionId.includes("s2")
      );
      const mathSections = sectionResults.filter((sr) =>
        sr.section.title.toLowerCase().includes("math") ||
        sr.sectionId.includes("math") ||
        sr.sectionId.includes("s3") ||
        sr.sectionId.includes("s4")
      );

      const erScore = erSections.reduce((sum, s) => sum + (s.scaledScore || 0), 0);
      const mathScore = mathSections.reduce((sum, s) => sum + (s.scaledScore || 0), 0);
      const totalScore = testSummary?.compositeScore ?? (erScore + mathScore || null);

      return {
        label: "Total Score",
        score: totalScore,
        maxScore: 1600,
        subtext: percentileLabel,
      };
    }

    if (category === "ACT") {
      return {
        label: "Composite",
        score: testSummary?.compositeScore ?? null,
        maxScore: 36,
        subtext: percentileLabel,
      };
    }

    if (category === "AP_CALC") {
      const compositeRaw = sectionResults.reduce((acc, sr) => acc + (sr.rawScore || 0), 0);
      const ptsText = `${compositeRaw}/108 pts`;
      return {
        label: "AP Score",
        score: testSummary?.compositeScore ?? null,
        maxScore: 5,
        subtext: percentileLabel ? `${ptsText} • ${percentileLabel}` : ptsText,
      };
    }

    if (category === "GRE") {
      return {
        label: "Total (V+Q)",
        score: testSummary?.compositeScore ?? null,
        maxScore: 340,
        subtext: percentileLabel,
      };
    }

    return {
      label: "Raw Score",
      score: testSummary?.compositeScore ?? null,
      maxScore: null,
      subtext: percentileLabel,
    };
  }, [metadata, sectionResults, testSummary, adaptiveTrajectory]);

  const formatNavTime = (seconds: number | string) => {
    const totalSeconds =
      typeof seconds === "string" ? parseInt(seconds, 10) : seconds;
    if (isNaN(totalSeconds)) return "0:00";
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const navData = React.useMemo(() => {
    return activeSectionResult?.navigationHistory || [];
  }, [activeSectionResult?.navigationHistory]);

  const maxNavQuestionIdx = React.useMemo(() => {
    const totalQuestions =
      activeSectionResult?.totalQuestions || activeResponses.length || 0;
    const maxVisitedIdx = navData.reduce(
      (max, entry) => Math.max(max, entry.qIdx),
      0
    );
    return Math.max(totalQuestions > 0 ? totalQuestions - 1 : 0, maxVisitedIdx);
  }, [activeSectionResult?.totalQuestions, activeResponses.length, navData]);

  const yAxisTicks = React.useMemo(() => {
    if (maxNavQuestionIdx <= 0) return [0];
    const tickCount = Math.min(6, maxNavQuestionIdx + 1);
    const ticks: number[] = [];
    for (let i = 0; i < tickCount; i++) {
      ticks.push(Math.floor((maxNavQuestionIdx / (tickCount - 1)) * i));
    }
    return Array.from(new Set(ticks));
  }, [maxNavQuestionIdx]);

  const isSatCategory = metadata.category.toUpperCase() === "SAT";
  const isAcademicCategory =
    metadata.category.toUpperCase() === "ACADEMIC" ||
    (metadata.scoring as any)?.scaleType === "ACADEMIC_PERCENTAGE";

  const hasAdaptiveScores =
    isSatCategory &&
    Boolean(adaptiveTrajectory?.stageSummaries && adaptiveTrajectory.stageSummaries.length > 0);

  const getSatModuleAbbreviation = (sr: SectionResultData, index: number) => {
    const id = (sr.sectionId || "").toLowerCase();
    const title = (sr.section?.title || "").toLowerCase();

    const orderIndex =
      sr.section?.sectionOrder !== undefined
        ? sr.section.sectionOrder - 1
        : index;

    const isModule2 =
      title.includes("module 2") ||
      title.includes("module-2") ||
      title.includes("section 2") ||
      title.includes("stage 2") ||
      title.includes("routed") ||
      title.includes("tier") ||
      id.includes("m2") ||
      id.includes("s2") ||
      id.includes("sec2") ||
      id.includes("hard") ||
      id.includes("easy") ||
      id.includes("standard") ||
      orderIndex === 1 ||
      orderIndex === 3;

    const isMath =
      title.includes("math") ||
      id.includes("math") ||
      orderIndex >= 2;

    if (isMath) {
      return isModule2 ? "M2" : "M1";
    }

    return isModule2 ? "RW2" : "RW1";
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full min-w-0">
      {/* COMBINED CARD: Scorecard Header + Uniform Target Key & Mode Toggle + Synchronized Pacing Graph */}
      <Card
        key={`chart-${activeSectionId}`}
        className="rounded-none w-full border border-slate-200 dark:border-slate-800 shadow-sm min-w-0"
      >
        <CardHeader className="flex flex-col items-stretch justify-between space-y-0 border-b border-slate-200 dark:border-slate-800 p-0 md:flex-row">
          <div className="flex md:flex-col flex-row flex-wrap justify-between md:justify-center items-center md:items-start gap-2 px-4 py-3">
            <CardTitle>{metadata.title || "Exam Results"}</CardTitle>
            <CardDescription className="hidden md:block">
              {chartMode === "bars"
                ? "Time spent per question in the selected section"
                : "Question-by-question pacing across domains and difficulty tiers"}
            </CardDescription>
          </div>

          <div className="flex flex-col md:flex-row items-stretch">
            {/* Section Selector Buttons */}
            <div className="flex flex-row overflow-x-auto md:overflow-visible no-scrollbar">
              {sectionResults.map((sr, idx) => {
                const stats = sectionStats[sr.sectionId];
                const isCurrent = activeSectionId === sr.sectionId;

                const displayScore = isAcademicCategory
                  ? stats ? `${stats.percentage.toFixed(0)}%` : "0%"
                  : sr.scaledScore !== null && sr.scaledScore !== undefined
                  ? sr.scaledScore
                  : stats
                  ? `${stats.percentage.toFixed(0)}%`
                  : "0%";

                const sectionTitle = isSatCategory
                  ? getSatModuleAbbreviation(sr, idx)
                  : sr.section.title.replace(/ - Section \d+/i, "");

                return (
                  <button
                    key={sr.sectionId}
                    type="button"
                    data-active={isCurrent ? "true" : "false"}
                    className={`min-h-14 flex flex-1 flex-col items-center justify-center gap-1 border-r last:border-r-0 md:last:border-r border-t border-slate-200 dark:border-slate-800 transition-colors hover:bg-muted/50 data-[active=true]:bg-muted/50 md:border-t-0 md:border-l ${
                      isSatCategory
                        ? "px-2.5 sm:px-3 py-2.5 md:min-w-16 lg:min-w-20 lg:px-6"
                        : "px-3 sm:px-4 py-2.5 md:min-w-28 lg:px-6"
                    }`}
                    onClick={() => setSelectedSectionId(sr.sectionId)}
                  >
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight line-clamp-1">
                      {sectionTitle}
                    </span>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold leading-none">
                      {displayScore}
                    </span>
                    {stats?.formattedTime && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        {stats.formattedTime}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Adaptive Stage Summaries */}
            {hasAdaptiveScores && (
              <div className="flex flex-row border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 bg-muted/20">
                {adaptiveTrajectory!.stageSummaries.map((summary) => {
                  const domainTitle =
                    summary.stageIndex === 1 ? "Reading & Writing" : "Mathematics";
                  const tierLabel =
                    summary.routedTier === "easy" ? "Standard Module" : "Higher-Difficulty Module";

                  return (
                    <div
                      key={summary.stageIndex}
                      className="flex flex-1 flex-col gap-1 justify-center items-center px-3 sm:px-6 py-2.5 text-center border-r last:border-r-0 md:last:border-r border-slate-200 dark:border-slate-800 md:min-w-32 lg:min-w-34"
                    >
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight line-clamp-1">
                        {domainTitle}
                      </span>
                      <span className="text-lg sm:text-xl md:text-2xl font-black leading-none text-foreground">
                        {summary.domainScore}
                        <span className="text-[10px] text-muted-foreground font-normal ml-0.5">
                          /800
                        </span>
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {tierLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Composite Score Card */}
            {scoreCard.score !== null && (
              <div className="flex flex-col gap-1 justify-center items-center px-4 sm:px-6 py-2.5 text-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 bg-primary/5 md:min-w-32 lg:min-w-36 shrink-0">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {scoreCard.label}
                </span>
                <span className="text-2xl md:text-3xl font-black leading-none text-primary md:text-foreground">
                  {scoreCard.score}
                  {scoreCard.maxScore && (
                    <span className="text-xs text-muted-foreground font-normal ml-0.5">
                      /{scoreCard.maxScore}
                    </span>
                  )}
                </span>
                {scoreCard.subtext && (
                  <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                    {scoreCard.subtext}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        {/* Sub-bar: Graph Title + Uniform Target & Target Zone Key + Chart View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 border-b border-border bg-muted/15">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="text-xs font-bold text-foreground">
              {chartMode === "bars"
                ? "Question Timing Bars"
                : "Domain & Difficulty Pacing"}
            </span>

            {targetPacingSeconds !== null && (
              <>
                <span className="text-border hidden sm:inline">|</span>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-0 border-t-2 border-dashed"
                      style={{ borderColor: OUTCOME_COLORS.target }}
                    />
                    <span>
                      Target Pace (
                      <span className="font-mono text-[11px] text-foreground">
                        {targetPacingSeconds}s
                      </span>
                      )
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-2.5 inline-block bg-blue-500/10 border-y border-dashed border-blue-500/40" />
                    <span>
                      Target Zone (
                      <span className="font-mono text-[11px] text-foreground">
                        {rushedFloorSec}s–{timeSinkCeilingSec}s
                      </span>
                      )
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div
            role="group"
            aria-label="Select pacing visualization"
            className="inline-flex border border-border bg-background p-0.5 rounded-none shrink-0"
          >
            <button
              type="button"
              onClick={() => setChartMode("bars")}
              className={`min-h-7 px-3 py-1 text-xs font-bold transition-colors ${
                chartMode === "bars"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Question Bars
            </button>
            <button
              type="button"
              onClick={() => setChartMode("timeline")}
              className={`min-h-7 px-3 py-1 text-xs font-bold transition-colors ${
                chartMode === "timeline"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Domain Pacing
            </button>
          </div>
        </div>

        <CardContent className="px-2 sm:p-6 min-w-0 space-y-4">
          {!mounted ? (
            <div className="h-[300px] w-full animate-pulse bg-muted/20" />
          ) : chartMode === "timeline" ? (
            <SectionPacingTimeline
              metadata={metadata}
              sectionResults={sectionResults}
              responses={responses}
              activeSectionId={activeSectionId}
              hideCardWrapper
              isLg={isLg}
            />
          ) : topChartData.length > 0 ? (
            <>
              {!isLg ? (
                <div className="w-full min-w-0">
                  <ChartContainer
                    config={topBarConfig}
                    className="w-full min-w-0"
                    style={{ height: `${topChartData.length * 30}px`, minHeight: "150px" }}
                  >
                    <BarChart
                      data={topChartData}
                      layout="vertical"
                      margin={{ left: 0, right: 12, top: 10, bottom: 0 }}
                    >
                      <CartesianGrid vertical={true} horizontal={false} />
                      <XAxis
                        type="number"
                        orientation="top"
                        height={40}
                        domain={[0, timeAxisCap]}
                        tickFormatter={(v) => (v === timeAxisCap ? `${v}s+` : `${v}s`)}
                        label={{
                          value: "Time Spent (s)",
                          fontSize: 10,
                          fontWeight: "bold",
                          position: "insideTop",
                          offset: 5,
                        }}
                      />
                      <YAxis
                        dataKey="question"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        width={40}
                        tickFormatter={(value) => `Q${value}`}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            hideLabel
                            labelFormatter={(value) => `Question ${value}`}
                            formatter={(_val, _name, item) => {
                              const payload = item?.payload;
                              if (!payload) return null;
                              return (
                                <span className="font-mono text-xs">
                                  <strong>{payload.trueTime}s</strong>
                                  {payload.isClamped ? ` (capped at ${timeAxisCap}s+)` : ""}
                                </span>
                              );
                            }}
                          />
                        }
                      />

                      {targetPacingSeconds !== null && (
                        <>
                          <ReferenceArea
                            x1={rushedFloorSec}
                            x2={timeSinkCeilingSec}
                            fill="#2563eb"
                            fillOpacity={0.06}
                            ifOverflow="extendDomain"
                          />
                          <ReferenceLine
                            x={rushedFloorSec}
                            stroke="#2563eb"
                            strokeDasharray="3 3"
                            strokeOpacity={0.35}
                          />
                          <ReferenceLine
                            x={targetPacingSeconds}
                            stroke={OUTCOME_COLORS.target}
                            strokeDasharray="4 4"
                            strokeWidth={1.5}
                          />
                          <ReferenceLine
                            x={timeSinkCeilingSec}
                            stroke="#2563eb"
                            strokeDasharray="3 3"
                            strokeOpacity={0.35}
                          />
                        </>
                      )}

                      <Bar dataKey="plottedTime" radius={[0, 4, 4, 0]}>
                        {topChartData.map((entry, index) => (
                          <Cell
                            key={`cell-mobile-${index}`}
                            fill={entry.fill}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="w-full min-w-0">
                  <ChartContainer
                    config={topBarConfig}
                    initialDimension={{ width: 960, height: 300 }}
                    className="aspect-auto h-[300px] pt-2 w-full min-w-0"
                  >
                    <BarChart
                      accessibilityLayer
                      data={topChartData}
                      layout="horizontal"
                      margin={{ left: 12, right: 12, top: 14 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="question"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={5}
                        fontSize={12}
                      />
                      <YAxis
                        tickLine={false}
                        tickMargin={5}
                        fontSize={12}
                        axisLine={false}
                        domain={[0, timeAxisCap]}
                        tickFormatter={(v) => (v === timeAxisCap ? `${v}s+` : `${v}s`)}
                        label={{
                          value: "Time (s)",
                          angle: -90,
                          position: "insideLeft",
                          fontSize: 10,
                          fontWeight: "bold",
                          dy: 15,
                        }}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            className="w-44"
                            labelFormatter={(value) => `Question ${value}`}
                            formatter={(_val, _name, item) => {
                              const payload = item?.payload;
                              if (!payload) return null;
                              return (
                                <span className="font-mono text-xs">
                                  Time: <strong>{payload.trueTime}s</strong>
                                  {payload.isClamped ? ` (${timeAxisCap}s+ cap)` : ""}
                                </span>
                              );
                            }}
                          />
                        }
                      />

                      {targetPacingSeconds !== null && (
                        <>
                          <ReferenceArea
                            y1={rushedFloorSec}
                            y2={timeSinkCeilingSec}
                            fill="#2563eb"
                            fillOpacity={0.06}
                            ifOverflow="extendDomain"
                          />
                          <ReferenceLine
                            y={rushedFloorSec}
                            stroke="#2563eb"
                            strokeDasharray="3 3"
                            strokeOpacity={0.35}
                          />
                          <ReferenceLine
                            y={targetPacingSeconds}
                            stroke={OUTCOME_COLORS.target}
                            strokeDasharray="4 4"
                            strokeWidth={1.5}
                          />
                          <ReferenceLine
                            y={timeSinkCeilingSec}
                            stroke="#2563eb"
                            strokeDasharray="3 3"
                            strokeOpacity={0.35}
                          />
                        </>
                      )}

                      <Bar dataKey="plottedTime" radius={[4, 4, 0, 0]}>
                        {topChartData.map((entry, index) => (
                          <Cell
                            key={`cell-desktop-${index}`}
                            fill={entry.fill}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              )}

              {/* Legend Strip Below Bar Chart */}
              <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4 text-[11px] sm:text-xs font-medium bg-muted/20 border border-border/60 px-3 py-2.5">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: OUTCOME_COLORS.correct }}
                    />
                    <span>Correct</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: OUTCOME_COLORS.incorrect }}
                    />
                    <span>Missed</span>
                  </div>
                </div>

                {clampedBarCount > 0 && (
                  <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                    {clampedBarCount} capped at {timeAxisCap}s+ (hover for exact time)
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No response data available for the selected section.
            </div>
          )}
        </CardContent>
      </Card>

      {/* BOTTOM ROW: Question Navigation Timeline (1/3) + Accuracy by Topic & Skill Accordion (2/3) */}
      <div className="flex flex-col lg:flex-row gap-4 w-full min-w-0">
        {activeSectionResult && (
          <div className="w-full lg:w-1/3 min-w-0">
            <Card className="rounded-none w-full h-fit border border-slate-200 dark:border-slate-800 shadow-sm min-w-0">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 border-b border-slate-200 dark:border-slate-800 min-h-16 px-4 py-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <CardTitle className="text-sm sm:text-base font-bold truncate">
                    Question Navigation Timeline
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-1">
                    Order in which you moved through questions
                  </CardDescription>
                </div>

                <div className="flex items-center gap-1.5 text-blue-500 text-xs sm:text-sm bg-blue-500/10 px-2 py-1 rounded-none border border-blue-500/20 font-mono font-semibold shrink-0">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  {formatNavTime(activeSectionResult.timeRemainingSeconds)}
                </div>
              </CardHeader>

              <CardContent className="pt-6 px-3 sm:px-5 min-w-0">
                {!mounted ? (
                  <div className="h-64 w-full animate-pulse bg-muted/20" />
                ) : navData.length > 0 ? (
                  <ChartContainer
                    config={navChartConfig}
                    className="aspect-auto h-64 w-full min-w-0"
                  >
                    <LineChart
                      data={navData}
                      margin={{ top: 12, right: 12, left: 4, bottom: 20 }}
                    >
                      <CartesianGrid horizontal={true} vertical={false} />
                      <XAxis
                        dataKey="time"
                        type="number"
                        domain={[0, "dataMax"]}
                        tickFormatter={formatNavTime}
                        stroke="#888888"
                        fontSize={11}
                        tickLine={false}
                        axisLine={true}
                        label={{
                          value: "Elapsed Time",
                          position: "bottom",
                          offset: 0,
                          className:
                            "fill-muted-foreground text-[10px] uppercase font-bold",
                        }}
                      />
                      <YAxis
                        dataKey="qIdx"
                        stroke="#888888"
                        fontSize={11}
                        allowDecimals={false}
                        domain={[0, maxNavQuestionIdx]}
                        ticks={yAxisTicks}
                        tickLine={true}
                        axisLine={true}
                        width={42}
                        tickFormatter={(val) => `Q${val + 1}`}
                        label={{
                          value: "Question #",
                          angle: -90,
                          position: "insideLeft",
                          className:
                            "fill-muted-foreground text-[10px] uppercase font-bold",
                        }}
                      />
                      <Tooltip
                        content={<ChartTooltipContent hideLabel />}
                        formatter={(value: any) => [`Question ${Number(value) + 1}`]}
                        labelFormatter={(label) => `At ${formatNavTime(Number(label))}`}
                      />
                      <Line
                        type="stepAfter"
                        dataKey="qIdx"
                        stroke="hsl(220 70% 50%)"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    No navigation history recorded for this section.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className={activeSectionResult ? "w-full lg:w-2/3 min-w-0" : "w-full min-w-0"}>
          <TopicSkillAccuracyAccordion responses={activeResponses} />
        </div>
      </div>
    </div>
  );
}