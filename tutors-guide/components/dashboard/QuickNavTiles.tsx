// components/dashboard/QuickNavTiles.tsx
import Link from "next/link";
import { BookOpen, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";

export function QuickNavTiles() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Link
        href="/dashboard/tests"
        className="group bg-card border border-border p-4 sm:p-5 rounded-none flex items-center justify-between gap-3 hover:border-primary/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-primary/10 text-primary border border-primary/20 shrink-0">
            <BookOpen size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              Diagnostic Library
            </div>
            <div className="text-xs text-muted-foreground line-clamp-1">
              Browse full-length adaptive exams & timings
            </div>
          </div>
        </div>
        <ArrowRight
          size={16}
          className="text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0"
        />
      </Link>

      <Link
        href="/dashboard/results"
        className="group bg-card border border-border p-4 sm:p-5 rounded-none flex items-center justify-between gap-3 hover:border-primary/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-primary/10 text-primary border border-primary/20 shrink-0">
            <BarChart3 size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              History & Telemetry
            </div>
            <div className="text-xs text-muted-foreground line-clamp-1">
              Inspect pacing charts, skill accuracy & scores
            </div>
          </div>
        </div>
        <ArrowRight
          size={16}
          className="text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0"
        />
      </Link>

      <Link
        href="/settings/mentors"
        className="group bg-card border border-border p-4 sm:p-5 rounded-none flex items-center justify-between gap-3 hover:border-primary/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-primary/10 text-primary border border-primary/20 shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              Mentors & Privacy
            </div>
            <div className="text-xs text-muted-foreground line-clamp-1">
              Manage instructors authorized to view diagnostics
            </div>
          </div>
        </div>
        <ArrowRight
          size={16}
          className="text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0"
        />
      </Link>
    </div>
  );
}