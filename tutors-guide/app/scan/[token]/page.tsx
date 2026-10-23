// app/scan/[token]/page.tsx
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { CaptureSessionStatus } from "@prisma/client";
import { MobileCameraContainer } from "./MobileCameraContainer";

export default async function MobileScanPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  await connection();

  const { token } = await params;

  // Validate session existence and validity
  const session = await prisma.captureSession.findUnique({
    where: { sessionToken: token },
    select: {
      id: true,
      status: true,
      expiresAt: true,
      questionId: true,
    },
  });

  if (!session) {
    notFound();
  }

  const isExpired =
    session.expiresAt < new Date() ||
    session.status === CaptureSessionStatus.EXPIRED;

  return (
    <main className="w-full h-screen bg-black overflow-hidden">
      <MobileCameraContainer
        sessionToken={token}
        questionId={session.questionId ?? undefined}
        isExpired={isExpired}
        initialStatus={session.status}
      />
    </main>
  );
}