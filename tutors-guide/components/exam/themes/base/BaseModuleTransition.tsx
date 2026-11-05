// components/exam/themes/base/BaseModuleTransition.tsx
"use client";

import React from "react";
import { TransitionProps } from "@/types/examPresentation";

export const BaseModuleTransition: React.FC<TransitionProps> = ({
  sectionTitle,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 font-sans select-none animate-in fade-in duration-150">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white mb-4" />
      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
        Finalizing section and loading next module...
      </p>
      {sectionTitle && (
        <p className="text-xs text-neutral-500 font-mono mt-1">
          {sectionTitle}
        </p>
      )}
    </div>
  );
};