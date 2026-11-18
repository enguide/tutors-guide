// lib/frq/code128.ts

// Standard ISO/IEC 15417 Code-128 bar/space module widths (indices 0..106)
const CODE128_PATTERNS: readonly string[] = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112",
];

const PATTERN_TO_CODE = new Map<string, number>();
CODE128_PATTERNS.forEach((pat, idx) => {
  PATTERN_TO_CODE.set(pat, idx);
});

const START_CODE_B = 104;
const START_CODE_C = 105;
const STOP_CODE = 106;

export interface Point2DLike {
  x: number;
  y: number;
}

function quantizeSixRuns(runs: number[]): string | null {
  let total = 0;
  for (let i = 0; i < 6; i++) total += runs[i];
  if (total <= 0) return null;

  const moduleWidth = total / 11;
  let pattern = "";
  let sumModules = 0;

  for (let i = 0; i < 6; i++) {
    const m = Math.round(runs[i] / moduleWidth);
    if (m < 1 || m > 4) return null;
    sumModules += m;
    pattern += String(m);
  }

  return sumModules === 11 ? pattern : null;
}

function tryDecodeRunLengths(runs: number[], isBar: boolean[]): string | null {
  for (let startIdx = 0; startIdx <= runs.length - 19; startIdx++) {
    if (!isBar[startIdx]) continue;

    const startPat = quantizeSixRuns(runs.slice(startIdx, startIdx + 6));
    const isCodeB = startPat === CODE128_PATTERNS[START_CODE_B];
    const isCodeC = startPat === CODE128_PATTERNS[START_CODE_C];
    if (!isCodeB && !isCodeC) continue;

    const startCodeVal = isCodeC ? START_CODE_C : START_CODE_B;
    const codes: number[] = [];
    let cursor = startIdx + 6;
    let foundStop = false;

    while (cursor + 6 <= runs.length) {
      // Check Stop symbol (7 elements, 13 modules)
      if (cursor + 7 <= runs.length) {
        const stopSlice = runs.slice(cursor, cursor + 7);
        const stopTotal = stopSlice.reduce((a, b) => a + b, 0);
        const mW = stopTotal / 13;
        if (mW > 0) {
          const stopPat = stopSlice.map((r) => Math.round(r / mW)).join("");
          if (stopPat === CODE128_PATTERNS[STOP_CODE]) {
            foundStop = true;
            break;
          }
        }
      }

      const pat = quantizeSixRuns(runs.slice(cursor, cursor + 6));
      if (!pat) break;

      const codeVal = PATTERN_TO_CODE.get(pat);
      if (codeVal === undefined || codeVal >= 103) break;

      codes.push(codeVal);
      cursor += 6;
    }

    if (!foundStop || codes.length < 2) continue;

    // Verify Modulo-103 checksum
    const checkDigit = codes[codes.length - 1];
    const dataCodes = codes.slice(0, -1);

    let checksum = startCodeVal;
    for (let i = 0; i < dataCodes.length; i++) {
      checksum += dataCodes[i] * (i + 1);
    }
    if (checksum % 103 !== checkDigit) continue;

    if (isCodeC) {
      // Each symbol 0..99 represents a 2-digit decimal pair "00".."99"
      let decoded = "";
      for (const c of dataCodes) {
        if (c >= 0 && c <= 99) {
          decoded += String(c).padStart(2, "0");
        }
      }
      if (decoded.length > 0) return decoded;
    } else {
      // Code-128B values (0..94) -> ASCII (32..126)
      let decoded = "";
      for (const c of dataCodes) {
        if (c >= 0 && c <= 94) {
          decoded += String.fromCharCode(c + 32);
        }
      }
      if (decoded.length > 0) return decoded;
    }
  }

  return null;
}

/**
 * Scans multiple horizontal rows across a grayscale image buffer (1 channel, width * height)
 * to decode a 1D Code-128C or Code-128B barcode (supports both 0-degree and 180-degree orientations).
 */
