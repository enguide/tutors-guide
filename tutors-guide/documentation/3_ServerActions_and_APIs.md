# Technical Documentation: Server Actions & API Handlers

This section covers the operational business logic layer of the application, encompassing API route handlers (REST, Server-Sent Events, webhooks) and Next.js Server Actions handling exam execution, in-flight state persistence, optical handwritten FRQ capture, licensing, staff observability, and identity management.

---

## 1. API Route Handlers (`app/api/`)

### `app/api/auth/[...nextauth]/route.ts`

* **Purpose & Scope:** NextAuth catch-all authentication endpoint delegating incoming HTTP requests to NextAuth's core handler pipeline for login, logout, OAuth/credential flows, and session validation.


* **Exports:**
* `GET`, `POST`: NextAuth request handlers.




* **Parameters / Props:** Standard `NextRequest` context managed internally by NextAuth.


* **Return Value / Emitted State:** Standard NextAuth HTTP response payloads (session cookies, redirects, JSON tokens).


* **Dependencies & Imports:**
* Internal: `handlers` from `@/lib/auth`.




* **Key Logic & Edge Cases:** Serves as the central auth gateway. Handlers process JWT creation, session refreshes, and credential verification defined inside `auth.ts`.



---

### `app/api/capture/[token]/events/route.ts`

* **Purpose & Scope:** Server-Sent Events (SSE) endpoint establishing a persistent HTTP stream with the desktop exam runner. It notifies the desktop client in real time when handwritten FRQ sheets are uploaded, cropped, or audited via a mobile device.


* **Exports:**
* `GET(req: NextRequest, { params }: { params: Promise<{ token: string }> })`




* **Parameters / Props:**
* Dynamic Route Parameter: `token` (`string`) — Unique mobile capture session token.




* **Return Value / Emitted State:** A long-lived `Response` holding a `ReadableStream` (`text/event-stream`), emitting:
* Heartbeat comment pings (`: ping\n\n`) every 15 seconds.


* Event `STATUS_CHANGE`: Emits submission metadata, status, question ID, page number, full sheet image URL, and sub-crop objects.


* Event `ERROR`: Emits when the session token is expired or invalid.




* **Dependencies & Imports:**
* `NextRequest`, `connection` from `next/server`.


* `prisma` from `@/lib/prisma`.




* **Key Logic & Edge Cases:**
* **Dynamic Runtime Execution:** Invokes `await connection()` to opt in to dynamic runtime execution under Next.js dynamic I/O models.


* **State Snapshot Diffing:** Maintains a snapshot hash (`${sub.status}_${sub.crops.length}`) per submission inside an in-memory `Map`. It only pushes updates to the client when a status changes or new crops are produced, minimizing polling noise.


* **Client Abort & Cleanup:** Listens to `req.signal.addEventListener("abort")` to clear the 1500ms database polling interval and 15s keep-alive ping interval, closing the stream without memory leaks.





---

### `app/api/checkout/route.ts`

* **Purpose & Scope:** Stripe checkout session creation endpoint supporting individual self-enrollment (B2C) and multi-seat institutional license pool purchases (B2B).


* **Exports:**
* `POST(req: NextRequest)`




* **Parameters / Props:**
* JSON Body:
* `tier` (`string`): Target key matching `PRICING_TIERS` (defaults to `"SAT"`).


* `isB2B` (`boolean`): Flags institutional purchase with multiple seat allocations.


* `seats` (`string` | `number`): Number of seats purchased (defaults to `1` for B2C).


* `email` (`string`): Purchaser's email address (falls back to active session email).


* `orgName` (`string`, optional): Organization/franchise name for B2B accounts.


* `firstName`, `lastName` (`string`, optional): Customer identity attributes.


* `password` (`string`, optional): Unauthenticated registrant password (pre-hashed if provided).






* **Return Value / Emitted State:**
* Success: `NextResponse.json({ clientSecret: session.client_secret })`.


* Failure: `400 Bad Request` or `500 Internal Server Error` with JSON error details.




* **Dependencies & Imports:**
* `Stripe` from `stripe`.


* `NextRequest`, `NextResponse` from `next/server`.


* `auth` from `@/lib/auth`.


* `PRICING_TIERS` from `@/config/pricing`.


