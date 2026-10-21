/* eslint-disable @typescript-eslint/no-explicit-any */
// components/MarkdownQuestionRenderer.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
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
  activeQuestionNumber?: number; // Active item to highlight and auto-scroll to
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
  activeQuestionNumber,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Preprocess placement badges, invisible anchors, and underline targets
  const processedContent = useMemo(() => {
    if (!content) return "";

    let text = content;

    // A. Placement markers: {[A]:15} -> <span data-act-placement="A" data-act-target="15">[A]</span>
    text = text.replace(
      /\{\[([A-D])\]:(\d+)\}/g,
      '<span data-act-placement="$1" data-act-target="$2">[$1]</span>'
    );

    // B. Invisible scroll anchor: {#1}
    text = text.replace(
      /\{#(\d+)\}/g,
      '<span data-act-target="$1" data-act-anchor="true" class="inline-block w-0 h-0 overflow-hidden pointer-events-none"></span>'
    );

    // C. Question underline target {1|text} or plain underline {text} / {|text}
    text = text.replace(
      /\{(?:\s*(\d+)\s*\|)?([^}]+)\}/g,
      (_, num, body) => {
        if (num) {
          return `<span data-act-target="${num}">${body}</span>`;
        }
        return `<span data-act-underline="true">${body}</span>`;
      }
    );

    return text;
  }, [content]);

  // 2. Smoothly scroll target into view or reset to top for placement questions
  useEffect(() => {
    if (!activeQuestionNumber || !containerRef.current) return;

    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      // Check if current active question is a placement question ([A], [B], [C], [D])
      const placementElements = container.querySelectorAll(
        `[data-act-placement][data-act-target="${activeQuestionNumber}"]`
      );

      if (placementElements.length > 0) {
        const scrollableParent = container.closest(".overflow-y-auto") ?? container;
        scrollableParent.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      }

      // Otherwise, scroll target or anchor to the center
      const activeEl = container.querySelector(
        `[data-act-target="${activeQuestionNumber}"]`
      );

      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [activeQuestionNumber, processedContent]);

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
        ref={containerRef}
        className={`prose prose-neutral text-neutral-950 dark:text-neutral-50 dark:prose-invert max-w-none text-base leading-relaxed ${className}`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[
            rehypeRaw,
            [
              rehypeKatex,
              {
                output: "htmlAndMathml",
                strict: false,
                trust: true,
                throwOnError: false,
              },
            ],
          ]}
          components={{
            span: ({ node, children, ...props }: any) => {
              const targetNum = props["data-act-target"]
                ? Number(props["data-act-target"])
                : undefined;
              const placementLetter = props["data-act-placement"];
              const isAnchor = props["data-act-anchor"] === "true";
              const isPlainUnderline = props["data-act-underline"] === "true";

              // Case 1: Placement markers [A], [B], [C], [D]
              if (placementLetter) {
                const isActive = activeQuestionNumber === targetNum;
                return (
                  <span
                    data-act-placement={placementLetter}
                    data-act-target={targetNum}
                    data-act-active={isActive ? "true" : undefined}
                    style={
                      isActive
                        ? {
                            backgroundColor: "var(--act-highlight-bg, #FFF59D)",
                            color: "var(--act-highlight-fg, #000000)",
                          }
                        : undefined
                    }
                    className={`inline-flex items-center justify-center font-bold text-[12px] px-1 py-0.5 mx-1 rounded-[2px] transition-all duration-150 select-none ${
                      isActive
                        ? "ring-1 ring-black/20 shadow-xs"
                        : "text-[var(--act-text-main)] opacity-75 font-semibold"
                    }`}
                    {...props}
                  >
                    [{placementLetter}]
                  </span>
                );
              }

              // Case 2: Invisible scroll anchor {#1}
              if (isAnchor) {
                return (
                  <span
                    data-act-target={targetNum}
                    aria-hidden="true"
                    className="inline-block w-0 h-0 -m-px overflow-hidden select-none pointer-events-none"
                  />
                );
              }

              // Case 3: Plain underline {text} or {|text}
              if (isPlainUnderline) {
                return (
                  <span
                    className="underline underline-offset-4 decoration-1 text-inherit"
                    {...props}
                  >
                    {children}
                  </span>
                );
              }

              // Case 4: Standard Question Underline Target {1|text}
              if (targetNum !== undefined) {
                const isActive = activeQuestionNumber === targetNum;
                return (
                  <span
                    data-act-target={targetNum}
                    data-act-active={isActive ? "true" : undefined}
                    style={
                      isActive
                        ? {
                            backgroundColor: "var(--act-highlight-bg, #FFF59D)",
                            color: "var(--act-highlight-fg, #000000)",
                          }
                        : undefined
                    }
                    className={`underline underline-offset-4 decoration-1 transition-all duration-200 ${
                      isActive ? "font-normal rounded-[1px] px-0.5 shadow-xs" : "text-inherit"
                    }`}
                    {...props}
                  >
                    {children}
                  </span>
                );
              }

              return <span {...props}>{children}</span>;
            },

            // Native <u> support
            u: ({ children, ...props }: any) => (
              <span className="underline underline-offset-4 decoration-1" {...props}>
                {children}
              </span>
            ),

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

              return <p className="mb-4 last:mb-0 leading-[28px]">{children}</p>;
            },

            h1: ({ children }) => (
              <h1 className="text-base font-bold tracking-tight mb-3 text-neutral-900 dark:text-neutral-100">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-sm font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-medium mb-2">{children}</h3>
            ),
            ul: ({ children }) => (
              <ul className="list-none my-3 pl-6 sm:pl-8 space-y-2 not-prose">{children}</ul>
            ),

            li: ({ children }) => {
              const childrenArray = React.Children.toArray(children);
              const firstChild = childrenArray[0];

              if (typeof firstChild === "string") {
                const match = firstChild.match(/^([IVXLCDM]+\.)\s*(.*)/);
                if (match) {
                  const romanLabel = match[1];
                  const remainingFirstChild = match[2];

                  return (
                    <li className="flex items-start text-base leading-relaxed">
                      <span className="w-8 shrink-0 text-right pr-3 font-normal select-none">
                        {romanLabel}
                      </span>
                      <div className="flex-1 min-w-0">
                        {remainingFirstChild}
                        {childrenArray.slice(1)}
                      </div>
                    </li>
                  );
                }
              }

              return (
                <li className="flex items-start text-base leading-relaxed">
                  <span className="w-8 shrink-0 text-right pr-3 text-neutral-400 select-none">•</span>
                  <div className="flex-1 min-w-0">{children}</div>
                </li>
              );
            },

            ol: ({ children }) => (
              <ol className="list-decimal pl-6 space-y-1 my-3">{children}</ol>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">{children}</strong>
            ),
            table: ({ children }) => (
              <div className="my-5 overflow-x-auto">
                <table className="border-collapse border border-border mx-auto text-center font-sans prose prose-neutral text-neutral-950 dark:text-neutral-50 dark:prose-invert">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="border-b border-border">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-border">{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="border-b border-border last:border-b-0">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="border-r border-border last:border-r-0 px-4 py-2 text-sm text-foreground text-center align-middle whitespace-nowrap">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border-r border-border last:border-r-0 px-4 py-2 text-sm text-foreground text-center align-middle whitespace-nowrap">
                {children}
              </td>
            ),
            img: ({ src, alt = "" }) => {
              if (typeof src !== "string" || !src.trim()) {
                return null;
              }

              let resolvedSrc =
                category && testId
                  ? resolveTestAssetUrl(category, testId, src, manifestBasePath)
                  : src;

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
                  <div className="relative border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-[4px] p-4 shadow-xs transition-all duration-200 group-hover:border-neutral-300 dark:group-hover:border-neutral-700 w-full max-w-xl flex items-center justify-center">
                    {isSvg ? (
                      <img
                        src={resolvedSrc}
                        alt={alt}
                        className="w-full max-w-[520px] max-h-[380px] h-auto object-contain mx-auto select-none dark:invert dark:contrast-200 dark:brightness-90 transition-[filter] duration-200"
                        loading="eager"
                      />
                    ) : (
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
                        className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-neutral-800/90 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xs"
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
          {processedContent}
        </ReactMarkdown>
      </div>

      {/* Lightbox Modal */}
      {enableLightbox && lightbox.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-xs p-4 sm:p-8 animate-in fade-in duration-200"
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