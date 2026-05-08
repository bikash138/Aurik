import type { Request, Response } from "express";
import { ConsentService } from "./consent.service.js";
import { logger } from "@/config/logger.config.js";
import { ApiError } from "@/core/errors/api.error.js";
import { AuthorizeRepo } from "../authorize/authorize.repo.js";
import type { AuthorizeInput } from "../authorize/authorize.schema.js";
import { env } from "@/config/env.config.js";

export class ConsentHandler {
  public static async getConsentSession(req: Request, res: Response) {
    try {
      const key = req.query.key as string;
      if (!key) throw ApiError.validationError("KEY_REQUIRED");

      const session = await ConsentService.getConsentSession(key);
      const params = session.params as unknown as AuthorizeInput;

      const client = await AuthorizeRepo.getClientById(params.client_id);
      if (!client) throw ApiError.notFound("CLIENT_NOT_FOUND");

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
      logger.error({ err: error }, "Failed to get consent session");
      const status = error instanceof ApiError ? error.statusCode : 400;
      return res.status(status).json({
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
        const redirectUri = new URL(params.redirect_uri);
        redirectUri.searchParams.set("error", "access_denied");
        if (params.state) {
          redirectUri.searchParams.set("state", params.state);
        }
        return res.status(200).json({
          action: "redirect",
          redirectUrl: redirectUri.toString(),
        });
      }

      const client = await AuthorizeRepo.getClientById(params.client_id);
      if (!client) throw ApiError.notFound("CLIENT_NOT_FOUND");

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
      logger.error({ err: error }, "Consent processing failed");
      const status = error instanceof ApiError ? error.statusCode : 400;
      return res.status(status).json({
        error: "invalid_request",
        message: error instanceof Error ? error.message : "Failed",
      });
    }
  }
}
