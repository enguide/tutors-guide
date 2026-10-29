/* eslint-disable @typescript-eslint/no-explicit-any */
// components/analytics/UnifiedAnalyticsDashboard.tsx
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
import { TopicSkillAccuracyAccordion } from "@/components/analytics/TopicSkillAccuracyAccordion";

// --- Difficulty Mapping ---
const DIFFICULTY_LABELS: Record<string, string> = {
  "1": "Easy",
  "2": "Moderate",
  "3": "Hard",
  "4": "Expert",
  Easy: "Easy",
  Medium: "Moderate",
  Moderate: "Moderate",
  Hard: "Hard",
  Expert: "Expert",
};

const DIFFICULTY_ORDER: Record<string, number> = {
  Easy: 1,
  Moderate: 2,
  Hard: 3,
  Expert: 4,
  Unrated: 99,
};

const useWindowDimensions = () => {
  const [state, setState] = React.useState({
    fontSize: 11,
    isLg: false,
    mounted: false,
  });

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setState({
        fontSize: width < 640 ? 11 : width < 1024 ? 12 : 13,
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
  Time: {
    label: "Time (s)",
    color: "#444444",
  },
} satisfies ChartConfig;

const navChartConfig = {
  qIdx: {
    label: "Question Number",
    color: "hsl(220 70% 50%)",
  },
} satisfies ChartConfig;

const accuracyChartConfig = {
  correct: { label: "Correct", color: "#444444" },
  incorrect: { label: "Incorrect", color: "#ff9999" },
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
  const { fontSize, isLg, mounted } = useWindowDimensions();

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

  // Top Bar Chart Data
  const topChartData = React.useMemo(() => {
    return activeResponses.map((r, index) => ({
      question: `${index + 1}`,
      Time: r.timeSpentOnResponse || 0,
      fill: r.isCorrect ? "#444444" : "#ff9999",
      isCorrect: r.isCorrect,
    }));
  }, [activeResponses]);

  // Section metrics for tabs
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

  // Unified Total / Composite Score definition
  const scoreCard = React.useMemo(() => {
    const category = metadata.category.toUpperCase();

    if (category === "SAT") {
      if (adaptiveTrajectory?.compositeScore) {
        return {
          label: "Total Score",
          score: adaptiveTrajectory.compositeScore,
          maxScore: 1600,
          subtext: null,
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
        subtext: null,
      };
    }

    if (category === "ACT") {
      return {
        label: "Composite",
        score: testSummary?.compositeScore ?? null,
        maxScore: 36,
        subtext: null,
      };
    }

    if (category === "AP_CALC") {
      const compositeRaw = sectionResults.reduce((acc, sr) => acc + (sr.rawScore || 0), 0);
      return {
        label: "AP Grade",
        score: testSummary?.compositeScore ?? null,
        maxScore: 5,
        subtext: `${compositeRaw}/108 pts`,
      };
    }

    if (category === "GRE") {
      return {
        label: "Total (V+Q)",
        score: testSummary?.compositeScore ?? null,
        maxScore: 340,
        subtext: null,
      };
    }

    return {
      label: "Raw Score",
      score: testSummary?.compositeScore ?? null,
      maxScore: null,
      subtext: null,
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

  const yAxisTicks = React.useMemo(() => {
    if (!navData || navData.length === 0) return [0];
    const maxIdx = navData[navData.length - 1].qIdx;
    const tickCount = 6;
    const ticks: number[] = [];
    for (let i = 0; i < tickCount; i++) {
      ticks.push(Math.floor((maxIdx / (tickCount - 1)) * i));
    }
    return Array.from(new Set(ticks));
  }, [navData]);

  const accuracyData = React.useMemo(() => {
    const grouped = {
      difficulties: {} as Record<string, { correct: number; incorrect: number }>,
    };

    activeResponses.forEach((response) => {
      const { isCorrect } = response;
      const rawDiff = response.difficulty || "";
      const difficulty = DIFFICULTY_LABELS[rawDiff] || rawDiff || "Unrated";

      if (!grouped.difficulties[difficulty]) {
        grouped.difficulties[difficulty] = { correct: 0, incorrect: 0 };
      }
      if (isCorrect) grouped.difficulties[difficulty].correct++;
      else grouped.difficulties[difficulty].incorrect++;
    });

    const formatCategory = (cat: Record<string, { correct: number; incorrect: number }>) =>
      Object.entries(cat).map(([name, metrics]) => ({
        name,
        correct: metrics.correct,
        incorrect: metrics.incorrect,
      }));

    return {
      difficulties: formatCategory(grouped.difficulties).sort(
        (a, b) => (DIFFICULTY_ORDER[a.name] || 99) - (DIFFICULTY_ORDER[b.name] || 99)
      ),
    };
  }, [activeResponses]);

  const calculateChartHeight = (itemCount: number) => {
    const step = 45;
    const minHeight = 150;
    return Math.max(minHeight, itemCount * step);
  };

  const isSatCategory = metadata.category.toUpperCase() === "SAT";
  const hasAdaptiveScores =
    isSatCategory &&
    Boolean(adaptiveTrajectory?.stageSummaries && adaptiveTrajectory.stageSummaries.length > 0);

  const getSatModuleAbbreviation = (sr: SectionResultData, index: number) => {
  const id = (sr.sectionId || "").toLowerCase();
  const title = (sr.section?.title || "").toLowerCase();
  
  // Use sectionOrder if present on section, otherwise array index
  const orderIndex = sr.section?.sectionOrder !== undefined 
    ? sr.section.sectionOrder - 1 
    : index;

  // 1. Direct Module 2 checks
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

  // Reading & Writing
  return isModule2 ? "RW2" : "RW1";
};

  return (
    <div className="flex flex-col items-center align-middle mx-1 sm:mx-8 gap-4 w-full min-w-0">
      {/* =========================================================================
          1. TOP RESULTS & PACING BAR CHART
         ========================================================================= */}
      <Card
        key={`chart-${activeSectionId}`}
        className="rounded-none w-full xl:w-337.5 xl:min-w-337.5 border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <CardHeader className="flex flex-col items-stretch justify-between space-y-0 border-b border-slate-200 dark:border-slate-800 p-0 md:flex-row">
          {/* Title & Legend */}
          <div className="flex md:flex-col flex-row justify-between md:justify-center items-center md:items-start gap-1 px-4 py-3">
            <CardTitle>{metadata.title || "Exam Results"}</CardTitle>
            <CardDescription className="hidden md:block">
              Total time spent on each question
            </CardDescription>

            <div className="flex flex-row items-center gap-4 mt-1">
              <div className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-xs"
                  style={{ backgroundColor: "#444444" }}
                ></span>
                <span className="text-[10px] sm:text-sm">Correct</span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-xs"
                  style={{ backgroundColor: "#ff9999" }}
                ></span>
                <span className="text-[10px] sm:text-sm">Incorrect</span>
              </div>
            </div>
          </div>

          {/* Section Buttons, Domain Scores, & Master Score Anchor */}
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Clickable Section Navigation Tabs */}
            <div className="flex flex-row overflow-x-auto md:overflow-visible no-scrollbar">
              {sectionResults.map((sr, idx) => {
                const stats = sectionStats[sr.sectionId];
                const isCurrent = activeSectionId === sr.sectionId;

                const displayScore =
                  sr.scaledScore !== null && sr.scaledScore !== undefined
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
                    data-active={isCurrent ? "true" : "false"}
                    className={`flex flex-1 flex-col items-center justify-center gap-1 border-r border-t border-slate-200 dark:border-slate-800 transition-colors hover:bg-muted/50 data-[active=true]:bg-muted/50 md:border-t-0 md:border-l ${
                      isSatCategory
                        ? "px-3 py-2.5 md:min-w-16 lg:min-w-20 lg:px-6"
                        : "px-4 py-2.5 md:min-w-28 lg:px-6"
                    }`}
                    onClick={() => setSelectedSectionId(sr.sectionId)}
                  >
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight line-clamp-1">
                      {sectionTitle}
                    </span>
                    <span className="text-xl md:text-2xl font-bold leading-none">
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

            {/* Adaptive SAT Domain Scores (Reading & Writing / Math 200–800) */}
            {hasAdaptiveScores && (
              <div className="flex flex-row border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 bg-muted/20">
                {adaptiveTrajectory!.stageSummaries.map((summary) => {
                  const domainTitle =
                    summary.stageIndex === 1 ? "Reading & Writing" : "Mathematics";
                  const tierLabel =
                    summary.routedTier === "easy" ? "Standard Tier" : "Hard Tier";

                  return (
                    <div
                      key={summary.stageIndex}
                      className="flex flex-1 flex-col gap-1 justify-center items-center px-6 py-2.5 text-center border-r md:border-r border-slate-200 dark:border-slate-800 md:min-w-32 lg:min-w-34 shrink-0"
                    >
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight line-clamp-1">
                        {domainTitle}
                      </span>
                      <span className="text-xl md:text-2xl font-black leading-none text-foreground">
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

            {/* Master Composite Score Pillar (Rightmost Anchor) */}
            {scoreCard.score !== null && (
              <div className="flex flex-col gap-1 justify-center items-center px-6 py-2.5 text-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 bg-primary/5 md:min-w-32 lg:min-w-36 shrink-0">
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

        <CardContent className="px-2 sm:p-6 min-w-0">
          {!mounted ? (
            <div className="h-32 w-full animate-pulse bg-muted/20" />
          ) : topChartData.length > 0 ? (
            !isLg ? (
              /* MOBILE VIEW (Mounted only when screen is < lg) */
              <div className="w-full min-w-0">
                <ChartContainer
                  config={topBarConfig}
                  className="w-full min-w-0"
                  style={{ height: `${topChartData.length * 30}px`, minHeight: "150px" }}
                >
                  <BarChart
                    data={topChartData}
                    layout="vertical"
                    margin={{ left: 0, right: 10, top: 10, bottom: 0 }}
                  >
                    <CartesianGrid vertical={true} horizontal={false} />
                    <XAxis
                      type="number"
                      orientation="top"
                      height={40}
                      label={{
                        value: "Time (s)",
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
                        />
                      }
                    />
                    <Bar dataKey="Time" radius={[0, 4, 4, 0]}>
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
              /* DESKTOP VIEW (Mounted only when screen is >= lg) */
              <div className="w-full min-w-0">
                <ChartContainer
                  config={topBarConfig}
                  className="aspect-auto h-31.25 pt-2 w-full min-w-0"
                >
                  <BarChart
                    accessibilityLayer
                    data={topChartData}
                    layout="horizontal"
                    margin={{ left: 12, right: 12 }}
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
                          className="w-37.5"
                          nameKey="Time"
                          labelFormatter={(value) => `Question ${value}`}
                        />
                      }
                    />
                    <Bar dataKey="Time" radius={[4, 4, 0, 0]}>
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
            )
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No response data available for the selected section.
            </div>
          )}
        </CardContent>
      </Card>

      {/* =========================================================================
          2. SECTION NAVIGATION CHART
         ========================================================================= */}
      {activeSectionResult && (
        <Card className="rounded-none w-full xl:w-337.5 xl:min-w-337.5 min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b h-16 px-5 py-3.5">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-base font-bold">
                Section Navigation
              </CardTitle>
            </div>

            <div className="flex flex-row items-center gap-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                Time Remaining
              </span>
              <div className="flex items-center gap-2 text-blue-500 text-base sm:text-sm bg-blue-500/10 px-2 py-1 rounded-none border border-blue-500/20">
                <Clock className="w-5 h-5" />
                {formatNavTime(activeSectionResult.timeRemainingSeconds)}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 min-w-0">
            {!mounted ? (
              <div className="h-56 w-full animate-pulse bg-muted/20" />
            ) : navData.length > 0 ? (
              <ChartContainer
                config={navChartConfig}
                className="aspect-video sm:aspect-2/1 md:aspect-3/1 lg:aspect-4/1 w-full min-w-0 min-h-[220px]"
              >
                <LineChart
                  data={navData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid horizontal={true} vertical={false} />
                  <XAxis
                    dataKey="time"
                    type="number"
                    domain={[0, "dataMax"]}
                    tickFormatter={formatNavTime}
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={true}
                    label={{
                      value: "Test Elapsed Time",
                      position: "bottom",
                      offset: 0,
                      className:
                        "fill-muted-foreground text-[10px] uppercase font-bold",
                    }}
                  />
                  <YAxis
                    dataKey="qIdx"
                    stroke="#888888"
                    fontSize={12}
                    allowDecimals={false}
                    domain={[0, navData[navData.length - 1].qIdx]}
                    ticks={yAxisTicks}
                    tickLine={true}
                    axisLine={true}
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
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No navigation data available for this section.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          3. ACCURACY CHARTS
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-337.5 xl:min-w-337.5 min-w-0">
        {/* Left Column: Topics with Nested Skills Accordion */}
        <div className="w-full lg:w-2/3 min-w-0">
          <TopicSkillAccuracyAccordion responses={activeResponses} />
        </div>

        {/* Right Column: Difficulty Breakdown */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 min-w-0">
          <Card className="rounded-none w-full h-fit min-w-0">
            <CardHeader className="border-b">
              <CardTitle>By Difficulty</CardTitle>
              <CardDescription>
                Performance across difficulty levels.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 min-w-0">
              {!mounted ? (
                <div className="h-40 w-full animate-pulse bg-muted/20" />
              ) : (
                <ChartContainer
                  config={accuracyChartConfig}
                  className="w-full min-w-0"
                  style={{
                    height: calculateChartHeight(accuracyData.difficulties.length),
                    minHeight: "150px",
                  }}
                >
                  <BarChart
                    data={accuracyData.difficulties}
                    layout="vertical"
                    margin={{ left: 5, right: 5 }}
                  >
                    <CartesianGrid horizontal vertical />
                    <XAxis
                      type="number"
                      tick={{ fontSize }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize }}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar
                      dataKey="correct"
                      fill="#444444"
                      stackId="a"
                      radius={0}
                    />
                    <Bar
                      dataKey="incorrect"
                      fill="#ff9999"
                      stackId="a"
                      radius={0}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}