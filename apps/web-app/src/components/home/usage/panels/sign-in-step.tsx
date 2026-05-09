"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Globe } from "lucide-react";

export function SignInStep({ active }: { active: boolean }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!active) {
      setStage(0);
      return;
    }
    const t1 = setTimeout(() => setStage(1), 800);
    const t2 = setTimeout(() => setStage(2), 2200);
    const t3 = setTimeout(() => setStage(3), 3800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [active]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-secondary/50 text-xs font-mono text-muted-foreground">
        <Globe className="w-3 h-3 shrink-0" />
        myapp.com/signin
      </div>
      <div
        className="p-4 rounded-xl border bg-card space-y-3"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="flex items-center justify-between pb-2 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <span className="text-sm font-semibold text-heading">
            My Awesome App
          </span>
          <span className="text-xs text-muted-foreground">Sign in</span>
        </div>

        <p className="text-sm font-medium text-heading text-center">
          Welcome back
        </p>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-muted-foreground"
          style={{ borderColor: "var(--color-border)" }}
        >
          ✉ &nbsp;Continue with email
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          or
          <div className="flex-1 h-px bg-border" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: stage >= 1 ? 1 : 0,
            boxShadow:
              stage >= 2
                ? "0 0 24px rgba(184,240,74,0.4)"
                : "0 0 0px transparent",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold cursor-pointer select-none"
        >
          <img src="/logo_white.svg" className="w-4 h-4 dark:hidden" alt="" />
          <img src="/logo.svg" className="w-4 h-4 hidden dark:block" alt="" />
          Sign in with Aurik
        </motion.div>

        <div className="h-4 flex items-center justify-center">
          <motion.p
            animate={{ opacity: stage >= 3 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs text-center text-primary font-mono"
          >
            ↗ Redirecting to Aurik secure auth...
          </motion.p>
        </div>
      </div>
    </div>
  );
}
