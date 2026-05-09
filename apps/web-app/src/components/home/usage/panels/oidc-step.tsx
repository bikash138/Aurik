"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Terminal } from "lucide-react";

export function OIDCStep({ active }: { active: boolean }) {
  const [visibleLines, setVisibleLines] = useState(0);

  const lines: { text: string; color: string; highlight?: boolean }[] = [
    { text: "// oidc.config.js", color: "text-[#7A9A78] dark:text-[#526050]" },
    {
      text: "import { OidcClient } from 'oidc-client-ts';",
      color: "text-blue-600 dark:text-blue-400",
    },
    { text: " ", color: "" },
    {
      text: "export const oidcConfig = {",
      color: "text-[#1C2D1A] dark:text-[#DDE5D8]",
    },
    {
      text: "  issuer: 'https://aurik.bikashshaw.in',",
      color: "text-[#1C2D1A] dark:text-[#DDE5D8]",
    },
    {
      text: "  client_id: 'aurik_cid_8f3k2j9xp4q',",
      color: "text-green-700 dark:text-green-400",
      highlight: true,
    },
    {
      text: "  client_secret: 'sk_live_9Xk2mN8...',",
      color: "text-amber-700 dark:text-amber-400",
      highlight: true,
    },
    {
      text: "  redirect_uri: window.location.origin,",
      color: "text-[#1C2D1A] dark:text-[#DDE5D8]",
    },
    {
      text: "  scope: 'openid profile email',",
      color: "text-[#1C2D1A] dark:text-[#DDE5D8]",
    },
    { text: "};", color: "text-[#1C2D1A] dark:text-[#DDE5D8]" },
  ];

  useEffect(() => {
    if (!active) {
      setVisibleLines(0);
      return;
    }
    let count = 0;
    const iv = setInterval(() => {
      count++;
      setVisibleLines(count);
      if (count >= lines.length) clearInterval(iv);
    }, 350);
    return () => clearInterval(iv);
  }, [active]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-secondary/50 text-xs font-mono text-muted-foreground">
        <Terminal className="w-3 h-3 shrink-0" />
        oidc.config.js
      </div>
      <div
        className="p-4 rounded-xl border bg-white dark:bg-[#0f1109]"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="space-y-0.5 font-mono text-xs leading-5">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={
                i < visibleLines ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }
              }
              transition={{ duration: 0.18 }}
              className={`${line.color} ${line.highlight ? "bg-primary/10 -mx-4 px-4 rounded" : ""}`}
            >
              {line.text || " "}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
