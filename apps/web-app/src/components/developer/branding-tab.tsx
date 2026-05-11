"use client";

import { useRef } from "react";
import { Globe, Shield, FileText, Upload, X, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UpdateAppInput } from "@/zod/apps.schema";
import { Section, FieldRow } from "@/components/developer/form-layout";

interface BrandingTabProps {
  form: UseFormReturn<UpdateAppInput>;
  onSave: (data: UpdateAppInput) => void;
  saving: boolean;
  logoPreview: string | null;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetLogo: () => void;
}

export function BrandingTab({
  form,
  onSave,
  saving,
  logoPreview,
  onLogoChange,
  onResetLogo,
}: BrandingTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <Section
        title="App Logo"
        description="Displayed on the consent screen to help users identify your app."
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl border border-border bg-secondary flex items-center justify-center overflow-hidden shrink-0">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo"
                className="h-full w-full object-cover"
              />
            ) : (
              <Upload className="h-6 w-6 text-secondary-foreground" />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Change Logo
            </Button>
            {logoPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetLogo}
                type="button"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Reset
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onLogoChange}
          />
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
        <Button onClick={form.handleSubmit(onSave)} disabled={saving || !form.formState.isDirty}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Branding & Links
        </Button>
      </div>
    </div>
  );
}
