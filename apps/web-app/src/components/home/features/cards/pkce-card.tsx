"use client";

import { motion } from "motion/react";

export function PKCECard() {
  const fields = [
    "client_id",
    "redirect_uri",
    "response_type",
    "scope",
    "state",
    "code_challenge",
    "code_challenge_method",
    "code_verifier",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="card flex-1"
    >
      <p
        className="text-eyebrow mb-3"
        style={{ color: "var(--color-text-muted)" }}
      >
        01 · PROTOCOL
      </p>
      <h3 className="text-h3 text-heading mb-2">Standards enforced.</h3>
      <p
        className="mb-4"
        style={{
          color: "var(--color-text-body)",
          fontSize: "15px",
          lineHeight: "1.65",
        }}
      >
        Strict OIDC validation on every request. We handle the complex handshake
        so you don't have to.
      </p>
      <div className="flex flex-wrap gap-2">
        {fields.map((field) => (
          <span key={field} className="badge badge-active">
            {field}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
