// components/analytics/SectionPacingTimeline.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
}

type OutcomeFilter = "all" | "incorrect" | "correct";

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
  timeSpent: number;    // True unclamped seconds
  plottedTime: number;  // Clamped to [0, yAxisCap] for clean Y-axis scaling
  isClamped: boolean;
  isCorrect: boolean;
  difficulty: string;
  domain: string;
  skill: string;
  domainColor: string;
  targetSeconds: number;
}

/**
 * Custom SVG scatter point with matched visual footprint:
 * - Color            -> Subject-track standardized Domain
 * - Shape            -> Difficulty (Triangle = Easy, Square = Medium, Diamond = Hard)
 * - Filled vs. Empty -> Outcome (Solid Filled = Correct; Hollow Outlined = Incorrect)
 * - Top Cap Bar      -> Indicates an outlier clamped to the 2.5x Y-axis ceiling
 */
const renderTimelineShape = (props: any) => {
  const { cx, cy, payload } = props;
  if (typeof cx !== "number" || typeof cy !== "number" || !payload) {
    return <g />;
  }

  const pt = payload as TimelinePoint;
  const color = pt.domainColor;
  const diff = normalizeDifficulty(pt.difficulty);
  const isCorrect = pt.isCorrect;

  const hollowStrokeWidth = 2.2;
  const inset = isCorrect ? 0 : hollowStrokeWidth / 2;

  const fillOpacity = isCorrect ? 0.95 : 0.12;
  const stroke = isCorrect ? "none" : color;
  const strokeWidth = isCorrect ? 0 : hollowStrokeWidth;

  // Offset slightly downward when pinned to the top Y-axis border so the shape + cap bar stay unclipped
  const drawY = pt.isClamped ? cy + 5 : cy;

  const capIndicator = pt.isClamped ? (
    <line
      x1={cx - 6.5}
      y1={drawY - 8.5}
      x2={cx + 6.5}
      y2={drawY - 8.5}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  ) : null;

  if (diff === "Easy") {
    const r = 6.6 - inset;
    const points = `${cx},${drawY - r} ${cx - r * 0.92},${drawY + r * 0.72} ${
      cx + r * 0.92
    },${drawY + r * 0.72}`;
    return (
      <g>
        {capIndicator}
        <polygon
          points={points}
          fill={color}
          fillOpacity={fillOpacity}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </g>
    );
  }

  if (diff === "Hard") {
    const r = 6.8 - inset;
    const points = `${cx},${drawY - r} ${cx + r},${drawY} ${cx},${drawY + r} ${
      cx - r
    },${drawY}`;
    return (
      <g>
        {capIndicator}
        <polygon
          points={points}
          fill={color}
          fillOpacity={fillOpacity}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </g>
    );
  }

  const half = 5.2 - inset;
  return (
    <g>
      {capIndicator}
      <rect
        x={cx - half}
        y={drawY - half}
        width={half * 2}
        height={half * 2}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </g>
  );
};

