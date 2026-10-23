/* eslint-disable @typescript-eslint/no-explicit-any */
// components/exam/SectionCaptureModal.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QuestionFrontmatter } from "@/types/content";
import {
  getOrCreateCaptureSession,
  getPresignedUploadForSession,
  finalizeSubmissionUpload,
} from "@/actions/frqCapture";
import {
  CheckCircle2,
  Circle,
  Smartphone,
  Loader2,
  ArrowRight,
  Upload,
} from "lucide-react";

interface SectionCaptureModalProps {
  isOpen: boolean;
  testId: string;
  sectionId: string;
  questions: QuestionFrontmatter[];
  onFinalizeSection: () => void;
  isSubmitting?: boolean;
}

export const SectionCaptureModal: React.FC<SectionCaptureModalProps> = ({
  isOpen,
  testId,
  sectionId,
  questions,
  onFinalizeSection,
  isSubmitting = false,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadedPages, setUploadedPages] = useState<
    Record<string, { page1: boolean; page2: boolean }>
  >({});
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeTargetRef = useRef<{ questionId: string; pageNumber: number } | null>(null);

  const handwrittenQuestions = questions.filter(
    (q) => q.questionType === "FRQ_HANDWRITTEN"
  );

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    getOrCreateCaptureSession({ testId, sectionId }).then((res) => {
      if (mounted && res.success && res.sessionToken) {
        setToken(res.sessionToken);
        setLoading(false);

        // Pre-populate any sheets already uploaded for this session
        if (Array.isArray(res.submissions)) {
          const map: Record<string, { page1: boolean; page2: boolean }> = {};
          res.submissions.forEach((sub: any) => {
            if (!map[sub.questionId]) {
              map[sub.questionId] = { page1: false, page2: false };
            }
            if (sub.pageNumber === 1) map[sub.questionId].page1 = true;
            if (sub.pageNumber === 2) map[sub.questionId].page2 = true;
          });
          setUploadedPages(map);
        }
      }
    });

    return () => {
      mounted = false;
    };
  }, [isOpen, testId, sectionId]);

  // Listen to SSE events for real-time status updates across all sheets
  useEffect(() => {
    if (!token) return;

    const eventSource = new EventSource(`/api/capture/${token}/events`);

    eventSource.addEventListener("STATUS_CHANGE", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.questionId && data.pageNumber) {
          setUploadedPages((prev) => ({
            ...prev,
            [data.questionId]: {
              ...(prev[data.questionId] || { page1: false, page2: false }),
              [data.pageNumber === 1 ? "page1" : "page2"]: true,
            },
          }));
        }
      } catch (err) {
        console.error("Error parsing SSE status change:", err);
      }
    });

    return () => {
      eventSource.close();
    };
  }, [token]);

  // Handle direct file upload from desktop (PDF or Image)
  const handleDesktopFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token || !activeTargetRef.current) return;

    const { questionId, pageNumber } = activeTargetRef.current;
    const targetKey = `${questionId}_p${pageNumber}`;
    setUploadingTarget(targetKey);
    setUploadError(null);

    try {
      const presignRes = await getPresignedUploadForSession(
        token,
        file.type || "image/jpeg",
        questionId,
        pageNumber
      );

      if (!presignRes.success || !presignRes.presigned) {
        throw new Error(presignRes.error || "Failed to authorize upload.");
      }

      const { url, fields, key, publicUrl } = presignRes.presigned;
      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
      formData.append("file", file);

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
        mimeType: file.type || "image/jpeg",
        fileSizeBytes: file.size,
        questionId,
        pageNumber,
      });

      if (!finalizeRes.success) {
        throw new Error(finalizeRes.error || "Failed to finalize sheet submission.");
      }

      setUploadedPages((prev) => ({
        ...prev,
        [questionId]: {
          ...(prev[questionId] || { page1: false, page2: false }),
          [pageNumber === 1 ? "page1" : "page2"]: true,
        },
      }));
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploadingTarget(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerDesktopUpload = (questionId: string, pageNumber: number) => {
    activeTargetRef.current = { questionId, pageNumber };
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  const scanUrl = token ? `${appBaseUrl.replace(/\/$/, "")}/scan/${token}` : "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 font-sans"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        className="hidden"
        onChange={handleDesktopFileSelect}
      />

      <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg shadow-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Submit Handwritten Response Sheets
          </h2>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            Section timer has ended. Scan and upload your physical response packet before finalizing scores.
          </p>
        </div>

        {uploadError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-600 dark:text-red-400 text-xs font-mono">
            {uploadError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Mobile QR Scanner Handoff */}
          <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Scan with phone to upload continuously</span>
            </div>

            <div className="bg-white p-3 rounded-md border border-neutral-200 dark:border-neutral-800 shadow-xs">
              {loading || !token ? (
                <div className="w-44 h-44 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                </div>
              ) : (
                <QRCodeSVG value={scanUrl} size={176} level="M" />
              )}
            </div>

            <p className="text-[11px] text-neutral-400 leading-tight">
              Open your phone camera, scan the QR code, and photograph each sheet in sequence.
            </p>
          </div>

          {/* Right: Required Pages Checklist with Desktop File Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Required Sheets ({handwrittenQuestions.length * 2} Pages)
              </h3>
              <span className="text-[10px] text-neutral-400 font-mono">
                Click upload icon to browse file
              </span>
            </div>

            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {handwrittenQuestions.map((q) => {
                const status = uploadedPages[q.id] || { page1: false, page2: false };
                const isUploadingP1 = uploadingTarget === `${q.id}_p1`;
                const isUploadingP2 = uploadingTarget === `${q.id}_p2`;

                return (
                  <div
                    key={q.id}
                    className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md space-y-2"
                  >
                    <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      Question {q.questionNumber}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {/* Sheet 1: Parts A & B */}
                      <div className="flex items-center justify-between px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {status.page1 ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : isUploadingP1 ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          )}
                          <span className="truncate">Sheet 1 (A & B)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerDesktopUpload(q.id, 1)}
                          title="Upload Sheet 1 from desktop"
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Sheet 2: Parts C & D */}
                      <div className="flex items-center justify-between px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {status.page2 ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : isUploadingP2 ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          )}
                          <span className="truncate">Sheet 2 (C & D)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerDesktopUpload(q.id, 2)}
                          title="Upload Sheet 2 from desktop"
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-[11px] text-neutral-400">
            You can finalize even if some pages were left blank.
          </p>

          <button
            type="button"
            onClick={onFinalizeSection}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Complete Section</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};