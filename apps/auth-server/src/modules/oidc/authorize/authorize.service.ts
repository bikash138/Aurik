import crypto from "crypto";
import type { AuthorizeInput } from "./authorize.schema.js";
import { ApiError } from "@/core/errors/api.error.js";
import { AuthorizeRepo } from "./authorize.repo.js";

export class AuthorizeService {
  public static async validateAuthorizeRequest(query: AuthorizeInput) {
    const client = await AuthorizeRepo.getClientById(query.client_id);

    if (!client) {
      throw ApiError.validationError("INVALID_CLIENT");
    }

    if (!client.isActive) {
      throw ApiError.validationError("CLIENT_INACTIVE");
    }

    if (!client.redirectUris.includes(query.redirect_uri)) {
      throw ApiError.validationError("INVALID_REDIRECT_URI");
    }

    const requestedScopes = query.scope.split(" ");
    const invalidScopes = requestedScopes.filter(
      (s) => !client.scopes.includes(s),
    );

    if (invalidScopes.length > 0) {
      throw ApiError.validationError(
        `INVALID_SCOPES: ${invalidScopes.join(", ")}`,
      );
    }

    return client;
  }

  public static async issueAuthorizationCode(
    userId: string,
    client: { id: string },
    query: AuthorizeInput,
  ) {
    const code = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await AuthorizeRepo.createAuthorizationCode({
      code,
      userId,
      clientId: client.id,
      redirectUri: query.redirect_uri,
      scopes: query.scope.split(" "),
      codeChallenge: query.code_challenge,
      codeChallengeMethod: query.code_challenge_method,
      expiresAt,
    });

    const redirectUrl = new URL(query.redirect_uri);
    redirectUrl.searchParams.set("code", code);
    if (query.state) {
      redirectUrl.searchParams.set("state", query.state);
    }

    return redirectUrl.toString();
  }
}
