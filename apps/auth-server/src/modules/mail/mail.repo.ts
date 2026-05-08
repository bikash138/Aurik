import { prisma, VerificationTokenType } from "@aurik/database";

export class MailRepo {
  public static async createVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date,
    returnTo?: string,
  ) {
    return await prisma.verificationToken.create({
      data: {
        userId,
        token,
        type: VerificationTokenType.EMAIL_VERIFICATION,
        expiresAt,
        returnTo,
      },
    });
  }

  public static async createPasswordResetToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ) {
    return await prisma.verificationToken.create({
      data: {
        userId,
        token,
        type: VerificationTokenType.PASSWORD_RESET,
        expiresAt,
      },
    });
  }
}
