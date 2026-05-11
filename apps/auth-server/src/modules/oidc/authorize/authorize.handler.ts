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
    try {
      const query = authorizeSchema.parse(req.query);

      const client = await AuthorizeService.validateAuthorizeRequest(query);

      const userId = req.user?.id;

      if (!userId) {
        const returnTo = encodeURIComponent(`${env.AUTH_SERVER_BASE_URL}${req.originalUrl}`);
        return res.redirect(
          `${env.AUTH_UI_URL}/auth/signin?return_to=${returnTo}`,
        );
      }

      const authorizedScopes = await AuthorizeRepo.getAuthorizedScopes(
        userId,
        client.id,
      );

      const requestedScopes = query.scope.split(" ");
      const needsConsent = requestedScopes.some(
        (s) => !authorizedScopes.includes(s),
      );

      if (needsConsent) {
        const consentKey = await ConsentService.createConsentSession({
          userId,
          params: query,
        });

        return res.redirect(`${env.AUTH_UI_URL}/auth/consent?key=${consentKey}`);
      }

      // If already consented, redirect back with code
      const redirectUrl = await AuthorizeService.issueAuthorizationCode(
        userId,
        client,
        query,
      );

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
