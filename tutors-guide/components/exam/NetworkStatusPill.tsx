// components/exam/NetworkStatusPill.tsx
"use client";

import React, { useState, useEffect } from "react";
import type { SyncStatus } from "@/hooks/useTestProgress";

interface NetworkStatusPillProps {
  status: SyncStatus;
  className?: string;
}

export const NetworkStatusPill: React.FC<NetworkStatusPillProps> = ({
  status,
  className = "",
}) => {
  const [prevStatus, setPrevStatus] = useState<SyncStatus>(status);
  const [showRecentlySynced, setShowRecentlySynced] = useState(false);

  if (status !== prevStatus) {
    setPrevStatus(status);
    if ((prevStatus === "offline" || prevStatus === "retrying") && status === "synced") {
      setShowRecentlySynced(true);
    }
  }

  useEffect(() => {
    if (!showRecentlySynced) return;
    const timer = setTimeout(() => setShowRecentlySynced(false), 3000);
    return () => clearTimeout(timer);
  }, [showRecentlySynced]);

  // When cleanly synced, keep the UI minimal (invisible or transient success)
  if (status === "synced" && !showRecentlySynced) {
    return (
      <span
        title="Synced"
        className={`relative inline-flex items-center justify-center w-2 h-2 ${className}`}
      >
        <span className="relative inline-flex w-2 h-2 rounded-full bg-[#2050c8]" />
      </span>
    );
  }

  // Transient synced confirmation
  if (showRecentlySynced) {
    return (
      <span
        title="All answers synced"
        className={`inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-in fade-in duration-300 ${className}`}
      />
    );
  }

  // Offline / Disconnected
  if (status === "offline") {
    return (
      <span
        title="Offline. Answers are saved locally and will sync when reconnected."
        className={`relative inline-flex items-center justify-center w-2 h-2 ${className}`}
      >
        <span className="absolute inline-flex w-full h-full rounded-full bg-rose-400 opacity-75 animate-ping" />
        <span className="relative inline-flex w-2 h-2 rounded-full bg-rose-600" />
      </span>
    );
  }

  // Syncing / Retrying in background
  if (status === "retrying" || status === "saving") {
    return (
      <span
        title="Syncing answers..."
        className={`relative inline-flex items-center justify-center w-2 h-2 ${className}`}
      >
        <span className="absolute inline-flex w-full h-full rounded-full bg-blue-400 opacity-75 animate-ping" />
        <span className="relative inline-flex w-2 h-2 rounded-full bg-[#2050c8]" />
      </span>
    );
  }

  return null;
};