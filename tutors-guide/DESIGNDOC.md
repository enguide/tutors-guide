# Comprehensive Architecture & Refactoring Specification: Markdown-First Test Platform

## 1. Executive Summary & Objectives

This project shifts the platform from a database-heavy, fragmented block architecture to a **Markdown-first architecture**.

- **Primary Goal:** Eliminate content production friction, remove complex relational joins for test blocks, establish a robust local-first autosave system with cross-device draft checkpoints, and provide enterprise-grade edge security, peer mentorship delegation, and flexible B2C/B2B Stripe fulfillment.

- **Tech Stack:** Next.js (App Router, Dynamic I/O), React, TypeScript, Prisma (PostgreSQL), NextAuth, Stripe (Embedded Checkout & Webhooks), `react-markdown`, `remark-math`, and `rehype-katex`.

---

## 2. Content & Authoring Pipeline

### A. File System Structure

Test materials are authored as standard Markdown (`.md`) files with rich YAML frontmatter, co-located static assets, and manifest manifests version-controlled directly in the repository:

```text
content/
└── tests/
    └── sat/
        └── sat-practice-1/
            ├── metadata.json
            ├── section-1-reading.md
            ├── section-2-math.md
            └── assets/
                ├── salt-marsh-sediment-chart.webp
                └── coordinate-triangle.svg
```

The accompanying `metadata.json` defines test-level indexing, asset resolution base paths, and runtime section UI/tool configs:

```json
{
  "id": "sat-practice-1",
  "title": "Digital SAT Practice Test 1",
  "category": "SAT",
  "description": "Full-length official style diagnostic SAT exam with vector and raster stimuli.",
  "assetBasePath": "/content/tests/sat/sat-practice-1/assets",
  "sections": [
    {
      "id": "sat-practice-1-s1",
      "file": "section-1-reading.md",
      "order": 1,
      "title": "Reading and Writing - Module 1",
      "timeLimit": 1920,
      "config": {
        "layout": "split-passage",
        "calculator": "none"
      }
    },
    {
      "id": "sat-practice-1-s2",
      "file": "section-2-math.md",
      "order": 2,
      "title": "Math - Module 1",
      "timeLimit": 2100,
      "config": {
        "layout": "single-column",
        "calculator": "desmos-graphing",
        "hasFormulaSheet": true
      }
    }
  ]
}
```

### B. Standardized Markdown Format

Each section combines comprehensive frontmatter telemetry (scoring keys, domain/skill tags, difficulty tiers, question prompts, explanations, and options) with a markdown body containing passage stimuli, co-located asset references, and standard LaTeX math syntax (`$...$` and `$$...$$`):

```markdown
---
sectionId: "sat-practice-1-s1"
sectionTitle: "Reading and Writing - Module 1"
sectionOrder: 1
timeLimit: 1920
questions:
  - id: "sat-p1-rw-001"
    questionNumber: 1
    questionType: "MC"
    correctAnswer: "B"
    domain: "Craft and Structure"
    skill: "Words in Context"
    difficulty: "Medium"
    prompt: "Which choice best completes the text with the most logical and precise word or phrase?"
    explanation: "The text explains that continuous sediment deposition has protected salt marshes from erosion. 'Fortified' accurately conveys making something more resilient against natural decay or storm surges."
    options:
      - id: "A"
        text: "diminished"
      - id: "B"
        text: "fortified"
      - id: "C"
        text: "obscured"
      - id: "D"
        text: "stagnated"
---

### Passage Context

Recent studies on coastal salt marshes reveal an unexpected resilience to fluctuating sea levels. Although early models predicted catastrophic shoreline retreat, empirical observations demonstrate that continuous sediment deposition has substantially **fortified** these natural seawalls against persistent storm surges.

![Sediment Accumulation & Shoreline Elevation](./assets/salt-marsh-sediment-chart.webp)

As depicted in the accompanying field measurements, annual accretion rates have accelerated over the past quarter-century, challenging prior paleoclimatological projections.
```

### C. Content Parser & Renderer