export const SectionPacingTimeline: React.FC<SectionPacingTimelineProps> = ({
  metadata,
  sectionResults,
  responses,
  activeSectionId: controlledSectionId,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    () => String(sectionResults[0]?.sectionId ?? "")
  );
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>("all");

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

  const sectionResponses = useMemo(() => {
    return responses
      .filter((r) => String(r.sectionId) === activeSectionId)
      .sort((a, b) => a.responseOrder - b.responseOrder);
  }, [responses, activeSectionId]);

  // Compute section target seconds/question (accounting for extended-time accommodations),
  // 0.65x–1.5x target pacing window, and dynamic 2.5x Y-axis ceiling rounded to nearest 10s
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

  // Standardize domain -> color assignment within the active section's SUBJECT TRACK
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

  const { plotData, maxQuestionNum, clampedCount } = useMemo(() => {
    const allPoints: TimelinePoint[] = sectionResponses.map((r, idx) => {
      const dom = r.domain || "General";
      const trueTime = r.timeSpentOnResponse ?? 0;
      const isClamped = trueTime > yAxisCap;
      return {
        questionId: String(r.questionId),
        questionNumber: r.responseOrder || idx + 1,
        timeSpent: trueTime,
        plottedTime: isClamped ? yAxisCap : trueTime,
        isClamped,
        isCorrect: r.isCorrect,
        difficulty: r.difficulty || "Medium",
        domain: dom,
        skill: r.skill || "General",
        domainColor: trackDomainColorMap.get(dom) ?? DOMAIN_PALETTE[0],
        targetSeconds,
      };
    });

    const filtered = allPoints.filter((pt) => {
      if (outcomeFilter === "incorrect") return !pt.isCorrect;
      if (outcomeFilter === "correct") return pt.isCorrect;
      return true;
    });

    const maxQ = allPoints.reduce(
      (acc, p) => Math.max(acc, p.questionNumber),
      1
    );
    const clamped = filtered.filter((p) => p.isClamped).length;

    return {
      plotData: filtered,
      maxQuestionNum: maxQ,
      clampedCount: clamped,
    };
  }, [
    sectionResponses,
    trackDomainColorMap,
    targetSeconds,
    yAxisCap,
    outcomeFilter,
  ]);

  const incorrectCount = useMemo(
    () => sectionResponses.filter((r) => !r.isCorrect).length,
    [sectionResponses]
  );
  const correctCount = sectionResponses.length - incorrectCount;

  if (sectionResults.length === 0) return null;

  return (
    <div className="bg-card border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-none shadow-sm space-y-4 w-full min-w-0">
      {/* Top Row: Title + Outcome Toggle (+ Embedded Section Selector only when uncontrolled) */}
      <div className="flex flex-col gap-3 border-b border-border pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Question-by-Question Pacing & Topic Breakdown
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              The shaded band shows your target pacing window (
              <span className="font-mono">
                {rushedFloorSec}s–{timeSinkCeilingSec}s
              </span>
              ). Color = content domain; shape = difficulty; filled vs. hollow = outcome.
            </p>
          </div>

          {/* Outcome Filter Segmented Control */}
          <div
            role="group"
            aria-label="Filter section timeline by outcome"
            className="inline-flex self-start lg:self-auto border border-border bg-muted/40 p-0.5 rounded-none shrink-0"
          >
            <button
              type="button"
              onClick={() => setOutcomeFilter("all")}
              className={`min-h-8 px-3 py-1 text-xs font-bold transition-colors ${
                outcomeFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({sectionResponses.length})
            </button>
            <button
              type="button"
              onClick={() => setOutcomeFilter("incorrect")}
              className={`min-h-8 px-3 py-1 text-xs font-bold transition-colors ${
                outcomeFilter === "incorrect"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Missed ({incorrectCount})
            </button>
            <button
              type="button"
              onClick={() => setOutcomeFilter("correct")}
              className={`min-h-8 px-3 py-1 text-xs font-bold transition-colors ${
                outcomeFilter === "correct"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Correct ({correctCount})
            </button>
          </div>
        </div>

        {/* Dynamic Section Selector Bar (only shown when not controlled by parent scorecard) */}
        {!controlledSectionId && (
          <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1 shrink-0">
              Section:
            </span>
            {sectionResults.map((sr) => {
              const secId = String(sr.sectionId);
              const isSelected = secId === activeSectionId;
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
                  {misses > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {misses} missed
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Multi-Channel Legend: Subject-Track Domains + Difficulty Shapes + Outcome Fill */}
      <div className="flex flex-col gap-2 text-[11px] sm:text-xs font-medium bg-muted/20 border border-border/60 px-3 py-2.5">
        {/* Row 1: All Possible Domains for This Subject Track */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Domains:
          </span>
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
        </div>

        {/* Row 2: Pacing Corridor Key + Difficulty Shapes + Correctness Fill Key */}
        <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4 pt-1.5 border-t border-border/50 text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-2.5 inline-block bg-sky-500/15 border-y border-dashed border-slate-500" />
              <span>
                Target Pacing Zone (
                <span className="font-mono text-[11px]">
                  {rushedFloorSec}s–{timeSinkCeilingSec}s
                </span>
                )
              </span>
            </span>
            {clampedCount > 0 && (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-3 h-0.5 inline-block bg-current" />
                <span>
                  <span className="font-mono">{clampedCount}</span> capped at{" "}
                  <span className="font-mono">{yAxisCap}s+</span> (hover for exact time)
                </span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1" title="Easy Difficulty">
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                <polygon points="6,1 1,10.5 11,10.5" fill="currentColor" />
              </svg>
              Easy
            </span>
            <span className="flex items-center gap-1" title="Medium Difficulty">
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                <rect x="2" y="2" width="8" height="8" fill="currentColor" />
              </svg>
              Medium
            </span>
            <span className="flex items-center gap-1" title="Hard Difficulty">
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                <polygon points="6,1 11,6 6,11 1,6" fill="currentColor" />
              </svg>
              Hard
            </span>

            <span className="text-border">|</span>

            <span
              className="flex items-center gap-1.5"
              title="Filled shape indicates a correct answer"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                <rect x="2" y="2" width="8" height="8" fill="currentColor" />
              </svg>
              Correct
            </span>
            <span
              className="flex items-center gap-1.5"
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
          </div>
        </div>
      </div>

      {/* Scatter Plot */}
      {plotData.length > 0 ? (
        <div className="w-full min-w-0 h-[300px]">
          <ResponsiveContainer width="100%" height={300} minWidth={0}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 24, left: 4 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-border"
                opacity={0.45}
              />
              <XAxis
                type="number"
                dataKey="questionNumber"
                domain={[1, maxQuestionNum]}
                allowDecimals={false}
                tickFormatter={(v) => `Q${v}`}
                fontSize={11}
                stroke="currentColor"
                className="text-muted-foreground"
                label={{
                  value: "Question Number",
                  position: "bottom",
                  offset: 6,
                  fontSize: 10,
                  fill: "currentColor",
                }}
              />
              <YAxis
                type="number"
                dataKey="plottedTime"
                domain={[0, yAxisCap]}
                allowDataOverflow={true}
                tickFormatter={(v) => (v === yAxisCap ? `${v}s+` : `${v}s`)}
                fontSize={11}
                width={48}
                stroke="currentColor"
                className="text-muted-foreground"
                label={{
                  value: "Time Spent (s)",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 10,
                  fill: "currentColor",
                }}
              />

              {/* Dynamic 0.65x to 1.5x Healthy Pacing Corridor */}
              <ReferenceArea
                y1={rushedFloorSec}
                y2={timeSinkCeilingSec}
                fill="#0284c7"
                fillOpacity={0.06}
                ifOverflow="extendDomain"
              />

              {/* Lower Bound: 0.65x Hurried Threshold */}
              <ReferenceLine
                y={rushedFloorSec}
                stroke="#e11d48"
                strokeDasharray="3 3"
                strokeOpacity={0.6}
                label={{
                  value: `0.65× (${rushedFloorSec}s)`,
                  position: "insideBottomRight",
                  fontSize: 9.5,
                  fill: "#e11d48",
                }}
              />

              {/* Center Target: 1.0x Allotted Pace */}
              <ReferenceLine
                y={targetSeconds}
                stroke="#64748b"
                strokeDasharray="4 4"
                strokeOpacity={0.85}
                label={{
                  value: `Target: ${targetSeconds}s`,
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: "#64748b",
                }}
              />

              {/* Upper Bound: 1.5x Over-Time Threshold */}
              <ReferenceLine
                y={timeSinkCeilingSec}
                stroke="#d97706"
                strokeDasharray="3 3"
                strokeOpacity={0.7}
                label={{
                  value: `1.5× (${timeSinkCeilingSec}s)`,
                  position: "insideTopRight",
                  fontSize: 9.5,
                  fill: "#d97706",
                }}
              />

              <Tooltip
                cursor={{ strokeDasharray: "3 3", strokeOpacity: 0.4 }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const pt = payload[0].payload as TimelinePoint;
                  const paceRatio = (pt.timeSpent / pt.targetSeconds).toFixed(2);
                  return (
                    <div className="bg-popover text-popover-foreground border border-border p-3 text-xs shadow-md space-y-1.5">
                      <div className="font-bold flex items-center justify-between gap-4">
                        <span>Question {pt.questionNumber}</span>
                        <span
                          className={`font-mono font-bold ${
                            pt.isCorrect
                              ? "text-sky-600 dark:text-sky-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {pt.isCorrect ? "Correct" : "Missed"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                          style={{ backgroundColor: pt.domainColor }}
                        />
                        <span className="font-semibold text-foreground">
                          {pt.domain}
                        </span>
                        <span className="text-muted-foreground">
                          ({pt.difficulty})
                        </span>
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
                }}
              />
              <Scatter
                data={plotData}
                shape={renderTimelineShape}
                isAnimationActive={false}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="p-8 border border-dashed border-border text-center text-xs text-muted-foreground">
          No {outcomeFilter === "incorrect" ? "missed" : outcomeFilter} questions in this section.
        </div>
      )}
    </div>
  );
};