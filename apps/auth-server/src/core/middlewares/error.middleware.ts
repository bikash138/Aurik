import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/api.error.js";
import { logger } from "@/config/logger.config.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    if (!err.isOperational) {
      logger.error(
        {
          err,
          method: req.method,
          url: req.url,
          userId: (req as any).user?.id,
        },
        `Critical Operational Error: ${err.message}`,
      );
    }

    return res.status(err.statusCode).json({
      error: {
        code: err.errorCode,
        message: err.message,
      },
    });
  }

  logger.error(
    {
      err: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
      method: req.method,
      url: req.url,
      body: req.body,
    },
    "Unhandled System Error",
  );

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  });
};
