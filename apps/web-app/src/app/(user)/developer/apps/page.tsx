"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useApplications, useCreateApplication } from "@/hooks/use-developer";
import { CreateAppSchema, CreateAppInput } from "@/zod/apps.schema";

import { ApplicationsTable } from "@/components/developer/applications-table";
import { ApplicationsTableSkeleton } from "@/components/skeletons/applications-table-skeleton";
import { CreateAppDialog } from "@/components/modals/create-app-dialog";
import { CredentialsDialog } from "@/components/modals/credentials-dialog";

export default function DeveloperOverviewPage() {
  const router = useRouter();
  const { data: apps = [], isLoading } = useApplications();
  const { mutate: createApp, isPending: creating } = useCreateApplication();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdApp, setCreatedApp] = useState<{
    clientId: string;
    clientSecret: string;
    name: string;
  } | null>(null);

  const form = useForm<CreateAppInput>({
    resolver: zodResolver(CreateAppSchema),
    defaultValues: {
      name: "",
      redirectUris: [""],
    },
  });

  function onSubmit(data: CreateAppInput) {
    createApp(data, {
      onSuccess: (data) => {
        setDialogOpen(false);
        form.reset();
        setCreatedApp(data);
      },
    });
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
        {apps.length > 0 && !isLoading && (
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            New Application
          </Button>
        )}
      </div>

      {isLoading ? (
        <ApplicationsTableSkeleton />
      ) : (
        <ApplicationsTable
          apps={apps}
          onCreateClick={() => setDialogOpen(true)}
        />
      )}

      <CreateAppDialog
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) form.reset();
        }}
        form={form}
        onSubmit={onSubmit}
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
