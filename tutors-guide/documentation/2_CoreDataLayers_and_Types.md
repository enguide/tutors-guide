# Technical Documentation: Core Data Layer & Types

This section provides a comprehensive breakdown of the application's foundational data layer, covering TypeScript definitions (`types/`) and the PostgreSQL database schema defined via Prisma (`prisma/schema.prisma`).

---

## 1. TypeScript Domain Definitions

### `types/accommodations.ts`

* **Purpose & Scope:** Defines user accessibility preferences and accommodations. These settings dictate test timing adjustments, Web Speech API synthesis, and UI rendering adaptations across test runner sessions.


* **Exports:**
* `AccommodationSettings` (Interface)


* `DEFAULT_ACCOMMODATIONS` (Constant)




* **Type Definitions & Shapes:**
* `imageMagnification`: `boolean` — Enables click-to-expand lightbox modals for figures, charts, and reading passages.


* `timeMultiplier`: `1.0 | 1.5 | 2.0` — Extra time multiplier applied to section time limits (standard, time-and-a-half, or double time).


* `textToSpeech`: `boolean` — Enables browser Web Speech API playback of question prompts and passages.


* `colorInversion`: `boolean` — Inverts diagram line art and applies high-contrast styling.


* `reducedMotion`: `boolean` — Disables non-essential UI animations for cognitive comfort.




* **Dependencies & Imports:** None (pure type definition).


* **Key Logic & Edge Cases:** `DEFAULT_ACCOMMODATIONS` serves as the baseline fallback across all test runners when a student profile does not have specific accommodations granted.



---

### `types/examConfig.ts`

* **Purpose & Scope:** Establishes structural and tooling configurations for test categories and sections. Controls calculator availability, layout geometry, formula sheets, and navigation restrictions.


* **Exports:**
* `SupportedExamCategory` (Type): `"SAT" | "ACT" | "AP_CALC" | "GRE"`


* `CalculatorType` (Type): `"none" | "desmos-graphing" | "gre-basic" | "scientific"`


* `LayoutVariant` (Type): `"split-passage" | "single-column" | "quant-comparison"`


* `SectionExamConfig` (Interface)




* **Type Definitions & Shapes:**
* `SectionExamConfig`:
* `layout`: `LayoutVariant` — Geometry variant (e.g., passage-based split screen vs. single-column math).


* `calculator`: `CalculatorType` — Determines which calculator tool is mounted in the test toolbar.


* `hasFormulaSheet`: `boolean` — Toggles the reference sheet modal button.


* `formulaSheetId?`: `"sat-standard" | "ap-calc" | "none"` — Selects the SVG/PDF formula sheet asset.


* `hasCrossOutMode`: `boolean` — Enables strikethrough option elimination.


* `allowBacktracking`: `boolean` — Controls whether students can navigate back to previous questions.


* `allowSectionReview`: `boolean` — Determines if a review grid modal is available prior to final section submission.






* **Dependencies & Imports:** None.


* **Key Logic & Edge Cases:** Strict configuration decoupling enables dynamic testing behavior—for instance, GRE quant sections lock into `"gre-basic"` and `"quant-comparison"`, while SAT Math sections load `"desmos-graphing"` and `"single-column"`.



---

### `types/content.ts`

* **Purpose & Scope:** Serves as the schema for static test files (Markdown files and `metadata.json`), detailing how sections, questions, adaptive routing rules, and scoring curves are parsed.


* **Exports:**
* `QuestionType`: `"MC" | "FR" | "FRQ_HANDWRITTEN"`


* `QuestionLayoutMode`: `"split" | "single"`


* `QuestionDifficulty`: `"Easy" | "Medium" | "Hard"`


* `QuestionOption` (Interface: `id`, `text`)


* `QuestionFrontmatter` (Interface)


* `SectionFrontmatter` (Interface)


* `SectionManifest` (Interface)


* `AdaptiveRoutingRule` (Interface)


* `AdaptiveStage` (Interface)


* `TestMetadata` (Interface)


* `ParsedSection` (Interface)


* `LinearCurveMapping`, `APGradeCutoffs`, `ExamScoringConfig` (Interfaces)




