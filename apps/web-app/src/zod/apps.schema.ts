import { z } from "zod";

export const CreateAppSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  redirectUris: z
    .array(z.url("Invalid redirect URL"))
    .min(1, "At least one redirect URI is required"),
});

export const UpdateAppCoreSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  allowedCallbacks: z
    .array(z.url("Invalid redirect URL"))
    .min(1, "At least one redirect URI is required"),
  allowedLogoutCallbacks: z.array(z.url("Invalid logout URL")).optional(),
});

export const UpdateAppBrandingSchema = z.object({
  logoUrl: z.url("Invalid logo URL").optional().nullable(),
  clientUri: z.url("Invalid client URL").optional().nullable(),
  policyUri: z.url("Invalid policy URL").optional().nullable(),
  tosUri: z.url("Invalid terms of service URL").optional().nullable(),
});

export type CreateAppInput = z.infer<typeof CreateAppSchema>;
export type UpdateAppCoreInput = z.infer<typeof UpdateAppCoreSchema>;
export type UpdateAppBrandingInput = z.infer<typeof UpdateAppBrandingSchema>;
