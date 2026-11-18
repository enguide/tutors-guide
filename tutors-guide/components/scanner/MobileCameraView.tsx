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
  Lock,
} from "lucide-react";
import jsQR from "jsqr";
import { calculateLaplacianVariance, checkLightingGlare } from "@/lib/cv/qualityChecks";
import { detectSheetFiducials } from "@/lib/cv/fiducials";
import {
  DecodedSheetQr,
  SectionFrqManifest,
  ManifestSheet,
  matchQrAgainstManifest,
  parseSelfDescribingSheetQr,
} from "@/lib/frq/manifest";
import {
  getPresignedUploadForSession,
  finalizeSubmissionUpload,
} from "@/actions/frqCapture";

export interface CaptureUploadResult {
  submissionId: string;
  sectionId: string;
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
  uploadedSheetKeys: Set<string>;
  initialAllowReplace?: boolean;
  completedCount: number;
  onOpenChecklist?: () => void;
  onSuccess: (result: CaptureUploadResult) => void;
}

const BLUR_THRESHOLD = 95.0;
const MAX_UPLOAD_DIMENSION = 2200; // 200 DPI US Letter; matches canonical 1700x2200 server canvas
const ANALYSIS_INTERVAL_MS = 250;
const REQUIRED_STEADY_FRAMES = 12; // 12 * 250ms = 3.0 seconds deliberate hold-steady countdown

