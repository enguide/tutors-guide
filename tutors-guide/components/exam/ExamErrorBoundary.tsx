// components/exam/ExamErrorBoundary.tsx
"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { examLogger } from "@/lib/telemetry/examLogger";
import { AlertTriangle, RotateCcw, ShieldCheck } from "lucide-react";

interface Props {
  children: ReactNode;
  testId?: string;
  sectionId?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ExamErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    examLogger.captureException(error, {
      testId: this.props.testId,
      sectionId: this.props.sectionId,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleRecover = () => {
    examLogger.log("interaction", "Student clicked error boundary recovery");
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 select-none">
          <div className="max-w-md w-full bg-card border border-slate-200 dark:border-slate-800 rounded-none p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-none">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Exam Workspace Interrupted</h2>
                <p className="text-xs text-muted-foreground">A temporary display error occurred.</p>
              </div>
            </div>

            <div className="p-3 bg-muted/40 border border-border rounded-none flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Your responses are safe:</strong> All completed
                questions and active timer values remain cached in your browser.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={this.handleRecover}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-none transition-colors"
              >
                <RotateCcw size={14} />
                <span>Resume Test</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}