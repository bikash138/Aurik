export interface DiscoveryDocument {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  end_session_endpoint: string;
  scopes_supported: string[];
  response_types_supported: string[];
  grant_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  code_challenge_methods_supported: string[];
}

const AURIK_DOMAIN = "https://aurik.bikashshaw.in";

let cachedDiscovery: DiscoveryDocument | null = null;

export async function fetchDiscovery(
  domain: string,
): Promise<DiscoveryDocument> {
  if (cachedDiscovery) {
    return cachedDiscovery;
  }

  const url = `${AURIK_DOMAIN}/.well-known/openid-configuration`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `[Aurik SDK] Failed to fetch discovery document from ${url}. ` +
        `Status: ${res.status}`,
    );
  }

  cachedDiscovery = await res.json();
  return cachedDiscovery;
}

export { AURIK_DOMAIN };
