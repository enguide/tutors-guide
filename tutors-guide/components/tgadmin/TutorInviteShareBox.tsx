// components/admin/TutorInviteShareBox.tsx
"use client";

import React, { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

interface TutorInviteShareBoxProps {
  inviteUrl: string;
}

export function TutorInviteShareBox({ inviteUrl }: TutorInviteShareBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border p-4 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 text-primary border border-primary/20">
          <Share2 className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-foreground">
            Direct Student Mentorship Link
          </div>
          <div className="text-xs text-muted-foreground">
            Share this link with private students to connect diagnostics without an institutional seat.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <input
          readOnly
          value={inviteUrl}
          className="text-xs bg-muted/50 border border-input px-3 py-1.5 rounded-none text-muted-foreground w-full sm:w-64 font-mono select-all"
        />
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 shrink-0 rounded-none transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}