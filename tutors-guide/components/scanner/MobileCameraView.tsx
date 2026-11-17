// components/scanner/MobileCameraView.tsx
"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ZapOff,
  Loader2,
  ListChecks,
  ScanLine,
} from "lucide-react";
import jsQR from "jsqr";
import { calculateLaplacianVariance, checkLightingGlare } from "@/lib/cv/qualityChecks";
import { detectSheetFiducials } from "@/lib/cv/fiducials";
import {
  SectionFrqManifest,
  ManifestSheet,
  lookupSheetInManifest,
} from "@/lib/frq/manifest";
import {
  getPresignedUploadForSession,
  finalizeSubmissionUpload,
} from "@/actions/frqCapture";

export interface CaptureUploadResult {
  submissionId: string;
  questionId: string;
  questionNumber?: number;
  pageNumber: number;
  parts: string[];
}

interface MobileCameraViewProps {
  sessionToken: string;
  manifest: SectionFrqManifest | null;
  defaultQuestionId?: string;
  suggestedSheet: ManifestSheet | null;
  completedCount: number;
  onOpenChecklist?: () => void;
  onSuccess: (result: CaptureUploadResult) => void;
}

interface DecodedQrMeta {
  questionNumber: number;
  pageNumber: number;
  parts: string[];
}

const BLUR_THRESHOLD = 95.0;
const MAX_UPLOAD_DIMENSION = 2200; // ~200 DPI US Letter; keeps S3 upload <500KB & server RAM low
const REQUIRED_STEADY_FRAMES = 3; // 3 consecutive locked frames (~750ms)

function parseFooterQrText(rawText: string): DecodedQrMeta | null {
  try {
    const segments = rawText.split(";").reduce((acc, segment) => {
      const [key, val] = segment.split(":");
      if (key && val) acc[key.trim()] = val.trim();
      return acc;
    }, {} as Record<string, string>);

    if (!segments.Q) return null;

    const qNum = parseInt(segments.Q, 10);
    const pNum = parseInt(segments.PAGE || segments.PG || "1", 10);
    const parts = segments.PARTS ? segments.PARTS.split("") : [];

    if (!Number.isFinite(qNum)) return null;

    return {
      questionNumber: qNum,
      pageNumber: Number.isFinite(pNum) ? pNum : 1,
      parts,
    };
  } catch {
    return null;
  }
}

