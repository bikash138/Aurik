import type { Request, Response } from "express";
import { authorizeSchema } from "./authorize.schema.js";
import { AuthorizeService } from "./authorize.service.js";
import { AuthorizeRepo } from "./authorize.repo.js";
import { env } from "@/config/env.config.js";
import { OidcError } from "../errors/oidc.error.js";
import { ZodError } from "zod";
import { ConsentService } from "@/modules/oidc/consent/consent.service.js";

export class AuthorizeHandler {
  public static async authorize(req: Request, res: Response) {
    try {
      const query = authorizeSchema.parse(req.query);

      const client = await AuthorizeService.validateAuthorizeRequest(query);

      const userId = req.user?.id;

      if (!userId) {
        const returnTo = encodeURIComponent(
          `${env.AUTH_SERVER_BASE_URL}${req.originalUrl}`,
        );
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

        return res.redirect(
          `${env.AUTH_UI_URL}/auth/consent?key=${consentKey}`,
        );
      }

      const redirectUrl = await AuthorizeService.issueAuthorizationCode(
        userId,
        client,
        query,
      );

      return res.redirect(redirectUrl);
    } catch (error: any) {
      if (error instanceof OidcError) {
        // SECURITY: Critical configuration errors MUST stay on Aurik domain
        if (
          error.metadata.code === "redirect_uri_mismatch" ||
          error.metadata.code === "invalid_client"
        ) {
          return res.redirect(error.toInternalErrorUrl(env.AUTH_UI_URL));
        }

        // Standard protocol errors can redirect back to client if we have a URI
        if (req.query.redirect_uri) {
          return res.redirect(
            error.toRedirectUrl(req.query.redirect_uri as string),
          );
        }

        return res.redirect(
          error.toInternalErrorUrl(
            env.AUTH_UI_URL,
            (req.query.redirect_uri as string) || undefined,
          ),
        );
      }

      if (error instanceof ZodError) {
        const oidcError = new OidcError(
          "invalid_request",
          "Malformed request parameters.",
          (req.query.state as string) || undefined,
        );
        return res.redirect(oidcError.toInternalErrorUrl(env.AUTH_UI_URL));
      }

      // Generic Server Error Fallback
      const serverError = new OidcError(
        "server_error",
        error instanceof Error ? error.message : "Unknown error",
      );
      return res.redirect(serverError.toInternalErrorUrl(env.AUTH_UI_URL));
    }
  }
}
