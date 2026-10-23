/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCaptureSync.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getOrCreateCaptureSession } from "@/actions/frqCapture";
import { FrqSubmissionStatus } from "@prisma/client";

export interface CropSummary {
  id: string;
  subPartLabel: string;
  cropUrl: string;
  pointsPossible: number;
}

export function useCaptureSync({
  testId,
  sectionId,
  questionId,
  onUploadSuccess,
}: {
  testId: string;
  sectionId: string;
  questionId: string;
  onUploadSuccess?: (submissionId: string) => void;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<FrqSubmissionStatus | "IDLE">("IDLE");
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [fullSheetUrl, setFullSheetUrl] = useState<string | null>(null);
  const [crops, setCrops] = useState<CropSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  // Stabilize external callback to prevent re-subscribing on inline prop updates
  const onUploadSuccessRef = useRef(onUploadSuccess);
  useEffect(() => {
    onUploadSuccessRef.current = onUploadSuccess;
  });

  useEffect(() => {
    let isCancelled = false;
    let eventSource: EventSource | null = null;

    async function initializeAndSubscribe() {
      try {
        const res = await getOrCreateCaptureSession({ testId, sectionId, questionId });
        if (isCancelled) return;

        if (!res.success || !res.sessionToken) {
          setError(res.error || "Failed to initialize capture session");
          return;
        }

        const sessionToken = res.sessionToken;
        setToken(sessionToken);

        // Find existing submission for this specific question from the session's submissions array
        if (Array.isArray(res.submissions) && res.submissions.length > 0) {
          const matchingSub = res.submissions.find(
            (sub: any) => sub.questionId === questionId
          );

          if (matchingSub) {
            setStatus(matchingSub.status);
            setSubmissionId(matchingSub.id);
            setFullSheetUrl(matchingSub.fullSheetUrl);
            setCrops(matchingSub.crops || []);
          }
        }

        // Establish SSE stream using the acquired token
        eventSource = new EventSource(`/api/capture/${sessionToken}/events`);

        eventSource.addEventListener("STATUS_CHANGE", (e) => {
          if (isCancelled) return;
          try {
            const payload = JSON.parse(e.data);

            // If the event specifies a questionId, ensure it matches this hook's target question
            if (payload.questionId && payload.questionId !== questionId) {
              return;
            }

            if (payload.status) setStatus(payload.status);
            if (payload.submissionId) setSubmissionId(payload.submissionId);
            if (payload.fullSheetUrl) setFullSheetUrl(payload.fullSheetUrl);
            if (payload.crops) setCrops(payload.crops);

            if (payload.status === "UPLOADED" || payload.status === "CROPPED") {
              onUploadSuccessRef.current?.(payload.submissionId);
            }
          } catch (err) {
            console.error("Error parsing SSE status payload:", err);
          }
        });

        eventSource.addEventListener("ERROR", () => {
          if (isCancelled) return;
          setError("Lost connection to capture sync.");
        });
      } catch (err) {
        if (!isCancelled) {
          setError("Failed to establish capture channel.");
          console.error("Capture session setup error:", err);
        }
      }
    }

    initializeAndSubscribe();

    return () => {
      isCancelled = true;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [testId, sectionId, questionId, refreshCount]);

  const refreshSession = useCallback(() => {
    setStatus("IDLE");
    setToken(null);
    setSubmissionId(null);
    setFullSheetUrl(null);
    setCrops([]);
    setError(null);
    setRefreshCount((prev) => prev + 1);
  }, []);

  return {
    token,
    status,
    submissionId,
    fullSheetUrl,
    crops,
    error,
    refreshSession,
  };
}