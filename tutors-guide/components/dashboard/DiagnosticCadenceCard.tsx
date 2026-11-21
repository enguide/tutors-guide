// components/dashboard/DiagnosticCadenceCard.tsx
"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  CalendarClock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Coffee,
  Hourglass,
} from "lucide-react";

interface DiagnosticCadenceCardProps {
  activeProgram?: string;
  latestCompletedAt: Date | string | null;
  latestCategory: string | null;
  totalCompletedCount: number;
  nextTestLaunchUrl: string | null;
  isRecentPendingAudit?: boolean;
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredValue(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export function DiagnosticCadenceCard({
  activeProgram: propActiveProgram,
  latestCompletedAt,
  latestCategory,
  totalCompletedCount,
  nextTestLaunchUrl,
  isRecentPendingAudit = false,
}: DiagnosticCadenceCardProps) {
  const activeProgram = propActiveProgram || latestCategory || "SAT";

  const isHydrated = useSyncExternalStore(
    subscribeToStorage,
    () => true,
    () => false
  );

  const storedDate = useSyncExternalStore(
    subscribeToStorage,
    () => getStoredValue(`target_exam_date_${activeProgram}`, ""),
    () => ""
  );

  const cadenceState = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let daysToOfficial: number | null = null;
    if (storedDate) {
      const [year, month, day] = storedDate.split("-").map(Number);
      const target = new Date(year, month - 1, day);
      target.setHours(0, 0, 0, 0);
      daysToOfficial = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    }

    let daysSinceLast: number | null = null;
    if (latestCompletedAt) {
      const last = new Date(latestCompletedAt);
      last.setHours(0, 0, 0, 0);
      daysSinceLast = Math.max(0, Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)));
    }

    if (isRecentPendingAudit) {
      return {
        badge: "FRQ Audit In Progress",
        title: "Handwritten Packet Under Review",
        description:
          "Your scanned FRQ sheets are queued for tutor rubric grading. Inspect your Section I pacing and missed items while your final composite score is finalized.",
        actionText: "Inspect MC Telemetry",
        actionUrl: "/dashboard/results",
        icon: Hourglass,
        daysSince: daysSinceLast,
      };
    }

    if (daysToOfficial !== null && daysToOfficial <= 4 && daysToOfficial >= 0) {
      return {
        badge: "Final Taper Active",
        title: "Conserve Energy for Test Day",
        description:
          "Your official sitting is in less than 5 days. Avoid full-length diagnostics to keep your mental stamina fresh.",
        actionText: "Review Error Logs",
        actionUrl: "/dashboard/results",
        icon: Coffee,
        daysSince: daysSinceLast,
      };
    }

    if (daysSinceLast === null) {
      return {
        badge: "Baseline Needed",
        title: "Take Your Initial Diagnostic",
        description:
          "Complete your first diagnostic test to establish an accurate pacing trace and score baseline.",
        actionText: "Launch Baseline Exam",
        actionUrl: nextTestLaunchUrl || "/dashboard/tests",
        icon: CalendarClock,
        daysSince: null,
      };
    }

    if (daysSinceLast <= 3) {
      return {
        badge: "Active Review Window",
        title: "Consolidate Error Logs",
        description: `Exam completed ${daysSinceLast === 0 ? "today" : `${daysSinceLast}d ago`}. Analyze your triage notes and second-guesses before taking another diagnostic.`,
        actionText: "Inspect Recent Errors",
        actionUrl: "/dashboard/results",
        icon: CheckCircle2,
        daysSince: daysSinceLast,
      };
    }

    if (daysSinceLast <= 8) {
      return {
        badge: "Skill Reinforcement",
        title: "Target Weak Subdomains",
        description: `${daysSinceLast} days since last diagnostic. Focus on untimed drill sets in your lowest-accuracy domains.`,
        actionText: "Review Problem Types",
        actionUrl: "/dashboard/results",
        icon: BookOpen,
        daysSince: daysSinceLast,
      };
    }

    if (daysSinceLast <= 14) {
      return {
        badge: "Optimal Testing Window",
        title: "Ready for Next Diagnostic",
        description: `${daysSinceLast} days since last evaluation. Your review cycle is complete—time to test under timed conditions.`,
        actionText: "Launch Next Diagnostic",
        actionUrl: nextTestLaunchUrl || "/dashboard/tests",
        icon: CalendarClock,
        daysSince: daysSinceLast,
      };
    }

    return {
      badge: "Cadence Slip Alert",
      title: "Diagnostic Overdue",
      description: `${daysSinceLast} days without a full evaluation. Re-establish diagnostic conditioning to preserve test-taking stamina.`,
      actionText: "Resume Testing Cadence",
      actionUrl: nextTestLaunchUrl || "/dashboard/tests",
      icon: AlertCircle,
      daysSince: daysSinceLast,
    };
  }, [latestCompletedAt, storedDate, nextTestLaunchUrl, isRecentPendingAudit]);

  if (!isHydrated) {
    return <div className="bg-card border border-border p-6 rounded-none h-52 animate-pulse" />;
  }

  const Icon = cadenceState.icon;

  return (
    <div className="h-full bg-card border border-border rounded-none p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Icon size={14} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono truncate">
            {cadenceState.badge}
          </span>
        </div>

        {cadenceState.daysSince !== null && (
          <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 shrink-0">
            <Clock size={11} /> {cadenceState.daysSince}d ago
          </span>
        )}
      </div>

      <div className="py-4 space-y-1.5">
        <h3 className="text-base font-bold text-foreground">{cadenceState.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {cadenceState.description}
        </p>
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono text-muted-foreground">
          {totalCompletedCount} exam{totalCompletedCount === 1 ? "" : "s"} logged
        </span>

        <Link
          href={cadenceState.actionUrl}
          className="min-h-8 text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 transition-colors"
        >
          <span>{cadenceState.actionText}</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}