import { OIDC_ERROR_MAP, OidcErrorCode, ErrorMetadata } from "./error.codes.js";
import { env } from "@/config/env.config.js";

export class OidcError extends Error {
  public readonly metadata: ErrorMetadata;
  public readonly state?: string;
  public readonly internalDetail?: string;

  constructor(code: OidcErrorCode, internalDetail?: string, state?: string) {
    const metadata = OIDC_ERROR_MAP[code] || OIDC_ERROR_MAP.server_error;
    super(metadata.devTitle);

    this.metadata = metadata;
    this.state = state;
    this.internalDetail = internalDetail;
    this.name = "OidcError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OidcError);
    }
  }

  /**
   * Helper to generate a redirect URL for clients when a request is valid but failed.
   * Note: This should NOT be used for redirect_uri mismatches or invalid_client.
   */
  public toRedirectUrl(redirectUri: string): string {
    const url = new URL(redirectUri);
    url.searchParams.set("error", this.metadata.code);
    url.searchParams.set("error_description", this.metadata.devTitle);
    if (this.state) {
      url.searchParams.set("state", this.state);
    }
    return url.toString();
  }

  /**
   * Helper to generate a redirect URL for our internal Error Page (web-app).
   * Used when we cannot safely redirect back to the client.
   */
  public toInternalErrorUrl(aurikUiUrl: string, redirectUri?: string): string {
    const url = new URL(`${aurikUiUrl}/auth/error`);
    url.searchParams.set("code", this.metadata.code);

    if (redirectUri) {
      url.searchParams.set("redirect_uri", redirectUri);
    }

    const isDev = env.NODE_ENV === "development";

    if (isDev) {
      url.searchParams.set("title", this.metadata.devTitle);
      url.searchParams.set("message", this.metadata.devDescription);
      if (this.internalDetail) {
        url.searchParams.set("detail", this.internalDetail);
      }
    } else {
      url.searchParams.set("title", this.metadata.publicTitle);
      url.searchParams.set("message", this.metadata.publicMessage);
    }

    return url.toString();
  }

  /**
   * Helper to return a JSON error response for Back-Channel endpoints (like /token).
   * According to OIDC spec, these should return a 400/401 status with a JSON body.
   */
  public toJSONResponse(res: any, status: number = 400) {
    return res.status(status).json({
      error: this.metadata.code,
      error_description: this.metadata.devTitle,
    });
  }
}
