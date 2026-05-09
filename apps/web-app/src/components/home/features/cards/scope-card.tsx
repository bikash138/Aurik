"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, ShieldCheck, ShieldAlert } from "lucide-react";

export function ScopeCard() {
  const [granted, setGranted] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="card h-full"
    >
      <div className="flex flex-col h-full">
        {/* HEADER: Grouped Eyebrow + Heading on left, Toggle on right */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p
              className="text-eyebrow mb-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              05 · PRIVACY
            </p>
            <h3 className="text-h3 text-heading">Granular Access.</h3>
          </div>
          
          <button
            onClick={() => setGranted(!granted)}
            className="w-10 h-6 rounded-full flex items-center px-1 transition-colors cursor-pointer outline-none shrink-0 mt-1"
            style={{ 
              background: granted ? "var(--color-lime)" : "var(--color-secondary)",
              border: "1px solid var(--color-border)"
            }}
          >
            <motion.div 
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-4 h-4 rounded-full bg-white shadow-sm"
              style={{ x: granted ? 14 : 0 }}
            />
          </button>
        </div>

        <p
          className="mb-4"
          style={{
            color: "var(--color-text-body)",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          Define exact scopes per app. Users stay in control of their identity.
        </p>

        {/* STANDARDIZED VISUAL CONTAINER */}
        <div 
          className="mt-auto p-2.5 rounded-xl border bg-secondary/10 flex flex-col justify-center h-[140px]"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                   <User className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium text-heading">User Email</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={granted ? "granted" : "revoked"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    granted 
                      ? "bg-lime-500/10 text-lime-600 dark:text-lime-400" 
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}
                >
                  {granted ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                  {granted ? "GRANTED" : "REVOKED"}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="font-mono text-[11px] space-y-1 bg-background/50 p-2 rounded-lg border border-dashed border-border/50">
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">scope:</span>
                <span className="text-primary">"email"</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">value:</span>
                <span className={granted ? "text-heading" : "text-muted-foreground/30 italic"}>
                  {granted ? '"alex@acme.com"' : '"••••••••••••••"'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
