// components/tools/DesmosExplanationEmbed.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

export interface DesmosExpression {
  id: string;
  latex: string;
  color?: string; // e.g., "#2563eb", "#16a34a", "#dc2626"
  lineStyle?: "SOLID" | "DASHED" | "DOTTED";
  lineWidth?: number;
  hidden?: boolean;
  points?: boolean;
  lines?: boolean;
  label?: string;
  showLabel?: boolean;
}

export interface DesmosGraphBounds {
  left: number;
  right: number;
  bottom: number;
  top: number;
}

export interface DesmosExplanationEmbedProps {
  id: string;
  expressions: DesmosExpression[];
  bounds?: DesmosGraphBounds;
  height?: number;
  caption?: string;
  allowInteraction?: boolean;
  showSidebar?: boolean; // defaults to true to show the authentic expression list
}

export const DesmosExplanationEmbed: React.FC<DesmosExplanationEmbedProps> = ({
  id,
  expressions,
  bounds = { left: -10, right: 10, bottom: -10, top: 10 },
  height = 420, // increased height for side-by-side expressions + graph
  caption,
  allowInteraction = true,
  showSidebar = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calcInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const applyGraphState = () => {
    if (!calcInstanceRef.current) return;
    const calc = calcInstanceRef.current;

    calc.setMathBounds({
      left: bounds.left,
      right: bounds.right,
      bottom: bounds.bottom,
      top: bounds.top,
    });

    // Clear previous expressions to prevent duplicate accumulation
    calc.removeExpressions(calc.getExpressions());

    // Inject expressions in order so lines 1, 2, 3... match the student's entry order
    expressions.forEach((expr) => {
      calc.setExpression({
        id: expr.id,
        latex: expr.latex,
        color: expr.color || "#2563eb",
        lineStyle: expr.lineStyle || "SOLID",
        lineWidth: expr.lineWidth ?? 2.5,
        hidden: expr.hidden ?? false,
        points: expr.points ?? true,
        lines: expr.lines ?? true,
        label: expr.label,
        showLabel: expr.showLabel ?? false,
      });
    });
  };

  const initEmbed = () => {
    if (!window.Desmos || !containerRef.current || calcInstanceRef.current) return;

    const calc = window.Desmos.GraphingCalculator(containerRef.current, {
      keypad: false,
      graphpaper: true,
      expressions: showSidebar, // Enables the authentic left expression list
      expressionsCollapsed: false,
      settingsMenu: false,
      zoomButtons: false,
      border: false,
      lockViewport: !allowInteraction,
      fontSize: 13,
    });

    calcInstanceRef.current = calc;
    applyGraphState();
    setIsLoaded(true);
  };

  useEffect(() => {
    if (window.Desmos && !calcInstanceRef.current) {
      initEmbed();
    }
  }, []);

  useEffect(() => {
    if (calcInstanceRef.current) {
      applyGraphState();
    }
  }, [expressions, bounds]);

  useEffect(() => {
    return () => {
      calcInstanceRef.current?.destroy();
      calcInstanceRef.current = null;
    };
  }, []);

  const handleResetBounds = () => {
    if (!calcInstanceRef.current) return;
    calcInstanceRef.current.setMathBounds(bounds);
  };

  const handleZoom = (factor: number) => {
    if (!calcInstanceRef.current) return;
    const current = calcInstanceRef.current.graphpaperBounds.mathCoordinates;
    const centerX = (current.left + current.right) / 2;
    const centerY = (current.top + current.bottom) / 2;
    const width = (current.right - current.left) * factor;
    const height = (current.top - current.bottom) * factor;

    calcInstanceRef.current.setMathBounds({
      left: centerX - width / 2,
      right: centerX + width / 2,
      bottom: centerY - height / 2,
      top: centerY + height / 2,
    });
  };

  return (
    <div className="my-5 w-full border border-neutral-300 dark:border-neutral-700 rounded-md overflow-hidden bg-white dark:bg-neutral-900 shadow-xs not-prose">
      <Script
        src="https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
        strategy="lazyOnload"
        onLoad={initEmbed}
      />

      {/* Bluebook-style Header Bar */}
      <div className="h-8 bg-neutral-100 dark:bg-neutral-800/90 border-b border-neutral-200 dark:border-neutral-700/80 px-3 flex items-center justify-between text-xs font-sans text-neutral-800 dark:text-neutral-200 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
          <span className="font-semibold text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Interactive Desmos View (Actual Screen Match)
          </span>
        </div>

        {allowInteraction && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleZoom(0.8)}
              title="Zoom In"
              className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(1.25)}
              title="Zoom Out"
              className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3 bg-neutral-300 dark:bg-neutral-600 mx-1" />
            <button
              type="button"
              onClick={handleResetBounds}
              title="Reset Graph Window"
              className="p-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Desmos Mounting Container */}
      <div
        style={{ height: `${height}px` }}
        className="relative w-full bg-white"
      >
        <div
          ref={containerRef}
          id={`desmos-embed-${id}`}
          className="w-full h-full"
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 text-xs text-muted-foreground animate-pulse">
            Loading Calculator Screen...
          </div>
        )}
      </div>

      {/* Strategy / Screen Takeaway Caption */}
      {caption && (
        <div className="p-3 bg-neutral-50 dark:bg-neutral-950/50 border-t border-neutral-200 dark:border-neutral-800 text-xs font-sans text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200 shrink-0">
            Takeaway:
          </span>
          <span>{caption}</span>
        </div>
      )}
    </div>
  );
};