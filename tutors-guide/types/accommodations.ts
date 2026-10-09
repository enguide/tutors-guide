// types/accommodations.ts

export interface AccommodationSettings {
  /** Click-to-expand / lightbox modal for figures and reading stimuli */
  imageMagnification: boolean;
  /** Extra time multiplier (1.0 = standard, 1.5 = +50%, 2.0 = double time) */
  timeMultiplier: 1.0 | 1.5 | 2.0;
  /** Browser Web Speech API question audio playback */
  textToSpeech: boolean;
  /** High-contrast / dark line-art inversion for diagrams */
  colorInversion: boolean;
  /** Reduced UI animations */
  reducedMotion: boolean;
}

export const DEFAULT_ACCOMMODATIONS: AccommodationSettings = {
  imageMagnification: false,
  timeMultiplier: 1.0,
  textToSpeech: false,
  colorInversion: false,
  reducedMotion: false,
};