// hooks/useCaptureSync.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getOrCreateCaptureSession } from "@/actions/frqCapture";
import { SectionFrqManifest } from "@/lib/frq/manifest";
import { FrqSubmissionStatus } from "@prisma/client";

export interface CropSummary {
  id: string;
  subPartLabel: string;
  cropUrl: string;
  pointsPossible: number;
  pointsAwarded?: number | null;
}

export interface CaptureSubmissionSummary {
  id: string;
  questionId: string;
  pageNumber: number;
  status: FrqSubmissionStatus;
  fullSheetUrl: string | null;
  deskewedSheetUrl: string | null;
  processingError: string | null;
  crops: CropSummary[];
}

const TERMINAL_STATUSES = new Set<FrqSubmissionStatus>([
  FrqSubmissionStatus.CROPPED,
  FrqSubmissionStatus.PENDING_AUDIT,
  FrqSubmissionStatus.EVALUATED,
]);

export function useCaptureSync({
  testId,
  sectionId,
  questionId,
  enabled = true,
  onUploadSuccess,
}: {
  testId: string;
  sectionId: string;
  questionId?: string;
  enabled?: boolean;
  onUploadSuccess?: (submissionId: string) => void;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [manifest, setManifest] = useState<SectionFrqManifest | null>(null);
  const [submissions, setSubmissions] = useState<CaptureSubmissionSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const onUploadSuccessRef = useRef(onUploadSuccess);
  useEffect(() => {
    onUploadSuccessRef.current = onUploadSuccess;
  });

  const notifiedIdsRef = useRef<Set<string>>(new Set());

  // 1. Initialize capture session & hydrate cached manifest + existing submissions
  useEffect(() => {
    if (!enabled) return;
    let isCancelled = false;

    async function initSession() {
      setIsLoading(true);
      try {
        const res = await getOrCreateCaptureSession({ testId, sectionId, questionId });
        if (isCancelled) return;

        if (!res.success || !res.sessionToken) {
          setError(res.error || "Failed to initialize capture session");
          setIsLoading(false);
          return;
        }

        setToken(res.sessionToken);
        setManifest((res.manifest as SectionFrqManifest | null) ?? null);

        if (Array.isArray(res.submissions)) {
          const mapped: CaptureSubmissionSummary[] = res.submissions.map((sub) => ({
            id: sub.id,
            questionId: sub.questionId,
            pageNumber: sub.pageNumber,
            status: sub.status,
            fullSheetUrl: sub.fullSheetUrl,
            deskewedSheetUrl: sub.deskewedSheetUrl,
            processingError: sub.processingError,
            crops: sub.crops || [],
          }));
          setSubmissions(mapped);
        }
        setIsLoading(false);
      } catch (err) {
        if (!isCancelled) {
          setError("Failed to establish capture session.");
          setIsLoading(false);
          console.error("Capture session setup error:", err);
        }
      }
    }

    initSession();
    return () => {
      isCancelled = true;
    };
  }, [enabled, testId, sectionId, questionId, refreshCount]);

  // 2. Jittered short-polling against lightweight /status endpoint (scales cleanly to 1,000+ users)
  useEffect(() => {
    if (!enabled || !token) return;
    let isCancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const pollStatus = async () => {
      if (isCancelled) return;

      // Pause polling when browser tab is hidden to save server capacity
      if (typeof document !== "undefined" && document.hidden) {
        timeoutId = setTimeout(pollStatus, 4000);
        return;
      }

      try {
        const res = await fetch(`/api/capture/${token}/status`, {
          cache: "no-store",
        });
        if (isCancelled) return;

        if (res.ok) {
          const data = await res.json();
          if (data.isExpired) {
            setError("Capture session expired. Refresh to generate a new QR code.");
            return;
          }

          if (data.manifest && !manifest) {
            setManifest(data.manifest);
          }

          if (Array.isArray(data.submissions)) {
            const incoming: CaptureSubmissionSummary[] = data.submissions;
            setSubmissions(incoming);

            for (const sub of incoming) {
              if (
                TERMINAL_STATUSES.has(sub.status) &&
                !notifiedIdsRef.current.has(sub.id)
              ) {
                notifiedIdsRef.current.add(sub.id);
                onUploadSuccessRef.current?.(sub.id);
              }
            }

            // If all expected sheets in manifest have reached a terminal state, slow polling to 10s
            const expectedCount =
              data.manifest?.totalSheets ?? manifest?.totalSheets ?? 0;
            const completedCount = incoming.filter((s) =>
              TERMINAL_STATUSES.has(s.status)
            ).length;
            const hasInFlight = incoming.some(
              (s) =>
                s.status === FrqSubmissionStatus.UPLOADED ||
                s.status === FrqSubmissionStatus.PROCESSING
            );

            const baseDelay =
              expectedCount > 0 && completedCount >= expectedCount && !hasInFlight
                ? 10000
                : 2500 + Math.floor(Math.random() * 1000); // 2.5s - 3.5s jitter

            timeoutId = setTimeout(pollStatus, baseDelay);
            return;
          }
        }
      } catch (err) {
        console.warn("Capture status poll transient error:", err);
      }

      if (!isCancelled) {
        timeoutId = setTimeout(pollStatus, 4000);
      }
    };

    timeoutId = setTimeout(pollStatus, 2000);

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [enabled, token, manifest]);

  const upsertOptimisticSubmission = useCallback(
    (incoming: CaptureSubmissionSummary) => {
      setSubmissions((prev) => {
        const filtered = prev.filter(
          (s) =>
            !(
              s.questionId === incoming.questionId &&
              s.pageNumber === incoming.pageNumber
            )
        );
        return [...filtered, incoming];
      });
    },
    []
  );

  const refreshSession = useCallback(() => {
    notifiedIdsRef.current.clear();
    setToken(null);
    setSubmissions([]);
    setError(null);
    setRefreshCount((prev) => prev + 1);
  }, []);

  // Convenience single-question fields for backward compatibility
  const matchingSubmission = questionId
    ? submissions.find((s) => s.questionId === questionId)
    : submissions[0];

  return {
    token,
    manifest,
    submissions,
    isLoading,
    status: matchingSubmission?.status ?? ("IDLE" as const),
    submissionId: matchingSubmission?.id ?? null,
    fullSheetUrl:
      matchingSubmission?.deskewedSheetUrl ??
      matchingSubmission?.fullSheetUrl ??
      null,
    crops: matchingSubmission?.crops ?? [],
    error,
    upsertOptimisticSubmission,
    refreshSession,
  };
}