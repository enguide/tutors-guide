// app/link-tutor/page.tsx
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Role } from "@prisma/client";
import { TutorConsentCard } from "@/components/mentorship/TutorConsentCard";

export const metadata = {
  title: "Authorize Tutor Access | Tutors Guide",
};

interface LinkTutorPageProps {
  searchParams: Promise<{
    tutorId?: string;
  }>;
}

async function LinkTutorContent({ searchParamsPromise }: { searchParamsPromise: Promise<{ tutorId?: string }> }) {
  await connection();
  const { tutorId } = await searchParamsPromise;

  if (!tutorId) {
    notFound();
  }

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/link-tutor?tutorId=${tutorId}`)}`);
  }

  // Prevent linking self
  if (tutorId === session.user.id) {
    redirect("/dashboard?notice=cannot_link_self");
  }

  const tutor = await prisma.profile.findUnique({
    where: { id: tutorId },
    select: { id: true, firstName: true, lastName: true, email: true, role: true },
  });

  if (!tutor || (tutor.role !== Role.TUTOR && tutor.role !== Role.ADMIN)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <TutorConsentCard
        tutor={{
          id: tutor.id,
          name: `${tutor.firstName} ${tutor.lastName}`.trim() || tutor.email,
          email: tutor.email,
        }}
      />
    </div>
  );
}

export default function LinkTutorPage({ searchParams }: LinkTutorPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
          <div className="w-full max-w-lg h-72 bg-card border border-border animate-pulse rounded-none" />
        </div>
      }
    >
      <LinkTutorContent searchParamsPromise={searchParams} />
    </Suspense>
  );
}