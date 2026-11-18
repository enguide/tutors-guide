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
import { detectSheetFiducials, DetectedFiducials } from "@/lib/cv/fiducials";
import {
  DecodedSheetQr,
  SectionFrqManifest,
  ManifestSheet,
  matchQrAgainstManifest,
  parseSelfDescribingSheetQr,
} from "@/lib/frq/manifest";
import { decodeCode128FromGrayscale } from "@/lib/frq/code128";
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

function evaluateFiducialGeometry(
  f: DetectedFiducials,
  frameW: number,
  frameH: number
): { valid: boolean; reason?: string } {
  const topW = Math.hypot(f.TR.x - f.TL.x, f.TR.y - f.TL.y);
  const botW = Math.hypot(f.BR.x - f.BL.x, f.BR.y - f.BL.y);
  const leftH = Math.hypot(f.BL.x - f.TL.x, f.BL.y - f.TL.y);
  const rightH = Math.hypot(f.BR.x - f.TR.x, f.BR.y - f.TR.y);

  const avgW = (topW + botW) / 2;
  const avgH = (leftH + rightH) / 2;

  if (avgW / frameW < 0.36 || avgH / frameH < 0.46) {
    return {
      valid: false,
      reason: "Move closer so the sheet fills the viewfinder guide.",
    };
  }

  const widthRatio = topW / Math.max(botW, 1);
  const heightRatio = leftH / Math.max(rightH, 1);
  if (widthRatio < 0.85 || widthRatio > 1.18 || heightRatio < 0.85 || heightRatio > 1.18) {
    return {
      valid: false,
      reason: "Hold phone parallel (flat) directly above the page.",
    };
  }

  const topAngleDeg = Math.abs((Math.atan2(f.TR.y - f.TL.y, f.TR.x - f.TL.x) * 180) / Math.PI);
  const botAngleDeg = Math.abs((Math.atan2(f.BR.y - f.BL.y, f.BR.x - f.BL.x) * 180) / Math.PI);
  if (topAngleDeg > 6.5 || botAngleDeg > 6.5) {
    return {
      valid: false,
      reason: "Level the page straight inside the guide frame.",
    };
  }

  const observedAspect = avgW / Math.max(avgH, 1);
  if (observedAspect < 0.56 || observedAspect > 0.88) {
    return {
      valid: false,
      reason: "Align all 4 black corner squares with the corner targets.",
    };
  }

  return { valid: true };
}

/**
 * Decodes the centered 1D Code-128B footer barcode (and any legacy QR codes):
 * 1. Hardware-accelerated BarcodeDetector (`code_128` + `qr_code`).
 * 2. Pure-TypeScript 1D Code-128B scanline decoder on the bottom band (1:1 native resolution).
 * 3. Full-frame jsQR fallback for legacy QR-coded sheets.
 */
