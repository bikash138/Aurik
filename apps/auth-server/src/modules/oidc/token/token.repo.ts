import { prisma } from "@aurik/database";

export class TokenRepo {
  public static async getClientById(clientId: string) {
    return prisma.client.findUnique({
      where: { clientId },
    });
  }

  public static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  public static async getAuthorizationCode(code: string) {
    return prisma.authorizationCode.findUnique({
      where: { code },
    });
  }

  public static async updateAuthorizationCode(id: string, data: any) {
    return prisma.authorizationCode.update({
      where: { id },
      data,
    });
  }

  public static async saveTokens(accessTokenData: any, refreshTokenData: any) {
    return prisma.$transaction([
      prisma.accessToken.create({ data: accessTokenData }),
      prisma.refreshToken.create({ data: refreshTokenData }),
    ]);
  }

  public static async getRefreshTokenWithClient(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { client: true },
    });
  }

  public static async revokeAllUserTokens(
    userId: string,
    clientId: string,
  ): Promise<any> {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        clientId,
        revoked: false,
      },
      data: { revoked: true },
    });
  }

  public static async updateRefreshToken(id: string, data: any): Promise<any> {
    return prisma.refreshToken.update({
      where: { id },
      data,
    });
  }

  public static async createAuditLog(data: any): Promise<any> {
    return prisma.auditLog.create({ data });
  }

  public static async getActiveSigningKey() {
    return prisma.signingKey.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
