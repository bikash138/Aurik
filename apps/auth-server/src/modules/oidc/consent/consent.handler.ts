import type { Request, Response } from "express";
import { ConsentService } from "./consent.service.js";
import { OidcError } from "../errors/oidc.error.js";
import { AuthorizeRepo } from "../authorize/authorize.repo.js";
import type { AuthorizeInput } from "../authorize/authorize.schema.js";
import { env } from "@/config/env.config.js";

export class ConsentHandler {
  public static async getConsentSession(req: Request, res: Response) {
    try {
      const key = req.query.key as string;
      if (!key)
        throw new OidcError("invalid_request", "Consent key is required");

      const session = await ConsentService.getConsentSession(key);
      const params = session.params as unknown as AuthorizeInput;

      const client = await AuthorizeRepo.getClientById(params.client_id);
      if (!client) throw new OidcError("invalid_client", "Client not found");

      return res.status(200).json({
        clientName: client.appName,
        logoUrl: client.logoUrl,
        clientUri: client.clientUri,
        policyUri: client.policyUri,
        tosUri: client.tosUri,
        scopes: params.scope.split(" "),
        params,
      });
    } catch (error) {
      if (error instanceof OidcError) {
        return res.status(200).json({
          action: "redirect",
          redirectUrl: error.toInternalErrorUrl(env.AUTH_UI_URL),
        });
      }
      return res.status(400).json({
        error: "invalid_request",
        message: error instanceof Error ? error.message : "Failed",
      });
    }
  }

  public static async consent(req: Request, res: Response) {
    try {
      const { key, action, scopes } = req.body;

      const session = await ConsentService.getConsentSession(key);
      const params = session.params as unknown as AuthorizeInput;

      if (action === "denied") {
        const oidcError = new OidcError(
          "access_denied",
          "User rejected the request",
          params.state,
        );
        return res.status(200).json({
          action: "redirect",
          redirectUrl: oidcError.toRedirectUrl(params.redirect_uri),
        });
      }

      const client = await AuthorizeRepo.getClientById(params.client_id);
      if (!client) throw new OidcError("invalid_client", "Client not found");

      await ConsentService.saveConsentDecision({
        userId: session.userId,
        clientId: client.id,
        scopes: scopes || params.scope.split(" "),
      });

      const authUrl = new URL(`${env.AUTH_SERVER_BASE_URL}/o/authorize`);
      Object.entries(params).forEach(([k, v]) => {
        if (v) authUrl.searchParams.set(k, v.toString());
      });

      return res.status(200).json({
        action: "redirect",
        redirectUrl: authUrl.toString(),
      });
    } catch (error) {
      if (error instanceof OidcError) {
        const redirectUrl =
          error.metadata.code === "redirect_uri_mismatch"
            ? error.toInternalErrorUrl(env.AUTH_UI_URL)
            : error.toRedirectUrl((req.body.redirect_uri as string) || "");

        return res.status(200).json({
          action: "redirect",
          redirectUrl,
        });
      }
      return res.status(400).json({
        error: "invalid_request",
        message: error instanceof Error ? error.message : "Failed",
      });
    }
  }
}
