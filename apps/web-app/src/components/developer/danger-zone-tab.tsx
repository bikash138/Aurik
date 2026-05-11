"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DangerZoneTabProps {
  onDeleteClick: () => void;
}

export function DangerZoneTab({ onDeleteClick }: DangerZoneTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
        <h3 className="text-lg font-semibold text-destructive mb-2 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </h3>
        <p className="text-sm text-destructive/80 mb-6 max-w-xl">
          Permanently delete this application and all associated data. This
          action is irreversible and will immediately break any integrations
          using this Client ID.
        </p>
        <Button
          variant="destructive"
          onClick={onDeleteClick}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Application
        </Button>
      </div>
    </div>
  );
}
