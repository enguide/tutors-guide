// lib/telemetry/examLogger.ts
"use client";

export type ExamTelemetryCategory =
  | "navigation"
  | "interaction"
  | "autosave"
  | "network"
  | "tool"
  | "error";

export interface ExamBreadcrumb {
  category: ExamTelemetryCategory;
  message: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

class ExamLogger {
  private breadcrumbs: ExamBreadcrumb[] = [];
  private readonly maxBreadcrumbs = 60;

  public log(
    category: ExamTelemetryCategory,
    message: string,
    data?: Record<string, unknown>
  ): void {
    const entry: ExamBreadcrumb = {
      category,
      message,
      data,
      timestamp: Date.now(),
    };

    this.breadcrumbs.push(entry);
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }

    if (process.env.NODE_ENV === "development") {
      const time = new Date(entry.timestamp).toLocaleTimeString();
      // eslint-disable-next-line no-console
      console.debug(`[ExamTelemetry][${time}][${category.toUpperCase()}] ${message}`, data ?? "");
    }

    // Optional: If Sentry is installed on window
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = typeof window !== "undefined" ? (window as any) : null;
    if (win?.Sentry?.addBreadcrumb) {
      win.Sentry.addBreadcrumb({
        category: `exam.${category}`,
        message,
        data,
        level: category === "error" ? "error" : "info",
      });
    }
  }

  public captureException(error: unknown, context?: Record<string, unknown>): void {
    console.error("[ExamTelemetry ERROR]", error, {
      context,
      recentBreadcrumbs: this.breadcrumbs.slice(-10),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = typeof window !== "undefined" ? (window as any) : null;
    if (win?.Sentry?.captureException) {
      win.Sentry.captureException(error, {
        extra: {
          ...context,
          recentBreadcrumbs: this.breadcrumbs,
        },
      });
    }
  }

  public getRecentBreadcrumbs(): ExamBreadcrumb[] {
    return [...this.breadcrumbs];
  }
}

export const examLogger = new ExamLogger();