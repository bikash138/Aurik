import { apiClient } from "./api";

export type SigninData = {
  email: string;
  password: string;
  login_challenge?: string;
};

export type SignupData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type VerifyEmailData = {
  email: string;
  code: string;
};

export type ForgotPasswordData = {
  email: string;
};

export type ResetPasswordData = {
  email: string;
  code: string;
  newPassword: string;
};

export class AuthAPI {
  public static async signin(data: SigninData) {
    const response = await apiClient.post("/auth/signin", data);
    return response.data;
  }

  public static async signup(data: SignupData) {
    const response = await apiClient.post("/auth/signup", data);
    return response.data;
  }

  public static async verifyEmail(data: VerifyEmailData) {
    const response = await apiClient.post("/auth/verify-email", data);
    return response.data;
  }

  public static async forgotPassword(data: ForgotPasswordData) {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response.data;
  }

  public static async resetPassword(data: ResetPasswordData) {
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
