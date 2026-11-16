// app/dashboard/results/page.tsx
import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  ArrowRight,
  Award,
  Clock,
  BookOpen,
  Layers,
  Target,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

export const instant = false;

interface ResultsArchivePageProps {
  searchParams: Promise<{
    program?: string;
  }>;
}

interface SummaryRow {
  testId: string;
  testTitle: string;
  compositeScore: number | null;
  percentile: string | null;
  completedAt: Date;
  category: Category;
}

interface SectionResultRow {
  testId: string;
  sectionId: string;
  numCorrect: number;
  totalQuestions: number;
}

function formatCompositeScore(category: string, score: number | null): string {
  if (score === null || score === undefined) return "—";
  if (category.toUpperCase() === "ACADEMIC") {
    return `${score}%`;
  }
  return String(score);
}

async function ResultsArchiveContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ program?: string }>;
}) {
  await connection();
  const [session, { program: rawProgram }] = await Promise.all([
    auth(),
    searchParamsPromise,
  ]);

  const [completedSummaries, sectionResults]: [SummaryRow[], SectionResultRow[]] =
    session?.user?.id
      ? await Promise.all([
          prisma.testSummary.findMany({
            where: { profileId: session.user.id },
            orderBy: { completedAt: "desc" },
            select: {
              testId: true,
              testTitle: true,
              compositeScore: true,
              percentile: true,
              completedAt: true,
              category: true,
            },
          }),
          prisma.result.findMany({
            where: { profileId: session.user.id },
            select: {
              testId: true,
              sectionId: true,
              numCorrect: true,
              totalQuestions: true,
            },
          }),
        ])
      : [[], []];

  // Aggregate section-level telemetry (adaptive track routing + raw accuracy %) per test
  const telemetryByTest = new Map<
    string,
    {
      adaptiveBadge: string | null;
      accuracyPercent: number | null;
      numCorrect: number;
      totalQuestions: number;
    }
  >();

  const groupedSections = new Map<string, SectionResultRow[]>();
  for (const r of sectionResults) {
    const existing = groupedSections.get(r.testId) ?? [];
    existing.push(r);
    groupedSections.set(r.testId, existing);
  }

  for (const [testId, sections] of groupedSections.entries()) {
    const ids = sections.map((s) => s.sectionId.toLowerCase());
    let adaptiveBadge: string | null = null;
    if (ids.some((id) => id.endsWith("2h") || id.includes("hard"))) {
      adaptiveBadge = "Upper Track (M2H)";
    } else if (ids.some((id) => id.endsWith("2l") || id.includes("easy"))) {
      adaptiveBadge = "Standard Track (M2L)";
    }

    const totalCorrect = sections.reduce((sum, s) => sum + s.numCorrect, 0);
    const totalQs = sections.reduce((sum, s) => sum + s.totalQuestions, 0);
    const accuracyPercent =
      totalQs > 0 ? Math.round((totalCorrect / totalQs) * 100) : null;

    telemetryByTest.set(testId, {
      adaptiveBadge,
      accuracyPercent,
      numCorrect: totalCorrect,
      totalQuestions: totalQs,
    });
  }

  // Distinct programs present in the student's completed archive
  const distinctPrograms = Array.from(
    new Set(completedSummaries.map((s) => s.category.toUpperCase()))
  );

  const activeFilter =
    rawProgram && distinctPrograms.includes(rawProgram.trim().toUpperCase())
      ? rawProgram.trim().toUpperCase()
      : "ALL";

  const filteredSummaries =
    activeFilter === "ALL"
      ? completedSummaries
      : completedSummaries.filter((s) => s.category.toUpperCase() === activeFilter);

  const totalAttempts = filteredSummaries.length;

  // Contextual Highest Score calculation
  const highestDisplay = (() => {
    if (filteredSummaries.length === 0) return "—";

    if (activeFilter !== "ALL") {
      const top = filteredSummaries.reduce(
        (max, s) => (s.compositeScore && s.compositeScore > max ? s.compositeScore : max),
        0
      );
      return top > 0 ? formatCompositeScore(activeFilter, top) : "—";
    }

    const standardized = filteredSummaries.filter(
      (s) => s.category.toUpperCase() !== "ACADEMIC"
    );
    const highestStd = standardized.reduce(
      (max, s) => (s.compositeScore && s.compositeScore > max ? s.compositeScore : max),
      0
    );
    if (highestStd > 0) return String(highestStd);

    const highestAcad = filteredSummaries.reduce(
      (max, s) => (s.compositeScore && s.compositeScore > max ? s.compositeScore : max),
      0
    );
    return highestAcad > 0 ? `${highestAcad}%` : "—";
  })();

  // Average Raw Accuracy across filtered attempts
  const avgAccuracyDisplay = (() => {
    const accuracies = filteredSummaries
      .map((s) => telemetryByTest.get(s.testId)?.accuracyPercent)
      .filter((v): v is number => v !== null && v !== undefined);
    if (accuracies.length === 0) return null;
    const avg = Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length);
    return `${avg}%`;
  })();

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header & Program Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
            <span>Diagnostic Results & Telemetry</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Historical testing log, adaptive module routing, and deep question triage reviews.
          </p>
        </div>

        {distinctPrograms.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <Link
              href="/dashboard/results"
              className={`min-h-8 inline-flex items-center text-xs font-mono font-bold px-2.5 py-1 border transition-colors ${
                activeFilter === "ALL"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              }`}
            >
              ALL ({completedSummaries.length})
            </Link>
            {distinctPrograms.map((prog) => (
              <Link
                key={prog}
                href={`/dashboard/results?program=${prog}`}
                className={`min-h-8 inline-flex items-center text-xs font-mono font-bold px-2.5 py-1 border transition-colors ${
                  activeFilter === prog
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                }`}
              >
                {prog}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-4 sm:p-5 rounded-none space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock size={13} /> Completed Diagnostics
          </span>
          <div className="text-2xl sm:text-3xl font-black">{totalAttempts}</div>
          <div className="text-xs text-muted-foreground">
            {avgAccuracyDisplay
              ? `Mean raw accuracy: ${avgAccuracyDisplay}`
              : "Scored diagnostic evaluations"}
          </div>
        </div>

        <div className="bg-card border border-border p-4 sm:p-5 rounded-none space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Award size={13} /> Highest Composite
          </span>
          <div className="text-2xl sm:text-3xl font-black text-primary">
            {highestDisplay}
          </div>
          <div className="text-xs text-muted-foreground">
            {activeFilter === "ALL" ? "Top standardized performance" : `Peak ${activeFilter} score`}
          </div>
        </div>

        <div className="bg-card border border-border p-4 sm:p-5 rounded-none space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Latest Evaluation
          </span>
          <div className="text-base sm:text-lg font-bold text-foreground truncate">
            {filteredSummaries[0]?.testTitle || "No completed tests"}
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {filteredSummaries[0]
              ? new Date(filteredSummaries[0].completedAt).toLocaleDateString()
              : "Complete a test to view records"}
          </div>
        </div>
      </div>

      {/* Empty State vs. Responsive Archive */}
      {filteredSummaries.length === 0 ? (
        <div className="p-8 sm:p-12 border border-dashed border-border bg-card text-center space-y-3 rounded-none">
          <p className="text-base font-bold text-foreground">No Diagnostic Records Found</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            You have not completed any diagnostic exams in this view yet. Head over to the testing
            library to launch your next simulation.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/tests"
              className="min-h-10 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-none hover:bg-primary/90 transition-colors"
            >
              <BookOpen size={14} /> Browse Diagnostic Library
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Stacked Telemetry Cards (< 768px) */}
          <div className="md:hidden space-y-3">
            {filteredSummaries.map((summary) => {
              const telemetry = telemetryByTest.get(summary.testId);
              const resultsHref = `/tests/${summary.category.toLowerCase()}/${summary.testId}/results`;

              return (
                <div
                  key={summary.testId}
                  className="bg-card border border-border p-4 rounded-none space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <h2 className="text-sm font-bold text-foreground leading-snug">
                        {summary.testTitle}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-muted-foreground">
                        <span className="px-1.5 py-0.5 border border-border bg-muted/50 font-bold text-foreground">
                          {summary.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(summary.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                        Score
                      </span>
                      <span className="text-2xl font-black text-primary leading-none">
                        {formatCompositeScore(summary.category, summary.compositeScore)}
                      </span>
                    </div>
                  </div>

                  {/* Secondary Telemetry Chips */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                    {summary.percentile && (
                      <span className="px-2 py-0.5 bg-muted/50 border border-border text-muted-foreground">
                        Percentile: <strong className="text-foreground">{summary.percentile}</strong>
                      </span>
                    )}
                    {telemetry?.accuracyPercent !== null &&
                      telemetry?.accuracyPercent !== undefined && (
                        <span className="px-2 py-0.5 bg-muted/50 border border-border text-muted-foreground inline-flex items-center gap-1">
                          <Target size={10} className="text-primary" />
                          Raw:{" "}
                          <strong className="text-foreground">
                            {telemetry.numCorrect}/{telemetry.totalQuestions} ({telemetry.accuracyPercent}%)
                          </strong>
                        </span>
                      )}
                    {telemetry?.adaptiveBadge && (
                      <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary font-semibold inline-flex items-center gap-1">
                        <Layers size={10} />
                        {telemetry.adaptiveBadge}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border">
                    <Link
                      href={resultsHref}
                      className="w-full min-h-10 py-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Inspect Question Triage & Telemetry</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Ledger Table (>= 768px) */}
          <div className="hidden md:block border border-border bg-card rounded-none overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
                  <th className="py-3 px-4">Exam</th>
                  <th className="py-3 px-4">Program / Track</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center">Raw Accuracy</th>
                  <th className="py-3 px-4 text-center">Percentile</th>
                  <th className="py-3 px-4">Completed Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSummaries.map((summary) => {
                  const telemetry = telemetryByTest.get(summary.testId);
                  return (
                    <tr key={summary.testId} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">
                        {summary.testTitle}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-border bg-muted/50">
                            {summary.category}
                          </span>
                          {telemetry?.adaptiveBadge && (
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 border border-primary/20 bg-primary/10 text-primary">
                              {telemetry.adaptiveBadge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-black text-sm text-primary">
                        {formatCompositeScore(summary.category, summary.compositeScore)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-muted-foreground">
                        {telemetry?.accuracyPercent !== null &&
                        telemetry?.accuracyPercent !== undefined
                          ? `${telemetry.numCorrect}/${telemetry.totalQuestions} (${telemetry.accuracyPercent}%)`
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center text-muted-foreground font-mono">
                        {summary.percentile ?? "—"}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground font-mono">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          <span>{new Date(summary.completedAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/tests/${summary.category.toLowerCase()}/${summary.testId}/results`}
                          className="min-h-8 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 inline-flex items-center gap-1 transition-colors rounded-none"
                        >
                          <span>Telemetry</span>
                          <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}

function ResultsArchiveSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-pulse">
      <div className="space-y-2 border-b border-border pb-5">
        <div className="h-7 w-64 bg-card border border-border rounded-none" />
        <div className="h-4 w-full max-w-md bg-card border border-border rounded-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-24 bg-card border border-border rounded-none" />
        <div className="h-24 bg-card border border-border rounded-none" />
        <div className="h-24 bg-card border border-border rounded-none" />
      </div>

      <div className="h-64 bg-card border border-border rounded-none" />
    </main>
  );
}

export default function ResultsArchivePage({ searchParams }: ResultsArchivePageProps) {
  return (
    <Suspense fallback={<ResultsArchiveSkeleton />}>
      <ResultsArchiveContent searchParamsPromise={searchParams} />
    </Suspense>
  );
}