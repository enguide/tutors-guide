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

  const manifestRef = useRef<SectionFrqManifest | null>(null);
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

        const resolvedManifest = (res.manifest as SectionFrqManifest | null) ?? null;
        manifestRef.current = resolvedManifest;
        setManifest(resolvedManifest);
        setToken(res.sessionToken);

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

  // 2. Jittered short-polling against lightweight /status endpoint
  useEffect(() => {
    if (!enabled || !token) return;
    let isCancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const pollStatus = async () => {
      if (isCancelled) return;

      if (typeof document !== "undefined" && document.hidden) {
        timeoutId = setTimeout(pollStatus, 3000);
        return;
      }

      try {
        const res = await fetch(`/api/capture/${token}/status`, {
          cache: "no-store",
          credentials: "same-origin",
        });
        if (isCancelled) return;

        if (!res.ok) {
          console.warn(`[Capture Sync] /status returned HTTP ${res.status}`);
        } else {
          const data = await res.json();
          if (data.isExpired) {
            setError("Capture session expired. Refresh to generate a new QR code.");
            return;
          }

          if (data.manifest && !manifestRef.current) {
            manifestRef.current = data.manifest;
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

            const expectedCount =
              data.manifest?.totalSheets ?? manifestRef.current?.totalSheets ?? 0;
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
                ? 8000
                : 2000 + Math.floor(Math.random() * 800);

            timeoutId = setTimeout(pollStatus, baseDelay);
            return;
          }
        }
      } catch (err) {
        console.warn("[Capture Sync] Status poll error:", err);
      }

      if (!isCancelled) {
        timeoutId = setTimeout(pollStatus, 3000);
      }
    };

    // Run first poll immediately so desktop reflects any mobile uploads right away
    pollStatus();

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [enabled, token]);

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
    manifestRef.current = null;
    setToken(null);
    setSubmissions([]);
    setError(null);
    setRefreshCount((prev) => prev + 1);
  }, []);

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