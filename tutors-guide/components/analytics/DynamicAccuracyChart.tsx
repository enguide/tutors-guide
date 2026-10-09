// components/analytics/DynamicAccuracyChart.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

export interface GenericAccuracyResponse {
  isCorrect: boolean;
  timeSpentOnResponse?: number | null;
  skill?: string | null;
  domain?: string | null;
  topic?: string | null;
  difficulty?: string | null;
}

interface CategoryMetrics {
  correct: number;
  incorrect: number;
}

interface CalculatedData {
  topics: Record<string, CategoryMetrics>;
  skills: Record<string, CategoryMetrics>;
  difficulties: Record<string, CategoryMetrics>;
}

interface ChartDataItem {
  name: string;
  correct: number;
  incorrect: number;
}

interface DynamicAccuracyChartProps {
  responses: GenericAccuracyResponse[];
}

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
  Unrated: 5,
};

const useFontSize = () => {
  const [fontSize, setFontSize] = useState(11);
  useEffect(() => {
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
  const [paddingSize, setPaddingSize] = useState(30);
  useEffect(() => {
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

const calculateResponseCounts = (
  responses: GenericAccuracyResponse[]
): CalculatedData => {
  const groupedData: CalculatedData = {
    topics: {},
    skills: {},
    difficulties: {},
  };

  responses.forEach((response) => {
    const { isCorrect } = response;

    const topic = response.domain || response.topic || "General";
    const skill = response.skill || "General";

    const rawDiff = response.difficulty || "";
    const difficulty = DIFFICULTY_LABELS[rawDiff] || rawDiff || "Unrated";

    const categories = [
      { key: "topics" as const, val: topic },
      { key: "skills" as const, val: skill },
      { key: "difficulties" as const, val: difficulty },
    ];

    categories.forEach(({ key, val }) => {
      if (!groupedData[key][val]) {
        groupedData[key][val] = { correct: 0, incorrect: 0 };
      }
      if (isCorrect) {
        groupedData[key][val].correct++;
      } else {
        groupedData[key][val].incorrect++;
      }
    });
  });

  return groupedData;
};

export default function DynamicAccuracyChart({
  responses,
}: DynamicAccuracyChartProps) {
  const data = useMemo(() => calculateResponseCounts(responses), [responses]);
  const fontSize = useFontSize();
  const paddingSize = usePaddingSize();

  const calculateChartHeight = (itemCount: number) => {
    const step = 45;
    const minHeight = 150;
    return Math.max(minHeight, itemCount * step);
  };

  const generateChartData = (
    categoryData: Record<string, CategoryMetrics>
  ): ChartDataItem[] => {
    return Object.entries(categoryData).map(([name, metrics]) => ({
      name,
      correct: metrics.correct,
      incorrect: metrics.incorrect,
    }));
  };

  const chartConfig = {
    correct: { label: "Correct", color: "#444444" },
    incorrect: { label: "Incorrect", color: "#ff9999" },
  } satisfies ChartConfig;

  // Sorting
  const skillsChartData = generateChartData(data.skills).sort(
    (a, b) => b.incorrect - a.incorrect
  );
  const topicsChartData = generateChartData(data.topics).sort(
    (a, b) => b.incorrect - a.incorrect
  );
  const difficultiesChartData = generateChartData(data.difficulties).sort(
    (a, b) =>
      (DIFFICULTY_ORDER[a.name] || 99) - (DIFFICULTY_ORDER[b.name] || 99)
  );

  if (responses.length === 0) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Card className="rounded-sm p-6 text-center text-sm lg:text-base w-full">
          <CardTitle>No accuracy data available for this section.</CardTitle>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full max-w-337.5">
      {/* Left Column: Skills (Takes half width on large screens) */}
      <Card className="w-full lg:w-1/2 rounded-sm bg-linear-to-br from-white/5 to-card backdrop-blur-md h-fit">
        <CardHeader>
          <CardTitle>By Skills</CardTitle>
          <CardDescription>Total count of responses per skill.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="w-full"
            style={{ height: calculateChartHeight(skillsChartData.length) }}
          >
            <BarChart
              data={skillsChartData}
              layout="vertical"
              margin={{ left: paddingSize, right: 5 }}
            >
              <CartesianGrid horizontal vertical />
              <XAxis
                type="number"
                tick={{ fontSize }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
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
                fill="var(--color-correct)"
                stackId="a"
                radius={0}
              />
              <Bar
                dataKey="incorrect"
                fill="var(--color-incorrect)"
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
        <Card className="rounded-sm bg-linear-to-br from-white/5 to-card backdrop-blur-md h-fit">
          <CardHeader>
            <CardTitle>By Difficulty</CardTitle>
            <CardDescription>
              Performance across difficulty levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="w-full"
              style={{
                height: calculateChartHeight(difficultiesChartData.length),
              }}
            >
              <BarChart
                data={difficultiesChartData}
                layout="vertical"
                margin={{ left: 5, right: 5 }}
              >
                <CartesianGrid horizontal vertical />
                <XAxis
                  type="number"
                  tick={{ fontSize }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
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
                  fill="var(--color-correct)"
                  stackId="a"
                  radius={0}
                />
                <Bar
                  dataKey="incorrect"
                  fill="var(--color-incorrect)"
                  stackId="a"
                  radius={0}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Domains / Topics */}
        <Card className="rounded-sm bg-linear-to-br from-white/5 to-card backdrop-blur-md h-fit">
          <CardHeader>
            <CardTitle>By Topics</CardTitle>
            <CardDescription>Performance across topics / domains.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="w-full"
              style={{ height: calculateChartHeight(topicsChartData.length) }}
            >
              <BarChart
                data={topicsChartData}
                layout="vertical"
                margin={{ left: paddingSize, right: 5 }}
              >
                <CartesianGrid horizontal vertical />
                <XAxis
                  type="number"
                  tick={{ fontSize }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
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
                  fill="var(--color-correct)"
                  stackId="a"
                  radius={0}
                />
                <Bar
                  dataKey="incorrect"
                  fill="var(--color-incorrect)"
                  stackId="a"
                  radius={0}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}