export function MobileCameraView({
  sessionToken,
  manifest,
  defaultQuestionId,
  suggestedSheet,
  completedCount,
  onOpenChecklist,
  onSuccess,
}: MobileCameraViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const analysisCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [streamActive, setStreamActive] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);

  // Live CV telemetry & hold-steady progress (0..REQUIRED_STEADY_FRAMES)
  const [fiducialsLocked, setFiducialsLocked] = useState(false);
  const [steadyFrames, setSteadyFrames] = useState<number>(0);

  // Captured image state
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedQr, setDetectedQr] = useState<DecodedQrMeta | null>(null);
  const [manualSheetOverride, setManualSheetOverride] = useState<string | null>(null);

  const steadyCountRef = useRef<number>(0);
  const isSnappingRef = useRef<boolean>(false);

  const selectedSheetKey =
    manualSheetOverride ||
    suggestedSheet?.sheetKey ||
    manifest?.sheets[0]?.sheetKey ||
    "";

  const resolvedTargetSheet = useMemo<ManifestSheet | null>(() => {
    if (!manifest) return null;
    if (selectedSheetKey) {
      const byKey = manifest.sheets.find((s) => s.sheetKey === selectedSheetKey);
      if (byKey) return byKey;
    }
    return suggestedSheet || manifest.sheets[0] || null;
  }, [manifest, selectedSheetKey, suggestedSheet]);

  // 1. Initialize rear-facing camera at high resolution
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 2560 },
            height: { ideal: 1920 },
          },
          audio: false,
        });

        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
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

  // 2. Capture downscaled 2200px still + fast 900px QR decode
  const captureStill = useCallback(() => {
    if (!videoRef.current || isSnappingRef.current) return;
    isSnappingRef.current = true;
    setIsSnapping(true);

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([35, 50, 35]);
    }

    // Yield one animation frame so the UI immediately paints the 100% / CAPTURING state
    requestAnimationFrame(() => {
      const video = videoRef.current;
      if (!video) {
        isSnappingRef.current = false;
        setIsSnapping(false);
        return;
      }

      const rawW = video.videoWidth || 1920;
      const rawH = video.videoHeight || 1080;

      const longestEdge = Math.max(rawW, rawH);
      const scale =
        longestEdge > MAX_UPLOAD_DIMENSION ? MAX_UPLOAD_DIMENSION / longestEdge : 1.0;
      const outW = Math.round(rawW * scale);
      const outH = Math.round(rawH * scale);

      const captureCanvas = document.createElement("canvas");
      captureCanvas.width = outW;
      captureCanvas.height = outH;

      const ctx = captureCanvas.getContext("2d");
      if (!ctx) {
        isSnappingRef.current = false;
        setIsSnapping(false);
        return;
      }

      ctx.drawImage(video, 0, 0, outW, outH);

      // Fast QR scan on a 900px working canvas (~12ms instead of ~350ms on full 2200px)
      let decodedMeta: DecodedQrMeta | null = null;
      try {
        const qrScale = Math.min(900 / longestEdge, 1.0);
        const qCanvasW = Math.round(outW * qrScale);
        const qCanvasH = Math.round(outH * qrScale);
        const qrCanvas = document.createElement("canvas");
        qrCanvas.width = qCanvasW;
        qrCanvas.height = qCanvasH;
        const qCtx = qrCanvas.getContext("2d", { willReadFrequently: true });

        if (qCtx) {
          qCtx.drawImage(captureCanvas, 0, 0, qCanvasW, qCanvasH);

          // Scan bottom-right quadrant first
          const subW = Math.round(qCanvasW * 0.48);
          const subH = Math.round(qCanvasH * 0.38);
          const subImg = qCtx.getImageData(qCanvasW - subW, qCanvasH - subH, subW, subH);
          const subCode = jsQR(subImg.data, subW, subH);
          if (subCode?.data) {
            decodedMeta = parseFooterQrText(subCode.data);
          }

          // Fallback to full 900px canvas if sheet was rotated
          if (!decodedMeta) {
            const fullImg = qCtx.getImageData(0, 0, qCanvasW, qCanvasH);
            const fullCode = jsQR(fullImg.data, qCanvasW, qCanvasH);
            if (fullCode?.data) {
              decodedMeta = parseFooterQrText(fullCode.data);
            }
          }
        }
      } catch (qrErr) {
        console.warn("Client QR scan warning:", qrErr);
      }

      if (decodedMeta) {
        setDetectedQr(decodedMeta);
        if (manifest) {
          const matched = lookupSheetInManifest(
            manifest,
            decodedMeta.questionNumber,
            decodedMeta.pageNumber
          );
          if (matched) {
            setManualSheetOverride(matched.sheet.sheetKey);
          }
        }
      }

      captureCanvas.toBlob(
        (blob) => {
          isSnappingRef.current = false;
          setIsSnapping(false);
          if (!blob) return;
          setCapturedBlob(blob);
          setPreviewUrl(URL.createObjectURL(blob));
        },
        "image/jpeg",
        0.9
      );
    });
  }, [manifest]);

  // 3. Real-time frame quality + 4-corner fiducial detection loop (250ms)
  const analyzeFrame = useCallback(() => {
    if (
      !videoRef.current ||
      !analysisCanvasRef.current ||
      isProcessing ||
      capturedBlob ||
      isSnappingRef.current
    ) {
      return;
    }

    const video = videoRef.current;
    const canvas = analysisCanvasRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const scale = Math.min(480 / video.videoWidth, 1.0);
    const w = Math.round(video.videoWidth * scale);
    const h = Math.round(video.videoHeight * scale);
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, w, h);
    const frameData = ctx.getImageData(0, 0, w, h);

    if (checkLightingGlare(frameData)) {
      setWarningMessage("Overhead glare detected. Tilt sheet slightly.");
      setFiducialsLocked(false);
      steadyCountRef.current = 0;
      setSteadyFrames(0);
      return;
    }

    const blurScore = calculateLaplacianVariance(frameData);
    if (blurScore < BLUR_THRESHOLD) {
      setWarningMessage("Hold steady — focusing on handwriting...");
      setFiducialsLocked(false);
      steadyCountRef.current = 0;
      setSteadyFrames(0);
      return;
    }

    const rgba = frameData.data;
    const gray = new Uint8Array(w * h);
    for (let i = 0, p = 0; i < rgba.length; i += 4, p++) {
      gray[p] = (0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2]) | 0;
    }

    const detected = detectSheetFiducials(gray, w, h);
    if (!detected) {
      setWarningMessage("Align all 4 black corner squares inside the frame.");
      setFiducialsLocked(false);
      steadyCountRef.current = 0;
      setSteadyFrames(0);
      return;
    }

    setWarningMessage(null);
    setFiducialsLocked(true);

    steadyCountRef.current += 1;
    const clampedSteady = Math.min(steadyCountRef.current, REQUIRED_STEADY_FRAMES);
    setSteadyFrames(clampedSteady);

    if (steadyCountRef.current >= REQUIRED_STEADY_FRAMES) {
      captureStill();
    }
  }, [isProcessing, capturedBlob, captureStill]);

  useEffect(() => {
    if (!streamActive || capturedBlob) return;
    const interval = setInterval(analyzeFrame, 250);
    return () => clearInterval(interval);
  }, [streamActive, capturedBlob, analyzeFrame]);

  // 4. Upload captured sheet to S3/R2 and trigger server homography cropper
  const handleUpload = async () => {
    if (!capturedBlob) return;
    setIsProcessing(true);
    setWarningMessage(null);

    const targetQuestionId =
      resolvedTargetSheet?.questionId ||
      defaultQuestionId ||
      manifest?.questions[0]?.questionId;
    const targetPageNumber =
      resolvedTargetSheet?.pageNumber || detectedQr?.pageNumber || 1;
    const targetQuestionNumber =
      resolvedTargetSheet?.questionNumber || detectedQr?.questionNumber;
    const targetParts = resolvedTargetSheet
      ? resolvedTargetSheet.parts.map((p) => p.label)
      : detectedQr?.parts || (targetPageNumber === 2 ? ["C", "D"] : ["A", "B"]);

    try {
      const presignRes = await getPresignedUploadForSession(
        sessionToken,
        "image/jpeg",
        targetQuestionId,
        targetPageNumber
      );

      if (!presignRes.success || !presignRes.presigned) {
        throw new Error(presignRes.error || "Failed to authorize upload");
      }

      const { url, fields, key, publicUrl } = presignRes.presigned;

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

      const finalizeRes = await finalizeSubmissionUpload({
        sessionToken,
        storageKey: key,
        publicUrl,
        mimeType: "image/jpeg",
        fileSizeBytes: capturedBlob.size,
        questionId: targetQuestionId,
        pageNumber: targetPageNumber,
      });

      if (!finalizeRes.success || !finalizeRes.submission) {
        throw new Error(finalizeRes.error || "Failed to commit record in database");
      }

      onSuccess({
        submissionId: finalizeRes.submission.id,
        questionId: finalizeRes.submission.questionId,
        questionNumber: targetQuestionNumber,
        pageNumber: targetPageNumber,
        parts: targetParts,
      });
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
    isSnappingRef.current = false;
    setIsSnapping(false);
    setCapturedBlob(null);
    setDetectedQr(null);
    setManualSheetOverride(null);
    setPreviewUrl(null);
    setFiducialsLocked(false);
    steadyCountRef.current = 0;
    setSteadyFrames(0);
    setIsProcessing(false);
    setWarningMessage(null);
  };

  const steadyPercent = Math.min(
    100,
    Math.round((steadyFrames / REQUIRED_STEADY_FRAMES) * 100)
  );

  return (
    <div className="relative w-full h-screen bg-black flex flex-col justify-between overflow-hidden select-none">
      <canvas ref={analysisCanvasRef} className="hidden" />

      {/* Top Telemetry & Checklist Trigger */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/85 to-transparent">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              fiducialsLocked ? "bg-emerald-400 animate-ping" : "bg-amber-400"
            }`}
          />
          <span className="text-xs font-mono font-semibold tracking-wide text-zinc-100 truncate">
            {resolvedTargetSheet
              ? `TARGET: Q${resolvedTargetSheet.questionNumber} SHEET ${resolvedTargetSheet.pageNumber} (${resolvedTargetSheet.parts
                  .map((p) => p.label)
                  .join("&")})`
              : "OPTICAL SHEET SCANNER"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenChecklist && manifest && (
            <button
              type="button"
              onClick={onOpenChecklist}
              className="px-2.5 py-1 rounded-full bg-zinc-800/90 border border-zinc-700 text-[11px] font-semibold text-zinc-200 flex items-center gap-1.5 cursor-pointer"
            >
              <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {completedCount}/{manifest.totalSheets}
              </span>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-400">
            <ZapOff className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Live Video Stream or Captured Preview */}
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

        {/* Live Viewfinder Guide */}
        {!previewUrl && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
            <div
              className={`relative w-full max-w-sm aspect-[215.9/279.4] border-2 rounded-xl transition-all duration-150 ${
                fiducialsLocked
                  ? "border-emerald-400 shadow-[0_0_28px_rgba(52,211,153,0.45)]"
                  : "border-white/40"
              }`}
            >
              <div
                className={`absolute -top-1.5 -left-1.5 w-7 h-7 border-t-4 border-l-4 rounded-tl-md ${
                  fiducialsLocked ? "border-emerald-400" : "border-white"
                }`}
              />
              <div
                className={`absolute -top-1.5 -right-1.5 w-7 h-7 border-t-4 border-r-4 rounded-tr-md ${
                  fiducialsLocked ? "border-emerald-400" : "border-white"
                }`}
              />
              <div
                className={`absolute -bottom-1.5 -left-1.5 w-7 h-7 border-b-4 border-l-4 rounded-bl-md ${
                  fiducialsLocked ? "border-emerald-400" : "border-white"
                }`}
              />
              <div
                className={`absolute -bottom-1.5 -right-1.5 w-7 h-7 border-b-4 border-r-4 rounded-br-md ${
                  fiducialsLocked ? "border-emerald-400" : "border-white"
                }`}
              />

              <div className="absolute top-[50%] inset-x-4 border-b border-dashed border-white/30 flex justify-end">
                <span className="text-[9px] font-mono text-white/60 tracking-wider pr-1">
                  PART DIVIDER
                </span>
              </div>

              {/* Hold-Steady Progress Pill with Filling Dots + Bar */}
              {(fiducialsLocked || isSnapping) && (
                <div className="absolute bottom-3 inset-x-3 flex justify-center">
                  <div className="bg-black/85 backdrop-blur-md border border-emerald-400/50 rounded-xl px-3.5 py-2 shadow-lg space-y-1.5 w-full max-w-[240px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold tracking-wide text-emerald-300 flex items-center gap-1.5">
                        {isSnapping ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                            <span>PROCESSING CAPTURE...</span>
                          </>
                        ) : (
                          <>
                            <ScanLine className="w-3 h-3 shrink-0" />
                            <span>HOLD STEADY</span>
                          </>
                        )}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: REQUIRED_STEADY_FRAMES }, (_, idx) => {
                          const isFilled = idx < steadyFrames || isSnapping;
                          return (
                            <span
                              key={idx}
                              className={`w-2 h-2 rounded-full transition-all duration-150 ${
                                isFilled
                                  ? "bg-emerald-400 scale-110 shadow-[0_0_6px_rgba(52,211,153,0.9)]"
                                  : "bg-zinc-600"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-150 ease-out"
                        style={{ width: `${isSnapping ? 100 : steadyPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Real-time CV Feedback Banner */}
        {warningMessage && !previewUrl && (
          <div className="absolute top-16 inset-x-4 z-30 flex items-center gap-2 p-3 bg-zinc-900/90 backdrop-blur-md border border-amber-500/40 rounded-xl text-amber-200 text-xs shadow-lg">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{warningMessage}</span>
          </div>
        )}
      </div>

      {/* Bottom Controls + Sheet Assignment Confirmation */}
      <div className="relative z-20 p-5 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center gap-3">
        {previewUrl ? (
          <div className="w-full max-w-sm space-y-3">
            {manifest && manifest.sheets.length > 0 && (
              <div className="bg-zinc-900/95 border border-zinc-700 rounded-xl p-2.5 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-zinc-400 shrink-0 pl-1">
                  {detectedQr ? "QR Verified:" : "Assign Sheet:"}
                </span>
                <select
                  value={selectedSheetKey}
                  onChange={(e) => setManualSheetOverride(e.target.value)}
                  disabled={isProcessing}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                >
                  {manifest.sheets.map((s) => (
                    <option key={s.sheetKey} value={s.sheetKey}>
                      Q{s.questionNumber} • Sheet {s.pageNumber} (Parts{" "}
                      {s.parts.map((p) => p.label).join(" & ")})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {warningMessage && (
              <div className="p-2.5 bg-red-950/80 border border-red-500/40 rounded-lg text-red-200 text-xs">
                {warningMessage}
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
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
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Sheet
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={captureStill}
              disabled={isSnapping}
              className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 bg-white/20 active:scale-95 transition-transform cursor-pointer disabled:opacity-60"
              aria-label="Capture still frame"
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Camera className="w-6 h-6 text-black" />
              </div>
            </button>
            <span className="text-[11px] text-zinc-400 font-medium">
              {isSnapping
                ? "Processing capture..."
                : fiducialsLocked
                ? `Hold steady (${steadyFrames}/${REQUIRED_STEADY_FRAMES})...`
                : "Frame all 4 corner squares or tap shutter"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}