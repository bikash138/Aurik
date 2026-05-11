import type { Request, Response } from "express";
import { oidcConfig } from "@/config/oidc.config.js";
import { WellKnownRepo } from "./well-known.repo.js";
import { WellKnownService } from "./well-known.service.js";

export class WellKnownHandler {
  public static getOpenIdConfiguration(req: Request, res: Response) {
    res
      .status(200)
      .setHeader("Cache-Control", "public, max-age=86400")
      .json({
        issuer: oidcConfig.issuer,
        authorization_endpoint: oidcConfig.authorizationEndpoint,
        token_endpoint: oidcConfig.tokenEndpoint,
        userinfo_endpoint: oidcConfig.userinfoEndpoint,
        jwks_uri: oidcConfig.jwksUri,
        revocation_endpoint: oidcConfig.revocationEndpoint,
        scopes_supported: oidcConfig.scopesSupported,
        response_types_supported: oidcConfig.responseTypesSupported,
        grant_types_supported: oidcConfig.grantTypesSupported,
        id_token_signing_alg_values_supported:
          oidcConfig.idTokenSigningAlgSupported,
        code_challenge_methods_supported:
          oidcConfig.codeChallengeMethodsSupported,
        userinfo_endpoint_auth_methods_supported: ["Bearer"],
      });
  }

  public static async getJwks(req: Request, res: Response) {
    const jwks = await WellKnownService.getJWKS();

    res
      .status(200)
      .setHeader("Cache-Control", "public, max-age=86400")
      .json(jwks);
  }
}

export async function getActiveSigningKey() {
  const key = await WellKnownRepo.getActiveSigningKey();

  if (!key) throw new Error("No active signing key found");

  return key;
}
