// lib/adaptive/branchingController.ts
import { TestMetadata } from "@/types/content";

export interface BranchingResult {
  nextSectionId: string | null;
  isIntermission: boolean;
  intermissionDuration: number;
  isTestComplete: boolean;
  tierSelected?: "hard" | "easy";
}

export function evaluateNextExamRoute(
  metadata: TestMetadata,
  currentSectionId: string,
  currentSectionRawScore: number,
  submittedSectionIds: string[]
): BranchingResult {
  const currentSection = metadata.sections.find((s) => s.id === currentSectionId);
  const isIntermission = Boolean(currentSection?.hasIntermissionAfter);
  const intermissionDuration = currentSection?.intermissionDuration ?? 600;

  // -------------------------------------------------------------
  // 1. Adaptive Multistage (CAT) Evaluation
  // -------------------------------------------------------------
  if (metadata.isAdaptive && metadata.stages && metadata.stages.length > 0) {
    // Check if the section just completed is an adaptive baseline stage
    const currentStageIndex = metadata.stages.findIndex((st) => st.sectionId === currentSectionId);

    if (currentStageIndex !== -1) {
      // Completed Module 1 of a stage -> Route to Module 2 (Hard or Easy)
      const stage = metadata.stages[currentStageIndex];
      const passed = currentSectionRawScore >= stage.routing.threshold;
      const targetSectionId = passed ? stage.routing.onPass : stage.routing.onFail;
      const tierSelected = passed ? "hard" : "easy";

      return {
        nextSectionId: targetSectionId,
        isIntermission,
        intermissionDuration,
        isTestComplete: false,
        tierSelected,
      };
    }

    // Check if the section just completed was a Module 2 (branch target)
    // Find which stage this branched section belongs to
    const parentStage = metadata.stages.find(
      (st) => st.routing.onPass === currentSectionId || st.routing.onFail === currentSectionId
    );

    if (parentStage) {
      const nextStage = metadata.stages.find(
        (st) => st.stageIndex === parentStage.stageIndex + 1
      );

      if (nextStage) {
        // Move to Module 1 of the NEXT stage (e.g. RW M2 -> Math M1)
        return {
          nextSectionId: nextStage.sectionId,
          isIntermission,
          intermissionDuration,
          isTestComplete: false,
        };
      } else {
        // No more stages! Full CAT exam is complete
        return {
          nextSectionId: null,
          isIntermission: false,
          intermissionDuration: 0,
          isTestComplete: true,
        };
      }
    }
  }

  // -------------------------------------------------------------
  // 2. Standard Linear Sequence Evaluation
  // -------------------------------------------------------------
  const currentIndex = metadata.sections.findIndex((s) => s.id === currentSectionId);
  const nextSection = metadata.sections[currentIndex + 1];

  if (!nextSection) {
    return {
      nextSectionId: null,
      isIntermission: false,
      intermissionDuration: 0,
      isTestComplete: true,
    };
  }

  const updatedSubmitted = new Set([...submittedSectionIds, currentSectionId]);
  const isLinearComplete = updatedSubmitted.size >= metadata.sections.length;

  return {
    nextSectionId: isLinearComplete ? null : nextSection.id,
    isIntermission,
    intermissionDuration,
    isTestComplete: isLinearComplete,
  };
}