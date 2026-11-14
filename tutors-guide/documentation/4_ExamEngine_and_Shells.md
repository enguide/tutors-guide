# Technical Documentation: Exam Engine & Shells

This section documents the exam runtime environment, comprising the dynamic test runner route, core state orchestrator, telemetry and persistence hook, shell adapters, and category-specific emulators (Digital SAT, ACT, AP Calculus, and GRE).

---

## 1. Route Entry & Test Controller

### `app/tests/[category]/[testId]/[sectionId]/page.tsx`

* **Purpose & Scope:** Dynamic Next.js server-rendered route handler serving as the authoritative entry gate for taking or resuming an exam section. Enforces student entitlements, blocks staff accounts from test attempts, executes one-way lockouts for completed sections, and hydrates client-side state from server checkpoints and prior responses.


* **Exports:**
* `default ExamSectionPage(props: ExamPageRouteProps): Promise<JSX.Element>`


* `instant: boolean` (`false`)




* **Parameters / Props:**
* `params`: `Promise<{ category: string; testId: string; sectionId: string }>`




* **Return Value / Emitted State:** Renders `<ExamClient/>` populated with resolved section configs, metadata, markdown content, and in-flight server checkpoint state.


* **Dependencies & Imports:**
* `notFound`, `redirect` from `next/navigation`.


* `connection` from `next/server`.


* `auth` from `@/lib/auth`, `prisma` from `@/lib/prisma`.


* `getTestMetadata`, `getSectionById`, `ensureTestInDatabase` from `@/lib/contentLoader`.


* `resolveSectionConfig` from `@/lib/examConfigRegistry`.


* `ExamClient` from `@/components/exam/ExamClient`.




* **Key Logic & Edge Cases:**
* **Dynamic Runtime Opt-In:** Awaits `connection()` to opt in to dynamic execution under Next.js dynamic I/O models.


* **Role & Category Entitlement Guards:** Restricts access strictly to candidates with `Role.STUDENT` (or superadmin bypass) holding active entitlements for the requested category. Staff roles (`ORG_ADMIN`, `TUTOR`) are redirected to `/dashboard?notice=staff_restricted`.


* **Strict One-Way Submission Guard:** Queries `prisma.result.findUnique` for `testId_profileId_sectionId`. If an immutable result already exists, immediately bounces the candidate out of the section to prevent retakes.


* **Config Cascade Resolution:** Merges configuration down four levels of precedence via `resolveSectionConfig`: Category Defaults $\to$ `metadata.config` $\to$ `metadata.sections[i].config` $\to$ `frontmatter.config`.


* **State Hydration:** Concurrently fetches the latest `SectionCheckpoint` and historical `Response` records from PostgreSQL to allow seamless cross-device test resumption.





---

### `components/exam/ExamClient.tsx`

* **Purpose & Scope:** Client-side top-level coordinator for active test sessions. Manages pre-flight accessibility accommodation modals, section directions, test submission orchestration, text-to-speech audio synthesis, and modal toggling.


* **Exports:**
* `ExamClient: React.FC<ExamClientProps>`




* **Parameters / Props:**
* `metadata`: `TestMetadata` — Global test metadata, titles, and scoring configurations.


* `section`: `ParsedSection` — Parsed section frontmatter and stimulus content.


* `effectiveConfig`: `SectionExamConfig` — Cascade-resolved tool and layout flags.


* `category?`: `string` (defaults to `metadata.category`).


* `testId?`: `string` (defaults to `metadata.id`).


* `studentName?`: `string` — Logged-in student's display name.


* `serverCheckpoint?`: `ServerCheckpointData | null` — Database checkpoint if resuming.


* `serverResponses?`: `ServerResponseRecord[]` — Prior saved question answers.




* **Return Value / Emitted State:** Renders `<ExamErrorBoundary>` wrapping `<TestShellLayout>`, `<CalculatorToolbar>`, `<FormulaSheetModal>`, `<SectionReviewModal>`, `<TestPreFlightModal>`, and `<SectionDirectionsModal>`.


* **Dependencies & Imports:**
* `useRouter` from `next/navigation`.


* `useTestProgress` from `@/hooks/useTestProgress`.


* `useTextToSpeech` from `@/hooks/useTextToSpeech`.


* `completeTestSection` from `@/actions/completeTestSection`.


* `TestShellLayout` from `./shells/TestShellLayout`.




* **Key Logic & Edge Cases:**
* **Hydration Guard:** Uses `useSyncExternalStore` (`emptySubscribe`) to prevent React hydration mismatch flickering during initial client render.


* **Accommodations Multiplier Integration:** Computes `effectiveTimeLimitSeconds = frontmatter.timeLimit * accommodations.timeMultiplier`. When accommodations are confirmed in `<TestPreFlightModal>`, resets the running timer via `resetTimeLimit` and writes settings to `localStorage`.


