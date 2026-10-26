````markdown
# Comprehensive Architecture & Refactoring Specification: Markdown-First Test Platform

## 1. Executive Summary & Objectives

This project shifts the platform from a database-heavy, fragmented block architecture to a **Markdown-first architecture**.

- **Primary Goal:** Eliminate content production friction, remove complex relational joins for test blocks, and establish a robust local-first autosave system with enterprise-grade edge security and flexible B2C/B2B Stripe fulfillment.

- **Tech Stack:** Next.js (App Router), React, TypeScript, Prisma (PostgreSQL), NextAuth, Stripe (Embedded Checkout & Webhooks), `react-markdown`, `remark-math`, and `rehype-katex`.

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
  - id: "sat-p1-rw-002"
    questionNumber: 2
    questionType: "MC"
    correctAnswer: "D"
    domain: "Information and Ideas"
    skill: "Command of Evidence (Quantitative)"
    difficulty: "Hard"
    prompt: "Which choice best uses data from the graph to support the researchers' conclusion regarding sediment deposition?"
    explanation: "The graph illustrates that sediment elevation increased continuously between 2000 (65mm) and 2025 (195mm), corroborating the claim that sediment accumulation outpaces shoreline erosion."
    options:
      - id: "A"
        text: "Shoreline elevation remained stagnant between 2010 and 2020."
      - id: "B"
        text: "Total sediment deposition dropped by more than 50% prior to 2010."
      - id: "C"
        text: "Sediment accumulation peaked in 2000 before declining steadily through 2025."
      - id: "D"
        text: "Sediment elevation rose continuously from 65mm in 2000 to 195mm in 2025."
---

### Passage Context

Recent studies on coastal salt marshes reveal an unexpected resilience to fluctuating sea levels. Although early models predicted catastrophic shoreline retreat, empirical observations demonstrate that continuous sediment deposition has substantially **fortified** these natural seawalls against persistent storm surges.

![Sediment Accumulation & Shoreline Elevation](./assets/salt-marsh-sediment-chart.webp)

As depicted in the accompanying field measurements, annual accretion rates have accelerated over the past quarter-century, challenging prior paleoclimatological projections.
```

Math sections follow the identical frontmatter structure, supporting math expressions and LaTeX markup within prompts, options, and explanations:

```markdown
---
sectionId: "sat-practice-1-s2"
sectionTitle: "Math - Module 1"
sectionOrder: 2
timeLimit: 2100
questions:
  - id: "sat-p1-math-001"
    questionNumber: 1
    questionType: "MC"
    correctAnswer: "C"
    domain: "Advanced Math"
    skill: "Function Notation and Evaluation"
    difficulty: "Easy"
    prompt: "If $f(x) = 3x^2 - 4x + 7$, what is the value of $f(-2)$?"
    explanation: "Substitute $-2$ for $x$: $f(-2) = 3(-2)^2 - 4(-2) + 7 = 3(4) + 8 + 7 = 12 + 8 + 7 = 27$."
    options:
      - id: "A"
        text: "11"
      - id: "B"
        text: "19"
      - id: "C"
        text: "27"
      - id: "D"
        text: "33"
---

### Module 1: Mathematics

![Coordinate Triangle Vector Diagram](./assets/coordinate-triangle.svg)