export function MobileCameraView({
  sessionToken,
  manifest,
  defaultQuestionId,
  suggestedSheet,
  uploadedSheetKeys,
  initialAllowReplace = false,
  completedCount,
  onOpenChecklist,
  onSuccess,
}: MobileCameraViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [streamActive, setStreamActive] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);

  // Live CV telemetry & 3-second hold-steady progress
  const [fiducialsLocked, setFiducialsLocked] = useState(false);
  const [steadyFrames, setSteadyFrames] = useState<number>(0);

  // Live QR-detected sheet during framing
  const [liveDetectedSheet, setLiveDetectedSheet] = useState<ManifestSheet | null>(null);
  const [duplicateSheetCandidate, setDuplicateSheetCandidate] =
    useState<ManifestSheet | null>(null);
  const [allowedReplaceKeys, setAllowedReplaceKeys] = useState<Set<string>>(() =>
    initialAllowReplace && suggestedSheet
      ? new Set([suggestedSheet.sheetKey])
      : new Set()
  );

  // Captured image state
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedQr, setDetectedQr] = useState<DecodedSheetQr | null>(null);
  const [verifiedQrSheet, setVerifiedQrSheet] = useState<ManifestSheet | null>(null);
  const [manualFallbackKey, setManualFallbackKey] = useState<string | null>(null);

  const steadyCountRef = useRef<number>(0);
  const isSnappingRef = useRef<boolean>(false);

  const selectedSheetKey =
    verifiedQrSheet?.sheetKey ||
    manualFallbackKey ||
    liveDetectedSheet?.sheetKey ||
    suggestedSheet?.sheetKey ||
    manifest?.sheets[0]?.sheetKey ||
    "";

  const resolvedTargetSheet = useMemo<ManifestSheet | null>(() => {
    if (verifiedQrSheet) return verifiedQrSheet;
    if (!manifest) return null;
    if (selectedSheetKey) {
      const byKey = manifest.sheets.find((s) => s.sheetKey === selectedSheetKey);
      if (byKey) return byKey;
    }
    return liveDetectedSheet || suggestedSheet || manifest.sheets[0] || null;
  }, [verifiedQrSheet, manifest, selectedSheetKey, liveDetectedSheet, suggestedSheet]);

  // 1. Initialize rear-facing camera once and keep video node mounted across retakes
  useEffect(() => {
    let isCancelled = false;

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

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
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
      isCancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // 2. Capture high-res 2200px still + 1200px full-frame QR decode
  const captureStill = useCallback(() => {
    if (!videoRef.current || isSnappingRef.current) return;
    isSnappingRef.current = true;
    setIsSnapping(true);

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([35, 50, 35]);
    }

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

      // Scan at 1200px across full frame so rotated/portrait orientations always decode
      let decodedMeta: DecodedSheetQr | null = null;
      try {
        const qrScale = Math.min(1200 / longestEdge, 1.0);
        const qCanvasW = Math.round(outW * qrScale);
        const qCanvasH = Math.round(outH * qrScale);
        const qrCanvas = document.createElement("canvas");
        qrCanvas.width = qCanvasW;
        qrCanvas.height = qCanvasH;
        const qCtx = qrCanvas.getContext("2d", { willReadFrequently: true });

        if (qCtx) {
          qCtx.drawImage(captureCanvas, 0, 0, qCanvasW, qCanvasH);
          const fullImg = qCtx.getImageData(0, 0, qCanvasW, qCanvasH);
          const fullCode = jsQR(fullImg.data, qCanvasW, qCanvasH, {
            inversionAttempts: "attemptBoth",
          });
          if (fullCode?.data) {
            decodedMeta = parseSelfDescribingSheetQr(fullCode.data);
          }
        }
      } catch (qrErr) {
        console.warn("Client QR scan warning:", qrErr);
      }

      if (decodedMeta && manifest) {
        const match = matchQrAgainstManifest(manifest, decodedMeta);
        if (match.status === "WRONG_FORM" || match.status === "NOT_IN_TEST") {
          isSnappingRef.current = false;
          setIsSnapping(false);
          setWarningMessage(
            match.status === "WRONG_FORM"
              ? `Wrong exam booklet (${match.actualForm}). Expected ${match.expectedForm}.`
              : match.reason
          );
          return;
        }

        const isAlreadyUploaded = uploadedSheetKeys.has(match.sheet.sheetKey);
        const isExplicitReplace = allowedReplaceKeys.has(match.sheet.sheetKey);
        if (isAlreadyUploaded && !isExplicitReplace) {
          isSnappingRef.current = false;
          setIsSnapping(false);
          setDuplicateSheetCandidate(match.sheet);
          setWarningMessage(
            `Q${match.sheet.questionNumber} Sheet ${match.sheet.pageNumber} is already uploaded — flip to another page.`
          );
          return;
        }

        setDetectedQr(decodedMeta);
        setVerifiedQrSheet(match.sheet);
      } else if (liveDetectedSheet) {
        setVerifiedQrSheet(liveDetectedSheet);
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
        0.92
      );
    });
  }, [manifest, uploadedSheetKeys, allowedReplaceKeys, liveDetectedSheet]);

  // 3. Real-time frame quality + fiducial-inside-guide check + live QR verification
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

    const scale = Math.min(640 / Math.max(video.videoWidth, video.videoHeight), 1.0);
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
      setWarningMessage("Align all 4 black corner squares inside the corner targets.");
      setFiducialsLocked(false);
      setDuplicateSheetCandidate(null);
      steadyCountRef.current = 0;
      setSteadyFrames(0);
      return;
    }

    // Ensure the 4 detected fiducials actually span a reasonable portion of the frame
    const spanX = Math.abs(detected.TR.x - detected.TL.x) / w;
    const spanY = Math.abs(detected.BL.y - detected.TL.y) / h;
    if (spanX < 0.35 || spanY < 0.45) {
      setWarningMessage("Move closer so the sheet fills the viewfinder guide.");
      setFiducialsLocked(false);
      steadyCountRef.current = 0;
      setSteadyFrames(0);
      return;
    }

    // Live QR scan across full 640px frame (handles both portrait and landscape sensors)
    if (manifest) {
      const qrCode = jsQR(frameData.data, w, h, {
        inversionAttempts: "dontInvert",
      });

      if (qrCode?.data) {
        const liveMeta = parseSelfDescribingSheetQr(qrCode.data);
        if (liveMeta) {
          const match = matchQrAgainstManifest(manifest, liveMeta);

          if (match.status === "WRONG_FORM" || match.status === "NOT_IN_TEST") {
            setWarningMessage(
              match.status === "WRONG_FORM"
                ? `Wrong Exam Booklet: Detected "${match.actualForm}", expected "${match.expectedForm}".`
                : match.reason
            );
            setFiducialsLocked(false);
            setDuplicateSheetCandidate(null);
            steadyCountRef.current = 0;
            setSteadyFrames(0);
            return;
          }

          setLiveDetectedSheet(match.sheet);

          const isAlreadyUploaded = uploadedSheetKeys.has(match.sheet.sheetKey);
          const isExplicitReplace = allowedReplaceKeys.has(match.sheet.sheetKey);

          if (isAlreadyUploaded && !isExplicitReplace) {
            setDuplicateSheetCandidate(match.sheet);
            setWarningMessage(
              `Q${match.sheet.questionNumber} Sheet ${match.sheet.pageNumber} is already uploaded — flip to another page.`
            );
            setFiducialsLocked(false);
            steadyCountRef.current = 0;
            setSteadyFrames(0);
            return;
          }
        }
      }
    }

    setDuplicateSheetCandidate(null);
    setWarningMessage(null);
    setFiducialsLocked(true);

    steadyCountRef.current += 1;
    const clampedSteady = Math.min(steadyCountRef.current, REQUIRED_STEADY_FRAMES);
    setSteadyFrames(clampedSteady);

    if (steadyCountRef.current >= REQUIRED_STEADY_FRAMES) {
      captureStill();
    }
  }, [
    isProcessing,
    capturedBlob,
    manifest,
    uploadedSheetKeys,
    allowedReplaceKeys,
    captureStill,
  ]);

  useEffect(() => {
    if (!streamActive || capturedBlob) return;
    const interval = setInterval(analyzeFrame, ANALYSIS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [streamActive, capturedBlob, analyzeFrame]);

  // 4. Upload captured sheet to S3/R2 and trigger server homography cropper
  const handleUpload = async () => {
    if (!capturedBlob) return;
    setIsProcessing(true);
    setWarningMessage(null);

    const targetSectionId =
      resolvedTargetSheet?.sectionId ||
      detectedQr?.sectionId ||
      manifest?.sectionId ||
      manifest?.sheets[0]?.sectionId ||
      "";
    const targetQuestionId =
      resolvedTargetSheet?.questionId ||
      detectedQr?.questionId ||
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
        targetPageNumber,
        targetSectionId
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
        sectionId: targetSectionId,
        questionId: targetQuestionId,
        pageNumber: targetPageNumber,
      });

      if (!finalizeRes.success || !finalizeRes.submission) {
        throw new Error(finalizeRes.error || "Failed to commit record in database");
      }

      onSuccess({
        submissionId: finalizeRes.submission.id,
        sectionId: finalizeRes.submission.sectionId,
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

  // Re-attaches existing MediaStream immediately on Retake without unmounting <video>
  const handleRetake = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    isSnappingRef.current = false;
    setIsSnapping(false);
    setCapturedBlob(null);
    setDetectedQr(null);
    setVerifiedQrSheet(null);
    setManualFallbackKey(null);
    setLiveDetectedSheet(null);
    setDuplicateSheetCandidate(null);
    setPreviewUrl(null);
    setFiducialsLocked(false);
    steadyCountRef.current = 0;
    setSteadyFrames(0);
    setIsProcessing(false);
    setWarningMessage(null);

    if (videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch(() => {});
    }
  };

  const steadyPercent = Math.min(
    100,
    Math.round((steadyFrames / REQUIRED_STEADY_FRAMES) * 100)
  );
  const completedSeconds = Math.min(3, Math.floor(steadyFrames / 4));
  const secondsRemainingCount = Math.max(1, 3 - completedSeconds);

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
            {liveDetectedSheet
              ? `DETECTED: Q${liveDetectedSheet.questionNumber} SHEET ${liveDetectedSheet.pageNumber} (${liveDetectedSheet.parts
                  .map((p) => p.label)
                  .join("&")})`
              : "SCAN ANY SHEET IN BOOKLET"}
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

      {/* Live Video Stream (always mounted so Retake is instant) + Captured Preview */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          className={previewUrl ? "hidden" : "w-full h-full object-contain"}
        />

        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Captured Exam Sheet"
            className="w-full h-full object-contain"
          />
        )}

        {/* Exact US Letter Proportional Viewfinder Guide */}
        {!previewUrl && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center px-4 py-14">
            <div
              className={`relative h-full max-w-full aspect-[215.9/279.4] border-2 rounded-lg transition-all duration-150 ${
                fiducialsLocked
                  ? "border-emerald-400 shadow-[0_0_28px_rgba(52,211,153,0.45)]"
                  : "border-white/45"
              }`}
            >
              {/* True Fiducial Corner Boxes matching LaTeX coordinates (15mm/215.9mm, 10mm/279.4mm) */}
              <div
                className={`absolute top-[3.6%] left-[6.9%] w-4 h-4 border-2 ${
                  fiducialsLocked ? "border-emerald-400 bg-emerald-400/20" : "border-white/80"
                }`}
              />
              <div
                className={`absolute top-[3.6%] right-[6.9%] w-4 h-4 border-2 ${
                  fiducialsLocked ? "border-emerald-400 bg-emerald-400/20" : "border-white/80"
                }`}
              />
              <div
                className={`absolute bottom-[3.6%] left-[6.9%] w-4 h-4 border-2 ${
                  fiducialsLocked ? "border-emerald-400 bg-emerald-400/20" : "border-white/80"
                }`}
              />
              <div
                className={`absolute bottom-[3.6%] right-[6.9%] w-4 h-4 border-2 ${
                  fiducialsLocked ? "border-emerald-400 bg-emerald-400/20" : "border-white/80"
                }`}
              />

              {/* Exact Part Divider Line at y = 139mm / 279.4mm (49.75%) */}
              <div className="absolute top-[49.75%] inset-x-[9.3%] border-b border-dashed border-white/45 flex justify-end">
                <span className="text-[9px] font-mono text-white/75 tracking-wider pr-1 -mt-3.5">
                  PART DIVIDER
                </span>
              </div>

              {/* Footer QR Target Box matching bottom-right QR zone */}
              <div
                className={`absolute bottom-[2.2%] right-[10.6%] w-7 h-7 border border-dashed rounded-xs flex items-center justify-center ${
                  liveDetectedSheet ? "border-emerald-400 text-emerald-300" : "border-white/40 text-white/50"
                }`}
              >
                <span className="text-[7px] font-mono">QR</span>
              </div>

              {/* 3-Second Guided Hold-Steady Countdown Pill */}
              {(fiducialsLocked || isSnapping) && (
                <div className="absolute bottom-10 inset-x-3 flex justify-center">
                  <div className="bg-black/85 backdrop-blur-md border border-emerald-400/50 rounded-xl px-3.5 py-2.5 shadow-lg space-y-2 w-full max-w-[260px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold tracking-wide text-emerald-300 flex items-center gap-1.5">
                        {isSnapping ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                            <span>CAPTURING...</span>
                          </>
                        ) : (
                          <>
                            <ScanLine className="w-3.5 h-3.5 shrink-0" />
                            <span>HOLD STEADY • {secondsRemainingCount}s</span>
                          </>
                        )}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3].map((secStep) => {
                          const isFilled =
                            steadyFrames >= secStep * 4 || isSnapping;
                          const isInProgress =
                            !isFilled && steadyFrames > (secStep - 1) * 4;
                          return (
                            <span
                              key={secStep}
                              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                                isFilled
                                  ? "bg-emerald-400 scale-110 shadow-[0_0_8px_rgba(52,211,153,0.95)]"
                                  : isInProgress
                                  ? "bg-emerald-400/50 animate-pulse"
                                  : "bg-zinc-700"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-200 ease-linear"
                        style={{ width: `${isSnapping ? 100 : steadyPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Real-time CV Feedback / Duplicate / Wrong-Form Banner */}
        {warningMessage && !previewUrl && (
          <div className="absolute top-16 inset-x-4 z-30 flex flex-col gap-2 p-3 bg-zinc-900/95 backdrop-blur-md border border-amber-500/40 rounded-xl text-amber-200 text-xs shadow-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{warningMessage}</span>
            </div>

            {duplicateSheetCandidate && (
              <button
                type="button"
                onClick={() => {
                  const key = duplicateSheetCandidate.sheetKey;
                  setAllowedReplaceKeys((prev) => new Set(prev).add(key));
                  setDuplicateSheetCandidate(null);
                  setWarningMessage(null);
                }}
                className="self-end px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-bold text-[11px] cursor-pointer"
              >
                Replace Existing Scan
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls + Locked QR Verification Badge */}
      <div className="relative z-20 p-5 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center gap-3">
        {previewUrl ? (
          <div className="w-full max-w-sm space-y-3">
            {verifiedQrSheet ? (
              <div className="bg-emerald-950/90 border border-emerald-500/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-semibold text-emerald-300 shrink-0">
                    QR Locked:
                  </span>
                  <span className="text-xs font-bold text-white truncate">
                    Q{verifiedQrSheet.questionNumber} • Sheet {verifiedQrSheet.pageNumber} (Parts{" "}
                    {verifiedQrSheet.parts.map((p) => p.label).join(" & ")})
                  </span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            ) : (
              manifest &&
              manifest.sheets.length > 0 && (
                <div className="bg-zinc-900/95 border border-amber-500/40 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-amber-300 shrink-0 pl-1">
                    QR Unclear:
                  </span>
                  <select
                    value={selectedSheetKey}
                    onChange={(e) => setManualFallbackKey(e.target.value)}
                    disabled={isProcessing}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                  >
                    {manifest.sheets.map((s) => (
                      <option key={s.sheetKey} value={s.sheetKey}>
                        Q{s.questionNumber} • Sheet {s.pageNumber} (Parts{" "}
                        {s.parts.map((p) => p.label).join(" & ")})
                      </option>
                    ))}
                  </select>
                </div>
              )
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
                ? "Capturing high-resolution sheet..."
                : fiducialsLocked
                ? `Hold steady for ${secondsRemainingCount}s...`
                : "Align the 4 black squares inside the corner targets"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}