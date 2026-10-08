````markdown
# Comprehensive Architecture & Refactoring Specification: Markdown-First Test Platform

## 1. Executive Summary & Objectives

This project shifts the platform from a database-heavy, fragmented block architecture to a **Markdown-first architecture**.

- **Primary Goal:** Eliminate content production friction, remove complex relational joins for test blocks, and establish a robust local-first autosave system with enterprise-grade edge security and flexible B2C/B2B Stripe fulfillment.

- **Tech Stack:** Next.js (App Router), React, TypeScript, Prisma (PostgreSQL), NextAuth, Stripe (Embedded Checkout & Webhooks), `react-markdown`, `remark-math`, and `rehype-katex`.

---

## 2. Content & Authoring Pipeline

### A. File System Structure

Test materials are authored as standard Markdown (`.md`) files with YAML frontmatter, version-controlled directly in the repository:

```text
content/
└── tests/
    └── sat/
        └── sat-practice-1/
            ├── metadata.json
            ├── section-1-reading.md
            └── section-2-math.md
```
````

### B. Standardized Markdown Format

Each section combines YAML metadata (scoring, time limits, options) with markdown bodies containing standard LaTeX math syntax (`$...$` and `$$...$$`):

```markdown
---
sectionTitle: "English and Writing"
sectionOrder: 1
timeLimit: 1980
questions:
  - id: "sat-rw-001"
    questionType: "MC"
    correctOption: "C"
    options:
      - id: "A"
        text: "Option A text..."
      - id: "B"
        text: "Option B text..."
---

Passage text with inline math like $x^2 + y^2 = z^2$.
```

### C. Content Parser & Renderer

- **Loader (`lib/contentLoader.ts`)**: Uses `gray-matter` to parse markdown frontmatter and content dynamically.
- **Renderer (`MarkdownQuestionRenderer.tsx`)**: Renders content using `react-markdown`, `remark-math`, and `rehype-katex`.

---

## 3. Database Architecture (Prisma & PostgreSQL)

The schema has been stripped of redundant content tables (`Block`, `Option`, duplicate categories), retaining user telemetry, organization seat pooling, memberships, and string-keyed relational references.

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role { STUDENT, TUTOR, ORG, ADMIN, PARENT }
enum Package { NONE, SAT, ACT, ALL }
enum ClassYear { FRESHMAN, SOPHOMORE, JUNIOR, SENIOR, OTHER }
enum Category { NONE, SAT, ACT, ACADEMIC }
enum QuestionType { MC, FR }

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
}

model School {
  id        String    @id @default(cuid())
  name      String
  members   Profile[] @relation("SchoolProfiles")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
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
  twoFactorAuthSecret    String?
  twoFactorAuthActivated Boolean?
  createdAt              DateTime       @default(now())
  updatedAt              DateTime       @updatedAt

  @@index([email])
  @@index([orgId])
}

model Membership {
  id              String   @id @default(cuid())
  tgpackage       Package  @default(NONE)
  stripeSessionId String   @unique
  profile         Profile  @relation("ProfileToMembership", fields: [profileId], references: [id], onDelete: Cascade)
  profileId       String   @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Test {
  id        String     @id @default(cuid())
  title     String
  category  Category   @default(NONE)
  sections  Section[]  @relation("TestSections")
  responses Response[] @relation("TestResponses")
  results   Result[]   @relation("ResultTests")
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
}

model Response {
  id                  String       @id @default(cuid())
  isCorrect           Boolean      @default(false)
  responseOrder       Int
  sectionOrder        Int
  timeSpentOnResponse Int?         @default(0)
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

  @@unique([profileId, questionId])
  @@index([profileId, testId])
}

model Result {
  id                        String   @id @default(cuid())
  numCorrect                String
  totalQuestions            String
  score                     String?
  scaledScore               String?
  navigationHistory         Json?
  timeRemainingAtCompletion String   @default("")
  testTitle                 String
  profileId                 String
  profile                   Profile  @relation("ProfileResults", fields: [profileId], references: [id], onDelete: Cascade)
  testId                    String
  test                      Test     @relation("ResultTests", fields: [testId], references: [id], onDelete: Cascade)
  sectionId                 String
  section                   Section  @relation("ResultSections", fields: [sectionId], references: [id], onDelete: Cascade)

  @@unique([testId, profileId, sectionId])
  @@index([profileId])
}

model PasswordResetToken {
  id          String   @id @unique @default(cuid())
  profileId   String
  token       String   @unique
  tokenExpiry DateTime

  @@index([token])
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
