// app/scan/[token]/MobileCameraContainer.tsx
"use client";

import React, { useState, useMemo } from "react";
import { MobileCameraView } from "@/components/scanner/MobileCameraView";
import { SectionFrqManifest, ManifestSheet } from "@/lib/frq/manifest";
import { FrqSubmissionStatus } from "@prisma/client";
import {
  CheckCircle2,
  Clock,
  Smartphone,
  Plus,
  AlertTriangle,
  Circle,
  Camera,
  ListChecks,
} from "lucide-react";

export interface InitialMobileSubmission {
  id: string;
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
  const [mode, setMode] = useState<"camera" | "interstitial" | "checklist">("camera");
  const [lastUploadedSheet, setLastUploadedSheet] = useState<{
    questionNumber?: number;
    pageNumber: number;
    parts: string[];
  } | null>(null);

  // Target sheet when a student explicitly taps a row in the checklist to scan/retake
  const [explicitTargetSheet, setExplicitTargetSheet] =
    useState<ManifestSheet | null>(null);

  // Map sheetKey (`${questionId}::p${pageNumber}`) -> submission record
  const submissionBySheetKey = useMemo(() => {
    const map = new Map<string, InitialMobileSubmission>();
    for (const sub of submissions) {
      map.set(`${sub.questionId}::p${sub.pageNumber}`, sub);
    }
    return map;
  }, [submissions]);

  // Determine the next uncaptured (or NEEDS_RETAKE) sheet to guide the student
  const nextRecommendedSheet = useMemo<ManifestSheet | null>(() => {
    if (explicitTargetSheet) return explicitTargetSheet;
    if (!manifest) return null;

    for (const sheet of manifest.sheets) {
      const existing = submissionBySheetKey.get(sheet.sheetKey);
      if (
        !existing ||
        existing.status === FrqSubmissionStatus.NEEDS_RETAKE ||
        existing.status === FrqSubmissionStatus.FAILED
      ) {
        return sheet;
      }
    }
    return null;
  }, [explicitTargetSheet, manifest, submissionBySheetKey]);

  const completedSheetCount = useMemo(() => {
    if (!manifest) return submissions.length;
    return manifest.sheets.filter((s) => {
      const sub = submissionBySheetKey.get(s.sheetKey);
      return (
        sub &&
        sub.status !== FrqSubmissionStatus.NEEDS_RETAKE &&
        sub.status !== FrqSubmissionStatus.FAILED
      );
    }).length;
  }, [manifest, submissions.length, submissionBySheetKey]);

  if (isExpired) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-6 text-center text-zinc-100 bg-zinc-950">
        <Clock className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold">Session Expired</h2>
        <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
          This QR code session has expired. Please refresh the exam screen on your computer to generate a new QR code.
        </p>
      </div>
    );
  }

  // Checklist / Packet Progress View
  if (mode === "checklist" && manifest) {
    return (
      <div className="w-full h-screen flex flex-col bg-zinc-950 text-zinc-100 p-5 select-none">
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
              setMode("camera");
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Open Camera</span>
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
                        ? "Uploaded & synced to exam"
                        : "Tap to scan this sheet"}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-zinc-400 shrink-0">
                  {isDone ? "Retake" : "Scan"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-zinc-800 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Smartphone className="w-4 h-4" />
          <span>Synced in real time with your computer</span>
        </div>
      </div>
    );
  }

  // Post-Capture Interstitial Confirmation Screen
  if (mode === "interstitial") {
    const allComplete =
      manifest !== null && completedSheetCount >= manifest.totalSheets;

    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-6 text-center text-zinc-100 bg-zinc-950 select-none">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold">
          {lastUploadedSheet?.questionNumber
            ? `Q${lastUploadedSheet.questionNumber} Sheet ${lastUploadedSheet.pageNumber} Uploaded!`
            : `Sheet ${completedSheetCount} Uploaded!`}
        </h2>

        {lastUploadedSheet && lastUploadedSheet.parts.length > 0 && (
          <p className="text-xs font-mono text-emerald-400 mt-1">
            Parts {lastUploadedSheet.parts.join(" & ")} synced to your exam
          </p>
        )}

        <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
          {manifest
            ? `${completedSheetCount} of ${manifest.totalSheets} required sheets captured.`
            : "Your page was synchronized with your computer."}
        </p>

        <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
          {!allComplete && (
            <button
              type="button"
              onClick={() => {
                setExplicitTargetSheet(null);
                setMode("camera");
              }}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                {nextRecommendedSheet
                  ? `Scan Q${nextRecommendedSheet.questionNumber} Sheet ${nextRecommendedSheet.pageNumber}`
                  : "Scan Next Sheet"}
              </span>
            </button>
          )}

          {manifest && (
            <button
              type="button"
              onClick={() => setMode("checklist")}
              className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <ListChecks className="w-4 h-4" />
              <span>
                {allComplete ? "Review All Captured Sheets" : "View Sheet Checklist"}
              </span>
            </button>
          )}

          {allComplete && (
            <p className="text-xs text-emerald-400 font-medium pt-2">
              All sheets captured! You can now click &ldquo;Complete Section&rdquo; on your computer.
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs text-zinc-500">
          <Smartphone className="w-4 h-4" />
          <span>Device Connected</span>
        </div>
      </div>
    );
  }

  return (
    <MobileCameraView
      sessionToken={sessionToken}
      manifest={manifest}
      defaultQuestionId={defaultQuestionId}
      suggestedSheet={nextRecommendedSheet}
      completedCount={completedSheetCount}
      onOpenChecklist={manifest ? () => setMode("checklist") : undefined}
      onSuccess={(result) => {
        setSubmissions((prev) => {
          const filtered = prev.filter(
            (s) =>
              !(
                s.questionId === result.questionId &&
                s.pageNumber === result.pageNumber
              )
          );
          return [
            ...filtered,
            {
              id: result.submissionId,
              questionId: result.questionId,
              pageNumber: result.pageNumber,
              status: FrqSubmissionStatus.UPLOADED,
              cropLabels: result.parts,
            },
          ];
        });
        setLastUploadedSheet({
          questionNumber: result.questionNumber,
          pageNumber: result.pageNumber,
          parts: result.parts,
        });
        setExplicitTargetSheet(null);
        setMode("interstitial");
      }}
    />
  );
}