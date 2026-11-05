// components/exam/shells/sat/SATCrossOutIcon.tsx
"use client";

import React from "react";

interface SATCrossOutIconProps {
  className?: string;
  isActive?: boolean;
}

export function SATCrossOutIcon({
  className = "w-6 h-5",
  isActive = false,
}: SATCrossOutIconProps) {
  return (
    <svg
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 1. Base ABC Text */}
      <text
        x="14"
        y="15.5"
        textAnchor="middle"
        fill="currentColor"
        fontSize="14.5"
        fontWeight="700"
        fontFamily="var(--font-sans), system-ui, -apple-system, sans-serif"
        letterSpacing="-2.5px"
      >
        ABC
      </text>

      {/* 2. Artificial Shadow Line (Positioned below the main slash) */}
      <line
        x1="3"
        y1="20.5"
        x2="26"
        y2="2.5"
        className={
          isActive
            ? "stroke-[#2050c8]"
            : "stroke-white dark:stroke-neutral-900"
        }
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* 3. Foreground Slash */}
      <line
        x1="3"
        y1="19"
        x2="26"
        y2="1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}