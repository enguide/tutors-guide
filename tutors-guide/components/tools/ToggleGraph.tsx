// components/tools/ToggleGraph.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";
import { X, GripHorizontal, MoveDiagonal } from "lucide-react";

interface ToggleGraphProps {
  isOpen: boolean;
  onClose: () => void;
  onInteract?: () => void;
}

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
      };
    };
  }
}

export const ToggleGraph: React.FC<ToggleGraphProps> = ({ isOpen, onClose, onInteract }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculatorInstance = useRef<any>(null);

  // Keep interaction callback reference synced with active question index
  const onInteractRef = useRef(onInteract);
  useEffect(() => {
    onInteractRef.current = onInteract;
  }, [onInteract]);

  // Position and Dimension State
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 80, y: 80 });
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 440, height: 560 });

  // Refs for tracking mouse drag and resize operations
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number }>({
    mouseX: 0,
    mouseY: 0,
    startW: 0,
    startH: 0,
  });

  const initDesmos = useCallback(() => {
    if (window.Desmos && containerRef.current && !calculatorInstance.current) {
      const calc = window.Desmos.GraphingCalculator(
        containerRef.current,
        {
          keypad: true,
          graphpaper: true,
          expressions: true,
          settingsMenu: false,
          border: false,
          fontSize: 14,
        }
      );
      calculatorInstance.current = calc;

      // Fires on user interactions: typing expressions, moving sliders, panning, zooming
      calc.observeEvent("change", () => {
        onInteractRef.current?.();
      });
    }
  }, []);

  // When revealed, prompt Desmos to recalibrate canvas bounds
  useEffect(() => {
    if (isOpen) {
      if (!calculatorInstance.current && window.Desmos) {
        initDesmos();
      } else if (calculatorInstance.current) {
        setTimeout(() => {
          calculatorInstance.current?.resize();
        }, 50);
      }
    }
  }, [isOpen, initDesmos]);

  // Window-level mouse listeners for smooth drag & resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStartRef.current.mouseX;
        const deltaY = e.clientY - dragStartRef.current.mouseY;
        const nextX = Math.max(10, Math.min(window.innerWidth - 150, dragStartRef.current.startX + deltaX));
        const nextY = Math.max(10, Math.min(window.innerHeight - 80, dragStartRef.current.startY + deltaY));
        setPosition({ x: nextX, y: nextY });
      }

      if (isResizingRef.current) {
        const deltaW = e.clientX - resizeStartRef.current.mouseX;
        const deltaH = e.clientY - resizeStartRef.current.mouseY;
        const nextW = Math.max(340, Math.min(window.innerWidth - 40, resizeStartRef.current.startW + deltaW));
        const nextH = Math.max(380, Math.min(window.innerHeight - 40, resizeStartRef.current.startH + deltaH));
        setSize({ width: nextW, height: nextH });
        calculatorInstance.current?.resize();
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current || isResizingRef.current) {
        isDraggingRef.current = false;
        isResizingRef.current = false;
        calculatorInstance.current?.resize();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    isResizingRef.current = true;
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: size.width,
      startH: size.height,
    };
  };

  return (
    <>
      <Script
        src="https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
        strategy="lazyOnload"
        onLoad={initDesmos}
      />

      <div
        style={{
          display: isOpen ? "flex" : "none",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
        className="fixed z-50 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-2xl flex flex-col select-none"
      >
        {/* Header Bar */}
        <div
          onMouseDown={handleMouseDownHeader}
          className="h-10 bg-neutral-900 text-white pl-4 pr-2 grid grid-cols-3 items-center cursor-move select-none shrink-0 rounded-t-[7px]"
        >
          <span className="text-sm font-sans font-bold tracking-tight justify-self-start">
            Calculator
          </span>

          <div className="justify-self-center flex items-center">
            <GripHorizontal className="w-5 h-5 text-neutral-400" />
          </div>

          <div className="justify-self-end flex items-center">
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
              title="Close calculator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desmos Mounting Container */}
        <div ref={containerRef} className="flex-1 w-full h-full relative overflow-hidden rounded-b-[7px]" />

        {/* Bottom-Right Resize Handle */}
        <div
          onMouseDown={handleMouseDownResize}
          className="absolute -bottom-2 -right-2 w-7 h-7 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-full shadow-md cursor-nwse-resize flex items-center justify-center text-neutral-800 hover:text-black dark:text-neutral-200 dark:hover:text-white z-30 transition-transform active:scale-95"
          title="Resize calculator"
        >
          <MoveDiagonal className="w-4 h-4 rotate-90" />
        </div>
      </div>
    </>
  );
};