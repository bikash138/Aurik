"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { useConsent } from "@/hooks/use-consent";
import { ConsentHeader } from "@/components/consent/ConsentHeader";
import { ScopeList } from "@/components/consent/ScopeList";

export default function ConsentPage() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");

  const {
    session,
    error,
    loading,
    submitting,
    showWarning,
    setShowWarning,
    handleAction,
  } = useConsent(key);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-(--color-page-bg) flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-(--color-lime-dark) border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-(--color-page-bg) flex items-center justify-center p-4">
        <Card className="w-full max-w-sm rounded-3xl border border-(--color-border) shadow-sm bg-card">
          <CardContent className="px-10 py-12 flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-(family-name:--font-body) text-sm font-medium text-(--color-text-heading)">
                {error ?? "Unknown error"}
              </p>
              <p className="font-(family-name:--font-body) text-xs text-(--color-text-muted)">
                Please close this window and try again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const requestedScopes = session.params.scope.split(" ");

  return (
    <div className="fixed inset-0 overflow-hidden bg-(--color-page-bg) flex items-center justify-center p-4">
      {/* Lime glow backdrop */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
        <div className="w-[500px] h-[400px] rounded-full bg-lime-300/20 blur-[120px]" />
      </div>

      <Card className="relative z-10 w-full max-w-3xl rounded-3xl border border-(--color-border) shadow-sm flex flex-col sm:flex-row overflow-hidden">
        <ConsentHeader
          clientName={session.clientName}
          logoUrl={session.logoUrl}
          clientUri={session.clientUri}
          policyUri={session.policyUri}
          tosUri={session.tosUri}
        />

        {/* Right panel */}
        <CardContent className="flex-1 px-10 pt-8 pb-8 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60 mb-3">
                This will allow{" "}
                <span className="font-semibold text-(--color-text-heading)">
                  {session.clientName}
                </span>{" "}
                to:
              </p>

              <ScopeList scopes={requestedScopes} />
            </div>

            <div className="border-t border-(--color-border) pt-4">
              <p className="font-(family-name:--font-body) text-xs text-(--color-text-muted) leading-relaxed">
                By clicking{" "}
                <span className="font-medium text-(--color-text-body)">
                  Allow
                </span>
                , you allow this app to use your information in accordance with
                its privacy policy. You can remove access at any time.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => handleAction("denied")}
                className="h-10 px-6 rounded-lg text-sm font-medium text-(--color-text-muted) hover:text-(--color-text-body) hover:bg-secondary transition-colors"
              >
                Deny
              </Button>
              <Button
                onClick={() => handleAction("approved")}
                className="h-10 px-6 rounded-lg bg-primary hover:opacity-90 text-primary-foreground dark:bg-lime-400 dark:text-(--color-brand) text-sm font-medium transition-opacity"
              >
                Allow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-sm rounded-3xl border border-(--color-border) shadow-2xl bg-card overflow-hidden">
            <div className="px-8 pt-8 pb-4 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-(--color-text-heading)">
                  Security Warning
                </h3>
                <p className="text-sm text-(--color-text-body)">
                  This application has not provided a Privacy Policy or Terms of
                  Service link. Granting access may pose a risk to your data.
                </p>
                <p className="text-xs text-(--color-text-muted) italic">
                  Continue at your own risk.
                </p>
              </div>
            </div>
            <div className="p-6 bg-secondary/50 flex flex-col gap-2">
              <Button
                onClick={() => handleAction("approved")}
                loading={submitting}
                className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
              >
                Allow Anyway
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowWarning(false)}
                className="w-full h-11 rounded-xl text-sm font-medium text-(--color-text-muted) hover:text-(--color-text-body)"
              >
                Go Back
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

