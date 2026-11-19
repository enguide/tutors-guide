Yes, all of these files are essential to Option B because they represent the core runtime logic of your application: **adaptive stage routing**, **accessibility policy gating**, **client-side computer vision heuristics**, and **cloud object storage ingestion**.

Here is their formal technical documentation following the standardized schema:

---

# Technical Documentation: Adaptive Routing, Vision Heuristics, Storage & Accessibility

This section covers the remaining domain logic in `lib/`: multi-stage branching control, computer vision quality assurance, S3/R2 direct upload pre-signing, and accessibility registry definitions.

---

### `lib/adaptive/branchingController.ts`

* **Purpose & Scope:** The deterministic routing engine that governs exam progression. Determines whether an exam continues linearly, branches into an adaptive Hard/Easy module (e.g., Digital SAT multistage testing), enters a scheduled intermission, or concludes the full test session.


* **Exports:**
* `evaluateNextExamRoute(metadata, currentSectionId, currentSectionRawScore, submittedSectionIds): BranchingResult`


* Interface: `BranchingResult`




* **Parameters / Inputs:**
* `metadata`: `TestMetadata` — Test configuration containing manifests, adaptive stages, thresholds, and routing targets.


* `currentSectionId`: `string` — Section just completed by the student.


* `currentSectionRawScore`: `number` — Unscaled raw score earned in the section just submitted.


* `submittedSectionIds`: `string[]` — Array of section IDs already finalized in PostgreSQL.




* **Return Value / Emitted State:**
* `BranchingResult`: `{ nextSectionId: string | null; isIntermission: boolean; intermissionDuration: number; isTestComplete: boolean; tierSelected?: "hard" | "easy" }`.




* **Dependencies & Imports:**
* `TestMetadata` from `@/types/content`.




* **Key Logic & Edge Cases:**
* **Module 1 Baseline Routing:** If `currentSectionId` matches an adaptive baseline stage (`st.sectionId`), compares `currentSectionRawScore >= stage.routing.threshold`. If passed, routes to `stage.routing.onPass` (Hard tier); otherwise routes to `stage.routing.onFail` (Easy tier).


* **Module 2 Inter-Stage Transitions:** If the completed section is a routed branch target (`onPass` or `onFail`), it looks up the next sequential stage (`stageIndex + 1`). If another stage exists (e.g., transition from Reading & Writing to Math), it routes to that stage's baseline Section 1; if no stages remain, it sets `isTestComplete: true`.


* **Intermission Scheduling:** Reads `hasIntermissionAfter` and `intermissionDuration` (defaulting to 600s / 10 minutes) directly from the manifest section definition to flag breaks.


* **Linear Fallback:** If the exam is not adaptive, locates the current section's index in `metadata.sections` and advances to `sections[currentIndex + 1]`, concluding when all sections are present in `submittedSectionIds`.





---

### `lib/accommodations/registry.ts`

* **Purpose & Scope:** Authoritative registry specifying test accommodation metadata (labels, descriptions, input types) and defining strict category-level accommodation permissions.


* **Exports:**
* `ACCOMMODATION_DESCRIPTORS: Record<keyof AccommodationSettings, AccommodationDescriptor>`


* `CATEGORY_SUPPORTED_ACCOMMODATIONS: Record<SupportedExamCategory, (keyof AccommodationSettings)[]>`


* `getAvailableAccommodationsForCategory(category: SupportedExamCategory): AccommodationDescriptor[]`


* Interface: `AccommodationDescriptor`




* **Parameters / Inputs:**
* `getAvailableAccommodationsForCategory`: `category` (`SupportedExamCategory`).




* **Return Value / Emitted State:**
* Array of `AccommodationDescriptor` objects allowed for that test type.




* **Dependencies & Imports:**
* `SupportedExamCategory` from `@/types/examConfig`.


* `AccommodationSettings` from `@/types/accommodations`.




