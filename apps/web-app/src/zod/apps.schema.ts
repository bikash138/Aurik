import { z } from "zod";
import { AppType } from "@aurik/database";

const optionalUrl = z.union([z.url("Invalid URL"), z.literal("")]);

export const AppTypeSchema = z.enum(AppType);

export const CreateAppSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(50, "Name is too long"),
    appType: AppTypeSchema.default(AppType.CONFIDENTIAL),
    pkceRequired: z.boolean().default(true),
    redirectUris: z
      .array(z.url("Invalid redirect URL"))
      .min(1, "At least one redirect URI is required"),
  })
  .superRefine((data, ctx) => {
    if (data.appType === AppType.PUBLIC && !data.pkceRequired) {
      ctx.addIssue({
        code: "custom",
        message: "PKCE is mandatory for Public applications",
        path: ["pkceRequired"],
      });
    }
  });

export const UpdateAppSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name is too long")
    .optional(),
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
