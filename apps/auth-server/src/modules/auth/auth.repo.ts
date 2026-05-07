import { EXPIRATION_TIMES } from "@/utils/constants.js";
import { prisma } from "@aurik/database";

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
  ) {
    return await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
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
}
