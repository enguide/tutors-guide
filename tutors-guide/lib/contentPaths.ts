// lib/contentPaths.ts

/**
 * Resolves markdown asset paths to absolute public URLs.
 * Precedence:
 * 1. Absolute / Remote URLs returned as-is.
 * 2. manifestBasePath if provided.
 * 3. Canonical directory convention: /content/tests/[category]/[testId]/assets/[file]
 */
export function resolveTestAssetUrl(
  category: string,
  testId: string,
  src: string,
  manifestBasePath?: string
): string {
  if (!src) return "";
  if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // Strip leading relative indicators: './assets/', 'assets/', or './'
  const cleanRelative = src
    .replace(/^(\.\/|\/)?(assets\/)?/, "")
    .replace(/^\.\//, "");

  const base =
    manifestBasePath ||
    `/content/tests/${category.toLowerCase()}/${testId}/assets`;

  return `${base.replace(/\/$/, "")}/${cleanRelative}`;
}