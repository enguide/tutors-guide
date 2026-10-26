// app/page.tsx
import Link from "next/link";
import { auth } from "@/lib/auth";
import { connection } from "next/server";
import { Suspense } from "react";
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { TierPricingGrid } from "@/components/storefront/TierPricingGrid";
import { RotatingExamHeroText } from "@/components/storefront/RotatingExamHeroText";

export const instant = false;

async function AuthAwareNavActions() {
  await connection();
  const session = await auth();

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/join"
        className="px-3 py-1.5 border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-mono tracking-widest uppercase transition-colors"
      >
        School / Tutor Code
      </Link>

      {session?.user ? (
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 text-xs font-bold tracking-wide transition-colors"
        >
          <span>Student Portal</span>
          <ArrowRight size={14} />
        </Link>
      ) : (
        <Link
          href="/login"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 text-xs font-bold tracking-wide transition-colors"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}

async function MainPricingSection() {
  await connection();
  const session = await auth();

  return <TierPricingGrid isLoggedIn={Boolean(session?.user)} />;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-black tracking-tight text-lg"
          >
            <div className="p-1.5 bg-primary text-primary-foreground">
              <GraduationCap size={18} />
            </div>
            <div className="flex flex-row"><span className="hidden md:inline">TheTutors</span>
            <span className="hidden md:inline text-foreground/75">Guide</span></div>
          </Link>

          <Suspense
            fallback={
              <div className="h-8 w-24 bg-muted border border-border animate-pulse" />
            }
          >
            <AuthAwareNavActions />
          </Suspense>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border py-20 sm:py-28 px-4 bg-muted/10">
        {/* w-fit shrinks to content size, mx-auto centers the block, text-left anchors the start */}
        <div className="w-fit max-w-4xl mx-auto text-left space-y-5">
          <div className="block text-[11px] font-mono tracking-[0.25em] uppercase text-muted-foreground">
            Standardized Testing Diagnostics &amp; Analytics
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight uppercase flex flex-wrap items-baseline justify-start gap-x-3.5">
            <span>Master</span>
            <RotatingExamHeroText />
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Challenging, high-fidelity diagnostics and a comprehensive suite of analytics built from two decades of experience and 45,000 hours of instruction.
          </p>
        </div>
      </section>

      {/* Diagnostic Capabilities Overview */}
      <section className="border-b border-border bg-card py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2 border-l-2 border-border pl-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
              Authentic Experience
            </span>
            <h3 className="text-sm font-bold uppercase text-foreground">
              Exact Test-Day Presentation
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Examinations accurately mirror official Bluebook and TestNav formats, module layouts, and timing conditions, eliminating test-day surprises.
            </p>
          </div>

          <div className="space-y-2 border-l-2 border-border pl-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
              Behavioral Telemetry
            </span>
            <h3 className="text-sm font-bold uppercase text-foreground">
              Pacing &amp; Decision Tracking
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              See exact time spent per question, trace navigation order, measure calculator reliance, and pinpoint whether changing answers helped or hurt the final score.
            </p>
          </div>

          <div className="space-y-2 border-l-2 border-border pl-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
              Targeted Triage
            </span>
            <h3 className="text-sm font-bold uppercase text-foreground">
              Granular Error Diagnostics
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Filter results across question difficulty, sub-skill, and domain to know precisely what to review next, supported by comprehensive step-by-step explanations.
            </p>
          </div>
        </div>
      </section>

      {/* Program Selection Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-10 flex-1 w-full">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Diagnostic Packages
            </span>
            <h2 className="text-lg font-bold tracking-tight text-foreground uppercase mt-0.5">
              Select Examination Program
            </h2>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            Full 1-year access • Complete performance history &amp; review
          </div>
        </div>

        <Suspense
          fallback={
            <div className="w-full h-96 flex items-center justify-center border border-border bg-card">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <MainPricingSection />
        </Suspense>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">The Tutors Guide</span>
            <span>•</span>
            <span className="font-mono text-[11px]">Academic Testing Division</span>
          </div>
          <div className="flex gap-6 font-mono text-[11px]">
            <Link
              href="/login"
              className="hover:text-foreground transition-colors"
            >
              Student &amp; Parent Sign In
            </Link>
            <Link
              href="/join"
              className="hover:text-foreground transition-colors"
            >
              School / Tutor Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}