"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeveloperAPI } from "@/api/developer.api";
import { CreateAppInput, UpdateAppInput } from "@/zod/apps.schema";

export const developerKeys = {
  all: ["developer"] as const,
  applications: () => [...developerKeys.all, "applications"] as const,
  application: (clientId: string) =>
    [...developerKeys.applications(), clientId] as const,
};

export function useApplications() {
  return useQuery({
    queryKey: developerKeys.applications(),
    queryFn: async () => {
      const res = await DeveloperAPI.listApplications();
      return res.data;
    },
  });
}

export function useApplication(clientId: string) {
  return useQuery({
    queryKey: developerKeys.application(clientId),
    queryFn: async () => {
      const res = await DeveloperAPI.getApplication(clientId);
      return res.data;
    },
    enabled: !!clientId,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppInput) => {
      const res = await DeveloperAPI.createApplication(data);
      if (res.success) toast.success(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.applications() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || "Failed to create application");
    },
  });
}

export function useUpdateApplication(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAppInput) => {
      const res = await DeveloperAPI.updateApplication(clientId, data);
      if (res.success) toast.success(res.message);
      return res.data;
    },
    onSuccess: (data, variables) => {
      // Since updateApplication is often called with clientId from outer scope
      // but the component might need the updated data in the cache immediately
      queryClient.setQueryData(developerKeys.application(data.clientId), data);
      queryClient.invalidateQueries({ queryKey: developerKeys.applications() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || "Failed to update application");
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      const res = await DeveloperAPI.deleteApplication(clientId);
      if (res.success) toast.success(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.applications() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || "Failed to delete application");
    },
  });
}

export function useRegenerateSecret(clientId: string) {
  return useMutation({
    mutationFn: async () => {
      const res = await DeveloperAPI.regenerateSecret(clientId);
      if (res.success) toast.success(res.message);
      return res.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || "Failed to regenerate secret");
    },
  });
}