* **Key Logic & Edge Cases:**
* **Category-Level Restriction Matrix:**
* `SAT`: Permits all accommodations (`imageMagnification`, `timeMultiplier`, `textToSpeech`, `colorInversion`, `reducedMotion`).


* `ACT`: Restricts visual popups/lightboxes to emulate strict TestNav rules (`timeMultiplier`, `textToSpeech`, `reducedMotion` only).


* `AP_CALC`: Excludes text-to-speech by default, focusing on diagram lightboxes, time multipliers, and line art color inversion.


* `GRE`: Restricts accommodations to timing, inversion, and reduced motion.







---

### `lib/cv/qualityChecks.ts`

* **Purpose & Scope:** Real-time client-side computer vision heuristics executed inside the mobile optical scanner before an image is accepted. Ensures student handwritten upload sheets are sharp and free of blinding surface glare.


* **Exports:**
* `calculateLaplacianVariance(imageData: ImageData): number`


* `checkLightingGlare(imageData: ImageData): boolean`




* **Parameters / Inputs:**
* Standard HTML5 Canvas `ImageData` pixel buffers (`Uint8ClampedArray` data, `width`, `height`).




* **Return Value / Emitted State:**
* `calculateLaplacianVariance`: Float representing image edge variance ($\sigma^2$). Lower values indicate blur/motion artifacts.


* `checkLightingGlare`: `true` if lighting glare is detected beyond threshold; otherwise `false`.




* **Dependencies & Imports:** Pure mathematical/imaging utility.


* **Key Logic & Edge Cases:**
* **Photometric Grayscale Conversion:** Converts raw RGBA pixels into standard ITU-R BT.601 luminance:

$$Y = 0.299R + 0.587G + 0.114B$$





* **Downsampled Discrete Laplacian Kernel:** Convolves a $3 \times 3$ Laplacian kernel over the image to detect second-order spatial derivatives:



$$\begin{bmatrix} 0 & 1 & 0 \\ 1 & -4 & 1 \\ 0 & 1 & 0 \end{bmatrix}$$



Steps by 2 pixels ($y += 2, x += 2$) to achieve sub-10ms performance on low-power mobile devices.


* **Specular Glare Detection:** Analyzes the central 60% of the document ($0.2W \to 0.8W$, $0.2H \to 0.8H$). Returns `true` if more than 12% of sampled pixels are saturated white ($R, G, B > 248$), alerting the user to adjust overhead lighting.


### `lib/cv/fiducials.ts`

* **Purpose & Scope:** Computer vision detector that locates the four `8mm × 8mm` corner registration targets on grayscale sheet buffers and locks sheet orientation (`0°`, `90°`, `180°`, or `270°`) for projective homography rectification.


* **Exports:**
  * `detectSheetFiducials(gray: Uint8Array, width: number, height: number): DetectedFiducials | null`
  * Interface: `DetectedFiducials` (`TL`, `TR`, `BL`, `BR`, `confidence`, `rotationAppliedDegrees`)


* **Parameters / Inputs:**
  * `gray`: `Uint8Array` — Single-channel luminance buffer.
  * `width`, `height`: `number` — Buffer dimensions in pixels.


* **Return Value / Emitted State:**
  * `DetectedFiducials` containing ordered corner centroids and detected rotation angle, or `null` if no valid 4-corner quadrilateral is found.


* **Dependencies & Imports:**
  * `Point2D` from `@/lib/frq/geometry`.


