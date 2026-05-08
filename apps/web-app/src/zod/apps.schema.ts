import { z } from "zod";

const optionalUrl = z.union([z.string().url("Invalid URL"), z.literal("")]);

export const CreateAppSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  redirectUris: z
    .array(z.string().url("Invalid redirect URL"))
    .min(1, "At least one redirect URI is required"),
});

export const UpdateAppSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long").optional(),
  allowedCallbacks: z
    .array(optionalUrl)
    .min(1, "At least one redirect URI is required")
    .optional(),
  allowedLogoutCallbacks: z.array(optionalUrl).optional(),
  logoUrl: optionalUrl.optional(),
  clientUri: optionalUrl.optional(),
  policyUri: optionalUrl.optional().nullable(),
  tosUri: optionalUrl.optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CreateAppInput = z.infer<typeof CreateAppSchema>;
export type UpdateAppInput = z.infer<typeof UpdateAppSchema>;
