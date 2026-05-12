import type { Request, Response } from "express";
import { UserinfoService } from "./userinfo.service.js";
import { OidcError } from "../errors/oidc.error.js";

export class UserinfoHandler {
  public static async userinfo(req: Request, res: Response) {
    try {
      const userId = req.tokenPayload?.sub;
      const scopes = req.accessToken?.scopes;

      if (!userId) {
        throw new OidcError("invalid_token", "Missing token payload");
      }

      const claims = await UserinfoService.getUserinfo(userId, scopes ?? []);
      return res.status(200).json(claims);
    } catch (error) {
      if (error instanceof OidcError) {
        return error.toJSONResponse(res, 401);
      }
      return new OidcError(
        "invalid_token",
        error instanceof Error ? error.message : "UserInfo request failed",
      ).toJSONResponse(res, 401);
    }
  }
}
