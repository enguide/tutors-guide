// lib/cv/homography.ts
import { Point2D } from "@/lib/frq/geometry";

/**
 * 3x3 Projective Homography Matrix stored in row-major order (9 floats).
 * Maps destination canonical point (u, v) -> source image point (x, y).
 */
export type HomographyMatrix = [
  number, number, number,
  number, number, number,
  number, number, number
];

/**
 * Solves the 8-DOF projective homography H such that:
 *   [x_i, y_i, 1]^T ~ H * [u_i, v_i, 1]^T
 * for 4 corresponding point pairs (canonical -> source), enabling fast inverse-mapping
 * during image warping without holes.
 */
export function computeProjectiveHomography(
  canonicalPts: [Point2D, Point2D, Point2D, Point2D],
  sourcePts: [Point2D, Point2D, Point2D, Point2D]
): HomographyMatrix | null {
  // Build 8x9 augmented linear system A * h = b (where h_8 = 1)
  const A: number[][] = [];

  for (let i = 0; i < 4; i++) {
    const u = canonicalPts[i].x;
    const v = canonicalPts[i].y;
    const x = sourcePts[i].x;
    const y = sourcePts[i].y;

    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x, x]);
    A.push([0, 0, 0, u, v, 1, -u * y, -v * y, y]);
  }

  // Gaussian elimination with partial pivoting
  const n = 8;
  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    let maxVal = Math.abs(A[col][col]);
    for (let row = col + 1; row < n; row++) {
      const absVal = Math.abs(A[row][col]);
      if (absVal > maxVal) {
        maxVal = absVal;
        pivotRow = row;
      }
    }

    if (maxVal < 1e-10) {
      return null; // Degenerate / collinear points
    }

    if (pivotRow !== col) {
      const tmp = A[col];
      A[col] = A[pivotRow];
      A[pivotRow] = tmp;
    }

    const pivot = A[col][col];
    for (let j = col; j <= n; j++) {
      A[col][j] /= pivot;
    }

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = A[row][col];
      if (factor === 0) continue;
      for (let j = col; j <= n; j++) {
        A[row][j] -= factor * A[col][j];
      }
    }
  }

  return [
    A[0][8], A[1][8], A[2][8],
    A[3][8], A[4][8], A[5][8],
    A[6][8], A[7][8], 1.0,
  ];
}

/**
 * Applies projective homography H to map a canonical destination coordinate (u, v)
 * to source image coordinates (x, y).
 */
export function applyHomography(H: HomographyMatrix, u: number, v: number): Point2D {
  const denom = H[6] * u + H[7] * v + H[8];
  if (Math.abs(denom) < 1e-10) {
    return { x: 0, y: 0 };
  }
  return {
    x: (H[0] * u + H[1] * v + H[2]) / denom,
    y: (H[3] * u + H[4] * v + H[5]) / denom,
  };
}

/**
 * Warps an RGB (3-channel) source pixel buffer onto a canonical destination RGB buffer
 * using bilinear interpolation for crisp handwritten strokes and QR module edges.
 */
export function warpRgbBufferBilinear(params: {
  srcData: Uint8Array | Buffer;
  srcWidth: number;
  srcHeight: number;
  dstWidth: number;
  dstHeight: number;
  H: HomographyMatrix;
  fillColor?: [number, number, number];
}): Buffer {
  const {
    srcData,
    srcWidth,
    srcHeight,
    dstWidth,
    dstHeight,
    H,
    fillColor = [255, 255, 255],
  } = params;

  const dstBuffer = Buffer.allocUnsafe(dstWidth * dstHeight * 3);
  const maxSrcX = srcWidth - 1;
  const maxSrcY = srcHeight - 1;

  const h0 = H[0], h1 = H[1], h2 = H[2];
  const h3 = H[3], h4 = H[4], h5 = H[5];
  const h6 = H[6], h7 = H[7], h8 = H[8];

  let dstOffset = 0;

  for (let v = 0; v < dstHeight; v++) {
    // Precompute row terms for projective transform
    const rowX = h1 * v + h2;
    const rowY = h4 * v + h5;
    const rowW = h7 * v + h8;

    for (let u = 0; u < dstWidth; u++) {
      const w = h6 * u + rowW;
      const invW = 1.0 / w;
      const sx = (h0 * u + rowX) * invW;
      const sy = (h3 * u + rowY) * invW;

      if (sx < 0 || sy < 0 || sx >= maxSrcX || sy >= maxSrcY) {
        dstBuffer[dstOffset] = fillColor[0];
        dstBuffer[dstOffset + 1] = fillColor[1];
        dstBuffer[dstOffset + 2] = fillColor[2];
        dstOffset += 3;
        continue;
      }

      const x0 = sx | 0;
      const y0 = sy | 0;
      const dx = sx - x0;
      const dy = sy - y0;
      const invDx = 1.0 - dx;
      const invDy = 1.0 - dy;

      const w00 = invDx * invDy;
      const w10 = dx * invDy;
      const w01 = invDx * dy;
      const w11 = dx * dy;

      const idx00 = (y0 * srcWidth + x0) * 3;
      const idx10 = idx00 + 3;
      const idx01 = idx00 + srcWidth * 3;
      const idx11 = idx01 + 3;

      dstBuffer[dstOffset] =
        (srcData[idx00] * w00 +
          srcData[idx10] * w10 +
          srcData[idx01] * w01 +
          srcData[idx11] * w11 +
          0.5) |
        0;
      dstBuffer[dstOffset + 1] =
        (srcData[idx00 + 1] * w00 +
          srcData[idx10 + 1] * w10 +
          srcData[idx01 + 1] * w01 +
          srcData[idx11 + 1] * w11 +
          0.5) |
        0;
      dstBuffer[dstOffset + 2] =
        (srcData[idx00 + 2] * w00 +
          srcData[idx10 + 2] * w10 +
          srcData[idx01 + 2] * w01 +
          srcData[idx11 + 2] * w11 +
          0.5) |
        0;

      dstOffset += 3;
    }
  }

  return dstBuffer;
}