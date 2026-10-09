/* eslint-disable @typescript-eslint/no-explicit-any */
// components/analytics/AnalyticsPacingGrid.tsx
"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnrichedResponseItem } from "@/types/analytics";

interface AnalyticsPacingGridProps {
  responses: EnrichedResponseItem[];
}

export const AnalyticsPacingGrid: React.FC<AnalyticsPacingGridProps> = ({ responses }) => {
  const metrics = useMemo(() => {
    const skillsMap: Record<string, number[]> = {};
    const domainsMap: Record<string, number[]> = {};
    const difficultyMap: Record<string, number[]> = {};

    responses.forEach((r) => {
      const time = r.timeSpentOnResponse ?? 0;
      const skill = r.skill || "General";
      const domain = r.domain || "General";
      const diff = r.difficulty || "Medium";

      if (!skillsMap[skill]) skillsMap[skill] = [];
      if (!domainsMap[domain]) domainsMap[domain] = [];
      if (!difficultyMap[diff]) difficultyMap[diff] = [];

      skillsMap[skill].push(time);
      domainsMap[domain].push(time);
      difficultyMap[diff].push(time);
    });

    const getMedianAndAvg = (records: Record<string, number[]>) =>
      Object.entries(records).map(([name, times]) => {
        const sorted = [...times].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
        const avg = Math.round(times.reduce((sum, t) => sum + t, 0) / (times.length || 1));
        return { name, median, avg, count: times.length };
      });

    return {
      skills: getMedianAndAvg(skillsMap).sort((a, b) => b.median - a.median),
      domains: getMedianAndAvg(domainsMap).sort((a, b) => b.median - a.median),
      difficulties: getMedianAndAvg(difficultyMap),
    };
  }, [responses]);

  if (responses.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No timing data recorded.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
      {/* Left: Skills Median Timing */}
      <Card className="rounded-xl border border-border/80 bg-linear-to-br from-white/5 to-card backdrop-blur-md shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold">Pacing by Skill</CardTitle>
          <CardDescription className="text-xs">Median deliberation duration per skill (seconds)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.skills} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                <XAxis type="number" stroke="currentColor" className="text-muted-foreground text-[10px]" />
                <YAxis dataKey="name" type="category" width={110} stroke="currentColor" className="text-muted-foreground text-[11px]" />
                <Tooltip
                  formatter={(val: any) => [`${val}s`, "Median Time"]}
                  contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "12px" }}
                />
                <Bar dataKey="median" fill="hsl(215 80% 50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Right Column: Domains & Difficulties */}
      <div className="space-y-5">
        <Card className="rounded-xl border border-border/80 bg-linear-to-br from-white/5 to-card backdrop-blur-md shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold">Pacing by Difficulty Tier</CardTitle>
            <CardDescription className="text-xs">Median deliberation duration by question tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.difficulties} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                  <XAxis type="number" stroke="currentColor" className="text-muted-foreground text-[10px]" />
                  <YAxis dataKey="name" type="category" width={80} stroke="currentColor" className="text-muted-foreground text-[11px]" />
                  <Tooltip
                    formatter={(val: any) => [`${val}s`, "Median Time"]}
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "12px" }}
                  />
                  <Bar dataKey="median" fill="hsl(265 75% 55%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};