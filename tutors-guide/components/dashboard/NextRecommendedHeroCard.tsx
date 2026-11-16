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
        className={`bg-card p-5 sm:p-6 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 ${
          isInProgress
            ? "border-2 border-blue-500/50 dark:border-blue-400/50"
            : "border-2 border-primary/40"
        }`}
      >
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
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
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                Module {nextTest.completedSectionCount + 1} Pending
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-black text-foreground truncate">
            {nextTest.title}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isInProgress
              ? "Active attempt saved. Resume directly from your current module checkpoint."
              : "Adaptive full-length simulation calibrated to benchmark pacing and upper-track rigor."}
          </p>
        </div>

        <Link
          href={launchUrl}
          className={`w-full sm:w-auto min-h-11 px-6 py-3 text-xs font-bold inline-flex items-center justify-center gap-2 rounded-none transition-colors shrink-0 ${
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
    <div className="bg-card border border-border p-5 sm:p-6 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          All Available Diagnostics Completed!
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          You have completed all active tests in your licensed categories. Review your triage logs to reinforce target skills.
        </p>
      </div>
      <Link
        href="/dashboard/results"
        className="w-full sm:w-auto min-h-10 px-4 py-2.5 border border-input text-xs font-semibold hover:bg-muted inline-flex items-center justify-center gap-1.5 shrink-0"
      >
        <span>Review Results</span>
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}