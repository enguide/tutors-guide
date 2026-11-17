// lib/cv/fiducials.ts
import { Point2D } from "@/lib/frq/geometry";

export interface DetectedFiducials {
  TL: Point2D;
  TR: Point2D;
  BL: Point2D;
  BR: Point2D;
  confidence: number;
  rotationAppliedDegrees: 0 | 90 | 180 | 270;
}

interface BlobCandidate {
  cx: number;
  cy: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  area: number;
  fillRatio: number;
  internalBrightRatio: number;
}

/**
 * Detects the 4 corner registration fiducials (8mm x 8mm squares, with Top-Left L-cutout)
 * on a grayscale luminance buffer.
 * Designed to run in <12ms on an ~850px-wide downsampled image.
 */
export function detectSheetFiducials(
  gray: Uint8Array,
  width: number,
  height: number
): DetectedFiducials | null {
  // 1. Compute adaptive luminance threshold via Otsu's method
  const threshold = computeOtsuThreshold(gray);
  const darkCutoff = Math.min(145, Math.max(55, threshold * 0.85));

  // Binary dark mask: 1 = dark ink/fiducial, 0 = paper
  const totalPixels = width * height;
  const mask = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    mask[i] = gray[i] < darkCutoff ? 1 : 0;
  }

  // Expected fiducial side length is ~8mm on a ~215.9mm sheet (~3.7% of sheet width).
  // Allow generous scale range (1.6% to 7.5% of width) for varying camera distances.
  const minSide = Math.max(8, Math.round(width * 0.016));
  const maxSide = Math.round(width * 0.075);
  const minArea = minSide * minSide * 0.55;
  const maxArea = maxSide * maxSide * 1.15;

  // 2. Connected-components labeling (BFS with typed queue for zero GC churn)
  const visited = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  const candidates: BlobCandidate[] = [];

  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      const startIdx = y * width + x;
      if (mask[startIdx] === 0 || visited[startIdx] === 1) continue;

      let head = 0;
      let tail = 0;
      queue[tail++] = startIdx;
      visited[startIdx] = 1;

      let sumX = 0;
      let sumY = 0;
      let area = 0;
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;

      while (head < tail) {
        const idx = queue[head++];
        const px = idx % width;
        const py = (idx / width) | 0;

        sumX += px;
        sumY += py;
        area++;
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;

        // 4-connected neighbors
        if (px > 0) {
          const n = idx - 1;
          if (mask[n] === 1 && visited[n] === 0) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
        if (px < width - 1) {
          const n = idx + 1;
          if (mask[n] === 1 && visited[n] === 0) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
        if (py > 0) {
          const n = idx - width;
          if (mask[n] === 1 && visited[n] === 0) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
        if (py < height - 1) {
          const n = idx + width;
          if (mask[n] === 1 && visited[n] === 0) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
      }

      if (area < minArea || area > maxArea) continue;

      const bw = maxX - minX + 1;
      const bh = maxY - minY + 1;
      if (bw < minSide || bw > maxSide || bh < minSide || bh > maxSide) continue;

      // Reject elongated timing ticks (4.5mm x 2.0mm -> aspect ~2.25) and lines
      const aspect = bw / bh;
      if (aspect < 0.65 || aspect > 1.52) continue;

      const bboxArea = bw * bh;
      const fillRatio = area / bboxArea;
      // Solid square has fillRatio ~0.88-1.0; Top-Left L-cutout square has fillRatio ~0.70-0.86
      if (fillRatio < 0.62 || fillRatio > 1.0) continue;

      // Measure bright pixels inside the inner 60% of the bounding box to detect the L-cutout
      const innerMinX = minX + Math.floor(bw * 0.2);
      const innerMaxX = maxX - Math.floor(bw * 0.2);
      const innerMinY = minY + Math.floor(bh * 0.2);
      const innerMaxY = maxY - Math.floor(bh * 0.2);
      let innerTotal = 0;
      let innerBright = 0;
      for (let iy = innerMinY; iy <= innerMaxY; iy++) {
        for (let ix = innerMinX; ix <= innerMaxX; ix++) {
          innerTotal++;
          if (mask[iy * width + ix] === 0) innerBright++;
        }
      }

      candidates.push({
        cx: sumX / area,
        cy: sumY / area,
        minX,
        maxX,
        minY,
        maxY,
        width: bw,
        height: bh,
        area,
        fillRatio,
        internalBrightRatio: innerTotal > 0 ? innerBright / innerTotal : 0,
      });
    }
  }

  if (candidates.length < 4) {
    return null;
  }

  // 3. Pick the best corner candidate in each of the 4 outer image quadrants
  const midX = width * 0.5;
  const midY = height * 0.5;

  const pickBestCorner = (
    filterFn: (c: BlobCandidate) => boolean,
    cornerTarget: Point2D
  ): BlobCandidate | null => {
    const matching = candidates.filter(filterFn);
    if (matching.length === 0) return null;

    // Score by proximity to the outer corner + high squareness/fill
    matching.sort((a, b) => {
      const distA = Math.hypot(a.cx - cornerTarget.x, a.cy - cornerTarget.y);
      const distB = Math.hypot(b.cx - cornerTarget.x, b.cy - cornerTarget.y);
      return distA - distB;
    });
    return matching[0];
  };

  const cTL = pickBestCorner((c) => c.cx < midX && c.cy < midY, { x: 0, y: 0 });
  const cTR = pickBestCorner((c) => c.cx >= midX && c.cy < midY, { x: width, y: 0 });
  const cBL = pickBestCorner((c) => c.cx < midX && c.cy >= midY, { x: 0, y: height });
  const cBR = pickBestCorner((c) => c.cx >= midX && c.cy >= midY, { x: width, y: height });

  if (!cTL || !cTR || !cBL || !cBR) {
    return null;
  }

  // 4. Geometric quadrilateral sanity check (opposing edges should have compatible lengths)
  const topWidth = Math.hypot(cTR.cx - cTL.cx, cTR.cy - cTL.cy);
  const bottomWidth = Math.hypot(cBR.cx - cBL.cx, cBR.cy - cBL.cy);
  const leftHeight = Math.hypot(cBL.cx - cTL.cx, cBL.cy - cTL.cy);
  const rightHeight = Math.hypot(cBR.cx - cTR.cx, cBR.cy - cTR.cy);

  if (
    topWidth < width * 0.35 ||
    bottomWidth < width * 0.35 ||
    leftHeight < height * 0.45 ||
    rightHeight < height * 0.45
  ) {
    return null;
  }

  const widthRatio = Math.min(topWidth, bottomWidth) / Math.max(topWidth, bottomWidth);
  const heightRatio = Math.min(leftHeight, rightHeight) / Math.max(leftHeight, rightHeight);
  if (widthRatio < 0.72 || heightRatio < 0.72) {
    return null;
  }

  // 5. Orientation check via Top-Left L-cutout signature (highest internalBrightRatio)
  // Ordered clockwise starting at image top-left: [cTL, cTR, cBR, cBL]
  const clockwise = [cTL, cTR, cBR, cBL];
  let lCutoutIndex = 0;
  let maxBright = clockwise[0].internalBrightRatio;
  for (let i = 1; i < 4; i++) {
    if (clockwise[i].internalBrightRatio > maxBright) {
      maxBright = clockwise[i].internalBrightRatio;
      lCutoutIndex = i;
    }
  }

  // Only rotate if the L-cutout signal is distinctly brighter than the solid squares
  const avgOtherBright =
    clockwise.reduce((sum, c, idx) => (idx === lCutoutIndex ? sum : sum + c.internalBrightRatio), 0) /
    3;
  const hasClearOrientation = maxBright > 0.08 && maxBright > avgOtherBright + 0.05;
  const shift = hasClearOrientation ? lCutoutIndex : 0;

  const oriented = [
    clockwise[shift % 4],
    clockwise[(shift + 1) % 4],
    clockwise[(shift + 2) % 4],
    clockwise[(shift + 3) % 4],
  ];

  const rotationMap: Record<number, 0 | 90 | 180 | 270> = {
    0: 0,
    1: 270,
    2: 180,
    3: 90,
  };

  return {
    TL: { x: oriented[0].cx, y: oriented[0].cy },
    TR: { x: oriented[1].cx, y: oriented[1].cy },
    BR: { x: oriented[2].cx, y: oriented[2].cy },
    BL: { x: oriented[3].cx, y: oriented[3].cy },
    confidence: Math.min(widthRatio, heightRatio),
    rotationAppliedDegrees: rotationMap[shift] ?? 0,
  };
}

function computeOtsuThreshold(gray: Uint8Array): number {
  const hist = new Int32Array(256);
  for (let i = 0; i < gray.length; i++) {
    hist[gray[i]]++;
  }

  const total = gray.length;
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];

  let sumB = 0;
  let wB = 0;
  let maxVar = 0;
  let bestThresh = 128;

  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;

    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const betweenVar = wB * wF * (mB - mF) * (mB - mF);

    if (betweenVar > maxVar) {
      maxVar = betweenVar;
      bestThresh = t;
    }
  }

  return bestThresh;
}