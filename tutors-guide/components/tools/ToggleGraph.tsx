// components/tools/ToggleGraph.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";
import { X, MoveDiagonal } from "lucide-react";

interface ToggleGraphProps {
  isOpen: boolean;
  onClose: () => void;
  onInteract?: () => void;
}

type CalculatorMode = "graphing" | "scientific";

declare global {
  interface Window {
    Desmos?: {
      GraphingCalculator: (
        element: HTMLElement,
        options?: Record<string, unknown>
      ) => {
        resize: () => void;
        destroy: () => void;
        observeEvent: (eventName: string, callback: () => void) => void;
        getState: () => Record<string, unknown>;
        setState: (state: Record<string, unknown>) => void;
      };
      ScientificCalculator: (
        element: HTMLElement,
        options?: Record<string, unknown>
      ) => {
        resize: () => void;
        destroy: () => void;
        observeEvent: (eventName: string, callback: () => void) => void;
        getState: () => Record<string, unknown>;
        setState: (state: Record<string, unknown>) => void;
      };
    };
  }
}

function GraphingIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M1 8.5C2.5 4 4.5 4 6 8.5C7.5 13 9.5 13 11 8.5C12.5 4 14.5 4 15 8.5" />
    </svg>
  );
}

function ScientificIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="1" width="12" height="14" rx="1.5" />
      <rect x="4" y="3" width="8" height="3" rx="0.5" />
      <circle cx="5" cy="8.5" r="0.6" fill="currentColor" />
      <circle cx="8" cy="8.5" r="0.6" fill="currentColor" />
      <circle cx="11" cy="8.5" r="0.6" fill="currentColor" />
      <circle cx="5" cy="11.5" r="0.6" fill="currentColor" />
      <circle cx="8" cy="11.5" r="0.6" fill="currentColor" />
      <circle cx="11" cy="11.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function SixDotGrip({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 12" fill="currentColor" className={className}>
      <circle cx="3" cy="3" r="1.3" />
      <circle cx="8" cy="3" r="1.3" />
      <circle cx="13" cy="3" r="1.3" />
      <circle cx="3" cy="9" r="1.3" />
      <circle cx="8" cy="9" r="1.3" />
      <circle cx="13" cy="9" r="1.3" />
    </svg>
  );
}

