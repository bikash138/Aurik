import crypto from "node:crypto";
import { ApiError } from "@/core/errors/api.error.js";
import { TokenRepo } from "./token.repo.js";
import { importPKCS8, SignJWT } from "jose";
import { env } from "@/config/env.config.js";
import bcrypt from "bcryptjs";

export class TokenService {
  public static async validateAuthorizationCode(
    code: string,
    clientId: string,
    redirectUri: string,
  ) {
    const authCode = await TokenRepo.getAuthorizationCode(code);

    if (!authCode) throw ApiError.validationError("INVALID_CODE");
    if (authCode.used) throw ApiError.validationError("CODE_ALREADY_USED");
    if (authCode.expiresAt < new Date())
      throw ApiError.validationError("CODE_EXPIRED");
    if (authCode.clientId !== clientId)
      throw ApiError.validationError("CLIENT_MISMATCH");
    if (authCode.redirectUri !== redirectUri)
      throw ApiError.validationError("REDIRECT_URI_MISMATCH");

    await TokenRepo.updateAuthorizationCode(authCode.id, { used: true });

    return authCode;
  }

  public static async verifyPKCE(
    codeVerifier: string,
    storedChallenge: string,
  ): Promise<boolean> {
    const hash = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");

    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(storedChallenge),
    );
  }

  public static async verifyClientSecret(
    clientSecret: string,
    storedHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(clientSecret, storedHash);
  }

  public static async issueTokens(
    userId: string,
    clientId: string,
    scopes: string[],
    client: { accessTokenTTL: number; refreshTokenTTL: number },
  ) {
    const signingKey = await TokenRepo.getActiveSigningKey();

    if (!signingKey) throw ApiError.notFound("No active signing key found");

    const privateKey = await importPKCS8(signingKey.privateKey, "RS256");

    const accessTokenValue = await new SignJWT({
      sub: userId,
      scope: scopes.join(" "),
      iss: env.AUTH_SERVER_BASE_URL,
      aud: clientId,
      jti: crypto.randomUUID(),
    })
      .setProtectedHeader({ alg: "RS256", kid: signingKey.kid })
      .setIssuedAt()
      .setExpirationTime(client.accessTokenTTL)
      .sign(privateKey);

    const user = await TokenRepo.getUserById(userId);
    if (!user) throw ApiError.notFound("USER_NOT_FOUND");

    const idTokenClaims: Record<string, any> = {
      sub: userId,
      iss: env.AUTH_SERVER_BASE_URL,
      aud: clientId,
    };

    if (scopes.includes("email")) {
      idTokenClaims.email = user.email;
      idTokenClaims.email_verified = user.isEmailVerified;
    }

    if (scopes.includes("profile")) {
      idTokenClaims.given_name = user.firstName;
      idTokenClaims.family_name = user.lastName;
      idTokenClaims.picture = user.profileImageUrl;
    }

    const idTokenValue = await new SignJWT(idTokenClaims)
      .setProtectedHeader({ alg: "RS256", kid: signingKey.kid })
      .setIssuedAt()
      .setExpirationTime(client.accessTokenTTL)
      .sign(privateKey);

    const refreshTokenValue = crypto.randomBytes(32).toString("hex");

    await TokenRepo.saveTokens(
      {
        token: accessTokenValue,
        userId,
        clientId,
        scopes,
        revoked: false,
        expiresAt: new Date(Date.now() + client.accessTokenTTL * 1000),
      },
      {
        token: refreshTokenValue,
        userId,
        clientId,
        revoked: false,
        expiresAt: new Date(Date.now() + client.refreshTokenTTL * 1000),
      },
    );

    return {
      access_token: accessTokenValue,
      id_token: idTokenValue,
      refresh_token: refreshTokenValue,
      token_type: "Bearer",
      expires_in: client.accessTokenTTL,
      scope: scopes.join(" "),
    };
  }

  public static async rotateRefreshToken(
    refreshToken: string,
    clientId: string,
  ) {
    const existingToken =
      await TokenRepo.getRefreshTokenWithClient(refreshToken);

    if (!existingToken) throw ApiError.validationError("INVALID_REFRESH_TOKEN");
    if (existingToken.expiresAt < new Date())
      throw ApiError.validationError("REFRESH_TOKEN_EXPIRED");

    if (existingToken.revoked) {
      await TokenRepo.revokeAllUserTokens(
        existingToken.userId,
        existingToken.clientId,
      );
      await TokenRepo.createAuditLog({
        action: "security.refresh_token.reuse_detected",
        userId: existingToken.userId,
        clientId: existingToken.clientId,
        metadata: { refreshToken },
      });
      throw ApiError.validationError("REFRESH_TOKEN_REUSE_DETECTED");
    }

    if (existingToken.clientId !== clientId)
      throw ApiError.validationError("CLIENT_MISMATCH");

    await TokenRepo.updateRefreshToken(existingToken.id, { revoked: true });

    const signingKey = await TokenRepo.getActiveSigningKey();

    if (!signingKey) throw ApiError.notFound("No active signing key found");

    const privateKey = await importPKCS8(signingKey.privateKey, "RS256");

    const newAccessTokenValue = await new SignJWT({
      sub: existingToken.userId,
      scope: existingToken.client.scopes.join(" "),
      iss: env.AUTH_SERVER_BASE_URL,
      aud: clientId,
      jti: crypto.randomUUID(),
    })
      .setProtectedHeader({ alg: "RS256", kid: signingKey.kid })
      .setIssuedAt()
      .setExpirationTime(existingToken.client.accessTokenTTL)
      .sign(privateKey);

    const newRefreshTokenValue = crypto.randomBytes(32).toString("hex");

    await TokenRepo.saveTokens(
      {
        token: newAccessTokenValue,
        userId: existingToken.userId,
        clientId,
        scopes: existingToken.client.scopes,
        revoked: false,
        expiresAt: new Date(
          Date.now() + existingToken.client.accessTokenTTL * 1000,
        ),
      },
      {
        token: newRefreshTokenValue,
        userId: existingToken.userId,
        clientId,
        revoked: false,
        expiresAt: new Date(
          Date.now() + existingToken.client.refreshTokenTTL * 1000,
        ),
        previousTokenId: existingToken.id,
      },
    );

    await TokenRepo.createAuditLog({
      action: "oauth.token.refreshed",
      userId: existingToken.userId,
      clientId,
    });

    return {
      access_token: newAccessTokenValue,
      refresh_token: newRefreshTokenValue,
      token_type: "Bearer",
      expires_in: existingToken.client.accessTokenTTL,
      scope: existingToken.client.scopes.join(" "),
    };
  }
}
