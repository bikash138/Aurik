"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  AppWindow,
  ExternalLink,
  MoreHorizontal,
  Loader2,
  X,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApplications, useCreateApplication } from "@/hooks/use-developer";
import { CredentialsDialog } from "@/components/developer/CredentialsDialog";

export default function DeveloperOverviewPage() {
  const router = useRouter();
  const { data: apps = [], isLoading } = useApplications();
  const { mutate: createApp, isPending: creating } = useCreateApplication();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [redirectUris, setRedirectUris] = useState<string[]>([""]);
  const [createdApp, setCreatedApp] = useState<{
    clientId: string;
    clientSecret: string;
    name: string;
  } | null>(null);

  function handleCreate() {
    if (!newAppName.trim() || redirectUris.filter(Boolean).length === 0) return;

    createApp(
      {
        name: newAppName.trim(),
        redirectUris: redirectUris.filter(Boolean),
      },
      {
        onSuccess: (data) => {
          setDialogOpen(false);
          setNewAppName("");
          setRedirectUris([""]);
          setCreatedApp(data);
        },
      },
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Applications</h1>
          <p className="text-sm text-muted mt-1">
            Manage your applications and API credentials.
          </p>
        </div>
        {apps.length > 0 && (
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            New Application
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : apps.length === 0 ? (
        <EmptyState onCreateClick={() => setDialogOpen(true)} />
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40 border-b border-border">
                <TableHead className="text-secondary-foreground font-medium">Name</TableHead>
                <TableHead className="text-secondary-foreground font-medium">Client ID</TableHead>
                <TableHead className="text-secondary-foreground font-medium">Status</TableHead>
                <TableHead className="text-secondary-foreground font-medium">Created</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((app) => (
                <TableRow
                  key={app.clientId}
                  className="cursor-pointer hover:bg-accent/50 border-b border-border"
                  onClick={() => router.push(`/developer/apps/${app.clientId}`)}
                >
                  <TableCell className="font-medium text-heading">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center shrink-0">
                        <AppWindow className="h-4 w-4 text-secondary-foreground" />
                      </div>
                      {app.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted">
                    {app.clientId}
                  </TableCell>
                  <TableCell>
                    <span className={`badge ${app.status === "active" ? "badge-active" : "badge-revoked"}`}>
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted text-sm">
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/developer/apps/${app.clientId}`)
                          }
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateAppDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        name={newAppName}
        onNameChange={setNewAppName}
        redirectUris={redirectUris}
        onRedirectUrisChange={setRedirectUris}
        onCreate={handleCreate}
        creating={creating}
      />

      <CredentialsDialog
        app={createdApp}
        onClose={() => {
          if (createdApp) {
            router.push(`/developer/apps/${createdApp.clientId}`);
          }
          setCreatedApp(null);
        }}
        title="Application Created"
        description={`Your application ${createdApp?.name} has been created. Please copy your client secret now as it won't be shown again.`}
      />
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-xl py-20 px-8 text-center">
      <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-5">
        <AppWindow className="h-7 w-7 text-secondary-foreground" />
      </div>
      <h2 className="text-lg font-semibold text-heading mb-2">
        Create your first application
      </h2>
      <p className="text-sm text-muted max-w-sm mb-8">
        Applications let you integrate Aurik authentication into your products.
        Get a client ID and secret to get started.
      </p>
      <Button size="lg" onClick={onCreateClick}>
        <Plus className="h-4 w-4 mr-2" />
        Create Application
      </Button>
    </div>
  );
}

interface CreateAppDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  name: string;
  onNameChange: (v: string) => void;
  redirectUris: string[];
  onRedirectUrisChange: (v: string[]) => void;
  onCreate: () => void;
  creating: boolean;
}

function CreateAppDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  redirectUris,
  onRedirectUrisChange,
  onCreate,
  creating,
}: CreateAppDialogProps) {
  function updateUri(idx: number, val: string) {
    const next = [...redirectUris];
    next[idx] = val;
    onRedirectUrisChange(next);
  }

  function addUri() {
    onRedirectUrisChange([...redirectUris, ""]);
  }

  function removeUri(idx: number) {
    onRedirectUrisChange(redirectUris.filter((_, i) => i !== idx));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Application</DialogTitle>
          <DialogDescription>
            Give your application a name and at least one redirect URL.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="app-name">Name</Label>
            <Input
              id="app-name"
              placeholder="My App"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onCreate()}
            />
          </div>
          <div className="space-y-2">
            <Label>Redirect URIs</Label>
            <div className="space-y-2">
              {redirectUris.map((uri, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    placeholder="https://example.com/callback"
                    value={uri}
                    onChange={(e) => updateUri(idx, e.target.value)}
                    className="font-mono text-xs"
                  />
                  {redirectUris.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0"
                      onClick={() => removeUri(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="link"
              size="sm"
              className="px-0 h-auto text-xs text-secondary-foreground hover:text-primary"
              onClick={addUri}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add URI
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button
            onClick={onCreate}
            disabled={
              !name.trim() ||
              redirectUris.filter(Boolean).length === 0 ||
              creating
            }
          >
            {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
