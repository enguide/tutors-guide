// app/dashboard/tests/page.tsx
import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  RotateCcw,
} from "lucide-react";
import { getAllAvailableTests, getTestMetadata, DiscoveredTestItem } from "@/lib/contentLoader";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

export const instant = false;

const CATEGORY_META: Record<
  string,
  { label: string; platform: string; badge: string }
> = {
  SAT: {
    label: "Digital SAT",
    platform: "Bluebook Emulation",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  ACT: {
    label: "ACT Digital",
    platform: "TestNav Emulation",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
  },
  GRE: {
    label: "GRE General",
    platform: "ETS PowerPrep Emulation",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  AP_CALC: {
    label: "AP Calculus AB",
    platform: "Academic Layout",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
};

function isTestEntitled(
  role: string | undefined,
  userEntitlements: string[],
  category: string,
  testId: string
): boolean {
  if (role === "ADMIN") return true;
  if (userEntitlements.includes(category)) return true;
  if (userEntitlements.includes(`${category}:*`)) return true;

  return userEntitlements.some((ent) => {
    const [prefix, slug] = ent.split(":");
    if (prefix?.toUpperCase() !== category.toUpperCase()) return false;
    return slug ? testId.toLowerCase().includes(slug.toLowerCase()) : true;
  });
}

async function TestsLibraryContent() {
  await connection();
  const session = await auth();

  const userEntitlements: string[] = session?.user?.entitlements || [];
  const userRole = session?.user?.role;

  // 1. Fetch available tests, completed summaries, section results, AND active checkpoints
  const [
    availableTestsByCategory,
    completedSummaries,
    userSectionResults,
    userSectionCheckpoints,
  ] = await Promise.all([
    getAllAvailableTests(),
    session?.user?.id
      ? prisma.testSummary.findMany({
          where: { profileId: session.user.id },
          select: { testId: true, compositeScore: true },
        })
      : Promise.resolve([]),
    session?.user?.id
      ? prisma.result.findMany({
          where: { profileId: session.user.id },
          select: { testId: true, sectionId: true },
        })
      : Promise.resolve([]),
    session?.user?.id
      ? prisma.sectionCheckpoint.findMany({
          where: { profileId: session.user.id },
          select: { testId: true, sectionId: true },
        })
      : Promise.resolve([]),
  ]);

  // Filter categories & tests using the same granular entitlement logic as /dashboard
  const entitledCategories = Object.entries(availableTestsByCategory)
    .map(([category, tests]) => [
      category,
      tests.filter((t) => isTestEntitled(userRole, userEntitlements, category, t.testId)),
    ] as [string, DiscoveredTestItem[]])
    .filter(([, tests]) => tests.length > 0);

  const completedMap = new Map(completedSummaries.map((s) => [s.testId, s]));

  const completedSectionsByTest = new Map<string, Set<string>>();
  for (const r of userSectionResults) {
    if (!completedSectionsByTest.has(r.testId)) {
      completedSectionsByTest.set(r.testId, new Set());
    }
    completedSectionsByTest.get(r.testId)!.add(r.sectionId);
  }

  const checkpointByTest = new Map<string, string>();
  for (const cp of userSectionCheckpoints) {
    checkpointByTest.set(cp.testId, cp.sectionId);
  }

  // Pre-resolve pending section IDs for any in-progress tests (either finished sections or active checkpoint)
  const inProgressMap = new Map<
    string,
    { resumeSectionId: string; completedCount: number }
  >();

  for (const [category, tests] of entitledCategories) {
    for (const test of tests) {
      if (!completedMap.has(test.testId)) {
        const finishedSet = completedSectionsByTest.get(test.testId) || new Set<string>();
        const activeDraftSectionId = checkpointByTest.get(test.testId);

        if (finishedSet.size > 0 || activeDraftSectionId) {
          const meta = await getTestMetadata(category.toLowerCase(), test.testId);
          if (meta && meta.sections) {
            const nextPending =
              (activeDraftSectionId && meta.sections.find((s) => s.id === activeDraftSectionId)) ||
              meta.sections.find((s) => !finishedSet.has(s.id));

            if (nextPending) {
              inProgressMap.set(test.testId, {
                resumeSectionId: nextPending.id,
                completedCount: finishedSet.size,
              });
            }
          }
        }
      }
    }
  }

  const totalTestsCount = entitledCategories.reduce((acc, [, tests]) => acc + tests.length, 0);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
            <span>Diagnostic Testing Library</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Full-length diagnostic exams strictly mirroring official test specifications and adaptive routing.
          </p>
        </div>

        {totalTestsCount > 0 && (
          <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground shrink-0">
            <span>
              <strong className="text-foreground">{completedSummaries.length}</strong> Completed
            </span>
            <span>•</span>
            <span>
              <strong className="text-foreground">{totalTestsCount}</strong> Licensed
            </span>
          </div>
        )}
      </div>

      {/* Quick Category Jump Bar (Mobile & Multi-Program Convenience) */}
      {entitledCategories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-1">
            Jump to:
          </span>
          {entitledCategories.map(([category]) => {
            const meta = CATEGORY_META[category];
            return (
              <a
                key={category}
                href={`#category-${category.toLowerCase()}`}
                className="min-h-8 inline-flex items-center text-xs font-mono font-bold px-3 py-1 bg-card border border-border hover:border-primary/50 text-foreground shrink-0 transition-colors"
              >
                {meta?.label || category}
              </a>
            );
          })}
        </div>
      )}

      {entitledCategories.length === 0 ? (
        <div className="p-8 sm:p-12 border border-dashed border-border bg-card text-center space-y-3 rounded-none">
          <p className="text-base font-bold text-foreground">No Active Program Licenses</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            You do not currently have any active exam category entitlements assigned to your profile.
            Enter an institutional join code or link an authorized mentor to unlock practice exams.
          </p>
          <div className="pt-2">
            <Link
              href="/settings/mentors"
              className="min-h-10 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold inline-flex items-center gap-1.5"
            >
              <span>Manage Access & Mentors</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {entitledCategories.map(([category, tests]) => {
            const meta = CATEGORY_META[category as Category] || {
              label: category,
              platform: "Testing Engine",
              badge: "bg-muted text-muted-foreground border-border",
            };

            return (
              <section
                key={category}
                id={`category-${category.toLowerCase()}`}
                className="space-y-4 scroll-mt-20"
              >
                {/* Section Header (Wraps cleanly on 375px screens) */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-foreground">
                      {meta.label}
                    </h2>
                    <span className={`text-[10px] font-mono px-2 py-0.5 border ${meta.badge}`}>
                      {meta.platform}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {tests.length} Diagnostic{tests.length === 1 ? "" : "s"}
                  </span>
                </div>

                {/* Responsive Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tests.map((test: DiscoveredTestItem) => {
                    const completed = completedMap.get(test.testId);
                    const inProgressInfo = inProgressMap.get(test.testId);
                    const isInProgress = Boolean(inProgressInfo);

                    const targetSectionId = inProgressInfo
                      ? inProgressInfo.resumeSectionId
                      : test.firstSectionId;

                    // Detect adaptive Module 2 track for completed CAT exams
                    const completedSections = completedSectionsByTest.get(test.testId);
                    const adaptiveTrackLabel = (() => {
                      if (!completed || !test.isAdaptive || !completedSections) return null;
                      const ids = Array.from(completedSections).map((s) => s.toLowerCase());
                      if (ids.some((id) => id.endsWith("2h") || id.includes("hard"))) {
                        return "Upper Track (M2H)";
                      }
                      if (ids.some((id) => id.endsWith("2l") || id.includes("easy"))) {
                        return "Standard Track (M2L)";
                      }
                      return null;
                    })();

                    return (
                      <div
                        key={test.testId}
                        className={`bg-card p-5 flex flex-col justify-between rounded-none transition-colors ${
                          isInProgress
                            ? "border-2 border-blue-500/50 dark:border-blue-400/50"
                            : "border border-border hover:border-slate-400 dark:hover:border-slate-600"
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Title & Status Badges */}
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-bold text-foreground leading-snug">
                              {test.title}
                            </h3>
                            <div className="flex items-center gap-1 shrink-0">
                              {isInProgress && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 font-mono">
                                  <PlayCircle size={10} /> In Progress
                                </span>
                              )}
                              {test.isAdaptive && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 font-mono">
                                  <Sparkles className="w-2.5 h-2.5" /> CAT
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {test.description}
                          </p>

                          {/* Module & Timing Specs */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted-foreground pt-1">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5" />
                                {isInProgress
                                  ? `${inProgressInfo!.completedCount}/${test.sectionCount} Done`
                                  : `${test.sectionCount} Module${test.sectionCount > 1 ? "s" : ""}`}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                ~{test.totalTimeMinutes}m
                              </span>
                            </div>

                            {adaptiveTrackLabel && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-primary font-semibold">
                                {adaptiveTrackLabel}
                              </span>
                            )}
                          </div>

                          {/* Visual Module Progress Bar for In-Progress Attempts */}
                          {isInProgress && test.sectionCount > 0 && (
                            <div className="w-full bg-muted/60 h-1.5 border border-border overflow-hidden">
                              <div
                                className="bg-blue-600 dark:bg-blue-400 h-full transition-all"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.round(
                                      (inProgressInfo!.completedCount / test.sectionCount) * 100
                                    )
                                  )}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Action Footer (44px+ Mobile Touch Targets) */}
                        <div className="pt-4 mt-4 border-t border-border">
                          {completed ? (
                            <div className="flex items-center justify-between gap-2 w-full">
                              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 size={13} />
                                <span>Score: {completed.compositeScore ?? "Submitted"}</span>
                              </span>

                              <div className="flex items-center gap-3">
                                <Link
                                  href={`/tests/${category.toLowerCase()}/${test.testId}/${test.firstSectionId}`}
                                  title="Retake Diagnostic"
                                  className="min-h-9 px-2 text-[11px] font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                                >
                                  <RotateCcw size={11} />
                                  <span className="hidden sm:inline">Retake</span>
                                </Link>

                                <Link
                                  href={`/tests/${category.toLowerCase()}/${test.testId}/results`}
                                  className="min-h-9 px-2.5 bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:bg-primary/20 inline-flex items-center gap-1 transition-colors"
                                >
                                  <span>Telemetry</span>
                                  <ArrowRight size={12} />
                                </Link>
                              </div>
                            </div>
                          ) : isInProgress ? (
                            <Link
                              href={`/tests/${category.toLowerCase()}/${test.testId}/${targetSectionId}`}
                              className="w-full min-h-10 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 rounded-none transition-colors"
                            >
                              <span>Resume Module {inProgressInfo!.completedCount + 1}</span>
                              <ArrowRight size={13} />
                            </Link>
                          ) : (
                            <Link
                              href={`/tests/${category.toLowerCase()}/${test.testId}/${targetSectionId}`}
                              className="w-full min-h-10 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center justify-center gap-1.5 rounded-none transition-colors"
                            >
                              <span>Start Diagnostic</span>
                              <ArrowRight size={13} />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

function TestsLibrarySkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-pulse">
      <div className="space-y-2 border-b border-border pb-5">
        <div className="h-7 w-64 bg-card border border-border rounded-none" />
        <div className="h-4 w-full max-w-md bg-card border border-border rounded-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-56 bg-card border border-border rounded-none" />
        ))}
      </div>
    </main>
  );
}

export default function TestsLibraryPage() {
  return (
    <Suspense fallback={<TestsLibrarySkeleton />}>
      <TestsLibraryContent />
    </Suspense>
  );
}