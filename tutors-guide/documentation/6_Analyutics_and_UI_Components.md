# Technical Documentation: Analytics & UI Components

This section covers the post-exam diagnostics experience and interactive data visualization layer (`components/analytics/`), detailing tab orchestration, multi-section scorecards, synchronized pacing graphs, and domain/skill accuracy breakdowns.

---

## 1. Results Orchestration & Navigation

### `components/analytics/TestAnalyticsClient.tsx`

* **Purpose & Scope:** Top-level client controller for the exam results experience (`app/tests/[category]/[testId]/results`). Manages sticky sub-navigation across **Score & Pacing Overview**, **Study Action Plan**, and **Question Review**, along with cross-tab deep-linking and item-level filtering.
* **Exports:**
  * `TestAnalyticsClient: React.FC<TestAnalyticsClientProps>`
* **Parameters / Props (`TestAnalyticsClientProps`):**
  * `metadata`: `TestMetadata` — Exam title, category, and section definitions.
  * `testSummary`: `TestSummaryData | null` — Composite score and percentile summary.
  * `sectionResults`: `SectionResultData[]` — Section-level raw/scaled scores and telemetry.
  * `responses`: `EnrichedResponseItem[]` — Item-level student responses enriched with frontmatter metadata.
  * `adaptiveTrajectory?`: `AdaptiveTrajectoryData | null` — Multi-stage adaptive routing summaries.
  * `stickyTopClass?`: `string` — Sticky offset class docking the controller bar beneath the active navbar (defaults to `"top-16"`).
* **Dependencies & Imports:**
  * `UnifiedAnalyticsDashboard` from `@/components/analytics/UnifiedAnalyticsDashboard`.
  * `ActionableDiagnosticsPanel` from `./ActionableDiagnosticPanel`.
  * `QuestionResultCard` from `@/components/analytics/QuestionResultCard`.
  * `BarChart3`, `Search`, `ChevronRight`, `ChevronLeft`, `RotateCcw`, `Lightbulb`, `X`, `Filter` from `lucide-react`.
* **Key Logic & Edge Cases:**
  * **Action Plan Deep-Linking (`flaggedCohort`):** Clicking **Inspect Questions** inside `ActionableDiagnosticsPanel` switches to the `review` tab, resets existing section/attribute filters, and mounts a dismissible focus banner filtering the `Question Navigator` to the targeted question IDs.
  * **Streamlined Question Review Tab:** Diagnostic summary charts (`TopicSkillAccuracyAccordion` and difficulty accuracy bars) are excluded from the **Question Review** tab so students can move directly from section selector chips and multi-attribute filters (Outcome, Difficulty, Domain, Changed Answer, Used Calculator) into the section-grouped `Question Navigator` and `QuestionResultCard` inspector.

---

## 2. Scorecards & Synchronized Pacing Visualizations

### `components/analytics/UnifiedAnalyticsDashboard.tsx`

* **Purpose & Scope:** Primary analytics dashboard rendered inside the **Score & Pacing Overview** tab. Unifies the multi-section scorecard header, adaptive stage summaries, target pacing key, dual-mode pacing visualization (`Question Bars` vs. `Domain Pacing`), and a responsive 1/3–2/3 bottom row pairing the `Question Navigation Timeline` with `TopicSkillAccuracyAccordion`.
* **Exports:**
  * `default function UnifiedAnalyticsDashboard(props: UnifiedAnalyticsDashboardProps)`
* **Parameters / Props (`UnifiedAnalyticsDashboardProps`):**
  * `metadata`: `TestMetadata`
  * `testSummary`: `TestSummaryData | null`
  * `sectionResults`: `SectionResultData[]`
  * `responses`: `EnrichedResponseItem[]`
  * `adaptiveTrajectory?`: `AdaptiveTrajectoryData | null`
* **Dependencies & Imports:**
  * `Bar`, `BarChart`, `CartesianGrid`, `Cell`, `XAxis`, `YAxis`, `Line`, `LineChart`, `Tooltip`, `ReferenceLine`, `ReferenceArea` from `recharts`.
  * `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle` from `@/components/ui/card`.
  * `ChartConfig`, `ChartContainer`, `ChartTooltip`, `ChartTooltipContent` from `@/components/ui/chart`.
  * `SectionPacingTimeline` from `@/components/analytics/SectionPacingTimeline`.
  * `TopicSkillAccuracyAccordion` from `@/components/analytics/TopicSkillAccuracyAccordion`.
  * `Clock` from `lucide-react`.
