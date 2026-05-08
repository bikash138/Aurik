import type { Request, Response } from "express";
import { authorizeSchema } from "./authorize.schema.js";
import { AuthorizeService } from "./authorize.service.js";
import { AuthorizeRepo } from "./authorize.repo.js";
import { logger } from "@/config/logger.config.js";
import { env } from "@/config/env.config.js";
import { ApiError } from "@/core/errors/api.error.js";
import { ConsentService } from "@/modules/oidc/consent/consent.service.js";

export class AuthorizeHandler {
  public static async authorize(req: Request, res: Response) {
    logger.info({ query: req.query }, "Received authorize request");
    try {
      const query = authorizeSchema.parse(req.query);
      logger.info("Authorize query parsed successfully");

      const client = await AuthorizeService.validateAuthorizeRequest(query);
      logger.info({ clientId: client.clientId }, "Client validated");

      const userId = req.user?.id;
      logger.info({ userId }, "Authentication check");

      if (!userId) {
        logger.info("User not authenticated, redirecting to sign-in");
        const returnTo = encodeURIComponent(req.originalUrl);
        return res.redirect(
          `${env.AUTH_UI_URL}/auth/signin?return_to=${returnTo}`,
        );
      }

      const authorizedScopes = await AuthorizeRepo.getAuthorizedScopes(
        userId,
        client.id,
      );
      logger.info({ authorizedScopes }, "Authorized scopes retrieved");

      const requestedScopes = query.scope.split(" ");
      const needsConsent = requestedScopes.some(
        (s) => !authorizedScopes.includes(s),
      );
      logger.info({ needsConsent }, "Consent check");

      if (needsConsent) {
        logger.info("Consent needed, creating consent session");
        const consentKey = await ConsentService.createConsentSession({
          userId,
          params: query,
        });

        const redirectUrl = `${env.AUTH_UI_URL}/auth/consent?key=${consentKey}`;
        logger.info({ redirectUrl }, "Redirecting to consent page");
        return res.redirect(redirectUrl);
      }

      // If already consented, redirect back with code
      logger.info("User already consented, proceeding with authorization");
      const redirectUrl = await AuthorizeService.issueAuthorizationCode(
        userId,
        client,
        query,
      );

      logger.info({ redirectUrl }, "Redirecting back to client with code");
      return res.redirect(redirectUrl);
    } catch (error) {
      logger.error({ err: error }, "Authorization request failed");

      const status = error instanceof ApiError ? error.statusCode : 400;
      const message =
        error instanceof Error ? error.message : "Authorization failed";

      return res.status(status).json({
        error: "invalid_request",
        error_description: message,
      });
    }
  }
}
