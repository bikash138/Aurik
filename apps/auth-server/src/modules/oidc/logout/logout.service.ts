import { LogoutRepo } from "./logout.repo.js";

export class LogoutService {
  public static async logout(sessionToken: string, clientId?: string) {
    const session = await LogoutRepo.getSessionByToken(sessionToken);
    if (!session) return;

    await LogoutRepo.deleteSessionByToken(sessionToken);

    await LogoutRepo.revokeTokens(session.userId, clientId);

    await LogoutRepo.createAuditLog({
      action: clientId ? "oauth.logout.client" : "oauth.logout.full",
      userId: session.userId,
      clientId: clientId ?? undefined,
    });
  }
}
