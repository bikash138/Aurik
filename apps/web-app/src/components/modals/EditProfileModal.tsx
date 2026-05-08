"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Camera, CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useUpdateProfile } from "@/app/hooks/use-profile";
import { Profile } from "@/api/profile.api";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile;
}

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export function EditProfileModal({ open, onOpenChange, user }: EditProfileModalProps) {
  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [dobOpen, setDobOpen] = useState(false);
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "A";

  useEffect(() => {
    if (open) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() });
      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update profile";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-(--color-page-bg-deep) border-(--color-border) sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-heading text-base font-semibold">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Avatar selector */}
          <div className="flex flex-col items-center gap-3 px-6 py-5">
            <div className="relative">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={fullName}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-(--color-border)"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-(--color-brand) flex items-center justify-center font-bold text-3xl text-(--color-lime) ring-4 ring-(--color-border)">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-(--color-brand) flex items-center justify-center ring-2 ring-(--color-page-bg-deep)"
              >
                <Camera className="w-3.5 h-3.5 text-(--color-lime)" />
              </button>
            </div>
            <p className="text-xs text-body-color">Click the camera to change photo</p>
          </div>

          <div className="flex flex-col gap-4 px-6 pb-6">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-body-color">First Name</label>
                <input
                  className="input rounded-lg"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  disabled={isPending}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-body-color">Last Name</label>
                <input
                  className="input rounded-lg"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  disabled={isPending}
                />
              </div>
            </div>

            {/* DOB & Gender row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-body-color">Date of Birth</label>
                <Popover open={dobOpen} onOpenChange={setDobOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      disabled={isPending}
                      className="input rounded-lg flex items-center justify-between text-left disabled:opacity-50"
                    >
                      <span className={dob ? "text-(--color-text-heading)" : "text-(--color-text-muted)"}>
                        {dob ? format(dob, "dd MMM yyyy") : "Pick a date"}
                      </span>
                      <CalendarIcon className="w-3.5 h-3.5 text-(--color-text-muted) shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-(--color-page-bg-deep) border-(--color-border)"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={dob}
                      onSelect={(date) => { setDob(date); setDobOpen(false); }}
                      captionLayout="dropdown"
                      disabled={{ after: new Date() }}
                      defaultMonth={dob ?? new Date(2000, 0)}
                      startMonth={new Date(1920, 0)}
                      endMonth={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-body-color">Gender</label>
                <select
                  className="input rounded-lg"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={isPending}
                >
                  <option value="">Select</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-body-color">Country</label>
              <input
                className="input rounded-lg"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. India"
                disabled={isPending}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end mt-1">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="btn-ghost px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-(--color-brand) text-(--color-lime) hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save changes
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
