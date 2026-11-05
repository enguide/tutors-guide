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