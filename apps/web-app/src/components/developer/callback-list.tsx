"use client";

import { Plus, X } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CallbackListProps {
  name: string;
  control: any;
  register: any;
  errors: any;
  placeholder?: string;
}

export function CallbackList({
  name,
  control,
  register,
  errors,
  placeholder,
}: CallbackListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, idx) => (
        <div key={field.id} className="space-y-1">
          <div className="flex items-center gap-2">
            <Input
              {...register(`${name}.${idx}` as any)}
              placeholder={placeholder}
              className={cn(
                "flex-1 font-mono text-xs",
                errors?.[idx] ? "border-destructive" : "",
              )}
            />
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(idx)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          {errors?.[idx] && (
            <p className="text-[10px] font-medium text-destructive">
              {errors[idx].message}
            </p>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-xs text-secondary-foreground hover:text-primary p-0 h-auto flex items-center gap-1.5"
        onClick={() => append("")}
      >
        <Plus className="h-3.5 w-3.5" />
        Add URL
      </Button>
    </div>
  );
}
