"use client";

import { useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { AppType } from "@aurik/database";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CreateAppInput } from "@/zod/apps.schema";

interface CreateAppDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  form: UseFormReturn<CreateAppInput>;
  onSubmit: (data: CreateAppInput) => void;
  creating: boolean;
}

export function CreateAppDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  creating,
}: CreateAppDialogProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control as any,
    name: "redirectUris",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append("");
    }
  }, [fields, append]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Application</DialogTitle>
          <DialogDescription>
            Give your application a name and at least one redirect URL.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="app-name">Name</Label>
            <Input
              id="app-name"
              placeholder="My App"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-[10px] font-medium text-destructive">
                {errors.name.message as string}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Application Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => form.setValue("appType", AppType.CONFIDENTIAL)}
                className={cn(
                  "flex flex-col items-start p-3 rounded-xl border text-left transition-all",
                  form.watch("appType") === AppType.CONFIDENTIAL
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/50",
                )}
              >
                <span className="text-xs font-bold text-heading">Server</span>
                <span className="text-[10px] text-muted leading-tight mt-1">
                  Secure backend apps. Uses Client Secret.
                </span>
              </button>
              <button
                type="button"
                onClick={() => form.setValue("appType", AppType.PUBLIC)}
                className={cn(
                  "flex flex-col items-start p-3 rounded-xl border text-left transition-all",
                  form.watch("appType") === AppType.PUBLIC
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/50",
                )}
              >
                <span className="text-xs font-bold text-heading">SPA</span>
                <span className="text-[10px] text-muted leading-tight mt-1">
                  Frontend-only apps. No secret, uses PKCE.
                </span>
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Redirect URIs</Label>
            <div className="space-y-2">
              {fields.map((field, idx) => (
                <div key={field.id} className="space-y-1">
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/callback"
                      {...register(`redirectUris.${idx}` as const)}
                      className={cn(
                        "font-mono text-xs",
                        errors.redirectUris?.[idx] ? "border-destructive" : "",
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        onClick={() => remove(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {errors.redirectUris?.[idx] && (
                    <p className="text-[10px] font-medium text-destructive">
                      {errors.redirectUris[idx].message as string}
                    </p>
                  )}
                </div>
              ))}
              {errors.redirectUris && !Array.isArray(errors.redirectUris) && (
                <p className="text-[10px] font-medium text-destructive">
                  {errors.redirectUris.message as string}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="px-0 h-auto text-xs text-secondary-foreground hover:text-primary"
              onClick={() => append("")}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add URI
            </Button>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
