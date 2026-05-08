import { EXPIRATION_TIMES } from "@/utils/constants.js";
import { prisma, VerificationTokenType } from "@aurik/database";

export class AuthRepo {
  public static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  public static async createUser(
    email: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
    profileImageUrl: string,
  ) {
    return await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        profileImageUrl,
        isEmailVerified: false,
        isActive: true,
      },
    });
  }

  public static async recordSuccessfulLogin(
    userId: string,
    sessionToken: string,
    ipAddress: string,
    userAgent: string,
  ) {
    return await prisma.$transaction([
      prisma.session.create({
        data: {
          token: sessionToken,
          userId: userId,
          ipAddress,
          userAgent,
          expiresAt: new Date(Date.now() + EXPIRATION_TIMES.SESSION),
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { lastLoginAt: new Date() },
      }),
      prisma.auditLog.create({
        data: {
          action: "user.login.success",
          userId: userId,
          ipAddress,
          metadata: { userAgent },
        },
      }),
    ]);
  }

  public static async getVerificationTokenWithUser(token: string) {
    return await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  public static async markEmailAsVerified(userId: string, tokenId: string) {
    return await prisma.$transaction([
      prisma.verificationToken.update({
        where: { id: tokenId },
        data: { usedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { isEmailVerified: true },
      }),
    ]);
  }

  public static async getValidPasswordResetToken(userId: string) {
    return await prisma.verificationToken.findFirst({
      where: {
        userId,
        type: VerificationTokenType.PASSWORD_RESET,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  public static async logPasswordResetRequest(userId: string) {
    return await prisma.auditLog.create({
      data: {
        action: "user.password_reset.requested",
        userId,
      },
    });
  }

  public static async resetPasswordTransaction(
    userId: string,
    tokenId: string,
    passwordHash: string,
  ): Promise<void> {
    await prisma.$transaction([
      prisma.verificationToken.update({
        where: { id: tokenId },
        data: { usedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      prisma.session.deleteMany({
        where: { userId },
      }),
      prisma.auditLog.create({
        data: {
          action: "user.password_reset.success",
          userId,
        },
      }),
    ]);
  }

  public static async getSession(token: string) {
    return await prisma.session.findUnique({ where: { token } });
  }

  public static async deleteSessionAndLog(
    tokenId: string,
    userId: string,
    ipAddress?: string | null,
  ): Promise<void> {
    await prisma.$transaction([
      prisma.session.delete({ where: { id: tokenId } }),
      prisma.auditLog.create({
        data: {
          action: "user.logout",
          userId,
          ipAddress: ipAddress ?? undefined,
        },
      }),
    ]);
  }

  public static async getSessionWithUser(token: string) {
    return await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  public static async deleteSession(tokenId: string) {
    return await prisma.session.delete({ where: { id: tokenId } });
  }

  public static async extendSession(tokenId: string, expiresAt: Date) {
    return await prisma.session.update({
      where: { id: tokenId },
      data: { expiresAt },
    });
  }
}
