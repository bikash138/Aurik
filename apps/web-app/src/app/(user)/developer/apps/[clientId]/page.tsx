"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Upload,
  X,
  AlertTriangle,
  Globe,
  Shield,
  FileText,
  AppWindow,
  Plus,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useApplication,
  useUpdateApplication,
  useRegenerateSecret,
  useDeleteApplication,
} from "@/hooks/use-developer";
import { CredentialsDialog } from "@/components/developer/CredentialsDialog";
import { UpdateAppSchema, UpdateAppInput } from "@/zod/apps.schema";
import { cn } from "@/lib/utils";

export default function AppDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const router = useRouter();

  const { data: app, isLoading } = useApplication(clientId);
  const { mutate: updateApp, isPending: saving } = useUpdateApplication(clientId);
  const { mutate: regenerateSecret, isPending: regening } = useRegenerateSecret(clientId);
  const { mutate: deleteApp, isPending: deleting } = useDeleteApplication();

  const [createdApp, setCreatedApp] = useState<{
    clientId: string;
    clientSecret: string;
    name: string;
  } | null>(null);
  const [regenDialogOpen, setRegenDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Logo handling
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UpdateAppInput>({
    resolver: zodResolver(UpdateAppSchema),
    defaultValues: {
      name: "",
      allowedCallbacks: [""],
      allowedLogoutCallbacks: [""],
      logoUrl: undefined,
      clientUri: undefined,
      policyUri: undefined,
      tosUri: undefined,
      isActive: true,
    },
  });

  // Sync form when app data loads
  useEffect(() => {
    if (app) {
      form.reset({
        name: app.name,
        allowedCallbacks: app.allowedCallbacks,
        allowedLogoutCallbacks: app.allowedLogoutCallbacks.length > 0 ? app.allowedLogoutCallbacks : [""],
        logoUrl: app.logoUrl || undefined,
        clientUri: app.clientUri || undefined,
        policyUri: app.policyUri || undefined,
        tosUri: app.tosUri || undefined,
        isActive: app.isActive,
      });
      setLogoPreview(app.logoUrl);
    }
  }, [app, form]);

  function handleRegenSecret() {
    regenerateSecret(undefined, {
      onSuccess: (data) => {
        setCreatedApp({
          clientId,
          clientSecret: data.clientSecret,
          name: app?.name || "Application",
        });
        setRegenDialogOpen(false);
      },
    });
  }

  function handleUpdate(data: UpdateAppInput) {
    // Clean empty strings and filter arrays before sending
    const cleanedData: UpdateAppInput = {
      ...data,
      name: data.name?.trim() || undefined,
      allowedCallbacks: data.allowedCallbacks?.filter(Boolean),
      allowedLogoutCallbacks: data.allowedLogoutCallbacks?.filter(Boolean),
      logoUrl: data.logoUrl || undefined,
      clientUri: data.clientUri || undefined,
      policyUri: data.policyUri || null,
      tosUri: data.tosUri || null,
    };
    updateApp(cleanedData);
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setLogoPreview(result);
      form.setValue("logoUrl", result);
    };
    reader.readAsDataURL(file);
  }

  function toggleStatus() {
    if (!app) return;
    updateApp({ isActive: !app.isActive });
  }

  function handleDelete() {
    deleteApp(clientId, {
      onSuccess: () => {
        router.push("/developer/apps");
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!app) return null;

  return (
    <div className="p-8 max-w-3xl mx-auto w-full pb-24">
      <button
        onClick={() => router.push("/developer/apps")}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-heading transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to apps
      </button>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden border border-border">
            {logoPreview ? (
              <img src={logoPreview} alt="" className="h-full w-full object-cover" />
            ) : (
              <AppWindow className="h-6 w-6 text-secondary-foreground" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-heading">{app.name}</h1>
            <p className="text-xs text-muted font-mono">{app.clientId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleStatus}
            disabled={saving}
            className={cn(
              "h-8 px-3 rounded-full border-2",
              app.isActive 
                ? "border-emerald-500/20 text-emerald-600 hover:bg-emerald-50" 
                : "border-amber-500/20 text-amber-600 hover:bg-amber-50"
            )}
          >
            {app.isActive ? (
              <><Power className="h-3 w-3 mr-1.5" /> Active</>
            ) : (
              <><PowerOff className="h-3 w-3 mr-1.5" /> Inactive</>
            )}
          </Button>
          <span className={`badge ${app.isActive ? "badge-active" : "badge-revoked"}`}>
            {app.isActive ? "active" : "inactive"}
          </span>
        </div>
      </div>

      <Tabs defaultValue="settings">
        <TabsList className="mb-6">
          <TabsTrigger value="settings">Core Settings</TabsTrigger>
          <TabsTrigger value="branding">Branding & Links</TabsTrigger>
          <TabsTrigger value="danger" className="text-destructive">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Section title="General" description="Basic identification for your application.">
            <FieldRow label="Application Name" error={form.formState.errors.name?.message}>
              <Input
                {...form.register("name")}
                placeholder="My Awesome App"
              />
            </FieldRow>
            <FieldRow label="Client ID">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <CopyField value={app.clientId} mono />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRegenDialogOpen(true)}
                  className="shrink-0"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Rotate Secret
                </Button>
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
            <Button onClick={form.handleSubmit(handleUpdate)} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Core Settings
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Section
            title="App Logo"
            description="Displayed on the consent screen to help users identify your app."
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl border border-border bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <Upload className="h-6 w-6 text-secondary-foreground" />
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Change Logo
                </Button>
                {logoPreview && (
                  <Button variant="ghost" size="sm" onClick={() => {
                    setLogoPreview(null);
                    form.setValue("logoUrl", undefined);
                  }}>
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
                onChange={handleLogoChange}
              />
            </div>
          </Section>

          <Separator />

          <Section title="Metadata & Legal" description="URLs used in the consent and login screens.">
            <div className="space-y-4">
              <FieldRow label="Application Homepage" error={form.formState.errors.clientUri?.message}>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                  <Input
                    className="pl-9"
                    {...form.register("clientUri")}
                    placeholder="https://yourapp.com"
                  />
                </div>
              </FieldRow>

              <FieldRow label="Privacy Policy URL (Optional)" error={form.formState.errors.policyUri?.message}>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                  <Input
                    className="pl-9"
                    {...form.register("policyUri")}
                    placeholder="https://yourapp.com/privacy"
                  />
                </div>
              </FieldRow>

              <FieldRow label="Terms of Service URL (Optional)" error={form.formState.errors.tosUri?.message}>
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
            <Button onClick={form.handleSubmit(handleUpdate)} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Branding & Links
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="danger" className="space-y-6">
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
            <h3 className="text-lg font-semibold text-destructive mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </h3>
            <p className="text-sm text-destructive/80 mb-6 max-w-xl">
              Permanently delete this application and all associated data. This action is irreversible and will immediately break any integrations using this Client ID.
            </p>
            <Button 
              variant="destructive" 
              onClick={() => setDeleteDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Application
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={regenDialogOpen} onOpenChange={setRegenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Rotate Client Secret
            </DialogTitle>
            <DialogDescription>
              Generating a new secret will immediately invalidate the current one. Any application using the old secret will no longer be able to authenticate.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegenDialogOpen(false)} disabled={regening}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRegenSecret} disabled={regening}>
              {regening && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Rotate Secret
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Application
            </DialogTitle>
            <DialogDescription>
              Are you absolutely sure? This will permanently delete <strong>{app.name}</strong>. All users currently logged in via this app will be disconnected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CredentialsDialog
        app={createdApp}
        onClose={() => setCreatedApp(null)}
        title="Secret Rotated"
        description="Your new client secret has been generated. Make sure to copy it now as it won't be displayed again."
      />
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-heading">{title}</h3>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function FieldRow({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted">{label}</Label>
      {children}
      {error && (
        <p className="text-[10px] font-medium text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

function CopyField({ value, mono }: { value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Input readOnly value={value} className={cn("flex-1", mono && "font-mono text-xs")} />
      <CopyButton value={value} />
    </div>
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
    <Button variant="outline" size="icon-sm" onClick={handleCopy}>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-secondary-foreground" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

function CallbackList({
  name,
  control,
  register,
  errors,
  placeholder,
}: {
  name: "allowedCallbacks" | "allowedLogoutCallbacks";
  control: any;
  register: any;
  errors: any;
  placeholder?: string;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, idx) => (
        <div key={field.id} className="space-y-1">
          <div className="flex items-center gap-2">
            <Input
              {...register(`${name}.${idx}` as const)}
              placeholder={placeholder}
              className={cn(
                "flex-1 font-mono text-xs",
                errors?.[idx] ? "border-destructive" : ""
              )}
            />
            {fields.length > 1 && (
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(idx)}>
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
