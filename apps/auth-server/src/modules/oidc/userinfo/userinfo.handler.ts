import type { Request, Response } from "express";
import { UserinfoService } from "./userinfo.service.js";
import { logger } from "@/config/logger.config.js";
import { ApiError } from "@/core/errors/api.error.js";

export class UserinfoHandler {
  public static async userinfo(req: Request, res: Response) {
    try {
      const userId = req.tokenPayload?.sub;
      const scopes = req.accessToken?.scopes;

      if (!userId) {
        return res.status(401).json({ error: "invalid_token", error_description: "Missing token payload" });
      }

      const claims = await UserinfoService.getUserinfo(userId, scopes ?? []);
      return res.status(200).json(claims);
    } catch (error) {
      logger.error({ err: error }, "UserInfo request failed");
      const status = error instanceof ApiError ? error.statusCode : 400;
      return res.status(status).json({
        error: "invalid_token",
        error_description: error instanceof Error ? error.message : "UserInfo request failed",
      });
    }
  }
}
