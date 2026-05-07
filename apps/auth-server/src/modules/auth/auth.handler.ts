import type { Request, Response } from "express";
import {
  ForgotPasswordBodySchema,
  ResetPasswordBodySchema,
  SigninBodySchema,
  SignupBodySchema,
  VerifyEmailBodySchema,
} from "@aurik/zod/auth";
import { AuthService } from "./auth.service.js";
import { logger } from "@/config/logger.config.js";
import { env } from "@/config/env.config.js";
import { EXPIRATION_TIMES } from "@/utils/constants.js";
import { asyncHandler } from "@/utils/async-handler.js";

export class AuthHandler {
  public static signup = asyncHandler(async (req: Request, res: Response) => {
    const body = SignupBodySchema.parse(req.body);
    const user = await AuthService.signup(body);

    res.status(201).json({ message: "Verification email sent", data: user });
  });

  public static signin = asyncHandler(async (req: Request, res: Response) => {
    const body = SigninBodySchema.parse(req.body);
    const ipAddress = req.ip || req.socket?.remoteAddress || "0.0.0.0";
    const userAgent = req.headers["user-agent"] || "unknown";

    const result = await AuthService.signin(body, ipAddress, userAgent);

    res.cookie("sid", result.sessionToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: EXPIRATION_TIMES.SESSION,
    });

    res
      .status(200)
      .json({ message: "Signed in successfully", data: result.user });
  });

  public static verifyEmail = asyncHandler(
    async (req: Request, res: Response) => {
      const body = VerifyEmailBodySchema.parse(req.body);
      await AuthService.verifyEmail(body);

      res.status(200).json({ message: "Email verfied sucessfully" });
    },
  );

  public static forgotPassword = asyncHandler(
    async (req: Request, res: Response) => {
      const body = ForgotPasswordBodySchema.parse(req.body);
      const result = await AuthService.forgotPassword(body);

      res.status(200).json({ message: result.message });
    },
  );

  public static resetPassword = asyncHandler(
    async (req: Request, res: Response) => {
      const body = ResetPasswordBodySchema.parse(req.body);
      const result = await AuthService.resetPassword(body);

      res.status(200).json({ message: result.message });
    },
  );
}
