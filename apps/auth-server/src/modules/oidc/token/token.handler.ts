import type { Request, Response } from "express";
import { authorizationCodeSchema, refreshTokenSchema } from "./token.schema.js";
import { TokenService } from "./token.service.js";
import { TokenRepo } from "./token.repo.js";
import { logger } from "@/config/logger.config.js";
import { ApiError } from "@/core/errors/api.error.js";

export class TokenHandler {
  public static async token(req: Request, res: Response) {
    const grantType = req.body.grant_type;

    if (grantType === "authorization_code") {
      return TokenHandler.handleAuthorizationCode(req, res);
    }

    if (grantType === "refresh_token") {
      return TokenHandler.handleRefreshToken(req, res);
    }

    return res.status(400).json({
      error: "unsupported_grant_type",
      error_description:
        "grant_type must be authorization_code or refresh_token",
    });
  }

  public static async handleAuthorizationCode(req: Request, res: Response) {
    const result = authorizationCodeSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: result.error.issues,
      });
    }

    const { code, client_id, client_secret, redirect_uri, code_verifier } =
      result.data;

    try {
      const client = await TokenRepo.getClientById(client_id);

      if (!client || !client.isActive) {
        return res.status(401).json({
          error: "invalid_client",
          error_description: "Client not found or inactive",
        });
      }

      // 2. Authentication Check based on AppType
      if (client.appType === "CONFIDENTIAL") {
        if (!client_secret) {
          return res.status(401).json({
            error: "invalid_client",
            error_description:
              "client_secret is required for confidential clients",
          });
        }

        const isSecretValid = await TokenService.verifyClientSecret(
          client_secret,
          client.clientSecretHash || "",
        );

        if (!isSecretValid) {
          return res.status(401).json({
            error: "invalid_client",
            error_description: "Invalid client_secret",
          });
        }
      }

      const authCode = await TokenService.validateAuthorizationCode(
        code,
        client.id,
        redirect_uri,
      );

      // 3. PKCE Check (Mandatory for PUBLIC apps)
      if (!authCode.codeChallenge && client.appType === "PUBLIC") {
        return res.status(400).json({
          error: "invalid_grant",
          error_description: "PKCE is mandatory for public clients",
        });
      }

      if (authCode.codeChallenge) {
        if (!code_verifier) {
          return res.status(400).json({
            error: "invalid_grant",
            error_description: "code_verifier is required for PKCE",
          });
        }

        const pkceValid = await TokenService.verifyPKCE(
          code_verifier,
          authCode.codeChallenge,
        );

        if (!pkceValid) {
          return res.status(400).json({
            error: "invalid_grant",
            error_description: "PKCE verification failed",
          });
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
      logger.error({ err: error }, "Token exchange failed");
      const status = error instanceof ApiError ? error.statusCode : 400;
      return res.status(status).json({
        error: "invalid_grant",
        error_description:
          error instanceof Error ? error.message : "Token exchange failed",
      });
    }
  }

  public static async handleRefreshToken(req: Request, res: Response) {
    const result = refreshTokenSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: result.error.issues,
      });
    }

    const { refresh_token, client_id, client_secret } = result.data;

    try {
      const client = await TokenRepo.getClientById(client_id);

      if (!client || !client.isActive) {
        return res.status(401).json({
          error: "invalid_client",
          error_description: "Client not found or inactive",
        });
      }

      if (client.appType === "CONFIDENTIAL") {
        if (!client_secret) {
          return res.status(401).json({
            error: "invalid_client",
            error_description:
              "client_secret is required for confidential clients",
          });
        }

        const isSecretValid = await TokenService.verifyClientSecret(
          client_secret,
          client.clientSecretHash || "",
        );

        if (!isSecretValid) {
          return res.status(401).json({
            error: "invalid_client",
            error_description: "Invalid client_secret",
          });
        }
      }

      const tokens = await TokenService.rotateRefreshToken(
        refresh_token,
        client_id,
      );
      return res.status(200).json(tokens);
    } catch (error) {
      logger.error({ err: error }, "Token refresh failed");
      const status = error instanceof ApiError ? error.statusCode : 400;
      return res.status(status).json({
        error: "invalid_grant",
        error_description:
          error instanceof Error ? error.message : "Token refresh failed",
      });
    }
  }
}
