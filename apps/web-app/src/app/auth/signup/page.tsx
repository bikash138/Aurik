"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthAPI } from "@/api/auth.api";

import { useState } from "react";

type SignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default function Signup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const result = await AuthAPI.signup(data);
      toast.success(result.message || "Account created successfully!");
      console.log("Logged in successfully!", result);
      router.push("/auth/signin");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to sign up";
      toast.error(message);
      console.error("Failed to sign in", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-(--color-page-bg) flex items-center justify-center p-4">
      <Card className="relative z-10 w-full max-w-3xl rounded-3xl border border-(--color-border) shadow-sm flex flex-col sm:flex-row overflow-hidden">
        {/* Left panel — branding (hidden on small screens) */}
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

            <div className="flex flex-col gap-2">
              <h1 className="font-(family-name:--font-display) text-h1 text-(--color-text-heading) m-0 leading-tight">
                Sign up
              </h1>
              <p className="font-(family-name:--font-body) text-sm text-(--color-text-body)">
                Create your Aurik Account
              </p>
            </div>
          </div>

          {/* Italic quote */}
          <div className="relative z-10 py-4 flex flex-col gap-2">
            <p className="font-(family-name:--font-fraunces) text-xl italic text-(--color-lime-dark) leading-snug">
              "In God we trust;
              <br />
              all others we verify."
            </p>
            <span className="font-(family-name:--font-body) text-xs text-(--color-text-muted)">
              — Anonymous
            </span>
          </div>

          {/* Bottom badge */}
          <div className="relative z-10 flex flex-col gap-1.5 mt-6">
            <div className="inline-flex items-center gap-1.5 text-eyebrow text-(--color-lime-dark) tracking-widest">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-lime-600" />
              </span>
              OAUTH 2.0 · OIDC · SSO
            </div>
            <p className="font-(family-name:--font-body) text-xs text-(--color-text-muted)">
              Identity that just works
            </p>
          </div>
        </div>

        {/* Mobile branding — shown only on small screens */}
        <div className="flex sm:hidden flex-col items-center gap-3 pt-10 pb-4 px-10 text-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 no-underline hover:no-underline"
          >
            <Image
              src="/logo.svg"
              alt="Aurik"
              width={26}
              height={26}
              className="dark:hidden"
            />
            <Image
              src="/logo_white.svg"
              alt="Aurik"
              width={26}
              height={26}
              className="hidden dark:block"
            />
            <span className="font-(family-name:--font-body) text-lg font-semibold tracking-tight text-(--color-text-heading)">
              Aurik
            </span>
          </Link>
          <h1 className="font-(family-name:--font-display) text-h1 text-(--color-text-heading) m-0 leading-none">
            Sign up
          </h1>
          <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60">
            Create your Aurik Account
          </p>
        </div>

        {/* Right pane — form */}
        <CardContent className="flex-1 px-10 pt-8 pb-8 relative overflow-hidden">
          {/* Background logo watermark — right aligned, behind form */}
          <img
            src="/logo_transparent_revert.svg"
            alt=""
            aria-hidden="true"
            className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 opacity-[0.03] pointer-events-none select-none"
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative z-10 flex flex-col gap-5"
          >
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <Label
                  htmlFor="firstName"
                  className="text-sm text-(--color-text-body) dark:text-foreground/80"
                >
                  First name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  className="h-12 px-4 rounded-lg border border-(--color-border) bg-(--color-input) text-base text-(--color-text-heading) placeholder:text-(--color-text-muted) focus-visible:ring-(--color-input-focus)/40"
                  {...register("firstName", { required: "Required" })}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <Label
                  htmlFor="lastName"
                  className="text-sm text-(--color-text-body) dark:text-foreground/80"
                >
                  Last name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  className="h-12 px-4 rounded-lg border border-(--color-border) bg-(--color-input) text-base text-(--color-text-heading) placeholder:text-(--color-text-muted) focus-visible:ring-(--color-input-focus)/40"
                  {...register("lastName", { required: "Required" })}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-sm text-(--color-text-body) dark:text-foreground/80"
              >
                Email
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="Email"
                className="h-12 px-4 rounded-lg border border-(--color-border) bg-(--color-input) text-base text-(--color-text-heading) placeholder:text-(--color-text-muted) focus-visible:ring-(--color-input-focus)/40"
                {...register("email", {
                  required: "Enter an email address",
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

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="password"
                className="text-sm text-(--color-text-body) dark:text-foreground/80"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="h-12 px-4 rounded-lg border border-(--color-border) bg-(--color-input) text-base text-(--color-text-heading) placeholder:text-(--color-text-muted) focus-visible:ring-(--color-input-focus)/40"
                {...register("password", {
                  required: "Enter a password",
                  minLength: { value: 8, message: "Use 8 characters or more" },
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/auth/signin"
                className="text-md text-(--color-lime-dark) hover:opacity-75 font-medium transition-opacity no-underline hover:no-underline"
              >
                Sign in instead
              </Link>
              <Button
                type="submit"
                loading={isLoading}
                className="h-10 px-6 rounded-lg bg-primary hover:opacity-90 text-primary-foreground dark:bg-lime-400 dark:text-(--color-brand) text-sm font-medium transition-opacity"
              >
                Next
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
