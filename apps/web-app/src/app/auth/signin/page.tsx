import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninBodySchema, type SigninRequest } from "@aurik/zod/auth";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthAPI } from "@/api/auth.api";
import { useState } from "react";

export default function Signin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninRequest>({
    resolver: zodResolver(SigninBodySchema),
  });

  const onSubmit = async (data: SigninRequest) => {
    setIsLoading(true);
    try {
      const result = await AuthAPI.signin(data);
      toast.success(result.message);
      console.log("Logged in successfully!", result);
      router.push("/profile");
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message || "Failed to sign in";
      toast.error(message);
    } finally {
      setIsLoading(false);
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
            <span className="font-(family-name:--font-body) text-2xl font-semibold tracking-tight text-(--color-text-heading)">
              Aurik
            </span>
          </Link>

          <h1 className="text-h1 font-(family-name:--font-display) text-(--color-text-heading) m-0 leading-none">
            Sign in
          </h1>
          <p className="font-(family-name:--font-body) text-sm text-(--color-text-body) dark:text-foreground/60 font-normal">
            Use your Aurik Account
          </p>
        </CardHeader>

        <CardContent className="px-10 pb-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-sm text-(--color-text-body) dark:text-foreground/80"
              >
                Email or phone
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="Email"
                className="h-12 px-4 rounded-lg border border-(--color-border) bg-(--color-input) text-base text-(--color-text-heading) placeholder:text-(--color-text-muted) focus-visible:ring-(--color-input-focus)/40"
                {...register("email")}
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
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/auth/signup"
                className="text-md text-(--color-lime-dark) hover:opacity-75 font-medium transition-opacity no-underline hover:no-underline"
              >
                Create account
              </Link>
              <Button
                type="submit"
                loading={isLoading}
                className="h-10 px-6 rounded-lg bg-primary hover:opacity-90 text-primary-foreground dark:bg-lime-400 dark:text-(--color-brand) text-sm font-medium transition-opacity"
              >
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
