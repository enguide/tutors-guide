// app/dashboard/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAllAvailableTests, getTestMetadata } from "@/lib/contentLoader";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import { ExamCountdownWidget } from "@/components/dashboard/ExamCountdownWidget";
import { ScoreTargetGauge } from "@/components/dashboard/ScoreTargetGauge";
import { DiagnosticCadenceCard } from "@/components/dashboard/DiagnosticCadenceCard";
import { StudyInvestmentWidget } from "@/components/dashboard/StudyInvestmentWidget";
import { NextRecommendedHeroCard, NextTestTarget } from "@/components/dashboard/NextRecommendedHeroCard";
import { RecentPerformanceCard } from "@/components/dashboard/RecentPerformanceCard";
import { QuickNavTiles } from "@/components/dashboard/QuickNavTiles";
import { ProgramTabSwitcher } from "@/components/dashboard/ProgramTabSwitcher";

export const instant = false;

interface DashboardPageProps {
  searchParams: Promise<{
    program?: string;
  }>;
}

function resolveActiveCategory(
  userEntitlements: string[],
  paramProgram?: string
): Category {
  if (paramProgram) {
    const normalized = paramProgram.trim().toUpperCase();
    if (Object.values(Category).includes(normalized as Category)) {
      return normalized as Category;
    }
  }

  for (const ent of userEntitlements) {
    const prefix = ent.split(":")[0].toUpperCase();
    if (Object.values(Category).includes(prefix as Category)) {
      return prefix as Category;
    }
  }

  return Category.SAT;
}

