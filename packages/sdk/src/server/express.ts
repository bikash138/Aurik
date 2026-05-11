import { Request, Response, NextFunction } from "express";
import { AurikServer, AurikServerConfig } from "./index.js";
import { PKCE } from "../core/pkce.js";
import { Discovery } from "../core/discovery.js";

export class AurikExpress extends AurikServer {
  constructor(config: AurikServerConfig) {
    super(config);
  }

  public redirectToSignin() {
    return async (req: Request, res: Response) => {
      const { challenge, verifier } = await PKCE.generate();

      res.cookie("aurik_verifier", verifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "lax",
      });

      const params = new URLSearchParams({
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        response_type: "code",
        scope: "openid profile email",
        code_challenge: challenge,
        code_challenge_method: "S256",
      });

      res.redirect(
        `${Discovery.AURIK_DOMAIN}/o/authorize?${params.toString()}`,
      );
    };
  }

  public handleCallback(options: {
    successRedirect: string;
    errorRedirect: string;
  }) {
    return async (req: Request, res: Response) => {
      try {
        const code = req.query.code as string;
        const verifier = req.cookies["aurik_verifier"];

        if (!code || !verifier) throw new Error("Missing code or verifier");

        const tokens = await this.exchangeCode(code, verifier);

        res.cookie("aurik_access_token", tokens.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: tokens.expires_in * 1000,
        });

        if (tokens.refresh_token) {
          res.cookie("aurik_refresh_token", tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
        }

        res.clearCookie("aurik_verifier");
        res.redirect(options.successRedirect);
      } catch (error) {
        res.redirect(options.errorRedirect);
      }
    };
  }

  public requireAuth() {
    return async (req: any, res: Response, next: NextFunction) => {
      const accessToken = req.cookies["aurik_access_token"];
      if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

      try {
        req.user = await this.getUser(accessToken);
        next();
      } catch (error) {
        res.status(401).json({ error: "Session expired" });
      }
    };
  }

  public handleSignout(options: { redirectUri: string }) {
    return async (req: Request, res: Response) => {
      const accessToken = req.cookies["aurik_access_token"];
      const refreshToken = req.cookies["aurik_refresh_token"];

      try {
        const promises: Promise<any>[] = [];
        if (accessToken)
          promises.push(this.revokeToken(accessToken, "access_token"));
        if (refreshToken)
          promises.push(this.revokeToken(refreshToken, "refresh_token"));

        await Promise.all(promises).catch(() => {});
      } finally {
        res.clearCookie("aurik_access_token");
        res.clearCookie("aurik_refresh_token");
        res.redirect(options.redirectUri);
      }
    };
  }
}
