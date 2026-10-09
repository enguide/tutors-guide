// lib/accommodations/registry.ts
import { SupportedExamCategory } from "@/types/examConfig";
import { AccommodationSettings } from "@/types/accommodations";

export interface AccommodationDescriptor {
  key: keyof AccommodationSettings;
  label: string;
  description: string;
  type: "boolean" | "select";
  options?: { label: string; value: number }[];
}

export const ACCOMMODATION_DESCRIPTORS: Record<
  keyof AccommodationSettings,
  AccommodationDescriptor
> = {
  imageMagnification: {
    key: "imageMagnification",
    label: "Image Magnification / Lightbox",
    description: "Click diagrams to expand into an inspectable zoom modal.",
    type: "boolean",
  },
  timeMultiplier: {
    key: "timeMultiplier",
    label: "Timing Mode",
    description: "Extended time accommodation for timed modules.",
    type: "select",
    options: [
      { label: "Standard Time (1.0x)", value: 1.0 },
      { label: "Time and a Half (+50% / 1.5x)", value: 1.5 },
      { label: "Double Time (+100% / 2.0x)", value: 2.0 },
    ],
  },
  textToSpeech: {
    key: "textToSpeech",
    label: "Text-to-Speech (TTS)",
    description: "Audio read-aloud controls for passages and prompts.",
    type: "boolean",
  },
  colorInversion: {
    key: "colorInversion",
    label: "High Contrast Diagram Filter",
    description: "Invert schematic lines for enhanced contrast in dark mode.",
    type: "boolean",
  },
  reducedMotion: {
    key: "reducedMotion",
    label: "Reduced Motion",
    description: "Disable layout transitions and interactive pane animations.",
    type: "boolean",
  },
};

export const CATEGORY_SUPPORTED_ACCOMMODATIONS: Record<
  SupportedExamCategory,
  (keyof AccommodationSettings)[]
> = {
  SAT: [
    "imageMagnification",
    "timeMultiplier",
    "textToSpeech",
    "colorInversion",
    "reducedMotion",
  ],
  ACT: [
    // ACT TestNav strict baseline: no image popups, but timing and TTS allowed
    "timeMultiplier",
    "textToSpeech",
    "reducedMotion",
  ],
  AP_CALC: [
    "imageMagnification",
    "timeMultiplier",
    "colorInversion",
    "reducedMotion",
  ],
  GRE: [
    "timeMultiplier",
    "colorInversion",
    "reducedMotion",
  ],
};

/**
 * Returns the list of descriptors a student can toggle for a given category.
 */
export function getAvailableAccommodationsForCategory(
  category: SupportedExamCategory
): AccommodationDescriptor[] {
  const allowedKeys = CATEGORY_SUPPORTED_ACCOMMODATIONS[category] || [];
  return allowedKeys.map((key) => ACCOMMODATION_DESCRIPTORS[key]);
}