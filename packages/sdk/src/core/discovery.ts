export interface DiscoveryDocument {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  response_types_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  scopes_supported: string[];
  token_endpoint_auth_methods_supported: string[];
  claims_supported: string[];
}

export class Discovery {
  public static readonly AURIK_DOMAIN = "http://localhost:3001";
  private static cachedDiscovery: DiscoveryDocument | null = null;
  public static async get(): Promise<DiscoveryDocument> {
    if (this.cachedDiscovery) {
      return this.cachedDiscovery;
    }

    const url = `${this.AURIK_DOMAIN}/.well-known/openid-configuration`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(
        `[Aurik SDK] Failed to fetch discovery document from ${url}. ` +
          `Status: ${res.status}`,
      );
    }

    this.cachedDiscovery = await res.json();

    if (!this.cachedDiscovery) {
      throw new Error("[Aurik SDK] Discovery document is empty or invalid.");
    }

    return this.cachedDiscovery;
  }
}
