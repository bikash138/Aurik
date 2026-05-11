import { TokenExchange, TokenResponse } from "../core/token.js";
import { UserManager, AurikUser } from "../core/user.js";

export interface AurikServerConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class AurikServer {
  protected config: AurikServerConfig;

  constructor(config: AurikServerConfig) {
    this.config = config;
  }

  /**
   * Swaps an authorization code for tokens.
   * This is the "Confidential" flow that uses the mandatory clientSecret.
   */
  public async exchangeCode(
    code: string,
    codeVerifier: string,
  ): Promise<TokenResponse> {
    return TokenExchange.exchangeCode({
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      redirectUri: this.config.redirectUri,
      code,
      codeVerifier,
    });
  }

  /**
   * Refreshes an expired access token using a refresh token.
   */
  public async refresh(refreshToken: string): Promise<TokenResponse> {
    return TokenExchange.refresh({
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      refreshToken,
    });
  }

  /**
   * Fetches the user profile using an access token.
   */
  public async getUser(accessToken: string): Promise<AurikUser> {
    return UserManager.getUser(accessToken);
  }

  /**
   * Revokes a token (access or refresh).
   */
  public async revokeToken(
    token: string,
    typeHint?: "access_token" | "refresh_token",
  ): Promise<void> {
    return TokenExchange.revoke({
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      token,
      tokenTypeHint: typeHint,
    });
  }
}
