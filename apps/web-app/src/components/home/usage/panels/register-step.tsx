"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Globe } from "lucide-react";
import { useTypewriter } from "../hooks/use-typewriter";

export function RegisterStep({ active }: { active: boolean }) {
  const appName = useTypewriter("My Awesome App", 90, 400, active);
  const redirectUri = useTypewriter(
    "https://myapp.com/callback",
    60,
    1800,
    active,
  );
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!active) {
      setClicked(false);
      return;
    }
    const t = setTimeout(() => setClicked(true), 4000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-secondary/50 text-xs font-mono text-muted-foreground">
        <Globe className="w-3 h-3 shrink-0" />
        aurik.cloud/developer/apps
      </div>
      <div
        className="space-y-3 p-4 rounded-xl border bg-card"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p className="text-sm font-semibold text-heading">Create Application</p>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">
            Application Name
          </label>
          <div
            className="flex items-center px-3 py-2 rounded-lg border bg-background text-sm font-mono min-h-[36px]"
            style={{ borderColor: "var(--color-border)" }}
          >
            {appName}
            {appName.length > 0 && appName.length < "My Awesome App".length && (
              <span className="ml-0.5 inline-block w-0.5 h-4 bg-primary animate-pulse" />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Redirect URI</label>
          <div
            className="flex items-center px-3 py-2 rounded-lg border bg-background text-sm font-mono min-h-[36px]"
            style={{ borderColor: "var(--color-border)" }}
          >
            {redirectUri}
            {redirectUri.length > 0 &&
              redirectUri.length < "https://myapp.com/callback".length && (
                <span className="ml-0.5 inline-block w-0.5 h-4 bg-primary animate-pulse" />
              )}
          </div>
        </div>

        <motion.div
          className="w-full py-2 rounded-lg text-sm font-medium text-center cursor-pointer select-none"
          animate={
            clicked
              ? {
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                  scale: [1, 0.97, 1],
                }
              : {
                  backgroundColor: "var(--color-secondary)",
                  color: "var(--color-foreground)",
                  scale: 1,
                }
          }
          transition={{ duration: 0.3 }}
        >
          {clicked ? "✓  Application Created!" : "Create Application"}
        </motion.div>
      </div>
    </div>
  );
}
