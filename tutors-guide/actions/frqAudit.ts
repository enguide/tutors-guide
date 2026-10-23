// actions/frqAudit.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPendingAuditCrops() {
  const session = await auth();
  const userId = session?.user?.id;
  const role = session?.user?.role;

  if (!userId || (role !== "ADMIN" && role !== "ORG_ADMIN" && role !== "TUTOR")) {
    return { success: false, error: "Unauthorized access to audit queue." };
  }

  try {
    const crops = await prisma.frqSubCrop.findMany({
      where: {
        needsHumanAudit: true,
        reviewedAt: null,
      },
      include: {
        frqSubmission: {
          include: {
            profile: {
              select: { firstName: true, lastName: true, email: true },
            },
            test: {
              select: { title: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, crops };
  } catch (error) {
    console.error("Failed to load audit queue:", error);
    return { success: false, error: "Database query failed." };
  }
}

export async function resolveCropAudit({
  cropId,
  pointsAwarded,
  transcription,
  reviewerNotes,
}: {
  cropId: string;
  pointsAwarded: number;
  transcription?: string;
  reviewerNotes?: string;
}) {
  const session = await auth();
  const reviewerId = session?.user?.id;
  const role = session?.user?.role;

  if (!reviewerId || (role !== "ADMIN" && role !== "ORG_ADMIN" && role !== "TUTOR")) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    await prisma.frqSubCrop.update({
      where: { id: cropId },
      data: {
        pointsAwarded,
        transcription: transcription || undefined,
        needsHumanAudit: false,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
        reviewerNotes,
      },
    });

    revalidatePath("/tgadmin/frq-audit");
    return { success: true };
  } catch (error) {
    console.error("Failed to resolve crop audit:", error);
    return { success: false, error: "Audit resolution failed." };
  }
}