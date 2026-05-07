import type { Request, Response } from "express";
import { SignupBodySchema } from "./auth.schema.js";
import { AuthService } from "./auth.service.js";
import { logger } from "@/config/logger.config.js";

export class AuthHandler {
  public static async signup(req: Request, res: Response) {
    try {
      const body = SignupBodySchema.parse(req.body);
      const user = await AuthService.signup(body);

      res.status(201).json({ message: "Verification email sent", data: user });
    } catch (error) {
      logger.error({ err: error }, "Signup failed");
      res.status(400).json({
        error: error instanceof Error ? error.message : "invalid_request",
      });
    }
  }
}
