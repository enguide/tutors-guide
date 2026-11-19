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
├── lib/                 # Core domain logic, scoring engines, adaptive branching, CV/FRQ, telemetry
├── prisma/              # Database schema definition, migration history, seeding scripts
├── public/              # Static assets (test diagrams, geometry SVGs, global brand icons)
├── scripts/             # Build/CI utility scripts (schema & markdown content validator)
└── types/               # System-wide TypeScript type definitions and interfaces

```

---

## 3. High-Level Domain Breakdown

### A. Dynamic Exam Runner Engine (`app/tests/`, `components/exam/`, `lib/adaptive/`)

* **Multi-Program Shell Architecture:** Houses tailored interface shells mimicking the actual testing interfaces for **SAT** (Bluebook-style), **ACT** (TestNav), **AP Calculus** (Bluebook AP layout with direct section start, `APDirectionsModal`, in-canvas `APCheckYourWorkScreen`, and test-wide end-of-exam `SectionCaptureModal`), and **GRE** (ETS PowerPrep). Adapters (`SATLayoutAdapter`, `ACTLayoutAdapter`, `APLayoutAdapter`, `GRELayoutAdapter`) standardize interface mechanics around unified layouts (`SplitPassageLayout`, `SingleColumnLayout`)[cite: 40].
* **Adaptive Multi-Stage Branching:** Managed by `lib/adaptive/branchingController.ts`. Specifically configured for tests like the Digital SAT (`sat-diagnostic-adaptive-1`), orchestrating transitions from Routing Module 1 (`m1`) to Easy (`m2-easy`) or Hard (`m2-hard`) Section 2 variants based on real-time routing performance[cite: 40].
* **Resilient State Persistence:** Driven by `app/api/exam/sync/route.ts`, `actions/completeTestSection.ts`, and `SectionCheckpoint` records in Prisma, pairing `localStorage` buffering and offline retry queues with non-blocking REST syncs to prevent state loss during network drops or accidental page reloads[cite: 40].

### B. Free Response Question (FRQ) Mobile Scan, Deterministic Verification & Audit Pipeline (`app/scan/`, `actions/frq*`, `lib/cv/`, `lib/frq/`)

* **End-of-Exam Cross-Device Hand-Off:** When an exam containing `FRQ_HANDWRITTEN` questions concludes, `ExamClient.tsx` launches `SectionCaptureModal.tsx` with a test-wide manifest across all FRQ sections (`getOrCreateCaptureSession({ testId })`), displaying a mobile QR pairing code alongside a real-time required-sheets checklist and desktop upload fallback[cite: 40].
* **Zero-Tap Mobile Ingestion:** The student's mobile device opens `app/scan/[token]/page.tsx` (`MobileCameraContainer.tsx` + `components/scanner/MobileCameraView.tsx`) using `h-dvh` safe-area layout, a top Question/Sheet dot matrix progress tracker, a `1.2s` (`6 × 200ms`) steady-frame lock with a `50ms` 3-frame sharpest-burst capture, fiducial-guided 4-digit Code-128C (`QQPP`) barcode decoding (`lib/frq/code128.ts`, `lib/frq/manifest.ts`), automatic S3 upload on verified barcode lock, and an auto-closing completion screen (`window.close()` after 4s)[cite: 40].
* **Fiducial Registration & Homography Cropping:** `lib/cv/fiducials.ts` detects the 4 `8mm × 8mm` corner registration targets (using white-paper quiet-zone halos, corner area consistency, diagonal symmetry, and the Top-Left L-cutout orientation signature), while `lib/frq/cropper.ts` warps the image onto a canonical `1700 × 2200` (200 DPI US Letter) canvas and extracts individual sub-part crops[cite: 40].
* **Deterministic Verification & Progressive Audit Pipeline (`lib/frq/inkCheck.ts`, `lib/frq/casVerifier.ts`, `lib/frq/evaluator.ts`):** Runs interior dark-ink density detection (`< 0.35%` auto-scores blank boxes to `0`), hydrates atomic `.md` rubric criteria (`FrqRubricCriterion`), provides pure-TypeScript symbolic/numeric CAS verification (`nerdamer`), and routes inked responses to `/tgadmin/frq-audit` (`AuditQueueClient.tsx` + `actions/frqAudit.ts`) for one-click criterion-checkbox grading with automatic test score re-aggregation[cite: 40].

### C. Scoring & Curve Engine (`lib/scoring/`)

* **Strategy Registry Architecture (`scoringEngine.ts`):** Decouples exam evaluation into pluggable, category-specific strategies (`SAT_ADAPTIVE`, `SAT_LINEAR`, `ACT_CONCORDANCE`, `AP_WEIGHTED`, `GRE_SECTION`, and `ACADEMIC_MASTERY`), allowing new standardized tests to be registered without modifying core exam runners.
* **Psychometric Multistage Equating (`adaptiveScorer.ts`):** Implements item-difficulty weighting (`Easy`, `Medium`, `Hard` across routing, hard, and easy modules) and domain-specific Bluebook equating curves (`RW` vs. `Math`) with an authentic `460–610` branch overlap zone, standardized $\theta$-proxy ability metrics, and Standard Error of Measurement (SEM) bands.
* **Linear & Weighted Scaling (`curveEngine.ts`, `percentileEngine.ts`):** Supports raw-to-scaled lookup interpolation, AP MC/FRQ multipliers, ACT rounded composites, GRE section-adaptive/linear scaling, and national percentile mapping.
* **Mathematical Answer Parsing (`mathEvaluator.ts`):** Evaluates student-produced responses (grid-ins), handling fractions, equivalent decimals, negative bounds, LaTeX fractions, and multi-key tolerances without human intervention.

### D. Deep Analytics & Telemetry Engine (`components/analytics/`, `lib/telemetry/`)

* **Behavioral Pacing & Stamina:** Telemetry hooks capture question-by-question dwell time, answer-change events, review pass counts, and navigation sequences (`UnifiedAnalyticsDashboard.tsx`, `SectionPacingTimeline.tsx`)[cite: 8].
* **Diagnostics Dashboard (see `6_Analytics_and_UI_Components.md`):** Consolidates composite/section scorecards with synchronized **Question Bars** and **Domain Pacing** charts (`1024px` `matchMedia` responsive switch, `0.65×–1.5×` target pacing bands, `2.5×` outlier clamping), a 1/3–2/3 split bottom row pairing the `Question Navigation Timeline` with `TopicSkillAccuracyAccordion`, predictive adaptive trajectories, and a streamlined `Question Review` inspector[cite: 8].

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
            ▼ (/api/exam/sync & completeTestSection)    [actions/observability]
    [Prisma Postgres DB]
            │
            ├───────────────► [lib/scoring/adaptiveScorer & curveEngine]
            │                                    │
            ▼                                    ▼
[Admin Audit: tgadmin/frq-audit]      [UnifiedAnalyticsDashboard]

```