- **Loader (`lib/contentLoader.ts`)**: Reads `metadata.json` manifests and uses `gray-matter` to parse section markdown frontmatter and passage stimuli dynamically, caching results in-memory with React's `cache()`.
- **Renderer (`MarkdownQuestionRenderer.tsx`)**: Renders passage stimuli, prompts, and option text using `react-markdown`, `remark-math`, and `rehype-katex`. Rewrites relative `./assets/` paths dynamically to the public asset route defined in the manifest.

---

## 3. Database Architecture (Prisma & PostgreSQL)

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  STUDENT
  TUTOR
  ORG_ADMIN
  ADMIN
  PARENT
}

enum ClassYear {
  FRESHMAN
  SOPHOMORE
  JUNIOR
  SENIOR
  OTHER
}

enum Category {
  NONE
  SAT
  ACT
  AP_CALC
  GRE
  ACADEMIC
}

enum QuestionType {
  MC
  FR
}

enum EnrollmentStatus {
  ACTIVE
  REVOKED
  EXPIRED
}

enum LinkStatus {
  PENDING
  ACTIVE
  REVOKED
}

model Organization {
  id               String        @id @default(cuid())
  name             String
  stripeCustomerId String?       @unique
  members          Profile[]     @relation("OrgProfiles")
  licensePools     LicensePool[] @relation("OrgLicensePools")
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@index([stripeCustomerId])
  @@map("Organization")
}

model School {
  id        String    @id @default(cuid())
  name      String
  members   Profile[] @relation("SchoolProfiles")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("School")
}

model Profile {
  id                     String         @id @default(cuid())
  firstName              String
  lastName               String
  email                  String         @unique
  password               String
  classYear              ClassYear
  role                   Role           @default(STUDENT)
  school                 School?        @relation("SchoolProfiles", fields: [schoolId], references: [id])
  schoolId               String?
  org                    Organization?  @relation("OrgProfiles", fields: [orgId], references: [id])
  orgId                  String?
  
  // Directly purchased pools
  ownedLicensePools      LicensePool[]  @relation("PurchaserLicensePools")
  
  // Active entitlements
  enrollments            Enrollment[]   @relation("ProfileEnrollments")

  responses              Response[]     @relation("ProfileResponses")
  results                Result[]       @relation("ProfileResults")
  summaries              TestSummary[]  @relation("ProfileSummaries")

  // Live in-flight section checkpoints (draft state before completion)
  checkpoints            SectionCheckpoint[] @relation("ProfileCheckpoints")

  // Peer-to-peer mentorship delegation (Epic 13)
  tutoredStudents        TutorStudentLink[] @relation("TutorLinks")
  studentTutors          TutorStudentLink[] @relation("StudentLinks")

  twoFactorAuthSecret    String?
  twoFactorAuthActivated Boolean?
  createdAt              DateTime       @default(now())
  updatedAt              DateTime       @updatedAt

  @@index([email])
  @@index([orgId])
  @@map("Profile")
}

model TutorStudentLink {
  id          String     @id @default(cuid())
  status      LinkStatus @default(PENDING)

  // The Tutor receiving observation rights
  tutorId     String
  tutor       Profile    @relation("TutorLinks", fields: [tutorId], references: [id], onDelete: Cascade)

  // The Student granting telemetry access
  studentId   String
  student     Profile    @relation("StudentLinks", fields: [studentId], references: [id], onDelete: Cascade)

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@unique([tutorId, studentId])
  @@index([tutorId])
  @@index([studentId])
  @@map("TutorStudentLink")
}

// -------------------------------------------------------------
// ENTITLEMENTS & BILLING
// -------------------------------------------------------------

model LicensePool {
  id                   String        @id @default(cuid())
  name                 String
  stripeSessionId      String?       @unique
  stripeSubscriptionId String?
  seatLimit            Int           @default(1)
  categories           Category[]
  startsAt             DateTime      @default(now())
  expiresAt            DateTime
  
  purchaserId          String?
  purchaser            Profile?      @relation("PurchaserLicensePools", fields: [purchaserId], references: [id], onDelete: SetNull)
  orgId                String?
  org                  Organization? @relation("OrgLicensePools", fields: [orgId], references: [id], onDelete: Cascade)

  enrollments          Enrollment[]  @relation("PoolEnrollments")
  inviteCode           String?       @unique

  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  @@index([purchaserId])
  @@index([orgId])
  @@index([inviteCode])
  @@map("LicensePool")
}

