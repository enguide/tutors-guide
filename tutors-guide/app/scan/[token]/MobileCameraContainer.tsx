// app/scan/[token]/MobileCameraContainer.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { MobileCameraView } from "@/components/scanner/MobileCameraView";
import { SectionFrqManifest, ManifestSheet } from "@/lib/frq/manifest";
import { FrqSubmissionStatus } from "@prisma/client";
import {
  CheckCircle2,
  Clock,
  Smartphone,
  AlertTriangle,
  Circle,
  Camera,
  MonitorCheck,
} from "lucide-react";

export interface InitialMobileSubmission {
  id: string;
  sectionId: string;
  questionId: string;
  pageNumber: number;
  status: FrqSubmissionStatus;
  processingError?: string | null;
  cropLabels: string[];
}

interface MobileCameraContainerProps {
  sessionToken: string;
  defaultQuestionId?: string;
  isExpired: boolean;
  manifest: SectionFrqManifest | null;
  initialSubmissions: InitialMobileSubmission[];
}

export function MobileCameraContainer({
  sessionToken,
  defaultQuestionId,
  isExpired,
  manifest,
  initialSubmissions,
}: MobileCameraContainerProps) {
  const [submissions, setSubmissions] = useState<InitialMobileSubmission[]>(
    initialSubmissions
  );
  const [mode, setMode] = useState<"camera" | "checklist">("camera");
  const [uploadToast, setUploadToast] = useState<{
    id: string;
    questionNumber?: number;
    pageNumber: number;
    parts: string[];
  } | null>(null);

  const [explicitTargetSheet, setExplicitTargetSheet] =
    useState<ManifestSheet | null>(null);
  const [allowReplaceExplicit, setAllowReplaceExplicit] = useState(false);

  // Auto-dismiss the non-blocking confirmation toast after 3.5 seconds
  useEffect(() => {
    if (!uploadToast) return;
    const timer = setTimeout(() => setUploadToast(null), 3500);
    return () => clearTimeout(timer);
  }, [uploadToast]);

  const submissionBySheetKey = useMemo(() => {
    const map = new Map<string, InitialMobileSubmission>();
    for (const sub of submissions) {
      map.set(`${sub.sectionId}::${sub.questionId}::p${sub.pageNumber}`, sub);
    }
    return map;
  }, [submissions]);

  const uploadedSheetKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const [key, sub] of submissionBySheetKey.entries()) {
      if (
        sub.status !== FrqSubmissionStatus.NEEDS_RETAKE &&
        sub.status !== FrqSubmissionStatus.FAILED
      ) {
        keys.add(key);
      }
    }
    return keys;
  }, [submissionBySheetKey]);

  const nextRecommendedSheet = useMemo<ManifestSheet | null>(() => {
    if (explicitTargetSheet) return explicitTargetSheet;
    if (!manifest) return null;

    for (const sheet of manifest.sheets) {
      if (!uploadedSheetKeys.has(sheet.sheetKey)) {
        return sheet;
      }
    }
    return null;
  }, [explicitTargetSheet, manifest, uploadedSheetKeys]);

  const completedSheetCount = uploadedSheetKeys.size;
  const allComplete =
    manifest !== null && completedSheetCount >= manifest.totalSheets;

  if (isExpired) {
    return (
      <div className="w-full h-dvh flex flex-col items-center justify-center p-6 text-center text-zinc-100 bg-zinc-950">
        <Clock className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold">Session Expired</h2>
        <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
          This session has expired. Please refresh the exam screen on your computer to generate a new session code.
        </p>
      </div>
    );
  }

  // Checklist / Packet Progress View (also shown automatically once all sheets are captured)
  if (mode === "checklist" && manifest) {
    return (
      <div className="w-full h-dvh flex flex-col bg-zinc-950 text-zinc-100 p-5 select-none">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold">Response Packet Checklist</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {completedSheetCount} of {manifest.totalSheets} sheets captured
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setExplicitTargetSheet(null);
              setAllowReplaceExplicit(false);
              setMode("camera");
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer ${
              allComplete
                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{allComplete ? "Rescan" : "Open Camera"}</span>
          </button>
        </div>

        {allComplete && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-start gap-3">
            <MonitorCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-sm font-bold text-emerald-300">
                All {manifest.totalSheets} Sheets Uploaded & Synced!
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                You are finished using your phone. Return to your computer screen and click{" "}
                <span className="font-bold text-white">Complete & View Results</span> to finish your exam.
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
          {manifest.sheets.map((sheet) => {
            const sub = submissionBySheetKey.get(sheet.sheetKey);
            const needsRetake =
              sub?.status === FrqSubmissionStatus.NEEDS_RETAKE ||
              sub?.status === FrqSubmissionStatus.FAILED;
            const isDone = Boolean(sub) && !needsRetake;
            const partLabels = sheet.parts.map((p) => p.label).join(" & ");

            return (
              <button
                key={sheet.sheetKey}
                type="button"
                onClick={() => {
                  setExplicitTargetSheet(sheet);
                  setAllowReplaceExplicit(isDone);
                  setMode("camera");
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                  needsRetake
                    ? "bg-red-950/30 border-red-500/40"
                    : isDone
                    ? "bg-zinc-900/90 border-emerald-500/30"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {needsRetake ? (
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  ) : isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-500 shrink-0" />
                  )}

                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">
                      Question {sheet.questionNumber} • Sheet {sheet.pageNumber} (Parts {partLabels})
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                      {needsRetake
                        ? sub?.processingError || "Retake required — tap to rescan"
                        : isDone
                        ? "Synced to computer • Tap only to replace"
                        : "Ready to scan (any order)"}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-zinc-400 shrink-0">
                  {isDone ? "Replace" : "Scan"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-zinc-800 flex items-center justify-center gap-2 text-xs text-zinc-400">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>
            {allComplete
              ? "Safe to lock phone & submit on computer"
              : "Scan pages in any order — auto-matched via barcode"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-black">
      {/* Non-blocking Confirmation Toast over Live Camera */}
      {uploadToast && (
        <div className="absolute top-14 inset-x-4 z-40 pointer-events-none flex justify-center">
          <div className="bg-emerald-950/95 backdrop-blur-md border border-emerald-400/50 text-emerald-100 px-3.5 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 max-w-sm w-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                {uploadToast.questionNumber
                  ? `Q${uploadToast.questionNumber} • Sheet ${uploadToast.pageNumber} Synced`
                  : "Sheet Synced"}
                {uploadToast.parts.length > 0
                  ? ` (Parts ${uploadToast.parts.join(" & ")})`
                  : ""}
              </div>
              <div className="text-[11px] text-emerald-300">
                Ready for next sheet ({completedSheetCount}
                {manifest ? `/${manifest.totalSheets}` : ""} done)
              </div>
            </div>
          </div>
        </div>
      )}

      <MobileCameraView
        sessionToken={sessionToken}
        manifest={manifest}
        defaultQuestionId={defaultQuestionId}
        suggestedSheet={nextRecommendedSheet}
        uploadedSheetKeys={uploadedSheetKeys}
        initialAllowReplace={allowReplaceExplicit}
        completedCount={completedSheetCount}
        onOpenChecklist={manifest ? () => setMode("checklist") : undefined}
        onSuccess={(result) => {
          const nextKeys = new Set(uploadedSheetKeys);
          nextKeys.add(`${result.sectionId}::${result.questionId}::p${result.pageNumber}`);

          setSubmissions((prev) => {
            const filtered = prev.filter(
              (s) =>
                !(
                  s.sectionId === result.sectionId &&
                  s.questionId === result.questionId &&
                  s.pageNumber === result.pageNumber
                )
            );
            return [
              ...filtered,
              {
                id: result.submissionId,
                sectionId: result.sectionId,
                questionId: result.questionId,
                pageNumber: result.pageNumber,
                status: FrqSubmissionStatus.UPLOADED,
                cropLabels: result.parts,
              },
            ];
          });

          setExplicitTargetSheet(null);
          setAllowReplaceExplicit(false);

          // Automatically transition to checklist completion screen once all sheets are captured
          if (manifest && nextKeys.size >= manifest.totalSheets) {
            setUploadToast(null);
            setMode("checklist");
            return;
          }

          // Otherwise stay right on the live camera with a brief confirmation toast
          setUploadToast({
            id: result.submissionId,
            questionNumber: result.questionNumber,
            pageNumber: result.pageNumber,
            parts: result.parts,
          });
        }}
      />
    </div>
  );
}