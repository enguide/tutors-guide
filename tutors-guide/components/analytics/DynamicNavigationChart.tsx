// components/analytics/DynamicNavigationChart.tsx
"use client";

import React, { useMemo } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
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
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Clock } from "lucide-react";

export interface NavHistoryEntry {
  time: number; // Elapsed seconds
  qIdx: number; // 0-based question index
}

interface DynamicNavigationChartProps {
  data: NavHistoryEntry[];
  timeRemaining?: number | string;
  totalQuestions?: number;
  sectionTitle?: string;
  onSelectQuestionIndex?: (qIdx: number) => void;
}

const chartConfig = {
  qIdx: {
    label: "Question Number",
    color: "hsl(220 70% 50%)",
  },
} satisfies ChartConfig;

export default function DynamicNavigationChart({
  data,
  timeRemaining = 0,
  totalQuestions,
  sectionTitle,
  onSelectQuestionIndex,
}: DynamicNavigationChartProps) {
  // Format elapsed or remaining seconds into MM:SS
  const formatTime = (seconds: number | string) => {
    const totalSeconds =
      typeof seconds === "string" ? parseInt(seconds, 10) : seconds;
    if (isNaN(totalSeconds) || totalSeconds < 0) return "0:00";

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Derive maximum question index from explicit question count or max visited index
  const resolvedMaxQIdx = useMemo(() => {
    if (typeof totalQuestions === "number" && totalQuestions > 0) {
      return totalQuestions - 1;
    }
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map((d) => d.qIdx));
  }, [totalQuestions, data]);

  // Compute clean Y-axis ticks across the actual question indices
  const yAxisTicks = useMemo(() => {
    if (resolvedMaxQIdx <= 0) return [0];

    const tickCount = Math.min(6, resolvedMaxQIdx + 1);
    const ticks: number[] = [];

    for (let i = 0; i < tickCount; i++) {
      ticks.push(Math.round((resolvedMaxQIdx / (tickCount - 1)) * i));
    }

    return Array.from(new Set(ticks));
  }, [resolvedMaxQIdx]);

  if (!data || data.length === 0) {
    return (
      <Card className="w-full rounded-sm bg-linear-to-br from-white/5 to-card backdrop-blur-md border shadow-sm p-8 text-center text-muted-foreground">
        No navigation history recorded for this section.
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-sm bg-linear-to-br from-white/5 to-card backdrop-blur-md border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-bold">
            {sectionTitle ? `${sectionTitle} Navigation` : "Section Navigation"}
          </CardTitle>
          <CardDescription>
            A timeline of how you moved through the questions.
          </CardDescription>
        </div>

        {/* Time Remaining Counter */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Time Remaining
          </span>
          <div className="flex items-center gap-2 text-blue-500 font-mono text-base sm:text-sm font-bold bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
            <Clock className="w-4 h-4" />
            {formatTime(timeRemaining)}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-video sm:aspect-2/1 md:aspect-3/1 lg:aspect-4/1 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              onClick={(e: unknown) => {
                const chartState = e as {
                  activePayload?: Array<{ payload?: { qIdx?: number } }>;
                };
                const clickedQIdx =
                  chartState?.activePayload?.[0]?.payload?.qIdx;
                if (
                  typeof clickedQIdx === "number" &&
                  onSelectQuestionIndex
                ) {
                  onSelectQuestionIndex(clickedQIdx);
                }
              }}
            >
              <CartesianGrid horizontal={true} vertical={false} />
              <XAxis
                dataKey="time"
                type="number"
                domain={[0, "dataMax"]}
                tickFormatter={formatTime}
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
                domain={[0, resolvedMaxQIdx]}
                ticks={yAxisTicks}
                tickLine={true}
                axisLine={true}
                tickFormatter={(val) => `Q${Number(val) + 1}`}
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
                formatter={(value: unknown) => [`Question ${Number(value) + 1}`]}
                labelFormatter={(label: unknown) =>
                  `At ${formatTime(Number(label))}`
                }
              />
              <Line
                type="stepAfter"
                dataKey="qIdx"
                stroke="var(--color-qIdx)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}