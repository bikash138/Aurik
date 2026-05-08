import { localClient } from "./api";

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  gender: string | null;
  dateOfBirth: string | null;
  country: string | null;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  profileImageUrl: string;
  gender: string | null;
  dateOfBirth: string | null;
  country: string | null;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const ProfileAPI = {
  getProfile: () =>
    localClient.get<{ data: Profile }>("/profile").then((r) => r.data.data),

  updateProfile: (data: UpdateProfileData) =>
    localClient
      .put<{ data: Profile }>("/profile", data)
      .then((r) => r.data.data),

  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return localClient
      .post<{
        data: { profileImageUrl: string };
      }>("/profile/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data.data);
  },

  deleteProfileImage: () =>
    localClient
      .delete<{ data: void }>("/profile/image")
      .then((r) => r.data.data),

  changePassword: (data: ChangePasswordData) =>
    localClient
      .post<{ data: void }>("/profile/change-password", data)
      .then((r) => r.data.data),

  deleteAccount: () =>
    localClient.delete<{ data: void }>("/profile").then((r) => r.data.data),
};
