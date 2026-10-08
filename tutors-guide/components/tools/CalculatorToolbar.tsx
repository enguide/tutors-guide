// components/tools/CalculatorToolbar.tsx
"use client";

import React from "react";
import { CalculatorType } from "@/types/examConfig";
import { ToggleGraph } from "./ToggleGraph";

interface CalculatorToolbarProps {
  type: CalculatorType;
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorToolbar: React.FC<CalculatorToolbarProps> = ({
  type,
  isOpen,
  onClose,
}) => {
  if (type === "none" || !isOpen) return null;

  if (type === "desmos-graphing") {
    return <ToggleGraph isOpen={isOpen} onClose={onClose} />;
  }

  // Placeholder for GRE basic 4-function calculator or scientific calculator
  if (type === "gre-basic") {
    return (
      <div className="fixed bottom-4 right-4 z-50 p-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-xl">
        <div className="text-xs font-semibold mb-2 flex justify-between">
          <span>GRE Calculator</span>
          <button onClick={onClose}>✕</button>
        </div>
        <p className="text-xs text-slate-500 font-mono">[Standard 4-Function Memory Calculator]</p>
      </div>
    );
  }

  return null;
};