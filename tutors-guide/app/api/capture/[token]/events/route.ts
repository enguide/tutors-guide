// app/api/capture/[token]/events/route.ts
import { NextRequest, connection } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  // Opt in to dynamic runtime execution under Dynamic I/O / cacheComponents
  await connection();

  const { token } = await params;

  const encoder = new TextEncoder();
  let isClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        if (isClosed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          isClosed = true;
        }
      };

      // Heartbeat ping every 15s to keep SSE connection alive
      const pingInterval = setInterval(() => {
        if (!isClosed) {
          try {
            controller.enqueue(encoder.encode(": ping\n\n"));
          } catch {
            isClosed = true;
            clearInterval(pingInterval);
          }
        }
      }, 15000);

      // Track last broadcast state per submission ID: `${sub.status}_${sub.crops.length}`
      const submissionSnapshots = new Map<string, string>();

      const pollInterval = setInterval(async () => {
        if (isClosed) return;

        try {
          const session = await prisma.captureSession.findUnique({
            where: { sessionToken: token },
            include: {
              frqSubmissions: {
                include: { crops: true },
              },
            },
          });

          if (!session) {
            sendEvent("ERROR", { message: "Session expired or invalid" });
            clearInterval(pollInterval);
            clearInterval(pingInterval);
            if (!isClosed) {
              controller.close();
              isClosed = true;
            }
            return;
          }

          // Iterate through all submissions attached to this batch capture session
          for (const sub of session.frqSubmissions) {
            const currentCropsCount = sub.crops.length;
            const currentSnapshot = `${sub.status}_${currentCropsCount}`;
            const previousSnapshot = submissionSnapshots.get(sub.id);

            if (previousSnapshot !== currentSnapshot) {
              submissionSnapshots.set(sub.id, currentSnapshot);

              sendEvent("STATUS_CHANGE", {
                status: sub.status,
                submissionId: sub.id,
                questionId: sub.questionId,
                pageNumber: sub.pageNumber,
                fullSheetUrl: sub.fullSheetUrl,
                crops: sub.crops,
              });
            }
          }
        } catch (err) {
          console.error("Capture SSE polling error:", err);
        }
      }, 1500);

      req.signal.addEventListener("abort", () => {
        isClosed = true;
        clearInterval(pollInterval);
        clearInterval(pingInterval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}