Refer to the figure above when answering question 2. The figure is drawn to scale in the standard Cartesian coordinate system.
```

### C. Content Parser & Renderer

- **Loader (`lib/contentLoader.ts`)**: Reads `metadata.json` manifests and uses `gray-matter` to parse section markdown frontmatter and passage stimuli dynamically, caching results in-memory with React's `cache()`.
- **Renderer (`MarkdownQuestionRenderer.tsx`)**: Renders passage stimuli, prompts, and option text using `react-markdown`, `remark-math`, and `rehype-katex`. Rewrites relative `./assets/` paths dynamically to the public asset route defined in the manifest.

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
  
  // Directly purchased pools (for individual students or self-serve org buyers)
  ownedLicensePools      LicensePool[]  @relation("PurchaserLicensePools")
  
  // Active entitlements (seats allocated to this student)
  enrollments            Enrollment[]   @relation("ProfileEnrollments")

  responses              Response[]     @relation("ProfileResponses")
  results                Result[]       @relation("ProfileResults")
  summaries              TestSummary[]  @relation("ProfileSummaries")
  twoFactorAuthSecret    String?
  twoFactorAuthActivated Boolean?
  createdAt              DateTime       @default(now())
  updatedAt              DateTime       @updatedAt

  @@index([email])
  @@index([orgId])
  @@map("Profile")
}

// -------------------------------------------------------------
// ENTITLEMENTS & BILLING
// -------------------------------------------------------------

model LicensePool {
  id                   String        @id @default(cuid())
  name                 String        // e.g. "Individual SAT Prep", "Apex Prep ACT Fall 2026"
  stripeSessionId      String?       @unique
  stripeSubscriptionId String?
  
  // Seat configuration: 1 for direct student purchase, X for Organization
  seatLimit            Int           @default(1)
  
  // Array of allowed categories: [SAT], [ACT], or [SAT, ACT] for bundles
  categories           Category[]
  
  // Expiration: Set to now() + 365 days at checkout
  startsAt             DateTime      @default(now())
  expiresAt            DateTime
  
  // Either an individual buyer OR an Organization owns this pool
  purchaserId          String?
  purchaser            Profile?      @relation("PurchaserLicensePools", fields: [purchaserId], references: [id], onDelete: SetNull)
  orgId                String?
  org                  Organization? @relation("OrgLicensePools", fields: [orgId], references: [id], onDelete: Cascade)

  // Students occupying seats
  enrollments          Enrollment[]  @relation("PoolEnrollments")

  // Optional join code for self-serve B2B student registration
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
  
  firstAccessedAt DateTime?        // Populated on their first test launch
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  @@unique([profileId, licensePoolId])
  @@index([profileId])
  @@index([licensePoolId])
  @@map("Enrollment")
}

// -------------------------------------------------------------
// EXAM CORE (Unchanged)
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

## 4. State Resilience & Autosave Architecture

1. **Client Buffer (`localStorage`):** Instant local updates safeguard against sudden network drops or tab closures.
2. **Background Sync:** Debounced server actions utilize Prisma's composite unique constraint (`@@unique([profileId, questionId])`) to execute `upsert` queries seamlessly during navigation.
3. **Atomic Final Submission:** Section completion triggers score calculation, writes immutable `Result` records, and flushes local storage caches.

---

## 5. Security & Access Control Architecture

- **Edge-Level Protection (`middleware.ts`):** Intercepts unauthenticated requests at the network edge using an Edge-compatible auth configuration (`auth.config.ts`), immediately redirecting unauthorized users before server rendering.
- **Server-Side Replay Prevention:** Verifies completed sections via database `Result` queries prior to rendering content, preventing clients from tampering with `localStorage` to bypass section locks.
- **Package Tier Enforcement:** Validates user subscription metadata (`Package.SAT`, `Package.ACT`) inside data-loading server actions to control feature access.

---

## 6. Stripe Payment & B2B/B2C Fulfillment Architecture

- **Embedded Checkout UI (`ui_mode: "embedded"`):** Manages secure client-side payment sessions with dynamic return paths.
- **Idempotent Webhook Fulfillment (`app/api/stripe-webhook/route.ts`):** Processes asynchronous `checkout.session.completed` events through cryptographic signature verification.
- **B2C Flow:** Direct updates to individual student profiles and memberships via atomic Prisma transactions.
- **B2B Flow:** Increments organization seat pools (`seatLimit`) and updates organization package metadata based on checkout session metadata.

---

## 7. Specialized Features, Accessibility & Analytics Integration

To ensure no legacy functionality, math tools, or analytics features are lost during the rewrite, the following systems must be explicitly mapped into the new architecture:

### A. Interactive Testing Tools & Utilities

- **Desmos Graphing Calculator (`ToggleGraph.tsx`):** Conditionally loads the Desmos calculator toolbar on relevant math sections (e.g., SAT/ACT sections 3 & 4) and updates the `usedCalculator` telemetry flag.
- **Formula Reference Sheets (`TGFormulaSheet.tsx`):** Maintained as an accessible overlay modal throughout math test modules.
- **Answer Cross-Out Mode (`isCrossOutMode`):** Preserves the interactive UI toggle enabling students to cross out elimination choices visually during an exam.

### B. Accessibility & Text-to-Speech (TTS) Pipeline

- **Audio Integration:** The custom `MarkdownQuestionRenderer` extracts clean plaintext nodes from markdown components so the browser Web Speech API (`useTextToSpeech`) can read questions aloud and handle active focus-fade/highlighting styles.

### C. Analytics, Scoring & Review Dashboard Integration

- **Data Mappers:** Server actions format query responses from the new schema (`Response` and `Result`) to match the exact data contracts expected by existing visualization components (`ACTCLIENT`, `DynamicSATTimingChart`, `DynamicSATAccuracyChart`, `DynamicSkillFocusTable`, `ReviewManager`).

### D. Migration Scripting Strategy

- **Seeding Utility:** A one-time Node.js migration script will read legacy relational tables (`Question`, `Option`, `Block`), compile them into structured `.md` files with YAML frontmatter, and populate the new `content/tests/` directory.

---

## 8. Ground-Up Production Epic Breakdown

This production epic breakdown outlines the exact sequential engineering path for building the platform entirely from scratch—starting from an empty repository, a clean database, and raw content files.

---

### Epic 1: Repository Foundation & Core Architecture Setup

_Goal: Initialize the Next.js App Router codebase, configure TypeScript, Tailwind CSS, and set up the local-first project layout._

- **Task 1.1: Project Scaffolding**
- Initialize Next.js App Router with TypeScript, Tailwind CSS, and standard directory aliases (`@/app`, `@/components`, `@/lib`, `@/utils`).

- **Task 1.2: Typography & Styling Setup**
- Install and configure `@tailwindcss/typography` plugin in `tailwind.config.ts` to enable the `.prose` class wrapper for rich text.

- **Task 1.3: Core Dependencies Installation**
- Install essential packages: `react-markdown`, `remark-math`, `rehype-katex`, `katex`, `gray-matter`, `bcryptjs`, `otplib`, `stripe`, and `lucide-react` / `react-icons`.

- **Task 1.4: Base Layout & Theme Configuration**
- Set up root layout providers (`providers.tsx`, `theme-provider.tsx`) supporting dark/light mode switching.

---

### Epic 2: Database Provisioning & Schema Deployment

_Goal: Provision a clean PostgreSQL instance and deploy the streamlined, production-grade Prisma schema supporting B2C and B2B models._

- **Task 2.1: Prisma Initialization**
- Configure `schema.prisma` with datasource URLs, connection pooling direct URLs, and client generator.

- **Task 2.2: Implement Core Models**
- Deploy models: `Organization`, `School`, `Profile` (with CUIDs and class/role enums), `Membership`, `Test`, `Section`, `Response`, `Result`, and `PasswordResetToken`.

- **Task 2.3: Establish Unique Constraints & Indexes**
- Enforce composite unique constraints on responses (`@@unique([profileId, questionId])`) to enable background upserts, and index foreign keys for telemetry performance.

- **Task 2.4: Database Seeding Script**
- Write a baseline seed script (`prisma/seed.ts`) to initialize mock test records, sections, and an admin user account.

---

### Epic 3: Authentication, Security & Stripe Billing Hardening

_Goal: Implement secure authentication, edge route protection, and Stripe embedded checkout with webhook fulfillment._

- **Task 3.1: NextAuth v5 Setup (`auth.ts` & `auth.config.ts`)**
- Configure credentials provider with bcrypt password hashing and `otplib` validation for 2FA.

- **Task 3.2: JWT Session & Role Propagation**
- Extend JWT and session callbacks to serialize user roles (`STUDENT`, `TUTOR`, `ORG`, `ADMIN`) and subscription packages (`SAT`, `ACT`, `ALL`).

- **Task 3.3: Edge Middleware Protection (`middleware.ts`)**
- Implement Next.js Edge Middleware to intercept unauthenticated requests to protected routes (`/tests/*`, `/tgadmin/*`, dashboards) and redirect to login.

- **Task 3.4: Stripe Checkout & Webhook Handlers**
- Implement embedded checkout route (`/api/payment`) and idempotent webhook fulfillment (`/api/stripe-webhook`) supporting individual user upgrades and organization seat pool increments.

---

### Epic 4: Markdown Content Pipeline & Authoring Structure

_Goal: Establish the repository-based markdown storage format and build the dynamic file-parsing service._

- **Task 4.1: Content Directory Structure**
- Create the repository layout under `content/tests/sat/` and `content/tests/act/`.

- **Task 4.2: Standardized Markdown Template**
- Define frontmatter specifications for test metadata, time limits, question IDs, and multiple-choice option keys.

- **Task 4.3: Server Content Loader (`lib/contentLoader.ts`)**
- Implement server utility functions leveraging `gray-matter` to read, parse, and validate section markdown files and frontmatter arrays.

- **Task 4.4: Markdown Question Renderer (`MarkdownQuestionRenderer.tsx`)**
- Build the core React component integrating `react-markdown`, `remark-math`, and `rehype-katex` with proper KaTeX stylesheet imports.

---

### Epic 5: Testing Interface, Interactive Tools & State Resilience

_Goal: Build the exam-taking UI, integrate local storage buffering, debounced background autosaving, and specialized math tools._

- **Task 5.1: Test Progress Hook (`useTestProgress.ts`)**
- Implement client state orchestration for active questions, timers, time extension percentages, and automatic `localStorage` synchronization.

- **Task 5.2: Background Autosave Integration**
- Create debounced server actions utilizing Prisma `upsert` queries to sync student responses quietly in the background without UI blocking.

- **Task 5.3: Specialized Math & Exam Tools**
- Integrate `ToggleGraph` (Desmos calculator toolbar), `TGFormulaSheet` modal reference sheets, and interactive answer elimination (`isCrossOutMode`).

- **Task 5.4: Accessibility & Text-to-Speech (TTS)**
- Integrate browser speech synthesis (`useTextToSpeech`) into the renderer, enabling audio read-aloud functionality and active highlight tracking.

---

### Epic 6: Results, Scoring & Review Dashboards

_Goal: Build the post-exam grading engine, immutable result creation, and multi-tab performance analytics views._

- **Task 6.1: Automated Grading & Submission Engine**
- Build server actions handling multi-choice scoring and float-tolerance calculations for free-response (FRQ) math questions.

- **Task 6.2: Immutable Result Persistence**
- Write final submission handlers that lock sections, clear local storage buffers, record navigation telemetry (JSON), and create immutable `Result` records.

- **Task 6.3: Analytics & Review Client (`ACTCLIENT.tsx`)**
- Wire up data mappers connecting database responses and results to visualization components (timing charts, accuracy breakdowns, skill focus tables, and review managers).

- **Task 6.4: End-to-End Testing & Verification**
- Conduct comprehensive testing of the entire user journey: authentication, markdown content loading, live exam timer/autosave resilience, secure section submission, Stripe checkout simulation, and analytics review.

```

```
### Key Progress & Technical Enhancements Beyond the Original Spec

#### 1. Rebuilt `UnifiedAnalyticsDashboard`
- **Component Consolidation:** Consolidated three separate, uncoordinated chart components (`DynamicSATTestResultChart`, `DynamicSATNavigationChart`, and `DynamicSATAccuracyChart`) into a single master telemetry view.
- **Design Token Fidelity:** Preserved exact brand geometry, including sharp architectural edges (`rounded-none`, `rounded-[4px]`), glassmorphism, responsive Y-axis widths, and precise brand color tokens (`#444444` for correct/median, `#ff9999` for incorrect).

#### 2. Passage-Aware Result Inspection
- **Dual-Pane Rendering:** Enhanced the question review layer to dynamically support split-layout rendering: stimulus reading passages on the left (`BookOpen`) and prompts with multiple-choice/FRQ options on the right.
- **Server-Side Data Enrichment:** Enriched database records on the server (`page.tsx`) by fusing stored user telemetry with parsed section frontmatter and markdown passage bodies.

#### 3. Two-Tier UX via `TestAnalyticsClient`
- **Unified Client Coordinator:** Built a tabbed client coordinator that seamlessly pairs **Diagnostic Telemetry** (executive pacing charts, navigation traces, and domain accuracy) with **Question Triage Review** (granular filters by Status, Difficulty, Domain, Calculator usage, and Revised answers).

#### 4. React & Next.js Architecture Hardening
- **Cascading Render Resolution:** Eliminated synchronous `setState` anti-patterns inside `useEffect` by shifting state resets directly into user interaction handlers and using collocated component mounting.
- **Hook Dependency Stabilization:** Wrapped dynamic array fallbacks (`navData`) in `useMemo` to preserve reference equality and prevent unnecessary chart recalculations across render cycles.
- **Full Lucide Migration:** Replaced fragmented `react-icons` dependencies (`md`, `io`, `tb`, `hi`) with uniform `lucide-react` icons throughout the review and analytics interfaces.

## Epic 7: Git-Bundled Production Asset Pipeline & Image Architecture

_Goal: Formalize a zero-downtime, repository-bundled content delivery pipeline for static test assets, vector diagrams, and passage illustrations—maximizing performance and version integrity without database bloat or remote storage latency._

- **Task 7.1: Git-Bundled Asset Architecture & Co-location Standards**
  - Standardize static asset directory conventions under `public/content/tests/[category]/[testId]/assets/` to ensure zero-latency co-location with Next.js container deployments.
  - Implement asset format standards: vector SVGs as the strict default for geometric diagrams, coordinate graphs, charts, and line art; modern WebP (with optimized PNG fallbacks) reserved for historical primary-source scans, fine art, and shaded photographic stimuli.
  - Establish static caching directives leveraging Next.js and CDN immutable asset delivery headers.

- **Task 7.2: Custom Image Rendering in `MarkdownQuestionRenderer`**
  - Extend `react-markdown` component overrides for `img` tags to automatically resolve relative paths (e.g., `./assets/figure-1.svg`) against the active test asset directory.
  - Wrap rendered figures in responsive, high-DPI containers supporting click-to-expand / lightbox modal inspections for detailed reading diagrams.
  - Add optional dark-mode theme adaptation (e.g., selective SVG stroke inversion or filter utilities) so black-line coordinate planes render legibly across dark and light test runner themes.

- **Task 7.3: In-Memory Content Caching & Build-Time Validation**
  - Refactor `lib/contentLoader.ts` to utilize React's `cache()` primitive to prevent redundant disk I/O reads across server components and layout passes during an active test session.
  - Build a pre-commit / build-time content validation script (`scripts/validate-content.ts`) that asserts all YAML frontmatter attributes (`id`, `correctAnswerKey`, `options`, `timeLimit`), validates markdown math syntax balance, and ensures every referenced image path resolves to an existing file in `public/`.

---

## Epic 8: Exam-Specific UI/UX Design System & Adaptive Layout Engine

_Goal: Implement category-specific testing interfaces that accurately mirror the real-world test-day interfaces for SAT (Bluebook), ACT (TestNav), AP, and GRE._

- **Task 8.1: Test UI Layout Adapter Architecture**
  - Create a modular shell architecture (`TestShellLayout`) driven by `metadata.category` (using a strategy/adapter pattern).
  - Decouple exam mechanics (timers, autosave, input handlers, accessibility hotkeys) from visual chrome (header placement, button radius, font styling, tool bars).

- **Task 8.2: SAT Presentation Mode (Bluebook Emulation)**
  - Implement the SAT visual specification: split vertical pane (Passage Left / Question Right), minimalist top timer toggle ("Hide Time"), bottom-anchored question grid popover, and sharp border tokens (`rounded-none`).
  - Integrate top navigation tools: Question Navigator, Reference Sheet drawer, and Desmos Graphing Calculator toggle (`ToggleGraph.tsx`).

- **Task 8.3: ACT Presentation Mode (TestNav Emulation)**
  - Implement the ACT visual specification: distinctive primary blue navigation toolbar, top-left "Flag for Review" control, full-width or split views, and bottom-right Next/Previous arrow controls.
  - Configure section-based tool gating (e.g., TI-84/Desmos calculator active exclusively in Math sections; native reading passage layout for English/Reading).

- **Task 8.4: AP & GRE Presentation Variants**
  - Build GRE classic presentation: top-right action bar ("Exit Section", "Review", "Mark", "Help", "Back", "Next"), single-column scrolling for reading selections, and numeric entry answer inputs.
  - Build AP presentation: clean academic typography (`STIXTwoText` / `Computer Modern`) optimized for document-based questions and multi-part problem sets.

- **Task 8.5: Universal Pre-Flight Accommodations Modal (TestPreFlightModal.tsx)**
  - (New - Step 4)Build the pre-test launch sheet / modal presented to students immediately prior to starting any test section or full-length diagnostic. 
  - Dynamically populate the accessible toggle list by executing getAvailableAccommodationsForCategory(category) using the registry established in Step 2.
  - Ensure options reflect category capabilities (e.g., ACT suppresses magnification popups, while SAT/AP allows image magnification).
  - Persist the student's chosen toggles into local attempt session state (attempt_accommodations_${testId}) without mutating global profile records.
  
- **Task 8.6: Runtime Accommodation Wiring & Attempt Telemetry Snapshot (New - Steps 3 & 5)**
  - Wire the active accommodation state into useTestProgress.ts and the exam layout adapter:   
  - Scale section timers by accommodations.timeMultiplier (e.g., $1920\text{s} \times 1.5 = 2880\text{s}$).
  - Pass enableLightbox={accommodations.imageMagnification} to <MarkdownQuestionRenderer/>.
  - Toggle Web Speech API controls (useTextToSpeech) when accommodations.textToSpeech is active.   
  - Include the active AccommodationSettings snapshot in the final submission payload, persisting it in Result.navigationHistory or attempt metadata for audit and review verification without altering the Prisma schema.   

---

## Epic 8*: Frictionless Onboarding & Automated Provisioning

### Overview

Established an automated, role-gated onboarding and entitlement lifecycle for both B2C self-enrolled students and B2B institutional cohorts. The system guarantees that post-checkout provisioning requires zero manual administrative intervention while enforcing strict separation between instructional staff and student testing surfaces.

---

### Key Deliverables & Architectural Changes

* **Automated Webhook Entitlement & Provisioning:**
* Configured Stripe webhook fulfillment to differentiate individual student purchases from institutional seat pools.
* B2C transactions provision individual user credentials and exam category entitlements immediately.
* B2B transactions generate dedicated `LicensePool` records linked to the purchaser's organization, creating unique, shareable join codes (`ORG-XXXXXX`) and managing seat capacities.


* **Secure Post-Checkout Handoff (`/checkout/success`):**
* Dynamic, server-rendered handoff utilizing Next.js 16 Dynamic IO (`await connection()` with `<Suspense>` boundaries and `export const instant = false`).
* **B2B Experience:** Surfaces organization entitlement counts, access validity windows, and the active student claim URL with one-click clipboard copying.
* **B2C Experience:** Identifies provisioned exam categories and directs new accounts straight into the credential establishment flow.


* **Tokenized Credential Setup & Password Recovery:**
* Leveraged the existing `PasswordResetToken` relational schema (`profileId`, `token`, `tokenExpiry`).
* Implemented server actions (`requestPasswordReset`, `resetPasswordWithToken`) enforcing one-hour expiration, cryptographic generation (`crypto.randomBytes`), previous token invalidation, and bcrypt password updates within an atomic Prisma transaction.
* Created `/forgot-password` and `/reset-password` UI views wrapped in client-side `<Suspense>` boundaries to handle query parameter hydration without prerender warnings.


* **Strict Role-Based Access Control (RBAC) at the Test Boundary:**
* Locked down the exam runner (`app/tests/[category]/[testId]/[sectionId]/page.tsx`).
* Enforced that `ORG_ADMIN` and `TUTOR` roles are barred from entering test sections or generating student test submissions, redirecting restricted staff accounts to `/dashboard?notice=staff_restricted`.
* Verified category entitlement verification so students can only access licensed diagnostic exams (e.g., SAT vs. ACT).


* **Next.js 16 Platform Conformance:**
* Migrated root edge logic from the deprecated `middleware.ts` to `proxy.ts` to align with Next.js 16.4+ file conventions.
* Resolved prerendering and dynamic timing errors (`Date.now()`, `searchParams`) by enforcing streaming `<Suspense>` patterns across all auth and checkout flows.

## Epic 9: Multi-Stage Adaptive Testing (CAT) Routing Engine

_Goal: Build the algorithmic routing engine to support multistage computer-adaptive testing for the digital SAT and GRE._

- **Task 9.1: Adaptive Routing Schema & Frontmatter Configuration**
  - Extend test metadata specifications to support adaptive routing graphs:
    ```json
    {
      "isAdaptive": true,
      "stages": [
        {
          "stageIndex": 1,
          "sectionId": "sat-rw-m1",
          "routing": {
            "threshold": 14,
            "onPass": "sat-rw-m2-hard",
            "onFail": "sat-rw-m2-easy"
          }
        }
      ]
    }
    ```
  - Update Prisma schema if routing audit trails are stored in the database (`Result.stageRoutingSnapshot` / `TestSummary.routingPath`).

- **Task 9.2: Section Completion Branching Controller**
  - Refactor the section completion server action to inspect `isAdaptive`.
  - Calculate raw score thresholds immediately upon stage submission and dynamically return the target branched section route instead of incrementing linear indices (`sectionOrder + 1`).

- **Task 9.3: Scaled Scoring Engine for Adaptive Trajectories**
  - Implement two-parameter or lookup-table scoring calculations that weigh difficulty routing: ensuring a student taking the "Hard" module 2 achieves scores in the upper scaling bands (e.g., 400–800 for SAT sections), while the "Easy" module ceiling is capped accordingly.

- **Task 9.4: Adaptive Diagnostic Telemetry in `UnifiedAnalyticsDashboard`**
  - Update the dashboard header to indicate module difficulty paths (e.g., "Module 1 → Module 2 (Hard Tier)").
  - Annotate pacing and accuracy graphs to differentiate performance between baseline and adapted modules.

---

### Addendum: Architectural Principles & Operational Guidelines

1. **Zero-Downtime Deployment Guarantee (Approach A):**
   - Content updates, typo corrections, and new test additions are pushed via Git commits.
   - Deployments on modern serverless or container platforms execute isolated builds. Active test-takers will never be interrupted, dropped, or subjected to maintenance windows. Inflight autosaves to PostgreSQL remain fully available.

2. **Database vs. Filesystem Boundary:**
   - **PostgreSQL / Prisma Scope:** Strictly limited to dynamic, mutable state—user identities, roles, subscription entitlements, individual question telemetry (`Response`), immutable grade snapshots (`Result`), and aggregated performance summaries (`TestSummary`).
   - **Filesystem Scope:** All authored static content—prompts, passages, answer choice arrays, scoring thresholds, and image assets—remain Git-tracked markdown and vector files.

3. **Performance & Cold-Start Protections:**
   - Markdown parsing is isolated behind React's `cache()` and server-side component boundaries.
   - Avoid remote object storage hops (S3/Supabase Storage) for test-critical markdown files during live exams to ensure sub-millisecond section transitions and complete offline resilience in unstable network environments.

---

# Production Beta Epics & Release Specifications

---

## Epic 9*: Multi-Section Progression & Full-Length Exam Orchestration

*Goal: Transition from isolated, single-section execution to continuous, multi-stage diagnostic exams, handling section transitions, mandatory breaks, session resumption, and cumulative score synthesis.*

### Task 9.1: Sequential Section State Machine & Transitions

* Implement an exam session state machine managing ordered section execution based on `metadata.sections` configuration.
* Handle automated routing upon section submission: if subsequent sections exist, advance the student directly into the next module or scheduled intermission rather than routing to `/dashboard`.
* Enforce hard section boundaries preventing navigation back to previous modules once submitted or expired, mirroring official SAT/ACT test security rules.

### Task 9.2: Timed Intermission Engine (Scheduled Breaks)

* Build the standardized intermission screen triggered between major exam stages (e.g., 10-minute break between SAT Reading/Writing and Math; ACT Section 2 and Section 3).
* Support an unskippable or student-dismissible countdown timer that halts exam section clocks until the break window concludes or the student elects to resume early.
* Secure state persistence during breaks, allowing page reloads without forfeiting progress or corrupting the global attempt timer.

### Task 9.3: Mid-Exam Resumption & Incomplete Attempt Guards

* Track active attempt checkpoints in PostgreSQL so students experiencing device failure or session drops can resume where they left off.
* Protect root exam entry routes (`/tests/[category]/[testId]`): automatically detect ongoing attempts and redirect students to the current incomplete section rather than restarting at Section 1.
* Invalidate or auto-submit expired attempts where total allowable elapsed time has passed while offline.

### Task 9.4: Cumulative Composite Scoring & Synthesis

* Build a cross-section aggregation engine that synthesizes individual section `Result` records into a single composite test attempt summary.
* Map raw scores to official scaled composites (SAT 400–1600 composite scale; ACT 1–36 composite scale).
* Store the aggregated summary for unified retrieval on `/dashboard` and downstream cohort reporting views.

---

## Epic 10: Institutional & Tutor Observability Portal

*Goal: Deliver dedicated management, roster analytics, and diagnostic visibility for school administrators (`ORG_ADMIN`) and instructional staff (`TUTOR`).*

### Task 10.1: Institutional Cohort & Seat Management Dashboard

* Build the `/tgadmin` / institutional overview interface for `ORG_ADMIN` accounts.
* Display real-time seat utilization metrics: total purchased licenses, claimed seats, and active vacancies.
* Provide an administrative student roster table displaying student names, emails, registration dates, and active category enrollments.
* Implement seat management controls: generate supplemental invite links, refresh codes, or deactivate departed students to reclaim seats.

### Task 10.2: Tutor Cohort Diagnostic & Review Access

* Provide authorized tutors and organization admins read-only inspection access to their assigned students' completed exams.
* Wire the `UnifiedAnalyticsDashboard` and dual-pane question triage review to accept an optional student/attempt parameter, allowing instructors to review pacing charts, answer choices, and error patterns during instructional sessions.
* Enforce strict tenancy isolation ensuring tutors and admins can only view students belonging to their shared `Organization` or `School`.

### Task 10.3: Roster Export & Institutional Reporting

* Build a server action to generate standard CSV exports of cohort diagnostic data (student name, email, exam ID, completion timestamp, section scores, and composite score).
* Provide summary metrics for classes or cohorts (average composite score, lowest-performing skill domains, and pacing bottlenecks).

---

## Epic 11: Production Transactional Email Infrastructure

*Goal: Replace local console-logged tokens and links with an enterprise-grade transactional email pipeline featuring high deliverability and spam resistance.*

### Task 11.1: Provider Integration & Environment Configuration

* Integrate Postmark or Resend API clients via environment-bound secrets (`POSTMARK_SERVER_TOKEN` or `RESEND_API_KEY`).
* Configure isolated transactional sending addresses using an authorized subdomain (e.g., `auth@mail.highmountainprep.com`).
* Verify DNS authentication records (SPF, DKIM, DMARC, and MX return-path) against provider validation tools.

### Task 11.2: Transactional Email Templates & Dispatch Hooks

* Construct responsive, multipart (HTML and plaintext fallback) email templates:
* **Password Setup / Reset:** Deliver one-hour expiring tokens directly to purchasers and students requesting credential recovery.
* **Student Institutional Claim Confirmation:** Confirm seat enrollment when a student redeems an `ORG-` invite code.
* **B2B Purchaser Order Confirmation:** Deliver purchase receipts, total seat limits, and shareable join URLs directly to billing contacts.


* Replace console log intercepts in `actions/passwordReset.ts` and Stripe fulfillment webhooks with asynchronous dispatch routines.

---

## Epic 12: Production Hardening, Session Resilience & Telemetry

*Goal: Prepare the client and edge infrastructure for live student beta testing across varied network qualities, school firewalls, operating systems, and viewport constraints.*

### Task 12.1: Network Interruption Buffering & Recovery UI

* Add network reachability monitors within `useTestProgress.ts` to detect offline states or dropped WebSocket/HTTP connections.
* Display an unobtrusive status pill in the test runner header (`"Reconnecting... progress saved locally"`) during transient drops.
* Implement automatic exponential backoff retries to flush local answer queues to the server as soon as connection is restored, preventing student panic.

### Task 12.2: Application Error Telemetry & Exception Tracking

* Integrate Sentry or a lightweight OpenTelemetry client for Next.js App Router to track unhandled client exceptions and server action failures.
* Capture breadcrumbs for exam runner lifecycle events (e.g., question transitions, option selections, and autosave calls) to triage student-reported anomalies during beta runs.

### Task 12.3: Static Asset & Content Integrity Audit

* Execute automated build validation (`scripts/validate-content.ts`) across all active SAT and ACT test sets:
* Verify 100% of frontmatter fields, answer keys, and options match schema rules.
* Assert all referenced diagram SVGs, graphs, and WebP stimuli resolve to valid files under `public/content/tests/...`.
* Validate KaTeX syntax balance across all markdown bodies to eliminate client-side math rendering errors.

```markdown


## Epic 13: Peer-to-Peer Mentorship Links & Independent Tutor Delegation

*Goal: Decouple diagnostic observability from strictly top-down institutional contracts, enabling independent students and private tutors to establish sovereign, consent-driven observation links without organizational license pools or shared tenant IDs.*

---

### Task 13.1: Mentorship Link Relational Schema & Migration

* Introduce a dedicated peer-to-peer delegation model in Prisma to represent non-institutional tutor-student mentorship:
  ```prisma
  enum LinkStatus {
    PENDING
    ACTIVE
    REVOKED
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
  }

```

* Extend `model Profile` with corresponding directional relations:
```prisma
tutoredStudents TutorStudentLink[] @relation("TutorLinks")
studentTutors   TutorStudentLink[] @relation("StudentLinks")

```


* Generate and apply Prisma migrations to deploy the relation without mutating existing `LicensePool`, `Organization`, or `Enrollment` tables.

---

### Task 13.2: Dual-Initiation Workflow Engine & Server Actions

* Implement bilateral invitation and connection workflows in `actions/mentorship.ts`:
* **Tutor-Initiated (Invite Link):** Generate persistent or single-use tutor connection tokens (`/link-tutor?tutorCode=TUTOR-XXXXXX`) allowing registered tutors to invite independent students directly.
* **Student-Initiated (Direct Grant):** Allow students to look up an independent tutor by verified email and trigger a connection request.


* Build atomic server actions handling connection state transitions:
* `createTutorInviteCode()`: Generates a sharable mentor claim link for a tutor profile.
* `requestMentorConnection(tutorEmail: string)`: Creates a `PENDING` request from student to tutor.
* `respondToMentorshipRequest(linkId: string, accept: boolean)`: Transitions request status to `ACTIVE` or deletes the pending record.
* `revokeMentorshipAccess(linkId: string)`: Transitions status to `REVOKED` or severs the relation instantly, ensuring the student retains sovereign data privacy.



---

### Task 13.3: Tenancy Guard Evolution & Diagnostic Inspection Authorization

* Refactor access checks in `actions/observability.ts`, `app/api/tgadmin/export-csv/route.ts`, and `app/tests/[category]/[testId]/results/page.tsx` to support the expanded compound authorization rule:
```typescript
const isSuperAdmin = session.user.role === Role.ADMIN;
const sharesOrganization =
  Boolean(session.user.orgId) &&
  Boolean(studentProfile.orgId) &&
  session.user.orgId === studentProfile.orgId;

const hasActiveMentorshipLink = await prisma.tutorStudentLink.findFirst({
  where: {
    tutorId: session.user.id,
    studentId: targetProfileId,
    status: LinkStatus.ACTIVE,
  },
});

const isAuthorized = isSuperAdmin || sharesOrganization || Boolean(hasActiveMentorshipLink);

```


* Ensure independent tutors (`orgId === null`) can inspect linked students' diagnostic charts, section pacing traces, and question triage reviews while remaining barred from unlinked students.

---

### Task 13.4: Student Sovereignty UI & Tutor Roster Unification

* **Student Privacy & Mentor Settings (`/settings/mentors` or `/dashboard` widget):**
* Present students with a clear list of instructors currently authorized to view their diagnostic testing history.
* Provide a modal/prompt for accepting incoming tutor link requests with explicit disclosure: *"Allow [Tutor Name] ([email]) to inspect your diagnostic scores, timing telemetry, and answer revisions?"*
* Provide an instant "Revoke Access" control allowing students to terminate data sharing at any time.


* **Unified Tutor Portal (`/tgadmin`):**
* Update `getInstitutionalOverview()` and `RosterTable.tsx` for tutors to merge students from institutional license allocations with students connected via `TutorStudentLink`.
* Display an attribution tag per student row (e.g., `Institutional: Apex Prep` vs. `Direct Mentorship`).
* Conditionally suppress seat management operations (code refreshing, license reclamation) for peer-linked students who fund their own subscriptions independently.

```

## Epic 14: Student Command Center & Modular Preparation Diagnostics

*Goal: Transform the student dashboard from a passive test catalog into an actionable, low-friction preparation command center. Provide modular, client-side and telemetry-driven widgets that foster momentum, prevent diagnostic burnout, pinpoint high-yield skill deficits, and ground student preparation in tangible horizons.*

---

### Task 14.1: Horizon & Target Score Runway Modules

*Build modular widgets that anchor the student's preparation timeline and quantify score improvement goals without inducing testing anxiety.*

- **Component 14.1.1: Official Exam Runway & Horizon Calculator (`ExamCountdownWidget.tsx`)**
  - **Purpose:** Display a calm, low-stress timeline toward official sittings (SAT/ACT national test dates).
  - **Mechanics:**
    - Calculate runway in whole days and study weeks remaining rather than high-anxiety, real-time second tickers.
    - Contextualize testing horizons by auto-generating milestone phase descriptors: *Foundational Cadence* (>6 weeks), *Targeted Skill Mastery* (4–6 weeks), *Peak Diagnostic Simulation* (2–3 weeks), and *Final Taper* (≤1 week).
    - Provide rapid selection presets for standard national test windows alongside custom date inputs.
    - Implement zero-flicker client hydration using `useSyncExternalStore` to persist configuration per category in browser storage.
  - **Geometry:** Constrained by the golden ratio (`aspect-[1.618/1]`) and styled using sharp border tokens (`rounded-none`).

- **Component 14.1.2: Score Trajectory & Target Delta Gauge (`ScoreTargetGauge.tsx`)**
  - **Purpose:** Compare a student’s self-declared target score against their actual diagnostic baseline.
  - **Mechanics:**
    - Parse latest composite score from `TestSummary` against user-configured target (e.g., Target: 1520 vs. Latest: 1380).
    - Display an actionable point delta (+140 pts needed) paired with scaled section splits (e.g., Math gap: +90 pts, Reading & Writing gap: +50 pts).
    - Include target score threshold benchmarks for competitive college admissions tiers (e.g., Ivy/Top 20, Competitive State Honors).

---

### Task 14.2: Diagnostic Cadence & Test Readiness Spacing Engine

*Prevent test fatigue and score plateaus by calculating optimal testing intervals and flagging module stamina drop-offs.*

- **Component 14.2.1: Diagnostic Cadence & Test Spacing Recommender (`DiagnosticCadenceCard.tsx`)**
  - **Purpose:** Advise the student on *when* to take their next full diagnostic exam.
  - **Mechanics:**
    - Read `TestSummary.completedAt` of the most recent evaluation and compare against the official exam target date.
    - Recommend an optimal spacing cadence: 1 full-length simulation every 10–14 days during peak phase, tapering to 0 tests in the final 5 days before the test date.
    - Surface status flags: *"Diagnostic Overdue"* (≥18 days since last exam), *"Optimal Window"* (next test due this weekend), or *"Rest & Review Active"* (exam taken <3 days ago; focus on error logs).

- **Component 14.2.2: Section Fatigue & Stamina Degradation Radar (`StaminaAlertWidget.tsx`)**
  - **Purpose:** Identify if student accuracy degrades significantly across late sections/modules due to mental fatigue.
  - **Mechanics:**
    - Analyze `Response.timeSpentOnResponse` and `Response.isCorrect` across chronological section order (e.g., Module 1 vs. Module 2; ACT Science / Math Section 4).
    - Compute the accuracy and pacing drop-off delta:
      $$\Delta_{\text{fatigue}} = \text{Accuracy}_{\text{Module 1}} - \text{Accuracy}_{\text{Module 2}}$$
    - Display a targeted stamina alert when accuracy drops >15% between early and late modules despite consistent difficulty, recommending specific split-session endurance drills.

---

### Task 14.3: Domain Mastery & Error-Pattern Micro-Analytics

*Extract high-granularity diagnostics from database records to drive post-test triage and study focus.*

- **Component 14.3.1: Top-3 High-Yield Priority Focus Radar (`PrioritySkillFocusCard.tsx`)**
  - **Purpose:** Remove decision paralysis by telling the student the three most impactful skills to review today.
  - **Mechanics:**
    - Aggregate recent `Response` rows joined with section YAML frontmatter metadata (`domain`, `skill`, `difficulty`).
    - Rank skills using an impact-weighting heuristic combining frequency on the exam with student error rate:
      $$\text{Priority Score} = \text{ErrorRate}_{\text{skill}} \times \text{Weight}_{\text{domain}}$$
    - Render 3 concise actionable recommendation pills (e.g., *"Heart of Algebra: Linear System Word Problems (25% accuracy across 8 questions)"*).
    - Include direct deep-links into the Question Triage Review tab (`/tests/[category]/[testId]/results?filterDomain=...`).

- **Component 14.3.2: Second-Guessing & Answer Revision Telemetry (`RevisionAuditWidget.tsx`)**
  - **Purpose:** Audit the behavioral tendency of changing answers under test conditions.
  - **Mechanics:**
    - Inspect `Response.changedAnswer` flags across recent completed sections.
    - Partition revised answers into two metrics:
      1. *Beneficial Changes:* Incorrect $\rightarrow$ Correct.
      2. *Detrimental Changes:* Correct $\rightarrow$ Incorrect.
    - Surface an actionable confidence index (e.g., *"When you change an answer, you improve your score 68% of the time — your instincts are reliable"*, or *"Warning: 71% of your answer revisions changed correct answers to incorrect"*).

---

### Task 14.4: Consistency & Diagnostic Momentum Tracker

*Reinforce disciplined study habits through non-gamified, architectural progress tracking.*

- **Component 14.4.1: Preparation Momentum Runway (`PrepMomentumTracker.tsx`)**
  - **Purpose:** Visualize completed diagnostic milestones across the student's study timeline.
  - **Mechanics:**
    - Render an architectural linear milestone track displaying completed diagnostics as solid nodal points along the runway leading to the official test sitting.
    - Display diagnostic volume metrics: Total Questions Answered, Total Timed Hours Logged, and Average Question Pacing vs. Target Benchmark (e.g., SAT Reading: 71s/item avg vs. 75s benchmark).
    - Include a prompt to export or share the completed preparation telemetry directly with authorized mentors (`/settings/mentors`).

---

### Task 14.5: Modular Dashboard Grid Integration

*Integrate the modular components into `app/dashboard/page.tsx` within an adaptive layout grid.*

- **Sub-task 14.5.1: Adaptive Responsive Grid Composition**
  - Organize the top tier into two golden-ratio sibling panels:
    - **Panel A (Left):** `ExamCountdownWidget.tsx` (Official Test Runway & Cadence).
    - **Panel B (Right):** `ScoreTargetGauge.tsx` (Target Delta & Trajectory).
  - Organize the middle tier for tactical action:
    - **Next Recommended Diagnostic Hero Card** (Single prominent CTA to launch next test).
    - **Diagnostic Cadence / Spacing Card** (`DiagnosticCadenceCard.tsx`).
  - Organize the lower tier into diagnostic triage & behavioral audits:
    - `PrioritySkillFocusCard.tsx` (Top 3 Weak Domains).
    - `RevisionAuditWidget.tsx` (Answer Revision Telemetry).
- **Sub-task 14.5.2: Independent Modular Skeletons**
  - Wrap each modular component within self-contained `<Suspense>` boundaries or pure client-side hydration gates (`useSyncExternalStore`) to ensure instant page paint with zero layout shift (CLS).

## Epic 15: Low-Friction Candidate Acquisition, Embedded Checkout & Zero-Downtime Provisioning

*Goal: Replace high-friction post-checkout password recovery loops and static placeholders with a unified, high-conversion acquisition architecture. Unify the platform under a single, authoritative OKLCH design system, embed zero-redirect Stripe checkout with upfront credential establishment, automate background NextAuth authentication, and deliver dynamic, category-driven pricing infrastructure.*

---

### Task 15.1: Unified Pricing Source of Truth & Dynamic Storefront Engine

*Decouple product tier definitions and Stripe billing amounts from hardcoded component markup into a centralized, typesafe configuration layer.*

- **Component 15.1.1: Shared Program & Pricing Matrix (`config/pricing.ts`)**
  - **Purpose:** Serve as the immutable, bidirectional single source of truth for UI presentation, category filtering, and backend Stripe checkout instantiation.
  - **Mechanics:**
    - Define typesafe schemas: `PricingTier`, `PricingCategoryConfig`, and `ExamCategory` (`college-admissions`, `academic`, `graduate`).
    - Map product metadata directly to Prisma `Category` enums (`SAT`, `ACT`, `GRE`, `AP_CALC`), pricing in whole USD cents (`priceCents`), feature breakdowns, and editorial descriptions.
    - Enable zero-downtime additions: appending a new record to `PRICING_TIERS` automatically provisions new catalog cards on the storefront and validates tier selection during server-side checkout initialization.

- **Component 15.1.2: Dynamic Category Storefront Grid (`TierPricingGrid.tsx`)**
  - **Purpose:** Display academic testing suites organized by curriculum track rather than generic software tiers.
  - **Mechanics:**
    - Filter packages dynamically across three academic tracks: *SAT & ACT Examinations*, *Academic Exams (AP)*, and *Graduate Entrance (GRE)*.
    - Implement adaptive CSS Grid geometry: automatically transitions between 1-column centered, 2-column balanced, and 3-column layouts based on active category length.
    - Emphasize test-day fidelity, timing analysis, and diagnostic depth over raw software technicalities (highlighting pacing traces, answer revision audits, and sub-skill triage).
    - Provide a dedicated institutional partnership contact tier (`partnerships@thetutorsguide.com`) for schools, districts, and tutoring cohorts requiring custom seat pools and negotiated agreements.

---

### Task 15.2: Editorial Hero & Dynamic Baseline Header Alignment

*Establish an understated, academically authoritative storefront entry point compliant with Next.js 16 dynamic streaming guidelines.*

- **Component 15.2.1: Horizontal Sliding Curriculum Marquee (`RotatingExamHeroText.tsx`)**
  - **Purpose:** Present continuous, unhurried examination coverage without vertical layout displacement or baseline shifts.
  - **Mechanics:**
    - Implement an intrinsic CSS Grid cell-stacking architecture (`inline-grid grid-cols-1 grid-rows-1`) to lock rotating text directly onto the uppercase headline baseline.
    - Execute horizontal, right-to-left translations (`translate-x-full` $\rightarrow$ `translate-x-0` $\rightarrow$ `-translate-x-full`) on a 3000ms loop using an unhurried cubic-bezier deceleration curve (`cubic-bezier(0.16, 1, 0.3, 1)`).
    - Rotate smoothly through primary programs: *Digital SAT*, *ACT*, *GRE*, and *AP Exams*.
  - **Geometry & Alignment:** Wrap within a centered intrinsic width container (`w-fit mx-auto text-left`) on `app/page.tsx`, ensuring flush left alignment of the category tag, headline, and subtext while maintaining optical balance across wide viewports.

---

### Task 15.3: Upfront Credential Establishment & Embedded Checkout Modal

*Eliminate the multi-step post-purchase password obstacle course by establishing candidate credentials directly at checkout initiation.*

- **Component 15.3.1: In-App Embedded Checkout Coordinator (`EmbeddedCheckoutModal.tsx`)**
  - **Purpose:** Keep prospective students and parents entirely within the platform domain during payment, bypassing remote Stripe hosted redirects.
  - **Mechanics:**
    - Integrate `@stripe/react-stripe-js` and `@stripe/stripe-js` with Next.js App Router client boundaries.
    - **Step 1 (Candidate Registration):** Capture student first name, last name, email, and password upfront for unauthenticated users.
    - **Step 2 (Payment Integration):** Mount `<EmbeddedCheckout />` using the generated `clientSecret` within a constrained modal drawer.
    - Automatically detect active NextAuth sessions: authenticated users skip registration and proceed directly to payment initialization.

- **Component 15.3.2: Secure Pre-Hashed Credential Forwarding (`app/api/checkout/route.ts`)**
  - **Purpose:** Validate package keys and securely pass candidate registration credentials through Stripe metadata.
  - **Mechanics:**
    - Dynamically match the requested `tier` against `PRICING_TIERS[tierKey]` to pull immutable prices and category arrays.
    - Enforce server-side password length policies ($\ge 8$ characters) and hash credentials immediately using `bcryptjs` (salt rounds: 10) before sending them off-system.
    - Embed pre-hashed passwords, buyer names, and category arrays directly into Stripe Checkout session `metadata`.

---

### Task 15.4: Atomic Post-Payment Provisioning & Seamless Auto-Login

*Transition paying students immediately into their active diagnostic workstation with zero manual authentication barriers.*

- **Component 15.4.1: Password-Preserving Webhook Fulfillment (`app/api/webhooks/stripe/route.ts`)**
  - **Purpose:** Atomically provision student profiles, license pools, and active enrollments with user-selected credentials.
  - **Mechanics:**
    - Verify Stripe cryptographic webhook signatures (`constructEvent`).
    - Check session idempotency against `LicensePool.stripeSessionId` to block duplicate provisioning.
    - Ingest `metadata.hashedPassword` during `Profile` creation, ensuring candidate-defined passwords are saved directly without generating throwaway strings.
    - Execute atomic Prisma transaction creating `Profile`, 1-seat `LicensePool`, and active `Enrollment` with a 365-day validity window.

- **Component 15.4.2: Client-Side Auto-Authentication Pipeline**
  - **Purpose:** Log new students in automatically upon completion of the Stripe embedded checkout form.
  - **Mechanics:**
    - Wire `EmbeddedCheckoutProvider.options.onComplete` to invoke NextAuth's `signIn("credentials", { email, password, redirect: false })`.
    - Upon successful token resolution, execute a background router cache refresh (`router.refresh()`) and redirect the user immediately to `/dashboard`.
    - Provide a robust fallback: if the modal is dismissed or refreshed during payment, redirect to `/checkout/success` where session verification and dashboard launch controls await.

---

### Task 15.5: Architectural Design System & Secondary Auth Alignment

*Harmonize authentication, password recovery, and institutional seat redemption views with the system's OKLCH slate palette, monospace telemetry tokens, and micro-interactions.*

- **Component 15.5.1: Morphing Action CTA Micro-Interactions**
  - **Purpose:** Deliver an interactive visual affordance on primary program launch buttons.
  - **Mechanics:**
    - Implement a composite translation and rotational morph inside `TierPricingGrid.tsx`.
    - On button hover, apply an understated 4px horizontal glide (`group-hover:translate-x-1`) while simultaneously executing an opposing 180° rotational scale swap between an `ArrowRight` icon and a `Check` icon.

- **Component 15.5.2: Authentication & Institutional Access Views**
  - **`app/login/page.tsx`:** Standardize under the core `bg-card` and `border-border` theme tokens, replacing dark glassmorphism and robotic jargon with clear, parent- and student-facing labels.
  - **`app/join/page.tsx`:** Align institutional claim views with standard layout styling, allowing students with `ORG-` codes to claim licenses and automatically log in.
  - **`app/checkout/success/page.tsx`:** Modernize post-purchase confirmation for both B2C students (diagnostic workspace launch) and B2B administrators (seat utilization counters and shareable claim URLs).
  - **`app/forgot-password/page.tsx` & `app/reset-password/page.tsx`:** Standardize tokenized recovery views under shared typography and layout geometry.

---

### Task 15.6: Next.js 16 Dynamic Streaming & Concurrency Hardening

*Eliminate prerendering errors and server component crashes under Next.js 16 Dynamic IO and Cache Components.*

- **Mechanics:**
  - Enforce `export const instant = false;` across dynamic root routes (`app/page.tsx`, `app/checkout/success/page.tsx`).
  - Isolate header session inspection (`auth()`) within `<Suspense>` boundaries paired with `await connection()` calls to prevent uncached data prerendering bailouts.