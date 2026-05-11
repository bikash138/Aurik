"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Copy, Eye, EyeOff, Globe } from "lucide-react";

export function CredentialsStep({ active }: { active: boolean }) {
  const [showSecret, setShowSecret] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const clientId = "aurik_cid_8f3k2j9xp4q";
  const clientSecret = "sk_live_9Xk2mN8pL3qR7wT";

  useEffect(() => {
    if (!active) {
      setShowSecret(false);
      setCopiedId(false);
      setCopiedSecret(false);
      return;
    }
    const t1 = setTimeout(() => setCopiedId(true), 1500);
    const t2 = setTimeout(() => setShowSecret(true), 2800);
    const t3 = setTimeout(() => setCopiedSecret(true), 4000);
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
        aurik.cloud/developer/apps/my-awesome-app
      </div>
      <div
        className="space-y-3 p-4 rounded-xl border bg-card"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-heading">My Awesome App</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            Active
          </span>
        </div>

        {/* Client ID */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Client ID</label>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span className="text-xs font-mono text-foreground flex-1 truncate">
              {clientId}
            </span>
            <motion.span
              animate={copiedId ? { color: "var(--color-primary)" } : {}}
            >
              {copiedId ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </motion.span>
          </div>
        </div>

        {/* Client Secret */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">
              Client Secret
            </label>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span className="text-xs font-mono text-foreground flex-1">
              {showSecret ? clientSecret : "••••••••••••••••"}
            </span>
            <div className="flex items-center gap-1.5">
              {showSecret ? (
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <motion.span
                animate={copiedSecret ? { color: "var(--color-primary)" } : {}}
              >
                {copiedSecret ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </motion.span>
            </div>
          </div>
        </div>

        <div className="h-5 flex items-center">
          <motion.p
            animate={{ opacity: copiedId ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-primary font-medium flex items-center gap-1.5"
          >
            <Check className="w-3 h-3" /> Credentials copied to clipboard
          </motion.p>
        </div>
      </div>
    </div>
  );
}
