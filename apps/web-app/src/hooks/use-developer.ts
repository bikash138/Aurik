import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    queryFn: () => DeveloperAPI.listApplications(),
  });
}

export function useApplication(clientId: string) {
  return useQuery({
    queryKey: developerKeys.application(clientId),
    queryFn: () => DeveloperAPI.getApplication(clientId),
    enabled: !!clientId,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppInput) => DeveloperAPI.createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.applications() });
    },
  });
}

export function useUpdateApplication(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAppInput) =>
      DeveloperAPI.updateApplication(clientId, data),
    onSuccess: (updatedApp) => {
      queryClient.setQueryData(developerKeys.application(clientId), updatedApp);
      queryClient.invalidateQueries({ queryKey: developerKeys.applications() });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: string) => DeveloperAPI.deleteApplication(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.applications() });
    },
  });
}

export function useRegenerateSecret(clientId: string) {
  return useMutation({
    mutationFn: () => DeveloperAPI.regenerateSecret(clientId),
  });
}