* **Key Logic & Edge Cases:**
  * **Otsu Adaptive Binarization & BFS Blob Extraction:** Computes an Otsu luminance cutoff (`darkCutoff = min(145, max(55, threshold * 0.85))`) and extracts 4-connected dark components filtered by expected target scale (`1.6%–7.5%` of image width), square aspect ratio (`0.65–1.52`), and fill ratio (`0.62–1.0`, rejecting `4.5mm × 2.0mm` margin timing ticks).
  * **White-Paper Quiet-Zone Halo:** Samples a `0.45×` outer ring around each candidate bounding box and requires `surroundBrightRatio >= 0.72`, rejecting dark browser tabs, PDF toolbars, Windows taskbar icons, and bezel artifacts.
  * **Internal Quadrilateral Invariants:** Evaluates combinations across the 4 quadrants using internal geometry invariants rather than image-edge proximity: equal corner size consistency (`minArea / maxArea >= 0.45`), opposing edge symmetry (`widthRatio >= 0.78`, `heightRatio >= 0.78`), diagonal symmetry (`min(diag1, diag2) / max(diag1, diag2) >= 0.84`), and canonical US Letter fiducial span aspect ratio (`0.54–0.88`, centered on `177.9mm / 251.4mm ≈ 0.708`).
  * **Top-Left L-Cutout Orientation Lock:** Measures `internalBrightRatio` inside the inner 60% of each of the 4 corner squares to identify the unique Top-Left target's white L-cutout and cyclically orders `[TL, TR, BR, BL]` clockwise.

---

### `lib/frq/code128.ts`

* **Purpose & Scope:** Pure-TypeScript 1D ISO/IEC 15417 Code-128C (compact numeric `QQPP`) and Code-128B barcode decoder supporting both fiducial-guided perspective scanlines on live mobile cameras and horizontal multi-row sweeps on rectified server sheets.


* **Exports:**
  * `decodeCode128FromGrayscale(gray: Uint8Array, width: number, height: number, sampleRows?: number): string | null`
  * `decodeCode128BetweenBottomFiducials(gray: Uint8Array, width: number, height: number, bl: Point2DLike, br: Point2DLike, tl: Point2DLike): string | null`
  * Interface: `Point2DLike`


* **Parameters / Inputs:**
  * `gray`, `width`, `height`: Grayscale pixel buffer and dimensions.
  * `bl`, `br`, `tl`: Detected fiducial corner coordinates used to project scanlines directly along the bottom footer margin.


* **Return Value / Emitted State:**
  * Decoded barcode string (e.g., `"0101"` for Question 1, Page 1 in Code-128C) or `null` if no valid Modulo-103 verified symbol sequence is found.


* **Dependencies & Imports:** None (zero-dependency pure TypeScript decoder).


* **Key Logic & Edge Cases:**
  * **Code-128C (`Start Code 105`) & Code-128B (`Start Code 104`) Support:** Decodes 4-digit `QQPP` numeric barcodes (`57` modules total, yielding `1.15mm` bars that oversample at `10+` pixels per bar) as well as legacy ASCII Code-128B strings, enforcing Modulo-103 checksum validation and bidirectional (0° / 180°) decoding.
  * **Fiducial-Guided Perspective Scanlines (`decodeCode128BetweenBottomFiducials`):** Samples `2.0×` oversampled vectors parallel to `BL -> BR` across perpendicular offsets (`-0.032` to `+0.024` of `TL -> BL` height) with a 48-sample sliding-window local mean threshold, making decoding immune to distance, zoom, tilt, and uneven lighting gradients.

---

### `lib/frq/manifest.ts`

* **Purpose & Scope:** Builds section-level and test-wide FRQ packet manifests (`SectionFrqManifest`) from question frontmatter and parses/validates decoded sheet barcodes and QR codes against the active exam manifest.


* **Exports:**
  * `resolveQuestionSubParts(question: QuestionFrontmatter): FrqSubPartDefinition[]`
  * `buildSectionFrqManifest(testId, sectionId, questions, sectionTitle?): SectionFrqManifest`
  * `buildTestFrqManifest(testId, sections): SectionFrqManifest`
  * `parseSelfDescribingSheetQr(rawText: string): DecodedSheetQr | null`
  * `matchQrAgainstManifest(manifest: SectionFrqManifest, qr: DecodedSheetQr): SheetQrMatchResult`
  * Interfaces & Types: `ManifestSubPart`, `ManifestSheet`, `ManifestQuestion`, `SectionFrqManifest`, `DecodedSheetQr`, `SheetQrMatchResult`


