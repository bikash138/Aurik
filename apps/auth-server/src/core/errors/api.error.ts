import { ErrorCode } from "./error.types.js";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode,
    isOperational = true,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
  }

  public static unauthorized(message = "Unauthorized") {
    return new ApiError(message, 401, ErrorCode.UNAUTHORIZED);
  }

  public static forbidden(message = "Forbidden") {
    return new ApiError(message, 403, ErrorCode.FORBIDDEN);
  }

  public static invalidCredentials(message = "Invalid credentials") {
    return new ApiError(message, 401, ErrorCode.INVALID_CREDENTIALS);
  }

  public static tokenExpired(message = "Token expired") {
    return new ApiError(message, 401, ErrorCode.TOKEN_EXPIRED);
  }

  public static accessTokenExpired(message = "Access token expired") {
    return new ApiError(message, 401, ErrorCode.ACCESS_TOKEN_EXPIRED);
  }

  public static validationError(message = "Validation error") {
    return new ApiError(message, 400, ErrorCode.VALIDATION_ERROR);
  }

  public static notFound(message = "Not found") {
    return new ApiError(message, 404, ErrorCode.NOT_FOUND);
  }

  public static conflict(message = "Conflict") {
    return new ApiError(message, 409, ErrorCode.CONFLICT);
  }

  public static internal(message = "Internal server error") {
    return new ApiError(message, 500, ErrorCode.INTERNAL_SERVER_ERROR, false);
  }

  public static rateLimit(message = "Too many requests") {
    return new ApiError(message, 429, ErrorCode.RATE_LIMIT_REACHED);
  }
}