model Enrollment {
  id              String           @id @default(cuid())
  status          EnrollmentStatus @default(ACTIVE)
  
  profileId       String
  profile         Profile          @relation("ProfileEnrollments", fields: [profileId], references: [id], onDelete: Cascade)
  
  licensePoolId   String
  licensePool     LicensePool      @relation("PoolEnrollments", fields: [licensePoolId], references: [id], onDelete: Cascade)
  
  firstAccessedAt DateTime?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  @@unique([profileId, licensePoolId])
  @@index([profileId])
  @@index([licensePoolId])
  @@map("Enrollment")
}

// -------------------------------------------------------------
// EXAM CORE & TELEMETRY
// -------------------------------------------------------------

model Test {
  id          String        @id @default(cuid())
  title       String
  category    Category      @default(NONE)
  sections    Section[]     @relation("TestSections")
  responses   Response[]    @relation("TestResponses")
  results     Result[]      @relation("ResultTests")
  summaries   TestSummary[] @relation("TestSummaries")

  @@map("Test")
}

model Section {
  id           String     @id @default(cuid())
  title        String
  sectionOrder Int
  timeLimit    Int
  testId       String
  test         Test       @relation("TestSections", fields: [testId], references: [id], onDelete: Cascade)
  responses    Response[] @relation("SectionResponses")
  results      Result[]   @relation("ResultSections")

  @@index([testId])
  @@map("Section")
}

model Response {
  id                  String       @id @default(cuid())
  isCorrect           Boolean      @default(false)
  responseOrder       Int
  sectionOrder        Int
  timeSpentOnResponse Int?         @default(0)
  questionId          String       
  responseType        QuestionType @default(MC)
  selectedOptionId    String?
  frqUserAnswer       String?
  correctAnswerKey    String
  usedCalculator      Boolean      @default(false)
  changedAnswer       Boolean      @default(false)
  profileId           String
  profile             Profile      @relation("ProfileResponses", fields: [profileId], references: [id], onDelete: Cascade)
  testId              String
  test                Test         @relation("TestResponses", fields: [testId], references: [id], onDelete: Cascade)
  sectionId           String
  section             Section      @relation("SectionResponses", fields: [sectionId], references: [id], onDelete: Cascade)

  @@unique([profileId, questionId])
  @@index([profileId, testId])
  @@map("Response")
}

// -------------------------------------------------------------
// CHECKPOINTS (In-Flight Draft State for Cross-Device Resumption)
// -------------------------------------------------------------

model SectionCheckpoint {
  id                   String   @id @default(cuid())
  timeRemainingSeconds Int
  lastQuestionIndex    Int      @default(0)
  navigationHistory    Json?
  clientUpdatedAt      DateTime @default(now())

  profileId            String
  profile              Profile  @relation("ProfileCheckpoints", fields: [profileId], references: [id], onDelete: Cascade)

  testId               String
  sectionId            String

  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@unique([profileId, testId, sectionId])
  @@index([profileId])
  @@map("SectionCheckpoint")
}

// -------------------------------------------------------------
// RESULTS (Immutable Finalized Scores)
// -------------------------------------------------------------

model Result {
  id                   String   @id @default(cuid())
  numCorrect           Int      @default(0)
  totalQuestions       Int      @default(0)
  rawScore             Int      @default(0)
  scaledScore          Int?     
  timeRemainingSeconds Int      @default(0)
  navigationHistory    Json?    
  accommodations       Json?    
  testTitle            String
  completedAt          DateTime @default(now())

  profileId            String
  profile              Profile  @relation("ProfileResults", fields: [profileId], references: [id], onDelete: Cascade)
  testId               String
  test                 Test     @relation("ResultTests", fields: [testId], references: [id], onDelete: Cascade)
  sectionId            String
  section              Section  @relation("ResultSections", fields: [sectionId], references: [id], onDelete: Cascade)

  @@unique([testId, profileId, sectionId])
  @@index([profileId])
  @@map("Result")
}

