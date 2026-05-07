"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Key,
  Monitor,
  ShieldCheck,
  Activity,
  Mail,
  Loader2,
} from "lucide-react";
import { AuthAPI } from "@/api/auth.api";
import type { GetMeResponse } from "@aurik/zod/auth";

const QUICK_LINKS = [
  { label: "My Password", icon: Key },
  { label: "Devices", icon: Monitor },
  { label: "Security", icon: ShieldCheck },
  { label: "My Activity", icon: Activity },
  { label: "Email", icon: Mail },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<GetMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AuthAPI.getMe()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  const user = profile?.data;
  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Aurik User"
    : "Aurik User";

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12 sm:py-16">
      <div className="flex flex-col items-center gap-5 w-full max-w-xl">
        {/* Avatar */}
        <div>
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-lg ring-4 ring-[var(--color-border)]"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[var(--color-brand)] flex items-center justify-center font-bold text-4xl sm:text-5xl shadow-lg ring-4 ring-[var(--color-border)] text-[var(--color-lime)]">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & email */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-heading">
            {fullName}
          </h2>
          <p className="text-muted mt-1 text-sm sm:text-base">{user?.email}</p>
        </div>

        {/* Search */}
        <div className="w-full relative mt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search Aurik Account"
            className="input w-full h-12 pl-11 pr-4 rounded-full"
          />
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {QUICK_LINKS.map(({ label, icon: Icon }) => (
            <button key={label} className="btn-ghost flex items-center gap-2 px-4 py-2 rounded-full text-sm">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <p className="text-muted text-xs text-center max-w-sm mt-4 leading-relaxed">
          Only you can see your settings. You might also want to review your
          settings for connected apps and services. Aurik keeps your data
          private, safe, and secure.
        </p>
      </div>
    </main>
  );
}
