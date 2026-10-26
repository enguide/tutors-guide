// app/join/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { redeemInviteCode } from "@/actions/joinOrg";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Loader2, AlertCircle, GraduationCap } from "lucide-react";

function JoinForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeParam = searchParams.get("code") || "";

  const [code, setCode] = useState(codeParam);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await redeemInviteCode({
        inviteCode: code.trim(),
        email: email.trim().toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
      });

      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        router.push(`/login?email=${encodeURIComponent(email)}`);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to redeem institutional access code.");
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
        <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
          Student Enrollment
        </span>
        <h1 className="text-xl font-bold tracking-tight text-foreground uppercase mt-0.5">
          Activate Access
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Enter the access code provided by your school or instructor to activate your diagnostic program.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Access Code
          </label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ORG-XXXX"
            className="w-full bg-background border border-input px-3 py-2 text-xs font-mono font-bold tracking-widest text-foreground focus:outline-none focus:border-primary uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              First Name
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              Last Name
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@school.edu"
            className="w-full bg-background border border-input px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Create Password
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
          <span className="text-[10px] text-muted-foreground mt-1 block">
            Minimum 8 characters.
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-between bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2.5 px-3.5 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2 mx-auto">
              <Loader2 size={14} className="animate-spin" /> Verifying Code...
            </span>
          ) : (
            <>
              <span className="tracking-wider uppercase">Activate Access</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <span>Already have an account?</span>
        <Link href="/login" className="text-foreground font-bold hover:underline">
          Sign In →
        </Link>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-sm bg-card border border-border p-8 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <JoinForm />
      </Suspense>
    </div>
  );
}