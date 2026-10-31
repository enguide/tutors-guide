// lib/telemetry/timeTracking.ts
import { NavigationHistoryEntry } from "@/hooks/useTestProgress";

export function calculateTimeSpentFromNavHistory(
  navigationHistory: NavigationHistoryEntry[],
  currentElapsedSeconds: number,
  totalQuestions: number
): number[] {
  const timeSpentPerQuestion = new Array(totalQuestions).fill(0);
  if (!navigationHistory || navigationHistory.length === 0) return timeSpentPerQuestion;

  for (let i = 0; i < navigationHistory.length; i++) {
    const current = navigationHistory[i];
    const nextTime = i + 1 < navigationHistory.length 
      ? navigationHistory[i + 1].time 
      : currentElapsedSeconds;

    const dwell = Math.max(0, nextTime - current.time);
    if (current.qIdx >= 0 && current.qIdx < totalQuestions) {
      timeSpentPerQuestion[current.qIdx] += dwell;
    }
  }

  return timeSpentPerQuestion;
}