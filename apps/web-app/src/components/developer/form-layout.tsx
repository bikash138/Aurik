"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, description, children, className }: SectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-sm font-semibold text-heading">{title}</h3>
        {description && (
          <p className="text-xs text-muted mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

interface FieldRowProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldRow({ label, error, children, className }: FieldRowProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs text-muted">{label}</Label>
      {children}
      {error && (
        <p className="text-[10px] font-medium text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