export function decodeCode128FromGrayscale(
  gray: Uint8Array,
  width: number,
  height: number,
  sampleRows = 18
): string | null {
  if (width < 80 || height < 4) return null;

  const stepY = Math.max(1, Math.floor(height / (sampleRows + 1)));

  for (let r = 1; r <= sampleRows; r++) {
    const y = Math.min(height - 1, r * stepY);
    const rowOffset = y * width;

    // Adaptive local row threshold using min/max luminance
    let minVal = 255;
    let maxVal = 0;
    for (let x = 0; x < width; x++) {
      const v = gray[rowOffset + x];
      if (v < minVal) minVal = v;
      if (v > maxVal) maxVal = v;
    }

    if (maxVal - minVal < 45) continue; // Low-contrast blank row
    const threshold = Math.round((minVal + maxVal) * 0.52);

    const runs: number[] = [];
    const isBar: boolean[] = [];

    let currentIsBar = gray[rowOffset] < threshold;
    let runLen = 1;

    for (let x = 1; x < width; x++) {
      const pxIsBar = gray[rowOffset + x] < threshold;
      if (pxIsBar === currentIsBar) {
        runLen++;
      } else {
        runs.push(runLen);
        isBar.push(currentIsBar);
        currentIsBar = pxIsBar;
        runLen = 1;
      }
    }
    runs.push(runLen);
    isBar.push(currentIsBar);

    const forward = tryDecodeRunLengths(runs, isBar);
    if (forward) return forward;

    const backward = tryDecodeRunLengths([...runs].reverse(), [...isBar].reverse());
    if (backward) return backward;
  }

  return null;
}

/**
 * Samples oversampled scanlines directly along the vector between detected BL and BR fiducials
 * (with slight downward/upward perpendicular offsets to cover the centered bottom-margin barcode).
 * Immune to page distance, zoom level, uneven lighting, and in-plane rotation on mobile cameras.
 */
export function decodeCode128BetweenBottomFiducials(
  gray: Uint8Array,
  width: number,
  height: number,
  bl: Point2DLike,
  br: Point2DLike,
  tl: Point2DLike
): string | null {
  const dx = br.x - bl.x;
  const dy = br.y - bl.y;
  const spanLen = Math.hypot(dx, dy);
  if (spanLen < 120) return null;

  // Unit downward vector perpendicular to bottom edge (using TL -> BL direction)
  const downX = bl.x - tl.x;
  const downY = bl.y - tl.y;
  const downLen = Math.hypot(downX, downY) || 1;
  const vx = downX / downLen;
  const vy = downY / downLen;

  // Oversample at 2.0x pixel density across the BL->BR span so every bar gets 10+ samples
  const numSamples = Math.min(1800, Math.round(spanLen * 2.0));
  const offsets = [-0.032, -0.024, -0.016, -0.008, 0.0, 0.008, 0.016, 0.024];

  for (const relOffset of offsets) {
    const shiftX = vx * (relOffset * downLen);
    const shiftY = vy * (relOffset * downLen);

    const line = new Uint8Array(numSamples);
    for (let i = 0; i < numSamples; i++) {
      const t = i / (numSamples - 1);
      const sx = Math.round(bl.x + dx * t + shiftX);
      const sy = Math.round(bl.y + dy * t + shiftY);
      if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
        line[i] = gray[sy * width + sx];
      } else {
        line[i] = 255;
      }
    }

    // Local sliding-window adaptive threshold (radius 48 samples) to handle uneven lighting/glare
    const radius = 48;
    const prefix = new Int32Array(numSamples + 1);
    for (let i = 0; i < numSamples; i++) {
      prefix[i + 1] = prefix[i] + line[i];
    }

    const runs: number[] = [];
    const isBar: boolean[] = [];
    let currentIsBar = false;
    let runLen = 0;

    for (let i = 0; i < numSamples; i++) {
      const lo = Math.max(0, i - radius);
      const hi = Math.min(numSamples, i + radius + 1);
      const localMean = (prefix[hi] - prefix[lo]) / (hi - lo);
      const pxIsBar = line[i] < localMean - 14;

      if (i === 0) {
        currentIsBar = pxIsBar;
        runLen = 1;
      } else if (pxIsBar === currentIsBar) {
        runLen++;
      } else {
        runs.push(runLen);
        isBar.push(currentIsBar);
        currentIsBar = pxIsBar;
        runLen = 1;
      }
    }
    runs.push(runLen);
    isBar.push(currentIsBar);

    const forward = tryDecodeRunLengths(runs, isBar);
    if (forward) return forward;

    const backward = tryDecodeRunLengths([...runs].reverse(), [...isBar].reverse());
    if (backward) return backward;
  }

  return null;
}