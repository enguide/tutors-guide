// lib/analytics/actionableDiagnostics.ts
import { EnrichedResponseItem, SectionResultData } from "@/types/analytics";
import { TestMetadata } from "@/types/content";

export type DiagnosticSignalCategory =
  | "SKILL_BOTTLENECK"
  | "PACING_DRAIN"
  | "RUSHED_ERRORS"
  | "VISUAL_STIMULUS_PENALTY"
  | "END_OF_MODULE_FATIGUE"
  | "REVISION_TRAP"
  | "FOUNDATIONAL_ACCURACY";

export interface ActionableDirective {
  id: string;
  rank: number;
  category: DiagnosticSignalCategory;
  badge: string;
  title: string;
  evidenceSummary: string;
  sampleLabel: string;
  confidenceLabel: "Strong Pattern" | "Emerging Pattern";
  actionStep: string;
  matchingQuestionIds: string[];
  impactScore: number;
}

export interface QuadrantPoint {
  questionId: string;
  sectionId: string;
  sectionTitle: string;
  label: string;
  responseOrder: number;
  paceRatio: number; // e.g., 1.0 = 100% of allotted seconds/question (accommodation-adjusted)
  timeSpent: number;
  targetSeconds: number;
  isCorrect: boolean;
  difficulty: string;
  domain: string;
  skill: string;
  quadrant: "MASTERY" | "TIME_SINK" | "RUSHED_MISS" | "CONTENT_GAP";
}

export interface DiagnosticsReport {
  totalAnalyzed: number;
  totalIncorrect: number;
  suppressedLowSampleCount: number;
  hasExtendedTime: boolean;
  maxTimeMultiplier: number;
  directives: ActionableDirective[];
  quadrantPoints: QuadrantPoint[];
  quadrantCounts: {
    mastery: number;
    timeSinkCorrect: number;
    timeSinkIncorrect: number;
    rushedMiss: number;
    contentGap: number;
  };
  revisionTelemetry: {
    totalSwitches: number;
    wrongToRight: number;
    rightToWrong: number;
    wrongToWrong: number;
    netGain: number;
  };
}

/**
 * Wilson Score Interval Lower Bound for an error proportion (z = 1.645 for 90% one-sided guard).
 * Penalizes tiny denominators automatically to prevent false alarms from isolated misses.
 */
function wilsonLowerBound(errors: number, total: number, z = 1.645): number {
  if (total <= 0) return 0;
  const p = errors / total;
  const z2 = z * z;
  const denominator = 1 + z2 / total;
  const center = p + z2 / (2 * total);
  const margin = z * Math.sqrt((p * (1 - p) + z2 / (4 * total)) / total);
  return Math.max(0, (center - margin) / denominator);
}

/**
 * Resolves the student's approved timing multiplier for a section (1.0 = standard, 1.5 = time-and-a-half, etc.).
 */
function resolveTimeMultiplier(sr: SectionResultData): number {
  const acc = sr.accommodations;
  if (!acc || typeof acc !== "object") return 1.0;

  if (typeof acc.timeMultiplier === "number" && acc.timeMultiplier > 0) {
    return acc.timeMultiplier;
  }
  if (acc.extendedTime === true) {
    return 1.5;
  }
  return 1.0;
}

