import axios from "axios";
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
  profileImageUrl?: string;
  gender?: string | null;
  dateOfBirth?: string | null;
  country?: string | null;
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

  getUploadUrl: (type: "avatar" | "brand" = "avatar", clientId?: string) =>
    localClient
      .get<{ data: { uploadUrl: string; publicUrl: string } }>(
        "/profile/upload-url",
        { params: { type, clientId } },
      )
      .then((r) => r.data.data),

  uploadToS3: async (url: string, blob: Blob) => {
    const response = await fetch(url, {
      method: "PUT",
      body: blob,
      headers: {
        "Content-Type": "image/webp",
      },
    });

    if (!response.ok) {
      throw new Error(`S3 Upload failed: ${response.statusText}`);
    }

    return response;
  },

  deleteProfileImage: () =>
    localClient
      .delete<{ data: void }>("/profile/image")
      .then((r) => r.data.data),

  changePassword: (data: ChangePasswordData) =>
    localClient
      .post<{ data: void }>("/profile/change-password", data)
      .then((r) => r.data.data),

  uploadProfileImage: async (file: File | Blob) => {
    const { uploadUrl, publicUrl } = await ProfileAPI.getUploadUrl();
    await ProfileAPI.uploadToS3(uploadUrl, file as Blob);
    return ProfileAPI.updateProfile({ profileImageUrl: publicUrl });
  },

  deleteAccount: () =>
    localClient.delete<{ data: void }>("/profile").then((r) => r.data.data),
};
