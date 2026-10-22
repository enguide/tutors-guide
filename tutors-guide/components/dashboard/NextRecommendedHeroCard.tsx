// components/dashboard/NextRecommendedHeroCard.tsx
import Link from "next/link";
import { Sparkles, ArrowRight, PlayCircle } from "lucide-react";

export interface NextTestTarget {
  category: string;
  testId: string;
  title: string;
  firstSectionId: string;
  isInProgress?: boolean;
  completedSectionCount?: number;
}

interface NextRecommendedHeroCardProps {
  nextTest: NextTestTarget | null;
  launchUrl: string | null;
}

export function NextRecommendedHeroCard({
  nextTest,
  launchUrl,
}: NextRecommendedHeroCardProps) {
  if (nextTest && launchUrl) {
    const isInProgress = Boolean(nextTest.isInProgress);

    return (
      <div
        className={`bg-card p-6 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-6 ${
          isInProgress
            ? "border-2 border-blue-500/50 dark:border-blue-400/50"
            : "border-2 border-primary/40"
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono ${
                isInProgress ? "text-blue-600 dark:text-blue-400" : "text-primary"
              }`}
            >
              {isInProgress ? (
                <>
                  <PlayCircle size={12} /> Diagnostic In Progress
                </>
              ) : (
                <>
                  <Sparkles size={12} /> Next Recommended Diagnostic
                </>
              )}
            </span>

            {isInProgress && nextTest.completedSectionCount !== undefined && (
              <span className="text-[10px] font-mono px-2 py-0.2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                Module {nextTest.completedSectionCount + 1} Pending
              </span>
            )}
          </div>

          <h2 className="text-xl font-black text-foreground">{nextTest.title}</h2>
          <p className="text-xs text-muted-foreground">
            {isInProgress
              ? "You have an active attempt underway. Pick up directly where you left off without losing progress."
              : "Official-length simulation designed to establish current baseline and pacing telemetry."}
          </p>
        </div>

        <Link
          href={launchUrl}
          className={`px-6 py-3 text-xs font-bold inline-flex items-center justify-center gap-2 rounded-none transition-colors shrink-0 ${
            isInProgress
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <span>{isInProgress ? "Resume Exam" : "Launch Exam"}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border p-6 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">All Available Diagnostics Completed!</h2>
        <p className="text-xs text-muted-foreground mt-1">
          You have completed all active tests in your licensed categories. Review your mistakes to reinforce target skills.
        </p>
      </div>
      <Link
        href="/dashboard/results"
        className="px-4 py-2 border border-input text-xs font-semibold hover:bg-muted inline-flex items-center gap-1.5"
      >
        <span>Review Results</span>
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}