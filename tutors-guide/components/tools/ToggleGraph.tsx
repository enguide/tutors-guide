// components/tools/ToggleGraph.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";
import { X } from "lucide-react";

interface ToggleGraphProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    Desmos?: {
      GraphingCalculator: (
        element: HTMLElement,
        options?: Record<string, unknown>
      ) => unknown;
    };
  }
}

export const ToggleGraph: React.FC<ToggleGraphProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorInstance = useRef<unknown>(null);

  const initDesmos = () => {
    if (window.Desmos && containerRef.current && !calculatorInstance.current) {
      calculatorInstance.current = window.Desmos.GraphingCalculator(
        containerRef.current,
        {
          keypad: true,
          graphpaper: true,
          expressions: true,
          settingsMenu: false,
          border: false,
        }
      );
    }
  };

  useEffect(() => {
    if (isOpen && window.Desmos) {
      initDesmos();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <Script
        src="https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
        strategy="lazyOnload"
        onLoad={initDesmos}
      />
      <div className="fixed bottom-4 right-4 z-50 w-135 h-120 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Toolbar Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Desmos Graphing Calculator
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded"
              title="Close calculator"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        {/* Desmos Mounting Container */}
        <div ref={containerRef} className="flex-1 w-full h-full" />
      </div>
    </>
  );
};