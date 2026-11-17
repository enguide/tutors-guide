// lib/frq/cropper.ts
import sharp from "sharp";
import jsQR from "jsqr";
import { prisma } from "@/lib/prisma";
import { s3Client } from "@/lib/storage/s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { FrqSubmissionStatus, Prisma } from "@prisma/client";
import { Readable } from "stream";
import {
  CANONICAL_FIDUCIAL_CENTERS_PX,
  CANONICAL_SHEET_PX,
  SHEET_REGIONS_MM,
  mmRectToPixelExtract,
} from "./geometry";
import { detectSheetFiducials } from "@/lib/cv/fiducials";
import {
  computeProjectiveHomography,
  warpRgbBufferBilinear,
} from "@/lib/cv/homography";
import {
  ManifestSheet,
  SectionFrqManifest,
  lookupSheetInManifest,
} from "./manifest";
import { evaluateFrqSubCropMock } from "./mockEvaluator";

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET || process.env.R2_BUCKET_NAME || "";

export interface ParsedQrMetadata {
  examCode: string;
  questionNumber: number;
  pageNumber: number;
  parts: string[];
}

/**
 * Parses the QR verification string embedded in the LaTeX footer:
 * Example: "EXAM:AB_2026;Q:1;PG:4;PARTS:AB"
 */
export function parseSheetQrCode(rawText: string): ParsedQrMetadata | null {
  try {
    const segments = rawText.split(";").reduce((acc, segment) => {
      const [key, val] = segment.split(":");
      if (key && val) acc[key.trim()] = val.trim();
      return acc;
    }, {} as Record<string, string>);

    if (!segments.Q) return null;

    const parsedPage = parseInt(segments.PAGE || segments.PG || "1", 10);
    const parts = segments.PARTS ? segments.PARTS.split("") : [];

    return {
      examCode: segments.EXAM || "UNKNOWN",
      questionNumber: parseInt(segments.Q, 10),
      pageNumber: Number.isFinite(parsedPage) ? parsedPage : 1,
      parts,
    };
  } catch (e) {
    console.error("[FRQ Cropper] Failed to parse sheet QR data:", e);
    return null;
  }
}

/**
 * Scans the canonical bottom-right QR region of the perspective-rectified sheet.
 */
async function extractCanonicalFooterQr(
  rectifiedRgbBuffer: Buffer
): Promise<ParsedQrMetadata | null> {
  try {
    const qrBox = mmRectToPixelExtract(SHEET_REGIONS_MM.footerQrSearch);

    const qrRegion = await sharp(rectifiedRgbBuffer, {
      raw: {
        width: CANONICAL_SHEET_PX.width,
        height: CANONICAL_SHEET_PX.height,
        channels: 3,
      },
    })
      .extract({
        left: qrBox.left,
        top: qrBox.top,
        width: qrBox.width,
        height: qrBox.height,
      })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const code = jsQR(
      new Uint8ClampedArray(qrRegion.data),
      qrRegion.info.width,
      qrRegion.info.height
    );

    if (code && code.data) {
      return parseSheetQrCode(code.data);
    }
  } catch (err) {
    console.warn("[FRQ Cropper] Canonical QR decode warning:", err);
  }
  return null;
}

async function getBufferFromStorage(storageKey: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: storageKey,
  });

  const response = await s3Client.send(command);
  const stream = response.Body as Readable;

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

async function uploadJpegToStorage(storageKey: string, buffer: Buffer): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: storageKey,
    Body: buffer,
    ContentType: "image/jpeg",
  });

  await s3Client.send(command);

  const cdnBaseUrl =
    process.env.NEXT_PUBLIC_STORAGE_CDN_URL || `https://${S3_BUCKET_NAME}.s3.amazonaws.com`;
  return `${cdnBaseUrl.replace(/\/$/, "")}/${storageKey}`;
}

