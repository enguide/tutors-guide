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

const AUTO_CLOSE_SECONDS = 4;

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

  const initialUploadedCount = useMemo(() => {
    const keys = new Set<string>();
    for (const sub of initialSubmissions) {
      if (
        sub.status !== FrqSubmissionStatus.NEEDS_RETAKE &&
        sub.status !== FrqSubmissionStatus.FAILED
      ) {
        keys.add(`${sub.sectionId}::${sub.questionId}::p${sub.pageNumber}`);
      }
    }
    return keys.size;
  }, [initialSubmissions]);

  const [mode, setMode] = useState<"camera" | "checklist" | "complete">(() =>
    manifest && initialUploadedCount >= manifest.totalSheets ? "complete" : "camera"
  );
  const [closeCountdown, setCloseCountdown] = useState<number>(AUTO_CLOSE_SECONDS);

  const [uploadToast, setUploadToast] = useState<{
    id: string;
    questionNumber?: number;
    pageNumber: number;
    parts: string[];
  } | null>(null);

  const [explicitTargetSheet, setExplicitTargetSheet] =
    useState<ManifestSheet | null>(null);
  const [allowReplaceExplicit, setAllowReplaceExplicit] = useState(false);

  useEffect(() => {
    if (!uploadToast) return;
    const timer = setTimeout(() => setUploadToast(null), 3000);
    return () => clearTimeout(timer);
  }, [uploadToast]);

  // Countdown & automatic tab close once all sheets are submitted
  useEffect(() => {
    if (mode !== "complete" || closeCountdown <= 0) return;

    const timer = setTimeout(() => {
      const next = closeCountdown - 1;
      setCloseCountdown(next);
      if (next <= 0) {
        try {
          window.close();
        } catch {
          // Browsers that block script window.close() keep showing the static "Safe to close" message
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [mode, closeCountdown]);

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

  // Final Auto-Closing Completion Screen (no accidental rescan triggers)
  if (mode === "complete") {
    return (
      <div className="w-full h-dvh flex flex-col items-center justify-center p-6 text-center text-zinc-100 bg-zinc-950 select-none">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/30 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h2 className="text-xl font-bold text-white">
          All {manifest?.totalSheets ?? completedSheetCount} Sheets Submitted!
        </h2>

        <div className="mt-4 p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 max-w-xs space-y-2">
          <div className="flex items-center justify-center gap-2 text-emerald-300 font-semibold text-sm">
            <MonitorCheck className="w-4 h-4 shrink-0" />
            <span>Return to Your Computer</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your handwritten responses are synced to your exam. Click{" "}
            <span className="font-semibold text-zinc-200">Complete & View Results</span> on your desktop screen to finish.
          </p>
        </div>

        <div className="mt-6 text-xs font-mono text-zinc-400">
          {closeCountdown <= 0
            ? "You may now close this window or lock your phone."
            : `Closing window in ${closeCountdown}s...`}
        </div>
      </div>
    );
  }

  // Mid-Session Checklist Drawer (opened by tapping the top Q1–Q6 dot tracker)
  if (mode === "checklist" && manifest) {
    return (
      <div className="w-full h-dvh flex flex-col bg-zinc-950 text-zinc-100 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] select-none">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold">Response Packet Progress</h2>
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
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Back to Camera</span>
          </button>
        </div>

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
          <span>Scan pages in any order — auto-matched via barcode</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-black">
      {/* Non-blocking Confirmation Toast over Live Camera */}
      {uploadToast && (
        <div className="absolute top-14 inset-x-4 z-40 pointer-events-none flex justify-center">
          <div className="bg-emerald-950/95 backdrop-blur-md border border-emerald-400/50 text-emerald-100 px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2.5 max-w-sm w-full">
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
        onOpenChecklist={manifest && !allComplete ? () => setMode("checklist") : undefined}
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

          // Once all sheets are submitted, show the clean auto-closing confirmation screen
          if (manifest && nextKeys.size >= manifest.totalSheets) {
            setUploadToast(null);
            setCloseCountdown(AUTO_CLOSE_SECONDS);
            setMode("complete");
            return;
          }

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