model TestSummary {
  id             String    @id @default(cuid())
  testId         String
  test           Test      @relation("TestSummaries", fields: [testId], references: [id], onDelete: Cascade)
  profileId      String
  profile        Profile   @relation("ProfileSummaries", fields: [profileId], references: [id], onDelete: Cascade)
  testTitle      String
  category       Category  @default(NONE)
  compositeScore Int?
  percentile     String?   
  completedAt    DateTime  @default(now())

  @@unique([testId, profileId])
  @@index([profileId])
  @@map("TestSummary")
}

model PasswordResetToken {
  id          String   @id @unique @default(cuid())
  profileId   String
  token       String   @unique
  tokenExpiry DateTime

  @@index([token])
  @@map("PasswordResetToken")
}
```

---

## 4. State Resilience, Cross-Device Resumption & Autosave Architecture

1. **Local-First Client Buffer (`localStorage`):** 
   - Instant local writes capture option selections, math inputs, and timer ticks synchronously, protecting students against network dropouts and browser tab crashes.
2. **Dual-Channel Background Sync:**
   - **Question Responses:** Debounced server action calls (`autosaveResponse`) leverage Prisma's composite unique constraint (`@@unique([profileId, questionId])`) to upsert individual question telemetry quietly in the background.
   - **Section Checkpoint:** Periodically (and upon question navigation), `saveSectionCheckpoint` commits the current section draft (`timeRemainingSeconds`, `lastQuestionIndex`, `navigationHistory`) to `SectionCheckpoint`.
3. **Bi-Directional Timestamp Reconciliation:**
   - On exam mount (`useTestProgress.ts`), the client compares `localState.lastSavedAt` against `serverCheckpoint.clientUpdatedAt`.
   - **Device Switch (e.g. Tablet $\rightarrow$ Laptop):** If local cache is empty or older than the database checkpoint, the client hydrates its entire state from PostgreSQL and writes the snapshot into local storage.
   - **Network Restoration:** If local storage is newer (e.g. student answered questions offline), the client drains its local offline queue and updates PostgreSQL to match local storage.
4. **Atomic Final Submission & Garbage Collection:**
   - Section finalization (`completeTestSection`) calculates scores, creates the immutable `Result` record, and deletes the `SectionCheckpoint` draft row in a single atomic database transaction.

---

## 5. Security & Tenancy Architecture

- **Edge Proxy Route Protection (`proxy.ts`):** Enforces strict role-based separation:
  - `STUDENT` accounts are barred from administrative portals (`/tgadmin`).
  - `ORG_ADMIN` and `TUTOR` accounts are barred from live exam runners (`/tests/...`) and student dashboards (`/dashboard`), redirecting staff directly to `/tgadmin`.
  - Protected routes redirect unauthenticated users to `/login`.
- **Compound Inspection Authorization Rule:**
  - Diagnostic review routes (`/tests/[category]/[testId]/results?studentId=...`) allow staff inspection if and only if:
    1. Caller is super-admin (`Role.ADMIN`), OR
    2. Caller and student share an institutional `orgId`, OR
    3. Caller holds an active peer-to-peer `TutorStudentLink` (`LinkStatus.ACTIVE`).
- **Context-Aware Navigation Shell:**
  - When inspecting a student, staff accounts render `<StaffInspectionBar/>` with dedicated return links to `/tgadmin/student/[studentId]`.
  - When students view their own exam results, they render `<StudentNavbar/>`.

---

# Completed Production Epics

---

## Epic 13: Peer-to-Peer Mentorship Links & Independent Tutor Delegation

*Goal: Decouple diagnostic observability from strictly top-down institutional contracts, enabling independent students and private tutors to establish sovereign, consent-driven observation links without organizational license pools or shared tenant IDs.*

### Completed Deliverables:
* **Task 13.1 (Schema & Migration):** Deployed `TutorStudentLink` model with `LinkStatus` enum (`PENDING`, `ACTIVE`, `REVOKED`) and corresponding relations on `Profile`.
* **Task 13.2 (Dual-Initiation Workflow Engine):** Built `actions/mentorship.ts` containing:
  - `getOrCreateTutorInviteLink()`: Generates shareable claim links (`/link-tutor?tutorId=...`).
  - `requestMentorConnection()`: Student-initiated invitation by verified tutor email.
  - `acceptTutorInvite()`: Immediate student link confirmation via share links.
  - `respondToMentorshipRequest()`: Dual-state acceptance/rejection transitions.
  - `revokeMentorshipAccess()`: Unilateral revocation enforcing student data sovereignty.
* **Task 13.3 (Tenancy Guard Evolution):** Updated `actions/observability.ts`, `app/api/tgadmin/export-csv/route.ts`, and `app/tests/.../results/page.tsx` with compound authorization logic.
* **Task 13.4 (Student & Tutor Observability UI):**
  - Built `/settings/mentors` with `<MentorsManager/>` for student permission management.
  - Built `/link-tutor` with `<TutorConsentCard/>` for explicit observation disclosure.
  - Updated `<RosterTable/>` on `/tgadmin` with `Direct Mentorship` attribution badges and suppressed institutional seat revocation buttons on direct students.
  - Integrated `<TutorInviteShareBox/>` into `/tgadmin` for one-click tutor code sharing.

---

## Epic 14: Student Command Center & Modular Preparation Diagnostics

*Goal: Transform the student dashboard from a passive test catalog into an actionable, low-friction preparation command center. Provide modular, client-side and telemetry-driven widgets that foster momentum, prevent diagnostic burnout, pinpoint high-yield skill deficits, and ground student preparation in tangible horizons.*

### Completed Deliverables:

* **Task 14.1: Horizon & Target Score Runway Modules:**
  - Built `ExamCountdownWidget.tsx`: Calibrated calm preparation timeline displaying days remaining, study weeks, and milestone phase descriptors (*Foundations*, *Skill Mastery*, *Peak Simulation*, *Final Taper*). Built with zero-cascading-render standards (`useSyncExternalStore`) and scoped to active test categories.
  - Built `ScoreTargetGauge.tsx`: Compares student diagnostic composite baselines against target goals, displaying point gaps ($\Delta$) and admissions benchmark tiers.

* **Task 14.2: Diagnostic Cadence & Test Readiness Spacing Engine:**
  - Built `DiagnosticCadenceCard.tsx`: Advises students on whether today is for reviewing errors (0–3 days post-test), drilling weak skills (4–8 days), taking their next diagnostic (9–14 days), or conserving energy (taper active).

* **Task 14.3: Domain Mastery & Behavioral Telemetry:**
  - Built `PrioritySkillFocusCard.tsx`: Identifies top 3 high-yield weak skills from recent question responses and section frontmatter.
  - Built `RevisionAuditWidget.tsx`: Evaluates `Response.changedAnswer` telemetry to quantify whether second-guessing answers helps or hurts student accuracy.

* **Task 14.4: Consistency & Diagnostic Momentum Tracker:**
  - Built `PrepMomentumTracker.tsx`: Visualizes completed diagnostic milestones along an architectural linear timeline track, tracking total questions answered, timed hours logged, and mean question pacing.
  - Built `StudyInvestmentWidget.tsx`: Bridges official in-app diagnostic testing hours with a student-logged external study bank, displaying dual-tone progress toward overall prep hour goals.

* **Task 14.5: Student Navigation Shell & Multi-Program Isolation:**
  - **Three-Tier Navigation Layout:** Separated into **Command Center** (`/dashboard`), **Diagnostic Library** (`/dashboard/tests`), and **Diagnostic History** (`/dashboard/results`).
  - **Program Tab Switcher (`ProgramTabSwitcher.tsx`):** Scopes the entire dashboard to `?program=SAT` vs. `?program=ACT`, isolating test manifests, database queries, and local storage keys (`target_exam_date_${program}`, `study_target_hours_${program}`) to eliminate cross-program data corruption.
  - **Modular Tile Architecture:** Extracted `<NextRecommendedHeroCard/>`, `<RecentPerformanceCard/>`, and `<QuickNavTiles/>` into independent components.
  - **In-Progress Resumption Detection:** Visualizes in-flight tests on both the dashboard hero card and testing library cards with blue `In Progress` status pills and direct **"Resume Exam"** action routes.

---

## Epic 15: Cross-Device Draft Resilience & Checkpoint Engine

*Goal: Ensure students can seamlessly transition between devices mid-section (e.g. tablet to laptop) with zero progress loss, maintaining in-flight timers, active question pointers, and navigation history without corrupting immutable final result tables.*

### Completed Deliverables:
* **Task 15.1: Section Checkpoint Relational Model:**
  - Deployed `SectionCheckpoint` in Prisma with composite unique constraint `@@unique([profileId, testId, sectionId])`.
  - Integrated `saveSectionCheckpoint` action in `actions/autosave.ts`.
  - Integrated automated draft cleanup inside `actions/completeTestSection.ts`.
* **Task 15.2: Bi-Directional Client Reconciliation Engine:**
  - Upgraded `hooks/useTestProgress.ts` with pure lazy state initialization comparing local storage timestamps against server checkpoint timestamps.
  - Synchronizes tablet answers and remaining seconds to laptop on mount.
  - Periodically checkpoints timer and navigation history to PostgreSQL during live exams.
* **Task 15.3: Server Loaders & Mid-Exam Resume Coordination:**
  - Updated section runner loader (`app/tests/.../[sectionId]/page.tsx`) to query and forward `serverCheckpoint` and `serverResponses` into `<ExamClient/>`.
  - Updated root test resume coordinator (`app/tests/[category]/[testId]/page.tsx`) to prioritize active in-flight draft sections before defaulting to section 1.

---

# Epic 16: Optical Free-Response Question (FRQ) Ingestion & Slicing Pipeline

## 1. Executive Summary & Architectural Overview

Epic 16 implements an optical ingestion, document geometry alignment, and sub-part slicing pipeline designed for handwritten Free-Response Questions (FRQs) in collegiate and advanced high-school examinations (specifically modeled after the AP Calculus AB physical booklet format).

### Core Paradigm Shift: In-Exam vs. Post-Exam Ingestion

* **In-Exam Focus:** During active testing, students write exclusively on their physical response packet. All intrusive in-test camera popovers, live QR code feeds, and premature capture steps have been removed from the exam view (`QuestionOptions.tsx`). Students are provided non-blocking physical packet directives indicating the exact booklet page numbers for each question.

* **Post-Section Batch Ingestion:** When the section timer expires or when the student initiates section submission (`SectionReviewModal.tsx`), the student is presented with a unified **Batch Ingestion Drawer** (`SectionCaptureModal.tsx`). A single section-level tokenized session coordinates rapid, continuous multi-page uploads without interrupting the test attempt.

## 2. Physical Document Geometry & Layout Architecture

The system coordinates directly with the LaTeX exam booklet layout (`APCalculusABFRQPDF.tex`):

* **Per-Question Architecture:** Each FRQ corresponds to **2 physical sheets** (4 sub-parts total):

  * **Sheet 1 (`pageNumber: 1`):** Sub-parts **A** and **B**

  * **Sheet 2 (`pageNumber: 2`):** Sub-parts **C** and **D**

* **Page Dimensions:** US Letter ($215.9\,\text{mm} \times 279.4\,\text{mm}$)

* **Normalized Coordinate Bounding Boxes:**

  * Box Width: $x \in [20\,\text{mm}, 195\,\text{mm}] \implies 175\,\text{mm}$ ($\approx 81.05\%$ of sheet width)

  * Sub-Part 1 (Part A or C): $y \in [40\,\text{mm}, 139\,\text{mm}] \implies 99\,\text{mm}$ ($\approx 35.43\%$ of sheet height)

  * Sub-Part 2 (Part B or D): $y \in [139\,\text{mm}, 239\,\text{mm}] \implies 100\,\text{mm}$ ($\approx 35.79\%$ of sheet height)

* **Optical Routing Barcode:** Located in the bottom-right footer quadrant ($x \ge 60\%$, $y \ge 75\%$).

  * Format: `EXAM:AB_2026;Q:<question_num>;PG:<page_num>;PARTS:<subparts>`

  * Enables client-side (`jsQR`) and server-side (`Sharp + jsQR`) optical classification without requiring manual question association.

## 3. Data Model & Database Schema

The Prisma data model links multi-page submissions across an entire exam section attempt without overwriting:

```
enum FrqSubmissionStatus {
  PENDING_INGESTION
  UPLOADED
  CROPPED
  PENDING_AUDIT
  EVALUATED
  FAILED
}

