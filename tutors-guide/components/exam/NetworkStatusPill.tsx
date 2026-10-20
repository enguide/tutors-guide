// components/exam/NetworkStatusPill.tsx
"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, RefreshCw, Check } from "lucide-react";
import type { SyncStatus } from "@/hooks/useTestProgress";

interface NetworkStatusPillProps {
  status: SyncStatus;
}

export const NetworkStatusPill: React.FC<NetworkStatusPillProps> = ({ status }) => {
  // Track previous status and temporary display state
  const [prevStatus, setPrevStatus] = useState<SyncStatus>(status);
  const [showRecentlySynced, setShowRecentlySynced] = useState(false);

  // Derive state adjustment during render when status transitions
  if (status !== prevStatus) {
    setPrevStatus(status);
    if ((prevStatus === "offline" || prevStatus === "retrying") && status === "synced") {
      setShowRecentlySynced(true);
    }
  }

  // Effect is now used ONLY for external timer cleanup/subscription
  useEffect(() => {
    if (!showRecentlySynced) return;

    const timer = setTimeout(() => {
      setShowRecentlySynced(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [showRecentlySynced]);

  // Keep DOM clean when synced and timer has expired
  if (status === "synced" && !showRecentlySynced) {
    return null;
  }

  if (showRecentlySynced) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold font-mono tracking-tight bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-200">
        <Check size={12} />
        <span>Synced</span>
      </div>
    );
  }

  if (status === "offline") {
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold font-mono tracking-tight bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 animate-pulse select-none"
        title="Your internet connection dropped. Answers are safely preserved in browser memory and will automatically sync when connection restores."
      >
        <WifiOff size={12} />
        <span>Reconnecting... progress saved locally</span>
      </div>
    );
  }

  if (status === "retrying" || status === "saving") {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold font-mono tracking-tight bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 select-none">
        <RefreshCw size={12} className="animate-spin" />
        <span>Syncing answers...</span>
      </div>
    );
  }

  return null;
};