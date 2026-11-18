// lib/frq/geometry.ts

export const SHEET_PHYSICAL_MM = {
  width: 215.9,
  height: 279.4,
} as const;

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

export const FIDUCIAL_CENTERS_MM: Record<"TL" | "TR" | "BL" | "BR", Point2D> = {
  TL: { x: 19.0, y: 14.0 },
  TR: { x: 196.9, y: 14.0 },
  BL: { x: 19.0, y: 265.4 },
  BR: { x: 196.9, y: 265.4 },
};

export const FIDUCIAL_SIZE_MM = 8.0;

export const CANONICAL_FIDUCIAL_CENTERS_PX: Record<"TL" | "TR" | "BL" | "BR", Point2D> = {
  TL: mmPointToCanonicalPx(FIDUCIAL_CENTERS_MM.TL),
  TR: mmPointToCanonicalPx(FIDUCIAL_CENTERS_MM.TR),
  BL: mmPointToCanonicalPx(FIDUCIAL_CENTERS_MM.BL),
  BR: mmPointToCanonicalPx(FIDUCIAL_CENTERS_MM.BR),
};

export const SHEET_REGIONS_MM = {
  responseBox: { x: 20.0, y: 31.0, w: 175.0, h: 210.0 },
  /** Top half of response box (Parts A, C, E...) — 1.5mm top inset prevents header line bleed */
  slot1Crop: { x: 20.0, y: 41.5, w: 175.0, h: 98.0 },
  /** Bottom half of response box (Parts B, D, F...) — extends full way to bottom box border at 241mm */
  slot2Crop: { x: 20.0, y: 138.5, w: 175.0, h: 102.5 },
  /** Centered bottom-margin Code-128B search window (safely inside x: 23mm..192.9mm fiducials) */
  footerBarcodeSearch: { x: 42.0, y: 254.0, w: 132.0, h: 22.0 },
  /** Legacy bottom-right QR fallback window */
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