* `bcrypt` from `bcryptjs`.




* **Key Logic & Edge Cases:**
* **Unauthenticated Buyer Registration:** If an unauthenticated user buys directly from the storefront, their password is validated ($\ge 8$ chars) and hashed (`bcrypt.hash(..., 10)`) upfront, then embedded into Stripe checkout session metadata for post-payment account creation.


* **Embedded UI Mode:** Configures Stripe checkout in `ui_mode: "embedded"`, returning a client secret to render an in-page checkout modal without external redirects.


* **Metadata Passthrough:** Stores seat limit, tier key, B2B flag, categories JSON, and hashed credentials into Stripe metadata to guarantee atomic fulfillment in the webhook.





---

### `app/api/tgadmin/export-csv/route.ts`

* **Purpose & Scope:** Administrative and tutor CSV data export endpoint. Generates downloadable cohort diagnostic roster summaries with student demographics, exam categories, completed dates, percentiles, and composite scores.


* **Exports:**
* `GET()`




* **Parameters / Props:** Authenticated session headers/cookies.


* **Return Value / Emitted State:** Downloadable `text/csv; charset=utf-8` response with `Content-Disposition: attachment; filename="cohort_diagnostic_roster_<DATE>.csv"`.


* **Dependencies & Imports:**
* `NextResponse` from `next/server`.


* `auth` from `@/lib/auth`.


* `prisma` from `@/lib/prisma`.


* `Role`, `LinkStatus` from `@prisma/client`.




* **Key Logic & Edge Cases:**
* **Role-Based Tenant Scoping:**
* `ORG_ADMIN` / Staff with `orgId`: Restricted to students belonging to their specific organization.


* `ADMIN` (Super Admin): Exports students across the entire platform or the primary organization.


* `TUTOR` (Independent): Restricts data export strictly to students linked via active `TutorStudentLink` records (`status: ACTIVE`).


* **Hybrid Tutors:** Tutors belonging to an organization receive a deduplicated union of their org roster and their direct private mentorship students.




* **CSV Sanitization:** Wraps student names and test titles in escaped quotes, replacing internal quotation marks (`""`) to prevent CSV injection or broken layout parsing.





---

### `app/api/webhooks/stripe/route.ts`

* **Purpose & Scope:** Asynchronous fulfillment engine for Stripe payment events. Listens for `checkout.session.completed` events to provision user profiles, create organization entities, allocate license pools, and activate student seats.


* **Exports:**
* `POST(req: NextRequest)`




* **Parameters / Props:** Raw request body and `stripe-signature` header.


* **Return Value / Emitted State:** `NextResponse.json({ received: true })` or error status on signature failure.


* **Dependencies & Imports:**
* `Stripe` from `stripe`.


* `prisma` from `@/lib/prisma`.


* `Role`, `ClassYear`, `Category`, `EnrollmentStatus` from `@prisma/client`.


* `bcrypt` from `bcryptjs`, `crypto` from `crypto`.




* **Key Logic & Edge Cases:**
* **Signature Verification:** Enforces cryptographic validation against `process.env.STRIPE_WEBHOOK_SECRET`.


* **Idempotency Guard:** Checks whether a `LicensePool` with the specified `stripeSessionId` already exists before execution to prevent double-provisioning on webhook retries.


* **Transactional Provisioning (`prisma.$transaction`):**
* Resolves or creates the purchaser `Profile`. If no password was provided, generates a cryptographically secure random hash.


* **B2B Branch:** Creates an `Organization`, links the profile as `ORG_ADMIN`, creates a multi-seat `LicensePool`, and generates an institutional join code (`ORG-XXXX`).


* **B2C Branch:** Creates a 1-seat `LicensePool` bound to the purchaser and creates an immediately active `Enrollment` record.


* Sets license pool validity for exactly 1 year (`oneYearExpiry`).







---

## 2. Server Actions (`actions/`)

### `actions/autosave.ts`

* **Purpose & Scope:** Handles high-frequency asynchronous autosaving for active student test sessions, persisting in-flight question answer selections and periodic section checkpoint snapshots (clock, question index, navigation path).


* **Exports:**
* `saveSectionCheckpoint(payload: CheckpointPayload): Promise<{ success: boolean; error?: string }>`


