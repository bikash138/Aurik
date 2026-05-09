"use client";

import { motion } from "motion/react";
import { Logo } from "@/components/Logo";

export function SSOCard() {
  const spokes = [
    { id: "A", angle: -30, label: "Acme Main", delay: 0 },
    { id: "B", angle: 35, label: "Acme CRM", delay: 0.4 },
    { id: "C", angle: 180, label: "Dev Blog", delay: 0.8 },
  ];

  const RADIUS = 95;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="card h-full"
    >
      <div className="flex flex-col h-full">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p
              className="text-eyebrow mb-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              03 · SSO
            </p>
            <h3 className="text-h3 text-heading">Universal Session.</h3>
          </div>
        </div>

        <p
          className="mb-4"
          style={{
            color: "var(--color-text-body)",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          Authenticate once and sessions propagate to all apps automatically.
        </p>

        {/* STANDARDIZED VISUAL CONTAINER */}
        <div
          className="mt-auto p-2.5 rounded-xl border bg-secondary/10 flex items-center justify-center h-[160px] overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* CENTRAL LOGO HUB */}
            <div className="relative w-11 h-11 rounded-full bg-background border border-border shadow-md flex items-center justify-center z-20">
              <Logo width={20} height={20} className="w-5 h-5" />

              {/* Pulsing hub glow */}
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-lime-500 blur-lg -z-10"
              />
            </div>

            {/* CONNECTIVITY SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
              {spokes.map((spoke) => {
                const x = Math.cos((spoke.angle * Math.PI) / 180) * RADIUS;
                const y = Math.sin((spoke.angle * Math.PI) / 180) * RADIUS;

                return (
                  <g key={spoke.id}>
                    {/* DOTTED PATH LINE - Using simple opacity to avoid pathLength dash conflict */}
                    <motion.line
                      x1="50%"
                      y1="50%"
                      x2={`calc(50% + ${x}px)`}
                      y2={`calc(50% + ${y}px)`}
                      stroke="var(--color-border)"
                      strokeWidth="2"
                      strokeDasharray="5 5"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 0.5 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.6 + spoke.delay }}
                    />

                    {/* BLURRED MOVING DATA DOT */}
                    <motion.circle
                      r="4"
                      cx="50%"
                      cy="50%"
                      fill="var(--color-lime)"
                      className="blur-[2px] shadow-[0_0_10px_var(--color-lime)]"
                      initial={{ opacity: 0 }}
                      animate={{
                        x: [0, x],
                        y: [0, y],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: 1.5 + spoke.delay,
                        ease: "easeInOut",
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* App Nodes */}
            {spokes.map((spoke) => {
              const x = Math.cos((spoke.angle * Math.PI) / 180) * RADIUS;
              const y = Math.sin((spoke.angle * Math.PI) / 180) * RADIUS;

              return (
                <motion.div
                  key={spoke.id}
                  initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                  whileInView={{ opacity: 1, scale: 1, x, y }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: 0.8 + spoke.delay,
                  }}
                  className="absolute px-3 py-1 rounded-full border border-border bg-background shadow-sm flex items-center gap-1.5 whitespace-nowrap z-30"
                >
                  <span className="text-[10px] font-bold text-heading">
                    {spoke.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
