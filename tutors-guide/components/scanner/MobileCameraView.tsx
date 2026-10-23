// components/scanner/MobileCameraView.tsx
"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Camera, CheckCircle2, AlertTriangle, RefreshCw, ZapOff, Loader2 } from "lucide-react";
import jsQR from "jsqr";
import { calculateLaplacianVariance, checkLightingGlare } from "@/lib/cv/qualityChecks";
import { getPresignedUploadForSession, finalizeSubmissionUpload } from "@/actions/frqCapture";

interface MobileCameraViewProps {
  sessionToken: string;
  onSuccess: (submissionId: string) => void;
}

interface DecodedSheetMeta {
  questionNumber: number;
  pageNumber: number;
  parts: string[];
}

const BLUR_THRESHOLD = 95.0; // Variance threshold for clean handwritten strokes

function parseClientQr(rawText: string): DecodedSheetMeta | null {
  try {
    const segments = rawText.split(";").reduce((acc, segment) => {
      const [key, val] = segment.split(":");
      if (key && val) acc[key.trim()] = val.trim();
      return acc;
    }, {} as Record<string, string>);

    if (!segments.Q) return null;

    const qNum = parseInt(segments.Q, 10);
    const pNum = parseInt(segments.PAGE || segments.PG || "1", 10);
    const parts = (segments.PARTS || "AB").split("");

    return {
      questionNumber: qNum,
      pageNumber: pNum > 2 ? (pNum % 2 === 0 ? 1 : 2) : pNum,
      parts,
    };
  } catch {
    return null;
  }
}

