import { prisma } from "@aurik/database";

export class AuthorizeRepo {
  public static async getClientById(clientId: string) {
    return prisma.client.findUnique({
      where: { clientId },
    });
  }

  public static async getAuthorizedScopes(
    userId: string,
    clientId: string,
  ): Promise<string[]> {
    const consent = await prisma.consent.findUnique({
      where: {
        userId_clientId: {
          userId,
          clientId,
        },
      },
    });

    return consent?.scopes || [];
  }

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

  public static async createAuthorizationCode(data: {
    code: string;
    userId: string;
    clientId: string;
    redirectUri: string;
    scopes: string[];
    codeChallenge?: string;
    codeChallengeMethod?: string;
    expiresAt: Date;
  }) {
    return prisma.authorizationCode.create({
      data,
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