* **Type Definitions & Shapes:**
* `QuestionFrontmatter`: Contains parsed frontmatter per question, including `id`, `correctAnswer`, `prompt`, `stimulus` (or fallback `passage`), `domain`, `skill`, `explanation`, and optional layout override.


* `AdaptiveRoutingRule` & `AdaptiveStage`: Dictate dynamic stage movement (`threshold`, `onPass`, `onFail`), enabling multi-stage tests like the Digital SAT.


* `ExamScoringConfig`: Controls the evaluation engine strategy (`scaleType`: `"SAT_ADAPTIVE" | "ACT_CONCORDANCE" | "AP_WEIGHTED" | "GRE_SECTION"`), section multipliers (`apWeights`), and raw-to-scaled score mappings (`curves`).




* **Dependencies & Imports:** `SectionExamConfig`, `SupportedExamCategory` from `./examConfig`.


* **Key Logic & Edge Cases:** Supports both linear sections (fixed progression) and multi-stage branch configurations via `stages` and `routing` trees.



---

### `types/examLayout.ts`

* **Purpose & Scope:** Defines the contracts for the unified test shell runtime state, layout action dispatchers, and layout adapter props.


* **Exports:**
* `TestShellExamState` (Interface)


* `TestShellExamActions` (Interface)


* `TestShellLayoutProps` (Interface)




* **Type Definitions & Shapes:**
* `TestShellExamState`: Tracks real-time test execution state (`currentIndex`, `totalQuestions`, `secondsRemaining`, `syncStatus`, `activeQuestion`, `activeAnswer`, `answers` dictionary, cross-out state, TTS playback status, and active accommodations).


* `TestShellExamActions`: Standardized action handlers dispatched by shell controls (`selectOption`, `setFrqAnswer`, `toggleEliminateOption`, `toggleFlag`, `toggleCrossOut`, `toggleCalculator`, `openFormulaSheet`, `toggleTTS`, `openReviewModal`).


* `TestShellLayoutProps`: Unified prop interface fed into category adapters (`SATLayoutAdapter`, `ACTLayoutAdapter`, etc.), binding test content, config, state, and handlers.




* **Dependencies & Imports:**
* `SyncStatus` from `@/hooks/useTestProgress`


* `SupportedExamCategory`, `SectionExamConfig` from `@/types/examConfig`


* `QuestionFrontmatter`, `ParsedSection`, `TestMetadata` from `@/types/content`


* `AccommodationSettings` from `@/types/accommodations`




* **Key Logic & Edge Cases:** Abstracts category-specific UI shells away from state management, ensuring the exam engine hooks handle state updates while adapters only handle layout and chrome.



---

### `types/analytics.ts`

* **Purpose & Scope:** Structures question-level performance data, pacing telemetry, section score reports, and adaptive trajectory summaries for student dashboards and tutor review.


* **Exports:**
* `EnrichedResponseItem` (Interface)


* `SectionResultData` (Interface)


* `TestSummaryData` (Interface)


* `AdaptiveStageTelemetry` (Interface)


* `AdaptiveTrajectoryData` (Interface)


* `CATEGORY_PACING_TARGETS` (Constant)




* **Type Definitions & Shapes:**
* `EnrichedResponseItem`: Blends student response choices with question frontmatter (`domain`, `skill`, `difficulty`, `explanation`, `passageText`) alongside behavioral telemetry (`timeSpentOnResponse`, `usedCalculator`, `changedAnswer`).


* `SectionResultData`: Captures section totals, raw and scaled scores, remaining time, and `navigationHistory` step timestamps (`{ time: number; qIdx: number }[]`).


* `AdaptiveTrajectoryData`: Details multi-stage routing results (baseline section vs. routed tier `"hard" | "easy"`, raw counts, composite scores).


* `CATEGORY_PACING_TARGETS`: Target pacing benchmarks in seconds per question across SAT (RW: 71s, Math: 95s), ACT (English: 36s, Math: 60s, Reading/Science: 52s), GRE, and AP Calc.




* **Dependencies & Imports:** `Category`, `QuestionType` from `@prisma/client`.


* **Key Logic & Edge Cases:** `CATEGORY_PACING_TARGETS` powers UI pacing variance grids, highlighting whether a student was rushing or lingering relative to standard exam benchmarks.



