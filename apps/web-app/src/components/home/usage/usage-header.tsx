"use client";

import { motion } from "motion/react";

export function UsageHeader() {
  return (
    <motion.div
      className="text-center space-y-3 mb-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <p className="text-xs font-mono tracking-widest text-(--color-text-muted) uppercase">
        How to use
      </p>
      <h2 className="text-h1 text-heading font-bold">
        From zero to Sign in with Aurik
      </h2>
      <p
        className="text-body-lg max-w-xl mx-auto"
        style={{ color: "var(--color-text-body)" }}
      >
        Four steps. Under ten minutes. No auth expertise required.
      </p>
    </motion.div>
  );
}
