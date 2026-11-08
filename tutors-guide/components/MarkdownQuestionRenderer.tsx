// components/MarkdownQuestionRenderer.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { resolveTestAssetUrl } from "@/lib/contentPaths";

interface MarkdownQuestionRendererProps {
  content: string;
  category?: string;
  testId?: string;
  manifestBasePath?: string;
  enableLightbox?: boolean;
  disableFigureViewer?: boolean;
  className?: string;
  activeQuestionNumber?: number;
}

interface LightboxState {
  isOpen: boolean;
  src: string;
  alt: string;
  isSvg: boolean;
}

/**
 * College Board (SAT & AP) Authentic Diagram Viewer
 * - Completely stable box dimensions (never grows/shrinks on zoom)
 * - True zoom with zero clipping on left/top
 * - Click-and-drag panning synchronized with native scrollbars
 */
const CollegeBoardFigureViewer: React.FC<{
  src: string;
  alt: string;
  onExpand?: () => void;
}> = React.memo(({ src, alt, onExpand }) => {
  const [zoom, setZoom] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Drag-to-pan state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const scrollTopRef = useRef(0);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Base fixed display frame (120% / 1.2x scale)
  const VIEWPORT_WIDTH = 432;
  const VIEWPORT_HEIGHT = 432;

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 2.5));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.5));
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const isZoomed = zoom > 1;

  // Click & Drag Pan Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !scrollContainerRef.current) return;
    isDraggingRef.current = true;
    setIsGrabbing(true);
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    startYRef.current = e.pageY - scrollContainerRef.current.offsetTop;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    scrollTopRef.current = scrollContainerRef.current.scrollTop;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - (x - startXRef.current);
    scrollContainerRef.current.scrollTop = scrollTopRef.current - (y - startYRef.current);
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    setIsGrabbing(false);
  };

  return (
    <div
      style={{ width: `${VIEWPORT_WIDTH}px` }}
      className="border border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-xs select-none"
    >
      {/* College Board Header Toolbar */}
      <div className="h-8 bg-neutral-100 dark:bg-neutral-800/90 border-b border-neutral-200 dark:border-neutral-700/80 px-2.5 flex items-center justify-end gap-2.5 text-xs font-sans text-neutral-800 dark:text-neutral-200">
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoom >= 2.5}
          title="Zoom In"
          aria-label="Zoom In"
          className="p-1 hover:text-[#2050c8] dark:hover:text-blue-400 disabled:opacity-30 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5 stroke-[2]" />
        </button>

        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          title="Zoom Out"
          aria-label="Zoom Out"
          className="p-1 hover:text-[#2050c8] dark:hover:text-blue-400 disabled:opacity-30 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5 stroke-[2]" />
        </button>

        <span className="font-semibold text-xs text-neutral-700 dark:text-neutral-300 min-w-[36px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={handleReset}
          className="font-medium hover:text-[#2050c8] dark:hover:text-blue-400 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer text-xs"
        >
          Reset
        </button>

        <div className="w-px h-3 bg-neutral-300 dark:bg-neutral-600 mx-0.5" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExpand?.();
          }}
          title="Expand Figure"
          aria-label="Expand Figure"
          className="p-1 hover:text-[#2050c8] dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      </div>

      {/* Viewport: Strictly locked to VIEWPORT_WIDTH x VIEWPORT_HEIGHT */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{
          width: `${VIEWPORT_WIDTH}px`,
          height: `${VIEWPORT_HEIGHT}px`,
        }}
        className={`relative bg-white dark:bg-neutral-900 ${
          isZoomed
            ? `overflow-auto ${isGrabbing ? "cursor-grabbing" : "cursor-grab"}`
            : "overflow-hidden cursor-default"
        }`}
      >
        <div
          style={{
            width: `${VIEWPORT_WIDTH * zoom}px`,
            height: `${VIEWPORT_HEIGHT * zoom}px`,
            transition: isGrabbing ? "none" : "width 0.12s ease-out, height 0.12s ease-out",
          }}
          className="relative shrink-0 flex items-center justify-center p-2"
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            style={{
              width: `${(VIEWPORT_WIDTH - 16) * zoom}px`,
              height: `${(VIEWPORT_HEIGHT - 16) * zoom}px`,
              transition: isGrabbing ? "none" : "width 0.12s ease-out, height 0.12s ease-out",
            }}
            className="block object-contain select-none pointer-events-none dark:invert dark:contrast-200 dark:brightness-90 transition-[filter] duration-200"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
});

CollegeBoardFigureViewer.displayName = "CollegeBoardFigureViewer";

