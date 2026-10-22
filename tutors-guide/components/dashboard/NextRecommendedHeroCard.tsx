// components/dashboard/NextRecommendedHeroCard.tsx
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export interface NextTestTarget {
  category: string;
  testId: string;
  title: string;
  firstSectionId: string;
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
    return (
      <div className="bg-card border-2 border-primary/40 p-6 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 font-mono">
            <Sparkles size={12} /> Next Recommended Diagnostic
          </span>
          <h2 className="text-xl font-black text-foreground">{nextTest.title}</h2>
          <p className="text-xs text-muted-foreground">
            Official-length simulation designed to establish current baseline and pacing telemetry.
          </p>
        </div>

        <Link
          href={launchUrl}
          className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold inline-flex items-center justify-center gap-2 rounded-none transition-colors shrink-0"
        >
          <span>Launch Exam</span>
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