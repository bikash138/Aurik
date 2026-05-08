import type { Request, Response } from "express";
import { LogoutService } from "./logout.service.js";
import { LogoutRepo } from "./logout.repo.js";
import { logger } from "@/config/logger.config.js";
import { env } from "@/config/env.config.js";

export class LogoutHandler {
  public static async logout(req: Request, res: Response) {
    try {
      const sessionToken = req.cookies.sid;

      if (!sessionToken) {
        return res.status(401).json({
          error: "invalid_request",
          error_description: "No active session found",
        });
      }

      const clientId = req.query.client_id as string | undefined;

      await LogoutService.logout(sessionToken, clientId);

      res.clearCookie("sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      const postLogoutRedirectUri = req.query
        .post_logout_redirect_uri as string;

      if (postLogoutRedirectUri && clientId) {
        const client = await LogoutRepo.getClientById(clientId);

        if (client && client.postLogoutUris.includes(postLogoutRedirectUri)) {
          return res.redirect(postLogoutRedirectUri);
        }
      }

      return res.redirect(env.AUTH_UI_URL);
    } catch (err) {
      logger.error({ err }, "Logout failed");
      return res.status(500).json({
        error: "server_error",
        error_description: "Something went wrong",
      });
    }
  }
}
