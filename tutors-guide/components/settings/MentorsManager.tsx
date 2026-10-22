/* eslint-disable @typescript-eslint/no-explicit-any */
// components/settings/MentorsManager.tsx
"use client";

import React, { useState, useTransition } from "react";
import {
  MentorshipLinkItem,
  requestMentorConnection,
  revokeMentorshipAccess,
  respondToMentorshipRequest,
} from "@/actions/mentorship";
import { LinkStatus } from "@prisma/client";
import {
  Shield,
  UserCheck,
  UserX,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  X,
} from "lucide-react";

interface MentorsManagerProps {
  initialLinks: MentorshipLinkItem[];
  currentUserId: string;
}

export function MentorsManager({ initialLinks, currentUserId }: MentorsManagerProps) {
  const [links, setLinks] = useState<MentorshipLinkItem[]>(initialLinks);
  const [emailInput, setEmailInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeLinks = links.filter((l) => l.status === LinkStatus.ACTIVE);
  const pendingLinks = links.filter((l) => l.status === LinkStatus.PENDING);

  // 1. Authorize tutor via email
  const handleRequestMentor = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const email = emailInput.trim();
    if (!email) return;

    startTransition(async () => {
      try {
        const res = await requestMentorConnection(email);
        if (res.success) {
          setSuccessMsg(`Connection request created for ${res.tutorName}.`);
          setEmailInput("");
          // Append pending link optimistically
          setLinks((prev) => [
            {
              id: res.linkId,
              status: LinkStatus.PENDING,
              createdAt: new Date(),
              tutor: { id: "temp", name: res.tutorName, email },
              student: { id: currentUserId, name: "You", email: "" },
            },
            ...prev,
          ]);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to send request.");
      }
    });
  };

  // 2. Respond to incoming tutor connection request (Accept / Decline)
  const handleRespond = (linkId: string, accept: boolean, tutorName: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        await respondToMentorshipRequest(linkId, accept);
        if (accept) {
          setSuccessMsg(`Mentorship confirmed with ${tutorName}. They can now inspect your diagnostics.`);
          setLinks((prev) =>
            prev.map((l) => (l.id === linkId ? { ...l, status: LinkStatus.ACTIVE } : l))
          );
        } else {
          setSuccessMsg(`Declined mentorship request from ${tutorName}.`);
          setLinks((prev) => prev.filter((l) => l.id !== linkId));
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to update request.");
      }
    });
  };

  // 3. Unilateral Revocation by student
  const handleRevoke = (linkId: string, tutorName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to revoke access for ${tutorName}? They will immediately lose access to your diagnostic scores, pacing data, and answer reviews.`
    );
    if (!confirmed) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        await revokeMentorshipAccess(linkId);
        setSuccessMsg(`Access revoked for ${tutorName}.`);
        setLinks((prev) => prev.filter((l) => l.id !== linkId));
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to revoke access.");
      }
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header & Data Sovereignty Notice */}
      <div className="bg-card border border-border p-6 rounded-none space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-base">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>Diagnostic Data Delegation & Privacy</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You retain complete ownership over your diagnostic test scores, pacing telemetry, and question reviews.
          Only mentors explicitly authorized below can inspect your test runs. You may revoke access at any time.
        </p>
      </div>

      {/* Status Banners */}
      {errorMsg && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 rounded-none">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2 rounded-none">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Authorize a Tutor Form */}
      <div className="bg-card border border-border p-6 rounded-none space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Authorize a Private Tutor
        </h3>
        <form onSubmit={handleRequestMentor} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter tutor's verified email..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-input rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 rounded-none"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
            Connect Mentor
          </button>
        </form>
      </div>

      {/* Pending Approval Requests */}
      {pendingLinks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Pending Requests ({pendingLinks.length})</span>
          </h3>
          <div className="grid gap-3">
            {pendingLinks.map((link) => (
              <div
                key={link.id}
                className="bg-card border border-amber-500/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none"
              >
                <div>
                  <div className="font-bold text-sm text-foreground">{link.tutor.name}</div>
                  <div className="text-xs text-muted-foreground">{link.tutor.email}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Requested on {new Date(link.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleRespond(link.id, true, link.tutor.name)}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 rounded-none"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleRespond(link.id, false, link.tutor.name)}
                    className="px-3 py-1.5 text-xs font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1 rounded-none"
                  >
                    <X className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Mentors List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Active Authorized Mentors ({activeLinks.length})
        </h3>

        {activeLinks.length === 0 ? (
          <div className="p-8 border border-dashed border-border text-center text-sm text-muted-foreground rounded-none">
            No mentors currently have access to your testing telemetry.
          </div>
        ) : (
          <div className="grid gap-3">
            {activeLinks.map((link) => (
              <div
                key={link.id}
                className="bg-card border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none"
              >
                <div>
                  <div className="font-bold text-sm text-foreground flex items-center gap-2">
                    {link.tutor.name}
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 font-bold uppercase">
                      Active
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{link.tutor.email}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Connected on {new Date(link.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleRevoke(link.id, link.tutor.name)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-600/30 hover:bg-rose-600/10 transition-colors flex items-center gap-1.5 self-start sm:self-center rounded-none"
                >
                  <UserX className="w-3.5 h-3.5" />
                  Revoke Access
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}