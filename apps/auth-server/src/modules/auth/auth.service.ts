import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { MailService } from "../mail/mail.service.js";
import { AuthRepo } from "./auth.repo.js";
import { ApiError } from "@/core/errors/api.error.js";
import type { SigninRequest, SignupRequest } from "./auth.schema.js";

export class AuthService {
  private static hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  private static verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  public static async signup(data: SignupRequest) {
    const existingUser = await AuthRepo.getUserByEmail(data.email);
    if (existingUser) {
      throw ApiError.conflict("User already exists with this email");
    }

    const passwordHash = this.hashPassword(data.password);

    const newUser = await AuthRepo.createUser(
      data.email,
      passwordHash,
      data.firstName,
      data.lastName,
    );

    await MailService.sendEmailVerificationEmail(newUser.id, newUser.email);

    return {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };
  }

  public static async signin(
    data: SigninRequest,
    ipAddress: string,
    userAgent: string,
  ) {
    const user = await AuthRepo.getUserByEmail(data.email);

    if (!user || !user.passwordHash) {
      throw ApiError.invalidCredentials();
    }

    const isValid = this.verifyPassword(data.password, user.passwordHash);

    if (!isValid) {
      throw ApiError.invalidCredentials();
    }

    if (!user.isActive) {
      throw ApiError.forbidden("ACCOUNT_SUSPENDED");
    }

    if (!user.isEmailVerified) {
      throw ApiError.forbidden("EMAIL_NOT_VERIFIED");
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");

    await AuthRepo.recordSuccessfulLogin(
      user.id,
      sessionToken,
      ipAddress,
      userAgent,
    );

    return {
      sessionToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }
}
