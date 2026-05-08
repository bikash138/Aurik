import { z } from "zod";

export const CreateAppSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  redirectUris: z
    .array(z.url("Invalid redirect URL"))
    .min(1, "At least one redirect URI is required"),
});

export const UpdateAppSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long").optional(),
  allowedCallbacks: z
    .array(z.url("Invalid redirect URL"))
    .min(1, "At least one redirect URI is required")
    .optional(),
  allowedLogoutCallbacks: z.array(z.url("Invalid logout URL")).optional(),
  logoUrl: z.url("Invalid logo URL").optional(),
  clientUri: z.url("Invalid client URL").optional(),
  policyUri: z.url("Invalid policy URL").optional().nullable(),
  tosUri: z.url("Invalid terms of service URL").optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CreateAppInput = z.infer<typeof CreateAppSchema>;
export type UpdateAppInput = z.infer<typeof UpdateAppSchema>;
