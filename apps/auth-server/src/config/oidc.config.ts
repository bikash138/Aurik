import { env } from "./env.config.js";

export const oidcConfig = {
  issuer: env.AUTH_SERVER_BASE_URL,
  jwksUri: `${env.AUTH_SERVER_BASE_URL}/.well-known/jwks.json`,
  authorizationEndpoint: `${env.AUTH_SERVER_BASE_URL}/o/authorize`,
  tokenEndpoint: `${env.AUTH_SERVER_BASE_URL}/o/token`,
  userinfoEndpoint: `${env.AUTH_SERVER_BASE_URL}/o/userinfo`,
  revocationEndpoint: `${env.AUTH_SERVER_BASE_URL}/o/token/revoke`,
  endSessionEndpoint: `${env.AUTH_SERVER_BASE_URL}/o/logout`,

  scopesSupported: ["openid", "email", "profile", "offline_access"],
  responseTypesSupported: ["code"],
  grantTypesSupported: ["authorization_code", "refresh_token"],

  idTokenSigningAlgSupported: ["RS256"],

  codeChallengeMethodsSupported: ["S256"],

  userinfoEndpointSupported: true,
};
