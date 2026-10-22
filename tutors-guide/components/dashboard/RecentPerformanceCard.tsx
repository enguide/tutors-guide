// components/dashboard/RecentPerformanceCard.tsx
import Link from "next/link";
import { Calendar, CheckCircle2 } from "lucide-react";

export interface RecentSummaryItem {
  testId: string;
  testTitle: string;
  compositeScore: number | null;
  percentile: string | null;
  completedAt: Date | string;
  category: string;
}

interface RecentPerformanceCardProps {
  recentSummary: RecentSummaryItem | null;
}

export function RecentPerformanceCard({ recentSummary }: RecentPerformanceCardProps) {
  return (
    <div className="bg-card border border-border p-6 rounded-none space-y-4 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Recent Performance
          </span>
          {recentSummary && (
            <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
              <Calendar size={11} /> {new Date(recentSummary.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {recentSummary ? (
          <div className="space-y-2">
            <div className="flex flex-row items-start justify-between gap-4">
              <h3 className="text-base font-bold text-foreground">{recentSummary.testTitle}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-muted/60 border border-border font-semibold">
                {recentSummary.category}
              </span>
            </div>

            <div className="flex items-baseline gap-4 pt-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Score</span>
                <div className="text-5xl font-black text-primary">
                  {recentSummary.compositeScore ?? "—"}
                </div>
              </div>
              {recentSummary.percentile && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Percentile</span>
                  <div className="text-xl font-bold text-foreground">
                    {recentSummary.percentile}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No tests completed yet. Start your first exam from the library!
          </div>
        )}
      </div>

      {recentSummary && (
        <div className="pt-2 border-t border-border">
          <Link
            href={`/tests/${recentSummary.category.toLowerCase()}/${recentSummary.testId}/results`}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <CheckCircle2 size={13} /> Inspect Question Triage & Pacing
          </Link>
        </div>
      )}
    </div>
  );
}