* **Key Logic & Edge Cases:**
  * **Breakpoint Stability (`useDesktopBreakpoint`):** Uses `window.matchMedia("(min-width: 1024px)")` rather than raw `window.resize` listeners so mobile address-bar expansion/retraction during vertical scrolling (which mutates `innerHeight`) never triggers unnecessary re-renders or animation replays.
  * **Category-Aware Scorecard & SAT Module Abbreviations:** Dynamically formats composite/overall scores across `SAT` (`/1600` + stage summaries), `ACT` (`/36`), `AP_CALC` (`/5` + `/108 pts`), `GRE` (`/340`), and `ACADEMIC` (`%` + `pts earned`), abbreviating SAT section tabs (`RW1`, `RW2`, `M1`, `M2`) for compact horizontal fit.
  * **Dynamic Pacing Corridor & Outlier Clamping:** Computes per-question `targetPacingSeconds` (factoring in accommodation `timeMultiplier`), renders a `0.65×–1.5×` target zone (`ReferenceArea`) and dashed target line (`ReferenceLine`), and clamps dwell-time outliers at `2.5×` target pace (`timeAxisCap`, rounded to the nearest `10s`) while preserving exact unclamped seconds in hover tooltips.
  * **Responsive Bar Orientation & Below-Chart Legend:** Renders a horizontal `<BarChart>` (`initialDimension={{ width: 960, height: 300 }}`) on desktop (`lg+`) and a vertical `<BarChart>` (`Q1`–`Qn` along the Y-axis, `30px` row step) on mobile/tablet, with the Correct/Missed legend strip anchored below the chart.
  * **Section-Synchronized Bottom Row:** Renders a 1/3-width `Question Navigation Timeline` (`stepAfter` `<LineChart>`) beside a 2/3-width `<TopicSkillAccuracyAccordion responses={activeResponses} />` on `lg+` viewports (stacked on mobile), both synchronized to the active scorecard section tab.

---

### `components/analytics/SectionPacingTimeline.tsx`

* **Purpose & Scope:** Multi-dimensional scatter plot (`Domain Pacing` mode) encoding content domain (color), item difficulty (triangle = Easy, square = Medium, diamond = Hard), and outcome (filled = Correct, hollow = Missed) against per-question dwell time and target pacing bands.
* **Exports:**
  * `SectionPacingTimeline: React.FC<SectionPacingTimelineProps>`
* **Parameters / Props (`SectionPacingTimelineProps`):**
  * `metadata`: `TestMetadata`
  * `sectionResults`: `SectionResultData[]`
  * `responses`: `EnrichedResponseItem[]`
  * `activeSectionId?`: `string` — Optional controlled section ID passed from `UnifiedAnalyticsDashboard`.
  * `hideCardWrapper?`: `boolean` — Suppresses outer card chrome when embedded inside `UnifiedAnalyticsDashboard`.
  * `isLg?`: `boolean` — Optional controlled desktop breakpoint boolean from parent.
* **Dependencies & Imports:**
  * `ScatterChart`, `Scatter`, `XAxis`, `YAxis`, `CartesianGrid`, `ReferenceLine`, `ReferenceArea`, `Tooltip` from `recharts`.
  * `ChartConfig`, `ChartContainer` from `@/components/ui/chart`.
* **Key Logic & Edge Cases:**
  * **Subject-Track Domain Color Consistency (`resolveSubjectTrack`):** Maps related sections across multi-module subjects (e.g., `RW1` + `RW2` or `M1` + `M2`) to a unified domain palette so domain colors remain consistent when switching modules.
  * **Half-Step Axis Inset (`[0.5, maxQuestionNum + 0.5]`):** Extends the continuous numeric question axis by `0.5` on both ends so markers align pixel-for-pixel with the categorical band scale of `UnifiedAnalyticsDashboard`'s bar chart, while offsetting `0s` unattempted points (`±5px`) and clamped outliers (`±5px` + cap bar) safely inside plot bounds.
  * **Responsive Axis Inversion:** Renders questions horizontally along the X-axis on desktop (`lg+`) and vertically (`reversed={true}`, `Q1` at top) along the Y-axis on mobile/tablet (`< 1024px`).
  * **Single-Stage Entrance Animation & Split Below-Chart Legend:** Bypasses Recharts' default `<Scatter>` delay (`isAnimationActive={false}`) in favor of a single `400ms ease-out` CSS keyframe (`scatterRise` defined as a module-level constant) with fixed rise offsets (`±28px`) and memoized `initialDimension` objects to prevent resize flicker. Displays Outcome and Difficulty keys left-aligned and Domain badges right-aligned below the chart.

---

## 3. Domain & Skill Breakdown

### `components/analytics/TopicSkillAccuracyAccordion.tsx`

* **Purpose & Scope:** Interactive accordion displaying section-scoped accuracy grouped by content domain, with chronological question outcome pips, accuracy percentages, sorting controls, and expandable horizontal stacked bar charts for individual skills.
* **Exports:**
  * `TopicSkillAccuracyAccordion(props: TopicSkillAccuracyAccordionProps)`
* **Parameters / Props (`TopicSkillAccuracyAccordionProps`):**
  * `responses`: `EnrichedResponseItem[]` — Active section responses passed from `UnifiedAnalyticsDashboard`.
* **Dependencies & Imports:**
  * `Bar`, `BarChart`, `CartesianGrid`, `XAxis`, `YAxis` from `recharts`.
  * `ChevronDown`, `ChevronRight`, `ArrowUpDown` from `lucide-react`.
  * `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle` from `@/components/ui/card`.
  * `ChartConfig`, `ChartContainer`, `ChartTooltip`, `ChartTooltipContent` from `@/components/ui/chart`.
* **Key Logic & Edge Cases:**
  * **Dynamic Y-Axis Label Width (`calculateYAxisWidth`):** Wraps multi-word skill names at 26 characters (`wrapText`) and dynamically computes `<YAxis width={...} />` from the longest wrapped line (`Math.max(80, Math.ceil(maxLineLength * 6.2) + 12)`) with `margin.left = 0`, eliminating excess whitespace to the left of skill labels.
  * **Dual-Criteria Sorting:** Supports toggling between `"most-missed"` (descending incorrect count, ascending accuracy tiebreaker) and `"lowest-accuracy"` (ascending accuracy, descending incorrect count tiebreaker), collapsing open drawers on sort change.