* **Submission Routing Matrix:** Upon `completeTestSection` resolution:
* If `result.isTestComplete` or no `nextSectionId`: Clears test storage buffers and routes to results page (`/tests/[category]/[testId]/results`).


* If `result.isIntermission`: Routes to the scheduled break screen (`/tests/[category]/[testId]/break`).


* Otherwise: Advances to the next section module (`/tests/[category]/[testId]/[nextSectionId]`).







---

## 2. Core State & Telemetry Hook

### `hooks/useTestProgress.ts`

* **Purpose & Scope:** The central state engine for active test administration. Controls the countdown clock, selected answers, option elimination (cross-out), review flags, navigation timeline history, dwell time computation, and local/remote offline-resilient autosaving.


* **Exports:**
* `useTestProgress(props: UseTestProgressProps)` (Custom Hook)


* Types: `SyncStatus`, `StudentAnswers`, `NavigationHistoryEntry`, `ServerCheckpointData`, `ServerResponseRecord`




* **Parameters / Props (`UseTestProgressProps`):**
* `testId`, `sectionId`: `string`.


* `sectionOrder`, `timeLimitSeconds`: `number`.


* `questions`: `QuestionFrontmatter[]`.


* `timeExtensionMultiplier?`: `number` (defaults to `1.0`).


* `isTimerRunning?`: `boolean` (defaults to `true`).


* `onTimeExpired?`: `() => void`.


* `serverCheckpoint?`: `ServerCheckpointData | null`.


* `serverResponses?`: `ServerResponseRecord[]`.




* **Return Value / Emitted State:**
* Exposes state: `activeQuestion`, `currentIndex`, `secondsRemaining`, `answers`, `navigationHistory`, `syncStatus`, `isCrossOutMode`, `isCalculatorOpen`, `isFormulaSheetOpen`.


* Exposes actions: `setCurrentIndex`, `selectOption`, `setFrqAnswer`, `toggleEliminateOption`, `toggleFlag`, `toggleCalculator`, `markCalculatorUsed`, `getFinalizedAnswers`, `getFinalizedNavigationHistory`, `clearLocalBuffer`, `clearAllTestBuffers`, `resetTimeLimit`.




* **Dependencies & Imports:**
  * `AutosavePayload`, `CheckpointPayload` (types) from `@/app/api/exam/sync/route`.
  * `QuestionType` from `@prisma/client`.
  * `examLogger` from `@/lib/telemetry/examLogger`.
  * `calculateTimeSpentFromNavHistory` from `@/lib/telemetry/timeTracking`.

* **Key Logic & Edge Cases:**
  * **Three-Way State Reconciliation (`resolveInitialProgressState`):** Resolves state conflicts on mount between `localStorage` and PostgreSQL server checkpoints using timestamps (`lastSavedAt` vs. `clientUpdatedAt`), preserving answer selections across device switches.
  * **Wall-Clock Deadline Anchoring (`endTimeRef`):** Anchors the section deadline timestamp (`Date.now() + secondsRemaining * 1000`) when the timer starts or resets, polling every `250ms` via `Math.ceil((endTimeRef.current - Date.now()) / 1000)` so main-thread work or network activity never causes clock drift or visual stalls.
  * **Dwell Time Derivation (`calculateTimeSpentFromNavHistory`):** Computes time spent per question by summing dwell spans across `navigationHistory` step timestamps (`{ time, qIdx }`) up to total elapsed test time.
  * **Non-Blocking Coalesced Sync (`/api/exam/sync`):** Dispatches background writes via `fetch("/api/exam/sync", { method: "POST", keepalive: true })` instead of Next.js Server Actions to avoid locking the Next.js Router transition pipeline. Question answer changes debounce at `600ms` and coalesce any pending checkpoint snapshot into the same single request, while standalone navigation/heartbeat checkpoints debounce at `1500ms` (with a `10s` periodic heartbeat).
  * **Referentially Stable Action Handlers (`latestRef`):** Stores volatile state (`secondsRemaining`, `answers`, `navigationHistory`, `currentIndex`) in a ref and runs `localStorage` persistence in post-commit `useEffect` hooks so `selectOption` and navigation handlers do not recreate on every timer tick.
  * **Offline Queueing & Exponential Backoff:** When offline or on transient failure, autosave payloads accumulate in `offlineQueueRef`. Upon re-establishing connectivity (`window.addEventListener("online")`), `flushOfflineQueue` processes queued records sequentially with exponential backoff (`1s` up to `10s`), treating HTTP `409` (already submitted) as terminal.


* **Dwell Time Derivation (`deriveDwellTimesFromHistory`):** Rather than using naive interval timers, computes time spent per question by summing dwell spans across `navigationHistory` step timestamps (`{ time, qIdx }`) up to total elapsed test time.


