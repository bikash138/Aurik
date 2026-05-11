"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AppType } from "@aurik/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UpdateAppInput } from "@/zod/apps.schema";
import { Section, FieldRow } from "@/components/developer/form-layout";
import { CopyField } from "@/components/developer/copy-field";
import { CallbackList } from "@/components/developer/callback-list";
import { cn } from "@/lib/utils";

interface CoreSettingsTabProps {
  app: any;
  form: UseFormReturn<UpdateAppInput>;
  onSave: (data: UpdateAppInput) => void;
  saving: boolean;
  onRotateSecret: () => void;
}

export function CoreSettingsTab({
  app,
  form,
  onSave,
  saving,
  onRotateSecret,
}: CoreSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Section
        title="General"
        description="Basic identification for your application."
      >
        <FieldRow
          label="Application Name"
          error={form.formState.errors.name?.message}
        >
          <Input {...form.register("name")} placeholder="My Awesome App" />
        </FieldRow>
        <FieldRow label="Application Type">
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
              app.appType === AppType.CONFIDENTIAL 
                ? "bg-amber-100 text-amber-700 border border-amber-200" 
                : "bg-blue-100 text-blue-700 border border-blue-200"
            )}>
              {app.appType}
            </span>
            <span className="text-[10px] text-muted leading-tight">
              {app.appType === AppType.CONFIDENTIAL 
                ? "Secure backend application. Requires Client Secret." 
                : "Public application (SPA/Mobile). Uses PKCE."}
            </span>
          </div>
        </FieldRow>
        <FieldRow label="Client ID">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <CopyField value={app.clientId} mono />
            </div>
            {app.appType === AppType.CONFIDENTIAL && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRotateSecret}
                className="shrink-0"
                type="button"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Rotate Secret
              </Button>
            )}
          </div>
        </FieldRow>
      </Section>

      <Separator />

      <Section
        title="Redirect URIs"
        description="The authorized URLs that Aurik can redirect to after a user authenticates."
      >
        <CallbackList
          name="allowedCallbacks"
          control={form.control}
          register={form.register}
          errors={form.formState.errors.allowedCallbacks}
          placeholder="https://yourapp.com/callback"
        />
      </Section>

      <Separator />

      <Section
        title="Post-Logout URIs"
        description="The authorized URLs that Aurik can redirect to after a user logs out."
      >
        <CallbackList
          name="allowedLogoutCallbacks"
          control={form.control}
          register={form.register}
          errors={form.formState.errors.allowedLogoutCallbacks}
          placeholder="https://yourapp.com"
        />
      </Section>

      <div className="flex justify-end pt-2">
        <Button onClick={form.handleSubmit(onSave)} disabled={saving || !form.formState.isDirty}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Core Settings
        </Button>
      </div>
    </div>
  );
}
