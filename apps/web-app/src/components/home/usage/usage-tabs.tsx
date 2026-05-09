"use client";

import { motion } from "motion/react";
import { steps } from "./usage-data";

interface UsageTabsProps {
  current: number;
  progress: number;
  onStepClick: (index: number) => void;
}

export function UsageTabs({ current, progress, onStepClick }: UsageTabsProps) {
  return (
    <div
      className="grid grid-cols-4 border-b"
      style={{ borderColor: "var(--color-border)" }}
    >
      {steps.map(({ icon: StepIcon, short, number: num }, i) => (
        <button
          key={i}
          onClick={() => onStepClick(i)}
          className={`relative flex flex-col items-center gap-1.5 py-4 px-2 text-xs font-medium transition-colors cursor-pointer
            ${i === current ? "text-primary bg-secondary/30" : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"}
            ${i < steps.length - 1 ? "border-r" : ""}`}
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${i === current ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            <StepIcon className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:block text-center leading-tight">
            {short}
          </span>
          <span className="text-[10px] text-(--color-text-muted)">
            {num}
          </span>

          {/* Progress bar */}
          {i === current && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary/50">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          {i < current && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/30" />
          )}
        </button>
      ))}
    </div>
  );
}
