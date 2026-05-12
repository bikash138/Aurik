"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Search,
  Key,
  Monitor,
  ShieldCheck,
  Activity,
  Mail,
  Pencil,
} from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { ProfilePageSkeleton } from "@/components/skeletons/profile-page-skeleton";
import { EditProfileModal } from "@/components/modals/edit-profile.modal";

const QUICK_LINKS = [
  { label: "My Password", icon: Key },
  { label: "Devices", icon: Monitor },
  { label: "Security", icon: ShieldCheck },
  { label: "My Activity", icon: Activity },
  { label: "Email", icon: Mail },
];

export default function ProfilePage() {
  const { data: user, isLoading, dataUpdatedAt } = useProfile();
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) return <ProfilePageSkeleton />;

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Aurik User"
    : "Aurik User";

  const avatarUrl = user?.profileImageUrl
    ? `${user.profileImageUrl}?v=${dataUpdatedAt}`
    : null;

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12 sm:py-16">
      <div className="flex flex-col items-center gap-5 w-full max-w-xl">
        {/* Avatar */}
        <div className="relative">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              width={112}
              height={112}
              priority
              sizes="(max-width: 640px) 96px, 112px"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-lg ring-4 ring-(--color-border)"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-(--color-brand) flex items-center justify-center font-bold text-4xl sm:text-5xl shadow-lg ring-4 ring-(--color-border) text-(--color-lime)">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={() => setEditOpen(true)}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-(--color-brand) flex items-center justify-center shadow-md ring-2 ring-(--color-page-bg)"
            aria-label="Edit profile"
          >
            <Pencil className="w-3.5 h-3.5 text-(--color-lime)" />
          </button>
        </div>

        {user && (
          <EditProfileModal
            open={editOpen}
            onOpenChange={setEditOpen}
            user={user}
          />
        )}

        {/* Name & email */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-heading">
            {fullName}
          </h2>
          <p className="text-muted mt-1 text-sm sm:text-base">{user?.email}</p>
        </div>

        {/* Search */}
        <div className="w-full relative mt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search Aurik Account"
            className="input w-full h-12 rounded-full"
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {QUICK_LINKS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="btn-ghost flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            >
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
