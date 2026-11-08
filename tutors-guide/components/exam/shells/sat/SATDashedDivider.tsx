// components/exam/shells/sat/SATDashedDivider.tsx
"use client";

import React from "react";

interface SATDashedDividerProps {
  position?: "top" | "bottom";
  className?: string;
}

export const SATDashedDivider: React.FC<SATDashedDividerProps> = ({
  position = "bottom",
  className = "",
}) => {
  return (
    <svg
      className={`absolute inset-x-0 w-full h-0.5 pointer-events-none z-20 ${
        position === "top" ? "top-0" : "bottom-0"
      } ${className}`}
      preserveAspectRatio="none"
      viewBox="0 0 100 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0"
        y1="1"
        x2="100%"
        y2="1"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="30 2"
        vectorEffect="non-scaling-stroke"
        className="text-[#2b2b2b] dark:text-neutral-600"
      />
    </svg>
  );
};