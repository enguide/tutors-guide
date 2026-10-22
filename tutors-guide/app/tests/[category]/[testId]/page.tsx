// app/tests/[category]/[testId]/page.tsx
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTestMetadata, ensureTestInDatabase } from "@/lib/contentLoader";

export const instant = false;

interface TestEntryPageProps {
  params: Promise<{
    category: string;
    testId: string;
  }>;
}

export default async function TestEntryPage({ params }: TestEntryPageProps) {
  await connection();

  const { category, testId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/tests/${category}/${testId}`);
  }

  if (session.user.role === "ORG_ADMIN" || session.user.role === "TUTOR") {
    redirect("/dashboard?notice=staff_restricted");
  }

  const metadata = await getTestMetadata(category, testId);
  if (!metadata) {
    notFound();
  }

  await ensureTestInDatabase(metadata);

  const profileId = session.user.id;

  // 1. Intermission Check: If an active break is running, hold on /break
  const cookieStore = await cookies();
  const breakCookie = cookieStore.get(`break_${testId}`);
  if (breakCookie?.value) {
    redirect(`/tests/${category}/${testId}/break`);
  }

  // 2. Fetch submitted results AND any active in-flight draft checkpoint
  const [existingResults, activeDraftCheckpoint] = await Promise.all([
    prisma.result.findMany({
      where: { testId, profileId },
      select: { sectionId: true, rawScore: true },
    }),
    prisma.sectionCheckpoint.findFirst({
      where: { testId, profileId },
      select: { sectionId: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const completedSectionIds = new Set(existingResults.map((r) => r.sectionId));

  // 3. Draft Priority Guard: If an in-flight section draft exists on any device, resume it immediately
  if (activeDraftCheckpoint && !completedSectionIds.has(activeDraftCheckpoint.sectionId)) {
    redirect(`/tests/${category}/${testId}/${activeDraftCheckpoint.sectionId}`);
  }

  // 4. If no sections submitted yet and no active draft, launch Section 1
  if (completedSectionIds.size === 0) {
    const firstSection = metadata.sections[0];
    if (!firstSection) notFound();
    redirect(`/tests/${category}/${testId}/${firstSection.id}`);
  }

  // 5. Adaptive (CAT) Multi-Stage Evaluation
  if (metadata.isAdaptive && metadata.stages && metadata.stages.length > 0) {
    // Sort stages in order (Stage 1, Stage 2, etc.)
    const sortedStages = [...metadata.stages].sort((a, b) => a.stageIndex - b.stageIndex);

    for (const stage of sortedStages) {
      const stageResult = existingResults.find((r) => r.sectionId === stage.sectionId);

      // Baseline module pending completion -> Resume baseline
      if (!stageResult) {
        redirect(`/tests/${category}/${testId}/${stage.sectionId}`);
      }

      // Baseline module complete -> Check branched module
      const passed = stageResult.rawScore >= stage.routing.threshold;
      const branchedSectionId = passed ? stage.routing.onPass : stage.routing.onFail;

      if (!completedSectionIds.has(branchedSectionId)) {
        redirect(`/tests/${category}/${testId}/${branchedSectionId}`);
      }
    }

    // Every stage baseline AND branch has been completed -> Go to results
    redirect(`/tests/${category}/${testId}/results`);
  }

  // 6. Standard Linear Progression
  const summary = await prisma.testSummary.findUnique({
    where: { testId_profileId: { testId, profileId } },
  });

  if (summary) {
    redirect(`/tests/${category}/${testId}/results`);
  }

  const nextIncompleteSection = metadata.sections.find(
    (sec) => !completedSectionIds.has(sec.id)
  );

  if (!nextIncompleteSection) {
    redirect(`/tests/${category}/${testId}/results`);
  }

  redirect(`/tests/${category}/${testId}/${nextIncompleteSection.id}`);
}