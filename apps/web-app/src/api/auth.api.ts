import { apiClient } from "./api";

import {
  SigninRequest,
  SignupRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@aurik/zod/auth";

export class AuthAPI {
  public static async signin(data: SigninRequest) {
    const response = await apiClient.post("/auth/signin", data);
    return response.data;
  }

  public static async signup(data: SignupRequest) {
    const response = await apiClient.post("/auth/signup", data);
    return response.data;
  }

  public static async verifyEmail(data: VerifyEmailRequest) {
    const response = await apiClient.post("/auth/verify-email", data);
    return response.data;
  }

  public static async forgotPassword(data: ForgotPasswordRequest) {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response.data;
  }

  public static async resetPassword(data: ResetPasswordRequest) {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  }

  public static async signout() {
    const response = await apiClient.post("/auth/signout");
    return response.data;
  }

  public static async getMe() {
    const response = await apiClient.get("/auth/me");
    return response.data;
  }
}
