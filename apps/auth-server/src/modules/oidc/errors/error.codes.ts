export type OidcErrorCode =
  | "invalid_request"
  | "unauthorized_client"
  | "access_denied"
  | "unsupported_response_type"
  | "invalid_scope"
  | "server_error"
  | "temporarily_unavailable"
  | "redirect_uri_mismatch"
  | "invalid_client"
  | "invalid_grant"
  | "unsupported_grant_type"
  | "invalid_token";

export interface ErrorMetadata {
  code: OidcErrorCode;
  publicTitle: string;
  publicMessage: string;
  devTitle: string;
  devDescription: string;
}

export const OIDC_ERROR_MAP: Record<OidcErrorCode, ErrorMetadata> = {
  invalid_request: {
    code: "invalid_request",
    publicTitle: "Request Error",
    publicMessage:
      "The request sent by the application is malformed or missing data.",
    devTitle: "Protocol Violation: Invalid Request",
    devDescription:
      "A required parameter (like client_id or response_type) is missing, or the request contains duplicate parameters.",
  },
  redirect_uri_mismatch: {
    code: "redirect_uri_mismatch",
    publicTitle: "Security Mismatch",
    publicMessage:
      "This application is trying to redirect you to an untrusted location.",
    devTitle: "Critical: Redirect URI Mismatch",
    devDescription:
      'The "redirect_uri" provided in the request does not match any of the URIs registered for this client in the Aurik Dashboard.',
  },
  invalid_client: {
    code: "invalid_client",
    publicTitle: "App Identity Error",
    publicMessage:
      "We could not verify the identity of the application you are trying to use.",
    devTitle: "Authentication Failed: Invalid Client",
    devDescription:
      "The client_id provided does not exist, or the client_secret is incorrect for this application.",
  },
  access_denied: {
    code: "access_denied",
    publicTitle: "Login Cancelled",
    publicMessage:
      "You have cancelled the login request or do not have permission to access this resource.",
    devTitle: "User Rejected: Access Denied",
    devDescription:
      "The end-user or the server explicitly denied the authorization request.",
  },
  invalid_scope: {
    code: "invalid_scope",
    publicTitle: "Permission Error",
    publicMessage:
      "The application is requesting permissions that are not allowed or recognized.",
    devTitle: "Scope Error: Invalid Scope",
    devDescription:
      "One or more of the requested scopes are invalid, unknown, or malformed for this client configuration.",
  },
  unsupported_response_type: {
    code: "unsupported_response_type",
    publicTitle: "Feature Not Supported",
    publicMessage:
      "The application is trying to use a sign-in method that is not supported by Aurik.",
    devTitle: "Protocol Error: Unsupported Response Type",
    devDescription:
      'Aurik currently supports the "code" (Authorization Code) flow. The requested response_type is not supported.',
  },
  server_error: {
    code: "server_error",
    publicTitle: "System Error",
    publicMessage:
      "Aurik encountered an internal error. Please try again later.",
    devTitle: "Internal Failure: Server Error",
    devDescription:
      "An unexpected condition occurred on the Auth Server (e.g., database connection failure or unhandled exception).",
  },
  unauthorized_client: {
    code: "unauthorized_client",
    publicTitle: "Unauthorized Application",
    publicMessage:
      "This application is not authorized to use the requested sign-in flow.",
    devTitle: "Authorization Failed: Unauthorized Client",
    devDescription:
      "The client is not authorized to request an authorization code using this method (e.g., trying to use a flow disabled in settings).",
  },
  temporarily_unavailable: {
    code: "temporarily_unavailable",
    publicTitle: "Service Unavailable",
    publicMessage:
      "The identity service is currently overloaded. Please try again in a few moments.",
    devTitle: "Status: Temporarily Unavailable",
    devDescription:
      "The server is currently unable to handle the request due to temporary overloading or maintenance.",
  },
  invalid_grant: {
    code: "invalid_grant",
    publicTitle: "Invalid Grant",
    publicMessage: "The provided authorization grant or refresh token is invalid, expired, or revoked.",
    devTitle: "Token Exchange Error: Invalid Grant",
    devDescription: "The authorization code or refresh token is invalid (already used, expired, or mismatched redirect_uri/PKCE).",
  },
  unsupported_grant_type: {
    code: "unsupported_grant_type",
    publicTitle: "Grant Type Not Supported",
    publicMessage: "The requested grant type is not supported by this server.",
    devTitle: "Protocol Error: Unsupported Grant Type",
    devDescription: "The grant_type parameter is missing or set to a type not supported by the Aurik Identity Platform.",
  },
  invalid_token: {
    code: "invalid_token",
    publicTitle: "Invalid Token",
    publicMessage: "Your session has expired or is invalid. Please sign in again.",
    devTitle: "UserInfo Error: Invalid Token",
    devDescription: "The access token provided is invalid, expired, revoked, or the payload is missing required claims.",
  },
};