export async function processAndCropFrqSubmission(submissionId: string) {
  const submission = await prisma.frqSubmission.findUnique({
    where: { id: submissionId },
    include: {
      crops: true,
      captureSession: {
        select: { manifestSnapshot: true },
      },
    },
  });

  if (!submission || !submission.storageKey) {
    throw new Error(`Submission ${submissionId} not found or missing storage key.`);
  }

  // Mark as PROCESSING so desktop UI reflects live progress
  await prisma.frqSubmission.update({
    where: { id: submission.id },
    data: {
      status: FrqSubmissionStatus.PROCESSING,
      processingError: null,
    },
  });

  try {
    // 1. Download original full sheet and auto-orient EXIF rotation
    const rawBuffer = await getBufferFromStorage(submission.storageKey);
    const orientedSharp = sharp(rawBuffer).rotate();
    const { data: srcRgb, info: srcInfo } = await orientedSharp
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const srcWidth = srcInfo.width;
    const srcHeight = srcInfo.height;

    // 2. Downsample to ~850px wide grayscale buffer for fast <12ms fiducial detection
    const detectWidth = Math.min(850, srcWidth);
    const scaleFactor = detectWidth / srcWidth;
    const detectHeight = Math.round(srcHeight * scaleFactor);

    const graySmall = await sharp(srcRgb, {
      raw: { width: srcWidth, height: srcHeight, channels: 3 },
    })
      .resize(detectWidth, detectHeight, { kernel: "lanczos2" })
      .grayscale()
      .raw()
      .toBuffer();

    const fiducials = detectSheetFiducials(
      new Uint8Array(graySmall.buffer, graySmall.byteOffset, graySmall.byteLength),
      detectWidth,
      detectHeight
    );

    if (!fiducials) {
      await prisma.frqSubmission.update({
        where: { id: submission.id },
        data: {
          status: FrqSubmissionStatus.NEEDS_RETAKE,
          processingError:
            "Could not detect all 4 corner registration squares. Ensure the entire page is visible on a flat surface.",
        },
      });
      return [];
    }

    // Scale detected fiducial centers back to full source resolution
    const invScale = 1.0 / scaleFactor;
    const srcCorners: [
      { x: number; y: number },
      { x: number; y: number },
      { x: number; y: number },
      { x: number; y: number }
    ] = [
      { x: fiducials.TL.x * invScale, y: fiducials.TL.y * invScale },
      { x: fiducials.TR.x * invScale, y: fiducials.TR.y * invScale },
      { x: fiducials.BL.x * invScale, y: fiducials.BL.y * invScale },
      { x: fiducials.BR.x * invScale, y: fiducials.BR.y * invScale },
    ];

    const dstCorners: [
      { x: number; y: number },
      { x: number; y: number },
      { x: number; y: number },
      { x: number; y: number }
    ] = [
      CANONICAL_FIDUCIAL_CENTERS_PX.TL,
      CANONICAL_FIDUCIAL_CENTERS_PX.TR,
      CANONICAL_FIDUCIAL_CENTERS_PX.BL,
      CANONICAL_FIDUCIAL_CENTERS_PX.BR,
    ];

    const H = computeProjectiveHomography(dstCorners, srcCorners);
    if (!H) {
      await prisma.frqSubmission.update({
        where: { id: submission.id },
        data: {
          status: FrqSubmissionStatus.NEEDS_RETAKE,
          processingError:
            "Page perspective was too extreme to rectify. Hold camera directly above the page and retake.",
        },
      });
      return [];
    }

    // 3. Warp full-resolution image onto canonical 1700 x 2200 (200 DPI) US Letter canvas
    const rectifiedRgb = warpRgbBufferBilinear({
      srcData: srcRgb,
      srcWidth,
      srcHeight,
      dstWidth: CANONICAL_SHEET_PX.width,
      dstHeight: CANONICAL_SHEET_PX.height,
      H,
    });

    // Save rectified full sheet for staff audit & clean review
    const deskewedJpeg = await sharp(rectifiedRgb, {
      raw: {
        width: CANONICAL_SHEET_PX.width,
        height: CANONICAL_SHEET_PX.height,
        channels: 3,
      },
    })
      .jpeg({ quality: 88 })
      .toBuffer();

    const deskewedKey = `deskewed/${submission.testId}/${submission.sectionId}/${submission.id}_rectified.jpg`;
    const deskewedSheetUrl = await uploadJpegToStorage(deskewedKey, deskewedJpeg);

    // 4. Decode footer QR from exact canonical position on the rectified sheet
    const qrData = await extractCanonicalFooterQr(rectifiedRgb);
    const manifest = submission.captureSession
      ?.manifestSnapshot as unknown as SectionFrqManifest | null;

    let resolvedQuestionId = submission.questionId;
    let resolvedPageNumber = submission.pageNumber;
    let resolvedSheet: ManifestSheet | null = null;

    if (manifest) {
      if (qrData) {
        const matched = lookupSheetInManifest(
          manifest,
          qrData.questionNumber,
          qrData.pageNumber
        );
        if (matched) {
          resolvedQuestionId = matched.question.questionId;
          resolvedPageNumber = matched.sheet.pageNumber;
          resolvedSheet = matched.sheet;
        }
      }

      if (!resolvedSheet) {
        resolvedSheet =
          manifest.sheets.find(
            (s) =>
              s.questionId === resolvedQuestionId &&
              s.pageNumber === resolvedPageNumber
          ) || null;
      }
    }

    // Determine exact sub-parts to crop (never creates phantom crops for unused slots)
    const partsToCrop = resolvedSheet
      ? resolvedSheet.parts
      : (qrData?.parts.length
          ? qrData.parts
          : resolvedPageNumber === 2
          ? ["C", "D"]
          : ["A", "B"]
        ).map((label, idx) => ({
          label,
          pointsPossible: 1.0,
          pageNumber: resolvedPageNumber,
          slotIndex: (idx % 2) as 0 | 1,
        }));

    // 5. Extract & upload each active sub-part box from rectified sheet
    const cropArtifacts = await Promise.all(
      partsToCrop.map(async (part) => {
        const regionMm =
          part.slotIndex === 0
            ? SHEET_REGIONS_MM.slot1Crop
            : SHEET_REGIONS_MM.slot2Crop;
        const rect = mmRectToPixelExtract(regionMm);

        const cropBuffer = await sharp(rectifiedRgb, {
          raw: {
            width: CANONICAL_SHEET_PX.width,
            height: CANONICAL_SHEET_PX.height,
            channels: 3,
          },
        })
          .extract({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          })
          .jpeg({ quality: 92 })
          .toBuffer();

        const cropKey = `crops/${submission.testId}/${resolvedQuestionId}/${submission.id}_part_${part.label}.jpg`;
        const cropUrl = await uploadJpegToStorage(cropKey, cropBuffer);

        return {
          subPartLabel: part.label,
          cropUrl,
          storageKey: cropKey,
          pointsPossible: part.pointsPossible,
          bbox: rect.normalized,
        };
      })
    );

    // 6. Persist crops and update submission metadata atomically
    const savedCrops = await prisma.$transaction(async (tx) => {
      // If QR corrected the questionId/pageNumber from a fallback guess, remove any duplicate row
      if (
        resolvedQuestionId !== submission.questionId ||
        resolvedPageNumber !== submission.pageNumber
      ) {
        await tx.frqSubmission.deleteMany({
          where: {
            profileId: submission.profileId,
            testId: submission.testId,
            sectionId: submission.sectionId,
            questionId: resolvedQuestionId,
            pageNumber: resolvedPageNumber,
            id: { not: submission.id },
          },
        });
      }

      await tx.frqSubCrop.deleteMany({
        where: { frqSubmissionId: submission.id },
      });

      const createdCrops = [];
      for (const artifact of cropArtifacts) {
        const crop = await tx.frqSubCrop.create({
          data: {
            frqSubmissionId: submission.id,
            subPartLabel: artifact.subPartLabel,
            cropUrl: artifact.cropUrl,
            storageKey: artifact.storageKey,
            pointsPossible: artifact.pointsPossible,
            bbox: artifact.bbox as unknown as Prisma.InputJsonValue,
          },
        });
        createdCrops.push(crop);
      }

      await tx.frqSubmission.update({
        where: { id: submission.id },
        data: {
          status: FrqSubmissionStatus.CROPPED,
          questionId: resolvedQuestionId,
          pageNumber: resolvedPageNumber,
          deskewedSheetUrl,
          detectedExamCode: qrData?.examCode ?? submission.detectedExamCode,
          detectedQuestion: qrData?.questionNumber ?? submission.detectedQuestion,
          processingError: null,
        },
      });

      return createdCrops;
    });

    // 7. Trigger downstream evaluator pass (awaited so Vercel doesn't kill it early)
    await Promise.allSettled(
      savedCrops.map((c) => evaluateFrqSubCropMock(c.id))
    );

    return savedCrops;
  } catch (err) {
    console.error("[FRQ Cropper] Processing error:", err);
    await prisma.frqSubmission.update({
      where: { id: submission.id },
      data: {
        status: FrqSubmissionStatus.FAILED,
        processingError:
          err instanceof Error ? err.message : "Unexpected image processing failure.",
      },
    });
    return [];
  }
}