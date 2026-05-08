import { prisma } from "@aurik/database";

export class WellKnownRepo {
  public static async getActiveSigningKeys() {
    return prisma.signingKey.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async getActiveSigningKey() {
    return prisma.signingKey.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
