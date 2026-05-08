import { apiClient } from "./api";

import {
  SigninRequest,
  SignupRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  GenericResponse,
} from "@aurik/zod/auth";

export class AuthAPI {
  public static async signin(data: SigninRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/signin", data);
    return response.data;
  }

  public static async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/signup", data);
    return response.data;
  }

  public static async verifyEmail(
    data: VerifyEmailRequest,
  ): Promise<GenericResponse> {
    const response = await apiClient.post<GenericResponse>(
      "/auth/verify-email",
      data,
    );
    return response.data;
  }

  public static async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<GenericResponse> {
    const response = await apiClient.post<GenericResponse>(
      "/auth/forgot-password",
      data,
    );
    return response.data;
  }

  public static async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<GenericResponse> {
    const response = await apiClient.post<GenericResponse>(
      "/auth/reset-password",
      data,
    );
    return response.data;
  }

  public static async signout() {
    const response = await apiClient.post("/auth/signout");
    return response.data;
  }
}
