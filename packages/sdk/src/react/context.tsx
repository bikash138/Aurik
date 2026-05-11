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
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (storedRefreshToken) {
        try {
          const tokens = await TokenExchange.refresh({
            clientId,
            refreshToken: storedRefreshToken,
          });

          setAccessToken(tokens.access_token);
          if (tokens.refresh_token) {
            localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
          }
          await hydrateUser(tokens.access_token);
        } catch (err) {
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [clientId, hydrateUser]);

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

  const signout = () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
    window.location.href = `${Discovery.AURIK_DOMAIN}/o/logout?client_id=${clientId}`;
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
