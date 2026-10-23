// lib/cv/qualityChecks.ts

/**
 * Computes the Laplacian variance of an ImageData buffer to estimate image sharpness.
 * A low variance indicates low high-frequency edge detail (motion blur or misfocus).
 */
export function calculateLaplacianVariance(imageData: ImageData): number {
  const { data, width, height } = imageData;
  
  // Step 1: Convert to grayscale array
  const gray = new Float32Array(width * height);
  for (let i = 0; i < data.length; i += 4) {
    // Standard photometric ITU-R BT.601 luminance
    gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  // Step 2: Apply standard 3x3 discrete Laplacian operator kernel:
  // [  0,  1,  0 ]
  // [  1, -4,  1 ]
  // [  0,  1,  0 ]
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y += 2) { // Step by 2 for sub-10ms mobile performance
    for (let x = 1; x < width - 1; x += 2) {
      const idx = y * width + x;
      const laplacian =
        gray[idx - width] +
        gray[idx + width] +
        gray[idx - 1] +
        gray[idx + 1] -
        4 * gray[idx];

      sum += laplacian;
      sumSq += laplacian * laplacian;
      count++;
    }
  }

  if (count === 0) return 0;
  const mean = sum / count;
  const variance = sumSq / count - mean * mean;
  return variance;
}

/**
 * Checks for high-specularity blown-out white glare from overhead lighting.
 * Returns true if more than 12% of the central surface pixels are saturated pure white (> 250).
 */
export function checkLightingGlare(imageData: ImageData): boolean {
  const { data, width, height } = imageData;
  let saturatedCount = 0;
  let sampleCount = 0;

  // Sample the inner 60% of the page
  const startX = Math.floor(width * 0.2);
  const endX = Math.floor(width * 0.8);
  const startY = Math.floor(height * 0.2);
  const endY = Math.floor(height * 0.8);

  for (let y = startY; y < endY; y += 4) {
    for (let x = startX; x < endX; x += 4) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      if (r > 248 && g > 248 && b > 248) {
        saturatedCount++;
      }
      sampleCount++;
    }
  }

  return sampleCount > 0 && saturatedCount / sampleCount > 0.12;
}