---

### `types/next-auth.d.ts`

* **Purpose & Scope:** Augments NextAuth typings to inject application-specific authorization attributes directly into the session and JWT objects.


* **Exports:** Ambient declaration extending `next-auth` and `next-auth/jwt` modules.


* **Augmented Types:**
* `Session["user"]`: Injects `id`, `role: Role`, `orgId?: string | null`, and `entitlements: Category[]`.


* `User`: Injects `id`, `role: Role`, `orgId?: string | null`, and `entitlements: Category[]`.


* `JWT`: Injects `id`, `role: Role`, `orgId?: string | null`, and `entitlements: Category[]`.




* **Dependencies & Imports:** `Role`, `Category` from `@prisma/client`.


* **Key Logic & Edge Cases:** Enables route guards and server actions to verify user permissions and purchased exam categories without making repeated database calls.



---

## 2. Database Schema (`prisma/schema.prisma`)

### A. Core Enums

| Enum | Values | Purpose |
| --- | --- | --- |
| `Role`

 | `STUDENT`, `TUTOR`, `ORG_ADMIN`, `ADMIN`, `PARENT`

 | Role-based access control and navigation permissions.

 |
| `ClassYear`

 | `FRESHMAN`, `SOPHOMORE`, `JUNIOR`, `SENIOR`, `OTHER`

 | Cohort segmentation and demographic reporting.

 |
| `Category`

 | `NONE`, `SAT`, `ACT`, `AP_CALC`, `GRE`, `ACADEMIC`

 | Test category categorization and entitlement gating.

 |
| `QuestionType`

 | `MC`, `FR`, `FRQ_HANDWRITTEN`

 | Dictates question scoring pipelines and answer storage.

 |
| `EnrollmentStatus`

 | `ACTIVE`, `REVOKED`, `EXPIRED`

 | Lifecycle state of a student's license seat.

 |
| `LinkStatus`

 | `PENDING`, `ACTIVE`, `REVOKED`

 | Mentorship authorization status between student and tutor.

 |
| `FrqSubmissionStatus`

 | `PENDING_INGESTION`, `UPLOADED`, `CROPPED`, `PENDING_AUDIT`, `EVALUATED`, `FAILED`

 | Lifecycle stages for handwritten FRQ processing.

 |
| `CaptureSessionStatus`

 | `ACTIVE`, `CAPTURED`, `EXPIRED`

 | Status of mobile camera QR pairing sessions.

 |

---

### B. User Identity, Organizations & Mentorship

#### `Organization` & `School`

* **Purpose:** Represents multi-tenant business structures (schools, tutoring franchises, districts) holding license pools.


* **Fields:**
* `Organization`: `id`, `name`, `stripeCustomerId` (unique Stripe linkage), relations to `members` (`Profile[]`) and `licensePools` (`LicensePool[]`).


* `School`: `id`, `name`, relation to `members` (`Profile[]`).





#### `Profile`

* **Purpose:** Central identity entity for students, tutors, and administrators.


* **Key Fields:** `id`, `firstName`, `lastName`, `email` (unique), `password`, `classYear`, `role`, 2FA attributes.


* **Relations:**
* Belongs to optional `School` and `Organization`.


* Owns `LicensePool[]` (as purchaser) and holds `Enrollment[]` (as student).


* Points to `Response[]`, `Result[]`, `TestSummary[]`, and `SectionCheckpoint[]`.


* Mentorship relations: `tutoredStudents` (where profile is tutor) and `studentTutors` (where profile is student) via `TutorStudentLink`.


* FRQ links: `frqSubmissions`, `captureSessions`, and staff-level `auditedFrqSubCrops`.





#### `TutorStudentLink`

* **Purpose:** Implements granular mentorship observation rights.


* **Fields:** `id`, `status` (`LinkStatus`), `tutorId`, `studentId`, timestamps.


* **Constraints:** `@@unique([tutorId, studentId])` prevents duplicate link delegations.



---

### C. Commercial Licensing & Entitlements

#### `LicensePool`

* **Purpose:** Tracks purchased seat allocations from Stripe or institutional contracts.


