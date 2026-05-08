"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Code2, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthAPI } from "@/api/auth.api";
import { useProfile } from "@/app/hooks/use-profile";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileDialog() {
  const router = useRouter();
  const { data: user, isLoading } = useProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Aurik User"
    : "Aurik User";

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      const result = await AuthAPI.signout();
      toast.success(result?.message || "Signed out successfully");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to sign out";
      toast.error(message);
    } finally {
      setIsLoggingOut(false);
    }
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isLoading ? (
          <Skeleton className="bg-(--color-border) w-9 h-9 rounded-full" />
        ) : (
          <button className="w-9 h-9 rounded-full bg-(--color-brand) flex items-center justify-center text-(--color-lime) font-semibold text-sm hover:opacity-90 transition-opacity outline-none">
            {fullName.charAt(0).toUpperCase()}
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-(--color-page-bg-deep) border-(--color-border) p-0 overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-5">
          {isLoading ? (
            <Skeleton className="bg-(--color-border) w-12 h-12 rounded-full shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-(--color-brand) flex items-center justify-center text-(--color-lime) font-bold text-xl shrink-0">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex flex-col">
            {isLoading ? (
              <>
                <Skeleton className="bg-(--color-border) h-5 w-28 rounded" />
                <Skeleton className="bg-(--color-border) h-4 w-36 rounded mt-0.5" />
              </>
            ) : (
              <>
                <p className="font-medium text-heading text-sm truncate">{fullName}</p>
                <p className="text-xs text-body-color mt-0.5 truncate">{user?.email}</p>
              </>
            )}
          </div>
        </div>

        <DropdownMenuSeparator className="bg-(--color-border)" />

        <div className="px-4 py-2 flex items-center justify-between">
          <p className="text-xs text-body-color">Theme</p>
          <ThemeToggle />
        </div>

        <DropdownMenuSeparator className="bg-(--color-border)" />

        <div className="p-1.5">
          <button
            onClick={() => router.push("/developer")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-(--color-lime-tint) transition-colors text-left"
          >
            <Code2 className="w-4 h-4 text-(--color-text-muted) shrink-0" />
            <div>
              <p className="text-sm font-medium text-heading leading-none">
                Developer Panel
              </p>
              <p className="text-xs text-body-color mt-0.5">
                API keys, logs & tools
              </p>
            </div>
          </button>

          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-destructive/10 transition-colors text-left group mt-0.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin shrink-0 mx-auto" />
            ) : (
              <>
                <LogOut className="w-4 h-4 text-(--color-text-muted) group-hover:text-destructive transition-colors shrink-0" />
                <p className="text-sm font-medium text-heading group-hover:text-destructive transition-colors">
                  Sign out
                </p>
              </>
            )}
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
