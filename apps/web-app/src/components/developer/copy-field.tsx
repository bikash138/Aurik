"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CopyFieldProps {
  value: string;
  mono?: boolean;
  className?: string;
}

export function CopyField({ value, mono, className }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Input
        readOnly
        value={value}
        className={cn("flex-1", mono && "font-mono text-xs")}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        onClick={handleCopy}
        type="button"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
