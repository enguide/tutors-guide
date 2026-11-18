// app/scan/[token]/page.tsx
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { CaptureSessionStatus } from "@prisma/client";
import { SectionFrqManifest } from "@/lib/frq/manifest";
import { MobileCameraContainer, InitialMobileSubmission } from "./MobileCameraContainer";

export const instant = false;

export default async function MobileScanPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  await connection();

  const { token } = await params;

  const session = await prisma.captureSession.findUnique({
    where: { sessionToken: token },
    select: {
      id: true,
      status: true,
      expiresAt: true,
      questionId: true,
      manifestSnapshot: true,
      frqSubmissions: {
        select: {
          id: true,
          sectionId: true,
          questionId: true,
          pageNumber: true,
          status: true,
          processingError: true,
          crops: {
            select: {
              id: true,
              subPartLabel: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    notFound();
  }

  const isExpired =
    session.expiresAt < new Date() ||
    session.status === CaptureSessionStatus.EXPIRED;

  const manifest =
    (session.manifestSnapshot as unknown as SectionFrqManifest | null) ?? null;

  const initialSubmissions: InitialMobileSubmission[] = session.frqSubmissions.map(
    (sub) => ({
      id: sub.id,
      sectionId: sub.sectionId,
      questionId: sub.questionId,
      pageNumber: sub.pageNumber,
      status: sub.status,
      processingError: sub.processingError,
      cropLabels: sub.crops.map((c) => c.subPartLabel),
    })
  );

  return (
    <main className="w-full h-dvh bg-black overflow-hidden">
      <MobileCameraContainer
        sessionToken={token}
        defaultQuestionId={session.questionId ?? undefined}
        isExpired={isExpired}
        manifest={manifest}
        initialSubmissions={initialSubmissions}
      />
    </main>
  );
}