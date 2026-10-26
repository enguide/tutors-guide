// app/checkout/success/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  BookOpen,
  ArrowRight,
  Loader2,
  GraduationCap,
  Calendar,
  Layers,
} from "lucide-react";
import Stripe from "stripe";
import { connection } from "next/server";
import { Suspense } from "react";

export const instant = false;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover" as any,
});

async function SuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  await connection();
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/dashboard");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid") {
    redirect("/dashboard?status=unpaid");
  }

  // Lookup provisioned LicensePool
  const pool = await prisma.licensePool.findUnique({
    where: { stripeSessionId: session_id },
    include: {
      org: true,
      enrollments: true,
    },
  });

  const customerEmail =
    session.customer_details?.email || session.customer_email || "";
  const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const shareableJoinLink = pool?.inviteCode
    ? `${origin}/join?code=${pool.inviteCode}`
    : "";
  const formattedExpiry = pool
    ? new Date(pool.expiresAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const isB2B = Boolean(pool?.orgId);

  return (
    <div className="w-full max-w-2xl bg-card border border-border shadow-sm p-6 sm:p-8 rounded-none font-sans">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary text-primary-foreground">
            <GraduationCap size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                {isB2B ? "Institutional Account" : "Student Registration"}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground uppercase mt-0.5">
              Access Confirmed
            </h1>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-[10px] font-mono text-muted-foreground block">
            Reference
          </span>
          <span className="text-[10px] font-mono text-foreground font-bold">
            {session.id.slice(-12)}
          </span>
        </div>
      </div>

      {isB2B && pool ? (
        /* B2B Institutional Cohort View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted/30 border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Layers size={14} />
                <span className="font-mono uppercase text-[10px]">
                  Curriculum Programs
                </span>
              </div>
              <p className="text-sm font-bold text-foreground">
                {pool.categories.join(", ")}
              </p>
            </div>
            <div className="bg-muted/30 border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Calendar size={14} />
                <span className="font-mono uppercase text-[10px]">
                  Access Term
                </span>
              </div>
              <p className="text-sm font-bold text-foreground">
                Active through {formattedExpiry}
              </p>
            </div>
          </div>

          <div className="bg-muted/30 border border-border p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 text-foreground text-xs font-bold uppercase tracking-wider">
                <Users size={15} />
                <span>Student Licenses: {pool.seatLimit} Available</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {pool.enrollments.length} of {pool.seatLimit} enrolled
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Access Code
              </label>
              <div className="text-sm font-mono font-bold bg-background border border-border px-3 py-2 text-foreground tracking-widest">
                {pool.inviteCode}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Direct Enrollment Link
              </label>
              <div className="flex items-center gap-2 bg-background border border-border p-2">
                <input
                  type="text"
                  readOnly
                  value={shareableJoinLink}
                  className="w-full bg-transparent text-xs font-mono text-muted-foreground focus:outline-none select-all"
                />
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Share this link with your students to allow direct enrollment.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-between bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-3 px-4 transition-colors"
            >
              <span className="tracking-widest uppercase">Open Workspace</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        /* B2C Individual Candidate View */
        <div className="space-y-6">
          <div className="bg-muted/30 border border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background border border-border">
                <BookOpen size={18} className="text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Account Ready
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Registration confirmed for{" "}
                  <span className="text-foreground font-medium">
                    {customerEmail}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-muted-foreground block">
                Access Period
              </span>
              <span className="text-xs font-mono font-bold text-foreground">
                365 Days
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Your workspace has been established. You have immediate access to full diagnostic examinations, adaptive module transitions, and complete performance analytics.
          </p>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-between bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-3 px-4 transition-colors"
            >
              <span className="tracking-widest uppercase">
                Enter Diagnostic Workspace
              </span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-2xl bg-card border border-border p-8 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <SuccessContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}