// lib/frq/inkCheck.ts
import sharp from "sharp";

export interface InkDensityResult {
  isBlank: boolean;
  inkRatio: number;
  darkPixelCount: number;
  sampledPixelCount: number;
}

/**
 * Deterministically checks whether a rectified sub-part crop contains student handwriting.
 * Insets 16px on all sides to exclude response-box borders, and uses luminance < 165 so
 * faint 10% dot-grid markers (RGB 235,235,235) are completely ignored.
 */
export async function analyzeCropInkDensity(
  cropJpegBuffer: Buffer
): Promise<InkDensityResult> {
  const { data, info } = await sharp(cropJpegBuffer)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const inset = 16;
  const x0 = Math.min(inset, Math.floor(width * 0.1));
  const x1 = Math.max(x0 + 1, width - inset);
  const y0 = Math.min(inset, Math.floor(height * 0.1));
  const y1 = Math.max(y0 + 1, height - inset);

  let darkPixels = 0;
  let totalPixels = 0;

  for (let y = y0; y < y1; y++) {
    const rowOffset = y * width;
    for (let x = x0; x < x1; x++) {
      totalPixels++;
      // Pencil/pen ink sits well below luminance 165; dot grid sits around ~230-240
      if (data[rowOffset + x] < 165) {
        darkPixels++;
      }
    }
  }

  const inkRatio = totalPixels > 0 ? darkPixels / totalPixels : 0;

  // Less than 0.35% dark interior pixels indicates an unattempted / blank response box
  return {
    isBlank: inkRatio < 0.0035,
    inkRatio,
    darkPixelCount: darkPixels,
    sampledPixelCount: totalPixels,
  };
}