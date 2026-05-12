"use client";

import { Globe, Shield, FileText, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UpdateAppInput } from "@/zod/apps.schema";
import { Section, FieldRow } from "@/components/developer/form-layout";
import { ImageUpload } from "@/components/upload-image";

interface BrandingTabProps {
  form: UseFormReturn<UpdateAppInput>;
  onSave: (data: UpdateAppInput) => void;
  saving: boolean;
  onLogoBlobChange: (blob: Blob | null) => void;
}

export function BrandingTab({
  form,
  onSave,
  saving,
  onLogoBlobChange,
}: BrandingTabProps) {
  const logoUrl = form.watch("logoUrl");
  const onLogoChange = (blob: Blob | null) => {
    onLogoBlobChange(blob);
    if (blob) {
      form.setValue("logoUrl", URL.createObjectURL(blob), { shouldDirty: true });
    }
  };

  return (
    <div className="space-y-6">
      <Section
        title="App Logo"
        description="Displayed on the consent screen to help users identify your app."
      >
        <div className="flex items-center gap-6">
          <ImageUpload
            value={logoUrl}
            onBlobChange={onLogoChange}
            shape="round"
            aspectRatio={1}
            imageClassName="h-20 w-20 rounded-full"
            className="items-start"
            loading={saving}
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-heading">Application Icon</p>
            <p className="text-xs text-muted max-w-[240px]">
              We recommend a square image of at least 128x128px.
            </p>
          </div>
        </div>
      </Section>

      <Separator />

      <Section
        title="Metadata & Legal"
        description="URLs used in the consent and login screens."
      >
        <div className="space-y-4">
          <FieldRow
            label="Application Homepage"
            error={form.formState.errors.clientUri?.message}
          >
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
              <Input
                className="pl-9"
                {...form.register("clientUri")}
                placeholder="https://yourapp.com"
              />
            </div>
          </FieldRow>

          <FieldRow
            label="Privacy Policy URL (Optional)"
            error={form.formState.errors.policyUri?.message}
          >
            <div className="relative">
              <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
              <Input
                className="pl-9"
                {...form.register("policyUri")}
                placeholder="https://yourapp.com/privacy"
              />
            </div>
          </FieldRow>

          <FieldRow
            label="Terms of Service URL (Optional)"
            error={form.formState.errors.tosUri?.message}
          >
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
              <Input
                className="pl-9"
                {...form.register("tosUri")}
                placeholder="https://yourapp.com/terms"
              />
            </div>
          </FieldRow>
        </div>
      </Section>

      <div className="flex justify-end pt-2">
        <Button
          onClick={form.handleSubmit(onSave)}
          disabled={saving || !form.formState.isDirty}
        >
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Branding & Links
        </Button>
      </div>
    </div>
  );
}
