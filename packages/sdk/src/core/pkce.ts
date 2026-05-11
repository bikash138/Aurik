function generateRandomString(length: number): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((x) => charset[x % charset.length])
    .join("");
}

async function sha256Base64Url(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64 = btoa(String.fromCharCode(...hashArray));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export async function generatePKCE(): Promise<{
  verifier: string;
  challenge: string;
}> {
  const verifier = generateRandomString(64);
  const challenge = await sha256Base64Url(verifier);
  return { verifier, challenge };
}
