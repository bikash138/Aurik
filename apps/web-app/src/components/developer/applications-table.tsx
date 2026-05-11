"use client";

import { AppWindow, ExternalLink, MoreHorizontal, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Application {
  clientId: string;
  name: string;
  logoUrl?: string | null;
  isActive: boolean;
  createdAt: string | Date;
}

interface ApplicationsTableProps {
  apps: Application[];
  onCreateClick: () => void;
}

export function ApplicationsTable({ apps, onCreateClick }: ApplicationsTableProps) {
  const router = useRouter();

  if (apps.length === 0) {
    return <EmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/40 border-b border-border">
            <TableHead className="text-secondary-foreground font-medium">
              Name
            </TableHead>
            <TableHead className="text-secondary-foreground font-medium">
              Client ID
            </TableHead>
            <TableHead className="text-secondary-foreground font-medium">
              Status
            </TableHead>
            <TableHead className="text-secondary-foreground font-medium">
              Created
            </TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app) => (
            <TableRow
              key={app.clientId}
              className="cursor-pointer border-b border-border"
              onClick={() => router.push(`/developer/apps/${app.clientId}`)}
            >
              <TableCell className="font-medium text-heading">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                    {app.logoUrl ? (
                      <img
                        src={app.logoUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <AppWindow className="h-4 w-4 text-secondary-foreground" />
                    )}
                  </div>
                  {app.name}
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted">
                {app.clientId}
              </TableCell>
              <TableCell>
                <span
                  className={`badge ${app.isActive ? "badge-active" : "badge-revoked"}`}
                >
                  {app.isActive ? "active" : "inactive"}
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
