import { z } from "zod";

export const authorizationCodeSchema = z.object({
  grant_type: z.literal("authorization_code", {
    message: "grant_type must be authorization_code",
  }),

  code: z.string().min(1, "code is required"),

  redirect_uri: z.url("redirect_uri must be a valid URL"),

  client_id: z.string().min(1, "client_id is required"),

  client_secret: z.string().optional(),

  code_verifier: z
    .string()
    .min(43, "code_verifier must be at least 43 characters")
    .max(128, "code_verifier must be at most 128 characters")
    .optional(),
});

export type AuthorizationCodeInput = z.infer<typeof authorizationCodeSchema>;

export const refreshTokenSchema = z.object({
  grant_type: z.literal("refresh_token", {
    message: "grant_type must be refresh_token",
  }),

  refresh_token: z.string().min(1, "refresh_token is required"),

  client_id: z.string().min(1, "client_id is required"),
  client_secret: z.string().optional(),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
