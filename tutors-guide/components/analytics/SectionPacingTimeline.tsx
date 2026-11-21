// components/analytics/SectionPacingTimeline.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  Tooltip,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  EnrichedResponseItem,
  SectionResultData,
} from "@/types/analytics";
import { TestMetadata } from "@/types/content";

interface SectionPacingTimelineProps {
  metadata: TestMetadata;
  sectionResults: SectionResultData[];
  responses: EnrichedResponseItem[];
  activeSectionId?: string;
  pendingAuditSectionIds?: string[];
  hideCardWrapper?: boolean;
  isLg?: boolean;
}

const DOMAIN_PALETTE = [
  "#0284c7", // Sky-600
  "#d97706", // Amber-600
  "#9333ea", // Purple-600
  "#059669", // Emerald-600
  "#e11d48", // Rose-600
  "#4f46e5", // Indigo-600
  "#0d9488", // Teal-600
  "#ea580c", // Orange-600
];

const DESKTOP_INITIAL_DIMENSION = { width: 960, height: 300 };

const SCATTER_KEYFRAMES_CSS = `
  @keyframes scatterRise {
    from {
      opacity: 0;
      transform: translate(var(--rise-x, 0px), var(--rise-y, 40px)) scale(0.85);
    }
    to {
      opacity: 1;
      transform: translate(0px, 0px) scale(1);
    }
  }
`;

