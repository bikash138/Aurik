"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type VerifyState = "verifying" | "success" | "error";

// Mock token — replace with real query param when API is ready
const MOCK_TOKEN = "mock-verification-token";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || MOCK_TOKEN;

  const [state, setState] = useState<VerifyState>("verifying");

  useEffect(() => {
    const verify = async () => {
      try {
        // Replace with: await AuthAPI.verifyEmail({ token });
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setState("success");
      } catch (error) {
        console.error("Email verification failed", error);
        setState("error");
      }
    };
    verify();
  }, [token]);

  return (
    <Card className="relative z-10 w-full max-w-sm rounded-3xl border border-(--color-border) shadow-sm bg-card">
      <CardHeader className="flex flex-col items-center justify-center gap-3 pt-10 pb-4 px-10 text-center">
        <Link
          href="/"
          className="flex items-center gap-1.5 no-underline hover:no-underline"
        >
          <Image
            src="/logo.svg"
            alt="Aurik"
            width={28}
            height={28}
            className="dark:hidden"
          />
          <Image
            src="/logo_white.svg"
            alt="Aurik"
            width={28}
            height={28}
            className="hidden dark:block"
          />
          <span className="font-(family-name:--font-body) text-2xl font-semibold tracking-tight text-(--color-text-heading)">
            Aurik
          </span>
        </Link>

        <h1 className="text-h1 font-(family-name:--font-display) text-(--color-text-heading) m-0 leading-none">
          {state === "verifying" && "Verifying…"}
          {state === "success" && "Email verified!"}
          {state === "error" && "Link expired"}
        </h1>

        <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60 font-normal">
          {state === "verifying" && "Checking your verification link"}
          {state === "success" && "Your email has been confirmed"}
          {state === "error" && "This link is invalid or has already been used"}
        </p>
      </CardHeader>

      <CardContent className="px-10 pb-8">
        {/* Verifying skeleton */}
        {state === "verifying" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-12 h-12 rounded-full bg-(--color-border) animate-pulse" />
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="h-3 w-48 rounded bg-(--color-border) animate-pulse" />
              <div className="h-3 w-36 rounded bg-(--color-border) animate-pulse" />
            </div>
            <div className="h-10 w-36 rounded-lg bg-(--color-border) animate-pulse mt-2" />
          </div>
        )}

        {/* Success */}
        {state === "success" && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-(--color-lime-dark)"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="font-(family-name:--font-body) text-md text-(--color-text-body) dark:text-foreground/60">
              You can now sign in to your account.
            </p>
            <Link
              href="/auth/signin"
              className="h-10 px-6 rounded-lg bg-primary hover:opacity-90 text-primary-foreground dark:bg-lime-400 dark:text-(--color-brand) text-sm font-medium inline-flex items-center transition-opacity no-underline hover:no-underline"
            >
              Sign in
            </Link>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60">
              Request a new verification email from your account settings.
            </p>
            <Link
              href="/auth/signin"
              className="text-sm text-(--color-lime-dark) hover:opacity-75 font-medium transition-opacity no-underline hover:no-underline"
            >
              Back to sign in
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmail() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-(--color-page-bg) flex items-center justify-center p-4">
      <Suspense>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