* **Key Logic & Edge Cases:**
  * **Two-Slot Sheet Pagination:** Maps `FRQ_HANDWRITTEN` sub-parts (`A, B, C, D...`) onto 2-slot physical sheets (`pageNumber = Math.floor(idx / 2) + 1`, `slotIndex = idx % 2`) with composite keys (`{sectionId}::{questionId}::p{pageNumber}`).
  * **Multi-Format Code Parsing & Validation:** `parseSelfDescribingSheetQr` parses 4-digit Code-128C `QQPP` strings (`"0101"`), pipe-delimited strings, and legacy semicolon key-value QR strings; `matchQrAgainstManifest` resolves sequential booklet page numbers (`1..12`) back to question-relative sheet indices (`1` or `2`) and flags `WRONG_FORM` or `NOT_IN_TEST` mismatches.

---

### `lib/frq/inkCheck.ts`

* **Purpose & Scope:** Gate 1 deterministic blank-box detector executed on rectified sub-part JPEG buffers before any human audit or LLM call is scheduled.


* **Exports:**
  * `analyzeCropInkDensity(cropJpegBuffer: Buffer): Promise<InkDensityResult>`
  * Interface: `InkDensityResult` (`isBlank`, `inkRatio`, `darkPixelCount`, `sampledPixelCount`)


* **Key Logic & Edge Cases:**
  * **Border Inset & Dot-Grid Exclusion:** Insets `16px` on all four edges to exclude response-box borders and counts pixels with grayscale luminance `< 165` (ignoring the faint `RGB(235, 235, 235)` 10% dot grid). Returns `isBlank: true` when `inkRatio < 0.0035` (`< 0.35%` dark pixels), auto-scoring empty responses to `0` with `transcription: "[Blank]"` and `needsHumanAudit: false`.

---

### `lib/frq/casVerifier.ts`

* **Purpose & Scope:** Gate 3 pure-TypeScript Computer Algebra System (CAS) symbolic and numeric equivalence verifier built on `nerdamer` for AP math and hard-science rubric criteria and tutor audit assistance.


* **Exports:**
  * `normalizeLatexToCas(latex: string): string`
  * `areExpressionsEquivalent(studentLatex: string, expectedLatex: string, numericTolerance?: number): boolean | null`
  * `verifyStudentMathSteps(params): CasVerificationSummary`
  * Interfaces: `EquationStepCheck`, `CasVerificationSummary`


* **Key Logic & Edge Cases:**
  * **LaTeX-to-CAS Normalization:** Translates nested `\frac{a}{b}`, `\sqrt{...}`, `^{...}`, trigonometric/inverse-trig functions, `\ln`, `\pi`, and differential suffixes (`\,dx`, `\,dt`) into `nerdamer` syntax.
  * **Three-Tier Equivalence Checking:** Evaluates (1) exact symbolic difference `simplify((a) - (b)) === 0`, (2) numeric decimal evaluation within AP 3-decimal-place rounding tolerance (`±0.001` default), and (3) multi-point univariate probing (`x = 0.37, 1.13, 2.41`) for equivalent algebraic functions, plus adjacent equality chain validation (`A = B = C`) to flag arithmetic slips.

---

### `lib/frq/evaluator.ts`

* **Purpose & Scope:** Stage-aware FRQ sub-part evaluation orchestrator supporting the three-stage progressive rollout (`STAGE_1_HUMAN_MVP`, `STAGE_2_LLM_SHADOW_AUDIT`, `STAGE_3_AUTONOMOUS`).


* **Exports:**
  * `evaluateFrqSubCrop(cropId: string, auditReasonOverride?: string, cropJpegBuffer?: Buffer)`
  * Constant: `ACTIVE_GRADING_STAGE: GradingPipelineStage`
  * Types & Interfaces: `GradingPipelineStage`, `StoredRubricCriterion`, `StoredRubricPayload`