* `autosaveResponse(payload: AutosavePayload): Promise<{ success: boolean; error?: string }>`




* **Parameters / Props:**
* `CheckpointPayload`: `testId`, `sectionId`, `timeRemainingSeconds`, `lastQuestionIndex`, `navigationHistory`, `accommodations`, `clientUpdatedAt`.


* `AutosavePayload`: `testId`, `sectionId`, `questionId`, `sectionOrder`, `responseOrder`, `responseType`, `selectedOptionId`, `frqUserAnswer`, `correctAnswerKey`, `timeSpentOnResponse`, `usedCalculator`.




* **Return Value / Emitted State:** Standard status indicators (`{ success: true }` or `{ success: false, error: string }`).


* **Dependencies & Imports:**
* `auth` from `@/lib/auth`.


* `prisma` from `@/lib/prisma`.


* `evaluateAnswer` from `@/lib/scoring/mathEvaluator`.




* **Key Logic & Edge Cases:**
* **Checkpoint Finalization Guard:** `saveSectionCheckpoint` executes a lightweight, index-only lookup against `prisma.result.findUnique({ where: { testId_profileId_sectionId } })`. If an immutable result already exists, the save is aborted immediately, preventing delayed debounces or offline retry queues from resurrecting deleted checkpoints.


* **Lean Response Upsertion:** `autosaveResponse` writes directly via `prisma.response.upsert` without pre-checking test status, eliminating read-before-write query duplication during active student testing.


* **Monotonic Dwell Time Preservation:** Dwell times are verified against existing responses to ensure monotonic increments across delayed or out-of-order network requests.





---

### `actions/breakActions.ts`

* **Purpose & Scope:** Manages server-side cookie states during scheduled exam intermissions (e.g., between SAT Module 1 and 2, or ACT sections).


* **Exports:**
* `clearBreakCookieAction(testId: string): Promise<void>`




* **Parameters / Props:**
* `testId` (`string`): The identifier of the exam currently in intermission.




* **Return Value / Emitted State:** None (mutates HTTP-only cookie store).


* **Dependencies & Imports:**
* `cookies` from `next/headers`.




* **Key Logic & Edge Cases:** Explicitly deletes the `break_${testId}` cookie, allowing a student to resume testing early or clear a stale intermission session.



---

### `actions/completeTestSection.ts`

* **Purpose & Scope:** The central exam completion action. Grades multiple-choice, grid-in, and handwritten FRQ questions, calculates section scaled scores, deletes in-flight checkpoints, resolves multi-stage adaptive branching, sets intermission cookies, and synthesizes composite test scores.


* **Exports:**
* `completeTestSection(payload: CompleteSectionPayload): Promise<CompleteSectionResult>`




* **Parameters / Props:**
* `payload` (`CompleteSectionPayload`):
* `testId`, `testTitle`, `category`, `sectionId`, `sectionOrder`.


* `timeRemainingSeconds` (`number`): Remaining section clock.


* `navigationHistory` (`{ time: number; qIdx: number }[]`): Behavioral timestamp sequence of student question visits.


* `questions` (`QuestionFrontmatter[]`): Authoritative question metadata.


* `clientAnswers` (`Record<string, AnswerPayload>`): Student submitted options, FRQ strings, and UI tool usage flags.


* `accommodations` (`AccommodationSettings`, optional): Accessibility parameters (time multipliers, etc.).






* **Return Value / Emitted State:**
* Success: `{ success: true, nextSectionId, isIntermission, intermissionDuration, isTestComplete, tierSelected, stats: { numCorrect, totalQuestions, rawScore, scaledScore } }`.


* Failure: `{ success: false, error: string }`.




* **Dependencies & Imports:**
* `cookies` from `next/headers`, `auth` from `@/lib/auth`, `prisma` from `@/lib/prisma`.


* `evaluateAnswer` from `@/lib/scoring/mathEvaluator`.


* `getTestMetadata` from `@/lib/contentLoader`.


* `evaluateNextExamRoute` from `@/lib/adaptive/branchingController`.


* `calculateSectionScaledScore`, `synthesizeExamComposite` from `@/lib/scoring/scoringEngine`.




