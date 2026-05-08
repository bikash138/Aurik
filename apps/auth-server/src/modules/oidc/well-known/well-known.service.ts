import { importSPKI, exportJWK } from "jose";
import { WellKnownRepo } from "./well-known.repo.js";

export class WellKnownService {
  public static async getJWKS() {
    const keys = await WellKnownRepo.getActiveSigningKeys();

    const jwkKeys = await Promise.all(
      keys.map(async (key) => {
        const publicKey = await importSPKI(key.publicKey, key.algorithm);
        const jwk = await exportJWK(publicKey);

        return {
          ...jwk,
          kid: key.kid,
          use: "sig",
          alg: key.algorithm,
        };
      }),
    );

    return { keys: jwkKeys };
  }
}