enum CaptureSessionStatus {
  ACTIVE
  CAPTURED
  EXPIRED
}

model FrqSubmission {
  id               String              @id @default(cuid())
  status           FrqSubmissionStatus @default(PENDING_INGESTION)

  // Cloud storage pointers for master scan
  fullSheetUrl     String?
  storageKey       String?
  mimeType         String?
  fileSizeBytes    Int?

  // Document geometry & verification
  pageNumber       Int                 @default(1) // 1 = Parts A & B; 2 = Parts C & D
  detectedExamCode String?
  detectedQuestion Int?

  profileId        String
  profile          Profile             @relation("ProfileFrqSubmissions", fields: [profileId], references: [id], onDelete: Cascade)
  testId           String
  test             Test                @relation("TestFrqSubmissions", fields: [testId], references: [id], onDelete: Cascade)
  sectionId        String
  section          Section             @relation("SectionFrqSubmissions", fields: [sectionId], references: [id], onDelete: Cascade)
  questionId       String

  // Batch Session Link
  captureSessionId String?
  captureSession   CaptureSession?     @relation("SessionSubmissions", fields: [captureSessionId], references: [id], onDelete: SetNull)

  crops            FrqSubCrop[]        @relation("SubmissionCrops")

  capturedAt       DateTime            @default(now())
  createdAt        DateTime            @default(now())
  updatedAt        DateTime            @updatedAt

  @@unique([profileId, testId, sectionId, questionId, pageNumber])
  @@index([profileId, testId, sectionId])
  @@index([questionId])
  @@index([captureSessionId])
  @@map("FrqSubmission")
}

