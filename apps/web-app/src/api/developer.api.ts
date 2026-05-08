import { localClient } from "./api";
import { CreateAppInput, UpdateAppInput } from "@/zod/apps.schema";

export interface Application {
  clientId: string;
  name: string;
  logoUrl: string;
  clientUri: string;
  policyUri: string | null;
  tosUri: string | null;
  allowedCallbacks: string[];
  allowedLogoutCallbacks: string[];
  scopes: string[];
  createdAt: string;
  isActive: boolean;
}

export const DeveloperAPI = {
  listApplications: () =>
    localClient.get<{ data: Application[] }>("/developer/apps").then((r) => r.data.data),

  getApplication: (clientId: string) =>
    localClient.get<{ data: Application }>(`/developer/apps/${clientId}`).then((r) => r.data.data),

  createApplication: (data: CreateAppInput) =>
    localClient
      .post<{ data: Application & { clientSecret: string } }>("/developer/apps", data)
      .then((r) => r.data.data),

  updateApplication: (clientId: string, data: UpdateAppInput) =>
    localClient
      .patch<{ data: Application }>(`/developer/apps/${clientId}`, data)
      .then((r) => r.data.data),

  deleteApplication: (clientId: string) =>
    localClient.delete<{ data: { message: string } }>(`/developer/apps/${clientId}`).then((r) => r.data.data),

  regenerateSecret: (clientId: string) =>
    localClient
      .post<{ data: { clientSecret: string; message: string } }>(
        `/developer/apps/${clientId}/regenerate-secret`,
      )
      .then((r) => r.data.data),
};
