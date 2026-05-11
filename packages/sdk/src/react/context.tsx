import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AurikUser, UserManager } from "../core/user.js";
import { TokenExchange } from "../core/token.js";
import { PKCE } from "../core/pkce.js";
import { Discovery } from "../core/discovery.js";

interface AurikContextType {
  user: AurikUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signin: () => void;
  signout: () => void;
  getAccessToken: () => Promise<string | null>;
}

const AurikContext = createContext<AurikContextType | undefined>(undefined);

const REFRESH_TOKEN_KEY = "aurik_refresh_token";

export const AurikProvider: React.FC<{
  clientId: string;
  redirectUri: string;
  children: React.ReactNode;
}> = ({ clientId, redirectUri, children }) => {
  const [user, setUser] = useState<AurikUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hydrateUser = useCallback(async (token: string) => {
    try {
      const userData = await UserManager.getUser(token);
      setUser(userData);
    } catch (err) {
      console.error("[Aurik SDK] Failed to hydrate user:", err);
      signout();
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const storedVerifier = sessionStorage.getItem("aurik_code_verifier");

      //REdirected from the auth server with the code
      if (code && storedVerifier) {
        try {
          const tokens = await TokenExchange.exchangeCode({
            clientId,
            code,
            codeVerifier: storedVerifier,
            redirectUri,
          });

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
          sessionStorage.removeItem("aurik_code_verifier");

          if (tokens.refresh_token) {
            localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
          }
          setAccessToken(tokens.access_token);
          await hydrateUser(tokens.access_token);
          setIsLoading(false);
          return;
        } catch (err) {
          console.error("[Aurik SDK] Callback exchange failed:", err);
        }
      }

      //Simple mount without any redirect
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (storedRefreshToken) {
        try {
          const tokens = await TokenExchange.refresh({
            clientId,
            refreshToken: storedRefreshToken,
          });
          setAccessToken(tokens.access_token);
          if (tokens.refresh_token)
            localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
          await hydrateUser(tokens.access_token);
        } catch (err) {
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [clientId, redirectUri, hydrateUser]);

  const signin = async () => {
    const { challenge, verifier } = await PKCE.generate();

    sessionStorage.setItem("aurik_code_verifier", verifier);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid profile email",
      challenge,
      code_challenge_method: "S256",
    });

    window.location.href = `${Discovery.AURIK_DOMAIN}/o/authorize?${params.toString()}`;
  };

  const signout = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    try {
      const promises: Promise<void>[] = [];
      if (refreshToken) {
        promises.push(
          TokenExchange.revoke({
            clientId,
            token: refreshToken,
            tokenTypeHint: "refresh_token",
          }),
        );
      }
      if (accessToken) {
        promises.push(
          TokenExchange.revoke({
            clientId,
            token: accessToken,
            tokenTypeHint: "access_token",
          }),
        );
      }

      await Promise.all(promises).catch(() => {});
    } finally {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setAccessToken(null);
      setUser(null);
    }
  };

  const getAccessToken = async () => {
    return accessToken;
  };

  return (
    <AurikContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        signin,
        signout,
        getAccessToken,
      }}
    >
      {children}
    </AurikContext.Provider>
  );
};

export const useAurik = () => {
  const context = useContext(AurikContext);
  if (!context)
    throw new Error("useAurik must be used within an AurikProvider");
  return context;
};