model FrqSubCrop {
  id              String        @id @default(cuid())
  subPartLabel    String        // "A", "B", "C", "D"
  cropUrl         String
  storageKey      String
  bbox            Json?         // Normalized { x, y, w, h }

  // Transcription & Grading Telemetry
  transcription   String?
  pointsAwarded   Float?        @default(0)
  pointsPossible  Float         @default(1.0)
  rubricBreakdown Json?

  // Human-in-the-Loop Audit Queue
  needsHumanAudit Boolean       @default(false)
  auditReason     String?
  reviewedById    String?
  reviewedBy      Profile?      @relation("StaffAuditedCrops", fields: [reviewedById], references: [id], onDelete: SetNull)
  reviewedAt      DateTime?
  reviewerNotes   String?

  frqSubmissionId String
  frqSubmission   FrqSubmission @relation("SubmissionCrops", fields: [frqSubmissionId], references: [id], onDelete: Cascade)

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([frqSubmissionId])
  @@index([needsHumanAudit])
  @@index([reviewedById])
  @@map("FrqSubCrop")
}

model CaptureSession {
  id              String               @id @default(cuid())
  sessionToken    String               @unique
  status          CaptureSessionStatus @default(ACTIVE)

  profileId       String
  profile         Profile              @relation("ProfileCaptureSessions", fields: [profileId], references: [id], onDelete: Cascade)
  testId          String
  sectionId       String
  questionId      String?              // Optional: session covers section batch ingestion

  frqSubmissions  FrqSubmission[]      @relation("SessionSubmissions")

  expiresAt       DateTime
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt

  @@index([sessionToken])
  @@index([profileId, testId, sectionId])
  @@map("CaptureSession")
}

