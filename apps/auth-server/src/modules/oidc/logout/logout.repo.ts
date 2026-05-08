import { prisma } from "@aurik/database";

export class LogoutRepo {
  public static async getClientById(clientId: string) {
    return prisma.client.findUnique({
      where: { clientId },
    });
  }

  public static async getSessionByToken(token: string) {
    return prisma.session.findUnique({
      where: { token },
    });
  }

  public static async deleteSessionByToken(token: string) {
    return prisma.session.delete({
      where: { token },
    });
  }

  public static async revokeTokens(userId: string, clientId?: string): Promise<any> {
    const where = clientId
      ? { userId, clientId, revoked: false }
      : { userId, revoked: false };

    return prisma.$transaction([
      prisma.accessToken.updateMany({
        where,
        data: { revoked: true },
      }),
      prisma.refreshToken.updateMany({
        where,
        data: { revoked: true },
      }),
    ]);
  }

  public static async createAuditLog(data: any): Promise<any> {
    return prisma.auditLog.create({ data });
  }
}
