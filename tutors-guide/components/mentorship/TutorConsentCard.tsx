/* eslint-disable @typescript-eslint/no-explicit-any */
// components/mentorship/TutorConsentCard.tsx
"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { acceptTutorInvite } from "@/actions/mentorship";
import { ShieldCheck, ArrowRight, Loader2, AlertCircle } from "lucide-react";

interface TutorConsentCardProps {
  tutor: {
    id: string;
    name: string;
    email: string;
  };
}

export function TutorConsentCard({ tutor }: TutorConsentCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAccept = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await acceptTutorInvite(tutor.id);
        if (res.success) {
          router.push("/settings/mentors");
        }
      } catch (err: any) {
        setError(err.message || "Failed to link tutor.");
      }
    });
  };

  return (
    <div className="bg-card border border-border p-8 rounded-none shadow-sm max-w-lg w-full space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-3 bg-blue-500/10 text-blue-600 rounded-none border border-blue-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Connect with Mentor</h2>
          <p className="text-xs text-muted-foreground">Peer-to-Peer Diagnostic Delegation</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3 text-sm">
        <p className="text-foreground">
          Do you want to authorize <strong className="font-bold">{tutor.name}</strong> (
          <span className="text-muted-foreground">{tutor.email}</span>) to view your diagnostic test results?
        </p>

        <div className="bg-muted/50 p-4 border border-border text-xs space-y-2 text-muted-foreground">
          <div className="font-semibold text-foreground">By connecting, this mentor will be able to:</div>
          <ul className="list-disc pl-4 space-y-1">
            <li>Inspect your section scores, pacing charts, and navigation traces</li>
            <li>Review multiple-choice and free-response answers and explanations</li>
            <li>Track your question error patterns across test domains</li>
          </ul>
        </div>

        <p className="text-[11px] text-muted-foreground">
          You can unilaterally revoke this permission at any time from your settings.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          disabled={isPending}
          className="flex-1 py-2.5 text-xs font-semibold border border-border hover:bg-muted transition-colors rounded-none"
        >
          Decline
        </button>

        <button
          type="button"
          onClick={handleAccept}
          disabled={isPending}
          className="flex-1 py-2.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 rounded-none"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Authorize & Connect <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}