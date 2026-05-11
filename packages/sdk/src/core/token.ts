import { Discovery } from "./discovery.js";

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface ExchangeCodeOptions {
  clientId: string;
  clientSecret?: string;
  code: string;
  redirectUri: string;
  codeVerifier: string;
}

export interface RefreshTokenOptions {
  clientId: string;
  clientSecret?: string;
  refreshToken: string;
}

export class TokenExchange {
  public static async exchangeCode(
    options: ExchangeCodeOptions,
  ): Promise<TokenResponse> {
    const config = await Discovery.get();

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: options.code,
      redirect_uri: options.redirectUri,
      client_id: options.clientId,
      code_verifier: options.codeVerifier,
    });

    if (options.clientSecret) {
      body.append("client_secret", options.clientSecret);
    }

    const response = await fetch(config.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error_description || "Token exchange failed");
    }

    return response.json();
  }

  /**
   * Uses a refresh token to obtain a new set of tokens
   */
  public static async refresh(
    options: RefreshTokenOptions,
  ): Promise<TokenResponse> {
    const config = await Discovery.get();

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: options.refreshToken,
      client_id: options.clientId,
    });

    if (options.clientSecret) {
      body.append("client_secret", options.clientSecret);
    }

    const response = await fetch(config.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error_description || "Token refresh failed");
    }

    return response.json();
  }

  /**
   * Revokes an access or refresh token
   */
  public static async revoke(options: {
    clientId: string;
    clientSecret?: string;
    token: string;
    tokenTypeHint?: "access_token" | "refresh_token";
  }): Promise<void> {
    const config = await Discovery.get();

    const body = new URLSearchParams({
      token: options.token,
      client_id: options.clientId,
    });

    if (options.clientSecret) {
      body.append("client_secret", options.clientSecret);
    }

    if (options.tokenTypeHint) {
      body.append("token_type_hint", options.tokenTypeHint);
    }

    await fetch(config.revocation_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
  }
}
