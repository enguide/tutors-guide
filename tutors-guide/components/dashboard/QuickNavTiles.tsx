// components/dashboard/QuickNavTiles.tsx
import Link from "next/link";
import { BookOpen, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";

export function QuickNavTiles() {
  return (
    <div className="space-y-4.75">
      <Link
        href="/dashboard/tests"
        className="group bg-card border border-border p-4 rounded-none flex items-center justify-between hover:border-primary/50 transition-colors block"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary border border-primary/20">
            <BookOpen size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              Diagnostic Library
            </div>
            <div className="text-xs text-muted-foreground">
              Browse full-length exams and view module timings
            </div>
          </div>
        </div>
        <ArrowRight
          size={16}
          className="text-muted-foreground group-hover:translate-x-1 transition-transform"
        />
      </Link>

      <Link
        href="/dashboard/results"
        className="group bg-card border border-border p-4 rounded-none flex items-center justify-between hover:border-primary/50 transition-colors block"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary border border-primary/20">
            <BarChart3 size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              Diagnostic History & Telemetry
            </div>
            <div className="text-xs text-muted-foreground">
              Review pacing charts, accuracy by skill, and past scores
            </div>
          </div>
        </div>
        <ArrowRight
          size={16}
          className="text-muted-foreground group-hover:translate-x-1 transition-transform"
        />
      </Link>

      <Link
        href="/settings/mentors"
        className="group bg-card border border-border p-4 rounded-none flex items-center justify-between hover:border-primary/50 transition-colors block"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              Mentors & Data Privacy
            </div>
            <div className="text-xs text-muted-foreground">
              Manage instructors authorized to view your diagnostics
            </div>
          </div>
        </div>
        <ArrowRight
          size={16}
          className="text-muted-foreground group-hover:translate-x-1 transition-transform"
        />
      </Link>
    </div>
  );
}