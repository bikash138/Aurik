import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeveloperAPI, Application } from "@/api/developer.api";

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
    mutationFn: (data: { name: string; redirectUris: string[] }) =>
      DeveloperAPI.createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.applications() });
    },
  });
}

export function useUpdateApplication(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Application>) =>
      DeveloperAPI.updateApplication(clientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: developerKeys.application(clientId),
      });
      // Also invalidate the list to be safe
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
