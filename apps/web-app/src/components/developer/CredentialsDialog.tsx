"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CredentialsDialogProps {
  app: { clientId: string; clientSecret: string; name: string } | null;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function CredentialsDialog({
  app,
  onClose,
  title = "Application Credentials",
  description = "Please copy your client secret now as it won't be shown again.",
}: CredentialsDialogProps) {
  return (
    <Dialog open={!!app} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <RefreshCw className="h-4 w-4 text-primary" />
            </span>
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted">Client ID</Label>
            <div className="flex gap-2">
              <div className="flex-1 font-mono text-xs bg-secondary/50 px-3 py-2 rounded-md break-all border border-transparent">
                {app?.clientId}
              </div>
              <CopyButton value={app?.clientId || ""} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted">Client Secret</Label>
            <div className="flex gap-2">
              <div className="flex-1 font-mono text-xs bg-secondary/50 px-3 py-2 rounded-md break-all border border-transparent">
                {app?.clientSecret}
              </div>
              <CopyButton value={app?.clientSecret || ""} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9 shrink-0"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
