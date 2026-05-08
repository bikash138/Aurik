import crypto from "crypto";
import { ConsentRepo } from "./consent.repo.js";
import { ApiError } from "@/core/errors/api.error.js";
import { EXPIRATION_TIMES } from "@/utils/constants.js";

export class ConsentService {
  public static async createConsentSession(data: {
    userId: string;
    params: any;
  }) {
    const key = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + EXPIRATION_TIMES.CONSENT_SESSION);

    await ConsentRepo.createConsentSession({
      userId: data.userId,
      params: data.params,
      key,
      expiresAt,
    });

    return key;
  }

  public static async getConsentSession(key: string) {
    const session = await ConsentRepo.getConsentSession(key);

    if (!session) {
      throw ApiError.notFound("CONSENT_SESSION_NOT_FOUND");
    }

    if (session.expiresAt < new Date()) {
      throw ApiError.validationError("CONSENT_SESSION_EXPIRED");
    }

    return session;
  }

  public static async saveConsentDecision(data: {
    userId: string;
    clientId: string;
    scopes: string[];
  }) {
    return ConsentRepo.saveConsentDecision(data);
  }
}
