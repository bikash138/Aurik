"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { apiClient } from "@/api/api"; // restore when backend is ready

type ConsentSession = {
  clientName: string;
  scopes: string[];
  termsUrl?: string;
  privacyUrl?: string;
  params: {
    client_id: string;
    redirect_uri: string;
    scope: string;
    state?: string;
    response_type: string;
  };
};

const SCOPE_META: Record<string, { label: string; description: string }> = {
  openid: {
    label: "Basic identity",
    description: "Know who you are via a unique identifier",
  },
  profile: {
    label: "Profile information",
    description: "See your name, picture, and other profile details",
  },
  email: {
    label: "Email address",
    description: "See your primary email address",
  },
  address: {
    label: "Address",
    description: "See your physical address",
  },
  phone: {
    label: "Phone number",
    description: "See your phone number",
  },
  offline_access: {
    label: "Stay signed in",
    description: "Keep access even when you're not actively using the app",
  },
};

function scopeLabel(scope: string) {
  return (
    SCOPE_META[scope] ?? { label: scope, description: `Access to ${scope}` }
  );
}

function ScopeIcon() {
  return (
    <svg
      className="w-4 h-4 text-(--color-lime-dark) mt-0.5 shrink-0"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const MOCK_SESSION: ConsentSession = {
  clientName: "Acme Dashboard",
  scopes: ["openid", "profile", "email", "offline_access"],
  termsUrl: "https://acme.example.com/terms",
  privacyUrl: "https://acme.example.com/privacy",
  params: {
    client_id: "acme-dashboard",
    redirect_uri: "https://acme.example.com/callback",
    scope: "openid profile email offline_access",
    state: "mock-state-xyz",
    response_type: "code",
  },
};

export default function ConsentPage() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");

  const [session, setSession] = useState<ConsentSession | null>(null);
  const [error] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Mock — remove and restore apiClient call when backend is ready
    const load = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSession(MOCK_SESSION);
      setLoading(false);
    };
    load();
  }, [key]);

  async function handleAction(action: "approved" | "denied") {
    if (!session) return;
    setSubmitting(true);
    // Mock — replace with real apiClient.post call when backend is ready
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Consent action:", action);
    setSubmitting(false);
  }

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
              <svg
                className="w-5 h-5 text-destructive"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.25a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5zm.75 7.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
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
        {/* Left panel */}
        <div className="hidden sm:flex flex-col justify-between w-72 shrink-0 bg-secondary px-8 pt-8 pb-8 relative overflow-hidden mt-3 mb-3 rounded-r-2xl">
          <div className="relative z-10 flex flex-col gap-6">
            <Link
              href="/"
              className="flex items-center gap-1.5 no-underline hover:no-underline"
            >
              <Image
                src="/logo.svg"
                alt="Aurik"
                width={24}
                height={24}
                className="dark:hidden"
              />
              <Image
                src="/logo_white.svg"
                alt="Aurik"
                width={24}
                height={24}
                className="hidden dark:block"
              />
              <span className="font-(family-name:--font-body) text-base font-semibold tracking-tight text-(--color-text-heading)">
                Aurik
              </span>
            </Link>

            <div className="flex flex-col gap-3">
              {/* App avatar */}
              <div className="w-12 h-12 rounded-2xl bg-(--color-brand) flex items-center justify-center">
                <span className="font-(family-name:--font-body) text-(--color-text-on-brand) font-semibold text-lg">
                  {session.clientName.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h1 className="font-(family-name:--font-display) text-h1 text-(--color-text-heading) m-0 leading-tight">
                  Authorize
                </h1>
                <p className="font-(family-name:--font-body) text-sm text-(--color-text-body)">
                  <span className="font-semibold text-(--color-text-heading)">
                    {session.clientName}
                  </span>{" "}
                  wants access to your Aurik account.
                </p>
              </div>
            </div>

            <p className="font-(family-name:--font-body) text-xs text-(--color-text-muted) leading-relaxed">
              Only grant access to apps you trust. You can revoke access any
              time from your account settings.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 text-eyebrow text-(--color-lime-dark) tracking-widest">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-lime-600" />
              </span>
              OAUTH 2.0 · OIDC
            </div>
            {(session.termsUrl || session.privacyUrl) && (
              <div className="flex items-center gap-2">
                {session.termsUrl && (
                  <Link
                    href={session.termsUrl}
                    target="_blank"
                    className="font-(family-name:--font-body) text-xs text-(--color-text-muted) hover:text-(--color-text-body) transition-colors no-underline hover:no-underline"
                  >
                    Terms
                  </Link>
                )}
                {session.termsUrl && session.privacyUrl && (
                  <span className="text-(--color-text-muted) text-xs">·</span>
                )}
                {session.privacyUrl && (
                  <Link
                    href={session.privacyUrl}
                    target="_blank"
                    className="font-(family-name:--font-body) text-xs text-(--color-text-muted) hover:text-(--color-text-body) transition-colors no-underline hover:no-underline"
                  >
                    Privacy Policy
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile header */}
        <div className="flex sm:hidden flex-col items-center gap-3 pt-10 pb-4 px-10 text-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 no-underline hover:no-underline"
          >
            <Image
              src="/logo.svg"
              alt="Aurik"
              width={24}
              height={24}
              className="dark:hidden"
            />
            <Image
              src="/logo_white.svg"
              alt="Aurik"
              width={24}
              height={24}
              className="hidden dark:block"
            />
            <span className="font-(family-name:--font-body) text-base font-semibold tracking-tight text-(--color-text-heading)">
              Aurik
            </span>
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-(--color-brand) flex items-center justify-center">
            <span className="font-(family-name:--font-body) text-(--color-text-on-brand) font-semibold text-lg">
              {session.clientName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="font-(family-name:--font-display) text-h1 text-(--color-text-heading) m-0 leading-none">
            Authorize
          </h1>
          <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60">
            <span className="font-semibold text-(--color-text-heading)">
              {session.clientName}
            </span>{" "}
            wants access to your account.
          </p>
        </div>

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

              <ul className="flex flex-col gap-3">
                {requestedScopes.map((scope) => {
                  const meta = scopeLabel(scope);
                  return (
                    <li key={scope} className="flex items-start gap-3">
                      <ScopeIcon />
                      <div>
                        <p className="font-(family-name:--font-body) text-sm font-medium text-(--color-text-heading) leading-tight">
                          {meta.label}
                        </p>
                        <p className="font-(family-name:--font-body) text-xs text-(--color-text-muted) mt-0.5">
                          {meta.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
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
                // loading={submitting}
                className="h-10 px-6 rounded-lg text-sm font-medium text-(--color-text-muted) hover:text-(--color-text-body) hover:bg-secondary transition-colors"
              >
                Deny
              </Button>
              <Button
                onClick={() => handleAction("approved")}
                // loading={submitting}
                className="h-10 px-6 rounded-lg bg-primary hover:opacity-90 text-primary-foreground dark:bg-lime-400 dark:text-(--color-brand) text-sm font-medium transition-opacity"
              >
                Allow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
