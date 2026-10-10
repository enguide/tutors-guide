"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/passwordReset";
import { KeyRound, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[4px] p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-[4px]">
            <KeyRound className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-wide">Reset Password</h1>
            <p className="text-xs text-slate-400">Receive a link to establish or update your login</p>
          </div>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-[4px] text-xs text-emerald-400 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                If an account exists for <strong className="text-emerald-300">{email}</strong>, a reset link has been dispatched. (Check server logs in dev mode).
              </span>
            </div>
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium py-2.5 px-4 rounded-[4px] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Account Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="purchaser@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 px-4 rounded-[4px] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Remembered your password? Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}