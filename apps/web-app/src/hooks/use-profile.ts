import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProfileAPI,
  UpdateProfileData,
  ChangePasswordData,
} from "@/api/profile.api";

export const profileKeys = {
  all: ["profile"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: () => ProfileAPI.getProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => ProfileAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => ProfileAPI.changePassword(data),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ProfileAPI.deleteAccount(),
    onSuccess: () => {
      queryClient.clear();
      // Redirect handled by the component
    },
  });
}

export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => ProfileAPI.uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}
