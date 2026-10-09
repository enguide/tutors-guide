/* eslint-disable @typescript-eslint/no-explicit-any */
// components/analytics/UnifiedAnalyticsDashboard.tsx
"use client";

import * as React from "react";
import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
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
  ChevronLeft, 
  ChevronRight, 
  Calculator, 
  RefreshCw // or ArrowLeftRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { EnrichedResponseItem, SectionResultData, TestSummaryData } from "@/types/analytics";
import { TestMetadata } from "@/types/content";

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

const useFontSize = () => {
  const [fontSize, setFontSize] = React.useState(11);
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setFontSize(11);
      else if (window.innerWidth < 1024) setFontSize(12);
      else setFontSize(13);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return fontSize;
};

const usePaddingSize = () => {
  const [paddingSize, setPaddingSize] = React.useState(30);
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setPaddingSize(0);
      else if (window.innerWidth < 1024) setPaddingSize(20);
      else setPaddingSize(30);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return paddingSize;
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
}

export default function UnifiedAnalyticsDashboard({
  metadata,
  testSummary,
  sectionResults,
  responses,
}: UnifiedAnalyticsDashboardProps) {
  const fontSize = useFontSize();
  const paddingSize = usePaddingSize();

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
      response: r,
    }));
  }, [activeResponses]);

  // Active question card state
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState<number>(0);
  const [responseIsVisible, setResponseIsVisible] = React.useState(false);

  const activeQuestionItem = topChartData[selectedQuestionIndex] || topChartData[0];

  const handleBarClick = (data: any, index: number) => {
    if (typeof index === "number" && index >= 0) {
      setSelectedQuestionIndex(index);
    }
  };

  const previousQuestion = () => {
    if (selectedQuestionIndex > 0) {
      setSelectedQuestionIndex((prev) => prev - 1);
    }
  };

  const nextQuestion = () => {
    if (selectedQuestionIndex < topChartData.length - 1) {
      setSelectedQuestionIndex((prev) => prev + 1);
    }
  };

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

  // Scaled Score partitions
  const partitionScores = React.useMemo(() => {
    const isSAT = metadata.category.toUpperCase() === "SAT";
    if (!isSAT) {
      return {
        hasPartitions: false,
        sections: sectionResults.map((sr) => ({
          title: sr.section.title,
          score: sr.scaledScore ?? sr.rawScore,
        })),
        totalScore: testSummary?.compositeScore ?? null,
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
      hasPartitions: true,
      erScore: erScore || null,
      mathScore: mathScore || null,
      totalScore: totalScore || null,
    };
  }, [metadata, sectionResults, testSummary]);

  const formatNavTime = (seconds: number | string) => {
    const totalSeconds =
      typeof seconds === "string" ? parseInt(seconds, 10) : seconds;
    if (isNaN(totalSeconds)) return "0:00";
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const navData = activeSectionResult?.navigationHistory || [];

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
      topics: {} as Record<string, { correct: number; incorrect: number }>,
      skills: {} as Record<string, { correct: number; incorrect: number }>,
      difficulties: {} as Record<string, { correct: number; incorrect: number }>,
    };

    activeResponses.forEach((response) => {
      const { isCorrect } = response;
      const topic = response.domain || "Unknown Topic";
      const skill = response.skill || "Unknown Skill";
      const rawDiff = response.difficulty || "";
      const difficulty = DIFFICULTY_LABELS[rawDiff] || rawDiff || "Unrated";

      const categories = [
        { key: "topics" as const, val: topic },
        { key: "skills" as const, val: skill },
        { key: "difficulties" as const, val: difficulty },
      ];

      categories.forEach(({ key, val }) => {
        if (!grouped[key][val]) {
          grouped[key][val] = { correct: 0, incorrect: 0 };
        }
        if (isCorrect) grouped[key][val].correct++;
        else grouped[key][val].incorrect++;
      });
    });

    const formatCategory = (cat: Record<string, { correct: number; incorrect: number }>) =>
      Object.entries(cat).map(([name, metrics]) => ({
        name,
        correct: metrics.correct,
        incorrect: metrics.incorrect,
      }));

    return {
      skills: formatCategory(grouped.skills).sort((a, b) => b.incorrect - a.incorrect),
      topics: formatCategory(grouped.topics).sort((a, b) => b.incorrect - a.incorrect),
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

  return (
    <div className="flex flex-col items-center align-middle mx-1 sm:mx-8 gap-4 w-full">
      {/* =========================================================================
          1. TOP RESULTS & PACING BAR CHART
         ========================================================================= */}
      <Card
        key={`chart-${activeSectionId}`}
        className="rounded-none w-full xl:w-[1350px] xl:min-w-[1350px] border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <CardHeader className="flex flex-col items-stretch justify-between space-y-0 border-b border-slate-200 dark:border-slate-800 p-0 md:flex-row">
          <div className="flex md:flex-col flex-row justify-between md:justify-center items-center md:items-start gap-1 px-4 py-3">
            <CardTitle>{metadata.title || "SAT Results"}</CardTitle>
            <CardDescription className="hidden md:block">
              Total time spent on each question
            </CardDescription>

            <div className="flex flex-row items-center gap-4 mt-1">
              <div className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-[2px]"
                  style={{ backgroundColor: "#444444" }}
                ></span>
                <span className="text-[10px] sm:text-sm">Correct</span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-[2px]"
                  style={{ backgroundColor: "#ff9999" }}
                ></span>
                <span className="text-[10px] sm:text-sm">Incorrect</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="hidden xl:flex border-t border-b md:border-t-0 md:border-b-0 divide-x bg-muted/5 md:bg-transparent md:order-last">
              {partitionScores.hasPartitions ? (
                <>
                  {partitionScores.erScore !== null && (
                    <div className="flex flex-1 flex-col justify-center px-4 py-2 text-center md:px-8">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        English
                      </span>
                      <span className="text-xl md:text-4xl font-bold leading-none">
                        {partitionScores.erScore}
                      </span>
                    </div>
                  )}
                  {partitionScores.mathScore !== null && (
                    <div className="flex flex-1 flex-col justify-center px-4 py-2 text-center md:px-8">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        Math
                      </span>
                      <span className="text-xl md:text-4xl font-bold leading-none">
                        {partitionScores.mathScore}
                      </span>
                    </div>
                  )}
                  {partitionScores.totalScore !== null && (
                    <div className="flex flex-1 flex-col justify-center px-4 py-2 text-center md:border-l md:px-8 bg-primary/5 md:bg-transparent">
                      <span className="text-[10px] font-bold md:font-normal text-primary md:text-muted-foreground uppercase">
                        Total
                      </span>
                      <span className="text-xl md:text-4xl font-black md:font-bold leading-none text-primary md:text-foreground">
                        {partitionScores.totalScore}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-1 flex-col justify-center px-4 py-2 text-center md:px-8">
                  <span className="text-[10px] text-muted-foreground uppercase">
                    Composite
                  </span>
                  <span className="text-xl md:text-4xl font-bold leading-none">
                    {partitionScores.totalScore ?? "—"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-row overflow-x-auto md:overflow-visible no-scrollbar">
              {sectionResults.map((sr) => {
  const stats = sectionStats[sr.sectionId];
  return (
    <button
      key={sr.sectionId}
      data-active={activeSectionId === sr.sectionId ? "true" : "false"}
      className="flex flex-1 flex-col items-center justify-center gap-1 border-r border-t border-slate-200 dark:border-slate-800 px-4 py-2 text-center transition-colors hover:bg-muted/50 data-[active=true]:bg-muted/50 md:border-t-0 md:border-l md:min-w-[100px] lg:px-8 lg:py-2"
      onClick={() => {
        setSelectedSectionId(sr.sectionId);
        setSelectedQuestionIndex(0);
        setResponseIsVisible(false);
      }}
    >
      <span className="text-[10px] text-muted-foreground uppercase">
        {sr.section.title}
      </span>
      <span className="text-lg md:text-2xl font-bold leading-none">
        {stats ? stats.percentage.toFixed(0) : 0}%
      </span>
      {stats?.formattedTime && (
        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
          <Clock className="w-2.5 h-2.5" />
          {stats.formattedTime}
        </span>
      )}
    </button>
  );
})}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-2 sm:p-6">
          {topChartData.length > 0 ? (
            <>
              {/* MOBILE VIEW */}
              <div className="block lg:hidden">
                <ChartContainer
                  config={topBarConfig}
                  className="w-full"
                  style={{ height: `${topChartData.length * 30}px` }}
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
                        fill: "hsl(var(--primary))",
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
                    <Bar
                      dataKey="Time"
                      radius={[0, 4, 4, 0]}
                      onClick={(data: any, idx: number) => handleBarClick(data, idx)}
                    >
                      {topChartData.map((entry, index) => (
                        <Cell
                          key={`cell-mobile-${index}`}
                          fill={entry.fill}
                          stroke={index === selectedQuestionIndex ? "hsl(var(--primary))" : "none"}
                          strokeWidth={index === selectedQuestionIndex ? 2 : 0}
                          className="cursor-pointer"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>

              {/* DESKTOP VIEW */}
              <div className="hidden lg:block">
                <ChartContainer
                  config={topBarConfig}
                  className="aspect-auto h-[125px] pt-2 w-full"
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
                        fill: "hsl(var(--primary))",
                        dy: 15,
                      }}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          className="w-[150px]"
                          nameKey="Time"
                          labelFormatter={(value) => `Question ${value}`}
                        />
                      }
                    />
                    <Bar
                      dataKey="Time"
                      radius={[4, 4, 0, 0]}
                      onClick={(data: any, idx: number) => handleBarClick(data, idx)}
                    >
                      {topChartData.map((entry, index) => (
                        <Cell
                          key={`cell-desktop-${index}`}
                          fill={entry.fill}
                          stroke={index === selectedQuestionIndex ? "hsl(var(--primary))" : "none"}
                          strokeWidth={index === selectedQuestionIndex ? 2 : 0}
                          className="cursor-pointer"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No response data available for the selected section.
            </div>
          )}
        </CardContent>
      </Card>

      {/* =========================================================================
          2. INDIVIDUAL QUESTION & RESPONSE INSPECTION CARD
         ========================================================================= */}
      {activeQuestionItem && activeQuestionItem.response && (
        <Card
          key={`${activeSectionId}-q-${activeQuestionItem.question}`}
          className="rounded-none mt-1 min-h-full w-full xl:min-h-[520px] xl:w-[1350px] bg-primary-foreground border shadow-sm"
        >
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row bg-card">
            <div className="flex flex-1 flex-row justify-between gap-1 px-3 pt-3 pb-2">
              <CardTitle>
                <div className="hidden sm:block">
                  {activeSectionResult?.section.title || "Section"} - Question {activeQuestionItem.question}
                </div>
                <div className="flex flex-row items-center sm:hidden">
                  {activeSectionResult?.section.title} <ChevronRight /> Question {activeQuestionItem.question}
                </div>
              </CardTitle>
              <CardDescription className="flex flex-row items-center">
                <div className="flex gap-1.5 mx-2">
                  {activeQuestionItem.response.usedCalculator && (
                    <div title="Used Calculator">
                      <Calculator className="w-5 h-5 text-blue-500" />
                    </div>
                  )}
                  {activeQuestionItem.response.changedAnswer && (
                    <div title="Changed Answer">
                      <RefreshCw className="w-5 h-5 text-blue-500" />
                    </div>
                  )}
                </div>

                {activeQuestionItem.isCorrect ? (
                  <div
                    style={{
                      backgroundColor: "#444444",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      fontSize: "0.8em",
                      display: "inline-block",
                      marginRight: "5px",
                    }}
                  >
                    Correct
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#ff9999",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      fontSize: "0.8em",
                      display: "inline-block",
                      marginRight: "5px",
                    }}
                  >
                    Incorrect
                  </div>
                )}

                <div className="hidden sm:block text-xs font-semibold">
                  - Time: {activeQuestionItem.Time}s
                </div>
                <div className="block sm:hidden text-xs font-semibold">
                  {activeQuestionItem.Time}s
                </div>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="w-full flex flex-col xl:flex-row p-4 bg-primary-foreground gap-6">
            {/* Left Prompt Pane */}
            <div className="flex-1 flex flex-col p-2 xl:p-4 max-h-[500px] overflow-y-auto">
              <div className="text-sm md:text-base leading-relaxed font-serif non-latex-question-content">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {activeQuestionItem.response.prompt}
                </ReactMarkdown>
              </div>
            </div>

            <div className="hidden xl:block border-l border-gray-300 dark:border-gray-700" />

            {/* Right Options / Answers Pane */}
            <div className="xl:w-1/2 flex flex-col justify-start">
              {activeQuestionItem.response.responseType === "MC" ? (
                <div className="flex flex-col gap-2 mb-4">
                  {activeQuestionItem.response.options?.map((option) => {
                    const isSelected = activeQuestionItem.response.selectedOptionId === option.id;
                    const isKey = activeQuestionItem.response.correctAnswerKey === option.id;

                    let bgClasses = "border rounded-none px-4 py-2 text-sm";
                    if (responseIsVisible) {
                      if (isKey) {
                        bgClasses = "border rounded-none px-4 py-2 text-sm text-white" + " bg-[#444444] border-[#444444]";
                      } else if (isSelected && !isKey) {
                        bgClasses = "border rounded-none px-4 py-2 text-sm text-white" + " bg-[#ff9999] border-[#ff9999]";
                      }
                    } else if (isSelected) {
                      bgClasses = "border-2 border-primary rounded-none px-4 py-2 text-sm bg-muted/30";
                    }

                    return (
                      <div key={option.id} className={bgClasses}>
                        <div className="flex items-start gap-2 font-serif text-sm">
                          <span className="font-bold shrink-0">{option.id}.</span>
                          <div className="flex-1">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {option.text}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* FRQ / Free Response answers */
                <div className="flex flex-col gap-3 mb-4">
                  <div className="p-3 border rounded-none bg-muted/20">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Your Answer
                    </span>
                    <span className="font-mono text-sm font-bold">
                      {activeQuestionItem.response.frqUserAnswer || "(Blank / Omitted)"}
                    </span>
                  </div>

                  {responseIsVisible && (
                    <div className="p-3 border rounded-none bg-[#444444] text-white">
                      <span className="text-[10px] uppercase font-bold text-gray-300 block mb-1">
                        Correct Answer
                      </span>
                      <span className="font-mono text-sm font-bold">
                        {activeQuestionItem.response.correctAnswerKey}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* KaTeX Explanations */}
              {responseIsVisible && activeQuestionItem.response.explanation && (
                <div className="p-4 border rounded-none bg-muted/30 mt-2 text-xs leading-relaxed font-serif overflow-y-auto max-h-[220px]">
                  <span className="font-bold text-xs uppercase block text-muted-foreground mb-1">
                    Explanation
                  </span>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {activeQuestionItem.response.explanation}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex w-full justify-between items-center bg-primary-foreground border-t px-4 py-3">
            <Button
              onClick={() => setResponseIsVisible(!responseIsVisible)}
              variant="outline"
              size="sm"
            >
              {responseIsVisible ? "Hide Response" : "Show Response"}
            </Button>

            <div className="flex gap-2">
              <button
                onClick={previousQuestion}
                disabled={selectedQuestionIndex === 0}
                className="p-2 border rounded-full hover:bg-muted disabled:opacity-30 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextQuestion}
                disabled={selectedQuestionIndex === topChartData.length - 1}
                className="p-2 border rounded-full hover:bg-muted disabled:opacity-30 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* =========================================================================
          3. SECTION NAVIGATION CHART
         ========================================================================= */}
      {activeSectionResult && (
        <Card className="rounded-none w-full xl:w-[1350px] xl:min-w-[1350px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-xl font-bold">
                Section Navigation
              </CardTitle>
              <CardDescription>
                A timeline of how you moved through the questions.
              </CardDescription>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                Time Remaining
              </span>
              <div className="flex items-center gap-2 text-blue-500 font-mono text-base sm:text-sm font-bold bg-blue-500/10 px-2 py-1 rounded-none border border-blue-500/20">
                <Clock className="w-5 h-5" />
                {formatNavTime(activeSectionResult.timeRemainingSeconds)}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {navData.length > 0 ? (
              <ChartContainer
                config={navChartConfig}
                className="aspect-[16/9] sm:aspect-[2/1] md:aspect-[3/1] lg:aspect-[4/1] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={navData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    onClick={(e: any) => {
                      const clickedQIdx = e?.activePayload?.[0]?.payload?.qIdx;
                      if (typeof clickedQIdx === "number") {
                        setSelectedQuestionIndex(clickedQIdx);
                      }
                    }}
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
                </ResponsiveContainer>
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
          4. ACCURACY CHARTS
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-[1350px] xl:min-w-[1350px]">
        {/* Left Column: Skills */}
        <Card className="rounded-none w-full lg:w-1/2 h-fit">
          <CardHeader className="border-b">
            <CardTitle>By Skills</CardTitle>
            <CardDescription>Total count of responses per skill.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={accuracyChartConfig}
              className="w-full"
              style={{ height: calculateChartHeight(accuracyData.skills.length) }}
            >
              <BarChart
                data={accuracyData.skills}
                layout="vertical"
                margin={{ left: paddingSize, right: 5 }}
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
                  width={130}
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
          </CardContent>
        </Card>

        {/* Right Column: Difficulty and Topics */}
        <div className="flex flex-col gap-4 w-full lg:w-1/2">
          {/* Difficulty Chart */}
          <Card className="rounded-none w-full h-fit">
            <CardHeader className="border-b">
              <CardTitle>By Difficulty</CardTitle>
              <CardDescription>
                Performance across difficulty levels.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer
                config={accuracyChartConfig}
                className="w-full"
                style={{
                  height: calculateChartHeight(accuracyData.difficulties.length),
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
            </CardContent>
          </Card>

          {/* Topics */}
          <Card className="rounded-none w-full h-fit">
            <CardHeader className="border-b">
              <CardTitle>By Topics</CardTitle>
              <CardDescription>Performance across topics.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer
                config={accuracyChartConfig}
                className="w-full"
                style={{ height: calculateChartHeight(accuracyData.topics.length) }}
              >
                <BarChart
                  data={accuracyData.topics}
                  layout="vertical"
                  margin={{ left: paddingSize, right: 5 }}
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
                    width={100}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}