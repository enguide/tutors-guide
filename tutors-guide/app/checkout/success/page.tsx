/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Users, BookOpen, ArrowRight, KeyRound, Loader2 } from "lucide-react";
import Stripe from "stripe";
import { connection } from "next/server";
import { Suspense } from "react";

// Explicitly mark this route as blocking dynamic runtime navigation for Next.js 16
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

  // Lookup provisioned LicensePool (B2B)
  const pool = await prisma.licensePool.findUnique({
    where: { stripeSessionId: session_id },
    include: {
      org: true,
      enrollments: true,
    },
  });

  const customerEmail = session.customer_details?.email || "";
  const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const shareableJoinLink = pool?.inviteCode ? `${origin}/join?code=${pool.inviteCode}` : "";
  const formattedExpiry = pool ? new Date(pool.expiresAt).toLocaleDateString() : "";

  return (
    <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[4px] p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-[4px]">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">Entitlement Provisioned</h1>
          <p className="text-xs text-slate-400 font-mono">Order Ref: {session.id}</p>
        </div>
      </div>

      {pool ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-[4px] p-4">
              <span className="text-xs text-slate-400">Entitled Categories</span>
              <p className="text-sm font-semibold text-white mt-1">
                {pool.categories.join(", ")}
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-[4px] p-4">
              <span className="text-xs text-slate-400">Access Validity</span>
              <p className="text-sm font-semibold text-white mt-1">
                1 Year (Through {formattedExpiry})
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-indigo-500/20 rounded-[4px] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium">
                <Users className="w-4 h-4" />
                <span>Organization Seat Allocation ({pool.seatLimit} Total Seats)</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {pool.enrollments.length} / {pool.seatLimit} claimed
              </span>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Student Invite Code</label>
              <div className="text-sm font-mono bg-slate-900 border border-slate-800 px-3 py-2 rounded-[4px] text-white">
                {pool.inviteCode}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Shareable Student Claim URL</label>
              <div className="text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-2 rounded-[4px] text-slate-300 break-all select-all">
                {shareableJoinLink}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <Link
              href="/dashboard"
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 px-4 rounded-[4px] transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-[4px] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-medium text-white">Diagnostic Suite Ready</h3>
                <p className="text-xs text-slate-400">
                  Account provisioned for <span className="text-slate-200">{customerEmail}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-800">
            {customerEmail && (
              <Link
                href={`/forgot-password?email=${encodeURIComponent(customerEmail)}`}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium py-2.5 px-4 rounded-[4px] border border-slate-700 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Set Password
              </Link>
            )}
            <Link
              href="/login"
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium py-2.5 px-4 rounded-[4px] transition-colors"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <Suspense
        fallback={
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[4px] p-8 shadow-2xl flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
        }
      >
        <SuccessContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}