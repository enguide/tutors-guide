// app/api/capture/[token]/status/route.ts
import { NextRequest, NextResponse, connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { CaptureSessionStatus } from "@prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  await connection();
  const { token } = await params;

  try {
    const session = await prisma.captureSession.findUnique({
      where: { sessionToken: token },
      select: {
        id: true,
        status: true,
        expiresAt: true,
        manifestSnapshot: true,
        frqSubmissions: {
          orderBy: [{ questionId: "asc" }, { pageNumber: "asc" }],
          select: {
            id: true,
            questionId: true,
            pageNumber: true,
            status: true,
            fullSheetUrl: true,
            deskewedSheetUrl: true,
            processingError: true,
            updatedAt: true,
            crops: {
              orderBy: { subPartLabel: "asc" },
              select: {
                id: true,
                subPartLabel: true,
                cropUrl: true,
                pointsPossible: true,
                pointsAwarded: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    const isExpired =
      session.expiresAt < new Date() ||
      session.status === CaptureSessionStatus.EXPIRED;

    return NextResponse.json(
      {
        success: true,
        isExpired,
        manifest: session.manifestSnapshot,
        submissions: session.frqSubmissions,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("[Capture Status API] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch capture status" },
      { status: 500 }
    );
  }
}