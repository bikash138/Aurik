export class PKCE {
  public static async generate(): Promise<{
    verifier: string;
    challenge: string;
  }> {
    const verifier = this.generateRandomString(64);
    const challenge = await this.sha256Base64Url(verifier);
    return { verifier, challenge };
  }

  private static generateRandomString(length: number): string {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map((x) => charset[x % charset.length])
      .join("");
  }

  private static async sha256Base64Url(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const base64 = btoa(String.fromCharCode(...hashArray));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
}
