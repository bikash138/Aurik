"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function MainFeatureCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="card-green relative overflow-hidden flex flex-col gap-5"
      style={{ minHeight: "460px" }}
    >
      {/* Decorative concentric circles */}
      {[80, 140, 200, 260, 320].map((r, i) => (
        <div
          key={i}
          className="absolute pointer-events-none rounded-full"
          style={{
            width: r * 2,
            height: r * 2,
            top: -r,
            right: -r,
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col gap-5 flex-1">
        {/* Badge */}
        <span
          className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full text-badge"
          style={{
            border: "0.5px solid rgba(255,255,255,0.15)",
            color: "var(--color-text-on-brand-muted)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: "var(--color-lime)" }}
          />
          OAUTH 2.0
        </span>

        {/* Big heading */}
        <div className="text-h1">
          <p style={{ color: "var(--color-text-on-brand)" }}>Log in.</p>
          <p style={{ color: "var(--color-lime)" }}>We handle it.</p>
        </div>

        {/* Description */}
        <p
          style={{
            color: "var(--color-text-on-brand-muted)",
            fontSize: "15px",
            lineHeight: "1.65",
          }}
        >
          A hardened auth flow runs on every sign-in — PKCE, token
          exchange, and session management — without a single line of auth
          code from you.
        </p>

        {/* Divider */}
        <div
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)" }}
        />

        {/* What user sees */}
        <div className="space-y-2">
          <p
            className="text-eyebrow"
            style={{ color: "rgba(122,154,120,0.7)" }}
          >
            WHAT YOUR USER SEES
          </p>
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "0.5px solid rgba(255,255,255,0.1)",
            }}
          >
            <Image
              src="/logo_white.svg"
              width={16}
              height={16}
              className="w-4 h-4 dark:hidden"
              alt=""
            />
            <Image
              src="/logo.svg"
              width={16}
              height={16}
              className="w-4 h-4 hidden dark:block"
              alt=""
            />
            <span
              style={{
                color: "var(--color-text-on-brand)",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              Sign in with Aurik
            </span>
          </div>
        </div>

        {/* Divider with arrow */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full shrink-0 inline-flex items-center justify-center"
            style={{ border: "0.5px solid rgba(255,255,255,0.2)" }}
          >
            <ArrowRight
              className="w-4 h-4"
              style={{ color: "var(--color-text-on-brand)" }}
            />
          </div>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />
        </div>

        {/* What Aurik handles */}
        <div className="space-y-2 mt-auto">
          <p
            className="text-eyebrow"
            style={{ color: "rgba(122,154,120,0.7)" }}
          >
            WHAT AURIK HANDLES
          </p>
          <p
            style={{
              color: "var(--color-lime)",
              fontSize: "15px",
              fontWeight: 600,
              lineHeight: "1.6",
            }}
          >
            PKCE · token exchange · redirect validation · session
            management · user profile
          </p>
        </div>
      </div>
    </motion.div>
  );
}
