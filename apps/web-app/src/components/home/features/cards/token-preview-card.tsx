"use client";

import { motion } from "motion/react";

export function TokenPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="card flex-1"
    >
      <p
        className="text-eyebrow mb-3"
        style={{ color: "var(--color-text-muted)" }}
      >
        02 · TOKENS
      </p>
      <h3 className="text-h3 text-heading mb-2">Identity, decoded.</h3>
      <p
        className="mb-4"
        style={{
          color: "var(--color-text-body)",
          fontSize: "15px",
          lineHeight: "1.65",
        }}
      >
        Standard-compliant JWTs that provide your application with verified user
        identity and claims.
      </p>

      <div className="space-y-2">
        <div
          className="px-3 py-2 rounded-lg font-mono truncate"
          style={{
            background: "var(--color-page-bg)",
            border: "0.5px solid var(--color-border)",
            color: "var(--color-text-muted)",
            fontSize: "13px",
          }}
        >
          eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
        </div>
        <div
          className="flex items-center gap-2"
          style={{ color: "var(--color-text-muted)", fontSize: "13px" }}
        >
          <div
            className="flex-1 h-px"
            style={{ background: "var(--color-border)" }}
          />
          <span>decoded</span>
          <div
            className="flex-1 h-px"
            style={{ background: "var(--color-border)" }}
          />
        </div>
        <div
          className="px-3 py-2 rounded-lg font-mono"
          style={{
            background: "var(--color-page-bg)",
            border: "0.5px solid var(--color-border)",
            fontSize: "13px",
          }}
        >
          <span style={{ color: "var(--color-lime-dark)" }}>sub</span>
          <span style={{ color: "var(--color-text-body)" }}>
            {': "usr_8f3k2j9x", '}
          </span>
          <span style={{ color: "var(--color-lime-dark)" }}>email</span>
          <span style={{ color: "var(--color-text-body)" }}>
            {': "alex@acme.com"'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