* **Debounced Autosave & Checkpoint Pipelining:** Question answers debounce at 750ms before firing `autosaveResponse`; section checkpoints debounce at 1200ms before firing `saveSectionCheckpoint`.


* **Offline Queueing & Exponential Backoff:** When the browser goes offline, autosave payloads accumulate in `offlineQueueRef`. Upon re-establishing connectivity (`window.addEventListener("online")`), `flushOfflineQueue` processes queued records sequentially with exponential backoff.





---

## 3. Shell Layer & Layout Routing

### `components/exam/shells/TestShellLayout.tsx`

* **Purpose & Scope:** Dynamic layout router component mapping the target exam category (`SAT`, `ACT`, `AP_CALC`, `GRE`) to its dedicated test shell adapter.


* **Exports:**
* `TestShellLayout: React.FC<TestShellLayoutProps>`




* **Parameters / Props:**
* `props`: `TestShellLayoutProps` (contains category, metadata, section, effectiveConfig, state, actions).




* **Return Value / Emitted State:** Renders the matched adapter component, falling back to `BaseLayoutAdapter` if unspecified.


* **Dependencies & Imports:**
* `SATLayoutAdapter`, `ACTLayoutAdapter`, `GRELayoutAdapter`, `APLayoutAdapter`, `BaseLayoutAdapter`.




* **Key Logic & Edge Cases:** Maintains a declarative `LAYOUT_REGISTRY` mapping:
* `SAT` $\to$ `SATLayoutAdapter` (Bluebook emulation)


* `ACT` $\to$ `ACTLayoutAdapter` (TestNav emulation)


* `AP_CALC` $\to$ `APLayoutAdapter` (AP Academic emulation)


* `GRE` $\to$ `GRELayoutAdapter` (ETS PowerPrep emulation)





---

### `components/exam/shells/BaseLayoutAdapter.tsx`

* **Purpose & Scope:** Universal fallback test shell providing standard testing UI layout primitives (top header, center question area, bottom question bar) for categories without custom emulators.


* **Exports:**
* `BaseLayoutAdapter: React.FC<TestShellLayoutProps>`




* **Parameters / Props:** Standard `TestShellLayoutProps`.


* **Return Value / Emitted State:** Top `<ExamHeader/>`, middle work area switching between `<SplitPassageLayout/>` and `<SingleColumnLayout/>`, and bottom `<ExamFooter/>`.


* **Dependencies & Imports:**
* `ExamHeader`, `ExamFooter`.


* `SplitPassageLayout`, `SingleColumnLayout`.




* **Key Logic & Edge Cases:** Dynamically switches between split and single layouts based on `effectiveConfig.layout === "split-passage"` or the presence of stimulus content. Stimulus resolution prioritizes question-level frontmatter (`stimulus` or `passage`) over section-wide markdown.



---

## 4. Category-Specific Shell Emulators

### `components/exam/shells/sat/SATLayoutAdapter.tsx`

* **Purpose & Scope:** Recreates the College Board Digital SAT (Bluebook) testing interface, featuring split-pane reading passages, single-column math layouts, item action bars, and centered question popover navigation.


* **Exports:**
* `SATLayoutAdapter: React.FC<TestShellLayoutProps>`




* **Parameters / Props:** Standard `TestShellLayoutProps`.


* **Return Value / Emitted State:** Fullscreen SAT Bluebook interface with `<SATHeader/>`, serif-rendered question stimulus/stem, `<QuestionOptions variant="sat"/>`, and a 3-column sticky footer bar.


* **Dependencies & Imports:**
* `SATHeader`, `SATQuestionNavigatorPopover`.


* `MarkdownQuestionRenderer`, `QuestionOptions`.


* `ArrowLeft`, `ArrowRight`, `Bookmark` from `lucide-react`.




* **Key Logic & Edge Cases:**
* **Dynamic View Splitting:** Evaluates split view based on question frontmatter layout overrides (`layout: "split"` vs. `"single"`), falling back to `effectiveConfig.layout === "split-passage"` or stimulus presence.


* **Item Action Bar:** Houses the bold question number badge, Bluebook bookmark icon ("Mark for Review"), and the strikethrough master ABC cross-out trigger.


* **Three-Column Centered Footer:** Left column displays student identity, center renders the popover question navigator dock, and right displays Back/Next/Review Section buttons.





---

### `components/exam/shells/act/ACTLayoutAdapter.tsx`

* **Purpose & Scope:** Recreates the ACT (TestNav) interface, featuring an elevated workspace card, customizable accessibility contrast themes, and a collapsible slide-out item index drawer.


* **Exports:**
* `ACTLayoutAdapter: React.FC<TestShellLayoutProps>`




* **Parameters / Props:** Standard `TestShellLayoutProps`.