export const MarkdownQuestionRenderer: React.FC<MarkdownQuestionRendererProps> = ({
  content,
  category,
  testId,
  manifestBasePath,
  enableLightbox = false,
  disableFigureViewer = false,
  className = "",
  activeQuestionNumber,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Preprocess placement badges, invisible anchors, underline targets, and highlights
  const processedContent = useMemo(() => {
    if (!content) return "";

    const mathTokens: string[] = [];

    let text = content.replace(/(\$\$[\s\S]*?\$\$|\$(?!\$)[^$\n]+?\$)/g, (match) => {
      mathTokens.push(match);
      return `XKMATHBLOCKTOKEN${mathTokens.length - 1}ENDX`;
    });

    text = text.replace(
      /\[\[\[([A-D])\]:(\d+)\]\]/g,
      '<span data-act-placement="$1" data-act-target="$2">[$1]</span>'
    );

    text = text.replace(
      /\[\[#(\d+)\]\]/g,
      '<span data-act-target="$1" data-act-anchor="true" class="inline-block w-0 h-0 overflow-hidden pointer-events-none"></span>'
    );

    text = text.replace(
      /\[\[u:(\d+)\]\]([\s\S]*?)\[\[\/u\]\]/g,
      '<span data-act-target="$1">$2</span>'
    );

    text = text.replace(
      /\[\[u\]\]([\s\S]*?)\[\[\/u\]\]/g,
      '<span data-act-underline="true">$1</span>'
    );

    text = text.replace(
      /\[\[hl\]\]([\s\S]*?)\[\[\/hl\]\]/g,
      '<span data-act-highlight="true">$1</span>'
    );

    text = text.replace(/XKMATHBLOCKTOKEN(\d+)ENDX/g, (_, index) => {
      return mathTokens[Number(index)] ?? "";
    });

    return text;
  }, [content]);

  // 2. Smoothly scroll target into view or reset to top for placement questions
  useEffect(() => {
    if (!activeQuestionNumber || !containerRef.current) return;

    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

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

  const closeLightbox = useCallback(() => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
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

  // Normalized exam category check
  const normalizedCategory = category?.trim().toUpperCase();
  const isCollegeBoard =
    normalizedCategory === "SAT" ||
    normalizedCategory?.startsWith("AP") ||
    normalizedCategory === "AP_CALC";

  // Memoize markdown components to avoid unmounting child elements on state changes
  const markdownComponents = useMemo(
    () => ({
      span: ({ node, children, ...props }: any) => {
        const targetNum = props["data-act-target"]
          ? Number(props["data-act-target"])
          : undefined;
        const placementLetter = props["data-act-placement"];
        const isAnchor = props["data-act-anchor"] === "true";
        const isPlainUnderline = props["data-act-underline"] === "true";
        const isHighlight = props["data-act-highlight"] === "true";

        if (placementLetter) {
          const isActive = activeQuestionNumber === targetNum;
          return (
            <span
              data-act-placement={placementLetter}
              data-act-target={targetNum}
              data-act-active={isActive ? "true" : undefined}
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

        if (isAnchor) {
          return (
            <span
              data-act-target={targetNum}
              aria-hidden="true"
              className="inline-block w-0 h-0 -m-px overflow-hidden select-none pointer-events-none"
            />
          );
        }

        if (isHighlight) {
          return (
            <span
              data-act-highlight="true"
              className="transition-colors duration-150 rounded-[2px] px-0.5"
              {...props}
            >
              {children}
            </span>
          );
        }

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

        if (targetNum !== undefined) {
          const isActive = activeQuestionNumber === targetNum;
          return (
            <span
              data-act-target={targetNum}
              data-act-active={isActive ? "true" : undefined}
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

      u: ({ children, ...props }: any) => (
        <span className="underline underline-offset-4 decoration-1" {...props}>
          {children}
        </span>
      ),

      // 1. Passage Block Indentation ("The following text is adapted from...")
      blockquote: ({ children }: any) => {
        if (isCollegeBoard) {
          return (
            <blockquote className="pl-6 sm:pl-8 my-3 border-none not-italic font-normal font-serif text-neutral-900 dark:text-neutral-100">
              {children}
            </blockquote>
          );
        }
        return (
          <blockquote className="pl-4 my-3 border-l-2 border-neutral-300 dark:border-neutral-700 italic">
            {children}
          </blockquote>
        );
      },

      p: ({ children }: any) => {
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

      h1: ({ children }: any) => (
        <h1 className="text-base font-bold tracking-tight mb-3 text-neutral-900 dark:text-neutral-100">
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-sm font-bold tracking-tight mb-2 text-neutral-900 dark:text-neutral-100">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-sm font-medium mb-2">{children}</h3>
      ),
      ul: ({ children }: any) => (
        <ul className="list-none my-3 pl-6 sm:pl-8 space-y-2 not-prose">{children}</ul>
      ),

      // 2. Adaptive Bullets that match body text color across light/dark mode
      li: ({ children }: any) => {
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
          <li className="flex items-start text-base leading-relaxed text-neutral-900 dark:text-neutral-100">
            <span className="w-6 shrink-0 text-left pr-2 text-neutral-900 dark:text-neutral-100 select-none text-base">
              •
            </span>
            <div className="flex-1 min-w-0">{children}</div>
          </li>
        );
      },

      ol: ({ children }: any) => (
        <ol className="list-decimal pl-6 space-y-1 my-3">{children}</ol>
      ),
      strong: ({ children }: any) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),

      // 3. College Board Authentic Simple Grid Tables vs Generic Fallback
      table: ({ children }: any) => {
        if (isCollegeBoard) {
          return (
            <div className="my-5 w-full flex justify-center overflow-x-auto not-prose">
              <table className="border-collapse border border-neutral-700 dark:border-neutral-300 text-[14.5px] font-serif text-neutral-900 dark:text-neutral-100 mx-auto">
                {children}
              </table>
            </div>
          );
        }
        return (
          <div className="my-6 w-full flex justify-center overflow-x-auto not-prose">
            <table className="border-collapse text-[14px] font-sans text-neutral-900 dark:text-neutral-100 min-w-[260px] max-w-full">
              {children}
            </table>
          </div>
        );
      },

      thead: ({ children }: any) => {
        if (isCollegeBoard) {
          return <thead className="border-b border-neutral-700 dark:border-neutral-300">{children}</thead>;
        }
        return <thead className="border-b-2 border-neutral-800 dark:border-neutral-200">{children}</thead>;
      },

      tbody: ({ children }: any) => {
        if (isCollegeBoard) {
          return <tbody>{children}</tbody>;
        }
        return (
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 border-b-2 border-neutral-800 dark:border-neutral-200">
            {children}
          </tbody>
        );
      },

      tr: ({ children }: any) => {
        if (isCollegeBoard) {
          return <tr className="border-b border-neutral-700 dark:border-neutral-300 last:border-b-0">{children}</tr>;
        }
        return (
          <tr className="transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
            {children}
          </tr>
        );
      },

      th: ({ children, style }: any) => {
        if (isCollegeBoard) {
          return (
            <th
              style={style}
              className="border-r border-neutral-700 dark:border-neutral-300 last:border-r-0 px-3.5 py-2 font-normal text-center align-middle whitespace-normal leading-snug"
            >
              {children}
            </th>
          );
        }
        return (
          <th
            style={style}
            className="px-4 py-2 font-semibold text-neutral-950 dark:text-neutral-50 text-center align-middle whitespace-nowrap"
          >
            {children}
          </th>
        );
      },

      td: ({ children, style }: any) => {
        if (isCollegeBoard) {
          return (
            <td
              style={style}
              className="border-r border-neutral-700 dark:border-neutral-300 last:border-r-0 px-3.5 py-2.5 text-center align-middle whitespace-nowrap"
            >
              {children}
            </td>
          );
        }
        return (
          <td
            style={style}
            className="px-4 py-2.5 text-center align-middle text-neutral-800 dark:text-neutral-200 whitespace-nowrap"
          >
            {children}
          </td>
        );
      },

      img: ({ src, alt = "" }: any) => {
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

        // 1. If inside an answer choice, render strictly as an inline image (no viewer/toolbar/lightbox)
        if (disableFigureViewer) {
          return (
            <img
              src={resolvedSrc}
              alt={alt || "Option diagram"}
              className="max-h-56 max-w-full w-auto h-auto object-contain select-none pointer-events-none dark:invert dark:contrast-200 dark:brightness-90 transition-[filter] duration-200 my-1 mx-auto block"
              loading="eager"
            />
          );
        }

        // 2. Authentic College Board (SAT/AP) SVG Box for Stimulus / Prompt
        if (isCollegeBoard && isSvg) {
          return (
            <figure className="my-4 flex flex-col items-center w-full">
              <CollegeBoardFigureViewer
                src={resolvedSrc}
                alt={alt || "Question diagram"}
                onExpand={() =>
                  setLightbox({
                    isOpen: true,
                    src: resolvedSrc,
                    alt: alt || "Question diagram",
                    isSvg: true,
                  })
                }
              />
              {alt && (
                <figcaption className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 text-center tracking-tight font-mono">
                  {alt}
                </figcaption>
              )}
            </figure>
          );
        }

        // 3. Generic fallback for ACT, GRE, or PNG/JPEG in prompt/stimulus
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
    }),
    [
      activeQuestionNumber,
      category,
      testId,
      manifestBasePath,
      isCollegeBoard,
      enableLightbox,
      disableFigureViewer,
    ]
  );

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
          components={markdownComponents}
        >
          {processedContent}
        </ReactMarkdown>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {lightbox.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-150 cursor-pointer select-none"
          onClick={closeLightbox}
        >
          <div
            className="w-[min(900px,85vw,80vh)] aspect-square rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 sm:p-5 shadow-2xl flex items-center justify-center cursor-default shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.isSvg ? (
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="w-full h-full object-contain select-none pointer-events-none dark:invert dark:contrast-200 dark:brightness-90 transition-[filter] duration-200"
                loading="eager"
              />
            ) : (
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="w-full h-full object-contain select-none rounded-[2px] pointer-events-none"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};