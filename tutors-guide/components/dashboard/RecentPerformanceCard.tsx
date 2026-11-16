// components/dashboard/RecentPerformanceCard.tsx
import Link from "next/link";
import { Calendar, CheckCircle2, Layers } from "lucide-react";

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
  adaptiveTrackBadge?: string | null;
}

export function RecentPerformanceCard({
  recentSummary,
  adaptiveTrackBadge,
}: RecentPerformanceCardProps) {
  return (
    <div className="bg-card border border-border p-5 sm:p-6 rounded-none space-y-4 flex flex-col justify-between">
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
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-bold text-foreground leading-snug">
                {recentSummary.testTitle}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-muted/60 border border-border font-semibold shrink-0">
                {recentSummary.category}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-4 pt-1">
              <div className="flex items-baseline gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Score
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-primary leading-none pt-1">
                    {recentSummary.compositeScore ?? "—"}
                  </div>
                </div>
                {recentSummary.percentile && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Percentile
                    </span>
                    <div className="text-xl font-bold text-foreground pt-1">
                      {recentSummary.percentile}
                    </div>
                  </div>
                )}
              </div>

              {adaptiveTrackBadge && (
                <span className="text-[10px] font-mono px-2 py-1 bg-primary/10 border border-primary/20 text-primary font-semibold inline-flex items-center gap-1">
                  <Layers size={11} />
                  {adaptiveTrackBadge}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No tests completed yet. Launch your first exam above to establish a baseline!
          </div>
        )}
      </div>

      {recentSummary && (
        <div className="pt-3 border-t border-border">
          <Link
            href={`/tests/${recentSummary.category.toLowerCase()}/${recentSummary.testId}/results`}
            className="min-h-8 text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
          >
            <CheckCircle2 size={13} /> Inspect Question Triage & Pacing
          </Link>
        </div>
      )}
    </div>
  );
}