* **Return Value / Emitted State:** ACT TestNav workspace with `<ACTHeader/>`, `<ACTIndexDrawer/>`, flag buttons, and contrast theme data attributes (`data-act-theme`).


* **Dependencies & Imports:**
* `ACTHeader`, `ACTContrastTheme`, `ACTIndexDrawer`.


* `MarkdownQuestionRenderer`, `QuestionOptions`.


* `Flag`, `ChevronLeft`, `ChevronRight` from `lucide-react`.




* **Key Logic & Edge Cases:**
* **Dynamic Contrast Switcher:** Supports multiple color themes (`contrastTheme`: `"default"`, `"reverse"`, etc.) bound to the root element via `data-act-theme` for high-contrast accessibility compliance.


* **Answered Metric Counter:** Derives answered counts in real time across MC and grid-in inputs to feed the top TestNav header meter.


* **Slide-Out Drawer Coordination:** Toggles `<ACTIndexDrawer/>` via a persistent right-hand index column without disrupting question layout flow.





---

### `components/exam/shells/act/ACTIndexDrawer.tsx`

* **Purpose & Scope:** Slide-out question index drawer for the ACT testing shell, allowing students to filter questions, inspect answer statuses, and jump across items.


* **Exports:**
* `ACTIndexDrawer: React.FC<ACTIndexDrawerProps>`




* **Parameters / Props:**
* `isOpen`: `boolean`.


* `currentIndex`: `number`.


* `questions`: `QuestionFrontmatter[]`.


* `answers`: `Record<string, any>`.


* `onSelectIndex`: `(index: number) => void`.




* **Return Value / Emitted State:** Collapsible drawer containing filter dropdowns (`ALL`, `ANSWERED`, `UNANSWERED`, `BOOKMARKED`) and question cards.


* **Dependencies & Imports:**
* `Filter`, `ChevronDown`, `Flag` from `lucide-react`.




* **Key Logic & Edge Cases:**
* **Synchronized Auto-Scrolling:** Maintains a `Map<number, HTMLButtonElement>` ref registry (`itemRefs`). When the drawer opens or `currentIndex` changes, smoothly scrolls the active question card to the top of the container.


* **Prompt Sanitization:** Strips markdown formatting (`#`, `*`, `_`, `$`) and compresses whitespace to render two-line item previews inside the card list.





---

### `components/exam/shells/ap/APLayoutAdapter.tsx`

* **Purpose & Scope:** Academic layout emulator designed for Advanced Placement examinations (e.g., AP Calculus AB/BC), supporting mathematical rendering, stimulus reference contexts, and handwritten FRQ options.


* **Exports:**
* `APLayoutAdapter: React.FC<TestShellLayoutProps>`




* **Parameters / Props:** Standard `TestShellLayoutProps`.


* **Return Value / Emitted State:** Academic interface featuring `<APHeader/>`, `<APQuestionNavigatorPopover/>`, math stimulus sidebars, and `<QuestionOptions variant="ap"/>`.


* **Dependencies & Imports:**
* `APHeader`, `APQuestionNavigatorPopover`.


* `MarkdownQuestionRenderer`, `QuestionOptions`.


* `ArrowLeft`, `ArrowRight`, `Bookmark` from `lucide-react`.




* **Key Logic & Edge Cases:**
* **Section ID Pass-Through:** Forwards `sectionId` directly to `QuestionOptions`, enabling downstream Free Response components (`FrqDesktopRunner`) to coordinate QR optical capture pairing.


* **Stimulus-Aware Layout Resolution:** Checks for discrete stimuli or section-wide markdown contexts, automatically allocating a dedicated split pane for reference diagrams and graphs.





---

### `components/exam/shells/gre/GRELayoutAdapter.tsx`

* **Purpose & Scope:** Emulates the ETS GRE PowerPrep test interface, featuring the classic top toolbar, hideable clock, compact action clusters, and quantitative comparison support.


* **Exports:**
* `GRELayoutAdapter: React.FC<TestShellLayoutProps>`




* **Parameters / Props:** Standard `TestShellLayoutProps`.


* **Return Value / Emitted State:** High-density GRE interface with top-anchored controls, collapsible timer display, single-column work area, and bottom status bar.


* **Dependencies & Imports:**
* `MarkdownQuestionRenderer`, `QuestionOptions`.


* `Clock`, `Eye`, `EyeOff`, `Calculator`, `Bookmark`, `List`, `ChevronLeft`, `ChevronRight` from `lucide-react`.




* **Key Logic & Edge Cases:**
* **Timer Masking:** Features the authentic ETS PowerPrep `Eye` / `EyeOff` toggle button, masking the clock (`--:--`) to help students manage testing anxiety.


* **Top-Anchored Action Cluster:** Groups all tools (Calculator, Review List, Bookmark, Back, Next) directly in the top header toolbar rather than a bottom footer dock.
