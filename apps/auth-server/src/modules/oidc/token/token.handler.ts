import type { Request, Response } from "express";
import { authorizationCodeSchema, refreshTokenSchema } from "./token.schema.js";
import { TokenService } from "./token.service.js";
import { TokenRepo } from "./token.repo.js";
import { logger } from "@/config/logger.config.js";
import { OidcError } from "../errors/oidc.error.js";

export class TokenHandler {
  public static async token(req: Request, res: Response) {
    const grantType = req.body.grant_type;

    if (grantType === "authorization_code") {
      return TokenHandler.handleAuthorizationCode(req, res);
    }

    if (grantType === "refresh_token") {
      return TokenHandler.handleRefreshToken(req, res);
    }

    return new OidcError(
      "unsupported_grant_type",
      "grant_type must be authorization_code or refresh_token",
    ).toJSONResponse(res);
  }

  public static async handleAuthorizationCode(req: Request, res: Response) {
    const result = authorizationCodeSchema.safeParse(req.body);

    if (!result.success) {
      return new OidcError("invalid_request", "Invalid request parameters").toJSONResponse(res);
    }

    const { code, client_id, client_secret, redirect_uri, code_verifier } =
      result.data;

    try {
      const client = await TokenRepo.getClientById(client_id);

      if (!client || !client.isActive) {
        throw new OidcError("invalid_client", "Client not found or inactive");
      }

      // Authentication Check
      if (client.appType === "CONFIDENTIAL") {
        if (!client_secret) {
          throw new OidcError("invalid_client", "Client secret is required");
        }

        const isSecretValid = await TokenService.verifyClientSecret(
          client_secret,
          client.clientSecretHash || "",
        );

        if (!isSecretValid) {
          throw new OidcError("invalid_client", "Invalid client secret");
        }
      }

      const authCode = await TokenService.validateAuthorizationCode(
        code,
        client.id,
        redirect_uri,
      );

      // PKCE Check
      if (!authCode.codeChallenge && client.appType === "PUBLIC") {
        throw new OidcError("invalid_grant", "PKCE is mandatory for public clients");
      }

      if (authCode.codeChallenge) {
        if (!code_verifier) {
          throw new OidcError("invalid_grant", "code_verifier is required for PKCE");
        }

        const pkceValid = await TokenService.verifyPKCE(
          code_verifier,
          authCode.codeChallenge,
        );

        if (!pkceValid) {
          throw new OidcError("invalid_grant", "PKCE verification failed");
        }
      }

      const tokens = await TokenService.issueTokens(
        authCode.userId,
        client.id,
        authCode.scopes,
        {
          accessTokenTTL: client.accessTokenTTL,
          refreshTokenTTL: client.refreshTokenTTL,
        },
      );

      await TokenRepo.createAuditLog({
        action: "oauth.token.issued",
        userId: authCode.userId,
        clientId: client.id,
        metadata: { scopes: authCode.scopes, grantType: "authorization_code" },
      });

      return res.status(200).json(tokens);
    } catch (error) {
      if (error instanceof OidcError) {
        return error.toJSONResponse(res);
      }
      return new OidcError("invalid_grant", error instanceof Error ? error.message : "Token exchange failed").toJSONResponse(res);
    }
  }

  public static async handleRefreshToken(req: Request, res: Response) {
    const result = refreshTokenSchema.safeParse(req.body);

    if (!result.success) {
      return new OidcError("invalid_request", "Invalid refresh request").toJSONResponse(res);
    }

    const { refresh_token, client_id, client_secret } = result.data;

    try {
      const client = await TokenRepo.getClientById(client_id);

      if (!client || !client.isActive) {
        throw new OidcError("invalid_client", "Client not found or inactive");
      }

      if (client.appType === "CONFIDENTIAL") {
        if (!client_secret) {
          throw new OidcError("invalid_client", "Client secret is required");
        }

        const isSecretValid = await TokenService.verifyClientSecret(
          client_secret,
          client.clientSecretHash || "",
        );

        if (!isSecretValid) {
          throw new OidcError("invalid_client", "Invalid client secret");
        }
      }

      const tokens = await TokenService.rotateRefreshToken(
        refresh_token,
        client_id,
      );
      return res.status(200).json(tokens);
    } catch (error) {
      if (error instanceof OidcError) {
        return error.toJSONResponse(res);
      }
      return new OidcError("invalid_grant", error instanceof Error ? error.message : "Token refresh failed").toJSONResponse(res);
    }
  }

  public static async revoke(req: Request, res: Response) {
    const { token, token_type_hint, client_id, client_secret } = req.body;

    if (!token) {
      return new OidcError("invalid_request", "Token is required").toJSONResponse(res);
    }

    try {
      const client = await TokenRepo.getClientById(client_id);
      if (!client || !client.isActive) {
        throw new OidcError("invalid_client", "Client not found or inactive");
      }

      if (client.appType === "CONFIDENTIAL") {
        const isSecretValid = await TokenService.verifyClientSecret(
          client_secret || "",
          client.clientSecretHash || "",
        );
        if (!isSecretValid) {
          throw new OidcError("invalid_client", "Invalid client_secret");
        }
      }

      await TokenService.revokeToken(token, client_id, token_type_hint);

      return res.status(200).json({ message: "Token revoked successfully" });
    } catch (error) {
      if (error instanceof OidcError) {
        return error.toJSONResponse(res);
      }
      return res.status(200).json({}); // RFC 7009 says always return 200 even if token not found
    }
  }
}
