/* eslint-disable @typescript-eslint/no-explicit-any */
// components/MarkdownQuestionRenderer.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Image from "next/image";
import { Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { resolveTestAssetUrl } from "@/lib/contentPaths";

interface MarkdownQuestionRendererProps {
  content: string;
  category?: string;
  testId?: string;
  manifestBasePath?: string;
  enableLightbox?: boolean;
  className?: string;
}

interface LightboxState {
  isOpen: boolean;
  src: string;
  alt: string;
  isSvg: boolean;
}

export const MarkdownQuestionRenderer: React.FC<MarkdownQuestionRendererProps> = ({
  content,
  category,
  testId,
  manifestBasePath,
  enableLightbox = false,
  className = "",
}) => {
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    src: "",
    alt: "",
    isSvg: false,
  });
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const closeLightbox = useCallback(() => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
    setZoomLevel(1);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightbox.isOpen) {
        closeLightbox();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.isOpen, closeLightbox]);

  return (
    <>
      <div
        className={`prose prose-slate dark:prose-invert max-w-none text-base leading-relaxed ${className}`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            // Prevents <p><figure>...</figure></p> invalid HTML hydration mismatches
            p: ({ children }) => {
              const childrenArray = React.Children.toArray(children);
              const hasBlockElement = childrenArray.some((child) => {
                if (React.isValidElement(child)) {
                  return (
                    child.type === "figure" ||
                    (child.props as any)?.node?.tagName === "img" ||
                    (child.props as any)?.src !== undefined
                  );
                }
                return false;
              });

              if (hasBlockElement) {
                return <div className="my-3 last:mb-0">{children}</div>;
              }

              return <p className="mb-3 last:mb-0">{children}</p>;
            },
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold tracking-tight mb-4">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold tracking-tight mb-3">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium mb-2">{children}</h3>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 space-y-1 mb-3">{children}</ol>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">{children}</strong>
            ),
            img: ({ src, alt = "" }) => {
              if (typeof src !== "string" || !src.trim()) {
                return null;
              }

              // 1. Resolve canonical path if context is provided
              let resolvedSrc =
                category && testId
                  ? resolveTestAssetUrl(category, testId, src, manifestBasePath)
                  : src;

              // 2. Fallback normalization: ensure leading slash for next/image
              if (
                !resolvedSrc.startsWith("http://") &&
                !resolvedSrc.startsWith("https://") &&
                !resolvedSrc.startsWith("/")
              ) {
                resolvedSrc = "/" + resolvedSrc.replace(/^(\.\/|\/)?/, "");
              }

              const isSvg = resolvedSrc.toLowerCase().endsWith(".svg");

              return (
                <figure className="my-5 flex flex-col items-center w-full group">
                  <div className="relative border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-[4px] p-4 shadow-sm transition-all duration-200 group-hover:border-neutral-300 dark:group-hover:border-neutral-700 w-full max-w-xl flex items-center justify-center">
                    {isSvg ? (
                      // SVG: w-full and max-w prevent 0px intrinsic collapse while remaining scalable
                      <img
                        src={resolvedSrc}
                        alt={alt}
                        className="w-full max-w-[520px] max-h-[380px] h-auto object-contain mx-auto select-none dark:invert dark:contrast-200 dark:brightness-90 transition-[filter] duration-200"
                        loading="eager"
                      />
                    ) : (
                      // Raster: priority={true} resolves the above-the-fold LCP diagnostic warning
                      <Image
                        src={resolvedSrc}
                        alt={alt}
                        width={700}
                        height={450}
                        priority={true}
                        className="max-h-[380px] w-auto h-auto object-contain mx-auto select-none rounded-[2px]"
                      />
                    )}

                    {enableLightbox && (
                      <button
                        type="button"
                        onClick={() =>
                          setLightbox({
                            isOpen: true,
                            src: resolvedSrc,
                            alt: alt || "Test Stimulus Figure",
                            isSvg,
                          })
                        }
                        aria-label="Expand image"
                        className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-neutral-800/90 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-sm"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                      </button>
                    )}
                  </div>

                  {alt && (
                    <figcaption className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center tracking-tight font-mono">
                      {alt}
                    </figcaption>
                  )}
                </figure>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Lightbox Modal */}
      {enableLightbox && lightbox.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div
            className="flex items-center gap-2 mb-3 bg-neutral-900/90 border border-neutral-800 rounded-[4px] px-3 py-1.5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
              className="p-1 text-neutral-300 hover:text-white transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-neutral-400 min-w-[45px] text-center select-none">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
              className="p-1 text-neutral-300 hover:text-white transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-neutral-700 mx-1" />
            <button
              type="button"
              onClick={closeLightbox}
              className="p-1 text-neutral-300 hover:text-white transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            className="max-w-[90vw] max-h-[80vh] overflow-auto rounded-[4px] border border-neutral-800 bg-neutral-950 p-4 flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.15s ease-out",
              }}
              className="origin-center"
            >
              {lightbox.isSvg ? (
                <img
                  src={lightbox.src}
                  alt={lightbox.alt}
                  className="max-h-[75vh] w-auto object-contain dark:invert dark:contrast-200 select-none"
                />
              ) : (
                <img
                  src={lightbox.src}
                  alt={lightbox.alt}
                  className="max-h-[75vh] w-auto object-contain select-none rounded-[2px]"
                />
              )}
            </div>
          </div>

          {lightbox.alt && (
            <p className="mt-3 text-sm font-mono text-neutral-400 tracking-tight text-center max-w-xl">
              {lightbox.alt}
            </p>
          )}
        </div>
      )}
    </>
  );
};