export function MobileCameraView({ sessionToken, onSuccess }: MobileCameraViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [streamActive, setStreamActive] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAligned, setIsAligned] = useState(false);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [detectedMeta, setDetectedMeta] = useState<DecodedSheetMeta | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Frame sampling counter stored in a ref to avoid cascading render lint errors
  const steadyCountRef = useRef<number>(0);

  // 1. Initialize rear-facing environment camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStreamActive(true);
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setWarningMessage("Unable to access rear camera. Check browser permissions.");
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 2. Capture high-resolution still from video stream and scan QR metadata
  const captureStill = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = video.videoWidth || 1920;
    fullCanvas.height = video.videoHeight || 1080;

    const ctx = fullCanvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, fullCanvas.width, fullCanvas.height);

    // Scan bottom-right region for the LaTeX footer QR code
    try {
      const qrWidth = Math.round(fullCanvas.width * 0.4);
      const qrHeight = Math.round(fullCanvas.height * 0.25);
      const qrLeft = Math.round(fullCanvas.width * 0.6);
      const qrTop = Math.round(fullCanvas.height * 0.75);

      const qrData = ctx.getImageData(qrLeft, qrTop, qrWidth, qrHeight);
      const decoded = jsQR(qrData.data, qrWidth, qrHeight);

      if (decoded && decoded.data) {
        const meta = parseClientQr(decoded.data);
        if (meta) {
          setDetectedMeta(meta);
        }
      }
    } catch (qrErr) {
      console.warn("Client QR scan exception:", qrErr);
    }

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([40, 60, 40]);
    }

    fullCanvas.toBlob(
      (blob) => {
        if (!blob) return;
        setCapturedBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.95
    );
  }, []);

  // 3. Automated frame analysis loop
  const analyzeFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isProcessing || capturedBlob) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const scale = Math.min(480 / video.videoWidth, 1.0);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const blurScore = calculateLaplacianVariance(frameData);
    const hasGlare = checkLightingGlare(frameData);

    if (hasGlare) {
      setWarningMessage("Glare detected. Tilt paper away from overhead light.");
      setIsAligned(false);
      steadyCountRef.current = 0;
      return;
    }

    if (blurScore < BLUR_THRESHOLD) {
      setWarningMessage("Image blurry. Hold steady and tap screen to focus.");
      setIsAligned(false);
      steadyCountRef.current = 0;
      return;
    }

    // Image is sharp and glare-free
    setWarningMessage(null);
    setIsAligned(true);
    steadyCountRef.current += 1;

    // Auto-snap when held steady for ~750ms (3 consecutive successful frames)
    if (steadyCountRef.current >= 3 && !capturedBlob && !isProcessing) {
      captureStill();
    }
  }, [isProcessing, capturedBlob, captureStill]);

  useEffect(() => {
    if (!streamActive || capturedBlob) return;
    const interval = setInterval(analyzeFrame, 250);
    return () => clearInterval(interval);
  }, [streamActive, capturedBlob, analyzeFrame]);

  // 4. Batch Section Upload Pipeline
  const handleUpload = async () => {
    if (!capturedBlob) return;
    setIsProcessing(true);
    setWarningMessage(null);

    const targetQNum = detectedMeta?.questionNumber || 1;
    const targetPage = detectedMeta?.pageNumber || 1;
    const fallbackQuestionId = `ap-calc-frq-q${targetQNum}`;

    try {
      // Step A: Request pre-signed POST with target question & page scope
      const presignRes = await getPresignedUploadForSession(
        sessionToken,
        "image/jpeg",
        fallbackQuestionId,
        targetPage
      );

      if (!presignRes.success || !presignRes.presigned) {
        throw new Error(presignRes.error || "Failed to authorize upload");
      }

      const { url, fields, key, publicUrl } = presignRes.presigned;

      // Step B: Post directly to cloud storage
      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
      formData.append("file", capturedBlob, "sheet.jpg");

      const uploadRes = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Direct upload to storage bucket failed");
      }

      // Step C: Commit FrqSubmission with explicit questionId and pageNumber
      const finalizeRes = await finalizeSubmissionUpload({
        sessionToken,
        storageKey: key,
        publicUrl,
        mimeType: "image/jpeg",
        fileSizeBytes: capturedBlob.size,
        questionId: fallbackQuestionId,
        pageNumber: targetPage,
      });

      if (!finalizeRes.success || !finalizeRes.submission) {
        throw new Error(finalizeRes.error || "Failed to commit record in database");
      }

      onSuccess(finalizeRes.submission.id);
    } catch (err) {
      console.error(err);
      setWarningMessage(err instanceof Error ? err.message : "Upload failed. Please retake.");
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setCapturedBlob(null);
    setDetectedMeta(null);
    setPreviewUrl(null);
    steadyCountRef.current = 0;
    setIsProcessing(false);
    setWarningMessage(null);
  };

  return (
    <div className="relative w-full h-screen bg-black flex flex-col justify-between overflow-hidden select-none">
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Telemetry Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-medium tracking-wide text-zinc-200">
            {detectedMeta
              ? `Q${detectedMeta.questionNumber} • SHEET ${detectedMeta.pageNumber} (${detectedMeta.parts.join(",")})`
              : "AP CALC OPTICAL SCANNER"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ZapOff className="w-4 h-4 text-zinc-400" />
          <span className="text-xs text-zinc-400">NO FLASH</span>
        </div>
      </div>

      {/* Active Video Feed or Captured Preview */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Captured Exam Sheet"
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Viewfinder Overlay Guide (175mm x 210mm unified box ratio: 0.833) */}
        {!previewUrl && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
            <div
              className={`relative w-full max-w-sm aspect-[175/210] border-2 rounded-2xl transition-colors duration-200 ${
                isAligned ? "border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]" : "border-zinc-500/60"
              }`}
            >
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-white" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-white" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-white" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-white" />

              <div className="absolute top-[52%] inset-x-4 border-b border-dashed border-white/40 flex justify-end">
                <span className="text-[10px] text-white/60 tracking-wider pr-1">PART BOUNDARY</span>
              </div>
            </div>
          </div>
        )}

        {warningMessage && !previewUrl && (
          <div className="absolute top-16 inset-x-4 z-30 flex items-center gap-2 p-3 bg-red-950/80 backdrop-blur-md border border-red-500/30 rounded-xl text-red-200 text-xs shadow-lg animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{warningMessage}</span>
          </div>
        )}
      </div>

      {/* Bottom Shutter Controls */}
      <div className="relative z-20 p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center gap-4">
        {previewUrl ? (
          <div className="w-full flex items-center justify-between gap-4 max-w-sm">
            <button
              type="button"
              onClick={handleRetake}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Retake
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Sheet
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={captureStill}
              className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1 bg-white/20 active:scale-95 transition-transform cursor-pointer"
              aria-label="Capture still frame"
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Camera className="w-6 h-6 text-black" />
              </div>
            </button>
            <span className="text-[11px] text-zinc-400 font-medium">
              Auto-snaps when steady & in focus
            </span>
          </div>
        )}
      </div>
    </div>
  );
}