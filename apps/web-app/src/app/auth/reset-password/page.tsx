"use client";

import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthAPI } from "@/api/auth.api";

type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

const MOCK_EMAIL = "user@example.com";
const MOCK_CODE = "123456";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || MOCK_EMAIL;
  const codeFromQuery = searchParams.get("code") || MOCK_CODE;

  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    // Mock verification — always resolves ok with mock data
    const verify = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setVerified(true);
      setVerifying(false);
    };
    verify();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>();

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await AuthAPI.resetPassword({
        email: emailFromQuery,
        code: codeFromQuery,
        newPassword: data.newPassword,
      });
      setReset(true);
    } catch (error) {
      console.error("Password reset failed", error);
    }
  };

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
          {reset ? "All done!" : "Reset password"}
        </h1>
        {!reset && (
          <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60 font-normal">
            {verifying
              ? "Verifying your link…"
              : verified
                ? "Choose a new password"
                : "This link is invalid or expired"}
          </p>
        )}
      </CardHeader>

      <CardContent className="px-10 pb-8">
        {/* Verifying skeleton */}
        {verifying && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-24 rounded bg-(--color-border) animate-pulse" />
              <div className="h-12 w-full rounded-lg bg-(--color-border) animate-pulse" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-32 rounded bg-(--color-border) animate-pulse" />
              <div className="h-12 w-full rounded-lg bg-(--color-border) animate-pulse" />
            </div>
            <div className="flex justify-end pt-2">
              <div className="h-10 w-36 rounded-lg bg-(--color-border) animate-pulse" />
            </div>
          </div>
        )}

        {/* Invalid link */}
        {!verifying && !verified && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60">
              Please request a new reset link.
            </p>
            <Link
              href="/auth/forget-password"
              className="h-10 px-6 rounded-lg bg-primary hover:opacity-90 text-primary-foreground dark:bg-lime-400 dark:text-(--color-brand) text-sm font-medium inline-flex items-center transition-opacity no-underline hover:no-underline"
            >
              Request new link
            </Link>
          </div>
        )}

        {/* Success */}
        {!verifying && verified && reset && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60">
              You can now sign in with your new password.
            </p>
            <Link
              href="/auth/signin"
              className="h-10 px-6 rounded-lg bg-primary hover:opacity-90 text-primary-foreground dark:bg-lime-400 dark:text-(--color-brand) text-sm font-medium inline-flex items-center transition-opacity no-underline hover:no-underline"
            >
              Sign in
            </Link>
          </div>
        )}

        {/* Password form */}
        {!verifying && verified && !reset && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="newPassword"
                className="text-sm text-(--color-text-body) dark:text-foreground/80"
              >
                New password
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="New password"
                className="h-12 px-4 rounded-lg border border-(--color-border) bg-(--color-input) text-base text-(--color-text-heading) placeholder:text-(--color-text-muted) focus-visible:ring-(--color-input-focus)/40"
                {...register("newPassword", {
                  required: "Enter a new password",
                  minLength: { value: 8, message: "Use 8 characters or more" },
                })}
              />
              {errors.newPassword && (
                <p className="text-sm text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-sm text-(--color-text-body) dark:text-foreground/80"
              >
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className="h-12 px-4 rounded-lg border border-(--color-border) bg-(--color-input) text-base text-(--color-text-heading) placeholder:text-(--color-text-muted) focus-visible:ring-(--color-input-focus)/40"
                {...register("confirmPassword", {
                  required: "Confirm your new password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/auth/forget-password"
                className="text-sm text-(--color-lime-dark) hover:opacity-75 font-medium transition-opacity no-underline hover:no-underline"
              >
                Resend code
              </Link>
              <Button
                type="submit"
                loading={isSubmitting}
                className="h-10 px-6 rounded-lg bg-primary hover:opacity-90 text-primary-foreground dark:bg-lime-400 dark:text-(--color-brand) text-sm font-medium transition-opacity"
              >
                Reset password
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPassword() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-(--color-page-bg) flex items-center justify-center p-4">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
