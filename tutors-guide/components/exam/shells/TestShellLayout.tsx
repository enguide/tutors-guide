// components/exam/shells/TestShellLayout.tsx
"use client";

import React from "react";
import { TestShellLayoutProps } from "@/types/examLayout";
import { SupportedExamCategory } from "@/types/examConfig";
import { BaseLayoutAdapter } from "./BaseLayoutAdapter";
import { SATLayoutAdapter } from "./sat/SATLayoutAdapter";
import { ACTLayoutAdapter } from "./act/ACTLayoutAdapter";
import { GRELayoutAdapter } from "./gre/GRELayoutAdapter";
import { APLayoutAdapter } from "./ap/APLayoutAdapter";

const LAYOUT_REGISTRY: Record<
  SupportedExamCategory,
  React.FC<TestShellLayoutProps>
> = {
  SAT: SATLayoutAdapter,      // Digital SAT (Bluebook emulation)
  ACT: ACTLayoutAdapter,      // ACT (TestNav emulation)
  AP_CALC: APLayoutAdapter,   // AP Academic emulation
  GRE: GRELayoutAdapter,      // GRE (ETS PowerPrep emulation)
};

export const TestShellLayout: React.FC<TestShellLayoutProps> = (props) => {
  const SelectedAdapter = LAYOUT_REGISTRY[props.category] || BaseLayoutAdapter;
  return <SelectedAdapter {...props} />;
};