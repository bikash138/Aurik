"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  RefreshCw,
  X,
  AlertTriangle,
  AppWindow,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useApplication,
  useUpdateApplication,
  useRegenerateSecret,
  useDeleteApplication,
} from "@/hooks/use-developer";
import { CredentialsDialog } from "@/components/modals/credentials-dialog";
import { ConfirmationDialog } from "@/components/modals/confirmation-dialog";
import { UpdateAppSchema, UpdateAppInput } from "@/zod/apps.schema";
import { cn } from "@/lib/utils";
import { AppDetailSkeleton } from "@/components/skeletons/app-detail-skeleton";
import { CoreSettingsTab } from "@/components/developer/core-settings-tab";
import { BrandingTab } from "@/components/developer/branding-tab";
import { DangerZoneTab } from "@/components/developer/danger-zone-tab";

export default function AppDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const router = useRouter();

  const { data: app, isLoading } = useApplication(clientId);
  const { mutate: updateApp, isPending: saving } =
    useUpdateApplication(clientId);
  const { mutate: regenerateSecret, isPending: regening } =
    useRegenerateSecret(clientId);
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

  useEffect(() => {
    if (app) {
      form.reset({
        name: app.name,
        allowedCallbacks: app.allowedCallbacks,
        allowedLogoutCallbacks:
          app.allowedLogoutCallbacks.length > 0
            ? app.allowedLogoutCallbacks
            : [""],
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
    return <AppDetailSkeleton />;
  }

  if (!app) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto w-full pb-24">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/developer/apps")}
        className="group flex items-center gap-1.5 text-muted hover:text-heading hover:bg-transparent -ml-3 mb-6 cursor-pointer transition-all duration-200"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Back to apps
      </Button>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden border border-border">
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt=""
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
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
                : "border-amber-500/20 text-amber-600 hover:bg-amber-50",
            )}
          >
            {app.isActive ? (
              <>
                <Power className="h-3 w-3 mr-1.5" /> Active
              </>
            ) : (
              <>
                <PowerOff className="h-3 w-3 mr-1.5" /> Inactive
              </>
            )}
          </Button>
          <span
            className={`badge ${app.isActive ? "badge-active" : "badge-revoked"}`}
          >
            {app.isActive ? "active" : "inactive"}
          </span>
        </div>
      </div>

      <Tabs defaultValue="settings">
        <TabsList className="mb-6 gap-1 h-10 px-1">
          <TabsTrigger value="settings">Core Settings</TabsTrigger>
          <TabsTrigger value="branding">Branding & Links</TabsTrigger>
          <TabsTrigger value="danger" className="text-destructive">
            Danger Zone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <CoreSettingsTab
            app={app}
            form={form}
            onSave={handleUpdate}
            saving={saving}
            onRotateSecret={() => setRegenDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="branding">
          <BrandingTab
            form={form}
            onSave={handleUpdate}
            saving={saving}
            logoPreview={logoPreview}
            onLogoChange={handleLogoChange}
            onResetLogo={() => {
              setLogoPreview(null);
              form.setValue("logoUrl", undefined);
            }}
          />
        </TabsContent>

        <TabsContent value="danger">
          <DangerZoneTab onDeleteClick={() => setDeleteDialogOpen(true)} />
        </TabsContent>
      </Tabs>

      <ConfirmationDialog
        open={regenDialogOpen}
        onOpenChange={setRegenDialogOpen}
        title="Rotate Client Secret"
        description="Generating a new secret will immediately invalidate the current one. Any application using the old secret will no longer be able to authenticate."
        confirmLabel="Rotate Secret"
        onConfirm={handleRegenSecret}
        isLoading={regening}
        variant="destructive"
        icon={RefreshCw}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Application"
        description={
          <>
            Are you absolutely sure? This will permanently delete{" "}
            <strong>{app.name}</strong>. All users currently logged in via this
            app will be disconnected.
          </>
        }
        confirmLabel="Confirm Delete"
        onConfirm={handleDelete}
        isLoading={deleting}
        variant="destructive"
        icon={Trash2}
      />

      <CredentialsDialog
        app={createdApp}
        onClose={() => setCreatedApp(null)}
        title="Secret Rotated"
        description="Your new client secret has been generated. Make sure to copy it now as it won't be displayed again."
      />
    </div>
  );
}
