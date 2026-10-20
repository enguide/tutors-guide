"use client";

import React, { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChevronDown, ChevronRight, ArrowUpDown } from "lucide-react";
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
import { EnrichedResponseItem } from "@/types/analytics";

interface TopicSkillAccuracyAccordionProps {
  responses: EnrichedResponseItem[];
}

interface SkillMetrics {
  name: string;
  correct: number;
  incorrect: number;
  total: number;
}

interface QuestionPip {
  id: string;
  isCorrect: boolean;
  questionNumber: number;
}

interface TopicGroup {
  topicName: string;
  totalCorrect: number;
  totalIncorrect: number;
  totalQuestions: number;
  percentage: number;
  skills: SkillMetrics[];
  pips: QuestionPip[];
}

type SortOption = "most-missed" | "lowest-accuracy";

const chartConfig = {
  correct: { label: "Correct", color: "#444444" },
  incorrect: { label: "Incorrect", color: "#ff9999" },
} satisfies ChartConfig;

// Helper function to split text into wrapped lines by whole words
function wrapText(text: string, maxCharsPerLine = 26): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

export function TopicSkillAccuracyAccordion({
  responses,
}: TopicSkillAccuracyAccordionProps) {
  // Sorting state: defaults to most missed questions
  const [sortBy, setSortBy] = useState<SortOption>("most-missed");

  // Track explicit open states
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});

  // Group and sort topics with primary sort + secondary tiebreaker
  const groupedTopics: TopicGroup[] = useMemo(() => {
    const topicMap: Record<
      string,
      {
        totalCorrect: number;
        totalIncorrect: number;
        totalQuestions: number;
        skills: Record<string, { correct: number; incorrect: number }>;
        pips: QuestionPip[];
      }
    > = {};

    responses.forEach((r) => {
      const topic = r.domain || "General";
      const skill = r.skill || "General";

      if (!topicMap[topic]) {
        topicMap[topic] = {
          totalCorrect: 0,
          totalIncorrect: 0,
          totalQuestions: 0,
          skills: {},
          pips: [],
        };
      }

      if (!topicMap[topic].skills[skill]) {
        topicMap[topic].skills[skill] = { correct: 0, incorrect: 0 };
      }

      topicMap[topic].totalQuestions += 1;
      topicMap[topic].pips.push({
        id: r.id || `${topic}-${topicMap[topic].pips.length}`,
        isCorrect: r.isCorrect,
        questionNumber: r.responseOrder,
      });

      if (r.isCorrect) {
        topicMap[topic].totalCorrect += 1;
        topicMap[topic].skills[skill].correct += 1;
      } else {
        topicMap[topic].totalIncorrect += 1;
        topicMap[topic].skills[skill].incorrect += 1;
      }
    });

    return Object.entries(topicMap)
      .map(([topicName, data]) => {
        const skills: SkillMetrics[] = Object.entries(data.skills)
          .map(([name, m]) => ({
            name,
            correct: m.correct,
            incorrect: m.incorrect,
            total: m.correct + m.incorrect,
          }))
          .sort((a, b) => b.incorrect - a.incorrect);

        const percentage =
          data.totalQuestions > 0
            ? Math.round((data.totalCorrect / data.totalQuestions) * 100)
            : 0;

        // Keep question pips ordered chronologically by responseOrder
        const sortedPips = [...data.pips].sort(
          (a, b) => a.questionNumber - b.questionNumber
        );

        return {
          topicName,
          totalCorrect: data.totalCorrect,
          totalIncorrect: data.totalIncorrect,
          totalQuestions: data.totalQuestions,
          percentage,
          skills,
          pips: sortedPips,
        };
      })
      .sort((a, b) => {
        if (sortBy === "most-missed") {
          if (b.totalIncorrect !== a.totalIncorrect) {
            return b.totalIncorrect - a.totalIncorrect;
          }
          return a.percentage - b.percentage;
        } else {
          if (a.percentage !== b.percentage) {
            return a.percentage - b.percentage;
          }
          return b.totalIncorrect - a.totalIncorrect;
        }
      });
  }, [responses, sortBy]);

  // Handler to switch sort and collapse open dropdowns
  const handleSortChange = (newSort: SortOption) => {
    if (newSort !== sortBy) {
      setSortBy(newSort);
      setOpenTopics({});
    }
  };

  const toggleTopic = (topicName: string) => {
    setOpenTopics((prev) => ({
      ...prev,
      [topicName]: !prev[topicName],
    }));
  };

  // 56px step size provides comfortable vertical room for multi-line labels
  const calculateChartHeight = (itemCount: number) => {
    const step = 56;
    const minHeight = 100;
    return Math.max(minHeight, itemCount * step);
  };

  if (responses.length === 0) {
    return (
      <Card className="rounded-none w-full border border-slate-200 dark:border-slate-800 p-6 text-center text-muted-foreground text-sm">
        No topic or skill data recorded for this section.
      </Card>
    );
  }

  return (
    <Card className="rounded-none w-full border border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader className="border-b border-slate-200 dark:border-slate-800 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <CardTitle className="text-base font-bold">Accuracy by Topic & Skill</CardTitle>
          <CardDescription className="text-xs">
            Expand each topic to inspect performance across individual skills.
          </CardDescription>
        </div>

        {/* Sorting Controller */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mr-1">
            <ArrowUpDown className="w-3 h-3" /> Sort:
          </span>
          <div className="inline-flex border border-slate-200 dark:border-slate-800 bg-muted/20 p-0.5 rounded-none">
            <button
              type="button"
              onClick={() => handleSortChange("most-missed")}
              className={`px-2.5 py-1 text-xs font-semibold transition-colors rounded-none ${
                sortBy === "most-missed"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              Most Missed
            </button>
            <button
              type="button"
              onClick={() => handleSortChange("lowest-accuracy")}
              className={`px-2.5 py-1 text-xs font-semibold transition-colors rounded-none ${
                sortBy === "lowest-accuracy"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              Lowest %
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-slate-200 dark:divide-slate-800">
        {/* Subtle Column Header Strip */}
        <div className="flex items-center justify-between px-5 py-2 bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none border-b border-slate-200 dark:border-slate-800">
          <span>Topic</span>
          <div className="flex items-center gap-4">
            <span>Accuracy</span>
            {/* Matches the 16px (w-4) chevron width to preserve right alignment */}
            <span className="w-3" aria-hidden="true" />
          </div>
        </div>

        {groupedTopics.map((group) => {
          const isOpen = !!openTopics[group.topicName];

          return (
            <div key={group.topicName} className="w-full">
              {/* Accordion Header Row */}
              <button
                type="button"
                onClick={() => toggleTopic(group.topicName)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/40 transition-colors select-none text-left"
              >
                {/* Left Side: Topic Title & Pip Blocks */}
                <div className="flex items-center gap-3.5 flex-wrap">
                  <span className="font-semibold text-sm text-foreground">
                    {group.topicName}
                  </span>
                </div>

                {/* Right Side: Missed Badge (-X), Percentage, and Chevron */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* {group.totalIncorrect > 0 && (
                    <span className="text-[10px] px-1.5 py-1 font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                      -{group.totalIncorrect}
                    </span>
                  )} */}
                  {/* Visual Question Pip Blocks */}
                  <div
                    className="flex items-center gap-1 flex-wrap"
                    title={`${group.totalCorrect} correct, ${group.totalIncorrect} incorrect (${group.totalQuestions} total)`}
                  >
                    {group.pips.map((pip) => (
                      <span
                        key={pip.id}
                        title={`Q${pip.questionNumber}: ${pip.isCorrect ? "Correct" : "Incorrect"}`}
                        className="inline-block w-2.5 h-2.5 rounded-[1px] transition-transform hover:scale-125"
                        style={{
                          backgroundColor: pip.isCorrect ? "#444444" : "#ff9999",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-foreground w-6 text-right">
                    {group.percentage}%
                  </span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
                  )}
                </div>
              </button>

              {/* Collapsible Chart Drawer */}
              {isOpen && (
                <div className="px-5 py-4 bg-muted/10 border-t border-slate-100 dark:border-slate-800/60">
                  <ChartContainer
                    config={chartConfig}
                    className="w-full"
                    style={{
                      height: calculateChartHeight(group.skills.length),
                    }}
                  >
                    <BarChart
                      data={group.skills}
                      layout="vertical"
                      margin={{ left: 16, right: 16, top: 8, bottom: 8 }}
                    >
                      <CartesianGrid
                        horizontal
                        vertical
                        strokeDasharray="3 3"
                        opacity={0.3}
                      />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={220}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        tick={({ x, y, payload }) => {
                          const lines = wrapText(payload.value, 26);
                          const lineHeight = 13;
                          const startDy = -((lines.length - 1) * lineHeight) / 2;

                          return (
                            <text
                              x={x}
                              y={y}
                              textAnchor="end"
                              fontSize={11}
                              className="fill-muted-foreground font-medium"
                            >
                              {lines.map((line, i) => (
                                <tspan
                                  key={i}
                                  x={x}
                                  dy={i === 0 ? startDy : lineHeight}
                                >
                                  {line}
                                </tspan>
                              ))}
                            </text>
                          );
                        }}
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
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}