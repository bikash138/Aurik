import { sendEmail } from "@/utils/mailer.js";
import { MailRepo } from "./mail.repo.js";
import { logger } from "@/config/logger.config.js";
import { EXPIRATION_TIMES } from "@/utils/constants.js";
import { env } from "@/config/env.config.js";
import crypto from "crypto";

export class MailService {
  private static generateToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  public static async sendEmailVerificationEmail(
    userId: string,
    email: string,
    returnTo?: string,
  ) {
    const token = this.generateToken();
    const expiresAt = new Date(
      Date.now() + EXPIRATION_TIMES.EMAIL_VERIFICATION,
    );

    await MailRepo.createVerificationToken(userId, token, expiresAt, returnTo);

    const verificationLink = `${env.AUTH_UI_URL}/auth/verify-email?token=${token}`;

    try {
      await sendEmail({
        to: email,
        subject: "Verify your email address",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h2>Welcome to Aurik!</h2>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
            <p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
            <p>${verificationLink}</p>
            <p>This link expires in 24 hours.</p>
          </div>
        `,
      });
      logger.info({ userId }, "Verification email sent");
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to send verification email");
    }
  }

  public static async sendPasswordResetEmail(userId: string, email: string) {
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + EXPIRATION_TIMES.PASSWORD_RESET);

    await MailRepo.createPasswordResetToken(userId, token, expiresAt);

    const resetLink = `${env.AUTH_UI_URL}/auth/reset-password?token=${token}`;

    try {
      await sendEmail({
        to: email,
        subject: "Reset your password",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h2>Password Reset</h2>
            <p>You requested a password reset. Click the button below to set a new password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
            <p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
            <p>${resetLink}</p>
            <p>This link expires in 1 hour.</p>
          </div>
        `,
      });
      logger.info({ userId }, "Password reset email sent");
    } catch (error) {
      logger.error(
        { err: error, userId },
        "Failed to send password reset email",
      );
    }
  }
}
