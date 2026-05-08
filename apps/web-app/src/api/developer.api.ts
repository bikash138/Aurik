import { localClient } from "./api";

export interface Application {
  clientId: string;
  name: string;
  logoUrl?: string;
  brandColor?: string;
  allowedCallbacks: string[];
  allowedLogoutCallbacks: string[];
  createdAt: string;
  status: "active" | "inactive";
}

export const DeveloperAPI = {
  listApplications: () =>
    localClient.get<{ data: Application[] }>("/developer/apps").then((r) => r.data.data),

  getApplication: (clientId: string) =>
    localClient.get<{ data: Application }>(`/developer/apps/${clientId}`).then((r) => r.data.data),

  createApplication: (data: { name: string; redirectUris: string[] }) =>
    localClient.post<{ data: Application & { clientSecret: string } }>("/developer/apps", data).then((r) => r.data.data),

  updateApplication: (clientId: string, data: Partial<Application>) =>
    localClient.put<{ data: Application }>(`/developer/apps/${clientId}`, data).then((r) => r.data.data),

  deleteApplication: (clientId: string) =>
    localClient.delete<{ data: void }>(`/developer/apps/${clientId}`).then((r) => r.data.data),

  regenerateSecret: (clientId: string) =>
    localClient.post<{ data: { clientSecret: string } }>(
      `/developer/apps/${clientId}/regenerate-secret`,
    ).then((r) => r.data.data),
};
