// app/reset-password/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { resetPasswordWithToken } from "@/actions/passwordReset";
import { ArrowRight, Loader2, AlertCircle, CheckCircle2, GraduationCap } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="w-full max-w-sm bg-card border border-border p-8 shadow-sm text-center">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
          Invalid or Expired Link
        </h2>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          This security recovery token is missing or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="text-xs font-mono font-bold text-primary hover:underline"
        >
          Request new reset link →
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await resetPasswordWithToken(token, password);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(res.email)}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-card border border-border p-8 shadow-sm rounded-none">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 bg-primary text-primary-foreground">
          <GraduationCap size={16} />
        </div>
        <span className="text-xs font-black tracking-tight uppercase">Tutors Guide</span>
      </div>

      <div className="mb-6">
        <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
          Credential Management
        </span>
        <h1 className="text-xl font-bold tracking-tight text-foreground uppercase mt-0.5">
          New Password
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Establish a secure password for your candidate account.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Password established successfully. Routing to workstation sign in...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-background border border-input px-3 py-2 text-xs font-mono tracking-widest text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-background border border-input px-3 py-2 text-xs font-mono tracking-widest text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-between bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2.5 px-3.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2 mx-auto">
                <Loader2 size={14} className="animate-spin" /> Saving Password...
              </span>
            ) : (
              <>
                <span className="tracking-wider uppercase">Update Credentials</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-sm bg-card border border-border p-8 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}