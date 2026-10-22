// app/dashboard/page.tsx
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
  userEntitlements: Category[],
  paramProgram?: string
): Category {
  if (paramProgram) {
    const normalized = paramProgram.trim().toUpperCase() as Category;
    if (userEntitlements.includes(normalized)) {
      return normalized;
    }
  }
  return userEntitlements[0] || Category.SAT;
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

  const userEntitlements = (session?.user?.entitlements || []) as Category[];

  // 1. Enforce default ?program= URL canonicalization
  if (!rawProgram && userEntitlements.length > 0) {
    redirect(`/dashboard?program=${userEntitlements[0]}`);
  }

  const activeProgram = resolveActiveCategory(userEntitlements, rawProgram);

  // 2. Fetch tests, summaries, response totals, submitted section results, AND active draft checkpoints
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

  // Map of finalized sections per test
  const completedSectionsByTest = new Map<string, Set<string>>();
  for (const r of userSectionResults) {
    if (!completedSectionsByTest.has(r.testId)) {
      completedSectionsByTest.set(r.testId, new Set());
    }
    completedSectionsByTest.get(r.testId)!.add(r.sectionId);
  }

  // Map of active in-flight checkpoints per test
  const checkpointByTest = new Map<string, string>();
  for (const cp of userSectionCheckpoints) {
    checkpointByTest.set(cp.testId, cp.sectionId);
  }

  // 3. Determine next recommended or in-progress test
  const activeProgramTests = availableTestsByCategory[activeProgram] || [];
  let nextTest: NextTestTarget | null = null;
  let nextLaunchUrl: string | null = null;

  // First check if any test is IN PROGRESS (has active SectionCheckpoint or submitted sections)
  for (const t of activeProgramTests) {
    if (!completedTestIds.has(t.testId)) {
      const finishedSections = completedSectionsByTest.get(t.testId) || new Set();
      const activeDraftSectionId = checkpointByTest.get(t.testId);

      if (finishedSections.size > 0 || activeDraftSectionId) {
        const meta = await getTestMetadata(activeProgram.toLowerCase(), t.testId);
        if (meta && meta.sections) {
          // Prioritize active draft section; otherwise pick the first unsubmitted section
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

  // If no in-progress tests, find the first completely untouched test
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
    <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Welcome Banner & Program Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Welcome back, {session?.user?.name || "Student"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track your exam readiness, inspect diagnostic telemetry, and launch your next test.
          </p>
        </div>

        <ProgramTabSwitcher
          userEntitlements={userEntitlements}
          activeProgram={activeProgram}
        />
      </div>

      {/* Tier 1: Horizon & Target Score Runway */}
      {userEntitlements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <RecentPerformanceCard recentSummary={recentSummary} />
          <ScoreTargetGauge
            activeProgram={activeProgram}
            latestScore={recentSummary?.compositeScore ?? null}
            latestTestTitle={recentSummary?.testTitle ?? null}
          />
          <ExamCountdownWidget activeProgram={activeProgram} />
        </div>
      )}

      {/* Tier 2: Next Up Hero Action Card (Shows "Resume Exam" if in-progress) */}
      <NextRecommendedHeroCard nextTest={nextTest} launchUrl={nextLaunchUrl} />

      {/* Tier 3: Diagnostic Cadence & Preparation Time Bank */}
      {userEntitlements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          <div className="md:col-span-8">
            <StudyInvestmentWidget
              activeProgram={activeProgram}
              examTimeSpentSeconds={responseAggregates._sum.timeSpentOnResponse ?? 0}
            />
          </div>
          <div className="md:col-span-4">
            <DiagnosticCadenceCard
              latestCompletedAt={recentSummary?.completedAt ?? null}
              latestCategory={activeProgram}
              totalCompletedCount={completedSummaries.length}
              nextTestLaunchUrl={nextLaunchUrl}
            />
          </div>
        </div>
      )}

      {/* Tier 4: Quick Navigation Hub */}
      <QuickNavTiles />
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-pulse min-h-[120vh]">
      <div className="h-14 bg-card border border-border rounded-none" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-card border border-border rounded-none" />
        <div className="h-48 bg-card border border-border rounded-none" />
        <div className="h-48 bg-card border border-border rounded-none" />
      </div>
      <div className="h-32 bg-card border border-border rounded-none" />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 h-48 bg-card border border-border rounded-none" />
        <div className="md:col-span-4 h-48 bg-card border border-border rounded-none" />
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