* **Key Logic & Edge Cases:**
* **Role & Re-submission Guards:** Rejects submissions if user role is not `STUDENT`, or if an immutable `Result` already exists for this `[testId, profileId, sectionId]`.


* **Optical FRQ Score Aggregation:** Queries `frqSubmission` and child `FrqSubCrop` records. If handwritten FRQ crops exist, sums awarded sub-part points, concatenates sub-part transcriptions, and evaluates overall question correctness against total possible points.


* **Dwell Time Derivation:** Computes per-question dwell times (`timeSpentOnResponse`) strictly from intervals between sequential navigation timestamps (`deriveTimeSpentFromNavigationHistory`), accounting for accommodation time multipliers.


* **Batched Transaction Pipeline (`prisma.$transaction([...])`):** To support high-volume concurrent cohorts without connection pool exhaustion, question `Response` upserts, immutable `Result` creation, and `SectionCheckpoint` eviction are aggregated into an array of deferred Prisma promises and committed in a single atomic database round-trip (sub-10ms connection hold time).


* **Checkpoint Eviction & Cleanup:** Deletes the active in-flight row in `SectionCheckpoint` directly within the completion batch pipeline, preventing orphaned drafts if student attempts reload.


* **Adaptive Branching & Composite Score Synthesis:** Evaluates `evaluateNextExamRoute` to determine whether to route to an easy/hard second module or trigger a break. If all stages are finished, invokes `synthesizeExamComposite` and upserts the student's `TestSummary`.





---

### `actions/frqCapture.ts`

* **Purpose & Scope:** Coordinates the cross-device optical capture pipeline for handwritten work, issuing QR pairing tokens, generating pre-signed S3 upload parameters, and triggering asynchronous computer vision cropping.


* **Exports:**
* `getOrCreateCaptureSession(params: CreateCaptureSessionParams)`


* `getPresignedUploadForSession(sessionToken, contentType, targetQuestionId?, pageNumber?)`


* `finalizeSubmissionUpload(params)`




* **Parameters / Props:**
* `getOrCreateCaptureSession`: `{ testId: string; sectionId: string; questionId?: string }`.


* `getPresignedUploadForSession`: `sessionToken` (`string`), `contentType` (`string`), optional `targetQuestionId` (`string`), `pageNumber` (`number`, default `1`).


* `finalizeSubmissionUpload`: Session token, S3 `storageKey`, `publicUrl`, `mimeType`, `fileSizeBytes`, `questionId`, and `pageNumber`.




* **Return Value / Emitted State:**
* `getOrCreateCaptureSession`: `{ success: true, sessionToken, expiresAt, submissions }`.


* `getPresignedUploadForSession`: `{ success: true, presigned: PresignedPost, session: SessionDetails }`.


* `finalizeSubmissionUpload`: `{ success: true, submission: FrqSubmission }`.




* **Dependencies & Imports:**
* `crypto` from `crypto`, `auth` from `@/lib/auth`, `prisma` from `@/lib/prisma`.


* `createPresignedUploadPost` from `@/lib/storage/s3`.


* `processAndCropFrqSubmission` from `@/lib/frq/cropper`.




* **Key Logic & Edge Cases:**
* **Session Reusability Window:** Checks for an existing active session with at least 2 minutes of remaining validity; otherwise creates a new 30-minute token session.


* **Direct S3 Upload Offloading:** Pre-signs upload URLs so that mobile devices and desktop fallback pickers upload heavy image payloads directly to object storage rather than streaming through Next.js server memory.


* **Asynchronous CV Pipeline Trigger:** Upon persisting an uploaded submission in Prisma, fires `processAndCropFrqSubmission(submission.id)` asynchronously in the background without blocking the HTTP response.





---

### `actions/frqAudit.ts`

* **Purpose & Scope:** Staff-facing review queue actions for inspecting, transcribing, and grading handwritten student responses flagged for human audit.


* **Exports:**
* `getPendingAuditCrops(): Promise<{ success: boolean; crops?: FrqSubCrop[]; error?: string }>`


* `resolveCropAudit(params): Promise<{ success: boolean; error?: string }>`




* **Parameters / Props:**
* `resolveCropAudit`: `{ cropId: string; pointsAwarded: number; transcription?: string; reviewerNotes?: string }`.




