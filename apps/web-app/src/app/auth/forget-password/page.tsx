"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthAPI } from "@/api/auth.api";

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPassword() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>();

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await AuthAPI.forgotPassword(data);
      setSubmittedEmail(data.email);
    } catch (error) {
      console.error("Forgot password failed", error);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-(--color-page-bg) flex items-center justify-center p-4">
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
            <span className="font-(family-name:--font-body) text-xl font-semibold tracking-tight text-(--color-text-heading)">
              Aurik
            </span>
          </Link>

          <h1 className="text-h1 font-(family-name:--font-display) text-(--color-text-heading) m-0 leading-none">
            Forgot password
          </h1>
          {!submittedEmail && (
            <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60 font-normal">
              We'll send a reset link to your email
            </p>
          )}
        </CardHeader>

        <CardContent className="px-10 pb-8">
          {submittedEmail ? (
            <div className="flex flex-col gap-4 text-center py-2">
              <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60">
                A reset code was sent to{" "}
                <span className="text-(--color-text-heading) font-medium">
                  {submittedEmail}
                </span>
                . Check your inbox and enter the code to reset your password.
              </p>
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/auth/signin"
                  className="text-md text-(--color-lime-dark) hover:opacity-75 font-medium transition-opacity no-underline hover:no-underline"
                >
                  Back to sign in
                </Link>
                <Link
                  href={`/auth/reset-password?email=${encodeURIComponent(submittedEmail)}`}
                  className="h-10 px-6 rounded-lg bg-primary hover:opacity-90 text-primary-foreground dark:bg-lime-400 dark:text-(--color-brand) text-sm font-medium inline-flex items-center transition-opacity no-underline hover:no-underline"
                >
                  Enter code
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm text-(--color-text-body) dark:text-foreground/80"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="h-12 px-4 rounded-lg border border-(--color-border) bg-(--color-input) text-base text-(--color-text-heading) placeholder:text-(--color-text-muted) focus-visible:ring-(--color-input-focus)/40"
                  {...register("email", {
                    required: "Enter your email address",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/auth/signin"
                  className="text-md text-(--color-lime-dark) hover:opacity-75 font-medium transition-opacity no-underline hover:no-underline"
                >
                  Back to sign in
                </Link>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="h-10 px-6 rounded-lg bg-primary hover:opacity-90 text-primary-foreground dark:bg-lime-400 dark:text-(--color-brand) text-sm font-medium transition-opacity"
                >
                  Send code
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
