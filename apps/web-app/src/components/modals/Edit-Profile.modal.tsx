"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "@/components/upload-image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useUpdateProfile, useProfile } from "@/hooks/use-profile";
import { Profile, ProfileAPI } from "@/api/profile.api";
import { Button } from "@/components/ui/button";
import { Gender } from "@aurik/database/enums";
import {
  updateProfileSchema,
  UpdateProfileFormValues,
} from "@/zod/profile.schema";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile;
}

const toGenderLabel = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function EditProfileModal({
  open,
  onOpenChange,
  user,
}: EditProfileModalProps) {
  const { dataUpdatedAt } = useProfile();
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const [newImageBlob, setNewImageBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isPending = isUpdatingProfile || isUploading;
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "A";

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      gender: user.gender ?? null,
      dateOfBirth: user.dateOfBirth
        ? format(new Date(user.dateOfBirth), "yyyy-MM-dd")
        : null,
      country: user.country ?? null,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        gender: user.gender ?? null,
        dateOfBirth: user.dateOfBirth
          ? format(new Date(user.dateOfBirth), "yyyy-MM-dd")
          : null,
        country: user.country ?? null,
      });
    }
  }, [open, user, reset]);

  const onSubmit = async (values: UpdateProfileFormValues) => {
    try {
      let finalValues = { ...values };

      if (newImageBlob) {
        setIsUploading(true);
        try {
          const { uploadUrl, publicUrl } = await ProfileAPI.getUploadUrl();
          await ProfileAPI.uploadToS3(uploadUrl, newImageBlob);
          finalValues.profileImageUrl = publicUrl;
        } catch (error) {
          console.error("Upload failed:", error);
          toast.error("Failed to upload image");
          return;
        } finally {
          setIsUploading(false);
        }
      }

      await updateProfile(finalValues);
      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message ||
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="py-5">
            <ImageUpload
              value={
                watch("profileImageUrl")
                  ? `${watch("profileImageUrl")}?v=${dataUpdatedAt}`
                  : null
              }
              onBlobChange={setNewImageBlob}
              fallback={
                <div className="w-20 h-20 rounded-full bg-(--color-brand) flex items-center justify-center font-bold text-3xl text-(--color-lime)">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              }
              imageClassName="w-20 h-20 ring-4 ring-(--color-border)"
              disabled={isPending}
              loading={isPending}
            />
          </div>

          <div className="flex flex-col gap-4 px-6 pb-6">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-body-color">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  className="input rounded-lg"
                  placeholder="First name"
                  disabled={isPending}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-body-color">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  className="input rounded-lg"
                  placeholder="Last name"
                  disabled={isPending}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* DOB & Gender row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-body-color">
                  Date of Birth
                </label>
                <Controller
                  control={control}
                  name="dateOfBirth"
                  render={({ field }) => {
                    const dateValue = field.value
                      ? new Date(field.value)
                      : undefined;
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            disabled={isPending}
                            className="input rounded-lg flex items-center justify-between text-left disabled:opacity-50"
                          >
                            <span
                              className={
                                field.value
                                  ? "text-(--color-text-heading)"
                                  : "text-(--color-text-muted)"
                              }
                            >
                              {dateValue
                                ? format(dateValue, "dd MMM yyyy")
                                : "Pick a date"}
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
                            selected={dateValue}
                            onSelect={(date) =>
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : null,
                              )
                            }
                            captionLayout="dropdown"
                            disabled={{ after: new Date() }}
                            defaultMonth={dateValue ?? new Date(2000, 0)}
                            startMonth={new Date(1920, 0)}
                            endMonth={new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-body-color">
                  Gender
                </label>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <select
                      className="input rounded-lg"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      disabled={isPending}
                    >
                      <option value="">Select</option>
                      {(Object.values(Gender) as string[]).map((g: string) => (
                        <option key={g} value={g}>
                          {toGenderLabel(g)}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-body-color">
                Country
              </label>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <input
                    className="input rounded-lg"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    placeholder="e.g. India"
                    disabled={isPending}
                  />
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end mt-1">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="btn-ghost px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isPending}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-(--color-brand) text-(--color-lime) hover:opacity-90 transition-opacity"
              >
                Save changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
