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

import { CopyField } from "@/components/developer/copy-field";

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
            <CopyField value={app?.clientId || ""} mono />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted">Client Secret</Label>
            <CopyField value={app?.clientSecret || ""} mono />
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
