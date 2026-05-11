import { useEffect, useState } from "react";
import { AuthAPI } from "@/api/auth.api";
import { toast } from "sonner";

export type ConsentSession = {
  clientName: string;
  logoUrl?: string;
  clientUri?: string;
  policyUri?: string;
  tosUri?: string;
  scopes: string[];
  params: {
    client_id: string;
    redirect_uri: string;
    scope: string;
    state?: string;
    response_type: string;
  };
};

export function useConsent(key: string | null) {
  const [session, setSession] = useState<ConsentSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!key) {
        setError("Missing consent key");
        setLoading(false);
        return;
      }

      try {
        const data = await AuthAPI.getConsentSession(key);
        setSession(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to load consent session",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [key]);

  async function handleAction(action: "approved" | "denied") {
    if (!session || !key) return;

    if (action === "approved" && (!session.policyUri || !session.tosUri)) {
      if (!showWarning) {
        setShowWarning(true);
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await AuthAPI.submitConsent({
        key,
        action,
      });

      if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit consent");
      setSubmitting(false);
    }
  }

  return {
    session,
    error,
    loading,
    submitting,
    showWarning,
    setShowWarning,
    handleAction,
  };
}