```

## 4. End-to-End Pipeline & Component Workflows

```
[Exam Section Running]
         │
         ▼
[Timer Finishes / Finish Section Clicked]
         │
         ▼
[SectionReviewModal Intercepts] ──(Contains FRQ_HANDWRITTEN)──► [SectionCaptureModal Mounts]
                                                                        │
               ┌────────────────────────────────────────────────────────┴────────────────────────────────────────┐
               ▼                                                                                                 ▼
     [Mobile QR Scanner Handoff]                                                                      [Desktop Direct File Upload]
     • Student scans session QR on mobile                                                             • Manual upload icon per sheet
     • Mobile loads /scan/[token]                                                                     • S3 Presigned URL + Finalize
     • Rear camera stream with CV guidance                                                                       │
     • Auto-detects footer QR (Q#, Sheet#)                                                                       │
     • Slices & uploads directly to S3                                                                           │
               │                                                                                                 │
               └────────────────────────────────────────┬────────────────────────────────────────────────────────┘
                                                        │
                                                        ▼
                                         [Real-Time SSE Stream Active]
                                         • /api/capture/[token]/events
                                         • Checkbox updates per question & sheet
                                                        │
                                                        ▼
                                             [Complete Section]
                                                        │
                                                        ▼
                                            [actions/completeTestSection]
                                            • Aggregates across Sheet 1 & Sheet 2
                                            • Sums earned points & transcriptions
                                            • Cleans SectionCheckpoint & routes

```

### 1. In-Exam Non-Blocking Directives (`QuestionOptions.tsx`)

* Detects `question.questionType === "FRQ_HANDWRITTEN"`.

* Calculates exact booklet page ranges based on question number:
  

  $$
  \text{Page Start} = (q_{\text{num}} - 1) \times 2 + 4
  $$

  $$
  \text{Page End} = \text{Page Start} + 1
  $$

* Displays calm physical packet directions; hides all camera, upload, and sync mechanics during testing.

### 2. Batch Capture Handoff (`SectionCaptureModal.tsx`)

* Generates a single tokenized `CaptureSession` for the entire section.

* Displays a 2-column checklist:

  * Left: Mobile QR connection card.

  * Right: Sheet checklist (Sheet 1: Parts A/B, Sheet 2: Parts C/D) with status indicators and desktop upload buttons.

* Subscribes to Server-Sent Events (`/api/capture/[token]/events`) to reflect uploads live as they are processed.

### 3. Continuous Mobile Scanner (`MobileCameraView.tsx` & `MobileCameraContainer.tsx`)

* Streams the rear environment camera with low-latency client-side CV checks:

  * **Blur Detection:** Laplacian variance threshold $> 95.0$.

  * **Glare Detection:** Dynamic luminance clipping check.

* **Auto-Snap:** Captures frame after 3 consecutive stable frames (\~750ms).

* **Client-Side QR Routing:** Decodes the footer barcode on canvas, extracting `questionNumber` and `pageNumber` to tag the storage key and database payload automatically.

* **Continuous Multi-Page Flow:** After each successful upload, displays "Sheet X Uploaded!" with a persistent "Scan Next Sheet" button to ingest the entire booklet in one continuous session.

### 4. Coordinate Slicing & Storage Engine (`lib/frq/cropper.ts`)

* Uses `Sharp` to download the master sheet buffer from S3/R2.

* Scans the bottom-right quad via `jsQR` as a server-side verification check.

* Computes normalized rectangular coordinates matching the LaTeX layout and exports two JPEG sub-crops at $92\%$ quality.

* Persists `FrqSubCrop` records inside an idempotent database transaction.

* Triggers asynchronous grading/evaluation telemetry and dispatches to the staff audit queue (`/tgadmin/frq-audit`) when flagged.

### 5. Aggregated Section Scoring (`actions/completeTestSection.ts`)

* Queries all `FrqSubmission` and `FrqSubCrop` records for the student and section.

* Aggregates points earned, maximum possible points, and OCR transcriptions across **both** Sheet 1 and Sheet 2 for every question.

* Upserts unified `Response` rows and commits the finalized `Result` record.

* Cleans up draft checkpoints (`SectionCheckpoint`) and evaluates the next exam route.

## 5. Verification & Operational Telemetry

During end-to-end integration verification on AP Calculus AB Practice Test 1 (Section II, Part A):

* **Upload Execution:** 4 physical sheets uploaded (Q1 Sheet 1, Q1 Sheet 2, Q2 Sheet 1, Q2 Sheet 2) with zero validation or Prisma argument errors.

* **Database Persisted State:**

  * `FrqSubmission`: 4 distinct records verified with `detectedExamCode: "AB_2026"`.

  * `FrqSubCrop`: 8 discrete crops sliced (Parts A, B, C, D across both questions) with normalized bounding boxes:
    

    $$
    \text{Width} \approx 0.8108, \quad \text{Height}_1 \approx 0.3543, \quad \text{Height}_2 \approx 0.3576
    $$

  * Transcription and point values accurately linked to child crop rows.

* **Routing:** Clean transition from section completion to Section II Part B (`ap-calc-ab-t1-s2b`) with composite scores aggregated correctly.