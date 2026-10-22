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
} from "lucide-react";
import { getAllAvailableTests, DiscoveredTestItem } from "@/lib/contentLoader";
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

async function TestsLibraryContent() {
  await connection();
  const session = await auth();

  const userEntitlements = (session?.user?.entitlements || []) as Category[];

  const [availableTestsByCategory, completedSummaries] = await Promise.all([
    getAllAvailableTests(),
    session?.user?.id
      ? prisma.testSummary.findMany({
          where: { profileId: session.user.id },
          select: { testId: true, compositeScore: true },
        })
      : Promise.resolve([]),
  ]);

  const entitledCategories = Object.entries(availableTestsByCategory).filter(([category]) =>
    userEntitlements.includes(category as Category)
  );

  const completedMap = new Map(completedSummaries.map((s) => [s.testId, s]));

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <span>Diagnostic Testing Library</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Full-length diagnostic exams strictly mirroring official test specifications and timing constraints.
        </p>
      </div>

      {entitledCategories.length === 0 ? (
        <div className="p-12 border border-dashed border-border bg-card text-center space-y-3 rounded-none">
          <p className="text-base font-bold text-foreground">No Active Program Licenses</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            You do not currently have any active exam category entitlements assigned to your profile.
            Enter an institutional join code or link an authorized tutor to unlock practice exams.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {entitledCategories.map(([category, tests]) => {
            const meta = CATEGORY_META[category] || {
              label: category,
              platform: "Testing Engine",
              badge: "bg-muted text-muted-foreground border-border",
            };

            return (
              <section key={category} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">
                      {meta.label}
                    </h2>
                    <span className={`text-[10px] font-mono px-2 py-0.5 border ${meta.badge}`}>
                      {meta.platform}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {tests.length} Diagnostic{tests.length === 1 ? "" : "s"} Available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tests.map((test: DiscoveredTestItem) => {
                    const completed = completedMap.get(test.testId);

                    return (
                      <div
                        key={test.testId}
                        className="bg-card border border-border p-5 flex flex-col justify-between rounded-none shadow-xs hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-bold text-foreground line-clamp-1">
                              {test.title}
                            </h3>
                            {test.isAdaptive && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 font-mono shrink-0">
                                <Sparkles className="w-2.5 h-2.5" /> CAT
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {test.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" />
                              {test.sectionCount} Module{test.sectionCount > 1 ? "s" : ""}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              ~{test.totalTimeMinutes}m
                            </span>
                          </div>
                        </div>

                        {/* Action Footer */}
                        <div className="pt-5 mt-4 border-t border-border">
                          {completed ? (
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 size={13} />
                                <span>Score: {completed.compositeScore ?? "Submitted"}</span>
                              </span>

                              <Link
                                href={`/tests/${category.toLowerCase()}/${test.testId}/results`}
                                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                              >
                                Review Telemetry <ArrowRight size={12} />
                              </Link>
                            </div>
                          ) : (
                            <Link
                              href={`/tests/${category.toLowerCase()}/${test.testId}/${test.firstSectionId}`}
                              className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center justify-center gap-1.5 rounded-none transition-colors"
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
    <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-pulse min-h-[120vh]">
      <div className="space-y-2">
        <div className="h-7 w-64 bg-card border border-border rounded-none" />
        <div className="h-4 w-96 bg-card border border-border rounded-none" />
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