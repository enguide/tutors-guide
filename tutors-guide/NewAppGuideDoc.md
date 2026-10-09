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

The schema has been stripped of redundant content tables (`Block`, `Option`, duplicate categories), retaining user telemetry, organization seat pooling, memberships, string-keyed relational references, and diagnostic composite test summaries.

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
  ORG
  ADMIN
  PARENT
}

enum Package {
  NONE
  SAT
  ACT
  AP_CALC
  GRE
  ALL
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

model Organization {
  id               String       @id @default(cuid())
  name             String
  seatLimit        Int          @default(0) // Total seats purchased via Stripe B2B checkout
  packageType      Package      @default(NONE)
  stripeCustomerId String?      @unique
  members          Profile[]    @relation("OrgProfiles")
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

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
  tgpackage              Package        @default(NONE)
  role                   Role           @default(STUDENT)
  school                 School?        @relation("SchoolProfiles", fields: [schoolId], references: [id])
  schoolId               String?
  org                    Organization?  @relation("OrgProfiles", fields: [orgId], references: [id])
  orgId                  String?
  membership             Membership?    @relation("ProfileToMembership")
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

model Membership {
  id              String   @id @default(cuid())
  tgpackage       Package  @default(NONE)
  stripeSessionId String   @unique
  profile         Profile  @relation("ProfileToMembership", fields: [profileId], references: [id], onDelete: Cascade)
  profileId       String   @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("Membership")
}

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
  timeSpentOnResponse Int?         @default(0) // Seconds spent on active question
  questionId          String       // Links to Markdown frontmatter ID
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

  // One response per question per user (one-and-done attempt enforcement)
  @@unique([profileId, questionId])
  @@index([profileId, testId])
  @@map("Response")
}

model Result {
  id                   String   @id @default(cuid())
  numCorrect           Int      @default(0)
  totalQuestions       Int      @default(0)
  rawScore             Int      @default(0)
  scaledScore          Int?     // Section-scaled score (e.g., 680 Math, 32 Science)
  timeRemainingSeconds Int      @default(0)
  navigationHistory    Json?    // Telemetry trace: Array of { time: number, qIdx: number }
  testTitle            String
  completedAt          DateTime @default(now())

  profileId            String
  profile              Profile  @relation("ProfileResults", fields: [profileId], references: [id], onDelete: Cascade)
  testId               String
  test                 Test     @relation("ResultTests", fields: [testId], references: [id], onDelete: Cascade)
  sectionId            String
  section              Section  @relation("ResultSections", fields: [sectionId], references: [id], onDelete: Cascade)

  // Enforces strict one-and-done completion per section
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
  
  // Composite score across all exam sections (e.g., 1520 SAT, 34 ACT, 5 AP)
  compositeScore Int?
  percentile     String?   // e.g., "98th"
  completedAt    DateTime  @default(now())

  // One diagnostic composite record per student per test
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