* **Key Logic & Edge Cases:**
  * **Authoritative `.md` Rubric Hydration:** Loads the question prompt and sub-part atomic `criteria` directly from section Markdown frontmatter via `getSectionById`, storing them in `FrqSubCrop.rubricBreakdown` (`StoredRubricPayload`).
  * **Blank Auto-Score vs. Stage 1 Audit Routing:** Auto-scores blank crops (`analyzeCropInkDensity`) to `0` without flagging for review, while routing all inked crops in `STAGE_1_HUMAN_MVP` to `/tgadmin/frq-audit` (`needsHumanAudit: true`, `auditReason: "STAGE_1_HUMAN_GRADING"`) for one-click criterion-checkbox grading and synchronizes parent `FrqSubmission.status` (`PENDING_AUDIT` vs. `EVALUATED`).

---

### `lib/storage/s3.ts`

* **Purpose & Scope:** Cloud storage adapter generating pre-signed direct POST upload requests for AWS S3, Cloudflare R2, or MinIO. Offloads high-resolution multi-megabyte image transfers directly to object storage rather than consuming Next.js server compute and memory.


* **Exports:**
* `s3Client: S3Client` (Configured AWS SDK client instance)


* `createPresignedUploadPost(params): Promise<PresignedUploadConfig>`


* Interface: `PresignedUploadConfig`




* **Parameters / Inputs:**
* `createPresignedUploadPost`: `{ storageKey: string; contentType: string; maxSizeBytes?: number; expiresInSeconds?: number }`.




* **Return Value / Emitted State:**
* `PresignedUploadConfig`: `{ key, url, fields, publicUrl }`.




* **Dependencies & Imports:**
* `@aws-sdk/client-s3`


* `@aws-sdk/s3-presigned-post`




* **Key Logic & Edge Cases:**
* **Upload Bounds Enforced via Policy Conditions:** Enforces `content-length-range` bounds ($1\text{ KB} \le \text{size} \le 15\text{ MB}$) and MIME prefix validation (`$Content-Type`) inside the signed AWS policy to block payload tampering.


* **S3 & R2 Portability:** Uses environment fallbacks (`AWS_S3_ENDPOINT`, `AWS_S3_FORCE_PATH_STYLE`, `R2_BUCKET_NAME`) to support Cloudflare R2 or self-hosted S3-compatible object storage transparently.


* **CDN Public URL Resolution:** Resolves file URLs via `NEXT_PUBLIC_STORAGE_CDN_URL`, ensuring images load from CDN edge caches rather than root bucket origins.
---

### `lib/scoring/adaptiveScorer.ts`

* **Purpose & Scope:** Psychometric multistage adaptive scoring engine for the Digital SAT (and section-adaptive GRE). Computes difficulty-weighted ability scores across routing and branched modules and maps normalized ability onto Bluebook-calibrated 200–800 domain scales.


* **Exports:**
* `calculateSATDomainScore(params): SATDomainCalculationResult`
* `synthesizeAdaptiveTestScores(metadata, resultsMap, itemRecordsBySection?): AdaptiveScoreSynthesis`
* `normalizeQuestionDifficulty(raw?: string): QuestionDifficulty`
* Constants: `DEFAULT_DSAT_DIFFICULTY_WEIGHTS`, `DEFAULT_DSAT_EQUATING_CURVES`
* Interfaces: `ItemScoringRecord`, `StageScoreSummary`, `AdaptiveScoreSynthesis`, `SATDomainCalculationResult`


* **Parameters / Inputs:**
* `metadata`: `TestMetadata` — Contains `stages`, routing thresholds (`threshold`, `onPass`, `onFail`), and optional `scoring.adaptiveConfig`.
* `resultsMap`: `Map<string, { numCorrect: number; totalQuestions: number }>` — Section-level raw counts.
* `itemRecordsBySection?`: `Map<string, ItemScoringRecord[]>` — Optional item-level correctness, `difficulty`, and `domain` records.


