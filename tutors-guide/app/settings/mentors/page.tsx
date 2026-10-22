// app/settings/mentors/page.tsx
import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStudentMentorshipLinks } from "@/actions/mentorship";
import { MentorsManager } from "@/components/settings/MentorsManager";

export const instant = false;

export const metadata = {
  title: "Mentorship & Data Privacy | Tutors Guide",
};

function MentorsSettingsSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-64 bg-card border border-border rounded-none" />
        <div className="h-4 w-96 bg-card border border-border rounded-none" />
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

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Mentorship & Privacy Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage instructors authorized to view your exam attempts and pacing diagnostics.
        </p>
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