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
  surroundBrightRatio: number;
}

/**
 * Detects the 4 corner registration fiducials (8mm x 8mm squares, with Top-Left L-cutout)
 * on a grayscale luminance buffer using white-paper surround verification and internal
 * diagonal/aspect invariants.
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

      // Reject elongated timing ticks (4.5mm x 2.0mm) and lines
      const aspect = bw / bh;
      if (aspect < 0.65 || aspect > 1.52) continue;

      const bboxArea = bw * bh;
      const fillRatio = area / bboxArea;
      // Solid square has fillRatio ~0.88-1.0; Top-Left L-cutout square has fillRatio ~0.70-0.86
      if (fillRatio < 0.62 || fillRatio > 1.0) continue;

      // White paper quiet-zone halo check:
      // Every true fiducial sits on white paper with >= 4mm clear margin on all 4 sides.
      // Rejects dark browser tabs, taskbar icons, and bezel artifacts.
      const padX = Math.max(3, Math.round(bw * 0.45));
      const padY = Math.max(3, Math.round(bh * 0.45));
      const outerMinX = Math.max(0, minX - padX);
      const outerMaxX = Math.min(width - 1, maxX + padX);
      const outerMinY = Math.max(0, minY - padY);
      const outerMaxY = Math.min(height - 1, maxY + padY);

      let ringTotal = 0;
      let ringBright = 0;
      for (let ry = outerMinY; ry <= outerMaxY; ry++) {
        for (let rx = outerMinX; rx <= outerMaxX; rx++) {
          // Skip the candidate's own inner bounding box (with 1px buffer)
          if (rx >= minX - 1 && rx <= maxX + 1 && ry >= minY - 1 && ry <= maxY + 1) {
            continue;
          }
          ringTotal++;
          if (mask[ry * width + rx] === 0) ringBright++;
        }
      }
      const surroundBrightRatio = ringTotal > 0 ? ringBright / ringTotal : 0;
      if (surroundBrightRatio < 0.72) continue;

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
        surroundBrightRatio,
      });
    }
  }

  if (candidates.length < 4) {
    return null;
  }

  // 3. Evaluate top white-surround candidates in each quadrant using internal geometry invariants
  const midX = width * 0.5;
  const midY = height * 0.5;

  const topQuadrantCandidates = (
    filterFn: (c: BlobCandidate) => boolean
  ): BlobCandidate[] =>
    candidates
      .filter(filterFn)
      .sort((a, b) => b.surroundBrightRatio * b.fillRatio - a.surroundBrightRatio * a.fillRatio)
      .slice(0, 4);

  const tlList = topQuadrantCandidates((c) => c.cx < midX && c.cy < midY);
  const trList = topQuadrantCandidates((c) => c.cx >= midX && c.cy < midY);
  const blList = topQuadrantCandidates((c) => c.cx < midX && c.cy >= midY);
  const brList = topQuadrantCandidates((c) => c.cx >= midX && c.cy >= midY);

  if (
    tlList.length === 0 ||
    trList.length === 0 ||
    blList.length === 0 ||
    brList.length === 0
  ) {
    return null;
  }

  let bestQuad: {
    cTL: BlobCandidate;
    cTR: BlobCandidate;
    cBL: BlobCandidate;
    cBR: BlobCandidate;
    score: number;
    confidence: number;
  } | null = null;

  for (const cTL of tlList) {
    for (const cTR of trList) {
      for (const cBL of blList) {
        for (const cBR of brList) {
          // A. Equal physical corner size check (all 4 targets are 8mm x 8mm)
          const areas = [cTL.area, cTR.area, cBL.area, cBR.area];
          const minA = Math.min(...areas);
          const maxA = Math.max(...areas);
          const sizeConsistency = minA / Math.max(maxA, 1);
          if (sizeConsistency < 0.45) continue;

          // B. Opposing edge parallelism / length symmetry
          const topWidth = Math.hypot(cTR.cx - cTL.cx, cTR.cy - cTL.cy);
          const bottomWidth = Math.hypot(cBR.cx - cBL.cx, cBR.cy - cBL.cy);
          const leftHeight = Math.hypot(cBL.cx - cTL.cx, cBL.cy - cTL.cy);
          const rightHeight = Math.hypot(cBR.cx - cTR.cx, cBR.cy - cTR.cy);

          if (
            topWidth < width * 0.32 ||
            bottomWidth < width * 0.32 ||
            leftHeight < height * 0.42 ||
            rightHeight < height * 0.42
          ) {
            continue;
          }

          const widthRatio =
            Math.min(topWidth, bottomWidth) / Math.max(topWidth, bottomWidth);
          const heightRatio =
            Math.min(leftHeight, rightHeight) / Math.max(leftHeight, rightHeight);
          if (widthRatio < 0.78 || heightRatio < 0.78) continue;

          // C. Internal diagonal symmetry invariant (rectanglediagonals are equal: TL<->BR == TR<->BL)
          const diag1 = Math.hypot(cBR.cx - cTL.cx, cBR.cy - cTL.cy);
          const diag2 = Math.hypot(cBL.cx - cTR.cx, cBL.cy - cTR.cy);
          const diagRatio = Math.min(diag1, diag2) / Math.max(diag1, diag2);
          if (diagRatio < 0.84) continue;

          // D. Canonical fiducial span aspect ratio check (177.9mm / 251.4mm = 0.7076)
          const avgW = (topWidth + bottomWidth) * 0.5;
          const avgH = (leftHeight + rightHeight) * 0.5;
          const spanAspect = avgW / Math.max(avgH, 1);
          if (spanAspect < 0.54 || spanAspect > 0.88) continue;

          const avgSurround =
            (cTL.surroundBrightRatio +
              cTR.surroundBrightRatio +
              cBL.surroundBrightRatio +
              cBR.surroundBrightRatio) *
            0.25;

          const confidence = Math.min(widthRatio, heightRatio, diagRatio);
          const score =
            diagRatio * 2.0 +
            widthRatio +
            heightRatio +
            sizeConsistency +
            avgSurround * 1.5;

          if (!bestQuad || score > bestQuad.score) {
            bestQuad = { cTL, cTR, cBL, cBR, score, confidence };
          }
        }
      }
    }
  }

  if (!bestQuad) {
    return null;
  }

  const { cTL, cTR, cBL, cBR, confidence } = bestQuad;

  // 4. Orientation check via Top-Left L-cutout signature (highest internalBrightRatio)
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

  const avgOtherBright =
    clockwise.reduce(
      (sum, c, idx) => (idx === lCutoutIndex ? sum : sum + c.internalBrightRatio),
      0
    ) / 3;
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
    confidence,
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