* **Return Value / Emitted State:**
* `AdaptiveScoreSynthesis`: `{ compositeScore, stageSummaries, trajectoryDescription }`, where each `StageScoreSummary` includes `domainScore` (200–800), `routedTier` (`"hard" | "easy"`), `domainKey` (`"rw" | "math" | "general"`), `weightedEarned`, `weightedMax`, `normalizedAbility` (0–100), `abilityTheta` (-3.00 to +3.00 IRT-proxy), and `equatingBand` (SEM interval).


* **Dependencies & Imports:**
* `AdaptiveDomainCurveSet`, `AdaptiveScoringConfig`, `DifficultyWeightMatrix`, `QuestionDifficulty`, `TestMetadata` from `@/types/content`.
* `lookupScaledScore` from `./curveEngine`.


* **Key Logic & Edge Cases:**
* **Difficulty-Weighted Ability ($\theta$-proxy):** Weights `Easy`, `Medium`, and `Hard` items differently depending on module role (`routing`: `1.0 / 1.18 / 1.38`; `hard`: `1.15 / 1.38 / 1.65`; `easy`: `0.85 / 1.0 / 1.18`), normalizing malformed difficulty strings safely.
* **Domain-Specific Bluebook Curves & Overlap Zone:** Applies separate equating curves for Reading & Writing (`rw`) and Mathematics (`math`). Enforces realistic branch bounds (`easy`: `200–610`; `hard`: `460–800`), creating an authentic `460–610` overlap zone rather than an artificial hard-track floor.
* **Graceful Raw Fallback:** Falls back to module-tier average weights (`1.15` for M1, `1.38` for M2-Hard, `0.98` for M2-Easy) when item-level response records are unavailable.

---

### `lib/scoring/scoringEngine.ts`

* **Purpose & Scope:** Central multi-exam scoring orchestrator built on an extensible Strategy Registry (`SCORING_STRATEGIES`), converting section results and item-level records into composite scores, percentiles, and display badges across all supported exam programs.


* **Exports:**
* `calculateSectionScaledScore(sectionId, rawScore, metadata): number | null`
* `synthesizeExamComposite(metadata, results, itemRecordsBySection?): FinalScoreSynthesis`
* Interfaces: `SectionScoreInput`, `FinalScoreSynthesis`, `ScoringContext`, `ExamScoringStrategy`


* **Parameters / Inputs:**
* `metadata`: `TestMetadata` — Program category and `scoring` configuration (`scaleType`, `curves`, `apWeights`, `adaptiveConfig`, `percentileTable`).
* `results`: `SectionScoreInput[]` — Array of completed section score summaries.
* `itemRecordsBySection?`: `Map<string, ItemScoringRecord[]>` — Optional item-level records for adaptive psychometric equating.


* **Return Value / Emitted State:**
* `FinalScoreSynthesis`: `{ compositeScore, percentile, scaledSectionScores, displayBadge, subscoreDetails }`.


* **Dependencies & Imports:**
* `APGradeCutoffs`, `ExamScoringConfig`, `TestMetadata` from `@/types/content`.
* `DEFAULT_SAT_CURVE`, `lookupScaledScore` from `./curveEngine`.
* `ItemScoringRecord`, `synthesizeAdaptiveTestScores` from `./adaptiveScorer`.
* `lookupPercentile` from `./percentileEngine`.


* **Key Logic & Edge Cases:**
* **Strategy Registry Dispatch:** Resolves `metadata.scoring.scaleType` (with category-based fallback) to dedicated handlers: `satAdaptiveStrategy` (`SAT_ADAPTIVE` / `SAT_LINEAR`), `actConcordanceStrategy` (`ACT_CONCORDANCE`), `apWeightedStrategy` (`AP_WEIGHTED`), `greSectionStrategy` (`GRE_SECTION`, supporting both multistage adaptive and linear 130–170 forms), and `academicMasteryStrategy` (`ACADEMIC_MASTERY`).
* **Strict Type Safety:** Enforces `APGradeCutoffs` typing for AP 1–5 composite cutoffs and supports form-level `percentileTable` overrides via `lookupPercentile`.