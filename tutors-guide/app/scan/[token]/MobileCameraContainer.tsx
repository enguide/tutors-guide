// app/scan/[token]/MobileCameraContainer.tsx
"use client";

import React, { useState } from "react";
import { MobileCameraView } from "@/components/scanner/MobileCameraView";
import { CheckCircle2, Clock, Smartphone, Plus } from "lucide-react";
import { CaptureSessionStatus } from "@prisma/client";

interface MobileCameraContainerProps {
  sessionToken: string;
  questionId?: string;
  isExpired: boolean;
  initialStatus: CaptureSessionStatus;
}

export function MobileCameraContainer({
  sessionToken,
  isExpired,
}: MobileCameraContainerProps) {
  const [uploadedCount, setUploadedCount] = useState(0);
  const [isCapturingNext, setIsCapturingNext] = useState(true);

  if (isExpired) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-6 text-center text-zinc-100">
        <Clock className="w-12 h-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold">Session Expired</h2>
        <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
          This QR code session has expired. Please refresh the exam screen on your computer to generate a new QR code.
        </p>
      </div>
    );
  }

  // Interstitial screen after each successful sheet upload
  if (!isCapturingNext && uploadedCount > 0) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-6 text-center text-zinc-100 bg-zinc-950 select-none">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Sheet {uploadedCount} Uploaded!</h2>
        <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
          Your page was verified and synchronized with your computer.
        </p>

        <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={() => setIsCapturingNext(true)}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Scan Next Sheet</span>
          </button>
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
      onSuccess={() => {
        setUploadedCount((prev) => prev + 1);
        setIsCapturingNext(false);
      }}
    />
  );
}