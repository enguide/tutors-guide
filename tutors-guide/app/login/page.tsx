// app/login/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Loader2, AlertCircle, GraduationCap } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const emailParam = searchParams.get("email") || "";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    authError === "CredentialsSignin"
      ? "Invalid email address or password."
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Access denied. Please check your credentials.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage("Authentication gateway failure. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-card border border-border p-8 shadow-sm rounded-none font-sans">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 bg-primary text-primary-foreground">
          <GraduationCap size={16} />
        </div>
        <span className="text-xs font-bold tracking-tight uppercase">
          The Tutors Guide
        </span>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
          Sign In
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Access your diagnostic examinations and preparation records.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            placeholder="student@school.edu"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-mono text-muted-foreground hover:text-foreground"
            >
              Reset?
            </Link>
          </div>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-input px-3 py-2 text-xs font-mono tracking-widest text-foreground focus:outline-none focus:border-primary"
            placeholder="••••••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-between bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2.5 px-3.5 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2 mx-auto">
              <Loader2 size={14} className="animate-spin" /> Verifying...
            </span>
          ) : (
            <>
              <span className="tracking-wider uppercase">Sign In</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <span>Enrolled via institution?</span>
        <Link href="/join" className="text-foreground font-bold hover:underline">
          Enter Code →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-muted/20 text-foreground flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-sm bg-card border border-border p-8 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}