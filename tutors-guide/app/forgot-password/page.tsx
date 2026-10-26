// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/passwordReset";
import { ArrowRight, Loader2, CheckCircle2, ArrowLeft, GraduationCap } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-border p-8 shadow-sm rounded-none">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 bg-primary text-primary-foreground">
            <GraduationCap size={16} />
          </div>
          <span className="text-xs font-black tracking-tight uppercase">Tutors Guide</span>
        </div>

        <div className="mb-6">
          <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            Security Recovery
          </span>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase mt-0.5">
            Reset Password
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Dispatch a secure token link to re-establish your credentials.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="leading-relaxed">
                If an account exists for <strong className="font-mono text-foreground">{email}</strong>, a reset link has been dispatched.
              </span>
            </div>
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-bold py-2.5 px-4 border border-border transition-colors uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Candidate Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-between bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2.5 px-3.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2 mx-auto">
                  <Loader2 size={14} className="animate-spin" /> Dispatching...
                </span>
              ) : (
                <>
                  <span className="tracking-wider uppercase">Send Reset Link</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                Remember your password? Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}