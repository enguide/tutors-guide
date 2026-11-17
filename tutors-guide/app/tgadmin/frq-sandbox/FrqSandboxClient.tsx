// app/tgadmin/frq-sandbox/FrqSandboxClient.tsx
"use client";

import React, { useState } from "react";
import { QuestionFrontmatter } from "@/types/content";
import { SectionCaptureModal } from "@/components/exam/SectionCaptureModal";
import { useCaptureSync } from "@/hooks/useCaptureSync";
import { QrCode, ExternalLink, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";

interface FrqSandboxClientProps {
  testId: string;
  sectionId: string;
  questions: QuestionFrontmatter[];
}

export function FrqSandboxClient({
  testId,
  sectionId,
  questions,
}: FrqSandboxClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [finalizedBanner, setFinalizedBanner] = useState(false);

  const {
    token,
    submissions,
    refreshSession,
  } = useCaptureSync({
    testId,
    sectionId,
    enabled: true,
  });

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono text-zinc-400">
            Active Token: <span className="text-zinc-200">{token ?? "Initializing..."}</span>
          </div>
          <p className="text-xs text-zinc-500">
            Open the capture modal to display the QR code, or inspect live cropped artifacts below.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refreshSession}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFinalizedBanner(false);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Open QR Capture Modal</span>
          </button>
        </div>
      </div>

      {finalizedBanner && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
          <span>
            Modal finalized! In a real exam, this triggers <code>completeTestSection</code>.
            Inspect your processed crops below or check <code>/tgadmin/frq-audit</code>.
          </span>
          <a
            href="/tgadmin/frq-audit"
            className="underline font-bold hover:text-emerald-200 shrink-0 ml-4"
          >
            Open Audit Queue →
          </a>
        </div>
      )}

      {/* Live Processed Submissions & Crop Inspector */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
          Processed Submissions & Cropped Sub-Parts ({submissions.length})
        </h2>

        {submissions.length === 0 ? (
          <div className="p-10 text-center bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-500">
            No sheets uploaded yet. Click <strong>Open QR Capture Modal</strong> and scan a sheet with your phone (or upload an image directly).
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <div>
                    <div className="text-sm font-bold text-white">
                      {sub.questionId} • Sheet {sub.pageNumber}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                      Status: {sub.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {sub.fullSheetUrl && (
                      <a
                        href={sub.fullSheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Raw
                      </a>
                    )}
                    {sub.deskewedSheetUrl && (
                      <a
                        href={sub.deskewedSheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Rectified
                      </a>
                    )}
                  </div>
                </div>

                {sub.processingError && (
                  <div className="p-2.5 bg-red-950/50 border border-red-500/30 rounded text-xs text-red-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    <span>{sub.processingError}</span>
                  </div>
                )}

                {sub.crops.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {sub.crops.map((crop) => (
                      <div
                        key={crop.id}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Part {crop.subPartLabel}
                          </span>
                          <a
                            href={crop.cropUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-400 hover:text-white"
                          >
                            Full ↗
                          </a>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={crop.cropUrl}
                          alt={`Part ${crop.subPartLabel}`}
                          className="w-full h-32 object-contain bg-black rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reuses the exact production SectionCaptureModal */}
      <SectionCaptureModal
        isOpen={isModalOpen}
        testId={testId}
        sectionId={sectionId}
        questions={questions}
        onFinalizeSection={() => {
          setIsModalOpen(false);
          setFinalizedBanner(true);
        }}
      />
    </div>
  );
}