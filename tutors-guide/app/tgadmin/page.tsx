/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tgadmin/page.tsx
import { Suspense } from "react";
import { connection } from "next/server";
import { getInstitutionalOverview } from "@/actions/institutional";
import { getCohortAnalytics } from "@/actions/reporting";
import { getOrCreateTutorInviteLink } from "@/actions/mentorship";
import { requireStaffSession } from "@/lib/guards";
import { RosterTable } from "@/components/tgadmin/RosterTable";
import { TutorInviteShareBox } from "@/components/tgadmin/TutorInviteShareBox";
import { Role } from "@prisma/client";
import { Users, UserCheck, Award, Timer } from "lucide-react";

export const instant = false;

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
}) {
  return (
    <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-none p-5 shadow-xs flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
        <div className="text-2xl sm:text-3xl font-black">{value}</div>
        <div className="text-[11px] text-muted-foreground">{subtitle}</div>
      </div>
      <div className="w-10 h-10 border border-border flex items-center justify-center bg-muted/20 text-muted-foreground">
        <Icon size={18} />
      </div>
    </div>
  );
}

async function AdminPortalContent() {
  await connection();
  const staff = await requireStaffSession();

  const [overview, analytics, tutorInvite] = await Promise.all([
    getInstitutionalOverview(),
    getCohortAnalytics(),
    staff.role === Role.TUTOR || staff.role === Role.ADMIN
      ? getOrCreateTutorInviteLink().catch(() => null)
      : null,
  ]);

  const formatAvgTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const isIndependentTutor = !staff.orgId && staff.role === Role.TUTOR;

  return (
    <div className="space-y-8">
      {/* Portal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{overview.orgName}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isIndependentTutor
              ? "Monitor direct student telemetry, test pacing, and individual diagnostic reviews."
              : "Manage license allocations, monitor active cohort test pacing, and audit student diagnostics."}
          </p>
        </div>
      </div>

      {/* Direct Mentorship Quick-Share Banner (for Tutors/Admins) */}
      {tutorInvite && (
        <TutorInviteShareBox inviteUrl={tutorInvite.inviteUrl} />
      )}

      {/* Cohort KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isIndependentTutor ? "Managed Students" : "Total Seats"}
          value={isIndependentTutor ? overview.roster.length : overview.metrics.totalPurchasedSeats}
          subtitle={
            isIndependentTutor
              ? "Active direct mentorship links"
              : `${overview.metrics.availableVacancies} seats available`
          }
          icon={Users}
        />
        <StatCard
          title="Active Students"
          value={overview.metrics.activeAllocatedSeats || overview.roster.length}
          subtitle={`${overview.roster.length} registered accounts`}
          icon={UserCheck}
        />
        <StatCard
          title="Avg Composite"
          value={analytics.averageComposite > 0 ? analytics.averageComposite : "—"}
          subtitle={`Across ${analytics.totalAttempts} completed tests`}
          icon={Award}
        />
        <StatCard
          title="Avg Question Pacing"
          value={analytics.averageTimeSpentSeconds > 0 ? formatAvgTime(analytics.averageTimeSpentSeconds) : "—"}
          subtitle="Mean response time per item"
          icon={Timer}
        />
      </div>

      {/* Roster & Management Workspace */}
      <div className="space-y-4">
        <h2 className="text-base font-bold tracking-tight">
          {isIndependentTutor ? "Mentorship Student Roster" : "Cohort Roster & Entitlements"}
        </h2>
        <RosterTable
          initialRoster={overview.roster}
          metrics={overview.metrics}
          userRole={staff.role}
        />
      </div>
    </div>
  );
}

export default function AdminPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-none" />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-none" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-none" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-none" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-none" />
          </div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-none" />
        </div>
      }
    >
      <AdminPortalContent />
    </Suspense>
  );
}