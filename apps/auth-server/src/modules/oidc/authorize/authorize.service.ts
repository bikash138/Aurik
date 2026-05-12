import crypto from "crypto";
import type { AuthorizeInput } from "./authorize.schema.js";
import { OidcError } from "../errors/oidc.error.js";
import { AuthorizeRepo } from "./authorize.repo.js";
import { EXPIRATION_TIMES } from "@/utils/constants.js";

export class AuthorizeService {
  public static async validateAuthorizeRequest(query: AuthorizeInput) {
    const client = await AuthorizeRepo.getClientById(query.client_id);

    if (!client) {
      throw new OidcError("invalid_client", "The provided client_id does not exist.", query.state);
    }

    if (!client.isActive) {
      throw new OidcError("unauthorized_client", "The client application has been deactivated.", query.state);
    }

    if (!client.redirectUris.includes(query.redirect_uri)) {
      throw new OidcError("redirect_uri_mismatch", `The redirect_uri '${query.redirect_uri}' is not registered for this client.`, query.state);
    }

    const requestedScopes = query.scope.split(" ");
    const invalidScopes = requestedScopes.filter(
      (s) => !client.scopes.includes(s),
    );

    if (invalidScopes.length > 0) {
      throw new OidcError("invalid_scope", `The following scopes are not allowed: ${invalidScopes.join(", ")}`, query.state);
    }

    // PKCE Check
    const isPkceMandatory = client.appType === "PUBLIC" || client.pkceRequired;
    
    if (isPkceMandatory && !query.code_challenge) {
      throw new OidcError("invalid_request", "PKCE (code_challenge) is required for this client type.", query.state);
    }

    return client;
  }

  public static async issueAuthorizationCode(
    userId: string,
    client: { id: string },
    query: AuthorizeInput,
  ) {
    const code = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + EXPIRATION_TIMES.AUTHORIZATION_CODE);

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
