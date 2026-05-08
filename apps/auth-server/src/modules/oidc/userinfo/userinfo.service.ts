import { UserinfoRepo } from "./userinfo.repo.js";
import { ApiError } from "@/core/errors/api.error.js";

export class UserinfoService {
  public static async getUserinfo(userId: string, scopes: string[]) {
    const user = await UserinfoRepo.getUserById(userId);

    if (!user) throw ApiError.notFound("USER_NOT_FOUND");
    if (!user.isActive) throw ApiError.forbidden("USER_INACTIVE");

    const claims: Record<string, any> = {
      sub: user.id,
    };

    if (scopes.includes("email")) {
      claims.email = user.email;
      claims.email_verified = user.isEmailVerified;
    }

    if (scopes.includes("profile")) {
      claims.given_name = user.firstName;
      claims.family_name = user.lastName;
      claims.picture = user.profileImageUrl;
      claims.updated_at = user.updatedAt;
    }

    return claims;
  }
}