async function DashboardOverviewContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ program?: string }>;
}) {
  await connection();
  const [session, { program: rawProgram }] = await Promise.all([
    auth(),
    searchParamsPromise,
  ]);

  const userEntitlements: string[] = session?.user?.entitlements || [];

  const availableCategoryTabs = Array.from(
    new Set(
      userEntitlements.map((token) => {
        const prefix = token.split(":")[0].toUpperCase();
        return Object.values(Category).includes(prefix as Category)
          ? (prefix as Category)
          : Category.ACADEMIC;
      })
    )
  );

  if (!rawProgram && availableCategoryTabs.length > 0) {
    redirect(`/dashboard?program=${availableCategoryTabs[0]}`);
  }

  const activeProgram = resolveActiveCategory(userEntitlements, rawProgram);

  const [
    availableTestsByCategory,
    completedSummaries,
    responseAggregates,
    userSectionResults,
    userSectionCheckpoints,
  ] = await Promise.all([
    getAllAvailableTests(),
    session?.user?.id
      ? prisma.testSummary.findMany({
          where: {
            profileId: session.user.id,
            category: activeProgram,
          },
          orderBy: { completedAt: "desc" },
          select: {
            testId: true,
            testTitle: true,
            compositeScore: true,
            percentile: true,
            completedAt: true,
            category: true,
          },
        })
      : Promise.resolve([]),
    session?.user?.id
      ? prisma.response.aggregate({
          where: {
            profileId: session.user.id,
            test: { category: activeProgram },
          },
          _count: { id: true },
          _sum: { timeSpentOnResponse: true },
        })
      : Promise.resolve({ _count: { id: 0 }, _sum: { timeSpentOnResponse: 0 } }),
    session?.user?.id
      ? prisma.result.findMany({
          where: { profileId: session.user.id },
          select: { testId: true, sectionId: true },
        })
      : Promise.resolve([]),
    session?.user?.id
      ? prisma.sectionCheckpoint.findMany({
          where: { profileId: session.user.id },
          select: { testId: true, sectionId: true, updatedAt: true },
        })
      : Promise.resolve([]),
  ]);

  const recentSummary = completedSummaries[0] || null;
  const completedTestIds = new Set(completedSummaries.map((s) => s.testId));

  const completedSectionsByTest = new Map<string, Set<string>>();
  for (const r of userSectionResults) {
    if (!completedSectionsByTest.has(r.testId)) {
      completedSectionsByTest.set(r.testId, new Set());
    }
    completedSectionsByTest.get(r.testId)!.add(r.sectionId);
  }

  // Detect adaptive routing track (Upper/Hard vs Lower/Easy) on most recent completed exam
  const recentAdaptiveBadge = (() => {
    if (!recentSummary) return null;
    const sections = completedSectionsByTest.get(recentSummary.testId);
    if (!sections) return null;
    const ids = Array.from(sections).map((s) => s.toLowerCase());
    if (ids.some((id) => id.endsWith("2h") || id.includes("hard"))) {
      return "Upper Track (M2H)";
    }
    if (ids.some((id) => id.endsWith("2l") || id.includes("easy"))) {
      return "Standard Track (M2L)";
    }
    return null;
  })();

  const checkpointByTest = new Map<string, string>();
  for (const cp of userSectionCheckpoints) {
    checkpointByTest.set(cp.testId, cp.sectionId);
  }

  const allCategoryTests = availableTestsByCategory[activeProgram] || [];

  const activeProgramTests = allCategoryTests.filter((t) => {
    if (session?.user?.role === "ADMIN") return true;
    if (userEntitlements.includes(activeProgram)) return true;
    if (userEntitlements.includes(`${activeProgram}:*`)) return true;

    return userEntitlements.some((ent) => {
      const courseSlug = ent.includes(":") ? ent.split(":")[1].toLowerCase() : "";
      return courseSlug ? t.testId.toLowerCase().includes(courseSlug) : false;
    });
  });

  let nextTest: NextTestTarget | null = null;
  let nextLaunchUrl: string | null = null;

  for (const t of activeProgramTests) {
    if (!completedTestIds.has(t.testId)) {
      const finishedSections = completedSectionsByTest.get(t.testId) || new Set();
      const activeDraftSectionId = checkpointByTest.get(t.testId);

      if (finishedSections.size > 0 || activeDraftSectionId) {
        const meta = await getTestMetadata(activeProgram.toLowerCase(), t.testId);
        if (meta && meta.sections) {
          const resumeSection =
            (activeDraftSectionId && meta.sections.find((s) => s.id === activeDraftSectionId)) ||
            meta.sections.find((s) => !finishedSections.has(s.id));

          if (resumeSection) {
            nextTest = {
              category: activeProgram.toLowerCase(),
              testId: t.testId,
              title: t.title,
              firstSectionId: resumeSection.id,
              isInProgress: true,
              completedSectionCount: finishedSections.size,
            };
            nextLaunchUrl = `/tests/${activeProgram.toLowerCase()}/${t.testId}/${resumeSection.id}`;
            break;
          }
        }
      }
    }
  }

  if (!nextTest) {
    for (const t of activeProgramTests) {
      if (!completedTestIds.has(t.testId)) {
        nextTest = {
          category: activeProgram.toLowerCase(),
          testId: t.testId,
          title: t.title,
          firstSectionId: t.firstSectionId,
          isInProgress: false,
        };
        nextLaunchUrl = `/tests/${activeProgram.toLowerCase()}/${t.testId}/${t.firstSectionId}`;
        break;
      }
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header & Program Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Welcome back, {session?.user?.name || "Student"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track exam readiness, inspect adaptive module telemetry, and launch your next diagnostic.
          </p>
        </div>

        <ProgramTabSwitcher
          userEntitlements={availableCategoryTabs}
          activeProgram={activeProgram}
        />
      </div>

      {/* Primary Action Above the Fold */}
      <NextRecommendedHeroCard nextTest={nextTest} launchUrl={nextLaunchUrl} />

      {/* Core Readiness KPIs (1 col mobile -> 2 col tablet -> 3 col desktop) */}
      {availableCategoryTabs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          <RecentPerformanceCard
            recentSummary={recentSummary}
            adaptiveTrackBadge={recentAdaptiveBadge}
          />
          <ScoreTargetGauge
            activeProgram={activeProgram}
            latestScore={recentSummary?.compositeScore ?? null}
            latestTestTitle={recentSummary?.testTitle ?? null}
          />
          <div className="md:col-span-2 lg:col-span-1">
            <ExamCountdownWidget activeProgram={activeProgram} />
          </div>
        </div>
      )}

      {/* Effort & Cadence Telemetry */}
      {availableCategoryTabs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          <div className="lg:col-span-8">
            <StudyInvestmentWidget
              activeProgram={activeProgram}
              examTimeSpentSeconds={responseAggregates._sum.timeSpentOnResponse ?? 0}
            />
          </div>
          <div className="lg:col-span-4">
            <DiagnosticCadenceCard
              activeProgram={activeProgram}
              latestCompletedAt={recentSummary?.completedAt ?? null}
              latestCategory={activeProgram}
              totalCompletedCount={completedSummaries.length}
              nextTestLaunchUrl={nextLaunchUrl}
            />
          </div>
        </div>
      )}

      {/* Horizontal 3-Up Quick Navigation */}
      <QuickNavTiles />
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-pulse">
      <div className="h-14 bg-card border border-border rounded-none" />
      <div className="h-28 bg-card border border-border rounded-none" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="h-52 bg-card border border-border rounded-none" />
        <div className="h-52 bg-card border border-border rounded-none" />
        <div className="h-52 bg-card border border-border rounded-none md:col-span-2 lg:col-span-1" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-8 h-52 bg-card border border-border rounded-none" />
        <div className="lg:col-span-4 h-52 bg-card border border-border rounded-none" />
      </div>
    </main>
  );
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardOverviewContent searchParamsPromise={searchParams} />
    </Suspense>
  );
}