async function decodeSheetFooterCode(
  source: HTMLVideoElement | HTMLCanvasElement,
  srcW: number,
  srcH: number,
  includeLegacyQrFallback = false
): Promise<DecodedSheetQr | null> {
  if (srcW <= 0 || srcH <= 0) return null;

  // 1. Native hardware-accelerated BarcodeDetector (supports code_128 + qr_code)
  if (typeof window !== "undefined" && "BarcodeDetector" in window) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const detector = new (window as any).BarcodeDetector({
        formats: ["code_128", "qr_code"],
      });
      const barcodes = await detector.detect(source);
      for (const b of barcodes) {
        if (b?.rawValue) {
          const parsed = parseSelfDescribingSheetQr(b.rawValue);
          if (parsed) return parsed;
        }
      }
    } catch {
      // Fall back to software Code-128 / jsQR decoders
    }
  }

  // 2. Software 1D Code-128B scan across the bottom 30% band at 1:1 native resolution
  const bandH = Math.min(520, Math.round(srcH * 0.3));
  const bandW = Math.min(1800, srcW);
  const bandCanvas = document.createElement("canvas");
  bandCanvas.width = bandW;
  bandCanvas.height = bandH;
  const bCtx = bandCanvas.getContext("2d", { willReadFrequently: true });
  if (bCtx) {
    bCtx.drawImage(
      source,
      0,
      srcH - bandH,
      srcW,
      bandH,
      0,
      0,
      bandW,
      bandH
    );
    const rgba = bCtx.getImageData(0, 0, bandW, bandH).data;
    const gray = new Uint8Array(bandW * bandH);
    for (let i = 0, p = 0; i < rgba.length; i += 4, p++) {
      gray[p] = (0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2]) | 0;
    }

    const code128Text = decodeCode128FromGrayscale(gray, bandW, bandH, 28);
    if (code128Text) {
      const parsed = parseSelfDescribingSheetQr(code128Text);
      if (parsed) return parsed;
    }
  }

  // 3. Optional full-frame jsQR fallback for legacy 2D QR sheets
  if (includeLegacyQrFallback) {
    const scale = Math.min(1100 / Math.max(srcW, srcH), 1.0);
    const scanW = Math.round(srcW * scale);
    const scanH = Math.round(srcH * scale);
    const scanCanvas = document.createElement("canvas");
    scanCanvas.width = scanW;
    scanCanvas.height = scanH;
    const ctx = scanCanvas.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      ctx.drawImage(source, 0, 0, scanW, scanH);
      const imgData = ctx.getImageData(0, 0, scanW, scanH);
      const code = jsQR(imgData.data, scanW, scanH, {
        inversionAttempts: "attemptBoth",
      });
      if (code?.data) {
        return parseSelfDescribingSheetQr(code.data);
      }
    }
  }

  return null;
}

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
  const [focusPulse, setFocusPulse] = useState(false);

  const [fiducialsLocked, setFiducialsLocked] = useState(false);
  const [steadyFrames, setSteadyFrames] = useState<number>(0);

  const [liveDetectedSheet, setLiveDetectedSheet] = useState<ManifestSheet | null>(null);
  const [duplicateSheetCandidate, setDuplicateSheetCandidate] =
    useState<ManifestSheet | null>(null);
  const [allowedReplaceKeys, setAllowedReplaceKeys] = useState<Set<string>>(() =>
    initialAllowReplace && suggestedSheet
      ? new Set([suggestedSheet.sheetKey])
      : new Set()
  );

  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedCode, setDetectedCode] = useState<DecodedSheetQr | null>(null);
  const [verifiedSheet, setVerifiedSheet] = useState<ManifestSheet | null>(null);
  const [manualFallbackKey, setManualFallbackKey] = useState<string | null>(null);

  const steadyCountRef = useRef<number>(0);
  const isSnappingRef = useRef<boolean>(false);
  const isAnalyzingRef = useRef<boolean>(false);
  const lockedSheetRef = useRef<ManifestSheet | null>(null);
  const prevFiducialsRef = useRef<{ f: DetectedFiducials; w: number; h: number } | null>(
    null
  );

  const selectedSheetKey =
    verifiedSheet?.sheetKey ||
    manualFallbackKey ||
    liveDetectedSheet?.sheetKey ||
    suggestedSheet?.sheetKey ||
    manifest?.sheets[0]?.sheetKey ||
    "";

  const resolvedTargetSheet = useMemo<ManifestSheet | null>(() => {
    if (verifiedSheet) return verifiedSheet;
    if (!manifest) return null;
    if (selectedSheetKey) {
      const byKey = manifest.sheets.find((s) => s.sheetKey === selectedSheetKey);
      if (byKey) return byKey;
    }
    return liveDetectedSheet || suggestedSheet || manifest.sheets[0] || null;
  }, [verifiedSheet, manifest, selectedSheetKey, liveDetectedSheet, suggestedSheet]);

  const applyContinuousFocusConstraints = useCallback(async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track || typeof track.getCapabilities !== "function") return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const caps = track.getCapabilities() as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const advanced: any[] = [];
      if (Array.isArray(caps.focusMode) && caps.focusMode.includes("continuous")) {
        advanced.push({ focusMode: "continuous" });
      }
      if (Array.isArray(caps.exposureMode) && caps.exposureMode.includes("continuous")) {
        advanced.push({ exposureMode: "continuous" });
      }
      if (advanced.length > 0) {
        await track.applyConstraints({ advanced });
      }
    } catch {
      // Ignore on unsupported browsers
    }
  }, []);

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
          await applyContinuousFocusConstraints();
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
  }, [applyContinuousFocusConstraints]);

  const handleTapToFocus = useCallback(async () => {
    if (previewUrl) return;
    setFocusPulse(true);
    setTimeout(() => setFocusPulse(false), 600);
    await applyContinuousFocusConstraints();
  }, [previewUrl, applyContinuousFocusConstraints]);

  const isSheetBlockedAsDuplicate = useCallback(
    (sheet: ManifestSheet | null): boolean => {
      if (!sheet) return false;
      return (
        uploadedSheetKeys.has(sheet.sheetKey) &&
        !allowedReplaceKeys.has(sheet.sheetKey)
      );
    },
    [uploadedSheetKeys, allowedReplaceKeys]
  );

  // 2. Burst-of-3 sharpest frame capture + 1D Code-128B verification + duplicate guard
  const captureStill = useCallback(async () => {
    if (!videoRef.current || isSnappingRef.current) return;
    isSnappingRef.current = true;
    setIsSnapping(true);

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([35, 50, 35]);
    }

    try {
      const video = videoRef.current;
      if (!video) return;

      const rawW = video.videoWidth || 1920;
      const rawH = video.videoHeight || 1080;

      const longestEdge = Math.max(rawW, rawH);
      const scale =
        longestEdge > MAX_UPLOAD_DIMENSION ? MAX_UPLOAD_DIMENSION / longestEdge : 1.0;
      const outW = Math.round(rawW * scale);
      const outH = Math.round(rawH * scale);

      let bestCanvas: HTMLCanvasElement | null = null;
      let bestSharpness = -1;

      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, 80));
        }

        const candidate = document.createElement("canvas");
        candidate.width = outW;
        candidate.height = outH;
        const cCtx = candidate.getContext("2d", { willReadFrequently: true });
        if (!cCtx) continue;

        cCtx.drawImage(video, 0, 0, outW, outH);

        const sScale = Math.min(480 / Math.max(outW, outH), 1.0);
        const sW = Math.round(outW * sScale);
        const sH = Math.round(outH * sScale);
        const sCanvas = document.createElement("canvas");
        sCanvas.width = sW;
        sCanvas.height = sH;
        const sCtx = sCanvas.getContext("2d", { willReadFrequently: true });
        if (sCtx) {
          sCtx.drawImage(candidate, 0, 0, sW, sH);
          const sharpness = calculateLaplacianVariance(sCtx.getImageData(0, 0, sW, sH));
          if (sharpness > bestSharpness) {
            bestSharpness = sharpness;
            bestCanvas = candidate;
          }
        } else if (!bestCanvas) {
          bestCanvas = candidate;
        }
      }

      if (!bestCanvas) return;

      let decodedMeta: DecodedSheetQr | null = null;
      try {
        decodedMeta = await decodeSheetFooterCode(bestCanvas, outW, outH, true);
      } catch (decodeErr) {
        console.warn("Client barcode/QR scan warning:", decodeErr);
      }

      let resolvedCandidate: ManifestSheet | null =
        lockedSheetRef.current || liveDetectedSheet;

      if (decodedMeta && manifest) {
        const match = matchQrAgainstManifest(manifest, decodedMeta);
        if (match.status === "WRONG_FORM" || match.status === "NOT_IN_TEST") {
          setWarningMessage(
            match.status === "WRONG_FORM"
              ? `Wrong exam booklet (${match.actualForm}). Expected ${match.expectedForm}.`
              : match.reason
          );
          return;
        }
        resolvedCandidate = match.sheet;
        lockedSheetRef.current = match.sheet;
        setDetectedCode(decodedMeta);
      }

      if (isSheetBlockedAsDuplicate(resolvedCandidate)) {
        setDuplicateSheetCandidate(resolvedCandidate);
        setWarningMessage(
          `Q${resolvedCandidate!.questionNumber} Sheet ${resolvedCandidate!.pageNumber} is already uploaded — flip to another page.`
        );
        return;
      }

      if (resolvedCandidate) {
        setVerifiedSheet(resolvedCandidate);
      }

      await new Promise<void>((resolve) => {
        bestCanvas!.toBlob(
          (blob) => {
            if (blob) {
              setCapturedBlob(blob);
              setPreviewUrl(URL.createObjectURL(blob));
            }
            resolve();
          },
          "image/jpeg",
          0.92
        );
      });
    } finally {
      isSnappingRef.current = false;
      setIsSnapping(false);
    }
  }, [manifest, liveDetectedSheet, isSheetBlockedAsDuplicate]);

  // 3. Real-time frame quality + geometry + sticky Code-128B duplicate guard
  const analyzeFrame = useCallback(async () => {
    if (
      !videoRef.current ||
      !analysisCanvasRef.current ||
      isProcessing ||
      capturedBlob ||
      isSnappingRef.current ||
      isAnalyzingRef.current
    ) {
      return;
    }

    const video = videoRef.current;
    const canvas = analysisCanvasRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    isAnalyzingRef.current = true;
    try {
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
        prevFiducialsRef.current = null;
        steadyCountRef.current = 0;
        setSteadyFrames(0);
        return;
      }

      const blurScore = calculateLaplacianVariance(frameData);
      if (blurScore < BLUR_THRESHOLD) {
        setWarningMessage("Hold steady — focusing on handwriting...");
        setFiducialsLocked(false);
        steadyCountRef.current = Math.max(0, steadyCountRef.current - 1);
        setSteadyFrames(steadyCountRef.current);
        return;
      }

      const rgba = frameData.data;
      const gray = new Uint8Array(w * h);
      for (let i = 0, p = 0; i < rgba.length; i += 4, p++) {
        gray[p] = (0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2]) | 0;
      }

      const detected = detectSheetFiducials(gray, w, h);
      if (!detected) {
        lockedSheetRef.current = null;
        setLiveDetectedSheet(null);
        setDuplicateSheetCandidate(null);
        setWarningMessage("Align all 4 black corner squares inside the corner targets.");
        setFiducialsLocked(false);
        prevFiducialsRef.current = null;
        steadyCountRef.current = 0;
        setSteadyFrames(0);
        return;
      }

      const geom = evaluateFiducialGeometry(detected, w, h);
      if (!geom.valid) {
        setWarningMessage(geom.reason || "Align the sheet with the guide frame.");
        setFiducialsLocked(false);
        prevFiducialsRef.current = null;
        steadyCountRef.current = 0;
        setSteadyFrames(0);
        return;
      }

      let isHandMoving = false;
      if (
        prevFiducialsRef.current &&
        prevFiducialsRef.current.w === w &&
        prevFiducialsRef.current.h === h
      ) {
        const prev = prevFiducialsRef.current.f;
        const maxShift = Math.max(
          Math.hypot(detected.TL.x - prev.TL.x, detected.TL.y - prev.TL.y),
          Math.hypot(detected.TR.x - prev.TR.x, detected.TR.y - prev.TR.y),
          Math.hypot(detected.BL.x - prev.BL.x, detected.BL.y - prev.BL.y),
          Math.hypot(detected.BR.x - prev.BR.x, detected.BR.y - prev.BR.y)
        );
        if (maxShift > w * 0.016) {
          isHandMoving = true;
        }
      }
      prevFiducialsRef.current = { f: detected, w, h };

      // Live 1D Code-128B scan directly on full-resolution video element
      if (manifest) {
        const liveMeta = await decodeSheetFooterCode(
          video,
          video.videoWidth,
          video.videoHeight,
          false
        );

        if (liveMeta) {
          const match = matchQrAgainstManifest(manifest, liveMeta);

          if (match.status === "WRONG_FORM" || match.status === "NOT_IN_TEST") {
            lockedSheetRef.current = null;
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

          lockedSheetRef.current = match.sheet;
          setLiveDetectedSheet(match.sheet);
        }
      }

      const activeSheet = lockedSheetRef.current;
      if (isSheetBlockedAsDuplicate(activeSheet)) {
        setDuplicateSheetCandidate(activeSheet);
        setWarningMessage(
          `Q${activeSheet!.questionNumber} Sheet ${activeSheet!.pageNumber} is already uploaded — flip to another page.`
        );
        setFiducialsLocked(false);
        steadyCountRef.current = 0;
        setSteadyFrames(0);
        return;
      }

      setDuplicateSheetCandidate(null);
      setFiducialsLocked(true);

      if (isHandMoving) {
        setWarningMessage("Hold phone still...");
        steadyCountRef.current = Math.max(0, steadyCountRef.current - 1);
        setSteadyFrames(steadyCountRef.current);
        return;
      }

      setWarningMessage(null);
      steadyCountRef.current += 1;
      const clampedSteady = Math.min(steadyCountRef.current, REQUIRED_STEADY_FRAMES);
      setSteadyFrames(clampedSteady);

      if (steadyCountRef.current >= REQUIRED_STEADY_FRAMES) {
        void captureStill();
      }
    } finally {
      isAnalyzingRef.current = false;
    }
  }, [
    isProcessing,
    capturedBlob,
    manifest,
    isSheetBlockedAsDuplicate,
    captureStill,
  ]);

  useEffect(() => {
    if (!streamActive || capturedBlob) return;
    const interval = setInterval(() => {
      void analyzeFrame();
    }, ANALYSIS_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [streamActive, capturedBlob, analyzeFrame]);

  const handleRetake = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    isSnappingRef.current = false;
    prevFiducialsRef.current = null;
    lockedSheetRef.current = null;
    setIsSnapping(false);
    setCapturedBlob(null);
    setDetectedCode(null);
    setVerifiedSheet(null);
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
  }, [previewUrl]);

  // 4. Upload captured sheet to S3/R2, trigger server homography cropper, and reset for next sheet
  const handleUpload = async () => {
    if (!capturedBlob) return;

    if (isSheetBlockedAsDuplicate(resolvedTargetSheet)) {
      setWarningMessage(
        `Q${resolvedTargetSheet!.questionNumber} Sheet ${resolvedTargetSheet!.pageNumber} is already uploaded.`
      );
      return;
    }

    setIsProcessing(true);
    setWarningMessage(null);

    const targetSectionId =
      resolvedTargetSheet?.sectionId ||
      detectedCode?.sectionId ||
      manifest?.sectionId ||
      manifest?.sheets[0]?.sectionId ||
      "";
    const targetQuestionId =
      resolvedTargetSheet?.questionId ||
      detectedCode?.questionId ||
      defaultQuestionId ||
      manifest?.questions[0]?.questionId;
    const targetPageNumber =
      resolvedTargetSheet?.pageNumber || detectedCode?.pageNumber || 1;
    const targetQuestionNumber =
      resolvedTargetSheet?.questionNumber || detectedCode?.questionNumber;
    const targetParts = resolvedTargetSheet
      ? resolvedTargetSheet.parts.map((p) => p.label)
      : detectedCode?.parts || (targetPageNumber === 2 ? ["C", "D"] : ["A", "B"]);

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

      // Immediately return the camera to live capture mode for the next sheet
      handleRetake();

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

      {/* Live Video Stream + Captured Preview */}
      <div
        onClick={handleTapToFocus}
        className="relative flex-1 flex items-center justify-center overflow-hidden bg-black"
      >
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

        {/* Exact US Letter (215.9mm x 279.4mm) Proportional Viewfinder Guide */}
        {!previewUrl && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div
              style={{
                width: "min(92vw, calc((100dvh - 180px) * 0.7727))",
                aspectRatio: "215.9 / 279.4",
              }}
              className={`relative border-2 rounded-md transition-all duration-150 ${
                fiducialsLocked
                  ? "border-emerald-400 shadow-[0_0_28px_rgba(52,211,153,0.45)]"
                  : focusPulse
                  ? "border-blue-400"
                  : "border-white/50"
              }`}
            >
              {/* Exact 8mm x 8mm Fiducial Target Boxes */}
              <div
                style={{ left: "6.95%", top: "3.58%", width: "3.71%", height: "2.86%" }}
                className={`absolute border-2 ${
                  fiducialsLocked
                    ? "border-emerald-400 bg-emerald-400/25"
                    : "border-white/90"
                }`}
              />
              <div
                style={{ right: "6.95%", top: "3.58%", width: "3.71%", height: "2.86%" }}
                className={`absolute border-2 ${
                  fiducialsLocked
                    ? "border-emerald-400 bg-emerald-400/25"
                    : "border-white/90"
                }`}
              />
              <div
                style={{ left: "6.95%", bottom: "3.58%", width: "3.71%", height: "2.86%" }}
                className={`absolute border-2 ${
                  fiducialsLocked
                    ? "border-emerald-400 bg-emerald-400/25"
                    : "border-white/90"
                }`}
              />
              <div
                style={{ right: "6.95%", bottom: "3.58%", width: "3.71%", height: "2.86%" }}
                className={`absolute border-2 ${
                  fiducialsLocked
                    ? "border-emerald-400 bg-emerald-400/25"
                    : "border-white/90"
                }`}
              />

              {/* Exact Part Divider Line at y = 139mm / 279.4mm (49.75%) */}
              <div
                style={{ top: "49.75%", left: "9.26%", right: "9.26%" }}
                className="absolute border-b border-dashed border-white/50 flex justify-end"
              >
                <span className="text-[9px] font-mono text-white/80 tracking-wider pr-1 -mt-3.5">
                  PART DIVIDER
                </span>
              </div>

              {/* Centered Bottom-Margin 1D Code-128B Barcode Guide */}
              <div
                style={{
                  left: "27%",
                  right: "27%",
                  bottom: "3.4%",
                  height: "3.6%",
                }}
                className={`absolute border border-dashed rounded-xs flex items-center justify-center ${
                  liveDetectedSheet
                    ? "border-emerald-400 text-emerald-300 bg-emerald-400/10"
                    : "border-white/45 text-white/60"
                }`}
              >
                <span className="text-[7px] font-mono tracking-widest">BARCODE</span>
              </div>

              {/* 3-Second Guided Hold-Steady Countdown Pill */}
              {(fiducialsLocked || isSnapping) && (
                <div className="absolute bottom-[12%] inset-x-3 flex justify-center">
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
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-16 inset-x-4 z-30 flex flex-col gap-2 p-3 bg-zinc-900/95 backdrop-blur-md border border-amber-500/40 rounded-xl text-amber-200 text-xs shadow-lg"
          >
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

      {/* Bottom Controls + Locked Barcode Verification Badge */}
      <div className="relative z-20 p-5 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center gap-3">
        {previewUrl ? (
          <div className="w-full max-w-sm space-y-3">
            {verifiedSheet ? (
              <div className="bg-emerald-950/90 border border-emerald-500/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-semibold text-emerald-300 shrink-0">
                    Sheet Locked:
                  </span>
                  <span className="text-xs font-bold text-white truncate">
                    Q{verifiedSheet.questionNumber} • Sheet {verifiedSheet.pageNumber} (Parts{" "}
                    {verifiedSheet.parts.map((p) => p.label).join(" & ")})
                  </span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            ) : (
              manifest &&
              manifest.sheets.length > 0 && (
                <div className="bg-zinc-900/95 border border-amber-500/40 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-amber-300 shrink-0 pl-1">
                    Code Unclear:
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
              onClick={() => void captureStill()}
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
                ? "Capturing sharpest frame..."
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