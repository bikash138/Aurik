"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  Upload,
  X,
  AlertTriangle,
} from "lucide-react";
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
} from "@/hooks/use-developer";
import { CredentialsDialog } from "@/components/developer/CredentialsDialog";
import { cn } from "@/lib/utils";

export default function AppDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const router = useRouter();

  const { data: app, isLoading } = useApplication(clientId);
  const { mutate: updateApp, isPending: saving } =
    useUpdateApplication(clientId);
  const { mutate: regenerateSecret, isPending: regening } =
    useRegenerateSecret(clientId);

  const [createdApp, setCreatedApp] = useState<{
    clientId: string;
    clientSecret: string;
    name: string;
  } | null>(null);
  const [regenDialogOpen, setRegenDialogOpen] = useState(false);

  // Settings state
  const [callbacks, setCallbacks] = useState<string[]>([]);
  const [logoutCallbacks, setLogoutCallbacks] = useState<string[]>([]);

  // Branding state
  const [brandColor, setBrandColor] = useState("#000000");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local state when app data loads
  useEffect(() => {
    if (app) {
      setCallbacks(app.allowedCallbacks);
      setLogoutCallbacks(app.allowedLogoutCallbacks);
      setBrandColor(app.brandColor ?? "#000000");
      setLogoPreview(app.logoUrl ?? null);
    }
  }, [app]);


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

  function handleSaveSettings() {
    updateApp({
      allowedCallbacks: callbacks.filter(Boolean),
      allowedLogoutCallbacks: logoutCallbacks.filter(Boolean),
    });
  }

  function handleSaveBranding() {
    updateApp({
      brandColor,
      logoUrl: logoPreview ?? undefined,
    });
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
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
    <div className="p-8 max-w-3xl mx-auto w-full">
      <button
        onClick={() => router.push("/developer")}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-heading transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to overview
      </button>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt={app.name}
              className="h-12 w-12 rounded-lg object-cover border border-border"
            />
          ) : (
            <div
              className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
              style={{ backgroundColor: brandColor }}
            >
              {app.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold text-heading">
              {app.name}
            </h1>
          </div>
        </div>
        <span className={`badge ${app.status === "active" ? "badge-active" : "badge-revoked"}`}>
          {app.status}
        </span>
      </div>

      <Tabs defaultValue="settings">
        <TabsList className="mb-6">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Section
            title="Credentials"
            description="Your application's unique identifiers."
          >
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
                  Regenerate Secret
                </Button>
              </div>
            </FieldRow>
          </Section>

          <Separator />

          <Section
            title="Allowed Callback URLs"
            description="After login, users will be redirected to one of these URLs."
          >
            <CallbackList
              values={callbacks}
              onChange={setCallbacks}
              placeholder="https://yourapp.com/callback"
            />
          </Section>

          <Separator />

          <Section
            title="Allowed Logout URLs"
            description="After logout, users will be redirected to one of these URLs."
          >
            <CallbackList
              values={logoutCallbacks}
              onChange={setLogoutCallbacks}
              placeholder="https://yourapp.com"
            />
          </Section>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Section
            title="Logo"
            description="Upload a logo for your application. PNG or SVG recommended."
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl border border-border bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
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
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload
                </Button>
                {logoPreview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLogoPreview(null)}
                  >
                    <X className="h-3.5 w-3.5 mr-1.5" />
                    Remove
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

          <Section
            title="Brand Color"
            description="Primary color used in the Aurik-hosted login page for your application."
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="sr-only"
                  id="brand-color-picker"
                />
                <label
                  htmlFor="brand-color-picker"
                  className="flex items-center gap-2.5 cursor-pointer border border-border rounded-md px-3 py-2 hover:bg-secondary transition-colors"
                >
                  <span
                    className="h-5 w-5 rounded-sm border border-black/10 shrink-0"
                    style={{ backgroundColor: brandColor }}
                  />
                  <span className="text-sm font-mono text-foreground">
                    {brandColor.toUpperCase()}
                  </span>
                </label>
              </div>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBrandColor(color)}
                    className={cn(
                      "h-7 w-7 rounded-md border transition-all",
                      brandColor === color
                        ? "ring-2 ring-offset-2 ring-primary border-transparent"
                        : "border-border hover:scale-110",
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-border p-5 bg-secondary/30">
              <p className="text-xs text-muted mb-3">Preview</p>
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold text-base"
                  style={{ backgroundColor: brandColor }}
                >
                  {app.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-heading">
                    {app.name}
                  </p>
                  <p className="text-xs text-muted">
                    Sign in to continue
                  </p>
                </div>
              </div>
              <div
                className="mt-3 h-9 rounded-md flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: brandColor }}
              >
                Continue
              </div>
            </div>
          </Section>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveBranding} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Branding
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={regenDialogOpen} onOpenChange={setRegenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Regenerate Secret
            </DialogTitle>
            <DialogDescription>
              This will invalidate the current client secret immediately. Any
              integrations using the old secret will stop working.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRegenDialogOpen(false)}
              disabled={regening}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRegenSecret}
              disabled={regening}
            >
              {regening && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CredentialsDialog
        app={createdApp}
        onClose={() => setCreatedApp(null)}
        title="Secret Regenerated"
        description="Your new client secret has been generated. Please copy it now as it won't be shown again."
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
        {description && (
          <p className="text-xs text-muted mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted">{label}</Label>
      {children}
    </div>
  );
}

function CopyField({ value, mono }: { value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Input
        readOnly
        value={value}
        className={cn("flex-1", mono && "font-mono text-xs")}
      />
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
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const list = values.length > 0 ? values : [""];

  function update(idx: number, val: string) {
    const next = [...list];
    next[idx] = val;
    onChange(next);
  }

  function remove(idx: number) {
    onChange(list.filter((_, i) => i !== idx));
  }

  function add() {
    onChange([...list, ""]);
  }

  return (
    <div className="space-y-2">
      {list.map((url, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            value={url}
            onChange={(e) => update(idx, e.target.value)}
            placeholder={placeholder}
            className="flex-1 font-mono text-xs"
          />
          {list.length > 1 && (
            <Button variant="ghost" size="icon-sm" onClick={() => remove(idx)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ))}
      <Button variant="ghost" size="sm" className="text-xs text-secondary-foreground hover:text-primary" onClick={add}>
        <X className="h-3.5 w-3.5 mr-1 rotate-45" />
        Add URL
      </Button>
    </div>
  );
}

const PRESET_COLORS = [
  "#18181b",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#ea580c",
  "#16a34a",
];