* **Return Value / Emitted State:**
* `getPendingAuditCrops`: Array of pending crop items including student profile info and exam title.


* `resolveCropAudit`: `{ success: true }`.




* **Dependencies & Imports:**
* `auth` from `@/lib/auth`, `prisma` from `@/lib/prisma`.


* `revalidatePath` from `next/cache`.




* **Key Logic & Edge Cases:**
* **Staff Role Guard:** Restricts queue querying and resolution to `ADMIN`, `ORG_ADMIN`, and `TUTOR` roles.


* **Audit Resolution:** Updates `pointsAwarded`, `transcription`, `reviewerNotes`, links `reviewedById`, and sets `needsHumanAudit: false` before clearing the Next.js router cache for `/tgadmin/frq-audit` via `revalidatePath`.





---

### `actions/institutional.ts`

* **Purpose & Scope:** Handles institutional administration, seat metrics calculation, unified student roster rendering, invite code rotation, and seat revocation.


* **Exports:**
* `getInstitutionalOverview(): Promise<{ orgName: string; metrics: SeatMetrics; roster: StudentRosterItem[] }>`


* `refreshPoolInviteCode(licensePoolId: string): Promise<{ success: true; inviteCode: string }>`


* `revokeStudentSeat(enrollmentId: string): Promise<{ success: true }>`




* **Parameters / Props:**
* `refreshPoolInviteCode`: `licensePoolId` (`string`).


* `revokeStudentSeat`: `enrollmentId` (`string`).




* **Return Value / Emitted State:** Structured metrics (total seats, allocated seats, vacancies, pools) and combined student rosters.


* **Dependencies & Imports:**
* `prisma` from `@/lib/prisma`.


* `requireStaffSession`, `requireOrgAdminSession` from `@/lib/guards`.


* `Role`, `EnrollmentStatus`, `LinkStatus` from `@prisma/client`.


* `revalidatePath` from `next/cache`, `crypto` from `crypto`.




* **Key Logic & Edge Cases:**
* **Unified Roster Deduplication:** Fetches both pool enrollments (institutional) and direct mentorship links (private tutoring). Deduplicates by `profileId`—giving precedence to institutional seats—and orders by enrollment timestamp.


* **Vacancies Calculation:** Calculates capacity as $\max(0, \text{seatLimit} - \text{activeEnrollments})$ across all active pools.


* **Security Bounds on Revocation / Invite Code Refresh:** Checks that non-superadmins are strictly scoped to the `orgId` owning the target license pool before allowing changes.





---

### `actions/joinOrg.ts`

* **Purpose & Scope:** Student self-registration and license pool redemption engine.


* **Exports:**
* `redeemInviteCode(formData): Promise<{ success: boolean; email: string; poolName: string; categories: Category[]; enrollmentId: string }>`




* **Parameters / Props:**
* `formData`: `{ inviteCode: string; email: string; password?: string; firstName: string; lastName: string; classYear?: ClassYear }`.




* **Return Value / Emitted State:** Enrollment confirmation and licensed categories.


* **Dependencies & Imports:**
* `prisma` from `@/lib/prisma`.


* `bcrypt` from `bcryptjs`.


* `EnrollmentStatus`, `Role`, `ClassYear` from `@prisma/client`.




* **Key Logic & Edge Cases:**
* **Atomic Transaction (`tx`):**
* Verifies that the invite code exists, the license pool has not expired, and active enrollments do not exceed `seatLimit`.


* Locates existing student profile or creates a new student with hashed password and links to the pool's `orgId`.


* Upserts an `Enrollment` row to `ACTIVE`, enabling existing students to reuse invite codes to join new pools without recreating profiles.







---

### `actions/mentorship.ts`

* **Purpose & Scope:** Manages independent 1-on-1 tutor-student pairing, shareable connection links, approval workflows, and access revocation.


* **Exports:**
* `getOrCreateTutorInviteLink(): Promise<{ inviteUrl: string; inviteCode: string }>`


* `requestMentorConnection(tutorEmail: string)`


* `acceptTutorInvite(tutorId: string)`


* `getStudentMentorshipLinks(): Promise<MentorshipLinkItem[]>`


