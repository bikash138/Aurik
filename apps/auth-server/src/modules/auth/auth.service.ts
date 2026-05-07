import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { MailService } from "../mail/mail.service.js";
import { AuthRepo } from "./auth.repo.js";
import { ApiError } from "@/core/errors/api.error.js";
import type {
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SigninRequest,
  SignupRequest,
  VerifyEmailRequest,
} from "./auth.schema.js";
import { VerificationTokenType } from "@aurik/database";

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

  public static async verifyEmail(data: VerifyEmailRequest) {
    const record = await AuthRepo.getVerificationTokenWithUser(data.token);

    if (!record) {
      throw ApiError.notFound("Invalid or expired verification token");
    }

    if (record.type !== VerificationTokenType.EMAIL_VERIFICATION) {
      throw ApiError.validationError("Invalid token type");
    }

    if (record.usedAt) {
      throw ApiError.conflict("Code has already been used");
    }

    if (record.expiresAt < new Date()) {
      throw ApiError.validationError("Code has expired");
    }

    await AuthRepo.markEmailAsVerified(record.userId, record.id);
  }

  public static async forgotPassword(data: ForgotPasswordRequest) {
    const user = await AuthRepo.getUserByEmail(data.email);

    if (!user || !user.isActive) {
      return {
        message: "If email exists you will receive a reset link shortly",
      };
    }

    const existingToken = await AuthRepo.getValidPasswordResetToken(user.id);

    if (existingToken) {
      return {
        message: "If email exists you will receive a reset link shortly",
      };
    }

    await MailService.sendPasswordResetEmail(user.id, user.email);
    await AuthRepo.logPasswordResetRequest(user.id);

    return {
      message: "If email exists you will receive a reset link shortly",
    };
  }

  public static async resetPassword(data: ResetPasswordRequest) {
    const record = await AuthRepo.getVerificationTokenWithUser(data.token);

    if (!record) throw ApiError.notFound("Invalid token");
    if (record.usedAt) throw ApiError.conflict("Token already used");
    if (record.expiresAt < new Date())
      throw ApiError.validationError("Token expired");
    if (record.type !== VerificationTokenType.PASSWORD_RESET)
      throw ApiError.validationError("Invalid token");
    if (!record.user.isActive) throw ApiError.forbidden("ACCOUNT_SUSPENDED");

    const hash = this.hashPassword(data.newPassword);

    await AuthRepo.resetPasswordTransaction(record.userId, record.id, hash);

    return { message: "Password reset successfully" };
  }
}
