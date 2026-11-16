// app/settings/mentors/page.tsx
import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getStudentMentorshipLinks } from "@/actions/mentorship";
import { MentorsManager } from "@/components/settings/MentorsManager";

export const instant = false;

export const metadata = {
  title: "Mentorship & Data Privacy | Tutors Guide",
};

function MentorsSettingsSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-pulse">
      <div className="space-y-2 border-b border-border pb-5">
        <div className="h-4 w-32 bg-card border border-border rounded-none" />
        <div className="h-7 w-64 bg-card border border-border rounded-none" />
        <div className="h-4 w-full max-w-md bg-card border border-border rounded-none" />
      </div>

      <div className="space-y-6">
        <div className="h-28 bg-card border border-border rounded-none" />
        <div className="h-28 bg-card border border-border rounded-none" />
        <div className="h-48 bg-card border border-border rounded-none" />
      </div>
    </main>
  );
}

async function MentorsSettingsContent() {
  await connection();
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/settings/mentors");
  }

  const links = await getStudentMentorshipLinks();

  const activeCount = links.filter((l) => l.status === "ACTIVE").length;
  const pendingCount = links.filter((l) => l.status === "PENDING").length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header & Sharing Status Summary */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="min-h-8 inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Dashboard</span>
          </Link>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
              <span>Mentorship & Privacy Settings</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Manage instructors authorized to view your exam attempts, adaptive routing, and pacing diagnostics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground shrink-0">
          <span>
            <strong className="text-foreground">{activeCount}</strong> Active
          </span>
          {pendingCount > 0 && (
            <>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400">
                <strong>{pendingCount}</strong> Pending
              </span>
            </>
          )}
        </div>
      </div>

      <MentorsManager initialLinks={links} currentUserId={session.user.id} />
    </main>
  );
}

export default function MentorsSettingsPage() {
  return (
    <Suspense fallback={<MentorsSettingsSkeleton />}>
      <MentorsSettingsContent />
    </Suspense>
  );
}