# System Architecture & Directory Specification

This document provides a comprehensive structural overview of the standardized testing and analytics platform, detailing the file layout, technical stack, core functional domains, and data pipelines.

---

## 1. Technical Stack Overview

| Layer | Technologies / Libraries |
| --- | --- |
| **Framework** | Next.js (App Router, Server Actions, Route Handlers) |
| **Language** | TypeScript |
| **Database & ORM** | PostgreSQL via Prisma ORM |
| **Authentication** | NextAuth.js |
| **Payments & Licensing** | Stripe (Embedded Checkout & Webhooks), Institutional License Pools |
| **Content Delivery** | Flat-file Markdown/JSON test content + Static SVG/WebP assets |
| **Storage & CV** | AWS S3 / Object Storage, Client-side Computer Vision (capture quality, cropping) |
| **Telemetry & Observability** | Custom telemetry logger, pacing & navigation tracking |

---

## 2. Directory Architecture Map

```text
├── actions/             # Next.js Server Actions (mutations, session checkpoints, audits)
├── app/                 # Next.js App Router (pages, nested layouts, API routes)
│   ├── api/             # REST/Webhook endpoints (NextAuth, Stripe, Capture events, CSV exports)
│   ├── dashboard/       # Student analytics hub, test selection, results view
│   ├── scan/            # Mobile optical capture & QR ingestion flow
│   ├── tests/           # Dynamic test runner engine ([category]/[testId]/[sectionId])
│   └── tgadmin/         # Administrative console, FRQ review queue, student roster
├── components/          # Reusable React UI component library
│   ├── analytics/       # Data visualization, pacing grids, accuracy charts, timelines
│   ├── dashboard/       # Diagnostic widgets, prep momentum, score target gauges
│   ├── exam/            # Core test engine (shells, layouts, modals, FRQ runner)
│   ├── tools/           # In-exam utilities (Desmos/ToggleGraph, formula sheets, GRE calculator)
│   └── ui/              # Base design primitives (button, card, chart)
├── config/              # Application-wide static business configs (pricing tiers)
├── content/             # Authoritative test content directory (ACT, AP Calc, GRE, SAT)
├── hooks/               # Custom React hooks (real-time sync, progress, speech synthesis)
├── lib/                 # Core domain logic, scoring engines, adaptive branching, telemetry
├── prisma/              # Database schema definition, migration history, seeding scripts
├── public/              # Static assets (test diagrams, geometry SVGs, global brand icons)
├── scripts/             # Build/CI utility scripts (schema & markdown content validator)
└── types/               # System-wide TypeScript type definitions and interfaces

```

---

## 3. High-Level Domain Breakdown

### A. Dynamic Exam Runner Engine (`app/tests/`, `components/exam/`, `lib/adaptive/`)

* **Multi-Program Shell Architecture:** Houses tailored interface shells mimicking the actual testing interfaces for **SAT** (Bluebook-style), **ACT**, **AP Calculus**, and **GRE**. Adapters (`SATLayoutAdapter`, `ACTLayoutAdapter`, `APLayoutAdapter`, `GRELayoutAdapter`) standardize interface mechanics (headers, navigation drawers, calculators, formula popovers) around unified core layouts (`SplitPassageLayout`, `SingleColumnLayout`).
* **Adaptive Multi-Stage Branching:** Managed by `lib/adaptive/branchingController.ts`. Specifically configured for tests like the Digital SAT (`sat-diagnostic-adaptive-1`), orchestrating transitions from Routing Module 1 (`m1`) to Easy (`m2-easy`) or Hard (`m2-hard`) Section 2 variants based on real-time routing performance.
* **Resilient State Persistence:** Driven by `actions/autosave.ts`, `actions/completeTestSection.ts`, and checkpoints in Prisma to prevent state loss during network drops or accidental page reloads.

### B. Free Response Question (FRQ) Mobile Scan & Audit Pipeline (`app/scan/`, `actions/frq*`, `lib/cv/`)

* **Cross-Device Hand-Off:** Students taking desktop exams (e.g., AP Calculus) encounter QR code capture prompts (`components/exam/SectionCaptureModal.tsx`).
* **Mobile Ingestion:** The student's mobile device opens `app/scan/[token]/page.tsx`, leveraging `components/scanner/MobileCameraView.tsx` with computer vision quality checks (`lib/cv/qualityChecks.ts`) and perspective cropping (`lib/frq/cropper.ts`).
* **Real-Time Token Polling:** The desktop runner hooks into `app/api/capture/[token]/events/route.ts` via `hooks/useCaptureSync.ts`, syncing uploaded pages directly into the active desktop testing state.
* **Audit Queue:** Admin staff review, inspect, and evaluate raw handwritten uploads using `app/tgadmin/frq-audit/` and `actions/frqAudit.ts`.

### C. Scoring & Curve Engine (`lib/scoring/`)

* **Multi-Paradigm Evaluation:** Accommodates traditional linear scaling, weighted subject subscores, and two-stage adaptive equating (`adaptiveScorer.ts`, `curveEngine.ts`).
* **Mathematical Answer Parsing:** Includes `mathEvaluator.ts` for student-produced responses (grid-ins), evaluating fractions, equivalent decimals, negative bounds, and algebraic equivalents without requiring human intervention.

### D. Deep Analytics & Telemetry Engine (`components/analytics/`, `lib/telemetry/`)

* **Behavioral Pacing & Stamina:** Telemetry hooks capture question-by-question dwell time, answer-change events, review pass counts, and navigation sequences (`DynamicNavigationChart.tsx`, `NavigationTimelineChart.tsx`).
* **Diagnostics Dashboard:** Surfaces aggregated data to the student via `ScoreOverviewBanner.tsx`, `TopicSkillAccuracyAccordion.tsx`, and predictive trajectory modules (`AdaptiveTrajectoryCard.tsx`).

### E. Administration, Mentorship & B2B Licensing (`app/tgadmin/`, `actions/institutional.ts`, `actions/mentorship.ts`)

* **Tutor-Student Linking:** Mentors can link with students via `app/link-tutor/` and monitor their progress, telemetry, and drill scores (`components/mentorship/TutorConsentCard.tsx`).
* **Institutional License Pools:** Supports B2B org access and license seating (`actions/institutional.ts`, `actions/joinOrg.ts`) backed by Prisma models.
* **Data Portability:** Admin-level CSV export endpoints (`app/api/tgadmin/export-csv/route.ts`) for cohort reporting and roster analysis.

---

## 4. End-to-End Data & Execution Flows

```
[Markdown/SVG Test Content]
            │
            ▼ (lib/contentLoader.ts)
    [Exam Runner Shell] ──(hooks/useTestProgress)──► [lib/telemetry/timeTracking]
            │                                                      │
            ├──────(FRQ Capture: Mobile/CV Sync)                   │
            │                                                      ▼
            ▼ (actions/autosave & completeTestSection)    [actions/observability]
    [Prisma Postgres DB]
            │
            ├───────────────► [lib/scoring/adaptiveScorer & curveEngine]
            │                                    │
            ▼                                    ▼
[Admin Audit: tgadmin/frq-audit]      [UnifiedAnalyticsDashboard]

```