export const ToggleGraph: React.FC<ToggleGraphProps> = ({ isOpen, onClose, onInteract }) => {
  const graphingContainerRef = useRef<HTMLDivElement>(null);
  const scientificContainerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphingInstance = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scientificInstance = useRef<any>(null);

  const [mode, setMode] = useState<CalculatorMode>("graphing");

  const onInteractRef = useRef(onInteract);
  useEffect(() => {
    onInteractRef.current = onInteract;
  }, [onInteract]);

  // Synchronously compute responsive dimensions based on active viewport
  const [size, setSize] = useState<{ width: number; height: number }>(() => {
    if (typeof window === "undefined") return { width: 440, height: 580 };
    const isMobile = window.innerWidth < 768;
    return {
      width: isMobile ? Math.min(window.innerWidth - 16, 440) : 440,
      height: isMobile ? Math.min(window.innerHeight - 140, 520) : 580,
    };
  });

  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window === "undefined") return { x: 80, y: 80 };
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return { x: 8, y: 72 };
    }
    const maxLeft = Math.max(20, window.innerWidth - 460);
    return { x: Math.min(80, maxLeft), y: 80 };
  });

  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; startX: number; startY: number }>({
    clientX: 0,
    clientY: 0,
    startX: 0,
    startY: 0,
  });
  const resizeStartRef = useRef<{ clientX: number; clientY: number; startW: number; startH: number }>({
    clientX: 0,
    clientY: 0,
    startW: 0,
    startH: 0,
  });

  const initCalculator = useCallback((targetMode: CalculatorMode) => {
    if (!window.Desmos) return;

    if (targetMode === "graphing" && graphingContainerRef.current && !graphingInstance.current) {
      const calc = window.Desmos.GraphingCalculator(graphingContainerRef.current, {
        keypad: true,
        graphpaper: true,
        expressions: true,
        settingsMenu: true,
        zoomButtons: true,
        border: false,
        fontSize: 14,
      });
      graphingInstance.current = calc;
      calc.observeEvent("change", () => onInteractRef.current?.());
    }

    if (targetMode === "scientific" && scientificContainerRef.current && !scientificInstance.current) {
      const calc = window.Desmos.ScientificCalculator(scientificContainerRef.current, {
        keypad: true,
        settingsMenu: false,
        border: false,
        fontSize: 14,
      });
      scientificInstance.current = calc;
      calc.observeEvent("change", () => onInteractRef.current?.());
    }
  }, []);

  useEffect(() => {
    if (isOpen && window.Desmos) {
      initCalculator(mode);

      const activeInstance = mode === "graphing" ? graphingInstance.current : scientificInstance.current;
      setTimeout(() => {
        activeInstance?.resize();
      }, 50);
    }
  }, [isOpen, mode, initCalculator]);

  useEffect(() => {
    return () => {
      graphingInstance.current?.destroy();
      scientificInstance.current?.destroy();
      graphingInstance.current = null;
      scientificInstance.current = null;
    };
  }, []);

  const handleModeChange = (newMode: CalculatorMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    initCalculator(newMode);

    setTimeout(() => {
      if (newMode === "graphing") {
        graphingInstance.current?.resize();
      } else {
        scientificInstance.current?.resize();
      }
    }, 50);
  };

  // Unified Mouse & Touch movement handlers for drag & resize
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDraggingRef.current) {
        const deltaX = currentX - dragStartRef.current.clientX;
        const deltaY = currentY - dragStartRef.current.clientY;
        const nextX = Math.max(4, Math.min(window.innerWidth - 120, dragStartRef.current.startX + deltaX));
        const nextY = Math.max(4, Math.min(window.innerHeight - 60, dragStartRef.current.startY + deltaY));
        setPosition({ x: nextX, y: nextY });
      }

      if (isResizingRef.current) {
        const deltaW = currentX - resizeStartRef.current.clientX;
        const deltaH = currentY - resizeStartRef.current.clientY;
        const nextW = Math.max(280, Math.min(window.innerWidth - 12, resizeStartRef.current.startW + deltaW));
        const nextH = Math.max(300, Math.min(window.innerHeight - 20, resizeStartRef.current.startH + deltaH));
        setSize({ width: nextW, height: nextH });

        const activeInstance = mode === "graphing" ? graphingInstance.current : scientificInstance.current;
        activeInstance?.resize();
      }
    };

    const handleEnd = () => {
      if (isDraggingRef.current || isResizingRef.current) {
        isDraggingRef.current = false;
        isResizingRef.current = false;
        const activeInstance = mode === "graphing" ? graphingInstance.current : scientificInstance.current;
        activeInstance?.resize();
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("touchcancel", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, [mode]);

  const startDrag = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      clientX,
      clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStartHeader = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  const startResize = (clientX: number, clientY: number) => {
    isResizingRef.current = true;
    resizeStartRef.current = {
      clientX,
      clientY,
      startW: size.width,
      startH: size.height,
    };
  };

  return (
    <>
      <Script
        src="https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
        strategy="lazyOnload"
        onLoad={() => initCalculator(mode)}
      />

      <div
        style={{
          display: isOpen ? "flex" : "none",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          maxWidth: "calc(100vw - 12px)",
          maxHeight: "calc(100dvh - 75px)",
        }}
        className="fixed z-50 bg-white dark:bg-neutral-900 border border-neutral-400 dark:border-neutral-700 rounded-none shadow-2xl flex flex-col select-none touch-none"
      >
        {/* Bluebook Dark Header with Drag Grip */}
        <div
          onMouseDown={handleMouseDownHeader}
          onTouchStart={handleTouchStartHeader}
          className="h-10 bg-[#1c1c1c] text-white px-2 sm:px-2.5 grid grid-cols-3 items-center cursor-move select-none shrink-0 rounded-none touch-none"
        >
          {/* Segmented Switcher */}
          <div className="justify-self-start flex items-center bg-[#2a2a2a] rounded-[5px] border border-neutral-700">
            <button
              type="button"
              onClick={() => handleModeChange("graphing")}
              className={`flex items-center gap-1 px-1.5 py-1 text-[9px] sm:text-[10px] font-semibold rounded-l-sm transition-colors cursor-pointer ${
                mode === "graphing"
                  ? "bg-white text-neutral-950 shadow-xs font-bold"
                  : "text-white hover:text-neutral-200"
              }`}
            >
              <GraphingIcon className="w-3.5 h-3.5" />
              <span>Graph</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("scientific")}
              className={`flex items-center gap-1 px-1.5 py-1 text-[9px] sm:text-[10px] font-semibold rounded-r-sm transition-colors cursor-pointer ${
                mode === "scientific"
                  ? "bg-white text-neutral-950 shadow-xs font-bold"
                  : "text-white hover:text-neutral-200"
              }`}
            >
              <ScientificIcon className="w-3.5 h-3.5" />
              <span>Sci</span>
            </button>
          </div>

          {/* Center Grip */}
          <div className="justify-self-center flex items-center text-neutral-200">
            <SixDotGrip className="w-6 h-6" />
          </div>

          {/* Close Button */}
          <div className="justify-self-end flex items-center">
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-neutral-200 hover:text-white transition-colors cursor-pointer"
              title="Close calculator"
            >
              <X className="w-5 h-5 stroke-2" />
            </button>
          </div>
        </div>

        {/* Persistent Desmos Containers */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-white">
          <div
            ref={graphingContainerRef}
            style={{ display: mode === "graphing" ? "block" : "none" }}
            className="w-full h-full"
          />
          <div
            ref={scientificContainerRef}
            style={{ display: mode === "scientific" ? "block" : "none" }}
            className="w-full h-full"
          />
        </div>

        {/* Circular Bottom-Right Resize Handle */}
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            startResize(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            startResize(e.touches[0].clientX, e.touches[0].clientY);
          }}
          className="absolute -bottom-2 -right-2 w-7 h-7 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-full shadow-md cursor-nwse-resize flex items-center justify-center text-neutral-800 hover:text-black dark:text-neutral-200 dark:hover:text-white z-30 transition-transform active:scale-95 touch-none"
          title="Resize calculator"
        >
          <MoveDiagonal className="w-4 h-4 rotate-90" />
        </div>
      </div>
    </>
  );
};