/* eslint-disable @typescript-eslint/no-explicit-any */
// components/analytics/NavigationTimelineChart.tsx
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
import { Clock } from "lucide-react";

interface NavHistoryEntry {
  time: number;
  qIdx: number;
}

interface NavigationTimelineChartProps {
  data: NavHistoryEntry[];
  timeRemainingSeconds?: number;
  totalQuestions: number;
  onSelectQuestionIndex?: (qIdx: number) => void;
}

export const NavigationTimelineChart: React.FC<NavigationTimelineChartProps> = ({
  data,
  timeRemainingSeconds = 0,
  totalQuestions,
  onSelectQuestionIndex,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const yAxisTicks = useMemo(() => {
    if (totalQuestions <= 0) return [0];
    const tickCount = Math.min(6, totalQuestions);
    const ticks: number[] = [];
    for (let i = 0; i < tickCount; i++) {
      ticks.push(Math.round(((totalQuestions - 1) / (tickCount - 1)) * i));
    }
    return Array.from(new Set(ticks));
  }, [totalQuestions]);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
        No chronological navigation telemetry available for this section.
      </div>
    );
  }

  return (
    <Card className="w-full rounded-xl bg-linear-to-br from-white/5 to-card backdrop-blur-md border border-border shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base sm:text-lg font-bold">
            Section Navigation Path
          </CardTitle>
          <CardDescription className="text-xs">
            Chronological progression, backtracks, and deliberation trace
          </CardDescription>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            Time Remaining
          </span>
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-mono text-xs sm:text-sm font-bold bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(timeRemainingSeconds)}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
  data={data}
  margin={{ top: 15, right: 25, left: 0, bottom: 20 }}
  onClick={(e: any) => {
    const payload = e?.activePayload?.[0]?.payload;
    if (payload?.qIdx !== undefined && onSelectQuestionIndex) {
      onSelectQuestionIndex(Number(payload.qIdx));
    }
  }}
>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <XAxis
                dataKey="time"
                type="number"
                domain={[0, "dataMax"]}
                tickFormatter={formatTime}
                stroke="currentColor"
                className="text-muted-foreground text-[11px]"
                tickLine={false}
                axisLine={true}
                label={{
                  value: "Elapsed Test Time",
                  position: "bottom",
                  offset: 0,
                  className: "fill-muted-foreground text-[10px] uppercase font-bold",
                }}
              />
              <YAxis
                dataKey="qIdx"
                stroke="currentColor"
                className="text-muted-foreground text-[11px]"
                allowDecimals={false}
                domain={[0, Math.max(0, totalQuestions - 1)]}
                ticks={yAxisTicks}
                tickLine={true}
                axisLine={true}
                tickFormatter={(val) => `Q${val + 1}`}
                label={{
                  value: "Question #",
                  angle: -90,
                  position: "insideLeft",
                  className: "fill-muted-foreground text-[10px] uppercase font-bold",
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const qNumber = Number(payload[0].value) + 1;
                    return (
                      <div className="rounded-lg border border-border bg-popover/90 backdrop-blur-md p-2.5 shadow-md text-xs">
                        <p className="font-bold text-foreground">Question {qNumber}</p>
                        <p className="text-muted-foreground text-[11px]">
                          Timestamp: {formatTime(Number(label))}
                        </p>
                        <p className="text-blue-500 text-[10px] mt-1 font-semibold">
                          Click to inspect question in review
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="stepAfter"
                dataKey="qIdx"
                stroke="hsl(220 80% 55%)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: "hsl(220 80% 55%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};