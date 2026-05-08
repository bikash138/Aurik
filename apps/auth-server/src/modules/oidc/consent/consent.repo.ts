import { prisma } from "@aurik/database";

export class ConsentRepo {
  public static async createConsentSession(data: {
    userId: string;
    params: any;
    key: string;
    expiresAt: Date;
  }) {
    return prisma.consentSession.create({
      data,
    });
  }

  public static async getConsentSession(key: string) {
    return prisma.consentSession.findUnique({
      where: { key },
    });
  }

  public static async saveConsentDecision(data: {
    userId: string;
    clientId: string;
    scopes: string[];
  }) {
    return prisma.consent.upsert({
      where: {
        userId_clientId: {
          userId: data.userId,
          clientId: data.clientId,
        },
      },
      update: {
        scopes: data.scopes,
      },
      create: {
        userId: data.userId,
        clientId: data.clientId,
        scopes: data.scopes,
      },
    });
  }
}
