import { jwtVerify, createLocalJWKSet } from "jose";
import { Request, Response, NextFunction } from "express";
import { WellKnownService } from "@/modules/oidc/well-known/well-known.service.js";
import { prisma } from "@aurik/database";
import { env } from "@/config/env.config.js";
import { logger } from "@/config/logger.config.js";

declare global {
  namespace Express {
    interface Request {
      tokenPayload?: any;
      accessToken?: any;
      session?: any;
    }
  }
}

export async function validateAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "invalid_token",
      error_description: "Authorization header missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwks = await WellKnownService.getJWKS();
    const keySet = createLocalJWKSet(jwks);

    const { payload } = await jwtVerify(token!, keySet, {
      issuer: env.AUTH_SERVER_BASE_URL,
    });

    const storedToken = await prisma.accessToken.findUnique({
      where: { token },
    });

    if (!storedToken) {
      return res.status(401).json({
        error: "invalid_token",
        error_description: "Token not found",
      });
    }

    if (storedToken.revoked) {
      return res.status(401).json({
        error: "invalid_token",
        error_description: "Token has been revoked",
      });
    }

    req.tokenPayload = payload;
    req.accessToken = storedToken;

    next();
  } catch (err: any) {
    logger.error({ err }, "Access token validation failed");
    return res.status(401).json({
      error: "invalid_token",
      error_description: "Token is invalid or expired",
    });
  }
}