* `respondToMentorshipRequest(linkId: string, accept: boolean)`


* `revokeMentorshipAccess(linkId: string)`




* **Parameters / Props:** IDs and email inputs as specified in signatures.


* **Return Value / Emitted State:** Link records, connection codes, and success status.


* **Dependencies & Imports:**
* `auth` from `@/lib/auth`, `prisma` from `@/lib/prisma`.


* `Role`, `LinkStatus` from `@prisma/client`.


* `revalidatePath` from `next/cache`.




* **Key Logic & Edge Cases:**
* **Self-Linking Prevention:** Explicitly blocks students/tutors from connecting their account to their own `userId`.


* **Two-Way Delegation Sovereign Revocation:** Both the tutor and the student have permission to unilaterally revoke or delete a mentorship link.


* **Idempotent Link Requests:** Uses `tutorStudentLink.upsert` on the unique composite `[tutorId, studentId]` index to reactivate previously revoked or pending links.





---

### `actions/observability.ts`

* **Purpose & Scope:** Read-only staff analytics action enabling tutors and administrators to inspect individual student diagnostic summaries and exam histories.


* **Exports:**
* `getStudentExamsForStaff(targetProfileId: string)`




* **Parameters / Props:**
* `targetProfileId` (`string`): The target student's profile ID.




* **Return Value / Emitted State:** Student identity details and completed exam summary array (scores, categories, percentiles, dates).


* **Dependencies & Imports:**
* `prisma` from `@/lib/prisma`.


* `requireStaffSession` from `@/lib/guards`.


* `Role`, `LinkStatus` from `@prisma/client`.




* **Key Logic & Edge Cases:**
* **Multi-Tenant Privacy Guard:** Enforces strict authorization. Unless the caller is a global `ADMIN`, staff can only view student diagnostics if:


1. They share an identical `orgId` with the student, OR


2. An active `TutorStudentLink` (`status: ACTIVE`) directly connects the tutor and student.







---

### `actions/passwordReset.ts`

* **Purpose & Scope:** Secure self-service password reset pipeline generating hashed single-use tokens.


* **Exports:**
* `requestPasswordReset(email: string): Promise<{ success: boolean }>`


* `resetPasswordWithToken(token: string, newPassword: string): Promise<{ success: boolean; email: string }>`




* **Parameters / Props:**
* `requestPasswordReset`: `email` (`string`).


* `resetPasswordWithToken`: `token` (`string`), `newPassword` (`string`).




* **Return Value / Emitted State:** Status indicators.


* **Dependencies & Imports:**
* `prisma` from `@/lib/prisma`, `crypto` from `crypto`, `bcrypt` from `bcryptjs`.




* **Key Logic & Edge Cases:**
* **Anti-Enumeration Guard:** `requestPasswordReset` returns `{ success: true }` even if the email does not exist in the database, preventing user discovery scans.


* **Token Invalidation & Expiry:** Tokens expire after 1 hour. Requesting a new token invalidates previous tokens for that profile.


* **Atomic Transaction:** In `resetPasswordWithToken`, the password update and the token deletion run in a single `prisma.$transaction` to prevent replay attacks.





---

### `actions/reporting.ts`

* **Purpose & Scope:** Aggregates macro-level diagnostic analytics across an entire student cohort or tutoring practice.


* **Exports:**
* `getCohortAnalytics(categoryFilter?: string): Promise<CohortAnalyticsSummary>`




* **Parameters / Props:**
* `categoryFilter` (`string`, optional): Target exam category (`"SAT"`, `"ACT"`, etc.) or `"ALL"`.




* **Return Value / Emitted State:**
* `CohortAnalyticsSummary`: `{ totalAttempts, averageComposite, averageTimeSpentSeconds, domainAccuracy }`.




* **Dependencies & Imports:**
* `prisma` from `@/lib/prisma`.


* `requireStaffSession` from `@/lib/guards`.


* `Role`, `LinkStatus` from `@prisma/client`.




* **Key Logic & Edge Cases:**
* **Cohort Aggregation:** Computes average composite scores across `TestSummary` rows and derives mean per-question interaction times from question-level `Response` rows.


* **Tenant Boundary:** Restricts aggregation queries strictly to student IDs within the caller's organization or active private mentorship links.