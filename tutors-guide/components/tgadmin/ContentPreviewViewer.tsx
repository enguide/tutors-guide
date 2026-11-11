/* eslint-disable @typescript-eslint/no-explicit-any */
// components/tgadmin/ContentPreviewViewer.tsx
"use client";

import { useState, useMemo, useRef } from "react";
import { ParsedSection, QuestionFrontmatter, SectionManifest, TestMetadata } from "@/types/content";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  ChevronsUpDown, 
  Layers, 
  Clock, 
  HelpCircle,
  Filter
} from "lucide-react";
import { QuestionExplanationEngine } from "../analytics/QuestionExplanationEngine";

interface SectionBundle {
  meta: SectionManifest;
  parsed: ParsedSection | null;
}

interface ContentPreviewViewerProps {
  metadata: TestMetadata;
  sections: SectionBundle[];
}

export function ContentPreviewViewer({ metadata, sections }: ContentPreviewViewerProps) {
  const validSections = useMemo(() => sections.filter((s) => s.parsed !== null), [sections]);
  const [activeSectionId, setActiveSectionId] = useState<string>(validSections[0]?.meta.id || "");

  // Metadata attributes for resolving asset paths
  const category = metadata.category;
  const testId = metadata.id;
  const manifestBasePath = (metadata as any).assetBasePath;

  // Scroll ref for the module tabs container
  const modulesScrollRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState<boolean>(true);

  const activeBundle = useMemo(
    () => validSections.find((s) => s.meta.id === activeSectionId) || validSections[0],
    [validSections, activeSectionId]
  );

  const questions: QuestionFrontmatter[] = useMemo(
    () => activeBundle?.parsed?.frontmatter.questions || [],
    [activeBundle]
  );

  const availableDomains = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.domain) set.add(q.domain);
    });
    return Array.from(set);
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchDiff = selectedDifficulty === "ALL" || q.difficulty === selectedDifficulty;
      const matchDomain = selectedDomain === "ALL" || q.domain === selectedDomain;
      return matchDiff && matchDomain;
    });
  }, [questions, selectedDifficulty, selectedDomain]);

  const toggleExplanation = (id: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? !allExpanded : !prev[id],
    }));
  };

  const toggleAllExplanations = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    const updated: Record<string, boolean> = {};
    questions.forEach((q) => {
      updated[q.id] = nextState;
    });
    setExpandedExplanations(updated);
  };

  const scrollToQuestion = (id: string) => {
    const el = document.getElementById(`question-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollModules = (direction: "left" | "right") => {
    if (modulesScrollRef.current) {
      const offset = direction === "left" ? -250 : 250;
      modulesScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Sticky Module Navigation & Tool Bar */}
      <div className="sticky top-20 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm space-y-3">
        {/* Module Selection Bar with Left/Right Scroll Chevrons */}
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => scrollModules("left")}
            aria-label="Scroll modules left"
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 mr-1.5 shrink-0 shadow-xs cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>

          <div
            ref={modulesScrollRef}
            className="flex items-center gap-2 overflow-x-auto py-1 scroll-smooth w-full scrollbar-thin"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1 flex items-center gap-1.5 shrink-0">
              <Layers size={14} /> Modules:
            </span>

            {validSections.map(({ meta, parsed }) => {
              const isSelected = meta.id === activeSectionId;
              const qCount = parsed?.frontmatter.questions.length || 0;
              return (
                <button
                  key={meta.id}
                  onClick={() => {
                    setActiveSectionId(meta.id);
                    setSelectedDomain("ALL");
                    setSelectedDifficulty("ALL");
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <span className="whitespace-nowrap">{meta.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {qCount}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollModules("right")}
            aria-label="Scroll modules right"
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 ml-1.5 shrink-0 shadow-xs cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Question Quick Jump Bar & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-muted-foreground uppercase mr-1 shrink-0">
              Jump:
            </span>
            <div className="flex items-center gap-1 flex-wrap max-h-20 overflow-y-auto pr-1">
              {filteredQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => scrollToQuestion(q.id)}
                  className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-primary-foreground transition-colors shrink-0 cursor-pointer"
                  title={`Jump to Q${q.questionNumber || idx + 1}`}
                >
                  {q.questionNumber || idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
              <Filter size={12} className="text-muted-foreground" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-transparent text-[11px] font-medium outline-hidden cursor-pointer"
              >
                <option value="ALL">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {availableDomains.length > 0 && (
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-[11px] font-medium outline-hidden cursor-pointer"
              >
                <option value="ALL">All Domains</option>
                {availableDomains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={toggleAllExplanations}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <ChevronsUpDown size={12} />
              <span>{allExpanded ? "Collapse Explanations" : "Expand Explanations"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Section Info Banner */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            {activeBundle?.parsed?.frontmatter.sectionTitle || activeBundle?.meta.title}
          </h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1">
              <HelpCircle size={13} /> {filteredQuestions.length} of {questions.length} Questions Displayed
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> Base Time: {activeBundle?.meta.timeLimit ? `${Math.round(activeBundle.meta.timeLimit / 60)} min` : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center border border-dashed rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-500">
            No questions match the selected filter criteria.
          </div>
        ) : (
          filteredQuestions.map((q, qIdx) => {
            const stimulus = q.stimulus || q.passage;
            const isExplanationOpen =
              expandedExplanations[q.id] !== undefined
                ? expandedExplanations[q.id]
                : allExpanded;

            return (
              <div
                key={q.id || `q_${qIdx}`}
                id={`question-card-${q.id}`}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-xs overflow-hidden scroll-mt-36"
              >
                {/* Item Metadata Banner */}
                <div className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-slate-900 dark:text-slate-100 text-sm">
                      Q{q.questionNumber || qIdx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-sm bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold text-[10px]">
                      {q.questionType}
                    </span>
                    {q.difficulty && (
                      <span
                        className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                          q.difficulty === "Hard"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                            : q.difficulty === "Medium"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground font-mono text-[11px] flex items-center gap-2">
                    {q.domain && <span>Domain: <strong className="text-foreground">{q.domain}</strong></span>}
                    {q.skill && <span>• Skill: <strong className="text-foreground">{q.skill}</strong></span>}
                    <span className="text-slate-400">({q.id})</span>
                  </div>
                </div>

                {/* Question Work Area */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {stimulus && (
                    <div className="lg:col-span-6 bg-slate-50/70 dark:bg-slate-800/30 p-4 rounded-lg border border-slate-200/70 dark:border-slate-800 text-sm leading-relaxed max-h-96 overflow-y-auto">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        Stimulus / Context
                      </div>
                      <MarkdownQuestionRenderer
                        content={stimulus}
                        category={category}
                        testId={testId}
                        manifestBasePath={manifestBasePath}
                        enableLightbox={true}
                      />
                    </div>
                  )}

                  <div className={stimulus ? "lg:col-span-6 space-y-4" : "lg:col-span-12 space-y-4"}>
                    <div className="text-slate-900 dark:text-slate-100 font-medium text-base">
                      <MarkdownQuestionRenderer
                        content={q.prompt}
                        category={category}
                        testId={testId}
                        manifestBasePath={manifestBasePath}
                        enableLightbox={true}
                      />
                    </div>

                    {q.options && q.options.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {q.options.map((opt) => {
                          const isCorrect = String(opt.id).trim() === String(q.correctAnswer).trim();
                          return (
                            <div
                              key={opt.id}
                              className={`p-3 rounded-lg border text-sm flex items-start gap-3 transition-colors ${
                                isCorrect
                                  ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200 font-medium"
                                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                                  isCorrect
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
                                }`}
                              >
                                {opt.id}
                              </span>
                              <div className="flex-1 pt-0.5">
                                <MarkdownQuestionRenderer
                                  content={opt.text}
                                  category={category}
                                  testId={testId}
                                  manifestBasePath={manifestBasePath}
                                  disableFigureViewer={true}
                                />
                              </div>
                              {isCorrect && (
                                <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                                  <CheckCircle2 size={11} /> Correct
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {(!q.options || q.options.length === 0) && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-3 rounded-lg text-sm text-emerald-900 dark:text-emerald-200">
                        <span className="font-semibold">Correct Answer Value:</span>{" "}
                        <span className="font-mono font-bold bg-white dark:bg-slate-900 px-2.5 py-0.5 border border-emerald-300 dark:border-emerald-700 rounded text-emerald-700 dark:text-emerald-300">
                          {String(q.correctAnswer)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Collapsible Explanations Bar */}
                <div className="border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => toggleExplanation(q.id)}
                    className="w-full px-6 py-2.5 bg-amber-50/40 dark:bg-amber-950/10 hover:bg-amber-50 dark:hover:bg-amber-950/20 flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300 transition-colors cursor-pointer"
                  >
                    <span className="uppercase tracking-wider flex items-center gap-1.5">
                      <span>Curriculum Rationale & Explanation</span>
                    </span>
                    {isExplanationOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {isExplanationOpen && (
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800">
                      {q.explanation ? (
                        <QuestionExplanationEngine
                          explanation={q.explanation}
                          category={category}
                          testId={testId}
                          domain={q.domain}
                          skill={q.skill}
                          questionNumber={q.questionNumber || qIdx + 1}
                        />
                      ) : (
                        <span className="italic text-slate-500 text-xs">
                          No explanation provided in frontmatter.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}