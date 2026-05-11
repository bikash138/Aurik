"use client";

import { localClient } from "./api";
import { CreateAppInput, UpdateAppInput } from "@/zod/apps.schema";
import { AppType } from "@aurik/database/enums";

export interface Application {
  clientId: string;
  name: string;
  appType: AppType;
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

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const DeveloperAPI = {
  listApplications: () =>
    localClient.get<APIResponse<Application[]>>("/developer/apps").then((r) => r.data),

  getApplication: (clientId: string) =>
    localClient.get<APIResponse<Application>>(`/developer/apps/${clientId}`).then((r) => r.data),

  createApplication: (data: CreateAppInput) =>
    localClient
      .post<APIResponse<Application & { clientSecret: string }>>("/developer/apps", data)
      .then((r) => r.data),

  updateApplication: (clientId: string, data: UpdateAppInput) =>
    localClient
      .patch<APIResponse<Application>>(`/developer/apps/${clientId}`, data)
      .then((r) => r.data),

  deleteApplication: (clientId: string) =>
    localClient.delete<APIResponse<{ message: string }>>(`/developer/apps/${clientId}`).then((r) => r.data),

  regenerateSecret: (clientId: string) =>
    localClient
      .post<APIResponse<{ clientSecret: string }>>(
        `/developer/apps/${clientId}/regenerate-secret`,
      )
      .then((r) => r.data),
};
