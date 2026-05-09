"use client";

import { motion } from "motion/react";
import { UsageHeader } from "./usage-header";
import { UsageTabs } from "./usage-tabs";
import { UsageDisplay } from "./usage-display";
import { useUsageTimer } from "./hooks/use-usage-timer";

export function Usage() {
  const { 
    current, 
    progress, 
    paused, 
    handlePause, 
    handleStepClick 
  } = useUsageTimer();

  return (
    <section className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <UsageHeader />

        {/* DEMO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          <UsageTabs 
            current={current} 
            progress={progress} 
            onStepClick={handleStepClick} 
          />
          
          <UsageDisplay 
            current={current} 
            paused={paused} 
            onPause={handlePause}
            onStepClick={handleStepClick}
          />
        </motion.div>
      </div>
    </section>
  );
}
