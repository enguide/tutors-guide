// components/exam/SectionCaptureModal.tsx
"use client";

import React, { useState, useRef, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QuestionFrontmatter } from "@/types/content";
import { buildSectionFrqManifest } from "@/lib/frq/manifest";
import {
  useCaptureSync,
  CaptureSubmissionSummary,
} from "@/hooks/useCaptureSync";
import {
  getPresignedUploadForSession,
  finalizeSubmissionUpload,
} from "@/actions/frqCapture";
import { FrqSubmissionStatus } from "@prisma/client";
import {
  CheckCircle2,
  Circle,
  Smartphone,
  Loader2,
  ArrowRight,
  Upload,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

type CaptureSyncHandle = ReturnType<typeof useCaptureSync>;

interface SectionCaptureModalProps {
  isOpen: boolean;
  testId: string;
  /** Optional: omit for test-wide capture across all FRQ sections */
  sectionId?: string;
  questions: QuestionFrontmatter[];
  onFinalizeSection: () => void;
  isSubmitting?: boolean;
  externalSync?: CaptureSyncHandle;
}

const MAX_DESKTOP_IMAGE_DIM = 2200;

async function normalizeDesktopImageFile(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const longest = Math.max(img.width, img.height);
      if (longest <= MAX_DESKTOP_IMAGE_DIM) {
        resolve(file);
        return;
      }

      const scale = MAX_DESKTOP_IMAGE_DIM / longest;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob || file), "image/jpeg", 0.92);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export const SectionCaptureModal: React.FC<SectionCaptureModalProps> = ({
  isOpen,
  testId,
  sectionId,
  questions,
  onFinalizeSection,
  isSubmitting = false,
  externalSync,
}) => {
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeTargetRef = useRef<{
    sectionId: string;
    questionId: string;
    pageNumber: number;
  } | null>(null);

  const localManifest = useMemo(
    () => buildSectionFrqManifest(testId, sectionId || "default", questions),
    [testId, sectionId, questions]
  );

  const internalSync = useCaptureSync({
    testId,
    sectionId,
    enabled: isOpen && !externalSync,
  });

  const activeSync = externalSync ?? internalSync;
  const {
    token,
    manifest: serverManifest,
    submissions,
    isLoading,
    error: syncError,
    upsertOptimisticSubmission,
  } = activeSync;

  const activeManifest = serverManifest ?? localManifest;

  const submissionMap = useMemo(() => {
    const map = new Map<string, CaptureSubmissionSummary>();
    for (const sub of submissions) {
      map.set(`${sub.sectionId}::${sub.questionId}::p${sub.pageNumber}`, sub);
    }
    return map;
  }, [submissions]);

  const hasSheetsInFlight = useMemo(
    () =>
      submissions.some(
        (s) =>
          s.status === FrqSubmissionStatus.UPLOADED ||
          s.status === FrqSubmissionStatus.PROCESSING
      ),
    [submissions]
  );

  const verifiedSheetCount = useMemo(
    () =>
      activeManifest.sheets.filter((sheet) => {
        const sub = submissionMap.get(sheet.sheetKey);
        return (
          sub &&
          (sub.status === FrqSubmissionStatus.CROPPED ||
            sub.status === FrqSubmissionStatus.PENDING_AUDIT ||
            sub.status === FrqSubmissionStatus.EVALUATED)
        );
      }).length,
    [activeManifest.sheets, submissionMap]
  );

  const retakeNeededCount = useMemo(
    () =>
      activeManifest.sheets.filter((sheet) => {
        const sub = submissionMap.get(sheet.sheetKey);
        return (
          sub &&
          (sub.status === FrqSubmissionStatus.NEEDS_RETAKE ||
            sub.status === FrqSubmissionStatus.FAILED)
        );
      }).length,
    [activeManifest.sheets, submissionMap]
  );

  const allSheetsVerified =
    activeManifest.totalSheets > 0 &&
    verifiedSheetCount >= activeManifest.totalSheets &&
    !hasSheetsInFlight;

  const handleDesktopFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !token || !activeTargetRef.current) return;

    const { sectionId: targetSecId, questionId, pageNumber } = activeTargetRef.current;
    const targetKey = `${targetSecId}_${questionId}_p${pageNumber}`;
    setUploadingTarget(targetKey);
    setUploadError(null);

    try {
      const normalizedBlob = await normalizeDesktopImageFile(file);
      const mimeType =
        normalizedBlob instanceof File ? normalizedBlob.type : "image/jpeg";

      const presignRes = await getPresignedUploadForSession(
        token,
        mimeType || "image/jpeg",
        questionId,
        pageNumber,
        targetSecId
      );

      if (!presignRes.success || !presignRes.presigned) {
        throw new Error(presignRes.error || "Failed to authorize upload.");
      }

      const { url, fields, key, publicUrl } = presignRes.presigned;
      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
      formData.append("file", normalizedBlob, "sheet.jpg");

      const uploadRes = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Direct upload to storage failed.");
      }

      const finalizeRes = await finalizeSubmissionUpload({
        sessionToken: token,
        storageKey: key,
        publicUrl,
        mimeType: mimeType || "image/jpeg",
        fileSizeBytes: normalizedBlob.size,
        sectionId: targetSecId,
        questionId,
        pageNumber,
      });

      if (!finalizeRes.success || !finalizeRes.submission) {
        throw new Error(
          finalizeRes.error || "Failed to finalize sheet submission."
        );
      }

      upsertOptimisticSubmission({
        id: finalizeRes.submission.id,
        sectionId: targetSecId,
        questionId,
        pageNumber,
        status: FrqSubmissionStatus.UPLOADED,
        fullSheetUrl: publicUrl,
        deskewedSheetUrl: null,
        processingError: null,
        crops: [],
      });
    } catch (err: unknown) {
      console.error(err);
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingTarget(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerDesktopUpload = (
    targetSecId: string,
    questionId: string,
    pageNumber: number
  ) => {
    activeTargetRef.current = { sectionId: targetSecId, questionId, pageNumber };
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");
  const scanUrl = token ? `${appBaseUrl.replace(/\/$/, "")}/scan/${token}` : "";

  const combinedError = uploadError || syncError;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 font-sans"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleDesktopFileSelect}
      />

      <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Submit Handwritten Response Sheets
            </h2>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              Scan all {activeManifest.totalSheets} response sheets in any order before viewing your results.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold transition-colors ${
                allSheetsVerified
                  ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              }`}
            >
              {allSheetsVerified && <CheckCircle2 className="w-3.5 h-3.5" />}
              {verifiedSheetCount}/{activeManifest.totalSheets} Verified
            </span>
          </div>
        </div>

        {combinedError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-600 dark:text-red-400 text-xs font-mono">
            {combinedError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Mobile QR Scanner Handoff */}
          <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Scan with phone to upload in any order</span>
            </div>

            <div className="bg-white p-3 rounded-md border border-neutral-200 dark:border-neutral-800 shadow-xs">
              {isLoading || !token ? (
                <div className="w-44 h-44 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                </div>
              ) : (
                <QRCodeSVG value={scanUrl} size={176} level="M" />
              )}
            </div>

            {token && (
              <div className="flex flex-col items-center gap-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live sync active • uploads appear automatically</span>
                </div>
                <a
                  href={scanUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Open mobile scanner link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <p className="text-[11px] text-neutral-400 leading-tight">
              Point your phone camera at the QR code above. Photograph pages in any order — each sheet&apos;s footer barcode automatically matches it to the right question.
            </p>
          </div>

          {/* Right: Dynamic Required Sheets Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Required Sheets ({activeManifest.totalSheets} Pages)
              </h3>
              <span className="text-[10px] text-neutral-400 font-mono">
                Or upload PNG/JPG directly
              </span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {activeManifest.questions.map((mq) => (
                <div
                  key={`${mq.sectionId}::${mq.questionId}`}
                  className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      Question {mq.questionNumber}
                    </span>
                    {mq.sectionTitle && (
                      <span className="text-[10px] text-neutral-400 truncate max-w-[180px]">
                        {mq.sectionTitle}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {mq.sheets.map((sheet) => {
                      const sub = submissionMap.get(sheet.sheetKey);
                      const isUploadingLocal =
                        uploadingTarget ===
                        `${sheet.sectionId}_${sheet.questionId}_p${sheet.pageNumber}`;
                      const isProcessingServer =
                        sub?.status === FrqSubmissionStatus.UPLOADED ||
                        sub?.status === FrqSubmissionStatus.PROCESSING;
                      const needsRetake =
                        sub?.status === FrqSubmissionStatus.NEEDS_RETAKE ||
                        sub?.status === FrqSubmissionStatus.FAILED;
                      const isVerified =
                        sub &&
                        (sub.status === FrqSubmissionStatus.CROPPED ||
                          sub.status === FrqSubmissionStatus.PENDING_AUDIT ||
                          sub.status === FrqSubmissionStatus.EVALUATED);

                      const partsDisplay =
                        sheet.parts.length === 1
                          ? `Part ${sheet.parts[0].label}`
                          : sheet.parts.map((p) => p.label).join(" & ");

                      return (
                        <div
                          key={sheet.sheetKey}
                          className={`flex flex-col justify-between px-2.5 py-2 bg-white dark:bg-neutral-900 border rounded transition-colors ${
                            needsRetake
                              ? "border-red-500/50 bg-red-500/5"
                              : isVerified
                              ? "border-emerald-500/50 bg-emerald-500/5"
                              : "border-neutral-200 dark:border-neutral-800"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {isUploadingLocal || isProcessingServer ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 shrink-0" />
                              ) : needsRetake ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              ) : isVerified ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              )}
                              <span className="truncate font-medium">
                                Sheet {sheet.pageNumber} ({partsDisplay})
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {(sub?.deskewedSheetUrl || sub?.fullSheetUrl) && (
                                <a
                                  href={
                                    sub.deskewedSheetUrl ||
                                    sub.fullSheetUrl ||
                                    "#"
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Inspect processed sheet"
                                  className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-blue-500 transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  triggerDesktopUpload(
                                    sheet.sectionId,
                                    sheet.questionId,
                                    sheet.pageNumber
                                  )
                                }
                                title={`Upload Sheet ${sheet.pageNumber} from computer`}
                                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                              >
                                <Upload className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {isVerified && (
                            <span className="text-[10px] text-emerald-500 font-mono mt-1">
                              Synced & cropped ({sub.crops.length} part{sub.crops.length === 1 ? "" : "s"})
                            </span>
                          )}
                          {isProcessingServer && (
                            <span className="text-[10px] text-blue-500 font-mono mt-1">
                              Aligning fiducials & cropping...
                            </span>
                          )}
                          {needsRetake && (
                            <span
                              className="text-[10px] text-red-500 mt-1 leading-tight"
                              title={sub?.processingError || undefined}
                            >
                              {sub?.processingError ||
                                "Corner markers unclear — retake photo"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px]">
            {hasSheetsInFlight ? (
              <span className="text-blue-500 font-medium">
                Waiting for uploaded sheets to finish cropping before submission...
              </span>
            ) : allSheetsVerified ? (
              <span className="text-emerald-500 font-semibold">
                All {activeManifest.totalSheets} sheets received & verified! Click Complete & View Results.
              </span>
            ) : retakeNeededCount > 0 ? (
              <span className="text-amber-500 font-medium">
                {retakeNeededCount} sheet(s) flagged for retake. Rescan on phone or complete anyway.
              </span>
            ) : (
              <span className="text-neutral-400">
                You can finalize even if some pages were left blank.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onFinalizeSection}
            disabled={isSubmitting || hasSheetsInFlight}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all disabled:opacity-50 cursor-pointer shrink-0 ${
              allSheetsVerified
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                : "bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950"
            }`}
          >
            {isSubmitting || hasSheetsInFlight ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{hasSheetsInFlight ? "Processing Sheets..." : "Finalizing..."}</span>
              </>
            ) : (
              <>
                <span>Complete & View Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};