const timelineChartConfig = {
  plottedTime: {
    label: "Time (s)",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const useDesktopBreakpoint = (controlledIsLg?: boolean) => {
  const [internalIsLg, setInternalIsLg] = useState(false);

  useEffect(() => {
    if (controlledIsLg !== undefined) return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const syncBreakpoint = () => {
      setInternalIsLg((prev) =>
        prev === mediaQuery.matches ? prev : mediaQuery.matches
      );
    };

    syncBreakpoint();
    mediaQuery.addEventListener("change", syncBreakpoint);
    return () => mediaQuery.removeEventListener("change", syncBreakpoint);
  }, [controlledIsLg]);

  return controlledIsLg !== undefined ? controlledIsLg : internalIsLg;
};

function normalizeDifficulty(raw?: string): "Easy" | "Medium" | "Hard" {
  if (!raw) return "Medium";
  const cleaned = raw.trim().toLowerCase();
  if (cleaned === "1" || cleaned.startsWith("easy")) return "Easy";
  if (
    cleaned === "3" ||
    cleaned === "4" ||
    cleaned.startsWith("hard") ||
    cleaned.startsWith("expert")
  ) {
    return "Hard";
  }
  return "Medium";
}

function resolveTimeMultiplier(sr: SectionResultData): number {
  const acc = (sr as any).accommodations;
  if (!acc || typeof acc !== "object") return 1.0;
  if (typeof acc.timeMultiplier === "number" && acc.timeMultiplier > 0) {
    return acc.timeMultiplier;
  }
  if (acc.extendedTime === true) return 1.5;
  return 1.0;
}

function resolveSubjectTrack(sr: SectionResultData): string {
  const title = (sr.section?.title || "").toLowerCase();
  const id = (sr.sectionId || "").toLowerCase();

  if (
    title.includes("reading & writing") ||
    title.includes("reading and writing") ||
    /\brw\d*\b/.test(id) ||
    id.includes("reading-writing")
  ) {
    return "track-rw";
  }

  if (title.includes("english")) return "track-english";
  if (title.includes("science")) return "track-science";
  if (title.includes("verbal") || /\bv\d+\b/.test(id)) return "track-verbal";
  if (
    title.includes("quantitative") ||
    title.includes("quant") ||
    /\bq\d+\b/.test(id)
  ) {
    return "track-quant";
  }
  if (title.includes("math") || /\bm\d+\b/.test(id) || id.includes("math")) {
    return "track-math";
  }
  if (title.includes("reading")) return "track-reading";

  return `section-${sr.sectionId}`;
}

interface TimelinePoint {
  questionId: string;
  questionNumber: number;
  timeSpent: number;
  plottedTime: number;
  isClamped: boolean;
  isCorrect: boolean;
  isPendingAudit: boolean;
  difficulty: string;
  domain: string;
  skill: string;
  domainColor: string;
  targetSeconds: number;
  isVerticalLayout: boolean;
}

const renderTimelineShape = (props: any) => {
  const { cx, cy, payload } = props;
  if (typeof cx !== "number" || typeof cy !== "number" || !payload) {
    return <g />;
  }

  const pt = payload as TimelinePoint;
  const color = pt.domainColor;
  const diff = normalizeDifficulty(pt.difficulty);
  const isFilled = pt.isCorrect && !pt.isPendingAudit;
  const isVertical = pt.isVerticalLayout;

  const hollowStrokeWidth = 2.2;
  const inset = isFilled ? 0 : hollowStrokeWidth / 2;

  const fillOpacity = isFilled ? 0.95 : pt.isPendingAudit ? 0.35 : 0.12;
  const stroke = isFilled ? "none" : color;
  const strokeWidth = isFilled ? 0 : hollowStrokeWidth;
  const strokeDasharray = pt.isPendingAudit ? "2 1.5" : undefined;

  const drawX = isVertical
    ? pt.isClamped
      ? cx - 5
      : pt.timeSpent === 0
      ? cx + 5
      : cx
    : cx;
  const drawY = !isVertical
    ? pt.isClamped
      ? cy + 5
      : pt.timeSpent === 0
      ? cy - 5
      : cy
    : cy;

  const riseX = isVertical ? -28 : 0;
  const riseY = !isVertical ? 28 : 0;

  const capIndicator = pt.isClamped ? (
    isVertical ? (
      <line
        x1={drawX + 8.5}
        y1={drawY - 6.5}
        x2={drawX + 8.5}
        y2={drawY + 6.5}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    ) : (
      <line
        x1={drawX - 6.5}
        y1={drawY - 8.5}
        x2={drawX + 6.5}
        y2={drawY - 8.5}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    )
  ) : null;

  let shapeNode: React.ReactNode;

  if (diff === "Easy") {
    const r = 6.6 - inset;
    const points = `${drawX},${drawY - r} ${drawX - r * 0.92},${
      drawY + r * 0.72
    } ${drawX + r * 0.92},${drawY + r * 0.72}`;
    shapeNode = (
      <polygon
        points={points}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinejoin="round"
      />
    );
  } else if (diff === "Hard") {
    const r = 6.8 - inset;
    const points = `${drawX},${drawY - r} ${drawX + r},${drawY} ${drawX},${
      drawY + r
    } ${drawX - r},${drawY}`;
    shapeNode = (
      <polygon
        points={points}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinejoin="round"
      />
    );
  } else {
    const half = 5.2 - inset;
    shapeNode = (
      <rect
        x={drawX - half}
        y={drawY - half}
        width={half * 2}
        height={half * 2}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
      />
    );
  }

  return (
    <g
      style={{
        transformOrigin: `${drawX}px ${drawY}px`,
        animation: "scatterRise 400ms ease-out both",
        ["--rise-x" as any]: `${riseX}px`,
        ["--rise-y" as any]: `${riseY}px`,
      }}
    >
      {capIndicator}
      {shapeNode}
    </g>
  );
};

export const SectionPacingTimeline: React.FC<SectionPacingTimelineProps> = ({
  metadata,
  sectionResults,
  responses,
  activeSectionId: controlledSectionId,
  pendingAuditSectionIds = [],
  hideCardWrapper = false,
  isLg: controlledIsLg,
}) => {
  const isLg = useDesktopBreakpoint(controlledIsLg);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    () => String(sectionResults[0]?.sectionId ?? "")
  );

  const pendingAuditSet = useMemo(
    () => new Set(pendingAuditSectionIds),
    [pendingAuditSectionIds]
  );

  const activeSectionId = useMemo(() => {
    if (controlledSectionId) {
      return controlledSectionId;
    }
    const exists = sectionResults.some(
      (sr) => String(sr.sectionId) === selectedSectionId
    );
    return exists
      ? selectedSectionId
      : String(sectionResults[0]?.sectionId ?? "");
  }, [controlledSectionId, sectionResults, selectedSectionId]);

  const activeSectionResult = useMemo(
    () =>
      sectionResults.find((sr) => String(sr.sectionId) === activeSectionId),
    [sectionResults, activeSectionId]
  );

  const isActivePendingAudit = pendingAuditSet.has(activeSectionId);

  const sectionResponses = useMemo(() => {
    return responses
      .filter((r) => String(r.sectionId) === activeSectionId)
      .sort((a, b) => a.responseOrder - b.responseOrder);
  }, [responses, activeSectionId]);

  const { targetSeconds, rushedFloorSec, timeSinkCeilingSec, yAxisCap } =
    useMemo(() => {
      if (!activeSectionResult) {
        return {
          targetSeconds: 80,
          rushedFloorSec: 52,
          timeSinkCeilingSec: 120,
          yAxisCap: 200,
        };
      }
      const qCount =
        sectionResponses.length || activeSectionResult.totalQuestions || 1;
      const manifestSec = metadata.sections?.find(
        (s) => String(s.id) === activeSectionId
      );
      const baseLimit =
        manifestSec?.timeLimit || activeSectionResult.section.timeLimit || 0;
      const multiplier = resolveTimeMultiplier(activeSectionResult);
      const target =
        baseLimit > 0 ? Math.round((baseLimit * multiplier) / qCount) : 80;

      const cap = Math.max(60, Math.round((target * 2.5) / 10) * 10);

      return {
        targetSeconds: target,
        rushedFloorSec: Math.round(target * 0.65),
        timeSinkCeilingSec: Math.round(target * 1.5),
        yAxisCap: cap,
      };
    }, [
      activeSectionResult,
      sectionResponses.length,
      metadata.sections,
      activeSectionId,
    ]);

  const { trackDomainColorMap, trackDomainEntries } = useMemo(() => {
    const sectionToTrack = new Map<string, string>();
    for (const sr of sectionResults) {
      sectionToTrack.set(String(sr.sectionId), resolveSubjectTrack(sr));
    }

    const activeTrack =
      sectionToTrack.get(activeSectionId) ?? `section-${activeSectionId}`;

    const trackDomainsSet = new Set<string>();
    for (const r of responses) {
      const rTrack =
        sectionToTrack.get(String(r.sectionId)) ?? `section-${r.sectionId}`;
      if (rTrack === activeTrack) {
        trackDomainsSet.add(r.domain || "General");
      }
    }

    const sortedTrackDomains = Array.from(trackDomainsSet).sort((a, b) =>
      a.localeCompare(b)
    );

    const activeModuleCounts = new Map<string, number>();
    for (const r of sectionResponses) {
      const dom = r.domain || "General";
      activeModuleCounts.set(dom, (activeModuleCounts.get(dom) ?? 0) + 1);
    }

    const colorMap = new Map<string, string>();
    const entries = sortedTrackDomains.map((domain, idx) => {
      const color = DOMAIN_PALETTE[idx % DOMAIN_PALETTE.length];
      colorMap.set(domain, color);
      return {
        domain,
        moduleCount: activeModuleCounts.get(domain) ?? 0,
        color,
      };
    });

    return {
      trackDomainColorMap: colorMap,
      trackDomainEntries: entries,
    };
  }, [sectionResults, responses, sectionResponses, activeSectionId]);

  const { plotData, questionTicks, maxQuestionNum, clampedCount } = useMemo(() => {
    const allPoints: TimelinePoint[] = sectionResponses.map((r, idx) => {
      const dom = r.domain || "General";
      const trueTime = r.timeSpentOnResponse ?? 0;
      const isClamped = trueTime > yAxisCap;
      const isPending = pendingAuditSet.has(String(r.sectionId));
      return {
        questionId: String(r.questionId),
        questionNumber: r.responseOrder || idx + 1,
        timeSpent: trueTime,
        plottedTime: isClamped ? yAxisCap : trueTime,
        isClamped,
        isCorrect: r.isCorrect,
        isPendingAudit: isPending,
        difficulty: r.difficulty || "Medium",
        domain: dom,
        skill: r.skill || "General",
        domainColor: trackDomainColorMap.get(dom) ?? DOMAIN_PALETTE[0],
        targetSeconds,
        isVerticalLayout: !isLg,
      };
    });

    const maxQ = allPoints.reduce(
      (acc, p) => Math.max(acc, p.questionNumber),
      1
    );
    const ticks = allPoints.map((p) => p.questionNumber);
    const clamped = allPoints.filter((p) => p.isClamped).length;

    return {
      plotData: allPoints,
      questionTicks: ticks,
      maxQuestionNum: maxQ,
      clampedCount: clamped,
    };
  }, [sectionResponses, trackDomainColorMap, targetSeconds, yAxisCap, isLg, pendingAuditSet]);

  const mobileChartHeight = useMemo(
    () => Math.max(150, plotData.length * 30),
    [plotData.length]
  );

  const mobileChartStyle = useMemo(
    () => ({
      height: `${mobileChartHeight}px`,
      minHeight: "150px",
    }),
    [mobileChartHeight]
  );

  const mobileInitialDimension = useMemo(
    () => ({ width: 360, height: mobileChartHeight }),
    [mobileChartHeight]
  );

  if (sectionResults.length === 0) return null;

  const tooltipContent = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    const pt = payload[0].payload as TimelinePoint;
    const paceRatio = (pt.timeSpent / pt.targetSeconds).toFixed(2);
    return (
      <div className="bg-popover text-popover-foreground border border-border p-3 text-xs shadow-md space-y-1.5">
        <div className="font-bold flex items-center justify-between gap-4">
          <span>Question {pt.questionNumber}</span>
          <span
            className={`font-mono font-bold ${
              pt.isPendingAudit
                ? "text-amber-600 dark:text-amber-400"
                : pt.isCorrect
                ? "text-sky-600 dark:text-sky-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {pt.isPendingAudit ? "Under Review" : pt.isCorrect ? "Correct" : "Missed"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
            style={{ backgroundColor: pt.domainColor }}
          />
          <span className="font-semibold text-foreground">{pt.domain}</span>
          <span className="text-muted-foreground">({pt.difficulty})</span>
        </div>
        <div className="text-muted-foreground">{pt.skill}</div>
        <div className="font-mono text-[11px] pt-1 border-t border-border">
          Time: <strong>{pt.timeSpent}s</strong>
          {pt.isClamped && (
            <span className="text-amber-600 dark:text-amber-400 ml-1">
              (capped at {yAxisCap}s+ on chart)
            </span>
          )}{" "}
          / Target: {pt.targetSeconds}s (<strong>{paceRatio}×</strong>)
        </div>
      </div>
    );
  };

  const content = (
    <div className="space-y-4 w-full min-w-0">
      <style>{SCATTER_KEYFRAMES_CSS}</style>

      {!hideCardWrapper && (
        <div className="flex flex-col gap-3 border-b border-border pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Question-by-Question Pacing & Topic Breakdown
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Color = content domain; shape = difficulty; filled vs. hollow = outcome.
            </p>
          </div>

          {!controlledSectionId && (
            <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1 shrink-0">
                Section:
              </span>
              {sectionResults.map((sr) => {
                const secId = String(sr.sectionId);
                const isSelected = secId === activeSectionId;
                const isPending = pendingAuditSet.has(secId);
                const misses = sr.totalQuestions - sr.numCorrect;

                return (
                  <button
                    key={secId}
                    type="button"
                    onClick={() => setSelectedSectionId(secId)}
                    className={`min-h-9 px-3 py-1.5 rounded-none text-xs font-bold inline-flex items-center gap-2 whitespace-nowrap border transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    <span>{sr.section.title}</span>
                    {isPending ? (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        Under Review
                      </span>
                    ) : (
                      misses > 0 && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                            isSelected
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {misses} missed
                        </span>
                      )
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {plotData.length > 0 ? (
        <>
          <div className="w-full min-w-0">
            {!isLg ? (
              <ChartContainer
                config={timelineChartConfig}
                initialDimension={mobileInitialDimension}
                className="w-full min-w-0"
                style={mobileChartStyle}
              >
                <ScatterChart margin={{ left: 0, right: 12, top: 10, bottom: 8 }}>
                  <CartesianGrid vertical={true} horizontal={false} />
                  <XAxis
                    type="number"
                    dataKey="plottedTime"
                    orientation="top"
                    height={40}
                    domain={[0, yAxisCap]}
                    allowDataOverflow={true}
                    tickFormatter={(v) => (v === yAxisCap ? `${v}s+` : `${v}s`)}
                    label={{
                      value: "Time Spent (s)",
                      fontSize: 10,
                      fontWeight: "bold",
                      position: "insideTop",
                      offset: 5,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="questionNumber"
                    reversed={true}
                    domain={[0.5, maxQuestionNum + 0.5]}
                    ticks={questionTicks}
                    interval={0}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    width={40}
                    tickFormatter={(value) => `Q${value}`}
                  />

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
                    x={targetSeconds}
                    stroke="#2563eb"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />

                  <ReferenceLine
                    x={timeSinkCeilingSec}
                    stroke="#2563eb"
                    strokeDasharray="3 3"
                    strokeOpacity={0.35}
                  />

                  <Tooltip
                    cursor={{ strokeDasharray: "3 3", strokeOpacity: 0.35 }}
                    content={tooltipContent}
                  />
                  <Scatter
                    key={`scatter-mobile-${activeSectionId}`}
                    data={plotData}
                    shape={renderTimelineShape}
                    isAnimationActive={false}
                  />
                </ScatterChart>
              </ChartContainer>
            ) : (
              <ChartContainer
                config={timelineChartConfig}
                initialDimension={DESKTOP_INITIAL_DIMENSION}
                className="aspect-auto h-[300px] pt-2 w-full min-w-0"
              >
                <ScatterChart margin={{ left: 12, right: 12, top: 14, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    type="number"
                    dataKey="questionNumber"
                    domain={[0.5, maxQuestionNum + 0.5]}
                    ticks={questionTicks}
                    interval={0}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={5}
                    fontSize={12}
                  />
                  <YAxis
                    type="number"
                    dataKey="plottedTime"
                    domain={[0, yAxisCap]}
                    allowDataOverflow={true}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={5}
                    tickFormatter={(v) => (v === yAxisCap ? `${v}s+` : `${v}s`)}
                    fontSize={12}
                    label={{
                      value: "Time (s)",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 10,
                      fontWeight: "bold",
                      dy: 15,
                    }}
                  />

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
                    y={targetSeconds}
                    stroke="#2563eb"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />

                  <ReferenceLine
                    y={timeSinkCeilingSec}
                    stroke="#2563eb"
                    strokeDasharray="3 3"
                    strokeOpacity={0.35}
                  />

                  <Tooltip
                    cursor={{ strokeDasharray: "3 3", strokeOpacity: 0.35 }}
                    content={tooltipContent}
                  />
                  <Scatter
                    key={`scatter-desktop-${activeSectionId}`}
                    data={plotData}
                    shape={renderTimelineShape}
                    isAnimationActive={false}
                  />
                </ScatterChart>
              </ChartContainer>
            )}
          </div>

          {/* Single-Line Outcome + Difficulty (Left) & Domains (Right) Legend Strip Below Chart */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[11px] sm:text-xs font-medium bg-muted/20 border border-border/60 px-3 py-2.5">
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
              {isActivePendingAudit ? (
                <span
                  className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-semibold"
                  title="Dashed outline indicates FRQ part is under tutor review"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                    <rect
                      x="2"
                      y="2"
                      width="8"
                      height="8"
                      fill="currentColor"
                      fillOpacity={0.35}
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeDasharray="2 1.5"
                    />
                  </svg>
                  Under Review
                </span>
              ) : (
                <>
                  <span
                    className="flex items-center gap-1.5 text-muted-foreground"
                    title="Filled shape indicates a correct answer"
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                      <rect x="2" y="2" width="8" height="8" fill="currentColor" />
                    </svg>
                    Correct
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-muted-foreground"
                    title="Hollow outline indicates a missed question"
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                      <rect
                        x="2"
                        y="2"
                        width="8"
                        height="8"
                        fill="currentColor"
                        fillOpacity={0.12}
                        stroke="currentColor"
                        strokeWidth={2.2}
                      />
                    </svg>
                    Missed
                  </span>
                </>
              )}

              <span className="text-border">|</span>

              <span
                className="flex items-center gap-1 text-muted-foreground"
                title="Easy Difficulty"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                  <polygon points="6,1 1,10.5 11,10.5" fill="currentColor" />
                </svg>
                Easy
              </span>
              <span
                className="flex items-center gap-1 text-muted-foreground"
                title="Medium Difficulty"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                  <rect x="2" y="2" width="8" height="8" fill="currentColor" />
                </svg>
                Medium
              </span>
              <span
                className="flex items-center gap-1 text-muted-foreground"
                title="Hard Difficulty"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                  <polygon points="6,1 11,6 6,11 1,6" fill="currentColor" />
                </svg>
                Hard
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-x-3.5 gap-y-1.5 ml-auto">
              {trackDomainEntries.map(({ domain, moduleCount, color }) => {
                const isPresentInModule = moduleCount > 0;
                return (
                  <span
                    key={domain}
                    className={`flex items-center gap-1.5 transition-opacity ${
                      isPresentInModule ? "opacity-100" : "opacity-45"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="truncate max-w-48 text-foreground">{domain}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      ({moduleCount})
                    </span>
                  </span>
                );
              })}

              {clampedCount > 0 && (
                <>
                  <span className="text-border hidden sm:inline">|</span>
                  <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 shrink-0">
                    {clampedCount} capped at {yAxisCap}s+ (hover for exact time)
                  </span>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 border border-dashed border-border text-center text-xs text-muted-foreground">
          No response data available for this section.
        </div>
      )}
    </div>
  );

  if (hideCardWrapper) {
    return content;
  }

  return (
    <div className="bg-card border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-none shadow-sm space-y-4 w-full min-w-0">
      {content}
    </div>
  );
};