* **Fields:** `id`, `name`, `stripeSessionId`, `stripeSubscriptionId`, `seatLimit`, `categories` (`Category[]`), `inviteCode` (unique join code), `startsAt`, `expiresAt`.


* **Relations:** Bound to purchaser (`Profile`) or institution (`Organization`), with children `Enrollment[]`.



#### `Enrollment`

* **Purpose:** Assigns an individual student (`Profile`) to an active seat within a `LicensePool`.


* **Fields:** `id`, `status`, `profileId`, `licensePoolId`, `firstAccessedAt`, timestamps.


* **Constraints:** `@@unique([profileId, licensePoolId])` enforces single seating per pool.



---

### D. Exam Core & Runtime Checkpoints

#### `Test` & `Section`

* **Purpose:** Relational index for exam structures.


* **Fields:**
* `Test`: `id`, `title`, `category`, relations to `Section[]`, `Response[]`, `Result[]`, `TestSummary[]`, `FrqSubmission[]`.


* `Section`: `id`, `title`, `sectionOrder`, `timeLimit`, linked to `Test`.





#### `Response`

* **Purpose:** Granular question-level audit trail capturing user answer submissions and interaction metrics.


* **Fields:** `id`, `isCorrect`, `responseOrder`, `sectionOrder`, `timeSpentOnResponse`, `questionId`, `responseType`, `selectedOptionId`, `frqUserAnswer`, `correctAnswerKey`, `usedCalculator`, `changedAnswer`.


* **Constraints:** `@@unique([profileId, questionId])` ensures one final response record per question per student.



#### `SectionCheckpoint`

* **Purpose:** Ephemeral, high-frequency autosave store maintaining active in-flight test state to survive crashes or page reloads.


* **Fields:** `id`, `profileId`, `testId`, `sectionId`, `timeRemainingSeconds`, `lastQuestionIndex`, `navigationHistory` (`Json`), `clientUpdatedAt`.


* **Constraints:** `@@unique([profileId, testId, sectionId])` maintains one active draft checkpoint per student section.



#### `Result` & `TestSummary`

* **Purpose:** Permanent, immutable post-test analytics and scoring records.


* **Fields:**
* `Result`: Section-level final scores (`numCorrect`, `totalQuestions`, `rawScore`, `scaledScore`, `timeRemainingSeconds`, `navigationHistory` JSON, `accommodations` JSON snapshot). Unique on `@@unique([testId, profileId, sectionId])`.


* `TestSummary`: Full-exam composite summary (`compositeScore`, `percentile`, `completedAt`). Unique on `@@unique([testId, profileId])`.





---

### E. Free Response (FRQ) Mobile Scan & Auditing

#### `CaptureSession`

* **Purpose:** Orchestrates QR-code-based mobile hand-off sessions for capturing handwritten work.


* **Fields:** `id`, `sessionToken` (unique pairing token), `status` (`CaptureSessionStatus`), `profileId`, `testId`, `sectionId`, `questionId` (optional section-wide coverage), `expiresAt`.


* **Relations:** 1-to-many relationship with `FrqSubmission[]`.



#### `FrqSubmission`

* **Purpose:** Stores raw uploaded full-page handwritten document scans and camera metadata.


* **Fields:** `id`, `status` (`FrqSubmissionStatus`), `fullSheetUrl`, `storageKey`, `mimeType`, `fileSizeBytes`, `pageNumber` (page 1 vs. 2 indexing), `detectedExamCode`, `detectedQuestion`, foreign keys to `Profile`, `Test`, `Section`, `questionId`, and `captureSessionId`.


* **Constraints:** `@@unique([profileId, testId, sectionId, questionId, pageNumber])` guarantees deduplication per page.



#### `FrqSubCrop`

* **Purpose:** Represents individual sub-part bounding box crops extracted from a full sheet (e.g., Part A, Part B).


* **Fields:** `id`, `subPartLabel`, `cropUrl`, `storageKey`, `bbox` (normalized coordinates JSON), `transcription`, `pointsAwarded`, `pointsPossible`, `rubricBreakdown` (JSON).


* **Human Audit Flow:** `needsHumanAudit` flag, `auditReason`, and review audit fields (`reviewedById`, `reviewedAt`, `reviewerNotes`) linked to the staff reviewer (`Profile`).
