"use client";

import { useState, useEffect } from "react";
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
import type { GetMeResponse } from "@aurik/zod/auth";

export function ProfileDialog() {
  const router = useRouter();
  const [profile, setProfile] = useState<GetMeResponse | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    AuthAPI.getMe().then(setProfile).catch(console.error);
  }, []);

  const user = profile?.data;
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
        <button className="w-9 h-9 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-[var(--color-lime)] font-semibold text-sm hover:opacity-90 transition-opacity outline-none">
          {fullName.charAt(0).toUpperCase()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-[var(--color-page-bg-deep)] border-[var(--color-border)] p-0 overflow-hidden"
      >
        <div className="flex flex-col items-center gap-3 px-4 py-5">
          <div className="w-14 h-14 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-[var(--color-lime)] font-bold text-2xl">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div className="text-center">
            <p className="font-medium text-heading text-sm">{fullName}</p>
            <p className="text-xs text-muted mt-0.5">{user?.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-[var(--color-border)]" />

        <div className="p-1.5">
          <button
            onClick={() => router.push("/developer")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-[var(--color-lime-tint)] transition-colors text-left"
          >
            <Code2 className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
            <div>
              <p className="text-sm font-medium text-heading leading-none">
                Developer Panel
              </p>
              <p className="text-xs text-muted mt-0.5">API keys, logs & tools</p>
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
                <LogOut className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-destructive transition-colors shrink-0" />
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
