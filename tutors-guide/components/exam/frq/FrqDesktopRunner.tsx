// components/exam/frq/FrqDesktopRunner.tsx
"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useCaptureSync } from "@/hooks/useCaptureSync";
import { FrqManualUploadFallback } from "./FrqManualUploadFallback";
import { CheckCircle2, Smartphone, RefreshCw, Eye, FileText, ChevronDown } from "lucide-react";

interface FrqDesktopRunnerProps {
  testId: string;
  sectionId: string;
  questionId: string;
  questionNumber: number;
  onSubmissionComplete?: (submissionId: string) => void;
}

export function FrqDesktopRunner({
  testId,
  sectionId,
  questionId,
  questionNumber,
  onSubmissionComplete,
}: FrqDesktopRunnerProps) {
  const [showFallback, setShowFallback] = useState(false);

  const {
    token,
    status,
    submissionId,
    fullSheetUrl,
    crops,
    error,
    refreshSession,
  } = useCaptureSync({
    testId,
    sectionId,
    questionId,
    onUploadSuccess: (subId) => {
      onSubmissionComplete?.(subId);
    },
  });

  // New: Prioritize NEXT_PUBLIC_APP_URL so mobile devices reach the tunnel
const appBaseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

const scanUrl = token ? `${appBaseUrl.replace(/\/$/, "")}/scan/${token}` : "";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-100 shadow-xl max-w-2xl mx-auto my-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Handwritten Response
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Submit Solution for Question {questionNumber}
          </h3>
        </div>

        {status === "UPLOADED" || status === "CROPPED" ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Uploaded & Synced
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Awaiting Capture
          </span>
        )}
      </div>

      {status === "UPLOADED" || status === "CROPPED" ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Full Exam Sheet Received</p>
                <p className="text-xs text-zinc-400">Session ID: {token?.slice(0, 8)}...</p>
              </div>
            </div>

            {fullSheetUrl && (
              <a
                href={fullSheetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Scan
              </a>
            )}
          </div>

          {crops.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Identified Sub-Parts
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {crops.map((crop) => (
                  <div
                    key={crop.id}
                    className="p-3 bg-zinc-800/40 border border-zinc-700/40 rounded-lg flex items-center justify-between"
                  >
                    <span className="text-sm font-bold text-zinc-200">
                      Part {crop.subPartLabel}
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">Ready</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={refreshSession}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retake / Upload New Page
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white p-3 rounded-xl shadow-md shrink-0">
              {scanUrl ? (
                <QRCodeSVG value={scanUrl} size={156} level="M" />
              ) : (
                <div className="w-[156px] h-[156px] bg-zinc-200 animate-pulse rounded-lg" />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Smartphone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Scan with your smartphone</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    Open your camera app to launch the high-resolution capture viewer. All 4 corner
                    fiducial markers will be aligned automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Keep paper flat</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    Ensure the header box and footer QR code are completely unobstructed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <button
              type="button"
              onClick={() => setShowFallback((prev) => !prev)}
              className="text-xs text-zinc-400 hover:text-zinc-300 flex items-center justify-between w-full"
            >
              <span>Can&apos;t scan with a phone? Upload file from this computer</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFallback ? "rotate-180" : ""}`} />
            </button>

            {showFallback && token && (
              <FrqManualUploadFallback
                sessionToken={token}
                onUploaded={(subId) => onSubmissionComplete?.(subId)}
              />
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-950/40 border border-red-800/40 rounded-lg text-xs text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}