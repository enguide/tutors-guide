// app/dashboard/results/page.tsx
import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  ExternalLink,
  Award,
  Clock,
  BookOpen,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const instant = false;

async function ResultsArchiveContent() {
  await connection();
  const session = await auth();

  const completedSummaries = session?.user?.id
    ? await prisma.testSummary.findMany({
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
      })
    : [];

  const totalAttempts = completedSummaries.length;
  const highestScore = completedSummaries.reduce((max, s) => {
    return s.compositeScore && s.compositeScore > max ? s.compositeScore : max;
  }, 0);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <span>Diagnostic Results & Telemetry</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Historical testing log, official composite scaling, and deep question triage reviews.
        </p>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-none shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock size={13} /> Total Completed Exams
          </span>
          <div className="text-3xl font-black">{totalAttempts}</div>
          <div className="text-xs text-muted-foreground">Scored diagnostic evaluations</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-none shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Award size={13} /> Highest Composite
          </span>
          <div className="text-3xl font-black text-primary">
            {highestScore > 0 ? highestScore : "—"}
          </div>
          <div className="text-xs text-muted-foreground">Top diagnostic performance</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-none shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Latest Evaluation
          </span>
          <div className="text-lg font-bold text-foreground truncate">
            {completedSummaries[0]?.testTitle || "No completed tests"}
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {completedSummaries[0]
              ? new Date(completedSummaries[0].completedAt).toLocaleDateString()
              : "Complete a test to view records"}
          </div>
        </div>
      </div>

      {/* Full Telemetry Table */}
      {completedSummaries.length === 0 ? (
        <div className="p-12 border border-dashed border-border bg-card text-center space-y-3 rounded-none">
          <p className="text-base font-bold text-foreground">No Diagnostic Records Found</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            You have not completed any diagnostic exams yet. Head over to the testing library to launch your first exam.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/tests"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-none hover:bg-primary/90 transition-colors"
            >
              <BookOpen size={14} /> Go to Practice Tests
            </Link>
          </div>
        </div>
      ) : (
        <div className="border border-border bg-card rounded-none overflow-x-auto shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
                <th className="py-3 px-4">Exam</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4 text-center">Composite Score</th>
                <th className="py-3 px-4 text-center">Percentile</th>
                <th className="py-3 px-4">Completed Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {completedSummaries.map((summary) => (
                <tr key={summary.testId} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {summary.testTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-border bg-muted/50">
                      {summary.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-black text-sm">
                    {summary.compositeScore ?? "—"}
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
                      className="px-3 py-1.5 border border-input text-xs font-semibold hover:bg-muted inline-flex items-center gap-1 transition-colors rounded-none"
                    >
                      <ExternalLink size={12} />
                      <span>See your results</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function ResultsArchiveSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-pulse min-h-[120vh]">
      <div className="space-y-2">
        <div className="h-7 w-64 bg-card border border-border rounded-none" />
        <div className="h-4 w-96 bg-card border border-border rounded-none" />
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

export default function ResultsArchivePage() {
  return (
    <Suspense fallback={<ResultsArchiveSkeleton />}>
      <ResultsArchiveContent />
    </Suspense>
  );
}