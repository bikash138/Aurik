"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthAPI } from "@/api/auth.api";
import { toast } from "sonner";

const ResetPasswordFormSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      console.error("Missing token in URL");
      return;
    }

    try {
      const result = await AuthAPI.resetPassword({
        token,
        newPassword: data.newPassword,
      });
      toast.success(result.message);
      setIsSuccess(true);
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to reset password";
      toast.error(message);
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
          {isSuccess ? "All done!" : "Reset password"}
        </h1>
        {!isSuccess && (
          <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60 font-normal">
            {!token
              ? "This link is invalid or expired"
              : "Choose a new password"}
          </p>
        )}
      </CardHeader>

      <CardContent className="px-10 pb-8">
        {/* Invalid link state */}
        {!token && (
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

        {/* Success state */}
        {isSuccess && (
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
        {!isSuccess && token && (
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
                {...register("newPassword")}
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
                {...register("confirmPassword")}
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
