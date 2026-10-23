// lib/frq/cropper.ts
import sharp from "sharp";
import jsQR from "jsqr";
import { prisma } from "@/lib/prisma";
import { s3Client } from "@/lib/storage/s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { FrqSubmissionStatus, Prisma } from "@prisma/client";
import { Readable } from "stream";
import { evaluateFrqSubCropMock } from "./mockEvaluator";

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET || process.env.R2_BUCKET_NAME || "";

export interface ParsedQrMetadata {
  examCode: string;
  questionNumber: number;
  pageNumber: number;
  parts: [string, string];
}

/**
 * Parses the QR verification string embedded in the LaTeX footer:
 * Example: "EXAM:AB_2026;Q:1;PG:4;PARTS:AB" or "EXAM:AB_2026;Q:1;PAGE:1;PARTS:AB"
 */
export function parseSheetQrCode(rawText: string): ParsedQrMetadata | null {
  try {
    const segments = rawText.split(";").reduce((acc, segment) => {
      const [key, val] = segment.split(":");
      if (key && val) acc[key.trim()] = val.trim();
      return acc;
    }, {} as Record<string, string>);

    if (!segments.EXAM || !segments.Q || !segments.PARTS) {
      return null;
    }

    const subParts = segments.PARTS.split("");
    const parsedPage = parseInt(segments.PAGE || segments.PG || "1", 10);

    return {
      examCode: segments.EXAM,
      questionNumber: parseInt(segments.Q, 10),
      pageNumber: parsedPage > 2 ? (parsedPage % 2 === 0 ? 1 : 2) : parsedPage,
      parts: [subParts[0] || "A", subParts[1] || "B"],
    };
  } catch (e) {
    console.error("[FRQ Cropper] Failed to parse sheet QR data:", e);
    return null;
  }
}

/**
 * Scans the bottom-right quad of the page to find and decode the verification QR code.
 */
async function extractFooterQrCode(
  imageBuffer: Buffer,
  width: number,
  height: number
): Promise<ParsedQrMetadata | null> {
  try {
    const qrRegion = await sharp(imageBuffer)
      .extract({
        left: Math.round(width * 0.65),
        top: Math.round(height * 0.8),
        width: Math.round(width * 0.35),
        height: Math.round(height * 0.2),
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
    console.warn("[FRQ Cropper] QR code detection warning:", err);
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

async function uploadCropToStorage(storageKey: string, buffer: Buffer): Promise<string> {
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
    include: { crops: true },
  });

  if (!submission || !submission.storageKey) {
    throw new Error(`Submission ${submissionId} not found or missing storage key.`);
  }

  if (submission.crops.length > 0 && submission.status === FrqSubmissionStatus.CROPPED) {
    return submission.crops;
  }

  // 1. Download original full sheet
  const originalBuffer = await getBufferFromStorage(submission.storageKey);
  const metadata = await sharp(originalBuffer).metadata();
  const width = metadata.width || 2480;
  const height = metadata.height || 3508;

  // 2. Scan verification QR code for parts (e.g. ['A', 'B'] or ['C', 'D'])
  const qrData = await extractFooterQrCode(originalBuffer, width, height);

  const partLabels = qrData?.parts || (submission.pageNumber === 2 ? ["C", "D"] : ["A", "B"]);
  const detectedExamCode = qrData?.examCode || "AB_2026";
  const detectedQuestion = qrData?.questionNumber || 1;
  const sheetPageNumber = qrData?.pageNumber || submission.pageNumber || 1;

  // 3. Coordinate mapping from APCalculusABFRQPDF.tex
  const leftX = Math.round(width * (20 / 215.9));
  const boxWidth = Math.round(width * (175 / 215.9));

  const part1Top = Math.round(height * (40 / 279.4));
  const part1Height = Math.round(height * ((139 - 40) / 279.4));

  const part2Top = Math.round(height * (139 / 279.4));
  const part2Height = Math.round(height * ((239 - 139) / 279.4));

  // 4. Generate Sharp crop buffers
  const [part1Buffer, part2Buffer] = await Promise.all([
    sharp(originalBuffer)
      .extract({ left: leftX, top: part1Top, width: boxWidth, height: part1Height })
      .jpeg({ quality: 92 })
      .toBuffer(),
    sharp(originalBuffer)
      .extract({ left: leftX, top: part2Top, width: boxWidth, height: part2Height })
      .jpeg({ quality: 92 })
      .toBuffer(),
  ]);

  // 5. Upload crops to cloud storage
  const baseKey = `crops/${submission.testId}/${submission.questionId}/${submission.id}`;
  const keyPart1 = `${baseKey}_part_${partLabels[0]}.jpg`;
  const keyPart2 = `${baseKey}_part_${partLabels[1]}.jpg`;

  const [urlPart1, urlPart2] = await Promise.all([
    uploadCropToStorage(keyPart1, part1Buffer),
    uploadCropToStorage(keyPart2, part2Buffer),
  ]);

  // 6. Persist records and update submission state inside a transaction
  const crops = await prisma.$transaction(async (tx) => {
    await tx.frqSubCrop.deleteMany({
      where: { frqSubmissionId: submission.id },
    });

    const crop1 = await tx.frqSubCrop.create({
      data: {
        frqSubmissionId: submission.id,
        subPartLabel: partLabels[0],
        cropUrl: urlPart1,
        storageKey: keyPart1,
        pointsPossible: 1.0,
        bbox: {
          x: leftX / width,
          y: part1Top / height,
          w: boxWidth / width,
          h: part1Height / height,
        } as Prisma.InputJsonValue,
      },
    });

    const crop2 = await tx.frqSubCrop.create({
      data: {
        frqSubmissionId: submission.id,
        subPartLabel: partLabels[1],
        cropUrl: urlPart2,
        storageKey: keyPart2,
        pointsPossible: 1.0,
        bbox: {
          x: leftX / width,
          y: part2Top / height,
          w: boxWidth / width,
          h: part2Height / height,
        } as Prisma.InputJsonValue,
      },
    });

    await tx.frqSubmission.update({
      where: { id: submission.id },
      data: {
        status: FrqSubmissionStatus.CROPPED,
        pageNumber: sheetPageNumber,
        detectedExamCode,
        detectedQuestion,
      },
    });

    return [crop1, crop2];
  });

  // 7. Dispatch asynchronous mock evaluation pass for each crop
  crops.forEach((c) => {
    evaluateFrqSubCropMock(c.id).catch((err) =>
      console.error(`[Mock Evaluator] Evaluation pass failed for crop ${c.id}:`, err)
    );
  });

  return crops;
}