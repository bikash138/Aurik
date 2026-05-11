import { Discovery } from "./discovery.js";

export interface AurikUser {
  sub: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  picture?: string;
  updated_at?: string;
  [key: string]: any;
}

export class UserManager {
  public static async getUser(accessToken: string): Promise<AurikUser> {
    const config = await Discovery.get();

    const response = await fetch(config.userinfo_endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "[Aurik SDK] Unauthorized: Access token is invalid or expired.",
        );
      }

      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error_description ||
          `[Aurik SDK] Failed to fetch user profile (Status: ${response.status})`,
      );
    }

    return response.json();
  }
}
