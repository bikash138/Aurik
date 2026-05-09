"use client";

import { motion, AnimatePresence } from "motion/react";
import { Play, Pause } from "lucide-react";
import { steps } from "./usage-data";

interface UsageDisplayProps {
  current: number;
  paused: boolean;
  onPause: () => void;
  onStepClick: (index: number) => void;
}

export function UsageDisplay({ 
  current, 
  paused, 
  onPause, 
  onStepClick 
}: UsageDisplayProps) {
  const { Panel, description, title, icon: Icon, number } = steps[current];

  return (
    <div className="grid md:grid-cols-2">
      {/* LEFT: Text */}
      <div
        className="p-8 border-r flex flex-col justify-center gap-5"
        style={{ borderColor: "var(--color-border)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-mono text-(--color-text-muted) mb-1">
                Step {number}
              </p>
              <h3 className="text-h2 font-bold text-heading">{title}</h3>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed">
              {description}
            </p>

            {/* Dot nav + play/pause */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onPause}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer shrink-0"
              >
                {paused ? (
                  <Play className="w-3.5 h-3.5 text-primary ml-0.5" />
                ) : (
                  <Pause className="w-3.5 h-3.5 text-primary" />
                )}
              </button>
              <div className="flex items-center gap-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onStepClick(i)}
                    className={`rounded-full transition-all cursor-pointer ${i === current ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-border hover:bg-muted-foreground"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RIGHT: Mockup */}
      <div className="p-8 bg-secondary/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <Panel active={true} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