function normalizeDifficultyBucket(raw?: string): "Easy" | "Medium" | "Hard" {
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

export function buildActionableDiagnostics(params: {
  responses: EnrichedResponseItem[];
  sectionResults: SectionResultData[];
  metadata: TestMetadata;
  selectedSectionId?: string;
}): DiagnosticsReport {
  const { responses, sectionResults, metadata, selectedSectionId = "all" } = params;

  const scopedResponses =
    selectedSectionId === "all"
      ? responses
      : responses.filter((r) => String(r.sectionId) === selectedSectionId);

  // Map per-section target seconds per question (explicitly adjusted for accommodations)
  const sectionTargetSeconds = new Map<string, number>();
  const sectionMultipliers = new Map<string, number>();
  const sectionTitles = new Map<string, string>();
  let maxTimeMultiplier = 1.0;

  for (const sr of sectionResults) {
    const srSecId = String(sr.sectionId);
    const secResps = responses.filter((r) => String(r.sectionId) === srSecId);
    const qCount = secResps.length || sr.totalQuestions || 1;
    sectionTitles.set(srSecId, sr.section.title);

    const manifestSec = metadata.sections?.find((s) => String(s.id) === srSecId);
    const baseLimit = manifestSec?.timeLimit || sr.section.timeLimit || 0;
    const multiplier = resolveTimeMultiplier(sr);
    sectionMultipliers.set(srSecId, multiplier);

    if (
      (selectedSectionId === "all" || selectedSectionId === srSecId) &&
      multiplier > maxTimeMultiplier
    ) {
      maxTimeMultiplier = multiplier;
    }

    const baseTarget = baseLimit > 0 ? baseLimit / qCount : 80;
    const adjustedTargetSec = Math.round(baseTarget * multiplier);
    sectionTargetSeconds.set(srSecId, Math.max(20, adjustedTargetSec));
  }

  const hasExtendedTime = maxTimeMultiplier > 1.0;

  // Build Quadrant Points & Answer-Change Summary
  const quadrantPoints: QuadrantPoint[] = [];
  const quadrantCounts = {
    mastery: 0,
    timeSinkCorrect: 0,
    timeSinkIncorrect: 0,
    rushedMiss: 0,
    contentGap: 0,
  };

  let totalSwitches = 0;
  let wrongToRight = 0;
  let rightToWrong = 0;
  let wrongToWrong = 0;

  for (const item of scopedResponses) {
    const secId = String(item.sectionId);
    const targetSec = sectionTargetSeconds.get(secId) ?? 80;
    const spent = item.timeSpentOnResponse ?? 0;
    const paceRatio = Number((spent / targetSec).toFixed(2));

    let quadrant: QuadrantPoint["quadrant"] = "MASTERY";
    if (paceRatio > 1.5) {
      quadrant = "TIME_SINK";
      if (item.isCorrect) quadrantCounts.timeSinkCorrect++;
      else quadrantCounts.timeSinkIncorrect++;
    } else if (!item.isCorrect && paceRatio < 0.65) {
      quadrant = "RUSHED_MISS";
      quadrantCounts.rushedMiss++;
    } else if (!item.isCorrect) {
      quadrant = "CONTENT_GAP";
      quadrantCounts.contentGap++;
    } else {
      quadrantCounts.mastery++;
    }

    quadrantPoints.push({
      questionId: String(item.questionId),
      sectionId: secId,
      sectionTitle: sectionTitles.get(secId) || "Section",
      label: `Q${item.responseOrder}`,
      responseOrder: item.responseOrder,
      paceRatio,
      timeSpent: spent,
      targetSeconds: targetSec,
      isCorrect: item.isCorrect,
      difficulty: item.difficulty,
      domain: item.domain,
      skill: item.skill,
      quadrant,
    });

    if (item.changedAnswer) {
      totalSwitches++;
      if (item.isCorrect) {
        wrongToRight++;
      } else {
        wrongToWrong++;
      }
    }
  }

  rightToWrong = Math.max(0, totalSwitches - wrongToRight);
  const netGain = wrongToRight - rightToWrong;

  const candidates: ActionableDirective[] = [];
  let suppressedLowSampleCount = 0;

  const baselineAccuracy =
    scopedResponses.length > 0
      ? scopedResponses.filter((r) => r.isCorrect).length / scopedResponses.length
      : 0;

  // ---------------------------------------------------------------------------
  // 1. Recurring Topic & Skill Gaps (n >= 3, errors >= 2)
  // ---------------------------------------------------------------------------
  const skillGroups = new Map<string, EnrichedResponseItem[]>();
  for (const r of scopedResponses) {
    const key = `${r.domain}|||${r.skill}`;
    const list = skillGroups.get(key) ?? [];
    list.push(r);
    skillGroups.set(key, list);
  }

  for (const [key, items] of skillGroups.entries()) {
    const [domain, skill] = key.split("|||");
    const misses = items.filter((i) => !i.isCorrect);
    if (misses.length === 0) continue;

    if (items.length < 3 || misses.length < 2) {
      suppressedLowSampleCount++;
      continue;
    }

    const errorRate = misses.length / items.length;
    const wilsonFloor = wilsonLowerBound(misses.length, items.length);

    if (errorRate >= 0.45 && wilsonFloor >= 0.28) {
      const pctError = Math.round(errorRate * 100);
      candidates.push({
        id: `skill-${domain}-${skill}`,
        rank: 0,
        category: "SKILL_BOTTLENECK",
        badge: "Topic to Review",
        title: `Focus on ${skill} (${domain})`,
        evidenceSummary: `You missed ${misses.length} of ${items.length} questions in this topic (${pctError}% miss rate), compared to your ${Math.round(
          (1 - baselineAccuracy) * 100
        )}% miss rate across the rest of this section.`,
        sampleLabel: `${misses.length} of ${items.length} missed`,
        confidenceLabel: items.length >= 5 ? "Strong Pattern" : "Emerging Pattern",
        actionStep: `Work through a focused set of 10–15 untimed practice questions on ${skill}. Write out the core rule or setup step for each problem before checking the solution.`,
        matchingQuestionIds: misses.map((m) => String(m.questionId)),
        impactScore: wilsonFloor * 100 + misses.length * 6,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Time-Management Checkpoints (> 1.5x target pace, n >= 3)
  // ---------------------------------------------------------------------------
  const timeSinks = quadrantPoints.filter((p) => p.quadrant === "TIME_SINK");
  if (timeSinks.length >= 3) {
    const incorrectSinks = timeSinks.filter((p) => !p.isCorrect);
    const totalExcessSec = timeSinks.reduce(
      (sum, p) => sum + Math.max(0, p.timeSpent - p.targetSeconds),
      0
    );
    const excessMins = (totalExcessSec / 60).toFixed(1);

    // Compute dynamic 1.25x checkpoint tailored to this exam & accommodation multiplier
    const avgTargetSec =
      timeSinks.reduce((sum, p) => sum + p.targetSeconds, 0) / timeSinks.length;
    const dynamicBailoutSec = Math.round(avgTargetSec * 1.25);
    const accommodationNote = hasExtendedTime
      ? ` (adjusted for your ${maxTimeMultiplier}× extended-time pacing)`
      : "";

    candidates.push({
      id: "pacing-drain",
      rank: 0,
      category: "PACING_DRAIN",
      badge: "Time Management",
      title: `Set a ~${dynamicBailoutSec}s Checkpoint on Tough Questions`,
      evidenceSummary: `${timeSinks.length} questions took more than 1.5× your target pace${accommodationNote}, costing ${excessMins} extra minutes (${incorrectSinks.length} of which were still missed).`,
      sampleLabel: `${timeSinks.length} over-time questions (${excessMins}m extra)`,
      confidenceLabel: timeSinks.length >= 5 ? "Strong Pattern" : "Emerging Pattern",
      actionStep: `Use a ${dynamicBailoutSec}-second checkpoint: if you do not have a clear path to the answer by 1.25× target time, flag the question, enter your best educated guess, and move forward to protect time for later problems.`,
      matchingQuestionIds: timeSinks.map((p) => p.questionId),
      impactScore: timeSinks.length * 8 + incorrectSinks.length * 6,
    });
  } else if (timeSinks.length > 0) {
    suppressedLowSampleCount++;
  }

  // ---------------------------------------------------------------------------
  // 3. Straightforward Point Recovery (Easy-tier unforced errors, n >= 3, >= 35% miss)
  // ---------------------------------------------------------------------------
  const easyItems = scopedResponses.filter(
    (r) => normalizeDifficultyBucket(r.difficulty) === "Easy"
  );
  const easyMisses = easyItems.filter((r) => !r.isCorrect);

  if (easyItems.length >= 3 && easyMisses.length >= 2) {
    const easyErrorRate = easyMisses.length / easyItems.length;
    const easyWilson = wilsonLowerBound(easyMisses.length, easyItems.length);

    if (easyErrorRate >= 0.35 && easyWilson >= 0.22) {
      const pctEasyError = Math.round(easyErrorRate * 100);
      candidates.push({
        id: "foundational-accuracy",
        rank: 0,
        category: "FOUNDATIONAL_ACCURACY",
        badge: "High-Value Point Recovery",
        title: `Lock In Points on Straightforward Questions`,
        evidenceSummary: `You missed ${easyMisses.length} of ${easyItems.length} Easy-tier questions (${pctEasyError}% miss rate)—points that are well within your reach.`,
        sampleLabel: `${easyMisses.length} of ${easyItems.length} Easy questions missed`,
        confidenceLabel: easyItems.length >= 5 ? "Strong Pattern" : "Emerging Pattern",
        actionStep: `Treat early and straightforward questions as must-get points: double-check signs, units, and what the final question is actually asking before confirming your choice.`,
        matchingQuestionIds: easyMisses.map((m) => String(m.questionId)),
        impactScore: easyWilson * 105 + easyMisses.length * 8,
      });
    }
  } else if (easyMisses.length > 0) {
    suppressedLowSampleCount++;
  }

  // ---------------------------------------------------------------------------
  // 4. Hurried / Premature Misses (< 0.65x target pace, n >= 3)
  // ---------------------------------------------------------------------------
  const rushedMisses = quadrantPoints.filter((p) => p.quadrant === "RUSHED_MISS");
  if (rushedMisses.length >= 3) {
    const avgRushedSec = Math.round(
      rushedMisses.reduce((sum, p) => sum + p.timeSpent, 0) / rushedMisses.length
    );

    candidates.push({
      id: "rushed-misses",
      rank: 0,
      category: "RUSHED_ERRORS",
      badge: "Pacing Discipline",
      title: `Take an Extra Beat Before Submitting Fast Answers`,
      evidenceSummary: `${rushedMisses.length} missed questions were answered in under 65% of your target time (averaging ${avgRushedSec}s per question).`,
      sampleLabel: `${rushedMisses.length} hurried misses`,
      confidenceLabel: rushedMisses.length >= 4 ? "Strong Pattern" : "Emerging Pattern",
      actionStep: `Build in a quick 5-second check before advancing—re-read the question stem for qualifiers like "NOT," "LEAST," or specific unit conversions.`,
      matchingQuestionIds: rushedMisses.map((p) => p.questionId),
      impactScore: rushedMisses.length * 10,
    });
  } else if (rushedMisses.length > 0) {
    suppressedLowSampleCount++;
  }

  // ---------------------------------------------------------------------------
  // 5. Reading Graphs, Charts & Figures (n >= 4 each)
  // ---------------------------------------------------------------------------
  const visualItems = scopedResponses.filter(
    (r) => Boolean(r.containsGraph || r.containsChart || r.containsDiagram)
  );
  const textOnlyItems = scopedResponses.filter(
    (r) => !r.containsGraph && !r.containsChart && !r.containsDiagram
  );

  if (visualItems.length >= 4 && textOnlyItems.length >= 4) {
    const visualAcc =
      visualItems.filter((r) => r.isCorrect).length / visualItems.length;
    const textAcc =
      textOnlyItems.filter((r) => r.isCorrect).length / textOnlyItems.length;
    const accDrop = textAcc - visualAcc;

    if (accDrop >= 0.18) {
      const visualMisses = visualItems.filter((r) => !r.isCorrect);
      candidates.push({
        id: "visual-stimulus-penalty",
        rank: 0,
        category: "VISUAL_STIMULUS_PENALTY",
        badge: "Reading Graphs & Figures",
        title: `Read Axes, Units & Legends Before Answer Choices`,
        evidenceSummary: `Your accuracy on questions with graphs, charts, or diagrams was ${Math.round(
          visualAcc * 100
        )}% (${visualItems.length - visualMisses.length}/${
          visualItems.length
        }), compared to ${Math.round(textAcc * 100)}% on text-only questions.`,
        sampleLabel: `${visualMisses.length} of ${visualItems.length} figure questions missed`,
        confidenceLabel: visualItems.length >= 6 ? "Strong Pattern" : "Emerging Pattern",
        actionStep: `Before looking at the answer choices on any figure-based question, underline the axis labels, check the scale intervals, and verify what each line or bar represents.`,
        matchingQuestionIds: visualMisses.map((m) => String(m.questionId)),
        impactScore: accDrop * 100 + visualMisses.length * 5,
      });
    }
  } else if (visualItems.length > 0) {
    suppressedLowSampleCount++;
  }

  // ---------------------------------------------------------------------------
  // 6. Late-Section Pacing & Stamina (Final 25% of section)
  // ---------------------------------------------------------------------------
  const lateItems: EnrichedResponseItem[] = [];
  const earlyItems: EnrichedResponseItem[] = [];

  for (const sr of sectionResults) {
    const srSecId = String(sr.sectionId);
    if (selectedSectionId !== "all" && srSecId !== selectedSectionId) continue;
    const secItems = scopedResponses
      .filter((r) => String(r.sectionId) === srSecId)
      .sort((a, b) => a.responseOrder - b.responseOrder);

    if (secItems.length < 8) continue;
    const cutoff = Math.floor(secItems.length * 0.75);
    earlyItems.push(...secItems.slice(0, cutoff));
    lateItems.push(...secItems.slice(cutoff));
  }

  if (lateItems.length >= 4 && earlyItems.length >= 8) {
    const earlyAcc = earlyItems.filter((r) => r.isCorrect).length / earlyItems.length;
    const lateAcc = lateItems.filter((r) => r.isCorrect).length / lateItems.length;
    const fatigueDrop = earlyAcc - lateAcc;

    if (fatigueDrop >= 0.2) {
      const lateMisses = lateItems.filter((r) => !r.isCorrect);
      candidates.push({
        id: "end-of-module-fatigue",
        rank: 0,
        category: "END_OF_MODULE_FATIGUE",
        badge: "End-of-Section Pacing",
        title: `Save Enough Time for the Final Quarter of the Section`,
        evidenceSummary: `Your accuracy dipped from ${Math.round(
          earlyAcc * 100
        )}% in the first three-quarters of the section to ${Math.round(
          lateAcc * 100
        )}% in the final quarter.`,
        sampleLabel: `${lateMisses.length} of ${lateItems.length} closing questions missed`,
        confidenceLabel: lateItems.length >= 8 ? "Strong Pattern" : "Emerging Pattern",
        actionStep: `Glance at the clock when you reach the halfway question—aim to have at least half your time remaining so the closing questions never feel rushed.`,
        matchingQuestionIds: lateMisses.map((m) => String(m.questionId)),
        impactScore: fatigueDrop * 95 + lateMisses.length * 4,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 7. Second-Guessing Habit (n >= 4 answer changes, net loss <= -2)
  // ---------------------------------------------------------------------------
  if (totalSwitches >= 4 && netGain <= -2) {
    const switchedMisses = scopedResponses.filter(
      (r) => r.changedAnswer && !r.isCorrect
    );
    candidates.push({
      id: "revision-trap",
      rank: 0,
      category: "REVISION_TRAP",
      badge: "Second-Guessing Habit",
      title: `Trust Your First Instinct Unless You Find Concrete Proof`,
      evidenceSummary: `Across ${totalSwitches} answer changes, ${rightToWrong} switched away from the right answer while ${wrongToRight} switched to the right answer (a net loss of ${Math.abs(
        netGain
      )} points).`,
      sampleLabel: `${totalSwitches} answer changes (${netGain} net)`,
      confidenceLabel: totalSwitches >= 6 ? "Strong Pattern" : "Emerging Pattern",
      actionStep: `During end-of-section review, keep your initial choice unless you spot a clear misread in the prompt or a specific calculation mistake.`,
      matchingQuestionIds: switchedMisses.map((m) => String(m.questionId)),
      impactScore: Math.abs(netGain) * 11,
    });
  } else if (totalSwitches > 0 && totalSwitches < 4) {
    suppressedLowSampleCount++;
  }

  // Sort by highest expected point recovery and cap at top 4 focus areas
  const directives = candidates
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 4)
    .map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

  return {
    totalAnalyzed: scopedResponses.length,
    totalIncorrect: scopedResponses.filter((r) => !r.isCorrect).length,
    suppressedLowSampleCount,
    hasExtendedTime,
    maxTimeMultiplier,
    directives,
    quadrantPoints,
    quadrantCounts,
    revisionTelemetry: {
      totalSwitches,
      wrongToRight,
      rightToWrong,
      wrongToWrong,
      netGain,
    },
  };
}