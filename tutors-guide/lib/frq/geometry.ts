// lib/frq/geometry.ts

/**
 * Physical dimensions & fiducial coordinates derived from APCalculusABFRQPDF.tex
 * Page size: US Letter (215.9mm x 279.4mm)
 */
export const SHEET_PHYSICAL_MM = {
  width: 215.9,
  height: 279.4,
} as const;

/**
 * Canonical rectified output resolution (200 DPI: 8.5" x 11" -> 1700 x 2200 px).
 * High enough for crisp calculus/physics notation, small enough for <25ms serverless processing.
 */
export const CANONICAL_SHEET_PX = {
  width: 1700,
  height: 2200,
} as const;

export interface Point2D {
  x: number;
  y: number;
}

export interface NormalizedRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Fiducial centers in millimeters from top-left (0, 0) of US Letter page:
 * - Top-Left:     (15mm, 10mm) + (4mm, 4mm)   = (19.0mm, 14.0mm) [has white L-cutout]
 * - Top-Right:    (215.9 - 23mm, 10mm) + 4mm  = (196.9mm, 14.0mm)
 * - Bottom-Left:  (15mm, 279.4 - 18mm) + 4mm  = (19.0mm, 265.4mm)
 * - Bottom-Right: (215.9 - 23mm, 279.4 - 18mm) + 4mm = (196.9mm, 265.4mm)
 */
export const FIDUCIAL_CENTERS_MM: Record<"TL" | "TR" | "BL" | "BR", Point2D> = {
  TL: { x: 19.0, y: 14.0 },
  TR: { x: 196.9, y: 14.0 },
  BL: { x: 19.0, y: 265.4 },
  BR: { x: 196.9, y: 265.4 },
};

export const FIDUCIAL_SIZE_MM = 8.0;

/**
 * Canonical fiducial center coordinates in pixels on the rectified 1700 x 2200 canvas.
 */
export const CANONICAL_FIDUCIAL_CENTERS_PX: Record<"TL" | "TR" | "BL" | "BR", Point2D> = {
  TL: mmPointToCanonicalPx(FIDUCIAL_CENTERS_MM.TL),
  TR: mmPointToCanonicalPx(FIDUCIAL_CENTERS_MM.TR),
  BL: mmPointToCanonicalPx(FIDUCIAL_CENTERS_MM.BL),
  BR: mmPointToCanonicalPx(FIDUCIAL_CENTERS_MM.BR),
};

/**
 * Response box geometry in millimeters from APCalculusABFRQPDF.tex:
 * - Outer response box: x = 20mm..195mm (width = 175mm), y = 31mm..241mm (height = 210mm)
 * - Instruction header: y = 31mm..40mm
 * - Top Sub-Part (Part A or Part C): y = 40mm..139mm (height = 99mm)
 * - Divider line: y = 139mm
 * - Bottom Sub-Part (Part B or Part D): y = 139mm..241mm (height = 102mm)
 * - Footer QR Code: bottom-right at (215.9 - 23mm, 279.4 - 8mm), 9mm x 9mm
 */
export const SHEET_REGIONS_MM = {
  responseBox: { x: 20.0, y: 31.0, w: 175.0, h: 210.0 },
  /** Top half of response box (Parts A, C, E...) — 1.5mm top inset prevents header line bleed */
  slot1Crop: { x: 20.0, y: 41.5, w: 175.0, h: 98.0 },
  /** Bottom half of response box (Parts B, D, F...) — extends full way to bottom box border at 241mm */
  slot2Crop: { x: 20.0, y: 138.5, w: 175.0, h: 102.5 },
  /** Generous search window around 18mm footer QR code (x: 161.9mm..179.9mm, y: 255.4mm..273.4mm) */
  footerQrSearch: { x: 148.0, y: 244.0, w: 48.0, h: 32.0 },
} as const;

export function mmPointToCanonicalPx(pt: Point2D): Point2D {
  return {
    x: (pt.x / SHEET_PHYSICAL_MM.width) * CANONICAL_SHEET_PX.width,
    y: (pt.y / SHEET_PHYSICAL_MM.height) * CANONICAL_SHEET_PX.height,
  };
}

export function mmRectToPixelExtract(rectMm: {
  x: number;
  y: number;
  w: number;
  h: number;
}): { left: number; top: number; width: number; height: number; normalized: NormalizedRect } {
  const left = Math.max(0, Math.round((rectMm.x / SHEET_PHYSICAL_MM.width) * CANONICAL_SHEET_PX.width));
  const top = Math.max(0, Math.round((rectMm.y / SHEET_PHYSICAL_MM.height) * CANONICAL_SHEET_PX.height));
  const width = Math.min(
    CANONICAL_SHEET_PX.width - left,
    Math.round((rectMm.w / SHEET_PHYSICAL_MM.width) * CANONICAL_SHEET_PX.width)
  );
  const height = Math.min(
    CANONICAL_SHEET_PX.height - top,
    Math.round((rectMm.h / SHEET_PHYSICAL_MM.height) * CANONICAL_SHEET_PX.height)
  );

  return {
    left,
    top,
    width,
    height,
    normalized: {
      x: left / CANONICAL_SHEET_PX.width,
      y: top / CANONICAL_SHEET_PX.height,
      w: width / CANONICAL_SHEET_PX.width,
      h: height / CANONICAL_SHEET_PX.height,
    },
  };
}