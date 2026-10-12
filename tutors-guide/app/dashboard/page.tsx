// app/dashboard/page.tsx
import { auth, signOut } from "@/lib/auth";
import Link from "next/link";
import {
  ShieldCheck,
  LogOut,
  ArrowRight,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
  FileText,
  Lock,
  Loader2,
} from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { getAllAvailableTests, DiscoveredTestItem } from "@/lib/contentLoader";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

const CATEGORY_STYLES: Record<
  string,
  { label: string; platform: string; border: string; badge: string; accent: string }
> = {
  SAT: {
    label: "Digital SAT",
    platform: "Bluebook Emulation",
    border: "border-blue-500/30",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    accent: "text-blue-400 hover:border-blue-500",
  },
  ACT: {
    label: "ACT Digital",
    platform: "TestNav Emulation",
    border: "border-sky-500/30",
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    accent: "text-sky-400 hover:border-sky-500",
  },
  GRE: {
    label: "GRE General",
    platform: "ETS PowerPrep Emulation",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    accent: "text-emerald-400 hover:border-emerald-500",
  },
  AP_CALC: {
    label: "AP Calculus AB",
    platform: "Academic Layout",
    border: "border-amber-500/30",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    accent: "text-amber-400 hover:border-amber-500",
  },
};

async function DashboardContent() {
  await connection();
  const session = await auth();

  const userEntitlements = (session?.user?.entitlements || []) as Category[];
  const isAdmin = session?.user?.role === "ADMIN";

  const [availableTestsByCategory, completedSummaries] = await Promise.all([
    getAllAvailableTests(),
    session?.user?.id
      ? prisma.testSummary.findMany({
          where: { profileId: session.user.id },
          select: { testId: true, compositeScore: true, completedAt: true, category: true },
        })
      : Promise.resolve([]),
  ]);

  const completedMap = new Map(completedSummaries.map((s) => [s.testId, s]));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Header & Account Diagnostics */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-lg shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/10 border border-indigo-500/20 rounded-md">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Diagnostic Exam Engine</h1>
            <p className="text-xs text-slate-400 font-mono">
              {session?.user?.name || "Tester"} &middot; {session?.user?.email} &middot; Role:{" "}
              <span className="font-semibold text-indigo-300">{session?.user?.role}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Entitlement Chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 mr-1">Active Licenses:</span>
            {userEntitlements.length > 0 ? (
              userEntitlements.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono font-semibold rounded"
                >
                  {cat}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-amber-400 font-mono">None</span>
            )}
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Categories Grid */}
      <main className="space-y-10">
        {Object.entries(availableTestsByCategory).map(([category, tests]) => {
          const hasEntitlement = isAdmin || userEntitlements.includes(category as Category);
          const style = CATEGORY_STYLES[category] || {
            label: category,
            platform: "Standard Engine",
            border: "border-slate-800",
            badge: "bg-slate-800 text-slate-300 border-slate-700",
            accent: "text-slate-300",
          };

          return (
            <section key={category} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-bold tracking-tight text-white">{style.label}</h2>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${style.badge}`}>
                    {style.platform}
                  </span>
                </div>

                {!hasEntitlement && (
                  <span className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                    <Lock className="w-3.5 h-3.5" /> License Required
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tests.map((test: DiscoveredTestItem) => {
                  const completed = completedMap.get(test.testId);

                  return (
                    <div
                      key={test.testId}
                      className={`p-5 rounded-lg border bg-slate-900/60 backdrop-blur-xs flex flex-col justify-between transition-all ${
                        hasEntitlement
                          ? `${style.border} hover:bg-slate-900`
                          : "border-slate-800/60 opacity-60"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-white line-clamp-1">{test.title}</h3>
                          {test.isAdaptive && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono shrink-0">
                              <Sparkles className="w-2.5 h-2.5" /> Adaptive CAT
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {test.description}
                        </p>

                        <div className="flex items-center gap-3 pt-2 text-xs font-mono text-slate-500">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" /> {test.sectionCount} Module
                            {test.sectionCount > 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> ~{test.totalTimeMinutes}m
                          </span>
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-between">
                        {completed ? (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Score: {completed.compositeScore ?? "Submitted"}</span>
                            </div>

                            <Link
                              href={`/tests/${category.toLowerCase()}/${test.testId}/results`}
                              className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition"
                            >
                              View Results <FileText className="w-3 h-3" />
                            </Link>
                          </div>
                        ) : hasEntitlement ? (
                          <Link
                            href={`/tests/${category.toLowerCase()}/${test.testId}/${test.firstSectionId}`}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded transition"
                          >
                            Launch Diagnostic <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="w-full py-2 bg-slate-900 border border-slate-800 text-slate-500 text-xs font-semibold rounded cursor-not-allowed"
                          >
                            Locked
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

function DashboardFallback() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      <div className="h-24 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
      </div>
      <div className="space-y-4">
        <div className="h-6 w-36 bg-slate-900 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-44 bg-slate-900/60 border border-slate-800 rounded-lg" />
          <div className="h-44 bg-slate-900/60 border border-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <Suspense fallback={<DashboardFallback />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}