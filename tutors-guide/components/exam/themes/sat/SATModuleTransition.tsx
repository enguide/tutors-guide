// components/exam/themes/sat/SATModuleTransition.tsx
"use client";

import React from "react";
import { TransitionProps } from "@/types/examPresentation";

/**
 * Authentic Bluebook Circular Dots Spinner
 * Generates 12 circular dots rotated around a ring with staggered sizing and opacity
 */
function BluebookDotSpinner({ className = "w-10 h-10" }: { className?: string }) {
  const dots = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    // Radius of 18px inside a 48x48 viewbox centered at (24, 24)
    const cx = 24 + 16 * Math.sin(angle);
    const cy = 24 - 16 * Math.cos(angle);
    // Trailing dot sizes from 1.2 to 2.8 and opacity fading from 0.15 to 1.0
    const progress = (i + 1) / 12;
    const r = 1.2 + progress * 1.6;
    const opacity = 0.15 + progress * 0.85;

    return (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={r}
        fill="currentColor"
        opacity={opacity}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-spin [animation-duration:1.1s] text-neutral-800 dark:text-neutral-200 ${className}`}
    >
      {dots}
    </svg>
  );
}

export const SATModuleTransition: React.FC<TransitionProps> = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-950 font-sans select-none animate-in fade-in duration-200">
      <div className="flex flex-col items-center text-center max-w-lg px-6">
        {/* Bluebook Section Transition Header */}
        <h1 className="text-2xl sm:text-[28px] font-sans font-medium text-[#2050c8] dark:text-blue-400 tracking-tight mb-4">
          This Module Is Over
        </h1>

        {/* Informational Guidance */}
        <div className="text-[14px] leading-relaxed text-neutral-800 dark:text-neutral-300 font-sans space-y-1 mb-8">
          <p>All your work has been saved.</p>
          <p>You&apos;ll move on automatically in just a moment.</p>
          <p>Do not refresh this page or quit the app.</p>
        </div>

        {/* Circular Dot Animation */}
        <div className="flex items-center justify-center">
          <BluebookDotSpinner className="w-9 h-9" />
        </div>
      </div>
    </div>
  );
};