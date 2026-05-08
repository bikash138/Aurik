import { Gender } from "@aurik/database/enums";
import { z } from "zod";
import { NameSchema } from "@aurik/zod/auth";

const genderValues = Object.values(Gender) as [string, ...string[]];

export const updateProfileSchema = z.object({
  firstName: NameSchema("First Name"),
  lastName: NameSchema("Last Name"),
  profileImageUrl: z.url(),
  gender: z.enum(genderValues).nullable(),
  dateOfBirth: z.iso.date().nullable(),
  country: z.string().max(100).nullable(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
