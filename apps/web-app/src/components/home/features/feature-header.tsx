"use client";

import { motion } from "motion/react";

export function FeatureHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="max-w-5xl mx-auto text-center space-y-3 mb-12"
    >
      <p
        className="text-eyebrow"
        style={{ color: "var(--color-text-muted)" }}
      >
        FEATURES
      </p>
      <h2 className="text-h1 text-heading">Auth that just works.</h2>
      <p
        className="text-body-lg max-w-xl mx-auto"
        style={{ color: "var(--color-text-body)" }}
      >
        OAuth 2.0, OIDC, and SSO — fully standards-compliant out of the box,
        with nothing to configure and no vendor lock-in.
      </p>
    </motion.div>
  );
}
